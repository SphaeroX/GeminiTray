//! App integration of the speech model: download state, progress events, commands.

use super::{model, Engine};
use crate::notify::{self, Level};
use serde::Serialize;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ModelStatus {
    pub installed: bool,
    pub downloading: bool,
    pub downloaded: u64,
    pub total: u64,
    pub error: Option<String>,
}

pub struct SttState {
    pub engine: Arc<Engine>,
    status: Mutex<ModelStatus>,
    cancel: AtomicBool,
}

impl SttState {
    pub fn new(app: &AppHandle) -> Self {
        let base = app.path().app_local_data_dir().unwrap_or_else(|_| std::env::temp_dir());
        let engine = Engine::new(model::model_dir(&base));
        let installed = engine.is_installed();
        Self {
            engine: Arc::new(engine),
            status: Mutex::new(ModelStatus {
                installed,
                downloading: false,
                downloaded: if installed { model::total_size() } else { 0 },
                total: model::total_size(),
                error: None,
            }),
            cancel: AtomicBool::new(false),
        }
    }

    pub fn status(&self) -> ModelStatus {
        self.status.lock().unwrap().clone()
    }
}

fn update(app: &AppHandle, f: impl FnOnce(&mut ModelStatus)) {
    let state = app.state::<SttState>();
    let snapshot = {
        let mut s = state.status.lock().unwrap();
        f(&mut s);
        s.clone()
    };
    let _ = app.emit("model-progress", snapshot);
}

/// Start downloading the model in the background (no-op if installed or already running).
pub fn start_download(app: &AppHandle) {
    let state = app.state::<SttState>();
    {
        let s = state.status.lock().unwrap();
        if s.installed || s.downloading {
            return;
        }
    }
    state.cancel.store(false, Ordering::SeqCst);
    update(app, |s| {
        s.downloading = true;
        s.error = None;
    });
    let app = app.clone();
    std::thread::spawn(move || {
        let state = app.state::<SttState>();
        let dir = state.engine.dir().to_path_buf();
        let mut last_emit = std::time::Instant::now();
        let result = model::download_model(
            &dir,
            &model::http_open,
            &mut |done, total| {
                // Throttle events to ~10 per second.
                if last_emit.elapsed().as_millis() >= 100 || done == total {
                    last_emit = std::time::Instant::now();
                    update(&app, |s| {
                        s.downloaded = done;
                        s.total = total;
                    });
                }
            },
            &state.cancel,
        );
        match result {
            Ok(()) => {
                update(&app, |s| {
                    s.downloading = false;
                    s.installed = true;
                    s.downloaded = s.total;
                });
                notify::show(&app, Level::Success, "model.ready", None);
            }
            Err(model::DownloadError::Cancelled) => update(&app, |s| {
                s.downloading = false;
            }),
            Err(e) => {
                log::error!("model download failed: {e}");
                update(&app, |s| {
                    s.downloading = false;
                    s.error = Some(e.to_string());
                });
                notify::show(&app, Level::Error, "model.failed", Some(e.to_string()));
            }
        }
    });
}

#[tauri::command]
pub fn model_status(state: State<'_, SttState>) -> ModelStatus {
    state.status()
}

#[tauri::command]
pub fn model_download(app: AppHandle) {
    start_download(&app);
}

#[tauri::command]
pub fn model_cancel(state: State<'_, SttState>) {
    state.cancel.store(true, Ordering::SeqCst);
}
