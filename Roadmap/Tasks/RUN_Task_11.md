# Task_11: Release, Auto-Update, Umstellung

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_11.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Gemini Tray 2.0.0 wird als signierter Windows-Installer über GitHub Releases veröffentlicht und aktualisiert sich künftig selbst. Die Projektdokumentation beschreibt den neuen Stack, und `rework/tauri` wird nach `main` übernommen.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 bis Task_10 archiviert.
- **Relevantes Vorwissen:** Alter Release-Ablauf: `tag-release.js`/`tag-release.ps1`, `.github/workflows/`, Root-`AGENTS.md` (Versionssprung + `npm run release`). Neu: `tauri-apps/tauri-action`, `tauri-plugin-updater` mit Signaturschlüssel.

## Umfang

**Gehört dazu:**

- Tauri-Updater einbinden: Prüfung beim Start und per Tray „Nach Updates suchen“, Hinweis bei verfügbarem Update, Installation auf Wunsch.
- GitHub-Actions-Workflow: auf Tag `v*` Windows-Build (NSIS), Signierung der Update-Artefakte, Release mit `latest.json` für den Updater.
- Alte Electron-Workflows und Release-Skripte entfernen bzw. ersetzen; neues `npm run release` (Tag aus der Version erzeugen und pushen).
- Version auf `2.0.0` setzen (`package.json`, `src-tauri/tauri.conf.json`, `Cargo.toml` konsistent).
- Root-`AGENTS.md` und `README.md` (bereits vor Task 01 neu geschrieben) auf den tatsächlichen Stand prüfen und nachziehen.
- Merge von `rework/tauri` nach `main` und erstes Release – nur nach ausdrücklicher Freigabe durch den Nutzer.

**Gehört nicht dazu:**

- Code-Signing-Zertifikat für Windows SmartScreen (separat, kostenpflichtig).
- Brücken-Update aus 1.x (Nicht-Ziel); in den Release-Notes steht, dass 1.x deinstalliert und 2.0.0 neu installiert werden muss.

## Umsetzungsschritte

1. Updater-Schlüsselpaar erzeugen lassen – der Nutzer erzeugt es und hinterlegt den privaten Schlüssel als GitHub-Secret; öffentlichen Schlüssel in `tauri.conf.json` eintragen.
2. Updater-Plugin und UI (Tray-Eintrag, Hinweis) einbinden.
3. GitHub-Actions-Workflow mit `tauri-action` erstellen und alte Workflows entfernen.
4. Release-Skript neu schreiben, Versionen auf 2.0.0 setzen.
5. Root-`AGENTS.md` und `README.md` auf den tatsächlichen Stand prüfen und nachziehen.
6. Gesamte manuelle Prüfliste aller Tasks einmal am Release-Kandidaten durchgehen.
7. Nach Freigabe: Merge nach `main`, Tag `v2.0.0`, Release prüfen, Update-Pfad mit einem Test-Release `v2.0.1` (oder Pre-Release) verifizieren.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Versionsvergleich/Update-Entscheidung, falls eigene Logik entsteht (sonst entfällt).
- Skript-Test (`tests/`): Release-Skript erkennt inkonsistente Versionen in `package.json`, `tauri.conf.json` und `Cargo.toml` und bricht ab.
- Manuelle Prüfliste: Installer installiert und startet auf einem sauberen Windows; Update von 2.0.0 auf eine Testversion funktioniert; Deinstallation entfernt die App.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] GitHub-Release `v2.0.0` enthält Installer, Signaturen und `latest.json`.
- [ ] Ein installiertes 2.0.0 findet und installiert ein nachfolgendes Test-Release.
- [ ] Root-`AGENTS.md` und `README.md` beschreiben ausschließlich den neuen Stack.
- [ ] `npm test` läuft grün auf `main` nach dem Merge.

## Offene Fragen / Annahmen

- Geklärt (vor Task 01): Semantische Versionierung, Versionssprung nur bei Release auf Wunsch (siehe Root-`AGENTS.md`).
- Externe Voraussetzung: Nutzer muss den Updater-Schlüssel erzeugen und als GitHub-Secret hinterlegen.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

**Stand 2026-11-20 (Agent):**

