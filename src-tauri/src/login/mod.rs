//! Google sign-in for the Gemini webview.
//!
//! Primary path: the user signs in directly in the WebView2 window (its profile lives in the
//! app's local data directory and survives restarts). Fallback when Google refuses embedded
//! sign-in: [`browser`] starts the system Chrome/Edge with a separate profile, the user signs in
//! there and the Google cookies are copied into WebView2 via the DevTools protocol.

pub mod browser;
pub mod cookies;

use url::Url;

/// True when a navigation target is a Google sign-in page, i.e. the user is (or got) signed out.
pub fn is_signin_url(url: &str) -> bool {
    let Ok(u) = Url::parse(url) else { return false };
    if u.host_str() != Some("accounts.google.com") {
        return false;
    }
    let path = u.path().to_ascii_lowercase();
    path.contains("signin") || path.contains("servicelogin") || path.contains("accountchooser")
}

mod runtime {
    use super::*;
    use crate::notify::{self, Level};
    use crate::{windowing, GEMINI_URL};
    use std::time::{SystemTime, UNIX_EPOCH};
    use tauri::{AppHandle, Manager};

    fn login_profile_dir(app: &AppHandle) -> Option<std::path::PathBuf> {
        app.path().app_local_data_dir().ok().map(|d| d.join("login-browser"))
    }

    fn reload_gemini(app: &AppHandle) {
        if let Some(w) = windowing::main_window(app) {
            if let Ok(url) = GEMINI_URL.parse() {
                let _ = w.navigate(url);
            }
        }
    }

    /// "Sign in with browser" – runs in a background thread.
    pub fn start_browser_login(app: &AppHandle) {
        let app = app.clone();
        std::thread::spawn(move || {
            let Some(profile) = login_profile_dir(&app) else { return };
            notify::show(&app, Level::Info, "login.browser_started", None);
            match browser::sign_in(&profile) {
                Ok(found) => {
                    let Some(w) = windowing::main_window(&app) else { return };
                    let now = SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .map(|d| d.as_secs() as i64)
                        .unwrap_or(0);
                    let mut imported = 0;
                    for c in &found {
                        match w.set_cookie(cookies::to_webview_cookie(c, now)) {
                            Ok(()) => imported += 1,
                            Err(e) => log::warn!("Cookie {} not imported: {e}", c.name),
                        }
                    }
                    log::info!("Imported {imported} of {} Google cookies", found.len());
                    reload_gemini(&app);
                    windowing::show_main(&app);
                    notify::show(&app, Level::Success, "login.success", None);
                }
                Err(e) => {
                    log::error!("Browser sign-in failed: {e}");
                    notify::show(&app, Level::Error, "login.failed", Some(e.to_string()));
                }
            }
        });
    }

    /// Delete all cookies/data of the Gemini webview and the login browser profile.
    pub fn reset_session(app: &AppHandle) {
        if let Some(w) = windowing::main_window(app) {
            if let Err(e) = w.clear_all_browsing_data() {
                log::error!("Could not clear browsing data: {e}");
            }
        }
        if let Some(dir) = login_profile_dir(app) {
            let _ = std::fs::remove_dir_all(dir);
        }
        reload_gemini(app);
        windowing::show_main(app);
        notify::show(app, Level::Info, "login.reset", None);
    }
}

pub use runtime::{reset_session, start_browser_login};
