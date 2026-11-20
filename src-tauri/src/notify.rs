//! User-facing messages. Every message is identified by an i18n key (see `src/locales/*.json`,
//! section `toast`); the toast window (Task 03) renders it. Until a toast window exists the
//! message is only logged.

use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Level {
    Info,
    Success,
    Warning,
    Error,
}

#[derive(Debug, Clone, Serialize)]
pub struct Notification {
    pub level: Level,
    /// i18n key below `toast.` – e.g. `login.success`.
    pub key: String,
    /// Optional detail text (already human readable), e.g. an error message or a text preview.
    pub detail: Option<String>,
}

pub fn show(app: &AppHandle, level: Level, key: &str, detail: Option<String>) {
    let n = Notification { level, key: key.to_string(), detail };
    log::info!("notify {:?} {} {:?}", n.level, n.key, n.detail);
    crate::toast::present(app, n.clone());
    let _ = app.emit("notification", n);
}
