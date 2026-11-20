use gemini_tray_lib::voice_message::{compose, should_send};

#[test]
fn plain_text_is_trimmed() {
    assert_eq!(compose(None, "  Wie spät ist es?  "), Some("Wie spät ist es?".into()));
}

#[test]
fn prompt_prefix_is_separated_by_a_blank_line() {
    assert_eq!(
        compose(Some("Erkläre kurz:"), "Quantencomputer"),
        Some("Erkläre kurz:\n\nQuantencomputer".into())
    );
}

#[test]
fn empty_prefix_is_ignored() {
    assert_eq!(compose(Some("   "), "Hallo"), Some("Hallo".into()));
}

#[test]
fn nothing_recognised_gives_none_even_with_prefix() {
    assert_eq!(compose(Some("Erkläre kurz:"), "   "), None);
    assert_eq!(compose(None, ""), None);
}

#[test]
fn auto_send_setting_decides() {
    assert!(should_send(true));
    assert!(!should_send(false));
}
