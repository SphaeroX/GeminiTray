use gemini_tray_lib::screenshot::geometry::{overlay_bounds, to_pixels, CssRect, PixelRect};

fn css(x: f64, y: f64, width: f64, height: f64) -> CssRect {
    CssRect { x, y, width, height }
}

#[test]
fn scale_100_percent_is_identity() {
    assert_eq!(
        to_pixels(css(10.0, 20.0, 300.0, 200.0), 1.0, 1920, 1080),
        Some(PixelRect { x: 10, y: 20, width: 300, height: 200 })
    );
}

#[test]
fn scale_150_percent_multiplies() {
    assert_eq!(
        to_pixels(css(100.0, 50.0, 400.0, 160.0), 1.5, 3840, 2160),
        Some(PixelRect { x: 150, y: 75, width: 600, height: 240 })
    );
}

#[test]
fn mixed_scaling_uses_the_monitor_of_the_overlay() {
    // Same CSS selection on a 125 % laptop panel and a 100 % external monitor.
    assert_eq!(to_pixels(css(0.0, 0.0, 100.0, 100.0), 1.25, 2560, 1600).unwrap().width, 125);
    assert_eq!(to_pixels(css(0.0, 0.0, 100.0, 100.0), 1.0, 1920, 1080).unwrap().width, 100);
}

#[test]
fn reversed_drag_is_normalised() {
    assert_eq!(
        to_pixels(css(300.0, 200.0, -200.0, -100.0), 1.0, 1920, 1080),
        Some(PixelRect { x: 100, y: 100, width: 200, height: 100 })
    );
}

#[test]
fn selection_partly_outside_is_clamped_to_the_image() {
    assert_eq!(
        to_pixels(css(1800.0, 1000.0, 300.0, 300.0), 1.0, 1920, 1080),
        Some(PixelRect { x: 1800, y: 1000, width: 120, height: 80 })
    );
    assert_eq!(
        to_pixels(css(-50.0, -50.0, 100.0, 100.0), 1.0, 1920, 1080),
        Some(PixelRect { x: 0, y: 0, width: 50, height: 50 })
    );
}

#[test]
fn tiny_or_invalid_selections_are_rejected() {
    assert_eq!(to_pixels(css(10.0, 10.0, 4.0, 100.0), 1.0, 1920, 1080), None);
    assert_eq!(to_pixels(css(10.0, 10.0, 3.0, 3.0), 1.0, 1920, 1080), None);
    assert_eq!(to_pixels(css(5000.0, 10.0, 100.0, 100.0), 1.0, 1920, 1080), None);
    assert_eq!(to_pixels(css(10.0, 10.0, 100.0, 100.0), 0.0, 1920, 1080), None);
}

#[test]
fn overlays_follow_monitors_left_of_and_above_the_primary() {
    assert_eq!(overlay_bounds(-1920, 0, 1920, 1080), (-1920, 0, 1920, 1080));
    assert_eq!(overlay_bounds(0, -1440, 2560, 1440), (0, -1440, 2560, 1440));
}

/// Real capture of all monitors (needs a desktop session).
#[test]
#[ignore]
fn captures_every_monitor() {
    let monitors = xcap::Monitor::all().unwrap();
    assert!(!monitors.is_empty());
    for m in monitors {
        let img = m.capture_image().unwrap();
        println!(
            "{}: {}x{} at ({}, {}) scale {} → image {}x{}",
            m.name().unwrap_or_default(),
            m.width().unwrap(),
            m.height().unwrap(),
            m.x().unwrap(),
            m.y().unwrap(),
            m.scale_factor().unwrap(),
            img.width(),
            img.height()
        );
        assert!(img.width() > 0 && img.height() > 0);
    }
}
