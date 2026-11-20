//! Saved prompts, the quick menu (Alt+J) and the "active prompt" for the next message.
//!
//! Selecting a prompt pre-fills it into the Gemini input right away. A following voice message or
//! screenshot is appended after it. Only when pre-filling failed (page not ready) the prompt is
//! kept as "pending" and prepended natively to the next voice message / screenshot.

use crate::settings::Prompt;
use crate::state::AppState;
use crate::{bridge, windowing};
use serde::Serialize;
use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};

pub const MENU: &str = "prompts";

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Active {
    pub prompt: Option<Prompt>,
    /// True when the prompt text is already in the Gemini input.
    pub prefilled: bool,
}

/// Content to prepend to the next message, consuming the active prompt.
pub fn take_for_message(active: &mut Active) -> Option<String> {
    let a = std::mem::take(active);
    match a.prompt {
        Some(p) if !a.prefilled => Some(p.content),
        _ => None,
    }
}

#[derive(Default)]
pub struct PromptState {
    active: Mutex<Active>,
}

pub fn active_name(app: &AppHandle) -> Option<String> {
    app.try_state::<PromptState>()?.active.lock().unwrap().prompt.as_ref().map(|p| p.name.clone())
}

pub fn take_active_content(app: &AppHandle) -> Option<String> {
    let state = app.try_state::<PromptState>()?;
    let mut guard = state.active.lock().unwrap();
    take_for_message(&mut guard)
}

/// Alt+J: show the quick menu on the monitor under the mouse.
pub fn open_menu(app: &AppHandle) {
    let window = match app.get_webview_window(MENU) {
        Some(w) => w,
        None => {
            let built = WebviewWindowBuilder::new(app, MENU, WebviewUrl::App("prompts.html".into()))
                .title("Gemini Tray")
                .inner_size(560.0, 420.0)
                .decorations(false)
                .transparent(true)
                .shadow(false)
                .resizable(false)
                .always_on_top(true)
                .skip_taskbar(true)
                .visible(false)
                .build();
            let Ok(w) = built else { return };
            let handle = w.clone();
            w.on_window_event(move |e| {
                if let WindowEvent::Focused(false) = e {
                    let _ = handle.hide();
                }
            });
            w
        }
    };
    crate::appwindows::place(&window, center_top);
    let _ = window.emit_to(MENU, "prompts-open", ());
    let _ = window.show();
    let _ = window.set_focus();
}

/// Horizontally centred, upper third of the work area.
pub fn center_top(work_pos: (i32, i32), work_size: (u32, u32), size: (u32, u32), _margin: i32) -> (i32, i32) {
    (
        work_pos.0 + (work_size.0 as i32 - size.0 as i32) / 2,
        work_pos.1 + (work_size.1 as i32 / 4).max(0) - (size.1 as i32 / 8),
    )
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MenuData {
    pub prompts: Vec<Prompt>,
    pub active_id: Option<String>,
}

#[tauri::command]
pub fn prompts_menu_data(app: AppHandle) -> MenuData {
    let prompts = app.state::<AppState>().settings().prompts;
    let active_id = app.state::<PromptState>().active.lock().unwrap().prompt.as_ref().map(|p| p.id.clone());
    MenuData { prompts, active_id }
}

#[tauri::command]
pub fn prompt_select(app: AppHandle, id: String) {
    if let Some(w) = app.get_webview_window(MENU) {
        let _ = w.hide();
    }
    let Some(prompt) = app.state::<AppState>().settings().prompts.into_iter().find(|p| p.id == id) else { return };
    *app.state::<PromptState>().active.lock().unwrap() = Active { prompt: Some(prompt.clone()), prefilled: false };
    windowing::show_main(&app);
    std::thread::spawn(move || {
        let ok = bridge::wait_ready(&app, Duration::from_secs(10)) && bridge::insert_text(&app, &prompt.content).is_ok();
        let state = app.state::<PromptState>();
        let mut active = state.active.lock().unwrap();
        if active.prompt.as_ref().map(|p| &p.id) == Some(&prompt.id) {
            active.prefilled = ok;
        }
        log::info!("prompt '{}' selected (prefilled: {ok})", prompt.name);
    });
}

#[tauri::command]
pub fn prompt_clear(app: AppHandle) {
    *app.state::<PromptState>().active.lock().unwrap() = Active::default();
    if let Some(w) = app.get_webview_window(MENU) {
        let _ = w.hide();
    }
}

#[tauri::command]
pub fn prompts_close(app: AppHandle) {
    if let Some(w) = app.get_webview_window(MENU) {
        let _ = w.hide();
    }
}
