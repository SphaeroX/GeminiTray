//! Voice message to Gemini (Task 07).

use crate::notify::{self, Level};
use tauri::AppHandle;

pub fn deliver(app: &AppHandle, _text: &str) {
    notify::show(app, Level::Info, "not_available", None);
}
