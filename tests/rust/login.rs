use gemini_tray_lib::login::browser::{browser_args, candidate_paths, pick_browser};
use gemini_tray_lib::login::cookies::{
    effective_expiry, has_google_session, is_relevant_domain, relevant, to_webview_cookie, CdpCookie,
    SESSION_COOKIE_LIFETIME_SECS,
};
use gemini_tray_lib::login::is_signin_url;
use std::path::{Path, PathBuf};

fn cookie(name: &str, domain: &str, expires: f64) -> CdpCookie {
    CdpCookie {
        name: name.into(),
        value: "v".into(),
        domain: domain.into(),
        path: "/".into(),
        expires,
        http_only: true,
        secure: true,
        same_site: Some("Lax".into()),
    }
}

#[test]
fn google_and_youtube_domains_are_relevant() {
    for d in [".google.com", "accounts.google.com", "gemini.google.com", ".google.de", ".google.co.uk", ".youtube.com"] {
        assert!(is_relevant_domain(d), "{d} should be relevant");
    }
}

#[test]
fn foreign_domains_are_not_relevant() {
    for d in [".example.com", "google.evil.com", "notgoogle.com", ".googleusercontent.example"] {
        assert!(!is_relevant_domain(d), "{d} must not be relevant");
    }
}

#[test]
fn relevant_filters_cookie_list() {
    let all = vec![cookie("SID", ".google.com", 2e9), cookie("x", ".example.com", 2e9)];
    let r = relevant(&all);
    assert_eq!(r.len(), 1);
    assert_eq!(r[0].name, "SID");
}

#[test]
fn session_is_detected_only_with_auth_cookie_on_google_com() {
    assert!(has_google_session(&[cookie("__Secure-1PSID", ".google.com", 2e9)]));
    assert!(!has_google_session(&[cookie("NID", ".google.com", 2e9)]));
    assert!(!has_google_session(&[cookie("SID", ".youtube.com", 2e9)]));
}

#[test]
fn session_cookies_get_a_lifetime() {
    let now = 1_800_000_000;
    assert_eq!(effective_expiry(&cookie("a", ".google.com", -1.0), now), now + SESSION_COOKIE_LIFETIME_SECS);
    assert_eq!(effective_expiry(&cookie("a", ".google.com", 1_900_000_000.0), now), 1_900_000_000);
}

#[test]
fn webview_cookie_keeps_attributes() {
    let c = to_webview_cookie(&cookie("SID", ".google.com", 1_900_000_000.0), 0);
    assert_eq!(c.name(), "SID");
    assert_eq!(c.domain(), Some("google.com"));
    assert_eq!(c.path(), Some("/"));
    assert_eq!(c.http_only(), Some(true));
    assert_eq!(c.secure(), Some(true));
    assert_eq!(c.expires_datetime().unwrap().unix_timestamp(), 1_900_000_000);
}

#[test]
fn cdp_json_is_parsed() {
    let json = r#"[{"name":"SID","value":"abc","domain":".google.com","path":"/","expires":-1,"size":3,"httpOnly":false,"secure":true,"session":true,"sameSite":"None"}]"#;
    let parsed: Vec<CdpCookie> = serde_json::from_str(json).unwrap();
    assert_eq!(parsed[0].expires, -1.0);
    assert!(parsed[0].secure);
}

#[test]
fn signin_urls_are_recognized() {
    assert!(is_signin_url("https://accounts.google.com/v3/signin/identifier?continue=x"));
    assert!(is_signin_url("https://accounts.google.com/ServiceLogin?continue=x"));
    assert!(!is_signin_url("https://gemini.google.com/app"));
    assert!(!is_signin_url("https://accounts.google.com/SignOutOptions"));
    assert!(!is_signin_url("not a url"));
}

#[test]
fn chrome_is_preferred_over_edge() {
    let env = |k: &str| match k {
        "PROGRAMFILES" => Some(r"C:\PF".to_string()),
        "PROGRAMFILES(X86)" => Some(r"C:\PF86".to_string()),
        "LOCALAPPDATA" => Some(r"C:\LAD".to_string()),
        _ => None,
    };
    let candidates = candidate_paths(&env);
    let only_edge_and_chrome_local = |p: &Path| {
        p == Path::new(r"C:\PF86\Microsoft\Edge\Application\msedge.exe")
            || p == Path::new(r"C:\LAD\Google\Chrome\Application\chrome.exe")
    };
    assert_eq!(
        pick_browser(&candidates, &only_edge_and_chrome_local),
        Some(PathBuf::from(r"C:\LAD\Google\Chrome\Application\chrome.exe"))
    );
    let edge_only = |p: &Path| p.ends_with("msedge.exe") && p.starts_with(r"C:\PF86");
    assert!(pick_browser(&candidates, &edge_only).unwrap().ends_with("msedge.exe"));
    assert_eq!(pick_browser(&candidates, &|_| false), None);
}

#[test]
fn browser_gets_separate_profile_and_debug_port() {
    let args = browser_args(Path::new(r"C:\data\login-browser"), 9555);
    assert!(args.contains(&r"--user-data-dir=C:\data\login-browser".to_string()));
    assert!(args.contains(&"--remote-debugging-port=9555".to_string()));
    assert!(args.last().unwrap().starts_with("https://accounts.google.com/"));
}

/// Starts the real Chrome/Edge with a throw-away profile, reads cookies via DevTools, closes it.
/// Run with: cargo test --manifest-path src-tauri/Cargo.toml --test login -- --ignored
#[test]
#[ignore]
fn devtools_connection_to_real_browser_works() {
    let dir = std::env::temp_dir().join(format!("gemini-tray-probe-{}", std::process::id()));
    let n = gemini_tray_lib::login::browser::devtools_probe(&dir).expect("DevTools probe failed");
    println!("cookies in fresh profile: {n}");
    let _ = std::fs::remove_dir_all(&dir);
}
