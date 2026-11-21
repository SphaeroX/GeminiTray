use gemini_tray_lib::voice::levels::{level, smooth};
use gemini_tray_lib::voice::machine::{clipboard_text, next, preview, shows_window, Effect, Event, Mode, Phase};

const D: Mode = Mode::Dictation;
const M: Mode = Mode::Message;

#[test]
fn start_stop_dictation() {
    let (p, e) = next(Phase::Idle, Event::Toggle(D));
    assert_eq!((p, e), (Phase::Starting { mode: D }, Effect::StartRecording(D)));
    let (p, e) = next(p, Event::MicReady);
    assert_eq!((p, e), (Phase::Recording { mode: D }, Effect::None));
    let (p, e) = next(p, Event::Toggle(D));
    assert_eq!((p, e), (Phase::Transcribing { mode: D }, Effect::StopAndTranscribe(D)));
    let (p, e) = next(p, Event::TranscriptionFinished);
    assert_eq!((p, e), (Phase::Idle, Effect::None));
}

#[test]
fn other_voice_shortcut_stops_running_recording_in_its_own_mode() {
    let (p, e) = next(Phase::Recording { mode: D }, Event::Toggle(M));
    assert_eq!((p, e), (Phase::Transcribing { mode: D }, Effect::StopAndTranscribe(D)));
}

#[test]
fn presses_during_transcription_are_ignored() {
    let p = Phase::Transcribing { mode: M };
    assert_eq!(next(p, Event::Toggle(M)), (p, Effect::None));
    assert_eq!(next(p, Event::Toggle(D)), (p, Effect::None));
    assert_eq!(next(p, Event::MaxDuration), (p, Effect::None));
}

#[test]
fn cancel_discards_recording_or_result() {
    assert_eq!(next(Phase::Recording { mode: D }, Event::Cancel), (Phase::Idle, Effect::Discard));
    assert_eq!(next(Phase::Transcribing { mode: D }, Event::Cancel), (Phase::Idle, Effect::IgnoreResult));
    assert_eq!(next(Phase::Idle, Event::Cancel), (Phase::Idle, Effect::None));
}

#[test]
fn device_error_ends_recording_with_error() {
    assert_eq!(next(Phase::Recording { mode: M }, Event::DeviceError), (Phase::Idle, Effect::DiscardWithError));
    assert_eq!(next(Phase::Idle, Event::DeviceError), (Phase::Idle, Effect::None));
}

#[test]
fn max_duration_stops_and_transcribes() {
    assert_eq!(
        next(Phase::Recording { mode: D }, Event::MaxDuration),
        (Phase::Transcribing { mode: D }, Effect::StopAndTranscribe(D))
    );
}

#[test]
fn empty_transcript_does_not_touch_clipboard() {
    assert_eq!(clipboard_text("   "), None);
    assert_eq!(clipboard_text(""), None);
    assert_eq!(clipboard_text(" Hallo "), Some("Hallo".into()));
}

#[test]
fn preview_is_shortened() {
    assert_eq!(preview("kurz", 10), "„kurz“");
    assert_eq!(preview("eine sehr lange Nachricht", 8), "„eine seh…“");
}

#[test]
fn dictation_stays_in_the_background() {
    assert!(!shows_window(Mode::Dictation));
    assert!(shows_window(Mode::Message));
}

#[test]
fn stopping_before_gemini_listens_discards() {
    let p = Phase::Starting { mode: M };
    assert_eq!(next(p, Event::Toggle(M)), (Phase::Idle, Effect::Discard));
    assert_eq!(next(p, Event::Cancel), (Phase::Idle, Effect::Discard));
    assert_eq!(next(p, Event::DeviceError), (Phase::Idle, Effect::DiscardWithError));
    assert_eq!(next(p, Event::MaxDuration), (p, Effect::None));
}

#[test]
fn mic_ready_only_matters_while_starting() {
    assert_eq!(next(Phase::Idle, Event::MicReady), (Phase::Idle, Effect::None));
    let r = Phase::Recording { mode: D };
    assert_eq!(next(r, Event::MicReady), (r, Effect::None));
    let t = Phase::Transcribing { mode: D };
    assert_eq!(next(t, Event::MicReady), (t, Effect::None));
}

#[test]
fn mic_level_uses_a_db_scale() {
    assert_eq!(level(0.0), 0.0);
    assert_eq!(level(f32::NAN), 0.0);
    assert_eq!(level(0.001), 0.0); // -60 dB: room noise stays flat
    assert_eq!(level(1.0), 1.0);
    let quiet = level(0.01); // -40 dB
    let loud = level(0.1); // -20 dB
    assert!(0.0 < quiet && quiet < loud && loud < 1.0);
}

#[test]
fn bars_rise_fast_and_fall_slowly() {
    assert_eq!(smooth(0.2, 0.8), 0.8);
    let falling = smooth(0.8, 0.0);
    assert!(falling > 0.0 && falling < 0.8);
    assert_eq!(smooth(0.8, 0.7), 0.7_f32.max(0.8 * 0.7));
}
