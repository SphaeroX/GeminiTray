//! Pure coordinate math for the selection overlay (fully testable).

use serde::Deserialize;

/// A rectangle in CSS pixels of an overlay window, as reported by the page (any drag direction).
#[derive(Debug, Clone, Copy, PartialEq, Deserialize)]
pub struct CssRect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

/// A rectangle in physical pixels of the captured monitor image.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PixelRect {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

/// Smallest selection (physical px per side) that is accepted; smaller drags count as a click.
pub const MIN_SIZE: u32 = 5;

/// Convert a selection in CSS px (overlay covers exactly one monitor) to image pixels.
/// Negative width/height (dragging up/left) is normalised; the result is clamped to the image.
/// Returns `None` when the remaining area is smaller than [`MIN_SIZE`].
pub fn to_pixels(sel: CssRect, scale: f64, image_width: u32, image_height: u32) -> Option<PixelRect> {
    if !(scale.is_finite() && scale > 0.0) {
        return None;
    }
    let (x0, x1) = ordered(sel.x, sel.x + sel.width);
    let (y0, y1) = ordered(sel.y, sel.y + sel.height);
    let clamp_x = |v: f64| (v * scale).round().clamp(0.0, image_width as f64) as u32;
    let clamp_y = |v: f64| (v * scale).round().clamp(0.0, image_height as f64) as u32;
    let (px0, px1) = (clamp_x(x0), clamp_x(x1));
    let (py0, py1) = (clamp_y(y0), clamp_y(y1));
    let (w, h) = (px1 - px0, py1 - py0);
    if w < MIN_SIZE || h < MIN_SIZE {
        return None;
    }
    Some(PixelRect { x: px0, y: py0, width: w, height: h })
}

fn ordered(a: f64, b: f64) -> (f64, f64) {
    if a <= b { (a, b) } else { (b, a) }
}

/// The overlay window for a monitor: placed at the monitor's physical position with its physical
/// size (monitors left of / above the primary one have negative coordinates).
pub fn overlay_bounds(monitor_x: i32, monitor_y: i32, width: u32, height: u32) -> (i32, i32, u32, u32) {
    (monitor_x, monitor_y, width.max(1), height.max(1))
}
