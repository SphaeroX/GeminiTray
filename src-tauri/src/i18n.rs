//! Rust-side translations (tray menu). The UI uses the same JSON files via vue-i18n.

use serde_json::Value;
use std::sync::OnceLock;

const DE: &str = include_str!("../../src/locales/de.json");
const EN: &str = include_str!("../../src/locales/en.json");

fn parsed(lang: &str) -> &'static Value {
    static DE_V: OnceLock<Value> = OnceLock::new();
    static EN_V: OnceLock<Value> = OnceLock::new();
    match lang {
        "de" => DE_V.get_or_init(|| serde_json::from_str(DE).unwrap_or(Value::Null)),
        _ => EN_V.get_or_init(|| serde_json::from_str(EN).unwrap_or(Value::Null)),
    }
}

/// Resolve the setting ("system", "de", "en") and a system locale (e.g. "de-DE") to "de" or "en".
pub fn resolve_language(setting: &str, system_locale: Option<&str>) -> &'static str {
    match setting {
        "de" => "de",
        "en" => "en",
        _ => match system_locale {
            Some(l) if l.to_ascii_lowercase().starts_with("de") => "de",
            _ => "en",
        },
    }
}

pub fn system_locale() -> Option<String> {
    sys_locale::get_locale()
}

/// Look up a dotted key (e.g. `tray.quit`); falls back to English, then to the key itself.
pub fn t(lang: &str, key: &str) -> String {
    let lookup = |v: &Value| -> Option<String> {
        key.split('.').try_fold(v, |acc, part| acc.get(part)).and_then(|v| v.as_str()).map(str::to_string)
    };
    lookup(parsed(lang)).or_else(|| lookup(parsed("en"))).unwrap_or_else(|| key.to_string())
}
