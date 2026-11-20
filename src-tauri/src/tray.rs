//! System tray icon and menu.

use crate::i18n::t;
use crate::state::AppState;
use crate::{appwindows, login, windowing};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, Wry};

/// Menu entries: (id, i18n key).
const ITEMS: &[(&str, &str)] = &[
    ("toggle", "tray.toggle"),
    ("dictation", "tray.dictation"),
    ("screenshot", "tray.screenshot"),
    ("settings", "tray.settings"),
    ("login_browser", "tray.login_browser"),
    ("reset_session", "tray.reset_session"),
    ("quit", "tray.quit"),
];

pub struct TrayItems(pub Vec<(String, MenuItem<Wry>)>);

pub fn create(app: &AppHandle) -> tauri::Result<()> {
    let lang = app.state::<AppState>().language();
    let mut items = Vec::new();
    for (id, key) in ITEMS {
        items.push((id.to_string(), MenuItem::with_id(app, *id, t(lang, key), true, None::<&str>)?));
    }
    let get = |id: &str| &items.iter().find(|(i, _)| i == id).unwrap().1;
    let sep1 = PredefinedMenuItem::separator(app)?;
    let sep2 = PredefinedMenuItem::separator(app)?;
    let menu = Menu::with_items(
        app,
        &[
            get("toggle"),
            get("dictation"),
            get("screenshot"),
            get("settings"),
            &sep1,
            get("login_browser"),
            get("reset_session"),
            &sep2,
            get("quit"),
        ],
    )?;

    let mut builder = TrayIconBuilder::with_id("main")
        .tooltip("Gemini Tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "toggle" => windowing::toggle_main(app),
            "settings" => appwindows::open_settings(app, None),
            "dictation" => crate::actions::run(app, crate::settings::ShortcutAction::Dictation),
            "screenshot" => crate::actions::run(app, crate::settings::ShortcutAction::Screenshot),
            "login_browser" => login::start_browser_login(app),
            "reset_session" => login::reset_session(app),
            "quit" => {
                if let Some(w) = windowing::main_window(app) {
                    if w.is_visible().unwrap_or(false) {
                        crate::windowstate::remember(app, &w);
                    }
                }
                app.exit(0)
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                windowing::toggle_main(tray.app_handle());
            }
        });
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    builder.build(app)?;
    app.manage(TrayItems(items));
    Ok(())
}

/// Re-translate the menu after a language change.
pub fn refresh_labels(app: &AppHandle) {
    let lang = app.state::<AppState>().language();
    if let Some(items) = app.try_state::<TrayItems>() {
        for (id, item) in &items.0 {
            if let Some((_, key)) = ITEMS.iter().find(|(i, _)| i == id) {
                let _ = item.set_text(t(lang, key));
            }
        }
    }
}
