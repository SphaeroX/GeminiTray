//! Screenshot & Ask: capture all monitors, let the user select an area, hand it to Gemini.

pub mod geometry;
mod paste;

use crate::bridge::{self, BridgeError};
use crate::notify::{self, Level};
use crate::windowing;
use geometry::{to_pixels, CssRect};
use image::RgbaImage;
use std::sync::{Arc, Mutex};
use std::thread::JoinHandle;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_clipboard_manager::ClipboardExt;

struct Capture {
    image: Arc<RgbaImage>,
    /// Scale factor of the monitor (CSS px → physical px).
    scale: f64,
    /// JPEG of the frozen screen for the overlay, encoded in the background right after capture.
    preview: Option<JoinHandle<Result<Vec<u8>, String>>>,
}

#[derive(Default)]
pub struct ScreenshotState {
    captures: Mutex<Vec<Capture>>,
    /// Overlay that gets the keyboard focus (the one under the mouse cursor).
    focus: Mutex<usize>,
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

fn encode_preview(img: &RgbaImage) -> Result<Vec<u8>, String> {
    use image::buffer::ConvertBuffer;
    let rgb: image::RgbImage = img.convert();
    let mut buf = Vec::with_capacity(rgb.as_raw().len() / 8);
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, 85)
        .encode_image(&rgb)
        .map_err(|e| e.to_string())?;
    Ok(buf)
}

/// Alt+Shift+S: capture every monitor first (so the overlay is not in the picture), then open one
/// selection overlay per monitor. The overlays are shown by the page itself once the frozen screen
/// is painted (`overlay_shown`), so there is no black flash.
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
        let image = Arc::new(image);
        let for_preview = Arc::clone(&image);
        let preview = std::thread::spawn(move || encode_preview(&for_preview));
        captures.push(Capture { image, scale, preview: Some(preview) });
    }
    if captures.is_empty() {
        notify::show(app, Level::Error, "screenshot.failed", Some("no monitor could be captured".into()));
        return;
    }
    let state = app.state::<ScreenshotState>();
    *state.captures.lock().unwrap() = captures;

    let cursor = app.cursor_position().ok();
    let mut focus = 0;
    let count = bounds.len();
    for (i, (x, y, w, h)) in bounds.into_iter().enumerate() {
        if let Some(c) = cursor {
            if c.x >= x as f64 && c.x < (x + w as i32) as f64 && c.y >= y as f64 && c.y < (y + h as i32) as f64 {
                focus = i;
            }
        }
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
            }
            Err(e) => log::error!("overlay {i} failed: {e}"),
        }
    }
    *state.focus.lock().unwrap() = focus;

    // Safety net: if a page never reports back, show its overlay anyway so the user is not stuck.
    let app = app.clone();
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(1500));
        if app.state::<ScreenshotState>().captures.lock().unwrap().is_empty() {
            return;
        }
        for i in 0..count {
            show_overlay(&app, i);
        }
    });
}

fn show_overlay(app: &AppHandle, index: usize) {
    let Some(win) = app.get_webview_window(&label(index)) else { return };
    if win.is_visible().unwrap_or(false) {
        return;
    }
    let _ = win.show();
    if *app.state::<ScreenshotState>().focus.lock().unwrap() == index {
        let _ = win.set_focus();
    }
}

/// The frozen screen for overlay `index` as raw JPEG bytes (binary IPC, no base64).
#[tauri::command]
pub async fn overlay_image(app: AppHandle, index: usize) -> Result<tauri::ipc::Response, String> {
    let handle = {
        let state = app.state::<ScreenshotState>();
        let mut caps = state.captures.lock().unwrap();
        caps.get_mut(index).ok_or("no capture")?.preview.take().ok_or("preview already taken")?
    };
    let jpeg = tauri::async_runtime::spawn_blocking(move || handle.join())
        .await
        .map_err(|e| e.to_string())?
        .map_err(|_| "preview encoder panicked".to_string())??;
    Ok(tauri::ipc::Response::new(jpeg))
}

/// The overlay page has painted the frozen screen – make its window visible.
#[tauri::command]
pub async fn overlay_shown(app: AppHandle, index: usize) {
    show_overlay(&app, index);
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
                .map(|p| image::imageops::crop_imm(c.image.as_ref(), p.x, p.y, p.width, p.height).to_image())
        })
    };
    close_overlays(&app);
    app.state::<ScreenshotState>().captures.lock().unwrap().clear();
    let Some(img) = cropped else { return };
    std::thread::spawn(move || deliver(&app, img));
}

fn encode_png(img: &RgbaImage) -> Result<Vec<u8>, String> {
    use image::codecs::png::{CompressionType, FilterType, PngEncoder};
    let mut out = Vec::new();
    img.write_with_encoder(PngEncoder::new_with_quality(&mut out, CompressionType::Fast, FilterType::Adaptive))
        .map_err(|e| e.to_string())?;
    Ok(out)
}

fn to_clipboard(app: &AppHandle, img: &RgbaImage) {
    let (w, h) = img.dimensions();
    let image = tauri::image::Image::new_owned(img.as_raw().clone(), w, h);
    let _ = app.clipboard().write_image(&image);
}

/// Put the image into Gemini's prompt: drop/paste via the bridge, and – like Gemini Tray 1.x – a
/// real Ctrl+V into the Gemini window as last resort.
fn attach(app: &AppHandle, img: &RgbaImage) -> Result<(), BridgeError> {
    let png = encode_png(img).map_err(BridgeError::Script)?;
    if !bridge::wait_ready(app, Duration::from_secs(10)) {
        return Err(BridgeError::NotReady);
    }
    if let Some(prefix) = crate::prompts::take_active_content(app) {
        bridge::insert_text(app, &prefix)?;
    }
    match bridge::insert_image(app, &png) {
        Err(BridgeError::NotAttached | BridgeError::Timeout) => {}
        other => return other,
    }
    log::warn!("screenshot drop/paste did not attach, falling back to Ctrl+V");
    let before = bridge::attachment_count(app).unwrap_or(0);
    to_clipboard(app, img);
    windowing::show_main(app);
    if !paste::ctrl_v_into(app) {
        return Err(BridgeError::NotAttached);
    }
    let started = Instant::now();
    while started.elapsed() < Duration::from_secs(4) {
        if bridge::attachment_count(app).unwrap_or(0) > before {
            return Ok(());
        }
        std::thread::sleep(Duration::from_millis(50));
    }
    Err(BridgeError::NotAttached)
}

fn deliver(app: &AppHandle, img: RgbaImage) {
    windowing::show_main(app);
    if let Err(e) = attach(app, &img) {
        log::error!("screenshot could not be attached: {e}");
        to_clipboard(app, &img);
        notify::show(app, Level::Warning, "screenshot.clipboard", Some(e.to_string()));
    }
}
