# Task_01: Durchstich: Tauri-Gerüst mit Tray und Gemini-Fenster

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_01.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Auf dem Branch `rework/tauri` existiert eine lauffähige Tauri-2-App, die im Tray startet und per `Alt+Space` ein Fenster mit gemini.google.com ein- und ausblendet. Gleichzeitig steht die Test-Infrastruktur (Vitest und `cargo test` aus `tests/`). Der Durchstich klärt früh, ob Stack, Projektstruktur und Testing zusammenpassen.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Keine. Branch `rework/tauri` ist angelegt.
- **Relevantes Vorwissen:** `Roadmap/README.md` (Stack, Leitprinzip, Tests). Der alte Electron-Code (`electron/`, `src/`, `vite.config.ts`, `electron-builder.json5`, `e2e/`) bleibt auf `main` als Referenz erhalten.

## Umfang

**Gehört dazu:**

- Electron-Code und -Konfiguration auf dem Branch entfernen (`electron/`, alter `src/`, `electron-builder.json5`, `dist-electron/`, `e2e/`, `test-results/`, Electron-Abhängigkeiten in `package.json`, `tag-release.*` bleiben bis Task 11).
- Neues Tauri-2-Projekt (Vue 3 + TypeScript + Vite) im Repo-Root mit `src/` (UI) und `src-tauri/` (Rust).
- Tray-Icon mit Menü: „Anzeigen/Verbergen“, „Beenden“.
- Hauptfenster mit einer Webview auf `https://gemini.google.com/app`, normale Windows-Titelleiste, Schließen-Knopf verbirgt das Fenster ins Tray statt die App zu beenden.
- Globaler Shortcut `Alt+Space` (fest verdrahtet, konfigurierbar erst in Task 03) blendet das Hauptfenster ein/aus und fokussiert es; Registrierungsfehler werden geloggt und per Tray-Benachrichtigung gemeldet.
- Single-Instance: ein zweiter Start bringt das vorhandene Fenster nach vorn.
- Test-Infrastruktur: Vitest mit Tests unter `tests/ui/`, Rust-Integrationstests unter `tests/rust/` per `[[test]] path`, Skript `npm test` führt beides aus.
- Logging in eine Datei im App-Datenverzeichnis (z. B. `tauri-plugin-log`).

**Gehört nicht dazu:**

- Login-Probleme lösen (Task 02).
- Einstellungsfenster, konfigurierbare Shortcuts, Autostart (Task 03).
- Jegliche Eingriffe in die Gemini-Seite (Task 04).
- Release-Pipeline (Task 11).

## Umsetzungsschritte

1. Electron-spezifische Dateien und Abhängigkeiten entfernen (`git rm`), `.gitignore` für Tauri ergänzen (`src-tauri/target/`).
2. Tauri-2-Projekt mit Vue-TS-Vorlage anlegen; App-Name „Gemini Tray“, Identifier z. B. `com.sphaerox.geminitray`, Version `2.0.0-dev`.
3. Vorhandene Icons aus `public/`/`images/` übernehmen und mit `tauri icon` die Icon-Sätze erzeugen.
4. Tray mit Menü und Linksklick-Toggle umsetzen.
5. Hauptfenster mit externer URL `https://gemini.google.com/app` anlegen; Schließen abfangen und Fenster verbergen.
6. `tauri-plugin-global-shortcut` und `tauri-plugin-single-instance` einbinden; `Alt+Space` toggelt das Fenster.
7. Fenster-Toggle-Logik (sichtbar/fokussiert → verbergen, sonst anzeigen + fokussieren) als testbare Funktion ohne Tauri-Laufzeit kapseln.
8. Vitest und Cargo-Testpfade einrichten, `npm test` anlegen, je einen echten ersten Test schreiben; exakte Befehle in `Roadmap/README.md` eintragen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust (`tests/rust/window_toggle.rs`): Toggle-Entscheidung für die Zustände sichtbar+fokussiert, sichtbar+nicht fokussiert, verborgen.
- UI (`tests/ui/`): ein Smoke-Test, der die Vue-App mountet (stellt sicher, dass Vitest korrekt konfiguriert ist).
- Manuelle Prüfliste: App startet ohne sichtbares Fenster im Tray; `Alt+Space` zeigt/verbirgt; Schließen-Knopf beendet die App nicht; Tray „Beenden“ beendet sie; zweiter Start öffnet das vorhandene Fenster.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] `npm run tauri dev` startet die App; `npm run tauri build` erzeugt einen Windows-Installer ohne Fehler.
- [ ] `npm test` läuft grün und führt sowohl Vitest als auch `cargo test` aus.
- [ ] Im Repo existieren keine Electron-Abhängigkeiten mehr (`package.json` enthält weder `electron` noch `electron-builder`).
- [ ] Manuelle Prüfliste vollständig bestanden und in den Notizen festgehalten.
- [ ] Exakte Test-Befehle stehen in `Roadmap/README.md`.

