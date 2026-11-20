use gemini_tray_lib::windowstate::{alpha, load, restorable, save, Area, Bounds};

const MAIN: Area = Area { x: 0, y: 0, width: 1920, height: 1040 };
const LEFT: Area = Area { x: -1920, y: 0, width: 1920, height: 1040 };

fn b(x: i32, y: i32) -> Bounds {
    Bounds { x, y, width: 520, height: 760 }
}

#[test]
fn position_inside_a_monitor_is_restored() {
    assert_eq!(restorable(b(100, 100), &[MAIN]), Some(b(100, 100)));
    assert_eq!(restorable(b(-1500, 50), &[MAIN, LEFT]), Some(b(-1500, 50)));
}

#[test]
fn partially_visible_window_is_restored_if_title_bar_is_reachable() {
    assert_eq!(restorable(b(1700, 200), &[MAIN]), Some(b(1700, 200)));
}

#[test]
fn completely_outside_is_centred_instead() {
    // The monitor on the left was unplugged.
    assert_eq!(restorable(b(-1500, 50), &[MAIN]), None);
    assert_eq!(restorable(b(5000, 5000), &[MAIN]), None);
}

#[test]
fn title_bar_above_the_screen_is_rejected() {
    assert_eq!(restorable(b(100, -300), &[MAIN]), None);
}

#[test]
fn tiny_sizes_are_rejected() {
    assert_eq!(restorable(Bounds { x: 0, y: 0, width: 50, height: 50 }, &[MAIN]), None);
}

#[test]
fn opacity_maps_to_alpha_and_is_clamped() {
    assert_eq!(alpha(1.0), 255);
    assert_eq!(alpha(0.5), 128);
    assert_eq!(alpha(0.1), 128);
    assert_eq!(alpha(7.0), 255);
    assert_eq!(alpha(f64::NAN), 255);
}

#[test]
fn bounds_roundtrip() {
    let p = std::env::temp_dir().join(format!("gt-ws-{}", std::process::id())).join("window-state.json");
    save(&p, b(10, 20));
    assert_eq!(load(&p), Some(b(10, 20)));
}
