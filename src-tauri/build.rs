use std::path::Path;
use std::process::Command;

fn npm(args: &[&str]) {
    let npm = if cfg!(windows) { "npm.cmd" } else { "npm" };
    let status = Command::new(npm)
        .args(args)
        .current_dir("..")
        .status()
        .unwrap_or_else(|e| panic!("failed to run npm {args:?}: {e} – is Node.js installed?"));
    assert!(status.success(), "npm {args:?} failed");
}

fn main() {
    // The Gemini bridge is TypeScript (src/bridge) bundled by Vite and embedded with include_str!.
    // Build it when it is missing so plain `cargo build` / `cargo test` work too.
    println!("cargo:rerun-if-changed=bridge/gemini-bridge.js");
    println!("cargo:rerun-if-changed=../src/bridge");
    if !Path::new("bridge/gemini-bridge.js").exists() {
        npm(&["run", "build:bridge"]);
    }

    tauri_build::build()
}
