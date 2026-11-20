//! Local speech recognition with NVIDIA Parakeet TDT 0.6B v3 (int8, ONNX Runtime, CPU).
//! German and English (and 23 other European languages) are detected automatically.

pub mod model;
pub mod resample;
pub mod service;

use parakeet_rs::{ExecutionConfig, ParakeetTDT, Transcriber};
use std::path::{Path, PathBuf};
use std::sync::Mutex;

#[derive(Debug)]
pub enum SttError {
    ModelMissing,
    Load(String),
    Transcribe(String),
}

impl std::fmt::Display for SttError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ModelMissing => write!(f, "speech model not installed"),
            Self::Load(e) => write!(f, "speech model could not be loaded: {e}"),
            Self::Transcribe(e) => write!(f, "speech recognition failed: {e}"),
        }
    }
}

/// Lazily loaded recogniser; the model stays in memory after the first use.
pub struct Engine {
    dir: PathBuf,
    model: Mutex<Option<ParakeetTDT>>,
}

impl Engine {
    pub fn new(dir: PathBuf) -> Self {
        Self { dir, model: Mutex::new(None) }
    }

    pub fn dir(&self) -> &Path {
        &self.dir
    }

    pub fn is_installed(&self) -> bool {
        model::is_installed(&self.dir)
    }

    pub fn is_loaded(&self) -> bool {
        self.model.lock().unwrap().is_some()
    }

    /// Load the model now (e.g. when recording starts, so it is ready when recording ends).
    pub fn preload(&self) -> Result<(), SttError> {
        let mut guard = self.model.lock().unwrap();
        if guard.is_none() {
            if !self.is_installed() {
                return Err(SttError::ModelMissing);
            }
            let started = std::time::Instant::now();
            let env = parakeet_rs::ort::init().build().map_err(|e| SttError::Load(e.to_string()))?;
            let config = ExecutionConfig::new().with_environment(env);
            let m = ParakeetTDT::from_pretrained(&self.dir, Some(config)).map_err(|e| SttError::Load(e.to_string()))?;
            log::info!("speech model loaded in {:?}", started.elapsed());
            *guard = Some(m);
        }
        Ok(())
    }

    /// Transcribe audio of any rate/channel count. Returns trimmed text (may be empty).
    pub fn transcribe(&self, samples: &[f32], rate: u32, channels: u16) -> Result<String, SttError> {
        self.preload()?;
        let audio = resample::to_16k_mono(samples, rate, channels);
        // Less than 0.3 s or pure silence: nothing to recognise.
        if audio.len() < (resample::TARGET_RATE as usize * 3 / 10) || resample::rms(&audio) < 0.002 {
            return Ok(String::new());
        }
        let mut guard = self.model.lock().unwrap();
        let m = guard.as_mut().ok_or(SttError::ModelMissing)?;
        let started = std::time::Instant::now();
        let result = m
            .transcribe_samples(audio.clone(), resample::TARGET_RATE, 1, None)
            .map_err(|e| SttError::Transcribe(e.to_string()))?;
        log::info!(
            "transcribed {:.1}s of audio in {:?}",
            audio.len() as f32 / resample::TARGET_RATE as f32,
            started.elapsed()
        );
        Ok(clean_text(&result.text))
    }

    pub fn unload(&self) {
        *self.model.lock().unwrap() = None;
    }
}

/// Collapse whitespace and trim.
pub fn clean_text(s: &str) -> String {
    s.split_whitespace().collect::<Vec<_>>().join(" ")
}
