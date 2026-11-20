# Gemini Tray 2.0 – Roadmap

Projektübergreifendes Gedächtnis. Agenten lesen diese Datei vor jedem Task und aktualisieren sie, wenn sich etwas ergibt, das über einen einzelnen Task hinausgeht. Regeln für die Arbeit: [AGENTS.md](AGENTS.md).

## Projektziel

Gemini Tray 2.0 ist ein kompletter Neuaufbau der bisherigen Electron-App als schlanke Windows-Tray-App auf Basis von Tauri 2 (Rust-Kern, Vue-3-Oberfläche). Ziel ist Zuverlässigkeit: Die alte App ist immer wieder ausgefallen, weil sie die Gemini-Webseite fernsteuert (Mikrofon-Button klicken, Modell per Klick wählen, Aufnahmestatus aus dem DOM lesen). Die neue App erledigt alles Fehleranfällige nativ und berührt die Webseite nur noch an wenigen, klar gekapselten Stellen.

**Was die Software tut:** Die App lebt im System-Tray und zeigt per globalem Shortcut (Standard `Alt+Space`) ein Fenster mit der echten Gemini-Webseite (gemini.google.com) im Google-Konto des Nutzers, ohne API-Key, mit allen Web-Funktionen (Gems, Verlauf, Canvas, Deep Research). Native Zusatzfunktionen:
- **Sprachnachricht** (`Alt+V`): Mikrofon nativ aufnehmen, lokal mit Parakeet transkribieren (DE/EN automatisch), Text in Gemini einfügen, je nach Einstellung automatisch senden (Standard: an).
- **Diktat** (`Alt+Shift+V`): aufnehmen, lokal transkribieren, Text in die Zwischenablage.
- **Screenshot & Ask** (`Alt+Shift+S`): Bildschirmbereich wählen, Bild in das Gemini-Eingabefeld einfügen.
- **Neuer Chat** (`Alt+N`) und **Prompt-Menü** (`Alt+J`) mit gespeicherten Prompts.
- Einstellungsfenster (DE/EN), konfigurierbare Shortcuts, Autostart, minimiert starten, Transparenz, „Immer im Vordergrund“, Auto-Update über GitHub Releases.

**Zielgruppe:** In erster Linie der Projektinhaber selbst, darüber hinaus Windows-Nutzer, die Gemini mit ihrem Google-Konto (inkl. Abo) schnell per Shortcut erreichen wollen. Open Source auf GitHub.

**Nicht-Ziele:** Linux und macOS; Gemini-API-Key oder Vertex AI; automatische Modellwahl; Übernahme von Einstellungen/Prompts aus 1.x; Brücken-Update von 1.x (Nutzer installieren 2.0.0 neu); E2E-Tests gegen die echte Gemini-Seite; Diktat direkt in fremde Anwendungen tippen (nur Zwischenablage); eigene Chat-Oberfläche statt der Gemini-Webseite.

## Aktueller Status

Stand: 2026-11-20 – Roadmap angelegt, noch kein Task begonnen.

| Task | Titel | Status |
|---|---|---|
| 01 | Durchstich: Tauri-Gerüst mit Tray und Gemini-Fenster | offen |
| 02 | Google-Login und dauerhafte Sitzung | offen |
| 03 | Einstellungen, Shortcuts, Autostart, i18n | offen |
| 04 | Gemini-Brücke und „Neuer Chat“ | offen |
| 05 | Lokale Spracherkennung (Parakeet) | offen |
| 06 | Diktat in die Zwischenablage | offen |
| 07 | Sprachnachricht an Gemini | offen |
| 08 | Screenshot & Ask | offen |
| 09 | Prompt-Menü | offen |
| 10 | Fensterverhalten | offen |
| 11 | Release, Auto-Update, Umstellung | offen |

Status ist `offen`, `läuft` (Datei trägt das Präfix `RUN_`) oder `erledigt` (Datei liegt in `Archiv/`). Die Tabelle wird beim Archivieren eines Tasks aktualisiert.

## Taskübergreifende Entwicklungsinfos

Globale Informationen, Architekturentscheidungen und Wissen, das für das gesamte Projekt gilt. Wird laufend ergänzt; jeden Eintrag mit dem Task kennzeichnen, aus dem er stammt.

