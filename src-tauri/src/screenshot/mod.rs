//! Screenshot & Ask: capture all monitors, let the user select an area, hand it to Gemini.

pub mod geometry;

use crate::bridge;
use crate::notify::{self, Level};
use crate::windowing;
use geometry::{to_pixels, CssRect};
use image::RgbaImage;
use serde::Serialize;
use std::io::Cursor;
use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_clipboard_manager::ClipboardExt;

struct Capture {
    image: RgbaImage,
    /// Scale factor of the monitor (CSS px → physical px).
    scale: f64,
}

#[derive(Default)]
pub struct ScreenshotState {
    captures: Mutex<Vec<Capture>>,
}

fn label(i: usize) -> String {
    format!("overlay-{i}")
}

fn close_overlays(app: &AppHandle) {
    let n = app.state::<ScreenshotState>().captures.lock().unwrap().len();
    for i in 0..n.max(8) {
        if let Some(w) = app.get_webview_window(&label(i)) {
            let _ = w.destroy();
        }
    }
}

/// Alt+Shift+S: capture every monitor first (so the overlay is not in the picture), then open one
/// selection overlay per monitor.
pub fn start(app: &AppHandle) {
    if !app.state::<ScreenshotState>().captures.lock().unwrap().is_empty() {
        return; // already selecting
    }
    let monitors = match xcap::Monitor::all() {
        Ok(m) => m,
        Err(e) => {
            notify::show(app, Level::Error, "screenshot.failed", Some(e.to_string()));
            return;
        }
    };
    // Hide our own windows so they are not captured.
    windowing::hide_main(app);
    let mut captures = Vec::new();
    let mut bounds = Vec::new();
    for m in &monitors {
        let (Ok(x), Ok(y), Ok(w), Ok(h)) = (m.x(), m.y(), m.width(), m.height()) else { continue };
        let Ok(image) = m.capture_image() else { continue };
        let scale = m.scale_factor().unwrap_or(1.0) as f64;
        bounds.push(geometry::overlay_bounds(x, y, image.width().max(w), image.height().max(h)));
        captures.push(Capture { image, scale });
    }
    if captures.is_empty() {
        notify::show(app, Level::Error, "screenshot.failed", Some("no monitor could be captured".into()));
        return;
    }
    *app.state::<ScreenshotState>().captures.lock().unwrap() = captures;

    let cursor = app.cursor_position().ok();
    for (i, (x, y, w, h)) in bounds.into_iter().enumerate() {
        let built = WebviewWindowBuilder::new(app, label(i), WebviewUrl::App(format!("overlay.html?m={i}").into()))
            .title("Gemini Tray")
            .decorations(false)
            .resizable(false)
            .shadow(false)
            .always_on_top(true)
            .skip_taskbar(true)
            .visible(false)
            .build();
        match built {
            Ok(win) => {
                let _ = win.set_position(PhysicalPosition::new(x, y));
                let _ = win.set_size(PhysicalSize::new(w, h));
                let _ = win.show();
                let under_cursor = cursor
                    .map(|c| c.x >= x as f64 && c.x < (x + w as i32) as f64 && c.y >= y as f64 && c.y < (y + h as i32) as f64)
                    .unwrap_or(i == 0);
                if under_cursor {
                    let _ = win.set_focus();
                }
            }
            Err(e) => log::error!("overlay {i} failed: {e}"),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OverlayImage {
    /// JPEG data URL of the frozen screen (display only).
    pub data_url: String,
    pub width: u32,
    pub height: u32,
}

/// The frozen screen for overlay `index`.
#[tauri::command]
pub async fn overlay_image(app: AppHandle, index: usize) -> Result<OverlayImage, String> {
    let (rgb, width, height) = {
        let state = app.state::<ScreenshotState>();
        let caps = state.captures.lock().unwrap();
        let c = caps.get(index).ok_or("no capture")?;
        (image::DynamicImage::ImageRgba8(c.image.clone()).to_rgb8(), c.image.width(), c.image.height())
    };
    let mut buf = Vec::new();
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, 88)
        .encode_image(&rgb)
        .map_err(|e| e.to_string())?;
    use base64::Engine;
    Ok(OverlayImage {
        data_url: format!("data:image/jpeg;base64,{}", base64::engine::general_purpose::STANDARD.encode(&buf)),
        width,
        height,
    })
}

#[tauri::command]
pub async fn overlay_cancel(app: AppHandle) {
    close_overlays(&app);
    app.state::<ScreenshotState>().captures.lock().unwrap().clear();
}

/// Selection confirmed in overlay `index` (CSS px of that overlay).
#[tauri::command]
pub async fn overlay_select(app: AppHandle, index: usize, rect: CssRect) {
    let cropped = {
        let state = app.state::<ScreenshotState>();
        let caps = state.captures.lock().unwrap();
        caps.get(index).and_then(|c| {
            to_pixels(rect, c.scale, c.image.width(), c.image.height())
                .map(|p| image::imageops::crop_imm(&c.image, p.x, p.y, p.width, p.height).to_image())
        })
    };
    close_overlays(&app);
    app.state::<ScreenshotState>().captures.lock().unwrap().clear();
    let Some(img) = cropped else { return };
    std::thread::spawn(move || deliver(&app, img));
}

fn encode_png(img: &RgbaImage) -> Result<Vec<u8>, String> {
    let mut out = Cursor::new(Vec::new());
    img.write_to(&mut out, image::ImageFormat::Png).map_err(|e| e.to_string())?;
    Ok(out.into_inner())
}

fn deliver(app: &AppHandle, img: RgbaImage) {
    windowing::show_main(app);
    let result = encode_png(&img).map_err(bridge::BridgeError::Script).and_then(|png| {
        if !bridge::wait_ready(app, Duration::from_secs(10)) {
            return Err(bridge::BridgeError::NotReady);
        }
        if let Some(prefix) = crate::prompts::take_active_content(app) {
            bridge::insert_text(app, &prefix)?;
        }
        bridge::insert_image(app, &png)
    });
    if let Err(e) = result {
        log::error!("screenshot could not be attached: {e}");
        let (w, h) = img.dimensions();
        let image = tauri::image::Image::new_owned(img.into_raw(), w, h);
        let _ = app.clipboard().write_image(&image);
        notify::show(app, Level::Warning, "screenshot.clipboard", Some(e.to_string()));
    }
}
