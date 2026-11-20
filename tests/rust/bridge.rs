use gemini_tray_lib::bridge::{parse_poll, poll_script, start_script, BridgeError, PollState, SCRIPT};
use serde_json::json;

#[test]
fn bundled_script_installs_the_bridge() {
    assert!(SCRIPT.contains("__geminiTray"));
    assert!(SCRIPT.len() > 500, "bridge bundle looks empty – run npm run build:bridge");
}

#[test]
fn pending_and_missing() {
    assert_eq!(parse_poll("null"), PollState::Pending);
    assert_eq!(parse_poll(""), PollState::Pending);
    assert_eq!(parse_poll("\"missing\""), PollState::Missing);
}

#[test]
fn success_value_is_returned() {
    assert_eq!(parse_poll(r#"{"ok":true,"value":"pong"}"#), PollState::Done(Ok(json!("pong"))));
    assert_eq!(parse_poll(r#"{"ok":true,"value":null}"#), PollState::Done(Ok(json!(null))));
}

#[test]
fn errors_are_typed() {
    assert_eq!(
        parse_poll(r#"{"ok":false,"code":"selector_missing","detail":"editor"}"#),
        PollState::Done(Err(BridgeError::SelectorMissing("editor".into())))
    );
    assert_eq!(
        parse_poll(r#"{"ok":false,"code":"not_attached","detail":"no preview"}"#),
        PollState::Done(Err(BridgeError::NotAttached))
    );
    assert_eq!(parse_poll(r#"{"ok":false,"code":"timeout","detail":"x"}"#), PollState::Done(Err(BridgeError::Timeout)));
    assert!(matches!(
        parse_poll(r#"{"ok":false,"code":"script","detail":"boom"}"#),
        PollState::Done(Err(BridgeError::Script(_)))
    ));
}

#[test]
fn scripts_escape_their_arguments() {
    let s = start_script("op1", "insertText", &json!({"text": "Er sagte \"hi\"\n'); alert(1); //"}));
    assert!(s.starts_with("window.__geminiTray && window.__geminiTray.start(\"op1\", \"insertText\", {"));
    assert!(s.contains(r#"\"hi\"\n"#));
    assert!(poll_script("op7").contains("poll(\"op7\")"));
}
