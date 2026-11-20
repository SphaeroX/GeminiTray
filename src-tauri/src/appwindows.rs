//! App-owned windows (local Vue pages): settings, toast, indicator, prompt menu, overlays.

use tauri::{AppHandle, Manager, PhysicalPosition, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

pub const SETTINGS: &str = "settings";

/// Open the settings window, optionally on a given category (e.g. "shortcuts").
pub fn open_settings(app: &AppHandle, category: Option<&str>) {
    if let Some(w) = app.get_webview_window(SETTINGS) {
        let _ = w.unminimize();
        let _ = w.show();
        let _ = w.set_focus();
        if let Some(c) = category {
            let _ = tauri::Emitter::emit_to(&w, SETTINGS, "settings-navigate", c);
        }
        return;
    }
    let url = match category {
        Some(c) => format!("settings.html#{c}"),
        None => "settings.html".into(),
    };
    let result = WebviewWindowBuilder::new(app, SETTINGS, WebviewUrl::App(url.into()))
        .title("Gemini Tray")
        .inner_size(880.0, 600.0)
        .min_inner_size(640.0, 420.0)
        .decorations(false)
        .center()
        .build();
    if let Err(e) = result {
        log::error!("Could not open settings: {e}");
    }
}

/// Bottom-right position for a window of `size` (physical px) inside the work area of the
/// primary monitor, with `margin` physical px distance to the edges.
pub fn bottom_right(
    work_pos: (i32, i32),
    work_size: (u32, u32),
    size: (u32, u32),
    margin: i32,
) -> (i32, i32) {
    (
        work_pos.0 + work_size.0 as i32 - size.0 as i32 - margin,
        work_pos.1 + work_size.1 as i32 - size.1 as i32 - margin,
    )
}

/// Bottom-centre position (used by the recording indicator).
pub fn bottom_center(
    work_pos: (i32, i32),
    work_size: (u32, u32),
    size: (u32, u32),
    margin: i32,
) -> (i32, i32) {
    (
        work_pos.0 + (work_size.0 as i32 - size.0 as i32) / 2,
        work_pos.1 + work_size.1 as i32 - size.1 as i32 - margin,
    )
}

/// Build a small, borderless, transparent, non-focusable overlay window (hidden).
pub fn overlay_window(
    app: &AppHandle,
    label: &str,
    page: &str,
    width: f64,
    height: f64,
) -> tauri::Result<WebviewWindow> {
    WebviewWindowBuilder::new(app, label, WebviewUrl::App(page.into()))
        .title("Gemini Tray")
        .inner_size(width, height)
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .resizable(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .focusable(false)
        .focused(false)
        .visible(false)
        .build()
}

/// Move `w` to a corner of the monitor under the mouse (fallback: primary monitor).
pub fn place(w: &WebviewWindow, anchor: fn((i32, i32), (u32, u32), (u32, u32), i32) -> (i32, i32)) {
    let monitor = w
        .cursor_position()
        .ok()
        .and_then(|p| w.monitor_from_point(p.x, p.y).ok().flatten())
        .or_else(|| w.primary_monitor().ok().flatten());
    let (Some(m), Ok(size)) = (monitor, w.outer_size()) else { return };
    let area = m.work_area();
    let margin = (16.0 * m.scale_factor()) as i32;
    let (x, y) = anchor(
        (area.position.x, area.position.y),
        (area.size.width, area.size.height),
        (size.width, size.height),
        margin,
    );
    let _ = w.set_position(PhysicalPosition::new(x, y));
}
