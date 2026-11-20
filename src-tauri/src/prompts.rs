//! Saved prompts and the "active prompt" for the next message (Task 09).

use tauri::AppHandle;

/// Name of the currently active prompt, if any.
pub fn active_name(_app: &AppHandle) -> Option<String> {
    None
}

/// Content of the active prompt; using it ends the selection (Task 09).
pub fn take_active_content(_app: &AppHandle) -> Option<String> {
    None
}
