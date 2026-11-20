//! Persistent settings: model, defaults, validation, loading and saving.
//!
//! Stored as `settings.json` in the app config directory. Unknown or missing fields fall back to
//! defaults (`#[serde(default)]`), so older files keep working when new settings are added.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::str::FromStr;

pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ShortcutAction {
    Toggle,
    Voice,
    Dictation,
    Screenshot,
    NewChat,
    Prompts,
}

impl ShortcutAction {
    pub const ALL: [ShortcutAction; 6] = [
        Self::Toggle,
        Self::Voice,
        Self::Dictation,
        Self::Screenshot,
        Self::NewChat,
        Self::Prompts,
    ];
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Shortcuts {
    pub toggle: String,
    pub voice: String,
    pub dictation: String,
    pub screenshot: String,
    pub new_chat: String,
    pub prompts: String,
}

impl Default for Shortcuts {
    fn default() -> Self {
        Self {
            toggle: "Alt+Space".into(),
            voice: "Alt+V".into(),
            dictation: "Alt+Shift+V".into(),
            screenshot: "Alt+Shift+S".into(),
            new_chat: "Alt+N".into(),
            prompts: "Alt+J".into(),
        }
    }
}

impl Shortcuts {
    pub fn get(&self, action: ShortcutAction) -> &str {
        match action {
            ShortcutAction::Toggle => &self.toggle,
            ShortcutAction::Voice => &self.voice,
            ShortcutAction::Dictation => &self.dictation,
            ShortcutAction::Screenshot => &self.screenshot,
            ShortcutAction::NewChat => &self.new_chat,
            ShortcutAction::Prompts => &self.prompts,
        }
    }

    /// Pairs of (action, accelerator) for all actions that have a shortcut (empty = disabled).
    pub fn assigned(&self) -> Vec<(ShortcutAction, String)> {
        ShortcutAction::ALL
            .iter()
            .map(|a| (*a, self.get(*a).trim().to_string()))
            .filter(|(_, s)| !s.is_empty())
            .collect()
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct VoiceSettings {
    pub auto_send: bool,
    pub max_minutes: u32,
}

impl Default for VoiceSettings {
    fn default() -> Self {
        Self { auto_send: true, max_minutes: 10 }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct WindowSettings {
    /// 0.5 – 1.0
    pub opacity: f64,
    pub always_on_top: bool,
}

impl Default for WindowSettings {
    fn default() -> Self {
        Self { opacity: 1.0, always_on_top: true }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Prompt {
    pub id: String,
    pub name: String,
    pub content: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Settings {
    pub schema_version: u32,
    /// "system", "de" or "en"
    pub language: String,
    pub autostart: bool,
    pub start_minimized: bool,
    pub shortcuts: Shortcuts,
    pub voice: VoiceSettings,
    pub window: WindowSettings,
    pub prompts: Vec<Prompt>,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            schema_version: SCHEMA_VERSION,
            language: "system".into(),
            autostart: false,
            start_minimized: true,
            shortcuts: Shortcuts::default(),
            voice: VoiceSettings::default(),
            window: WindowSettings::default(),
            prompts: Vec::new(),
        }
    }
}

impl Settings {
    /// Clamp values into their valid ranges.
    pub fn normalized(mut self) -> Self {
        self.schema_version = SCHEMA_VERSION;
        if !self.window.opacity.is_finite() {
            self.window.opacity = 1.0;
        }
        self.window.opacity = self.window.opacity.clamp(0.5, 1.0);
        self.voice.max_minutes = self.voice.max_minutes.clamp(1, 30);
        if !matches!(self.language.as_str(), "system" | "de" | "en") {
            self.language = "system".into();
        }
        self
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum ShortcutProblem {
    /// The accelerator string cannot be parsed.
    Invalid { action: ShortcutAction },
    /// Two actions use the same key combination.
    Duplicate { action: ShortcutAction, other: ShortcutAction },
    /// Windows refused the registration (usually another app owns it).
    Taken { action: ShortcutAction },
}

/// Parse an accelerator into a normalized form (`ALT+SHIFT+KeyS`-like) for comparisons.
fn canonical(accel: &str) -> Option<String> {
    tauri_plugin_global_shortcut::Shortcut::from_str(accel)
        .ok()
        .map(|s| s.into_string())
}

/// Checks syntax and duplicates (not whether Windows accepts the registration).
pub fn validate_shortcuts(s: &Shortcuts) -> Vec<ShortcutProblem> {
    let mut problems = Vec::new();
    let mut seen: HashMap<String, ShortcutAction> = HashMap::new();
    for (action, accel) in s.assigned() {
        let Some(canon) = canonical(&accel) else {
            problems.push(ShortcutProblem::Invalid { action });
            continue;
        };
        if let Some(other) = seen.get(&canon) {
            problems.push(ShortcutProblem::Duplicate { action, other: *other });
        } else {
            seen.insert(canon, action);
        }
    }
    problems
}

/// Result of loading: the settings plus a warning when the file was unreadable.
#[derive(Debug)]
pub struct Loaded {
    pub settings: Settings,
    pub recovered_from_corruption: bool,
}

pub fn load(path: &Path) -> Loaded {
    match std::fs::read_to_string(path) {
        Ok(text) => match serde_json::from_str::<Settings>(&text) {
            Ok(s) => Loaded { settings: s.normalized(), recovered_from_corruption: false },
            Err(e) => {
                log::warn!("settings file is corrupt ({e}); using defaults");
                let _ = std::fs::rename(path, path.with_extension("broken.json"));
                Loaded { settings: Settings::default(), recovered_from_corruption: true }
            }
        },
        Err(_) => Loaded { settings: Settings::default(), recovered_from_corruption: false },
    }
}

/// Atomic save: write to a temp file, then replace.
pub fn save(path: &Path, settings: &Settings) -> std::io::Result<()> {
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir)?;
    }
    let tmp: PathBuf = path.with_extension("json.tmp");
    let json = serde_json::to_string_pretty(settings).map_err(std::io::Error::other)?;
    std::fs::write(&tmp, json)?;
    std::fs::rename(&tmp, path)
}
