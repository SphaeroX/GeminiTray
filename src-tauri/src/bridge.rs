//! Rust side of the Gemini bridge (`src/bridge/`). Starts an operation in the Gemini page via
//! `eval` and polls its result with `eval_with_callback` – the Gemini page needs no IPC rights.

use serde::Deserialize;
use serde_json::{json, Value};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, Instant};

/// The bundled bridge script (built by `npm run build:bridge`, see build.rs).
pub const SCRIPT: &str = include_str!("../bridge/gemini-bridge.js");

#[derive(Debug, Clone, PartialEq)]
pub enum BridgeError {
    /// Bridge not installed: page still loading, signed out, or not the Gemini app.
    NotReady,
    /// A required element is missing – Google probably changed the page.
    SelectorMissing(String),
    /// The image was dropped but Gemini did not show a preview.
    NotAttached,
    Timeout,
    Script(String),
}

impl std::fmt::Display for BridgeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotReady => write!(f, "Gemini page not ready"),
            Self::SelectorMissing(s) => write!(f, "element not found: {s}"),
            Self::NotAttached => write!(f, "image was not attached"),
            Self::Timeout => write!(f, "timeout"),
            Self::Script(s) => write!(f, "script error: {s}"),
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum Polled {
    Ok { ok: bool, value: Value },
    Err { code: String, detail: String },
}

/// Result of one poll: still running, done, or failed.
#[derive(Debug, PartialEq)]
pub enum PollState {
    Pending,
    Missing,
    Done(Result<Value, BridgeError>),
}

/// Interpret the JSON string produced by `eval_with_callback` for a poll script.
pub fn parse_poll(raw: &str) -> PollState {
    let v: Value = serde_json::from_str(raw).unwrap_or(Value::Null);
    // The poll script returns "missing" when the bridge is not installed.
    if v == json!("missing") {
        return PollState::Missing;
    }
    if v.is_null() {
        return PollState::Pending;
    }
    match serde_json::from_value::<Polled>(v) {
        Ok(Polled::Ok { ok: true, value }) => PollState::Done(Ok(value)),
        Ok(Polled::Err { code, detail, .. }) => PollState::Done(Err(match code.as_str() {
            "selector_missing" => BridgeError::SelectorMissing(detail),
            "not_attached" => BridgeError::NotAttached,
            "timeout" => BridgeError::Timeout,
            _ => BridgeError::Script(format!("{code}: {detail}")),
        })),
        _ => PollState::Done(Err(BridgeError::Script("unexpected result".into()))),
    }
}

pub fn start_script(id: &str, op: &str, args: &Value) -> String {
    format!(
        "window.__geminiTray && window.__geminiTray.start({}, {}, {});",
        json!(id),
        json!(op),
        args
    )
}

pub fn poll_script(id: &str) -> String {
    format!(
        "(function(){{ try {{ return window.__geminiTray ? window.__geminiTray.poll({}) : 'missing'; }} catch (e) {{ return {{ ok: false, code: 'script', detail: String(e) }}; }} }})()",
        json!(id)
    )
}

static NEXT_ID: AtomicU64 = AtomicU64::new(1);

mod runtime {
    use super::*;
    use crate::windowing;
    use std::sync::mpsc;
    use tauri::AppHandle;

    fn eval_value(w: &tauri::WebviewWindow, script: String) -> Option<String> {
        let (tx, rx) = mpsc::channel();
        w.eval_with_callback(script, move |res| {
            let _ = tx.send(res);
        })
        .ok()?;
        rx.recv_timeout(Duration::from_secs(5)).ok()
    }

    /// Run a bridge operation. Blocking – call from a background thread, never from the main thread.
    pub fn call(app: &AppHandle, op: &str, args: Value, timeout: Duration) -> Result<Value, BridgeError> {
        let w = windowing::main_window(app).ok_or(BridgeError::NotReady)?;
        let id = format!("op{}", NEXT_ID.fetch_add(1, Ordering::Relaxed));
        // Make sure the bridge exists (pages loaded before injection or after a crash).
        let installed = eval_value(&w, "typeof window.__geminiTray".into());
        if installed.as_deref() != Some("\"object\"") {
            let _ = w.eval(SCRIPT);
        }
        w.eval(start_script(&id, op, &args)).map_err(|e| BridgeError::Script(e.to_string()))?;
        let started = Instant::now();
        loop {
            std::thread::sleep(Duration::from_millis(80));
            match eval_value(&w, poll_script(&id)).map(|r| parse_poll(&r)) {
                Some(PollState::Done(r)) => return r,
                Some(PollState::Missing) => return Err(BridgeError::NotReady),
                _ => {}
            }
            if started.elapsed() > timeout {
                return Err(BridgeError::Timeout);
            }
        }
    }

    pub fn insert_text(app: &AppHandle, text: &str) -> Result<(), BridgeError> {
        call(app, "insertText", json!({ "text": text, "append": true }), Duration::from_secs(10)).map(|_| ())
    }

    pub fn insert_image(app: &AppHandle, png: &[u8]) -> Result<(), BridgeError> {
        use base64::Engine;
        let b64 = base64::engine::general_purpose::STANDARD.encode(png);
        call(app, "insertImage", json!({ "png": b64 }), Duration::from_secs(15)).map(|_| ())
    }

    pub fn send(app: &AppHandle) -> Result<(), BridgeError> {
        call(app, "send", json!({}), Duration::from_secs(20)).map(|_| ())
    }

    pub fn self_test(app: &AppHandle) -> Result<Vec<String>, BridgeError> {
        let v = call(app, "selfTest", json!({}), Duration::from_secs(5))?;
        Ok(v["missing"]
            .as_array()
            .map(|a| a.iter().filter_map(|x| x.as_str().map(str::to_string)).collect())
            .unwrap_or_default())
    }

    /// Wait until the bridge answers (page loaded), up to `timeout`.
    pub fn wait_ready(app: &AppHandle, timeout: Duration) -> bool {
        let started = Instant::now();
        while started.elapsed() < timeout {
            if call(app, "ping", json!({}), Duration::from_secs(2)).is_ok() {
                return true;
            }
            std::thread::sleep(Duration::from_millis(300));
        }
        false
    }
}

pub use runtime::{call, insert_image, insert_text, self_test, send, wait_ready};
