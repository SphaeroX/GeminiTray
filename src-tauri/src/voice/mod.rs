//! Dictation (Alt+Shift+V) and voice messages (Alt+V): recording, recognition, delivery.

pub mod machine;

use crate::audio::{AudioError, Recorder};
use crate::notify::{self, Level};
use crate::state::AppState;
use crate::stt::service::{self, SttState};
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
    recorder: Mutex<Option<Recorder>>,
    session: AtomicU64,
    started: Mutex<Option<Instant>>,
    /// Text prefix for the next voice message (active prompt, Task 09).
    pub prefix: Mutex<Option<String>>,
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
    /// Error pill: "accessDenied", "noDevice", "device".
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Level_ {
    level: f32,
    seconds: f32,
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
    let prompt = if matches!(phase, Phase::Recording { mode: Mode::Message } | Phase::Transcribing { mode: Mode::Message }) {
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
        Effect::StopAndTranscribe(mode) => stop_and_transcribe(app, mode),
        Effect::Discard => {
            vs.recorder.lock().unwrap().take();
            end(app);
        }
        Effect::DiscardWithError => {
            vs.recorder.lock().unwrap().take();
            unregister_escape(app);
            publish(app, Phase::Idle, Some("device"));
        }
        Effect::IgnoreResult => {
            vs.session.fetch_add(1, Ordering::SeqCst);
            end(app);
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
    let _ = app.global_shortcut().register(escape());
}

fn unregister_escape(app: &AppHandle) {
    let _ = app.global_shortcut().unregister(escape());
}

fn start(app: &AppHandle, mode: Mode) {
    let stt = app.state::<SttState>();
    if !stt.engine.is_installed() {
        set_idle(app);
        service::start_download(app);
        notify::show(app, Level::Info, "model.missing", None);
        return;
    }
    let settings = app.state::<AppState>().settings();
    let recorder = match Recorder::start(settings.voice.microphone.as_deref()) {
        Ok(r) => r,
        Err(e) => {
            log::error!("could not start recording: {e}");
            set_idle(app);
            let kind = match e {
                AudioError::AccessDenied(_) => "accessDenied",
                AudioError::NoDevice => "noDevice",
                AudioError::Stream(_) => "device",
            };
            publish(app, Phase::Idle, Some(kind));
            return;
        }
    };
    if mode == Mode::Message {
        windowing::show_main(app);
    }
    let vs = app.state::<VoiceState>();
    *vs.recorder.lock().unwrap() = Some(recorder);
    *vs.started.lock().unwrap() = Some(Instant::now());
    let session = vs.session.fetch_add(1, Ordering::SeqCst) + 1;
    register_escape(app);
    publish(app, Phase::Recording { mode }, None);

    // Load the model while the user speaks.
    let engine = stt.engine.clone();
    std::thread::spawn(move || {
        if let Err(e) = engine.preload() {
            log::error!("preload failed: {e}");
        }
    });

    // Level meter, device watchdog and maximum length.
    let app = app.clone();
    let max = Duration::from_secs(settings.voice.max_minutes as u64 * 60);
    std::thread::spawn(move || loop {
        std::thread::sleep(Duration::from_millis(80));
        let vs = app.state::<VoiceState>();
        if vs.session.load(Ordering::SeqCst) != session || !matches!(vs.phase(), Phase::Recording { .. }) {
            return;
        }
        let (level, seconds, failed) = match vs.recorder.lock().unwrap().as_ref() {
            Some(r) => (r.level(), r.seconds(), r.failed()),
            None => return,
        };
        if failed {
            handle(&app, Event::DeviceError);
            return;
        }
        if let Some(w) = app.get_webview_window(INDICATOR) {
            let _ = w.emit_to(INDICATOR, "voice-level", Level_ { level, seconds });
        }
        if Duration::from_secs_f32(seconds) >= max {
            handle(&app, Event::MaxDuration);
            return;
        }
    });
}

fn stop_and_transcribe(app: &AppHandle, mode: Mode) {
    publish(app, Phase::Transcribing { mode }, None);
    let app = app.clone();
    std::thread::spawn(move || {
        let vs = app.state::<VoiceState>();
        let session = vs.session.load(Ordering::SeqCst);
        let Some(recorder) = vs.recorder.lock().unwrap().take() else {
            handle(&app, Event::TranscriptionFinished);
            end(&app);
            return;
        };
        let rec = recorder.finish();
        let engine = app.state::<SttState>().engine.clone();
        let result = engine.transcribe(&rec.samples, rec.sample_rate, rec.channels);
        if app.state::<VoiceState>().session.load(Ordering::SeqCst) != session {
            log::info!("transcription result ignored (cancelled)");
            return;
        }
        handle(&app, Event::TranscriptionFinished);
        end(&app);
        match result {
            Ok(text) => deliver(&app, mode, &text),
            Err(e) => {
                log::error!("transcription failed: {e}");
                notify::show(&app, Level::Error, "voice.failed", Some(e.to_string()));
            }
        }
    });
}

fn deliver(app: &AppHandle, mode: Mode, text: &str) {
    match mode {
        Mode::Dictation => match machine::clipboard_text(text) {
            Some(t) => match app.clipboard().write_text(t.clone()) {
                Ok(()) => notify::show(app, Level::Success, "voice.copied", Some(machine::preview(&t, 80))),
                Err(e) => notify::show(app, Level::Error, "voice.failed", Some(e.to_string())),
            },
            None => notify::show(app, Level::Info, "voice.nothing", None),
        },
        Mode::Message => crate::voice_message::deliver(app, text),
    }
}

/// "Done"/"Send" button in the indicator.
#[tauri::command]
pub fn voice_finish(app: AppHandle) {
    let mode = match app.state::<VoiceState>().phase() {
        Phase::Recording { mode } => mode,
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

#[tauri::command]
pub fn list_microphones() -> Vec<String> {
    crate::audio::input_device_names()
}
