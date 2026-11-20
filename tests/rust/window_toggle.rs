use gemini_tray_lib::windowing::{toggle_action, ToggleAction};

#[test]
fn visible_and_focused_window_is_hidden() {
    assert_eq!(toggle_action(true, true, false), ToggleAction::Hide);
}

#[test]
fn visible_but_unfocused_window_is_brought_to_front() {
    assert_eq!(toggle_action(true, false, false), ToggleAction::Show);
}

#[test]
fn hidden_window_is_shown() {
    assert_eq!(toggle_action(false, false, false), ToggleAction::Show);
}

#[test]
fn minimized_window_is_restored_even_if_reported_focused() {
    assert_eq!(toggle_action(true, true, true), ToggleAction::Show);
}
