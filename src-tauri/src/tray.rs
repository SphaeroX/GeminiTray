//! System tray icon and menu.

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::AppHandle;

use crate::windowing;

pub fn create(app: &AppHandle) -> tauri::Result<()> {
    let toggle = MenuItem::with_id(app, "toggle", "Anzeigen / Verbergen", true, None::<&str>)?;
    let login = MenuItem::with_id(app, "login_browser", "Mit Browser anmelden", true, None::<&str>)?;
    let reset = MenuItem::with_id(app, "reset_session", "Sitzung zurücksetzen", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Beenden", true, None::<&str>)?;
    let sep1 = PredefinedMenuItem::separator(app)?;
    let sep2 = PredefinedMenuItem::separator(app)?;
    let menu = Menu::with_items(app, &[&toggle, &sep1, &login, &reset, &sep2, &quit])?;

    let mut builder = TrayIconBuilder::with_id("main")
        .tooltip("Gemini Tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "toggle" => windowing::toggle_main(app),
            "login_browser" => crate::login::start_browser_login(app),
            "reset_session" => crate::login::reset_session(app),
            "quit" => app.exit(0),
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
    Ok(())
}
