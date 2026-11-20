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

    // VC++ runtime DLLs bundled next to the exe (ONNX Runtime needs msvcp140).
    if cfg!(windows) && !Path::new("runtime/msvcp140.dll").exists() {
        let status = Command::new("node")
            .arg("../scripts/collect-runtime.mjs")
            .status()
            .expect("failed to run scripts/collect-runtime.mjs");
        assert!(status.success(), "collect-runtime failed");
    }

    // ONNX Runtime's prebuilt Windows binaries link DirectML. We only use the CPU, so load DirectML
    // lazily: the app starts without DirectML.dll and never touches it.
    if std::env::var("CARGO_CFG_TARGET_ENV").as_deref() == Ok("msvc") {
        println!("cargo:rustc-link-arg=/DELAYLOAD:DirectML.dll");
        println!("cargo:rustc-link-lib=delayimp");
    }

    tauri_build::build()
}
