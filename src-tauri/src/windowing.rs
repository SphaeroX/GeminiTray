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
    use tauri::{AppHandle, Manager, WebviewWindow};

    pub const MAIN: &str = "main";

    pub fn main_window(app: &AppHandle) -> Option<WebviewWindow> {
        app.get_webview_window(MAIN)
    }

    pub fn show_main(app: &AppHandle) {
        if let Some(w) = main_window(app) {
            let _ = w.unminimize();
            let _ = w.show();
            let _ = w.set_focus();
        }
    }

    pub fn hide_main(app: &AppHandle) {
        if let Some(w) = main_window(app) {
            let _ = w.hide();
        }
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
