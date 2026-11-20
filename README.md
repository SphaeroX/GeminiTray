# Gemini Tray

**Google Gemini one shortcut away – with local voice input and Screenshot & Ask, right from the Windows system tray.**

Gemini Tray is a small Windows tray app that shows the real Gemini web app (gemini.google.com) in a pop-up window. You use your own Google account and subscription – no API key, no extra costs. Everything that the web page cannot do well (voice input, dictation, screen capture) runs natively and locally on your PC.

> **Version 2.0 is a complete rewrite** (Tauri instead of Electron). Version 1.x is not updated automatically: uninstall 1.x and install 2.x once.

## Features

| Shortcut (default) | Feature |
|---|---|
| `Alt+Space` | Show / hide the Gemini window |
| `Alt+V` | **Voice message** – speak, the text is recognised locally, inserted into Gemini and (optionally) sent |
| `Alt+Shift+V` | **Dictation** – speak anywhere, the text lands in your clipboard |
| `Alt+Shift+S` | **Screenshot & Ask** – select a screen area, the image is attached to your Gemini prompt |
| `Alt+N` | New chat |
| `Alt+J` | Prompt menu – pick a saved prompt for your next message |

All shortcuts can be changed in the settings.

- **Local speech recognition**: [NVIDIA Parakeet TDT 0.6B v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) runs offline on your CPU (German, English and other European languages, detected automatically). The model is downloaded once on first use.
- **Full Gemini web experience**: Gems, history, Canvas, Deep Research, image generation – everything the web app offers.
- **Robust by design**: The app only touches the Gemini page through a tiny bridge (insert text, insert image, send, new chat). If Google changes the page, you get a clear message instead of silent failures – and your dictated text is never lost (it falls back to the clipboard).
- Settings in German and English, light and dark mode (follows Windows), autostart, start minimized, opacity, always on top, automatic updates.

## Installation

Download the latest `Gemini Tray_x.y.z_x64-setup.exe` from the [Releases](https://github.com/SphaeroX/GeminiTray/releases) page and run it. Requirements: Windows 10 or 11 (64-bit). Updates are installed from within the app.

On first start, sign in to your Google account in the Gemini window. If Google refuses the sign-in inside the app, use **Tray menu → Sign in with browser**: Gemini Tray opens Chrome or Edge, you sign in there, and the session is taken over.

## Privacy

- Audio never leaves your PC; speech recognition is fully local.
- Screenshots are only sent to Gemini when you confirm a selection.
- The app has no telemetry. Your Google session is stored in the app's own WebView2 profile in `%LOCALAPPDATA%`.

## Building from source

Prerequisites: [Rust](https://rustup.rs/) (stable, MSVC), [Node.js](https://nodejs.org/) 20+, Visual Studio Build Tools with the "Desktop development with C++" workload, WebView2 runtime (preinstalled on Windows 11).

```powershell
git clone https://github.com/SphaeroX/GeminiTray.git
cd GeminiTray
npm install
npm run tauri dev      # run in development mode
npm test               # run all tests (Vitest + cargo test)
npm run tauri build    # build the installer (src-tauri/target/release/bundle/nsis)
```

## Project structure

```
src/            Vue 3 UI for the app's own windows (settings, indicator, prompt menu, overlay, toasts)
src/bridge/     The Gemini bridge – the only code that touches gemini.google.com
src-tauri/      Rust core: tray, shortcuts, settings, login, audio, speech recognition, screenshot, updater
tests/          Test suite (tests/ui: Vitest, tests/rust: cargo integration tests)
Roadmap/        Task-based development roadmap for AI agents
```

## License

MIT – see [LICENSE](LICENSE).
