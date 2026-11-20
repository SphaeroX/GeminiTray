use gemini_tray_lib::voice::machine::{clipboard_text, next, preview, Effect, Event, Mode, Phase};

const D: Mode = Mode::Dictation;
const M: Mode = Mode::Message;

#[test]
fn start_stop_dictation() {
    let (p, e) = next(Phase::Idle, Event::Toggle(D));
    assert_eq!((p, e), (Phase::Recording { mode: D }, Effect::StartRecording(D)));
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
