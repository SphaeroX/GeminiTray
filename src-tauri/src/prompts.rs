//! Saved prompts and the "active prompt" for the next message (Task 09).

use tauri::AppHandle;

/// Name of the currently active prompt, if any.
pub fn active_name(_app: &AppHandle) -> Option<String> {
    None
}
