//! Dictation (Alt+Shift+V) and voice messages (Alt+V) using Gemini's own voice input.
//!
//! Start: the prompt text that is already there (a draft or a pre-filled prompt) is cut and kept,
//! then Gemini's microphone is switched on. Stop: the microphone is switched off, the recognised
//! text is cut from the prompt and
//! - dictation: copied to the clipboard; the draft is put back,
//! - voice message: draft + recognised text are put back and (optionally) sent.

pub mod levels;
pub mod machine;
mod meter;

use crate::bridge::{self, BridgeError};
use crate::notify::{self, Level};
use crate::state::AppState;
use crate::{appwindows, windowing};
use machine::{next, Effect, Event, Mode, Phase};
use serde::Serialize;
use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

pub const INDICATOR: &str = "indicator";

#[derive(Default)]
pub struct VoiceState {
    phase: Mutex<Option<Phase>>,
    session: AtomicU64,
    started: Mutex<Option<Instant>>,
    /// Prompt text that was in the editor before recording started.
    pub(crate) draft: Mutex<String>,
    /// Whether the Gemini window was visible before a dictation started (restore afterwards).
    was_visible: Mutex<bool>,
}

impl VoiceState {
    fn phase(&self) -> Phase {
        self.phase.lock().unwrap().unwrap_or(Phase::Idle)
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IndicatorState {
    #[serde(flatten)]
    pub phase: Phase,
    /// Name of the active prompt shown in the pill (voice message only).
    pub prompt: Option<String>,
    /// Error pill: "micFailed", "notReady".
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
struct Elapsed {
    seconds: f32,
}

#[derive(Debug, Clone, Serialize)]
struct MicLevel {
    level: f32,
}

pub fn create_indicator(app: &AppHandle) -> tauri::Result<()> {
    appwindows::overlay_window(app, INDICATOR, "indicator.html", 520.0, 76.0)?;
    Ok(())
}

fn escape() -> Shortcut {
    Shortcut::from_str("Escape").expect("valid shortcut")
}

pub fn is_escape(shortcut: &Shortcut) -> bool {
    shortcut.id() == escape().id()
}

fn show_indicator(app: &AppHandle, state: IndicatorState) {
    if let Some(w) = app.get_webview_window(INDICATOR) {
        let _ = w.emit_to(INDICATOR, "voice-state", &state);
        if matches!(state.phase, Phase::Idle) && state.error.is_none() {
            let _ = w.hide();
        } else {
            appwindows::place(&w, appwindows::bottom_center);
            let _ = w.show();
        }
    }
}

fn publish(app: &AppHandle, phase: Phase, error: Option<&str>) {
    let prompt = if matches!(
        phase,
        Phase::Starting { mode: Mode::Message } | Phase::Recording { mode: Mode::Message } | Phase::Transcribing { mode: Mode::Message }
    ) {
        crate::prompts::active_name(app)
    } else {
        None
    };
    show_indicator(app, IndicatorState { phase, prompt, error: error.map(str::to_string) });
}

/// Feed an event into the state machine and run its effect.
pub fn handle(app: &AppHandle, event: Event) {
    let vs = app.state::<VoiceState>();
    let (phase, effect) = {
        let mut guard = vs.phase.lock().unwrap();
        let (p, e) = next(guard.unwrap_or(Phase::Idle), event);
        *guard = Some(p);
        (p, e)
    };
    log::info!("voice {event:?} → {phase:?} ({effect:?})");
    match effect {
        Effect::None => {}
        Effect::StartRecording(mode) => start(app, mode),
        Effect::StopAndTranscribe(mode) => stop_and_deliver(app, mode),
        Effect::Discard | Effect::IgnoreResult => discard(app),
        Effect::DiscardWithError => {
            discard(app);
            publish(app, Phase::Idle, Some("micFailed"));
        }
    }
}

fn set_idle(app: &AppHandle) {
    *app.state::<VoiceState>().phase.lock().unwrap() = Some(Phase::Idle);
}

fn end(app: &AppHandle) {
    unregister_escape(app);
    publish(app, Phase::Idle, None);
}

fn register_escape(app: &AppHandle) {
    match app.global_shortcut().register(escape()) {
        Ok(()) => log::info!("Escape registered for cancelling voice input"),
        Err(e) => log::warn!("Escape could not be registered: {e}"),
    }
}

fn unregister_escape(app: &AppHandle) {
    let _ = app.global_shortcut().unregister(escape());
}

fn fail(app: &AppHandle, err: &BridgeError) {
    log::error!("voice input failed: {err}");
    set_idle(app);
    unregister_escape(app);
    let kind = match err {
        BridgeError::NotReady | BridgeError::Timeout => "notReady",
        _ => "micFailed",
    };
    publish(app, Phase::Idle, Some(kind));
}

/// Put the saved draft back into the prompt (if there was one).
fn restore_draft(app: &AppHandle) {
    let draft = std::mem::take(&mut *app.state::<VoiceState>().draft.lock().unwrap());
    if !draft.trim().is_empty() {
        let _ = bridge::insert_text(app, &draft);
    }
}

fn start(app: &AppHandle, mode: Mode) {
    let vs = app.state::<VoiceState>();
    let was_visible = windowing::main_window(app).and_then(|w| w.is_visible().ok()).unwrap_or(false);
    *vs.was_visible.lock().unwrap() = was_visible;
    *vs.started.lock().unwrap() = Some(Instant::now());
    let session = vs.session.fetch_add(1, Ordering::SeqCst) + 1;
    // Dictation runs in the background: the indicator pill is enough, the text goes to the
    // clipboard. A voice message ends up in the chat, so the Gemini window is shown for it.
    if machine::shows_window(mode) {
        windowing::show_main(app);
    }
    register_escape(app);
    // "Starting …" until Gemini really listens, so nobody talks into a microphone that is not on yet.
    publish(app, Phase::Starting { mode }, None);

    let app = app.clone();
    std::thread::spawn(move || {
        let result = (|| -> Result<(), BridgeError> {
            if !bridge::wait_ready(&app, Duration::from_secs(10)) {
                return Err(BridgeError::NotReady);
            }
            let draft = bridge::take_text(&app)?;
            *app.state::<VoiceState>().draft.lock().unwrap() = draft;
            bridge::mic_start(&app)
        })();
        let cancelled = app.state::<VoiceState>().session.load(Ordering::SeqCst) != session;
        if cancelled {
            // Stopped or cancelled while Gemini was still starting: switch the mic off again.
            if result.is_ok() {
                let _ = bridge::mic_stop(&app);
                let _ = bridge::take_text(&app);
            }
            restore_draft(&app);
            return;
        }
        if let Err(e) = result {
            restore_draft(&app);
            fail(&app, &e);
            return;
        }
        *app.state::<VoiceState>().started.lock().unwrap() = Some(Instant::now());
        handle(&app, Event::MicReady);
        publish(&app, Phase::Recording { mode }, None);
        meter_loop(&app, session);
        watch(&app, session);
    });
}

/// Microphone level for the bars in the indicator, about 20 times a second while recording.
/// Runs on its own thread so slow bridge calls in `watch` don't make the bars stutter.
fn meter_loop(app: &AppHandle, session: u64) {
    let app = app.clone();
    std::thread::spawn(move || {
        let meter = meter::Meter::open();
        let mut shown = 0.0_f32;
        loop {
            std::thread::sleep(Duration::from_millis(50));
            let vs = app.state::<VoiceState>();
            if vs.session.load(Ordering::SeqCst) != session || !matches!(vs.phase(), Phase::Recording { .. }) {
                return;
            }
            shown = levels::smooth(shown, levels::level(meter.peak()));
            let _ = app.emit_to(INDICATOR, "voice-mic", MicLevel { level: shown });
        }
    });
}

/// Timer for the indicator, maximum length, and auto-finish when Gemini stops listening by itself.
fn watch(app: &AppHandle, session: u64) {
    let max = Duration::from_secs(app.state::<AppState>().settings().voice.max_minutes as u64 * 60);
    let mut last_check = Instant::now();
    let _ = bridge::voice_status(app); // clear an old Escape flag
    loop {
        std::thread::sleep(Duration::from_millis(200));
        let vs = app.state::<VoiceState>();
        if vs.session.load(Ordering::SeqCst) != session {
            return;
        }
        let mode = match vs.phase() {
            Phase::Recording { mode } => mode,
            _ => return,
        };
        let elapsed = vs.started.lock().unwrap().map(|s| s.elapsed()).unwrap_or_default();
        if let Some(w) = app.get_webview_window(INDICATOR) {
            let _ = w.emit_to(INDICATOR, "voice-level", Elapsed { seconds: elapsed.as_secs_f32() });
        }
        if elapsed >= max {
            handle(app, Event::MaxDuration);
            return;
        }
        // Escape in the Gemini window cancels; Gemini ending dictation by itself after a pause
        // finishes like a second key press.
        if last_check.elapsed() >= Duration::from_millis(400) {
            last_check = Instant::now();
            match bridge::voice_status(app) {
                Ok((_, true)) => {
                    handle(app, Event::Cancel);
                    return;
                }
                Ok((false, false)) => {
                    log::info!("Gemini stopped listening – finishing");
                    handle(app, Event::Toggle(mode));
                    return;
                }
                _ => {}
            }
        }
    }
}

fn stop_and_deliver(app: &AppHandle, mode: Mode) {
    publish(app, Phase::Transcribing { mode }, None);
    let app = app.clone();
    std::thread::spawn(move || {
        let session = app.state::<VoiceState>().session.load(Ordering::SeqCst);
        let result = bridge::mic_stop(&app).and_then(|_| bridge::take_text(&app));
        if app.state::<VoiceState>().session.load(Ordering::SeqCst) != session {
            return; // cancelled meanwhile
        }
        handle(&app, Event::TranscriptionFinished);
        end(&app);
        let text = match result {
            Ok(t) => t,
            Err(e) => {
                restore_draft(&app);
                notify::show(&app, Level::Error, "voice.failed", Some(e.to_string()));
                return;
            }
        };
        match mode {
            Mode::Dictation => deliver_dictation(&app, &text),
            Mode::Message => crate::voice_message::deliver(&app, &text),
        }
    });
}

fn deliver_dictation(app: &AppHandle, text: &str) {
    restore_draft(app);
    match machine::clipboard_text(text) {
        Some(t) => match app.clipboard().write_text(t.clone()) {
            Ok(()) => notify::show(app, Level::Success, "voice.copied", Some(machine::preview(&t, 80))),
            Err(e) => notify::show(app, Level::Error, "voice.failed", Some(e.to_string())),
        },
        None => notify::show(app, Level::Info, "voice.nothing", None),
    }
    if !*app.state::<VoiceState>().was_visible.lock().unwrap() {
        windowing::hide_main(app);
    }
}

/// Cancel: stop the microphone, throw the recognised text away, put the draft back.
fn discard(app: &AppHandle) {
    app.state::<VoiceState>().session.fetch_add(1, Ordering::SeqCst);
    end(app);
    let app = app.clone();
    std::thread::spawn(move || {
        let _ = bridge::mic_stop(&app);
        let _ = bridge::take_text(&app);
        restore_draft(&app);
    });
}

/// "Done"/"Send" button in the indicator.
#[tauri::command]
pub fn voice_finish(app: AppHandle) {
    let mode = match app.state::<VoiceState>().phase() {
        Phase::Starting { mode } | Phase::Recording { mode } => mode,
        _ => return,
    };
    handle(&app, Event::Toggle(mode));
}

#[tauri::command]
pub fn voice_cancel(app: AppHandle) {
    handle(&app, Event::Cancel);
}

/// Dismiss an error pill.
#[tauri::command]
pub fn voice_dismiss(app: AppHandle) {
    if let Some(w) = app.get_webview_window(INDICATOR) {
        let _ = w.hide();
    }
}

/// Open the Windows microphone privacy settings.
#[tauri::command]
pub fn open_mic_privacy() {
    let _ = std::process::Command::new("explorer").arg("ms-settings:privacy-microphone").spawn();
}
