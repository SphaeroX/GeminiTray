use std::path::Path;
use std::process::Command;

fn main() {
    // The Gemini bridge is TypeScript (src/bridge) bundled by Vite and embedded with include_str!.
    // Build it when it is missing so plain `cargo build` / `cargo test` work too.
    let bridge = Path::new("bridge/gemini-bridge.js");
    println!("cargo:rerun-if-changed=bridge/gemini-bridge.js");
    println!("cargo:rerun-if-changed=../src/bridge");
    if !bridge.exists() {
        let npm = if cfg!(windows) { "npm.cmd" } else { "npm" };
        let status = Command::new(npm)
            .args(["run", "build:bridge"])
            .current_dir("..")
            .status()
            .expect("failed to run `npm run build:bridge` – is Node.js installed?");
        assert!(status.success(), "`npm run build:bridge` failed");
    }
    tauri_build::build()
}
