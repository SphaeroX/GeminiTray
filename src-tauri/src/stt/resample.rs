//! Converting microphone audio (any rate, any channel count) to 16 kHz mono for Parakeet.

pub const TARGET_RATE: u32 = 16_000;

/// Average interleaved channels into one.
pub fn to_mono(samples: &[f32], channels: u16) -> Vec<f32> {
    let ch = channels.max(1) as usize;
    if ch == 1 {
        return samples.to_vec();
    }
    samples
        .chunks(ch)
        .map(|frame| frame.iter().sum::<f32>() / frame.len() as f32)
        .collect()
}

/// Resample mono audio to 16 kHz. Downsampling applies a moving-average low-pass first to avoid
/// aliasing, then linear interpolation – sufficient for speech recognition.
pub fn resample_mono(mono: &[f32], rate: u32) -> Vec<f32> {
    if rate == TARGET_RATE || mono.is_empty() || rate == 0 {
        return mono.to_vec();
    }
    let ratio = rate as f64 / TARGET_RATE as f64;
    let filtered: Vec<f32> = if ratio > 1.0 {
        let width = ratio.ceil() as usize;
        let mut out = Vec::with_capacity(mono.len());
        let mut acc = 0.0f32;
        for i in 0..mono.len() {
            acc += mono[i];
            if i >= width {
                acc -= mono[i - width];
            }
            out.push(acc / (i + 1).min(width) as f32);
        }
        out
    } else {
        mono.to_vec()
    };
    let out_len = ((mono.len() as f64) / ratio).floor() as usize;
    (0..out_len)
        .map(|i| {
            let pos = i as f64 * ratio;
            let idx = pos.floor() as usize;
            let frac = (pos - idx as f64) as f32;
            let a = filtered[idx.min(filtered.len() - 1)];
            let b = filtered[(idx + 1).min(filtered.len() - 1)];
            a + (b - a) * frac
        })
        .collect()
}

pub fn to_16k_mono(samples: &[f32], rate: u32, channels: u16) -> Vec<f32> {
    resample_mono(&to_mono(samples, channels), rate)
}

/// Root mean square level (0..1) – used for the level meter and to detect silence.
pub fn rms(samples: &[f32]) -> f32 {
    if samples.is_empty() {
        return 0.0;
    }
    (samples.iter().map(|s| s * s).sum::<f32>() / samples.len() as f32).sqrt()
}
