# Gemini Tray 2.0 – Agent Guide

Gemini Tray is a Windows tray app (Tauri 2, Rust core, Vue 3 UI) that shows the real Gemini web app (gemini.google.com) in a pop-up window and adds native features around it: local voice input (Parakeet), dictation to clipboard, Screenshot & Ask, a prompt menu, configurable global shortcuts. No Gemini API key is used; the user's Google session in WebView2 is the only access path.

## Ground rules

1. **Native first.** Everything the app can do itself is done in Rust: audio, speech recognition, screen capture, clipboard, shortcuts, settings. Never click Gemini's own microphone or model buttons and never read state from Gemini's DOM.
2. **One bridge.** The only code allowed to touch the Gemini page is `src/bridge/` (bundled to `src-tauri/bridge/gemini-bridge.js`). It offers exactly: `insertText`, `insertImage`, `send`, `newChat`, `selfTest`. All selectors live in `src/bridge/selectors.ts`. Adding a new operation needs a good reason and a test against fixtures in `tests/ui/fixtures/`.
3. **Never lose user input.** If the bridge fails, dictated text or a screenshot goes to the clipboard and the user is told so.
4. **Windows only.** No Linux/macOS code paths are required. Use `#[cfg(windows)]` where Win32/WebView2 APIs are called so that pure logic stays testable.
5. **Testable logic stays out of the Tauri runtime.** Put state machines, parsers, coordinate math, settings validation etc. in plain modules that do not need an `AppHandle`, and test them.

## Stack and layout

| Area | Location | Notes |
|---|---|---|
| Rust core | `src-tauri/src/` | `lib.rs` wires plugins and modules; one module per feature (`tray`, `shortcuts`, `settings`, `login`, `bridge`, `audio`, `stt`, `voice`, `screenshot`, `prompts`, `windowing`, `toast`) |
| UI windows | `src/` | Vite multi-page app: `settings.html`, `indicator.html`, `prompts.html`, `overlay.html`, `toast.html`. Shared code in `src/lib/`, i18n in `src/locales/{de,en}.json` |
| Gemini bridge | `src/bridge/` | Built separately (`npm run build:bridge`) as an IIFE and injected as initialization script into the Gemini webview |
| Tests | `tests/ui/` (Vitest + jsdom), `tests/rust/` (cargo integration tests, registered via `[[test]] path = "../tests/rust/<name>.rs"` in `src-tauri/Cargo.toml`) | |
| Design | `Roadmap/README.md` → "Design" | Windows 11 / Fluent look; tokens in `src/lib/theme.css` |

The Rust crate is a library (`gemini_tray_lib`) plus a thin binary, so integration tests can import modules directly.

## Commands

```powershell
npm install                       # once
npm run tauri dev                 # run the app (builds bridge + UI automatically)
npm test                          # all tests: Vitest + cargo test
npx vitest run tests/ui           # UI tests only
cargo test --manifest-path src-tauri/Cargo.toml            # Rust tests only
cargo test --manifest-path src-tauri/Cargo.toml --test stt -- --ignored   # tests that need the speech model
npm run tauri build               # release build + NSIS installer
npm run release                   # tag the current version and push (only when the user asks for a release)
```

## Workflow

- Work happens in small, tested steps. Run `npm test` and make sure `npm run tauri build` (or at least `cargo check` + `vue-tsc --noEmit`) passes before committing.
- Commits: Conventional Commits in English (`feat(voice): …`, `fix(bridge): …`).
- **Versioning:** Semantic versioning. Do not bump the version on every change. Bump it (in `package.json`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml` together – `npm run version:check` verifies they match) only when the user asks for a release.
- **Releases:** Only on explicit request. `npm run release` creates the tag `vX.Y.Z` and pushes it; GitHub Actions builds the signed installer and the updater manifest.
- Roadmap tasks: follow `Roadmap/AGENTS.md`; current tasks are in `Roadmap/Tasks/`.
- User-facing text exists in German and English; add both whenever you add a string.

## Gotchas

- Google may refuse sign-in inside embedded browsers. The fallback is `login::browser` (system Chrome/Edge with its own profile, cookies copied via CDP into WebView2). Never add user-agent spoofing or "stealth" flags without asking the user.
- Global shortcuts can already be taken by other apps (the official Gemini app also uses `Alt+Space`). Registration errors must be shown to the user.
- The speech model is not bundled; it is downloaded to `%LOCALAPPDATA%\com.sphaerox.geminitray\models\` on first use and verified by SHA-256.
