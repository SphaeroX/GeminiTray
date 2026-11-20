//! Showing, hiding and toggling the main Gemini window.

/// What a toggle request should do with the main window.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ToggleAction {
    Show,
    Hide,
}

/// Decide what the global "show/hide" shortcut does.
///
/// Only a window that is visible, not minimized *and* focused is hidden; in every other
/// state the user wants to see it, so it is shown and focused.
pub fn toggle_action(visible: bool, focused: bool, minimized: bool) -> ToggleAction {
    if visible && focused && !minimized {
        ToggleAction::Hide
    } else {
        ToggleAction::Show
    }
}

mod runtime {
    use super::{toggle_action, ToggleAction};
    use tauri::{AppHandle, Manager, Webview, Window};

    /// The main window holds two webviews: our title bar and the Gemini page.
    pub const MAIN: &str = "main";
    pub const TITLEBAR: &str = "titlebar";
    pub const GEMINI: &str = "gemini";
    /// Height of the custom title bar in logical pixels.
    pub const TITLEBAR_HEIGHT: f64 = 40.0;

    pub fn main_window(app: &AppHandle) -> Option<Window> {
        app.get_window(MAIN)
    }

    /// The webview showing gemini.google.com.
    pub fn gemini(app: &AppHandle) -> Option<Webview> {
        app.get_webview(GEMINI)
    }

    /// Position both webviews after a resize.
    pub fn layout(app: &AppHandle) {
        let Some(w) = main_window(app) else { return };
        let (Ok(size), Ok(scale)) = (w.inner_size(), w.scale_factor()) else { return };
        let bar = (TITLEBAR_HEIGHT * scale).round() as u32;
        let rect = |y: u32, h: u32| tauri::Rect {
            position: tauri::PhysicalPosition::new(0, y as i32).into(),
            size: tauri::PhysicalSize::new(size.width, h).into(),
        };
        if let Some(t) = app.get_webview(TITLEBAR) {
            let _ = t.set_bounds(rect(0, bar.min(size.height)));
        }
        if let Some(g) = gemini(app) {
            let _ = g.set_bounds(rect(bar.min(size.height), size.height.saturating_sub(bar)));
        }
    }

    pub fn show_main(app: &AppHandle) {
        if let Some(w) = main_window(app) {
            let _ = w.show();
            if w.is_minimized().unwrap_or(false) {
                let _ = w.unminimize();
            }
            let _ = w.set_focus();
        }
        if let Some(g) = gemini(app) {
            let _ = g.set_focus();
        }
    }

    pub fn hide_main(app: &AppHandle) {
        if let Some(w) = main_window(app) {
            if w.is_visible().unwrap_or(false) {
                crate::windowstate::remember(app, &w);
            }
            let _ = w.hide();
        }
    }

    /// Apply window-related settings (always on top, opacity).
    pub fn apply_window_settings(app: &AppHandle) {
        let Some(w) = main_window(app) else { return };
        let s = app.state::<crate::state::AppState>().settings();
        let _ = w.set_always_on_top(s.window.always_on_top);
        crate::windowstate::apply_opacity(&w, s.window.opacity);
    }

    pub fn toggle_main(app: &AppHandle) {
        let Some(w) = main_window(app) else { return };
        let visible = w.is_visible().unwrap_or(false);
        let focused = w.is_focused().unwrap_or(false);
        let minimized = w.is_minimized().unwrap_or(false);
        match toggle_action(visible, focused, minimized) {
            ToggleAction::Show => show_main(app),
            ToggleAction::Hide => hide_main(app),
        }
    }
}

pub use runtime::*;
