//! Microphone level for the indicator bars (pure maths, testable).

/// Quietest level that still moves the bars (room noise stays flat).
const FLOOR_DB: f32 = -50.0;
/// Level at which the bars are at full height.
const CEIL_DB: f32 = -6.0;

/// Map a peak amplitude (0..1, linear) to a bar level 0..1 on a dB scale.
pub fn level(peak: f32) -> f32 {
    if !(peak > 0.0) {
        return 0.0;
    }
    let db = 20.0 * peak.min(1.0).log10();
    ((db - FLOOR_DB) / (CEIL_DB - FLOOR_DB)).clamp(0.0, 1.0)
}

/// Fast rise, slow fall, so the bars follow speech without flickering.
pub fn smooth(previous: f32, target: f32) -> f32 {
    if target >= previous { target } else { (previous * 0.7).max(target) }
}
