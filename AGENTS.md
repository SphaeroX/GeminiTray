# Gemini Tray 2.0 – Agent Guide

Gemini Tray is a Windows tray app (Tauri 2, Rust core, Vue 3 UI) that shows the real Gemini web app (gemini.google.com) in a pop-up window and adds native features around it: voice messages and dictation to clipboard (driving Gemini's own voice input), Screenshot & Ask, a prompt menu, configurable global shortcuts. No Gemini API key is used; the user's Google session in WebView2 is the only access path.

## Ground rules

1. **Native first.** Everything the app can do itself is done in Rust: screen capture, clipboard, shortcuts, settings, window handling. Speech recognition is Gemini's own (user decision, 2026-11-20): the bridge switches Gemini's microphone on/off; whether it is listening is detected from the page's live microphone tracks (getUserMedia wrapper), not from icons.
2. **One bridge.** The only code allowed to touch the Gemini page is `src/bridge/` (bundled to `src-tauri/bridge/gemini-bridge.js`). It offers: `insertText`, `insertImage`, `send`, `selfTest`, `micStart`, `micStop`, `isRecording`, `takeText` (new chat is a navigation, no DOM access). All selectors live in `src/bridge/selectors.ts`. Adding a new operation needs a good reason and a test against fixtures in `tests/ui/fixtures/`.
3. **Never lose user input.** If the bridge fails, dictated text or a screenshot goes to the clipboard and the user is told so.
4. **Windows only.** No Linux/macOS code paths are required. Use `#[cfg(windows)]` where Win32/WebView2 APIs are called so that pure logic stays testable.
5. **Testable logic stays out of the Tauri runtime.** Put state machines, parsers, coordinate math, settings validation etc. in plain modules that do not need an `AppHandle`, and test them.

## Stack and layout

| Area | Location | Notes |
|---|---|---|
| Rust core | `src-tauri/src/` | `lib.rs` wires plugins and modules; one module per feature (`tray`, `shortcuts`, `settings`, `login`, `bridge`, `voice`, `screenshot`, `prompts`, `windowing`, `windowstate`, `permissions`, `toast`, `updates`). The Gemini window holds two webviews: `titlebar` (ours) and `gemini` (no IPC rights) |
| UI windows | `src/` | Vite multi-page app: `settings.html`, `indicator.html`, `prompts.html`, `overlay.html`, `toast.html`, `titlebar.html`. Shared code in `src/lib/`, i18n in `src/locales/{de,en}.json` |
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

## Releases and auto-update

- `.github/workflows/release.yml` builds on tags `v*` with `tauri-action` and creates a **draft** release containing the NSIS installer, its signature and `latest.json` for the updater. `ci.yml` runs type check and tests on pushes and PRs.
- The updater (`src-tauri/src/updates.rs`) is only active when `plugins.updater.pubkey` in `src-tauri/tauri.conf.json` is set. One-time setup by the maintainer:
  1. `npx tauri signer generate -w %USERPROFILE%\.tauri\gemini-tray.key` (keep the private key secret and backed up – losing it means existing installs can no longer update).
  2. Put the **public** key into `plugins.updater.pubkey`.
  3. Add the GitHub secrets `TAURI_SIGNING_PRIVATE_KEY` (content of the private key file) and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
- Local `npm run tauri build` does not create updater artifacts and needs no key.

## Gotchas

- Google may refuse sign-in inside embedded browsers. The fallback is `login::browser` (system Chrome/Edge with its own profile, cookies copied via CDP into WebView2). Never add user-agent spoofing or "stealth" flags without asking the user.
- Global shortcuts can already be taken by other apps (the official Gemini app also uses `Alt+Space`). Registration errors must be shown to the user.
- Commands that create or destroy windows must be `async` – a synchronous command that builds a window deadlocks the main thread on Windows.
- The microphone is allowed for the `gemini` webview via a WebView2 `PermissionRequested` handler (`permissions.rs`).
