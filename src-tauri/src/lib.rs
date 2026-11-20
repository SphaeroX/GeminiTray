//! Gemini Tray – Rust core.

pub mod login;
pub mod notify;
pub mod toast;
pub mod tray;
pub mod windowing;

use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

pub const GEMINI_URL: &str = "https://gemini.google.com/app";

fn create_main_window(app: &tauri::AppHandle) -> tauri::Result<()> {
    let url = GEMINI_URL.parse().expect("valid Gemini URL");
    let window = WebviewWindowBuilder::new(app, windowing::MAIN, WebviewUrl::External(url))
        .title("Gemini Tray")
        .inner_size(520.0, 760.0)
        .min_inner_size(360.0, 480.0)
        .center()
        .visible(false)
        .on_page_load({
            let app = app.clone();
            move |_w, payload| {
                if payload.event() == tauri::webview::PageLoadEvent::Finished
                    && login::is_signin_url(payload.url().as_str())
                {
                    notify::show(&app, notify::Level::Warning, "login.required", None);
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
                .target(tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout))
                .build(),
        )
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        windowing::toggle_main(app);
                    }
                })
                .build(),
        )
        .setup(|app| {
            let handle = app.handle().clone();
            create_main_window(&handle)?;
            tray::create(&handle)?;
            if let Err(e) = handle.global_shortcut().register("Alt+Space") {
                log::error!("Could not register Alt+Space: {e}");
            }
            let _ = app.get_webview_window(windowing::MAIN);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Gemini Tray");
}
