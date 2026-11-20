//! The Parakeet TDT 0.6B v3 (int8) model files: where they live, download and verification.

use sha2::{Digest, Sha256};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

pub const MODEL_DIR_NAME: &str = "parakeet-tdt-0.6b-v3-int8";
const BASE_URL: &str =
    "https://huggingface.co/istupakov/parakeet-tdt-0.6b-v3-onnx/resolve/8f23f0c03c8761650bdb5b40aaf3e40d2c15f1ce";

#[derive(Debug, Clone, Copy)]
pub struct ModelFile {
    pub name: &'static str,
    pub size: u64,
    pub sha256: &'static str,
}

/// Pinned to a fixed repository revision; sizes and hashes verified on 2026-11-20.
pub const FILES: &[ModelFile] = &[
    ModelFile {
        name: "vocab.txt",
        size: 93_939,
        sha256: "d58544679ea4bc6ac563d1f545eb7d474bd6cfa467f0a6e2c1dc1c7d37e3c35d",
    },
    ModelFile {
        name: "decoder_joint-model.int8.onnx",
        size: 18_202_004,
        sha256: "eea7483ee3d1a30375daedc8ed83e3960c91b098812127a0d99d1c8977667a70",
    },
    ModelFile {
        name: "encoder-model.int8.onnx",
        size: 652_183_999,
        sha256: "6139d2fa7e1b086097b277c7149725edbab89cc7c7ae64b23c741be4055aff09",
    },
];

pub fn total_size() -> u64 {
    FILES.iter().map(|f| f.size).sum()
}

pub fn url(file: &ModelFile) -> String {
    format!("{BASE_URL}/{}", file.name)
}

pub fn model_dir(app_local_data: &Path) -> PathBuf {
    app_local_data.join("models").join(MODEL_DIR_NAME)
}

/// Installed = every file exists with the expected size (hashes are checked after download).
pub fn is_installed(dir: &Path) -> bool {
    FILES.iter().all(|f| std::fs::metadata(dir.join(f.name)).map(|m| m.len() == f.size).unwrap_or(false))
}

#[derive(Debug, PartialEq)]
pub enum DownloadError {
    Network(String),
    Io(String),
    Checksum(&'static str),
    Cancelled,
}

impl std::fmt::Display for DownloadError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Network(e) => write!(f, "download failed: {e}"),
            Self::Io(e) => write!(f, "could not save the model: {e}"),
            Self::Checksum(n) => write!(f, "checksum mismatch for {n}"),
            Self::Cancelled => write!(f, "cancelled"),
        }
    }
}

/// Download one file to `dest` while hashing it. On checksum mismatch the file is deleted.
/// `progress(bytes_added)` is called for every chunk.
pub fn download_file(
    file: &ModelFile,
    dest_dir: &Path,
    open: &dyn Fn(&str) -> Result<Box<dyn Read>, String>,
    progress: &mut dyn FnMut(u64),
    cancel: &AtomicBool,
) -> Result<(), DownloadError> {
    std::fs::create_dir_all(dest_dir).map_err(|e| DownloadError::Io(e.to_string()))?;
    let final_path = dest_dir.join(file.name);
    let part = dest_dir.join(format!("{}.part", file.name));
    let mut reader = open(&url(file)).map_err(DownloadError::Network)?;
    let mut out = std::fs::File::create(&part).map_err(|e| DownloadError::Io(e.to_string()))?;
    let mut hasher = Sha256::new();
    let mut buf = vec![0u8; 256 * 1024];
    loop {
        if cancel.load(Ordering::Relaxed) {
            drop(out);
            let _ = std::fs::remove_file(&part);
            return Err(DownloadError::Cancelled);
        }
        let n = reader.read(&mut buf).map_err(|e| DownloadError::Network(e.to_string()))?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
        out.write_all(&buf[..n]).map_err(|e| DownloadError::Io(e.to_string()))?;
        progress(n as u64);
    }
    out.flush().map_err(|e| DownloadError::Io(e.to_string()))?;
    drop(out);
    let digest = hex(&hasher.finalize());
    if digest != file.sha256 {
        let _ = std::fs::remove_file(&part);
        return Err(DownloadError::Checksum(file.name));
    }
    std::fs::rename(&part, &final_path).map_err(|e| DownloadError::Io(e.to_string()))?;
    Ok(())
}

pub fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

/// Download all missing files of the model.
pub fn download_model(
    dir: &Path,
    open: &dyn Fn(&str) -> Result<Box<dyn Read>, String>,
    progress: &mut dyn FnMut(u64, u64),
    cancel: &AtomicBool,
) -> Result<(), DownloadError> {
    let total = total_size();
    let mut done: u64 = FILES
        .iter()
        .filter(|f| std::fs::metadata(dir.join(f.name)).map(|m| m.len() == f.size).unwrap_or(false))
        .map(|f| f.size)
        .sum();
    progress(done, total);
    for f in FILES {
        if std::fs::metadata(dir.join(f.name)).map(|m| m.len() == f.size).unwrap_or(false) {
            continue;
        }
        download_file(f, dir, open, &mut |n| {
            done += n;
            progress(done, total);
        }, cancel)?;
    }
    Ok(())
}

/// Real HTTP opener (ureq).
pub fn http_open(url: &str) -> Result<Box<dyn Read>, String> {
    let resp = ureq::get(url).call().map_err(|e| e.to_string())?;
    Ok(Box::new(resp.into_body().into_reader()))
}
