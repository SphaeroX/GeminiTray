use gemini_tray_lib::prompts::{center_top, take_for_message, Active};
use gemini_tray_lib::settings::Prompt;

fn prompt() -> Prompt {
    Prompt { id: "1".into(), name: "Kurz".into(), content: "Erkläre kurz:".into() }
}

#[test]
fn pending_prompt_is_used_once_for_the_next_message() {
    let mut a = Active { prompt: Some(prompt()), prefilled: false };
    assert_eq!(take_for_message(&mut a), Some("Erkläre kurz:".into()));
    assert_eq!(a, Active::default());
    assert_eq!(take_for_message(&mut a), None);
}

#[test]
fn prefilled_prompt_is_not_added_twice() {
    let mut a = Active { prompt: Some(prompt()), prefilled: true };
    assert_eq!(take_for_message(&mut a), None);
    assert_eq!(a, Active::default(), "selection ends after the message anyway");
}

#[test]
fn menu_is_centred_in_the_upper_part() {
    let (x, y) = center_top((0, 0), (1920, 1040), (560, 420), 0);
    assert_eq!(x, 680);
    assert!(y > 0 && y < 300);
}