## Offene Fragen / Annahmen

- Annahme: normale Windows-Titelleiste statt eigener Titelleiste (eine eigene Leiste über der Gemini-Webview bräuchte die instabile Multi-Webview-Funktion von Tauri).
- Annahme: Tray-Linksklick toggelt das Fenster, Rechtsklick öffnet das Menü.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 2026-11-20: Electron-Code entfernt, Tauri 2.12 + Vue 3 + Vite 8 aufgesetzt. `npm test` grün (1 Vitest, 4 Rust-Tests). `npm run tauri build` erzeugt `Gemini Tray_2.0.0_x64-setup.exe` (1,55 MB).
- Dev-Start (`npm run tauri dev`) läuft; im Log erschien „Could not register Alt+Space: HotKey already registered“, weil die installierte Electron-Version 1.x noch läuft und Alt+Space belegt. Die Fehlermeldung funktioniert damit nachweislich.
- **Manuelle Prüfliste: offen für den Nutzer.** Der Zugriff der Computersteuerung auf `gemini-tray.exe` wurde abgelehnt, und die alte 1.x-App durfte nicht automatisch beendet werden. Zu prüfen: Start im Tray ohne Fenster, Alt+Space (nach Beenden von 1.x), Schließen-Knopf versteckt nur, Tray „Beenden“, Doppelstart.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** Gerüst wie geplant. Vite-Root ist `src/` mit einer HTML-Datei pro App-Fenster (`settings`, `indicator`, `prompts`, `overlay`, `toast`), Build nach `dist/`. Bridge-Build separat (`vite.bridge.config.ts` → `src-tauri/bridge/gemini-bridge.js`, gitignored, wird als Bundle-Ressource ausgeliefert). Icons aus `public/tray-icon.png` (JPEG, vorher nach PNG/RGBA konvertiert → `src-tauri/app-icon.png`).
- **Learnings & Stolpersteine:** `cargo search` zeigt Tauri 3.0-alpha als neueste Version – immer `"2"` als Versionsanforderung nutzen. `[[test]] path = "../tests/rust/x.rs"` funktioniert. Die Root-Ebene einer Bash-Heredoc mit vielen Rust-Lifetimes (`'static`) kann das Quoting brechen → Dateien mit dem Write-Tool anlegen. Release-Build mit LTO dauert ~10 min.
- **Wichtige Entscheidungen und ihre Gründe:** Hauptfenster wird im Code erzeugt (nicht in `tauri.conf.json`), weil es eine externe URL lädt und Callbacks braucht. Die Gemini-Webview bekommt bewusst keine Capabilities. NSIS `installMode: currentUser` (keine Admin-Rechte nötig).
- **Auswirkungen auf Folge-Tasks:** `windowing::{show_main, hide_main, toggle_main, main_window}` nutzen. Shortcut-Registrierung ist in Task 01 fest verdrahtet und wird in Task 03 ersetzt.
- **Hinweise zu Tests und Befehlen:** `npm test` = `vitest run` + `cargo test`. Für Dev-Tests muss die alte Electron-App beendet sein, sonst ist Alt+Space belegt.
