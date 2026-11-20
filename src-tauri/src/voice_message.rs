//! Voice message to Gemini (Alt+V): recognised text → Gemini prompt (→ send).

use crate::bridge::{self, BridgeError};
use crate::notify::{self, Level};
use crate::state::AppState;
use crate::windowing;
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;

/// Build the message: optional prompt prefix, a blank line, then the spoken text.
/// Returns `None` when nothing was recognised.
pub fn compose(prefix: Option<&str>, text: &str) -> Option<String> {
    let text = text.trim();
    if text.is_empty() {
        return None;
    }
    match prefix.map(str::trim).filter(|p| !p.is_empty()) {
        Some(p) => Some(format!("{p}\n\n{text}")),
        None => Some(text.to_string()),
    }
}

/// What to do after a successful insert.
pub fn should_send(auto_send: bool) -> bool {
    auto_send
}

fn insert_and_send(app: &AppHandle, message: &str, auto_send: bool) -> Result<(), BridgeError> {
    if !bridge::wait_ready(app, Duration::from_secs(10)) {
        return Err(BridgeError::NotReady);
    }
    bridge::insert_text(app, message)?;
    if should_send(auto_send) {
        // Give Gemini a moment to enable the send button after the input event.
        std::thread::sleep(Duration::from_millis(150));
        bridge::send(app)?;
    }
    Ok(())
}

/// Called from the recognition thread (blocking is fine).
pub fn deliver(app: &AppHandle, text: &str) {
    let prefix = crate::prompts::take_active_content(app);
    let Some(message) = compose(prefix.as_deref(), text) else {
        notify::show(app, Level::Info, "voice.nothing", None);
        return;
    };
    let auto_send = app.state::<AppState>().settings().voice.auto_send;
    windowing::show_main(app);
    match insert_and_send(app, &message, auto_send) {
        Ok(()) => log::info!("voice message delivered (sent: {auto_send})"),
        Err(e) => {
            log::error!("voice message could not be inserted: {e}");
            // Never lose what the user said.
            let _ = app.clipboard().write_text(message);
            notify::show(app, Level::Error, "bridge.failed", Some(e.to_string()));
        }
    }
}
