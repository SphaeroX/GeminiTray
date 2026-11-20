//! Tauri commands for the app's own windows.

use crate::settings::{self, Settings, ShortcutProblem};
use crate::state::AppState;
use crate::{appwindows, login, shortcuts, tray};
use serde::Serialize;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_autostart::ManagerExt;

#[derive(Debug, Serialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum SaveError {
    Shortcuts { problems: Vec<ShortcutProblem> },
    Io { message: String },
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsView {
    pub settings: Settings,
    /// Actions whose shortcut is currently not registered (taken by another app).
    pub shortcut_failures: Vec<crate::settings::ShortcutAction>,
    pub language: String,
    pub version: String,
}

fn view(app: &AppHandle, state: &AppState) -> SettingsView {
    SettingsView {
        settings: state.settings(),
        shortcut_failures: state.shortcut_failures.lock().unwrap().clone(),
        language: state.language().to_string(),
        version: app.package_info().version.to_string(),
    }
}

#[tauri::command]
pub fn get_settings(app: AppHandle, state: State<'_, AppState>) -> SettingsView {
    view(&app, &state)
}

#[tauri::command]
pub fn update_settings(
    app: AppHandle,
    state: State<'_, AppState>,
    settings: Settings,
) -> Result<SettingsView, SaveError> {
    let new = settings.normalized();
    let old = state.settings();
    if new.shortcuts != old.shortcuts {
        shortcuts::try_apply(&app, &new.shortcuts).map_err(|problems| SaveError::Shortcuts { problems })?;
    }
    settings::save(&state.settings_path, &new).map_err(|e| SaveError::Io { message: e.to_string() })?;
    *state.settings.lock().unwrap() = new.clone();

    if new.autostart != old.autostart {
        let launcher = app.autolaunch();
        let r = if new.autostart { launcher.enable() } else { launcher.disable() };
        if let Err(e) = r {
            log::error!("autostart change failed: {e}");
        }
    }
    if new.language != old.language {
        tray::refresh_labels(&app);
    }
    crate::windowing::apply_window_settings(&app);
    let v = view(&app, &state);
    let _ = app.emit("settings-changed", &v);
    Ok(v)
}

#[tauri::command]
pub fn pause_shortcuts(app: AppHandle) {
    shortcuts::pause(&app);
}

#[tauri::command]
pub fn resume_shortcuts(app: AppHandle) {
    shortcuts::resume(&app);
}

// Commands that create windows must be async: on Windows, building a window inside a synchronous
// command blocks the main thread and the new window hangs.
#[tauri::command]
pub async fn open_settings(app: AppHandle, category: Option<String>) {
    appwindows::open_settings(&app, category.as_deref());
}

#[tauri::command]
pub fn login_with_browser(app: AppHandle) {
    login::start_browser_login(&app);
}

#[tauri::command]
pub fn reset_session(app: AppHandle) {
    login::reset_session(&app);
}

#[tauri::command]
pub fn show_gemini(app: AppHandle) {
    crate::windowing::show_main(&app);
}

#[tauri::command]
pub fn close_window(window: tauri::WebviewWindow) {
    if window.label() == appwindows::SETTINGS {
        let _ = window.close();
    } else {
        let _ = window.hide();
    }
}

#[tauri::command]
pub fn autostart_enabled(app: AppHandle) -> bool {
    app.autolaunch().is_enabled().unwrap_or(false)
}

/// Buttons of the custom title bar in the Gemini window.
#[tauri::command]
pub async fn titlebar_action(app: AppHandle, action: String) {
    use crate::settings::ShortcutAction;
    use tauri::Manager;
    let state = app.state::<AppState>();
    let Some(w) = crate::windowing::main_window(&app) else { return };
    match action.as_str() {
        "newChat" => crate::actions::run(&app, ShortcutAction::NewChat),
        "prompts" => crate::actions::run(&app, ShortcutAction::Prompts),
        "settings" => appwindows::open_settings(&app, None),
        "minimize" => {
            let _ = w.minimize();
        }
        "maximize" => {
            if w.is_maximized().unwrap_or(false) {
                let _ = w.unmaximize();
            } else {
                let _ = w.maximize();
            }
        }
        "close" => crate::windowing::hide_main(&app),
        "pin" => {
            let mut s = state.settings();
            s.window.always_on_top = !s.window.always_on_top;
            let _ = update_settings(app.clone(), state, s);
        }
        _ => {}
    }
}