- Erledigt: `tauri-plugin-updater` + `tauri-plugin-process` eingebunden (`src-tauri/src/updates.rs`), Einstellungsseite „Updates“, Tray „Nach Updates suchen“, Prüfung 20 s nach dem Start. Updater ist nur aktiv, wenn `plugins.updater.pubkey` gesetzt ist (sonst Status „disabled“, App läuft normal).
- Erledigt: `.github/workflows/release.yml` (Tag `v*` → Tests → `tauri-action`, Draft-Release mit Installer, Signatur, `latest.json`; Updater-Artefakte nur im CI per `--config`), `.github/workflows/ci.yml` (Typecheck + Tests). Alte Electron-Workflows und `tag-release.*` entfernt; neue Skripte `scripts/versions.mjs`, `version-check.mjs`, `release.mjs` (nur von `main`, sauberer Baum, Tag existiert noch nicht).
- Erledigt: Version überall 2.0.0 (`npm run version:check`). Root-`AGENTS.md` und `README.md` wurden bereits vor Task 01 neu geschrieben und hier um „Releases and auto-update“ ergänzt.
- Tests: 5 Vitest-Tests für die Versionsprüfung (inkl. echtem Repository), 1 Rust-Test Fortschritt. Gesamt: 40 UI-Tests, 78 Rust-Tests grün; 7 Hardware-/Modelltests (`--ignored`) zuvor einzeln grün.
- Release-Build: `Gemini Tray_2.0.0_x64-setup.exe` (≈ 8,3 MB) baut; enthält die VC++-DLLs, nicht `DirectML.dll`. Rauchtest der Release-exe aus einem sauberen Ordner: startet, Shortcuts registriert, Log „Gemini bridge self-test passed“ im echten WebView2-Fenster.

**Offen – braucht den Nutzer (deshalb ist dieser Task noch nicht archiviert):**

1. Updater-Schlüssel erzeugen, öffentlichen Schlüssel in `tauri.conf.json` eintragen, GitHub-Secrets setzen (Anleitung in Root-`AGENTS.md`).
2. Gesamt-Prüfliste unten am Release-Kandidaten durchgehen.
3. Freigabe für Merge `rework/tauri` → `main`, danach `npm run release` (Tag `v2.0.0`), Draft-Release prüfen und veröffentlichen, Update-Pfad mit `v2.0.1` testen.

**Gesamt-Prüfliste für den Nutzer (aus allen Tasks gesammelt):**

- [ ] Alte 1.x-App beenden/deinstallieren, Installer ausführen, App startet im Tray (T01)
- [ ] Alt+Space blendet ein/aus; Schließen-Knopf versteckt nur; Tray „Beenden“; Doppelstart holt Fenster nach vorn (T01)
- [ ] Google-Anmeldung im Fenster – klappt das direkt? Sonst Tray › „Mit Browser anmelden“; nach Neustart weiterhin angemeldet; „Sitzung zurücksetzen“ (T02)
- [ ] Shortcut in den Einstellungen ändern → sofort aktiv und nach Neustart; belegter Shortcut wird abgelehnt; Autostart; Sprache umschalten (T03)
- [ ] Alt+N öffnet neuen Chat (T04)
- [ ] Einstellungen › Sprache: Modell-Download (≈ 670 MB) mit Fortschritt; auf dem Testrechner ist es bereits vorhanden (T05)
- [ ] Alt+Shift+V: Diktat DE/EN → Zwischenablage; ✕/Esc bricht ab; Mikrofon abziehen; Mikrofon in Windows sperren → Hinweis (T06)
- [ ] Alt+V: Sprachnachricht wird eingefügt und gesendet; mit „automatisch senden“ aus nur eingefügt (T07)
- [ ] Alt+Shift+S: Bereich wählen → Bild erscheint im Gemini-Eingabefeld (Drop-Upload, nur eingeloggt prüfbar); Esc/Rechtsklick bricht ab (T08)
- [ ] Alt+J: Prompt wählen → steht im Eingabefeld; anschließende Sprachnachricht wird angehängt (T09)
- [ ] Deckkraft-Regler: Gemini-Inhalt wird mit durchsichtig, keine schwarzen Flächen; Position nach Neustart wiederhergestellt (T10)

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [ ] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [ ] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [ ] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [ ] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

<!-- ERKENNTNISSE-OFFEN: Vor der Archivierung ausfüllen und diese Zeile löschen. -->

Vor der Archivierung vom Agenten auszufüllen. Schreibe so, dass ein Agent, der diesen Task nie gesehen hat, davon bei späteren Tasks profitiert:

- **Umgesetzt (und Abweichungen vom Plan):**
- **Learnings & Stolpersteine:**
- **Wichtige Entscheidungen und ihre Gründe:**
- **Auswirkungen auf Folge-Tasks:**
- **Hinweise zu Tests und Befehlen:**
