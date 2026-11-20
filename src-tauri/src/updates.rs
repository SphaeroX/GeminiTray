//! Auto-update via GitHub Releases (tauri-plugin-updater, signed with the project's updater key).
//! Disabled until a public key is configured in tauri.conf.json (plugins.updater.pubkey).

use crate::notify::{self, Level};
use serde::Serialize;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_updater::UpdaterExt;

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(tag = "state", rename_all = "camelCase")]
pub enum UpdateStatus {
    /// No updater key configured (development builds).
    Disabled,
    Idle,
    Checking,
    UpToDate,
    Available { version: String, notes: Option<String> },
    Downloading { percent: u8 },
    Error { message: String },
}

pub struct UpdateState {
    status: Mutex<UpdateStatus>,
}

pub fn pubkey_configured(app: &AppHandle) -> bool {
    app.config()
        .plugins
        .0
        .get("updater")
        .and_then(|u| u.get("pubkey"))
        .and_then(|k| k.as_str())
        .map(|k| !k.trim().is_empty())
        .unwrap_or(false)
}

/// Download progress in percent (0–100); unknown total → 0.
pub fn percent(downloaded: u64, total: Option<u64>) -> u8 {
    match total {
        Some(t) if t > 0 => ((downloaded.min(t) * 100) / t) as u8,
        _ => 0,
    }
}

impl UpdateState {
    pub fn new(app: &AppHandle) -> Self {
        let initial = if pubkey_configured(app) { UpdateStatus::Idle } else { UpdateStatus::Disabled };
        Self { status: Mutex::new(initial) }
    }
}

fn set(app: &AppHandle, s: UpdateStatus) {
    *app.state::<UpdateState>().status.lock().unwrap() = s.clone();
    let _ = app.emit("update-status", s);
}

/// Check for an update. `notify_user`: show a toast when one is available (start-up check).
pub async fn check(app: AppHandle, notify_user: bool) -> UpdateStatus {
    if !pubkey_configured(&app) {
        return UpdateStatus::Disabled;
    }
    set(&app, UpdateStatus::Checking);
    let result = match app.updater() {
        Ok(u) => u.check().await,
        Err(e) => Err(e),
    };
    let status = match result {
        Ok(Some(update)) => {
            if notify_user {
                notify::show(&app, Level::Info, "update.available", Some(update.version.clone()));
            }
            UpdateStatus::Available { version: update.version.clone(), notes: update.body.clone() }
        }
        Ok(None) => UpdateStatus::UpToDate,
        Err(e) => {
            log::warn!("update check failed: {e}");
            UpdateStatus::Error { message: e.to_string() }
        }
    };
    set(&app, status.clone());
    status
}

#[tauri::command]
pub fn update_status(app: AppHandle) -> UpdateStatus {
    app.state::<UpdateState>().status.lock().unwrap().clone()
}

#[tauri::command]
pub async fn update_check(app: AppHandle) -> UpdateStatus {
    check(app, false).await
}

#[tauri::command]
pub async fn update_install(app: AppHandle) -> Result<(), String> {
    let update = app
        .updater()
        .map_err(|e| e.to_string())?
        .check()
        .await
        .map_err(|e| e.to_string())?
        .ok_or("no update available")?;
    let mut downloaded: u64 = 0;
    let progress_app = app.clone();
    let result = update
        .download_and_install(
            move |chunk, total| {
                downloaded += chunk as u64;
                set(&progress_app, UpdateStatus::Downloading { percent: percent(downloaded, total) });
            },
            || log::info!("update downloaded, installing"),
        )
        .await;
    match result {
        Ok(()) => {
            app.restart();
        }
        Err(e) => {
            set(&app, UpdateStatus::Error { message: e.to_string() });
            Err(e.to_string())
        }
    }
}

/// Open the GitHub releases page in the default browser.
#[tauri::command]
pub fn open_releases() {
    let _ = std::process::Command::new("explorer").arg("https://github.com/SphaeroX/GeminiTray/releases").spawn();
}
