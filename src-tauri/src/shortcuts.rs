//! Global shortcut registration and dispatch.

use crate::actions;
use crate::settings::{validate_shortcuts, Shortcuts, ShortcutAction, ShortcutProblem};
use crate::state::AppState;
use std::str::FromStr;
use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

/// Called by the global-shortcut plugin for every key event.
pub fn on_event(app: &AppHandle, shortcut: &Shortcut, state: ShortcutState) {
    if state != ShortcutState::Pressed {
        return;
    }
    let action = app.state::<AppState>().shortcut_map.lock().unwrap().get(&shortcut.id()).copied();
    if let Some(action) = action {
        actions::run(app, action);
    }
}

fn unregister_all(app: &AppHandle) {
    let _ = app.global_shortcut().unregister_all();
    app.state::<AppState>().shortcut_map.lock().unwrap().clear();
}

/// Register all assigned shortcuts. Returns the actions that Windows refused.
fn register(app: &AppHandle, shortcuts: &Shortcuts) -> Vec<ShortcutAction> {
    let state = app.state::<AppState>();
    let mut failed = Vec::new();
    for (action, accel) in shortcuts.assigned() {
        let Ok(sc) = Shortcut::from_str(&accel) else {
            failed.push(action);
            continue;
        };
        match app.global_shortcut().register(sc) {
            Ok(()) => {
                state.shortcut_map.lock().unwrap().insert(sc.id(), action);
            }
            Err(e) => {
                log::warn!("Shortcut {accel} for {action:?} not registered: {e}");
                failed.push(action);
            }
        }
    }
    failed
}

/// Register the shortcuts from the current settings (app start, resume after recording).
pub fn register_current(app: &AppHandle) -> Vec<ShortcutAction> {
    unregister_all(app);
    let shortcuts = app.state::<AppState>().settings().shortcuts;
    let failed = register(app, &shortcuts);
    *app.state::<AppState>().shortcut_failures.lock().unwrap() = failed.clone();
    failed
}

/// Try a new set of shortcuts. On any problem the previous set is restored and the problems
/// are returned; nothing is changed.
pub fn try_apply(app: &AppHandle, new: &Shortcuts) -> Result<(), Vec<ShortcutProblem>> {
    let problems = validate_shortcuts(new);
    if !problems.is_empty() {
        return Err(problems);
    }
    unregister_all(app);
    let previously_failed = app.state::<AppState>().shortcut_failures.lock().unwrap().clone();
    let failed = register(app, new);
    // A shortcut that already failed before (and is unchanged) does not block saving other changes.
    let old = app.state::<AppState>().settings().shortcuts;
    let blocking: Vec<ShortcutAction> = failed
        .iter()
        .copied()
        .filter(|a| !(previously_failed.contains(a) && old.get(*a) == new.get(*a)))
        .collect();
    if blocking.is_empty() {
        *app.state::<AppState>().shortcut_failures.lock().unwrap() = failed;
        Ok(())
    } else {
        unregister_all(app);
        register(app, &old);
        Err(blocking.into_iter().map(|action| ShortcutProblem::Taken { action }).collect())
    }
}

pub fn pause(app: &AppHandle) {
    unregister_all(app);
}

pub fn resume(app: &AppHandle) {
    register_current(app);
}
