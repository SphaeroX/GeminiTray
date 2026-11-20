//! Voice message to Gemini (Alt+V): draft + recognised text back into the prompt (→ send).

use crate::bridge;
use crate::notify::{self, Level};
use crate::state::AppState;
use crate::voice::VoiceState;
use tauri::{AppHandle, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;

/// Build the message: the earlier draft (e.g. a pre-filled prompt), a blank line, then the spoken
/// text. Returns `None` when nothing was recognised.
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

/// Called from the voice thread (blocking is fine).
pub fn deliver(app: &AppHandle, text: &str) {
    let draft = std::mem::take(&mut *app.state::<VoiceState>().draft.lock().unwrap());
    // A prompt that could not be pre-filled earlier is prepended now.
    let pending = crate::prompts::take_active_content(app);
    let prefix = match (pending, draft.trim().is_empty()) {
        (Some(p), true) => Some(p),
        (Some(p), false) => Some(format!("{p}\n\n{draft}")),
        (None, _) => Some(draft.clone()),
    };
    let Some(message) = compose(prefix.as_deref(), text) else {
        if !draft.trim().is_empty() {
            let _ = bridge::insert_text(app, &draft);
        }
        notify::show(app, Level::Info, "voice.nothing", None);
        return;
    };
    let auto_send = app.state::<AppState>().settings().voice.auto_send;
    let result = bridge::insert_text(app, &message).and_then(|_| {
        if should_send(auto_send) {
            std::thread::sleep(std::time::Duration::from_millis(150));
            bridge::send(app)
        } else {
            Ok(())
        }
    });
    match result {
        Ok(()) => log::info!("voice message delivered (sent: {auto_send})"),
        Err(e) => {
            log::error!("voice message could not be inserted: {e}");
            let _ = app.clipboard().write_text(message);
            notify::show(app, Level::Error, "bridge.failed", Some(e.to_string()));
        }
    }
}
