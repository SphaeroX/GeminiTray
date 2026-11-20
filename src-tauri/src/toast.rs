//! Toast window (Task 03). Until then notifications are only logged by `notify`.

use crate::notify::Notification;
use tauri::AppHandle;

pub fn present(_app: &AppHandle, _n: Notification) {}
