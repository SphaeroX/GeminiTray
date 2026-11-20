//! Gemini Tray – Rust core.

pub mod actions;
pub mod appwindows;
pub mod commands;
pub mod i18n;
pub mod login;
pub mod notify;
pub mod settings;
pub mod shortcuts;
pub mod state;
pub mod toast;
pub mod tray;
pub mod windowing;

use notify::Level;
use state::AppState;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};

pub const GEMINI_URL: &str = "https://gemini.google.com/app";

fn create_main_window(app: &tauri::AppHandle) -> tauri::Result<()> {
    let url = GEMINI_URL.parse().expect("valid Gemini URL");
    let always_on_top = app.state::<AppState>().settings().window.always_on_top;
    let window = WebviewWindowBuilder::new(app, windowing::MAIN, WebviewUrl::External(url))
        .title("Gemini Tray")
        .inner_size(520.0, 760.0)
        .min_inner_size(360.0, 480.0)
        .center()
        .always_on_top(always_on_top)
        .visible(false)
        .on_page_load({
            let app = app.clone();
            move |_w, payload| {
                if payload.event() == tauri::webview::PageLoadEvent::Finished
                    && login::is_signin_url(payload.url().as_str())
                {
                    notify::show(&app, Level::Warning, "login.required", None);
                }
            }
        })
        .build()?;

    // Closing the window only hides it; the app keeps running in the tray.
    let handle = window.clone();
    window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = handle.hide();
        }
    });
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            windowing::show_main(app);
        }))
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .target(tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                    file_name: Some("gemini-tray".into()),
                }))
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--autostart"]),
        ))
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| shortcuts::on_event(app, shortcut, event.state))
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            commands::get_settings,
            commands::update_settings,
            commands::pause_shortcuts,
            commands::resume_shortcuts,
            commands::open_settings,
            commands::login_with_browser,
            commands::reset_session,
            commands::show_gemini,
            commands::close_window,
            commands::autostart_enabled,
            toast::toast_ready,
            toast::toast_idle,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            let config_dir = handle.path().app_config_dir()?;
            let (state, recovered) = AppState::load(config_dir.join("settings.json"));
            app.manage(state);
            app.manage(toast::ToastState::default());

            toast::create(&handle)?;
            create_main_window(&handle)?;
            tray::create(&handle)?;

            if recovered {
                notify::show(&handle, Level::Warning, "settings.recovered", None);
            }
            let failed = shortcuts::register_current(&handle);
            if !failed.is_empty() {
                let settings = handle.state::<AppState>().settings();
                let list: Vec<String> =
                    failed.iter().map(|a| settings.shortcuts.get(*a).to_string()).collect();
                notify::show(&handle, Level::Warning, "shortcut.taken", Some(list.join(", ")));
            }
            if !handle.state::<AppState>().settings().start_minimized {
                windowing::show_main(&handle);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Gemini Tray");
}
