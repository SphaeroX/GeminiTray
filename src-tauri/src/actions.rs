//! What each global shortcut does.

use crate::notify::{self, Level};
use crate::settings::ShortcutAction;
use crate::windowing;
use tauri::AppHandle;

pub fn run(app: &AppHandle, action: ShortcutAction) {
    log::info!("shortcut action {action:?}");
    match action {
        ShortcutAction::Toggle => windowing::toggle_main(app),
        _ => notify::show(app, Level::Info, "not_available", None),
    }
}
