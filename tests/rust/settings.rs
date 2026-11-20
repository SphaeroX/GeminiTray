use gemini_tray_lib::i18n::{resolve_language, t};
use gemini_tray_lib::settings::{
    load, save, validate_shortcuts, Settings, ShortcutAction, ShortcutProblem, Shortcuts, SCHEMA_VERSION,
};
use std::path::PathBuf;

fn temp_file(name: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("gemini-tray-test-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).unwrap();
    dir.join("settings.json")
}

#[test]
fn missing_file_gives_defaults() {
    let path = temp_file("missing");
    let loaded = load(&path);
    assert_eq!(loaded.settings, Settings::default());
    assert!(!loaded.recovered_from_corruption);
}

#[test]
fn corrupt_file_gives_defaults_and_is_kept_as_backup() {
    let path = temp_file("corrupt");
    std::fs::write(&path, "{ not json").unwrap();
    let loaded = load(&path);
    assert_eq!(loaded.settings, Settings::default());
    assert!(loaded.recovered_from_corruption);
    assert!(path.with_extension("broken.json").exists());
}

#[test]
fn save_and_load_roundtrip() {
    let path = temp_file("roundtrip");
    let mut s = Settings::default();
    s.autostart = true;
    s.language = "en".into();
    s.shortcuts.voice = "Ctrl+Alt+V".into();
    save(&path, &s).unwrap();
    assert_eq!(load(&path).settings, s);
}

#[test]
fn older_file_without_new_fields_is_upgraded() {
    let path = temp_file("old");
    std::fs::write(&path, r#"{"schemaVersion":0,"autostart":true,"shortcuts":{"toggle":"Alt+G"}}"#).unwrap();
    let s = load(&path).settings;
    assert!(s.autostart);
    assert_eq!(s.shortcuts.toggle, "Alt+G");
    assert_eq!(s.shortcuts.voice, "Alt+V");
    assert!(s.prompts.is_empty());
    assert_eq!(s.schema_version, SCHEMA_VERSION);
}

#[test]
fn values_are_clamped() {
    let mut s = Settings::default();
    s.window.opacity = 0.1;
    s.voice.max_minutes = 999;
    s.language = "fr".into();
    let n = s.normalized();
    assert_eq!(n.window.opacity, 0.5);
    assert_eq!(n.voice.max_minutes, 30);
    assert_eq!(n.language, "system");
}

#[test]
fn default_shortcuts_are_valid() {
    assert!(validate_shortcuts(&Shortcuts::default()).is_empty());
}

#[test]
fn duplicate_shortcuts_are_rejected_even_with_different_spelling() {
    let mut s = Shortcuts::default();
    s.voice = "Shift+Alt+S".into(); // same as screenshot "Alt+Shift+S"
    let problems = validate_shortcuts(&s);
    assert_eq!(problems.len(), 1);
    assert!(matches!(
        problems[0],
        ShortcutProblem::Duplicate { action: ShortcutAction::Screenshot, other: ShortcutAction::Voice }
            | ShortcutProblem::Duplicate { action: ShortcutAction::Voice, other: ShortcutAction::Screenshot }
    ));
}

#[test]
fn invalid_and_empty_shortcuts() {
    let mut s = Shortcuts::default();
    s.prompts = "Alt+Banana".into();
    s.new_chat = String::new(); // disabled, not an error
    let problems = validate_shortcuts(&s);
    assert_eq!(problems, vec![ShortcutProblem::Invalid { action: ShortcutAction::Prompts }]);
    assert!(!s.assigned().iter().any(|(a, _)| *a == ShortcutAction::NewChat));
}

#[test]
fn language_resolution() {
    assert_eq!(resolve_language("system", Some("de-DE")), "de");
    assert_eq!(resolve_language("system", Some("en-US")), "en");
    assert_eq!(resolve_language("system", None), "en");
    assert_eq!(resolve_language("de", Some("en-US")), "de");
}

#[test]
fn tray_texts_are_translated() {
    assert_eq!(t("de", "tray.quit"), "Beenden");
    assert_eq!(t("en", "tray.quit"), "Quit");
    assert_eq!(t("de", "does.not.exist"), "does.not.exist");
}
