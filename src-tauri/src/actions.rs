//! What each global shortcut does.

use crate::notify::{self, Level};
use crate::settings::ShortcutAction;
use crate::{bridge, windowing, GEMINI_URL};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tauri::AppHandle;

pub fn run(app: &AppHandle, action: ShortcutAction) {
    log::info!("shortcut action {action:?}");
    match action {
        ShortcutAction::Toggle => windowing::toggle_main(app),
        ShortcutAction::NewChat => new_chat(app),
        ShortcutAction::Screenshot => crate::screenshot::start(app),
        ShortcutAction::Voice => {
            crate::voice::handle(app, crate::voice::machine::Event::Toggle(crate::voice::machine::Mode::Message))
        }
        ShortcutAction::Dictation => {
            crate::voice::handle(app, crate::voice::machine::Event::Toggle(crate::voice::machine::Mode::Dictation))
        }
        _ => notify::show(app, Level::Info, "not_available", None),
    }
}

/// Open the window with a fresh conversation (navigating to /app starts a new chat).
pub fn new_chat(app: &AppHandle) {
    if let Some(w) = windowing::main_window(app) {
        if let Ok(url) = GEMINI_URL.parse() {
            let _ = w.navigate(url);
        }
    }
    windowing::show_main(app);
}

static BRIDGE_CHECKED: AtomicBool = AtomicBool::new(false);

/// After the first Gemini page load: verify that the bridge finds everything it needs and warn
/// once per app run if Google changed the page.
pub fn check_bridge_once(app: &AppHandle) {
    if BRIDGE_CHECKED.swap(true, Ordering::SeqCst) {
        return;
    }
    let app = app.clone();
    std::thread::spawn(move || {
        // The Gemini app renders after the load event; give it a few attempts.
        let mut last_missing = Vec::new();
        for _ in 0..8 {
            std::thread::sleep(Duration::from_millis(1500));
            match bridge::self_test(&app) {
                Ok(missing) if missing.is_empty() => {
                    log::info!("Gemini bridge self-test passed");
                    return;
                }
                Ok(missing) => last_missing = missing,
                Err(e) => log::warn!("bridge self-test attempt failed: {e}"),
            }
            // Signed-out pages or a sign-in redirect are not a page change.
            if let Some(w) = windowing::main_window(&app) {
                if w.url().map(|u| crate::login::is_signin_url(u.as_str())).unwrap_or(false) {
                    BRIDGE_CHECKED.store(false, Ordering::SeqCst);
                    return;
                }
            }
        }
        if !last_missing.is_empty() {
            log::error!("Gemini bridge self-test failed, missing: {last_missing:?}");
            notify::show(&app, Level::Warning, "bridge.page_changed", Some(last_missing.join(", ")));
        } else {
            BRIDGE_CHECKED.store(false, Ordering::SeqCst);
        }
    });
}
