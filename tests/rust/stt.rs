use gemini_tray_lib::stt::model::{self, download_file, hex, DownloadError, ModelFile};
use gemini_tray_lib::stt::resample::{resample_mono, rms, to_16k_mono, to_mono, TARGET_RATE};
use gemini_tray_lib::stt::{clean_text, Engine};
use sha2::{Digest, Sha256};
use std::io::{Cursor, Read};
use std::path::PathBuf;
use std::sync::atomic::AtomicBool;

fn fixture(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../tests/rust/fixtures").join(name)
}

fn read_wav(name: &str) -> (Vec<f32>, u32, u16) {
    let mut r = hound::WavReader::open(fixture(name)).expect("fixture wav");
    let spec = r.spec();
    let samples: Vec<f32> = r.samples::<i16>().map(|s| s.unwrap() as f32 / 32768.0).collect();
    (samples, spec.sample_rate, spec.channels)
}

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("gemini-tray-stt-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    d
}

// ---------- resampling ----------

#[test]
fn stereo_is_averaged_to_mono() {
    assert_eq!(to_mono(&[0.2, 0.4, -1.0, 1.0], 2), vec![0.3, 0.0]);
    assert_eq!(to_mono(&[0.5, 0.25], 1), vec![0.5, 0.25]);
}

#[test]
fn resampling_48k_stereo_gives_expected_length() {
    let one_second_stereo = vec![0.1f32; 48_000 * 2];
    let out = to_16k_mono(&one_second_stereo, 48_000, 2);
    assert_eq!(out.len(), 16_000);
    assert!((out[8_000] - 0.1).abs() < 1e-4, "constant signal keeps its amplitude");
}

#[test]
fn resampling_keeps_low_frequencies_and_16k_is_untouched() {
    // 440 Hz sine at 44.1 kHz → 16 kHz keeps its RMS (≈ 0.707 * amplitude).
    let sine: Vec<f32> = (0..44_100).map(|i| (i as f32 * 440.0 * std::f32::consts::TAU / 44_100.0).sin() * 0.5).collect();
    let out = resample_mono(&sine, 44_100);
    assert!((out.len() as i64 - 16_000).abs() <= 1);
    assert!((rms(&out) - 0.3535).abs() < 0.02, "rms was {}", rms(&out));
    let same = vec![0.3f32; 100];
    assert_eq!(resample_mono(&same, TARGET_RATE), same);
}

#[test]
fn text_is_cleaned() {
    assert_eq!(clean_text("  Hallo   Welt \n"), "Hallo Welt");
}

// ---------- model download ----------

fn fake_file(content: &[u8]) -> ModelFile {
    let sha: String = hex(&Sha256::digest(content));
    ModelFile { name: "test.bin", size: content.len() as u64, sha256: Box::leak(sha.into_boxed_str()) }
}

#[test]
fn download_verifies_checksum_and_reports_progress() {
    let content = b"model bytes".repeat(10_000);
    let file = fake_file(&content);
    let dir = tmp("ok");
    let data = content.clone();
    let open = move |_url: &str| -> Result<Box<dyn Read>, String> { Ok(Box::new(Cursor::new(data.clone()))) };
    let mut seen = 0u64;
    download_file(&file, &dir, &open, &mut |n| seen += n, &AtomicBool::new(false)).unwrap();
    assert_eq!(seen, content.len() as u64);
    assert_eq!(std::fs::read(dir.join("test.bin")).unwrap(), content);
    assert!(!dir.join("test.bin.part").exists());
}

#[test]
fn checksum_mismatch_deletes_the_file() {
    let file = fake_file(b"expected");
    let dir = tmp("bad");
    let open = |_url: &str| -> Result<Box<dyn Read>, String> { Ok(Box::new(Cursor::new(b"tampered".to_vec()))) };
    let err = download_file(&file, &dir, &open, &mut |_| {}, &AtomicBool::new(false)).unwrap_err();
    assert_eq!(err, DownloadError::Checksum("test.bin"));
    assert!(!dir.join("test.bin").exists());
    assert!(!dir.join("test.bin.part").exists());
}

#[test]
fn network_errors_and_cancel_are_reported() {
    let file = fake_file(b"x");
    let dir = tmp("net");
    let fail = |_url: &str| -> Result<Box<dyn Read>, String> { Err("offline".into()) };
    assert_eq!(
        download_file(&file, &dir, &fail, &mut |_| {}, &AtomicBool::new(false)).unwrap_err(),
        DownloadError::Network("offline".into())
    );
    let ok = |_url: &str| -> Result<Box<dyn Read>, String> { Ok(Box::new(Cursor::new(b"x".to_vec()))) };
    assert_eq!(
        download_file(&file, &dir, &ok, &mut |_| {}, &AtomicBool::new(true)).unwrap_err(),
        DownloadError::Cancelled
    );
}

#[test]
fn model_files_are_pinned() {
    assert_eq!(model::FILES.len(), 3);
    assert!(model::FILES.iter().all(|f| f.sha256.len() == 64));
    assert!(model::url(&model::FILES[0]).contains("/resolve/8f23f0c0"));
    assert!(!model::is_installed(&tmp("empty")));
}

// ---------- real model (needs the downloaded model) ----------
// cargo test --manifest-path src-tauri/Cargo.toml --test stt -- --ignored --nocapture

fn engine() -> Engine {
    let base = PathBuf::from(std::env::var("LOCALAPPDATA").unwrap()).join("com.sphaerox.geminitray");
    let dir = model::model_dir(&base);
    assert!(model::is_installed(&dir), "speech model not installed at {}", dir.display());
    Engine::new(dir)
}

#[test]
#[ignore]
fn recognises_german_and_english() {
    let e = engine();
    let (de, rate, ch) = read_wav("de_wetter.wav");
    let text = e.transcribe(&de, rate, ch).unwrap();
    println!("DE: {text}");
    let lower = text.to_lowercase();
    assert!(lower.contains("wetter") && lower.contains("berlin"), "got: {text}");

    let (en, rate, ch) = read_wav("en_weather.wav");
    let text = e.transcribe(&en, rate, ch).unwrap();
    println!("EN: {text}");
    let lower = text.to_lowercase();
    assert!(lower.contains("weather") && lower.contains("london"), "got: {text}");
}

#[test]
#[ignore]
fn ten_seconds_of_audio_take_at_most_two_seconds() {
    let e = engine();
    e.preload().unwrap();
    let (de, rate, ch) = read_wav("de_wetter.wav");
    let mut audio = Vec::new();
    while audio.len() < (rate as usize * ch as usize * 10) {
        audio.extend_from_slice(&de);
    }
    audio.truncate(rate as usize * ch as usize * 10);
    let started = std::time::Instant::now();
    let text = e.transcribe(&audio, rate, ch).unwrap();
    let took = started.elapsed();
    println!("10 s audio → {took:?}: {text}");
    assert!(took.as_secs_f32() <= 2.0, "too slow: {took:?}");
}

#[test]
#[ignore]
fn silence_gives_empty_text() {
    let e = engine();
    assert_eq!(e.transcribe(&vec![0.0; 48_000], 48_000, 1).unwrap(), "");
    assert_eq!(e.transcribe(&vec![0.1; 1_000], 16_000, 1).unwrap(), "");
}
