//! "Sign in with browser": system Chrome/Edge with its own profile, cookies via DevTools.

use std::path::{Path, PathBuf};

/// Where Chrome and Edge are usually installed, in order of preference (Chrome first).
pub fn candidate_paths(env: &dyn Fn(&str) -> Option<String>) -> Vec<PathBuf> {
    let roots: Vec<String> = ["PROGRAMFILES", "PROGRAMFILES(X86)", "LOCALAPPDATA"]
        .iter()
        .filter_map(|k| env(k))
        .collect();
    let mut out = Vec::new();
    for root in &roots {
        out.push(Path::new(root).join(r"Google\Chrome\Application\chrome.exe"));
    }
    for root in &roots {
        out.push(Path::new(root).join(r"Microsoft\Edge\Application\msedge.exe"));
    }
    out
}

/// First candidate that exists.
pub fn pick_browser(candidates: &[PathBuf], exists: &dyn Fn(&Path) -> bool) -> Option<PathBuf> {
    candidates.iter().find(|p| exists(p)).cloned()
}

pub const LOGIN_URL: &str =
    "https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fgemini.google.com%2Fapp";

pub fn browser_args(profile_dir: &Path, port: u16) -> Vec<String> {
    vec![
        format!("--user-data-dir={}", profile_dir.display()),
        format!("--remote-debugging-port={port}"),
        "--no-first-run".into(),
        "--no-default-browser-check".into(),
        "--new-window".into(),
        LOGIN_URL.into(),
    ]
}

#[derive(Debug)]
pub enum LoginError {
    NoBrowser,
    Launch(String),
    DevTools(String),
    Timeout,
}

impl std::fmt::Display for LoginError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoBrowser => write!(f, "no Chrome or Edge installation found"),
            Self::Launch(e) => write!(f, "browser could not be started: {e}"),
            Self::DevTools(e) => write!(f, "connection to the browser failed: {e}"),
            Self::Timeout => write!(f, "sign-in not completed within 5 minutes"),
        }
    }
}

mod runtime {
    use super::*;
    use crate::login::cookies::{has_google_session, relevant, CdpCookie};
    use serde_json::{json, Value};
    use std::net::TcpListener;
    use std::process::{Child, Command};
    use std::time::{Duration, Instant};

    fn free_port() -> u16 {
        TcpListener::bind("127.0.0.1:0")
            .and_then(|l| l.local_addr())
            .map(|a| a.port())
            .unwrap_or(9333)
    }

    pub fn find_browser() -> Option<PathBuf> {
        let env = |k: &str| std::env::var(k).ok();
        pick_browser(&candidate_paths(&env), &|p| p.exists())
    }

    fn ws_url(port: u16) -> Result<String, LoginError> {
        let body: Value = ureq::get(&format!("http://127.0.0.1:{port}/json/version"))
            .call()
            .map_err(|e| LoginError::DevTools(e.to_string()))?
            .body_mut()
            .read_json()
            .map_err(|e| LoginError::DevTools(e.to_string()))?;
        body["webSocketDebuggerUrl"]
            .as_str()
            .map(str::to_string)
            .ok_or_else(|| LoginError::DevTools("no webSocketDebuggerUrl".into()))
    }

    fn cdp(url: &str, method: &str) -> Result<Value, LoginError> {
        let (mut socket, _) =
            tungstenite::connect(url).map_err(|e| LoginError::DevTools(e.to_string()))?;
        let request = json!({ "id": 1, "method": method }).to_string();
        socket
            .send(tungstenite::Message::text(request))
            .map_err(|e| LoginError::DevTools(e.to_string()))?;
        loop {
            let msg = socket.read().map_err(|e| LoginError::DevTools(e.to_string()))?;
            if let tungstenite::Message::Text(t) = msg {
                let v: Value = serde_json::from_str(t.as_str()).unwrap_or(Value::Null);
                if v["id"] == 1 {
                    let _ = socket.close(None);
                    return Ok(v["result"].clone());
                }
            }
        }
    }

    fn read_cookies(url: &str) -> Result<Vec<CdpCookie>, LoginError> {
        let result = cdp(url, "Storage.getCookies")?;
        serde_json::from_value(result["cookies"].clone())
            .map_err(|e| LoginError::DevTools(e.to_string()))
    }

    fn close(child: &mut Child, ws: Option<&str>) {
        if let Some(url) = ws {
            let _ = cdp(url, "Browser.close");
        }
        std::thread::sleep(Duration::from_millis(500));
        let _ = child.kill();
    }

    /// Diagnostic: start the browser, read its cookie jar once via DevTools, close it.
    /// Returns the number of cookies seen. Used by an ignored integration test.
    pub fn devtools_probe(profile_dir: &Path) -> Result<usize, LoginError> {
        let exe = find_browser().ok_or(LoginError::NoBrowser)?;
        std::fs::create_dir_all(profile_dir).map_err(|e| LoginError::Launch(e.to_string()))?;
        let port = free_port();
        let mut child = Command::new(&exe)
            .args(browser_args(profile_dir, port))
            .spawn()
            .map_err(|e| LoginError::Launch(e.to_string()))?;
        let started = Instant::now();
        let url = loop {
            std::thread::sleep(Duration::from_millis(500));
            if let Ok(u) = ws_url(port) {
                break u;
            }
            if started.elapsed() > Duration::from_secs(20) {
                close(&mut child, None);
                return Err(LoginError::Timeout);
            }
        };
        let result = read_cookies(&url).map(|c| c.len());
        close(&mut child, Some(&url));
        result
    }

    /// Runs the whole flow. Blocking – call it from a background thread.
    /// Returns the Google cookies of the signed-in browser profile.
    pub fn sign_in(profile_dir: &Path) -> Result<Vec<CdpCookie>, LoginError> {
        let exe = find_browser().ok_or(LoginError::NoBrowser)?;
        std::fs::create_dir_all(profile_dir).map_err(|e| LoginError::Launch(e.to_string()))?;
        let port = free_port();
        let mut child = Command::new(&exe)
            .args(browser_args(profile_dir, port))
            .spawn()
            .map_err(|e| LoginError::Launch(e.to_string()))?;
        log::info!("Login browser started: {}", exe.display());

        let started = Instant::now();
        let mut ws: Option<String> = None;
        while started.elapsed() < Duration::from_secs(300) {
            std::thread::sleep(Duration::from_secs(2));
            let Some(url) = ws.clone() else {
                ws = ws_url(port).ok();
                continue;
            };
            match read_cookies(&url) {
                Ok(all) if has_google_session(&all) => {
                    let found = relevant(&all);
                    log::info!("Google session found in login browser ({} cookies)", found.len());
                    close(&mut child, Some(&url));
                    return Ok(found);
                }
                Ok(_) => {}
                Err(e) => {
                    if child.try_wait().ok().flatten().is_some() {
                        return Err(e);
                    }
                }
            }
        }
        close(&mut child, ws.as_deref());
        Err(LoginError::Timeout)
    }
}

pub use runtime::{devtools_probe, find_browser, sign_in};
