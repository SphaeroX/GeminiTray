//! Converting cookies read from Chrome/Edge (DevTools protocol) into WebView2 cookies.

use serde::Deserialize;

/// A cookie as returned by the DevTools `Storage.getCookies` command.
#[derive(Debug, Clone, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CdpCookie {
    pub name: String,
    pub value: String,
    pub domain: String,
    #[serde(default)]
    pub path: String,
    /// Seconds since the Unix epoch; `-1` (or missing) for session cookies.
    #[serde(default = "session_expiry")]
    pub expires: f64,
    #[serde(default)]
    pub http_only: bool,
    #[serde(default)]
    pub secure: bool,
    #[serde(default)]
    pub same_site: Option<String>,
}

fn session_expiry() -> f64 {
    -1.0
}

/// Session cookies would vanish when the app restarts; they get this lifetime instead.
pub const SESSION_COOKIE_LIFETIME_SECS: i64 = 60 * 60 * 24 * 30;

/// Names of cookies that prove a Google account is signed in.
pub const AUTH_COOKIE_NAMES: &[&str] = &["__Secure-1PSID", "__Secure-3PSID", "SID"];

/// Only Google (incl. country domains such as google.de or google.co.uk) and YouTube cookies.
pub fn is_relevant_domain(domain: &str) -> bool {
    let d = domain.trim_start_matches('.').to_ascii_lowercase();
    if d == "youtube.com" || d.ends_with(".youtube.com") {
        return true;
    }
    let labels: Vec<&str> = d.split('.').collect();
    // "google" followed by a TLD (google.de) or by co/com + country code (google.co.uk, google.com.au).
    labels.iter().enumerate().any(|(i, l)| {
        if *l != "google" {
            return false;
        }
        match &labels[i + 1..] {
            [_tld] => true,
            [sld, cc] => matches!(*sld, "co" | "com") && cc.len() == 2,
            _ => false,
        }
    })
}

pub fn relevant(cookies: &[CdpCookie]) -> Vec<CdpCookie> {
    cookies.iter().filter(|c| is_relevant_domain(&c.domain)).cloned().collect()
}

/// True when the cookie set contains a Google session (sign-in completed).
pub fn has_google_session(cookies: &[CdpCookie]) -> bool {
    cookies.iter().any(|c| {
        AUTH_COOKIE_NAMES.contains(&c.name.as_str())
            && c.domain.trim_start_matches('.').eq_ignore_ascii_case("google.com")
            && !c.value.is_empty()
    })
}

/// Expiry used for the WebView2 cookie (Unix seconds).
pub fn effective_expiry(c: &CdpCookie, now_unix: i64) -> i64 {
    if c.expires <= 0.0 {
        now_unix + SESSION_COOKIE_LIFETIME_SECS
    } else {
        c.expires as i64
    }
}

/// Build the cookie for WebView2.
pub fn to_webview_cookie(c: &CdpCookie, now_unix: i64) -> cookie::Cookie<'static> {
    use cookie::time::OffsetDateTime;
    use cookie::{Cookie, SameSite};
    let path = if c.path.is_empty() { "/".to_string() } else { c.path.clone() };
    let mut builder = Cookie::build((c.name.clone(), c.value.clone()))
        .domain(c.domain.clone())
        .path(path)
        .http_only(c.http_only)
        .secure(c.secure);
    if let Ok(t) = OffsetDateTime::from_unix_timestamp(effective_expiry(c, now_unix)) {
        builder = builder.expires(t);
    }
    builder = match c.same_site.as_deref() {
        Some("Strict") => builder.same_site(SameSite::Strict),
        Some("Lax") => builder.same_site(SameSite::Lax),
        Some("None") => builder.same_site(SameSite::None),
        _ => builder,
    };
    builder.build()
}
