//! Links the Gemini page wants to open in a new window (`target=_blank`, "Open link in new window").
//!
//! Web links go to the user's default browser; Google sign-in popups and blank popups that the
//! page fills itself stay in WebView2's own popup, so flows that need `window.opener` keep working.

/// Where a new-window request from the Gemini page goes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LinkTarget {
    /// Let WebView2 open its own popup window.
    InApp,
    /// Open in the default browser / mail program.
    External,
    /// Drop the request (scripts, data/blob URLs, unknown schemes).
    Ignore,
}

/// Hosts whose popups must stay inside the app (they rely on the shared session / `window.opener`).
const IN_APP_HOSTS: &[&str] = &["accounts.google.com"];

pub fn classify(raw: &str) -> LinkTarget {
    let Ok(url) = url::Url::parse(raw) else {
        return LinkTarget::Ignore;
    };
    match url.scheme() {
        "about" if url.path() == "blank" => LinkTarget::InApp,
        "http" | "https" => match url.host_str() {
            Some(host) if IN_APP_HOSTS.contains(&host) => LinkTarget::InApp,
            Some(_) => LinkTarget::External,
            None => LinkTarget::Ignore,
        },
        "mailto" => LinkTarget::External,
        _ => LinkTarget::Ignore,
    }
}

/// Opens `url` with the program Windows associates with it. Only call with URLs that
/// [`classify`] marked as [`LinkTarget::External`].
#[cfg(windows)]
pub fn open_external(url: &str) {
    use windows::core::{HSTRING, PCWSTR};
    use windows::Win32::UI::Shell::ShellExecuteW;
    use windows::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;

    let result = unsafe { ShellExecuteW(None, &HSTRING::from("open"), &HSTRING::from(url), PCWSTR::null(), PCWSTR::null(), SW_SHOWNORMAL) };
    // ShellExecute reports success with a value greater than 32.
    if result.0 as isize <= 32 {
        log::warn!("could not open link in the default browser: {url} (code {})", result.0 as isize);
    }
}

#[cfg(not(windows))]
pub fn open_external(url: &str) {
    log::warn!("opening links is only implemented on Windows: {url}");
}
