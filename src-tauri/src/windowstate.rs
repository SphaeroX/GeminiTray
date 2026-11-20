//! Remember position and size of the Gemini window, and apply opacity.

use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Bounds {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

/// A monitor work area in physical pixels.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Area {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

/// Minimum visible part (physical px) for a saved position to count as reachable.
const MIN_VISIBLE_W: i64 = 120;
const MIN_VISIBLE_H: i64 = 60;

fn overlap(a0: i64, a1: i64, b0: i64, b1: i64) -> i64 {
    (a1.min(b1) - a0.max(b0)).max(0)
}

/// Saved bounds are restored only if enough of the window (title bar area) is on some monitor;
/// otherwise `None` → the window is centred. Too small sizes are rejected too.
pub fn restorable(saved: Bounds, areas: &[Area]) -> Option<Bounds> {
    if saved.width < 200 || saved.height < 200 {
        return None;
    }
    let (x0, y0) = (saved.x as i64, saved.y as i64);
    let (x1, y1) = (x0 + saved.width as i64, y0 + saved.height as i64);
    let visible = areas.iter().any(|a| {
        let (ax0, ay0) = (a.x as i64, a.y as i64);
        let (ax1, ay1) = (ax0 + a.width as i64, ay0 + a.height as i64);
        // The top strip (title bar) must be visible, otherwise the window cannot be dragged back.
        let title_bottom = (y0 + 40).min(y1);
        overlap(x0, x1, ax0, ax1) >= MIN_VISIBLE_W && overlap(y0, title_bottom, ay0, ay1) > 0
            && overlap(y0, y1, ay0, ay1) >= MIN_VISIBLE_H
    });
    visible.then_some(saved)
}

/// Opacity setting (0.5–1.0) → alpha byte for SetLayeredWindowAttributes.
pub fn alpha(opacity: f64) -> u8 {
    let o = if opacity.is_finite() { opacity.clamp(0.5, 1.0) } else { 1.0 };
    (o * 255.0).round() as u8
}

pub fn load(path: &Path) -> Option<Bounds> {
    serde_json::from_str(&std::fs::read_to_string(path).ok()?).ok()
}

pub fn save(path: &Path, b: Bounds) {
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    if let Ok(json) = serde_json::to_string(&b) {
        let _ = std::fs::write(path, json);
    }
}

#[cfg(windows)]
mod win {
    use std::ffi::c_void;

    const GWL_EXSTYLE: i32 = -20;
    const WS_EX_LAYERED: isize = 0x0008_0000;
    const LWA_ALPHA: u32 = 0x2;

    #[link(name = "user32")]
    unsafe extern "system" {
        fn GetWindowLongPtrW(hwnd: *mut c_void, index: i32) -> isize;
        fn SetWindowLongPtrW(hwnd: *mut c_void, index: i32, value: isize) -> isize;
        fn SetLayeredWindowAttributes(hwnd: *mut c_void, key: u32, alpha: u8, flags: u32) -> i32;
    }

    /// Make the whole window (including the WebView2 content) translucent.
    pub fn set_alpha(hwnd: *mut c_void, alpha: u8) -> bool {
        unsafe {
            let style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            if alpha == 255 {
                if style & WS_EX_LAYERED != 0 {
                    SetLayeredWindowAttributes(hwnd, 0, 255, LWA_ALPHA);
                    SetWindowLongPtrW(hwnd, GWL_EXSTYLE, style & !WS_EX_LAYERED);
                }
                return true;
            }
            if style & WS_EX_LAYERED == 0 {
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, style | WS_EX_LAYERED);
            }
            SetLayeredWindowAttributes(hwnd, 0, alpha, LWA_ALPHA) != 0
        }
    }
}

mod runtime {
    use super::*;
    use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, Window};

    fn path(app: &AppHandle) -> Option<std::path::PathBuf> {
        app.path().app_config_dir().ok().map(|d| d.join("window-state.json"))
    }

    pub fn remember(app: &AppHandle, w: &Window) {
        if w.is_minimized().unwrap_or(false) || w.is_maximized().unwrap_or(false) {
            return;
        }
        let (Ok(pos), Ok(size), Some(p)) = (w.outer_position(), w.outer_size(), path(app)) else { return };
        save(&p, Bounds { x: pos.x, y: pos.y, width: size.width, height: size.height });
    }

    pub fn restore(app: &AppHandle, w: &Window) {
        let Some(saved) = path(app).and_then(|p| load(&p)) else { return };
        let areas: Vec<Area> = w
            .available_monitors()
            .unwrap_or_default()
            .iter()
            .map(|m| {
                let a = m.work_area();
                Area { x: a.position.x, y: a.position.y, width: a.size.width, height: a.size.height }
            })
            .collect();
        match restorable(saved, &areas) {
            Some(b) => {
                let _ = w.set_size(PhysicalSize::new(b.width, b.height));
                let _ = w.set_position(PhysicalPosition::new(b.x, b.y));
            }
            None => {
                let _ = w.center();
            }
        }
    }

    pub fn apply_opacity(w: &Window, opacity: f64) {
        #[cfg(windows)]
        if let Ok(hwnd) = w.hwnd() {
            if !super::win::set_alpha(hwnd.0, alpha(opacity)) {
                log::warn!("could not set window opacity");
            }
        }
    }
}

pub use runtime::{apply_opacity, remember, restore};
