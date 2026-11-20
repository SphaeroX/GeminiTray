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
