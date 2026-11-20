//! Shared application state.

use crate::settings::{self, Settings, ShortcutAction};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Mutex;

pub struct AppState {
    pub settings_path: PathBuf,
    pub settings: Mutex<Settings>,
    /// Registered global shortcut id → action.
    pub shortcut_map: Mutex<HashMap<u32, ShortcutAction>>,
    /// Actions whose shortcut could not be registered (taken by another app).
    pub shortcut_failures: Mutex<Vec<ShortcutAction>>,
}

impl AppState {
    pub fn load(settings_path: PathBuf) -> (Self, bool) {
        let loaded = settings::load(&settings_path);
        (
            Self {
                settings_path,
                settings: Mutex::new(loaded.settings),
                shortcut_map: Mutex::new(HashMap::new()),
                shortcut_failures: Mutex::new(Vec::new()),
            },
            loaded.recovered_from_corruption,
        )
    }

    pub fn settings(&self) -> Settings {
        self.settings.lock().unwrap().clone()
    }

    pub fn language(&self) -> &'static str {
        let setting = self.settings.lock().unwrap().language.clone();
        crate::i18n::resolve_language(&setting, crate::i18n::system_locale().as_deref())
    }
}