- **[Planung] Stack:** Tauri 2, Rust (stable) für den Kern, Vue 3 + TypeScript + Vite für eigene Fenster (Einstellungen, Overlays, Menüs). Plattform: nur Windows 10/11 (WebView2).
- **[Planung] Leitprinzip:** Alles, was die App selbst kann, wird nativ in Rust gelöst (Audio, Spracherkennung, Screenshot, Zwischenablage, Shortcuts). Die Gemini-Seite wird ausschließlich über die gekapselte „Gemini-Brücke“ (Task 04) angesprochen, die nur vier Operationen kennt: Text einfügen, Bild einfügen, Senden, Neuer Chat. Keine weiteren DOM-Eingriffe außerhalb dieser Brücke.
- **[Planung] Branch:** Die gesamte Roadmap wird auf dem Branch `rework/tauri` umgesetzt. `main` bleibt bis Task 11 die lauffähige Electron-Version 1.x. Erst Task 11 merged nach `main`.
- **[Planung] Versionierung/Release:** Während der Roadmap gibt es keine Versionssprünge pro Änderung und kein `npm run release` (abweichend von der Root-`AGENTS.md`, siehe `Roadmap/AGENTS.md` Abschnitt 7). Die neue App startet mit Version 2.0.0 (Task 11).
- **[Planung] Tests:** Vue/TypeScript-Tests mit Vitest unter `tests/ui/`; Rust-Integrationstests unter `tests/rust/`, eingebunden über `[[test]] path = "../tests/rust/<name>.rs"` in `src-tauri/Cargo.toml`. Reine Rust-Unit-Tests im Modul (`#[cfg(test)]`) sind zusätzlich erlaubt. Testbare Logik gehört in Module ohne Tauri-Laufzeitabhängigkeit. Die Zusammenarbeit mit der echten Gemini-Seite wird je Task über eine manuelle Prüfliste bestätigt (keine E2E-Tests gegen gemini.google.com).
- **[Planung] Design:** Verbindlicher Entwurf: [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk) (Artboards: Einstellungen – Shortcuts, Einstellungen – Sprache, Aufnahme-Indikator, Prompt-Schnellmenü, Toasts, Screenshot-Overlay). Stil: Windows 11 / Fluent, kein externes Design-System. Eckwerte:
  - Schrift: `'Segoe UI Variable Text', 'Segoe UI', system-ui` (Überschriften `Segoe UI Variable Display`, 28 px / 600); Fließtext 14 px, Beschreibungen 12 px.
  - Hell: Fensterhintergrund `#F3F3F3`, Inhaltsfläche `#F9F9F9`, Karte `#FFFFFF` mit Rand `#E5E5E5`, Text `#1A1A1A`, sekundär `#5C5C5C`, Akzent `#005FB8`, Fehler `#C42B1C`, Erfolg `#0F7B0F`.
  - Dunkel: `#202020` / `#272727` / Karte `#2D2D2D`, Text `#FFFFFF`, sekundär `#C8C8C8`, Akzent `#60CDFF`, Fehler `#FF99A4`, Erfolg `#6CCB5F`.
  - Hell/Dunkel folgt dem Windows-Farbmodus. Radien: Karten 6 px, Steuerelemente 4 px, Fenster/Dialoge 8 px, Pillen voll gerundet. Setting-Zeilen mindestens 64 px hoch, Knöpfe 32 px.
  - Einstellungsfenster: Seitennavigation 220 px (Allgemein, Shortcuts, Sprache, Prompts, Fenster, Konto, Updates) mit Akzent-Balken am aktiven Eintrag; eine Karte pro Einstellung.
  - Aufnahme-Indikator, Screenshot-Hinweisleiste: immer dunkle Pille (`rgba(32,32,32,0.94)`), unabhängig vom Farbmodus.
  - Icons: schlanke Linien-Icons (1,2–1,4 px Strich), keine Emojis.
  - Falls Mica/Acrylic über Tauri (`window-vibrancy`) sauber funktioniert, darf es den einfarbigen Fensterhintergrund ersetzen.
- **[Planung] Spracherkennung:** Parakeet TDT 0.6B v3 (multilingual, DE/EN automatisch), lokal auf der CPU; Modell wird beim ersten Gebrauch heruntergeladen. Kein Cloud-STT.

## Auffälligkeiten & Details

Dinge, die global noch zu beachten sind: Besonderheiten, bekannte Einschränkungen, kleinere Details. Wird laufend ergänzt.

- **[Planung] Google-Login:** Google blockiert Anmeldungen in eingebetteten Browsern teilweise („This browser or app may not be secure“). Die alte App löste das mit Anmeldung im System-Chrome/Edge und Cookie-Übernahme per Remote-Debugging (`electron/services/browser-login-service.ts` auf `main`). Task 02 klärt, was mit WebView2 nötig ist.
- **[Planung] Shortcut-Konflikt:** Die offizielle Gemini-Windows-App (seit 09/2026) belegt ebenfalls `Alt+Space`. Registrierungsfehler von Shortcuts müssen sichtbar gemeldet werden, nicht stillschweigend scheitern.
- **[Planung] Referenz alter Code:** Der Electron-Code liegt nach Task 01 nur noch auf `main` und in der Git-Historie. Er darf als Referenz gelesen (`git show main:<pfad>`), aber nicht übernommen werden, wo er DOM-Fernsteuerung betreibt.
