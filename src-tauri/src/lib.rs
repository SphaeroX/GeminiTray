//! Gemini Tray – Rust core.

pub mod actions;
pub mod appwindows;
pub mod bridge;
pub mod commands;
pub mod i18n;
pub mod login;
pub mod notify;
pub mod permissions;
pub mod prompts;
pub mod screenshot;
pub mod settings;
pub mod shortcuts;
pub mod state;
pub mod toast;
pub mod tray;
pub mod updates;
pub mod voice;
pub mod voice_message;
pub mod windowing;
pub mod windowstate;

use notify::Level;
use state::AppState;
use tauri::webview::WebviewBuilder;
use tauri::window::WindowBuilder;
use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl, WindowEvent};

pub const GEMINI_URL: &str = "https://gemini.google.com/app";

async fn tokio_sleep(d: std::time::Duration) {
    let (tx, rx) = tauri::async_runtime::channel::<()>(1);
    std::thread::spawn(move || {
        std::thread::sleep(d);
        let _ = tx.blocking_send(());
    });
    let mut rx = rx;
    let _ = rx.recv().await;
}

fn create_main_window(app: &tauri::AppHandle) -> tauri::Result<()> {
    let url = GEMINI_URL.parse().expect("valid Gemini URL");
    let always_on_top = app.state::<AppState>().settings().window.always_on_top;
    let window = WindowBuilder::new(app, windowing::MAIN)
        .title("Gemini Tray")
        .inner_size(520.0, 760.0)
        .min_inner_size(360.0, 480.0)
        .center()
        .decorations(false)
        .shadow(true)
        .always_on_top(always_on_top)
        .visible(false)
        .build()?;

    let size = window.inner_size()?.to_logical::<f64>(window.scale_factor()?);
    let bar = windowing::TITLEBAR_HEIGHT;
    window.add_child(
        WebviewBuilder::new(windowing::TITLEBAR, WebviewUrl::App("titlebar.html".into())),
        LogicalPosition::new(0.0, 0.0),
        LogicalSize::new(size.width, bar),
    )?;
    let gemini = WebviewBuilder::new(windowing::GEMINI, WebviewUrl::External(url))
        .initialization_script(bridge::SCRIPT)
        .on_page_load({
            let app = app.clone();
            move |_w, payload| {
                if payload.event() != tauri::webview::PageLoadEvent::Finished {
                    return;
                }
                let url = payload.url().as_str();
                if login::is_signin_url(url) {
                    notify::show(&app, Level::Warning, "login.required", None);
                } else if url.starts_with("https://gemini.google.com/") {
                    actions::check_bridge_once(&app);
                }
            }
        });
    let gemini = window.add_child(gemini, LogicalPosition::new(0.0, bar), LogicalSize::new(size.width, (size.height - bar).max(1.0)))?;
    permissions::allow_microphone(&gemini);

    windowstate::restore(app, &window);
    windowstate::apply_opacity(&window, app.state::<AppState>().settings().window.opacity);

    // Closing the window only hides it; the app keeps running in the tray.
    let handle = window.clone();
    let app_handle = app.clone();
    window.on_window_event(move |event| {
        match event {
            WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                windowstate::remember(&app_handle, &handle);
                let _ = handle.hide();
            }
            WindowEvent::Resized(_) | WindowEvent::ScaleFactorChanged { .. } => windowing::layout(&app_handle),
            _ => {}
        }
    });
    windowing::layout(app);
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
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
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
            voice::voice_finish,
            voice::voice_cancel,
            voice::voice_dismiss,
            voice::open_mic_privacy,
            screenshot::overlay_image,
            screenshot::overlay_cancel,
            screenshot::overlay_select,
            prompts::prompts_menu_data,
            prompts::prompt_select,
            prompts::prompt_clear,
            prompts::prompts_close,
            updates::update_status,
            updates::update_check,
            updates::update_install,
            updates::open_releases,
            commands::titlebar_action,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            let config_dir = handle.path().app_config_dir()?;
            let (state, recovered) = AppState::load(config_dir.join("settings.json"));
            app.manage(state);
            app.manage(toast::ToastState::default());
            app.manage(voice::VoiceState::default());
            app.manage(screenshot::ScreenshotState::default());
            app.manage(prompts::PromptState::default());
            app.manage(updates::UpdateState::new(&handle));

            toast::create(&handle)?;
            voice::create_indicator(&handle)?;
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
            // Look for updates a little after start (not blocking the start-up).
            let update_handle = handle.clone();
            tauri::async_runtime::spawn(async move {
                tokio_sleep(std::time::Duration::from_secs(20)).await;
                updates::check(update_handle, true).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Gemini Tray");
}
