use gemini_tray_lib::updates::percent;

#[test]
fn download_progress_in_percent() {
    assert_eq!(percent(0, Some(200)), 0);
    assert_eq!(percent(50, Some(200)), 25);
    assert_eq!(percent(200, Some(200)), 100);
    assert_eq!(percent(500, Some(200)), 100);
    assert_eq!(percent(50, None), 0);
    assert_eq!(percent(50, Some(0)), 0);
}
