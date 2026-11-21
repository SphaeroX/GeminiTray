//! Pure state machine for dictation and voice messages (no hardware, fully testable).

use serde::Serialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Mode {
    /// Alt+Shift+V: text goes to the clipboard.
    Dictation,
    /// Alt+V: text goes into Gemini (and is sent if enabled).
    Message,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(tag = "phase", rename_all = "camelCase")]
pub enum Phase {
    Idle,
    Recording { mode: Mode },
    Transcribing { mode: Mode },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Event {
    /// Shortcut pressed (or "Done"/"Send" in the indicator) for a mode.
    Toggle(Mode),
    /// Escape / ✕ in the indicator.
    Cancel,
    /// Microphone failed or was unplugged during recording.
    DeviceError,
    /// Maximum recording length reached.
    MaxDuration,
    /// Speech recognition finished (successfully or not).
    TranscriptionFinished,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Effect {
    None,
    StartRecording(Mode),
    StopAndTranscribe(Mode),
    /// Throw the recording away.
    Discard,
    /// Recording failed; throw it away and tell the user.
    DiscardWithError,
    /// The user cancelled while recognition was running: ignore its result.
    IgnoreResult,
}

pub fn next(phase: Phase, event: Event) -> (Phase, Effect) {
    use Effect as E;
    use Phase as P;
    match (phase, event) {
        (P::Idle, Event::Toggle(m)) => (P::Recording { mode: m }, E::StartRecording(m)),
        (P::Idle, _) => (P::Idle, E::None),

        // A second press of either voice shortcut stops; the mode of the running recording wins.
        (P::Recording { mode }, Event::Toggle(_)) | (P::Recording { mode }, Event::MaxDuration) => {
            (P::Transcribing { mode }, E::StopAndTranscribe(mode))
        }
        (P::Recording { .. }, Event::Cancel) => (P::Idle, E::Discard),
        (P::Recording { .. }, Event::DeviceError) => (P::Idle, E::DiscardWithError),
        (P::Recording { mode }, Event::TranscriptionFinished) => (P::Recording { mode }, E::None),

        // While recognising, further presses are ignored (no new recording on top).
        (P::Transcribing { mode }, Event::Toggle(_))
        | (P::Transcribing { mode }, Event::MaxDuration)
        | (P::Transcribing { mode }, Event::DeviceError) => (P::Transcribing { mode }, E::None),
        (P::Transcribing { .. }, Event::Cancel) => (P::Idle, E::IgnoreResult),
        (P::Transcribing { .. }, Event::TranscriptionFinished) => (P::Idle, E::None),
    }
}

/// Whether the Gemini window is brought to the front when recording starts. Dictation runs in
/// the background (only the indicator pill is shown); a voice message ends up in the chat.
pub fn shows_window(mode: Mode) -> bool {
    matches!(mode, Mode::Message)
}

/// Text to put into the clipboard after dictation: `None` when nothing was recognised, so the
/// clipboard is not overwritten with an empty string.
pub fn clipboard_text(transcript: &str) -> Option<String> {
    let t = transcript.trim();
    if t.is_empty() { None } else { Some(t.to_string()) }
}

/// Short preview for the "copied" toast.
pub fn preview(text: &str, max_chars: usize) -> String {
    let t: String = text.chars().take(max_chars).collect();
    if text.chars().count() > max_chars { format!("„{t}…“") } else { format!("„{t}“") }
}
