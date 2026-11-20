//! Toast window: small stack of messages in the bottom-right corner (design artboard "Toasts").
//!
//! Messages that arrive before the page is loaded are buffered and fetched by the page
//! (`toast_ready` command).

use crate::appwindows;
use crate::notify::Notification;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};

pub const LABEL: &str = "toast";

#[derive(Default)]
pub struct ToastState {
    pub ready: Mutex<bool>,
    pub pending: Mutex<Vec<Notification>>,
}

pub fn create(app: &AppHandle) -> tauri::Result<()> {
    appwindows::overlay_window(app, LABEL, "toast.html", 400.0, 420.0)?;
    Ok(())
}

pub fn present(app: &AppHandle, n: Notification) {
    let Some(state) = app.try_state::<ToastState>() else { return };
    let Some(w) = app.get_webview_window(LABEL) else { return };
    if !*state.ready.lock().unwrap() {
        state.pending.lock().unwrap().push(n);
    } else {
        let _ = w.emit_to(LABEL, "toast", n);
    }
    appwindows::place(&w, appwindows::bottom_right);
    let _ = w.set_ignore_cursor_events(false);
    let _ = w.show();
}

#[tauri::command]
pub fn toast_ready(app: AppHandle) -> Vec<Notification> {
    let state = app.state::<ToastState>();
    *state.ready.lock().unwrap() = true;
    std::mem::take(&mut *state.pending.lock().unwrap())
}

/// Called by the page when no toast is left.
#[tauri::command]
pub fn toast_idle(app: AppHandle) {
    if let Some(w) = app.get_webview_window(LABEL) {
        let _ = w.hide();
    }
}
