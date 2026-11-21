use gemini_tray_lib::links::{classify, LinkTarget};

#[test]
fn web_links_open_in_the_default_browser() {
    assert_eq!(classify("https://example.com/page?x=1"), LinkTarget::External);
    assert_eq!(classify("http://example.com"), LinkTarget::External);
    assert_eq!(classify("https://www.google.com/url?q=https://example.com"), LinkTarget::External);
    assert_eq!(classify("https://gemini.google.com/share/abc"), LinkTarget::External);
    assert_eq!(classify("mailto:someone@example.com"), LinkTarget::External);
}

#[test]
fn sign_in_and_blank_popups_stay_in_the_app() {
    assert_eq!(classify("https://accounts.google.com/o/oauth2/auth?x=1"), LinkTarget::InApp);
    assert_eq!(classify("about:blank"), LinkTarget::InApp);
}

#[test]
fn scripts_and_odd_schemes_are_ignored() {
    assert_eq!(classify("javascript:alert(1)"), LinkTarget::Ignore);
    assert_eq!(classify("data:text/html,hi"), LinkTarget::Ignore);
    assert_eq!(classify("blob:https://gemini.google.com/123"), LinkTarget::Ignore);
    assert_eq!(classify("file:///C:/Windows/win.ini"), LinkTarget::Ignore);
    assert_eq!(classify("ms-settings:privacy"), LinkTarget::Ignore);
    assert_eq!(classify("not a url"), LinkTarget::Ignore);
    assert_eq!(classify("about:srcdoc"), LinkTarget::Ignore);
}
