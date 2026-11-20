//! Native microphone recording (cpal / WASAPI). The cpal stream lives on its own thread because
//! it is not `Send`; the caller gets a handle to stop it and collect the samples.

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{FromSample, Sample, SampleFormat, SizedSample};
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread::JoinHandle;

#[derive(Debug, Clone, PartialEq)]
pub enum AudioError {
    NoDevice,
    /// Windows privacy setting blocks microphone access (or the device is exclusive).
    AccessDenied(String),
    Stream(String),
}

impl std::fmt::Display for AudioError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoDevice => write!(f, "no microphone found"),
            Self::AccessDenied(e) => write!(f, "microphone access denied: {e}"),
            Self::Stream(e) => write!(f, "microphone error: {e}"),
        }
    }
}

pub struct Recording {
    pub samples: Vec<f32>,
    pub sample_rate: u32,
    pub channels: u16,
}

/// Shared state between the audio callback and the app.
struct Shared {
    samples: Mutex<Vec<f32>>,
    /// Current level 0..1 as f32 bits.
    level: AtomicU32,
    failed: AtomicBool,
    error: Mutex<Option<String>>,
}

pub struct Recorder {
    shared: Arc<Shared>,
    stop: mpsc::Sender<()>,
    thread: Option<JoinHandle<()>>,
    pub sample_rate: u32,
    pub channels: u16,
}

pub fn input_device_names() -> Vec<String> {
    let host = cpal::default_host();
    host.input_devices()
        .map(|it| it.map(|d| d.to_string()).collect())
        .unwrap_or_default()
}

fn pick_device(name: Option<&str>) -> Option<cpal::Device> {
    let host = cpal::default_host();
    if let Some(name) = name {
        if let Ok(mut devices) = host.input_devices() {
            if let Some(d) = devices.find(|d| d.to_string() == name) {
                return Some(d);
            }
        }
        log::warn!("microphone '{name}' not found, using the default device");
    }
    host.default_input_device()
}

fn classify(e: &cpal::Error) -> AudioError {
    let text = e.to_string();
    let lower = text.to_lowercase();
    if lower.contains("denied") || lower.contains("permission") || lower.contains("0x80070005") {
        AudioError::AccessDenied(text)
    } else {
        AudioError::Stream(text)
    }
}

/// Errors that end the recording (device gone). Glitches like buffer over-runs are ignored.
fn is_fatal(e: &cpal::Error) -> bool {
    !matches!(e.kind(), cpal::ErrorKind::Xrun | cpal::ErrorKind::RealtimeDenied | cpal::ErrorKind::DeviceChanged)
}

fn build<T>(
    device: &cpal::Device,
    config: cpal::StreamConfig,
    shared: Arc<Shared>,
) -> Result<cpal::Stream, cpal::Error>
where
    T: SizedSample,
    f32: FromSample<T>,
{
    let err_shared = shared.clone();
    device.build_input_stream::<T, _, _>(
        config,
        move |data: &[T], _| {
            let mut sum = 0.0f32;
            let mut buf = shared.samples.lock().unwrap();
            buf.reserve(data.len());
            for s in data {
                let v = f32::from_sample(*s);
                sum += v * v;
                buf.push(v);
            }
            let rms = if data.is_empty() { 0.0 } else { (sum / data.len() as f32).sqrt() };
            shared.level.store(rms.to_bits(), Ordering::Relaxed);
        },
        move |e| {
            log::error!("audio stream error: {e}");
            *err_shared.error.lock().unwrap() = Some(e.to_string());
            if is_fatal(&e) {
                err_shared.failed.store(true, Ordering::SeqCst);
            }
        },
        None,
    )
}

impl Recorder {
    /// Open the device and start recording immediately.
    pub fn start(device_name: Option<&str>) -> Result<Self, AudioError> {
        let device = pick_device(device_name).ok_or(AudioError::NoDevice)?;
        let supported = device.default_input_config().map_err(|e| classify(&e))?;
        let sample_rate = supported.sample_rate();
        let channels = supported.channels();
        let format = supported.sample_format();
        let config: cpal::StreamConfig = supported.into();
        let shared = Arc::new(Shared {
            samples: Mutex::new(Vec::with_capacity(sample_rate as usize * channels as usize * 30)),
            level: AtomicU32::new(0),
            failed: AtomicBool::new(false),
            error: Mutex::new(None),
        });
        let (stop_tx, stop_rx) = mpsc::channel::<()>();
        let (ready_tx, ready_rx) = mpsc::channel::<Result<(), AudioError>>();
        let thread_shared = shared.clone();
        let thread = std::thread::spawn(move || {
            let stream = match format {
                SampleFormat::F32 => build::<f32>(&device, config, thread_shared),
                SampleFormat::I16 => build::<i16>(&device, config, thread_shared),
                SampleFormat::I32 => build::<i32>(&device, config, thread_shared),
                SampleFormat::U16 => build::<u16>(&device, config, thread_shared),
                SampleFormat::U8 => build::<u8>(&device, config, thread_shared),
                SampleFormat::I8 => build::<i8>(&device, config, thread_shared),
                other => {
                    let _ = ready_tx.send(Err(AudioError::Stream(format!("unsupported format {other:?}"))));
                    return;
                }
            };
            let stream = match stream {
                Ok(s) => s,
                Err(e) => {
                    let _ = ready_tx.send(Err(classify(&e)));
                    return;
                }
            };
            if let Err(e) = stream.play() {
                let _ = ready_tx.send(Err(classify(&e)));
                return;
            }
            let _ = ready_tx.send(Ok(()));
            // Keep the stream alive until stop is requested (or the sender is dropped).
            let _ = stop_rx.recv();
            drop(stream);
        });
        match ready_rx.recv() {
            Ok(Ok(())) => Ok(Self { shared, stop: stop_tx, thread: Some(thread), sample_rate, channels }),
            Ok(Err(e)) => {
                let _ = thread.join();
                Err(e)
            }
            Err(_) => Err(AudioError::Stream("audio thread ended".into())),
        }
    }

    pub fn level(&self) -> f32 {
        f32::from_bits(self.shared.level.load(Ordering::Relaxed))
    }

    /// True when the device reported an error (e.g. unplugged).
    pub fn failed(&self) -> bool {
        self.shared.failed.load(Ordering::SeqCst)
    }

    /// Last stream error message (fatal or not).
    pub fn last_error(&self) -> Option<String> {
        self.shared.error.lock().unwrap().clone()
    }

    pub fn seconds(&self) -> f32 {
        let n = self.shared.samples.lock().unwrap().len();
        n as f32 / (self.sample_rate as f32 * self.channels.max(1) as f32)
    }

    /// Stop recording and return what was captured.
    pub fn finish(mut self) -> Recording {
        let _ = self.stop.send(());
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
        let samples = std::mem::take(&mut *self.shared.samples.lock().unwrap());
        Recording { samples, sample_rate: self.sample_rate, channels: self.channels }
    }
}

impl Drop for Recorder {
    fn drop(&mut self) {
        let _ = self.stop.send(());
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
    }
}

// Silence unused-import warning on Sample (needed for from_sample trait resolution).
#[allow(dead_code)]
fn _sample_bound<T: Sample>() {}
