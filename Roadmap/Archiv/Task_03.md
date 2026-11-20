# Task_03: Einstellungen, Shortcuts, Autostart, i18n

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_03.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Es gibt ein eigenes Einstellungsfenster auf Deutsch und Englisch, in dem Shortcuts aufgenommen und geändert sowie Autostart und „minimiert starten“ geschaltet werden können. Alle Einstellungen werden dauerhaft gespeichert. Folge-Tasks hängen ihre Einstellungen hier an.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 archiviert.
- **Relevantes Vorwissen:** Gestaltung und Kategorien der alten Einstellungen als Referenz: `git show main:src/components/SettingsView.vue`, Texte: `git show main:src/locales/en.json`. Standard-Shortcuts: `Alt+Space` (Ein-/Ausblenden), `Alt+Shift+S` (Screenshot), `Alt+V` (Sprachnachricht), `Alt+Shift+V` (Diktat), `Alt+N` (Neuer Chat), `Alt+J` (Prompt-Menü). **Design:** Artboards „Einstellungen – Shortcuts“ (Navigation, Karten, Shortcut-Recorder mit Konflikt- und Aufnahmezustand) und „Toasts“ im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Settings-Modell in Rust mit Standardwerten, Versionierung des Schemas und Speicherung (z. B. `tauri-plugin-store`) im App-Datenordner.
- Einstellungsfenster (Vue) aus Tray-Menü „Einstellungen“ erreichbar; Kategorien: Allgemein, Shortcuts (weitere Kategorien kommen in Folge-Tasks).
- Shortcut-Recorder: Tastenkombination aufnehmen; während der Aufnahme sind globale Shortcuts pausiert; Konflikte (bereits belegt, doppelt in der App, ungültig) werden sichtbar gemeldet und nicht gespeichert.
- Alle sechs Shortcuts sind konfigurierbar; Aktionen ohne Implementierung zeigen bis zu ihrem Task einen Hinweis „noch nicht verfügbar“.
- Autostart (`tauri-plugin-autostart`) und „minimiert starten“.
- i18n mit `vue-i18n`, Sprachdateien DE und EN, Auswahl nach Systemsprache, Fallback EN.
- Kleine Toast-Komponente für Rückmeldungen.

**Gehört nicht dazu:**

- Transparenz, „Immer im Vordergrund“, Fensterposition (Task 10).
- Prompt-Verwaltung (Task 09), Sprach- und Screenshot-Einstellungen (Tasks 05–08).
- Import der alten 1.x-Einstellungen (Nicht-Ziel).

## Umsetzungsschritte

1. Settings-Struktur und Standardwerte in Rust definieren, Laden/Speichern mit Schema-Version und robustem Verhalten bei beschädigter Datei (Standardwerte + Log-Warnung).
2. Tauri-Commands `get_settings` / `update_settings` und ein Event bei Änderungen bereitstellen.
3. Shortcut-Verwaltung zentralisieren: Registrieren, Neu-Registrieren bei Änderung, Pausieren während der Aufnahme, Fehler zurückmelden.
4. Einstellungsfenster als eigenes Tauri-Fenster mit Vue-Router oder einfacher Ansichtsumschaltung bauen.
5. Shortcut-Recorder-Komponente mit Validierung umsetzen.
6. Autostart und „minimiert starten“ anbinden.
7. i18n einrichten und alle Texte in DE/EN pflegen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Laden mit fehlender Datei → Standardwerte; beschädigte Datei → Standardwerte; Speichern und erneutes Laden ergibt identische Werte.
- Rust: Konfliktprüfung von Shortcuts (Doppelbelegung innerhalb der App wird abgelehnt).
- UI: Shortcut-Recorder wandelt Tastenereignisse korrekt in das Tauri-Shortcut-Format (`Alt+Shift+S`) um und lehnt reine Modifier ab.
- UI: Beide Sprachdateien haben dieselben Schlüssel (kein fehlender Text).
- Manuelle Prüfliste: Shortcut ändern wirkt sofort und nach Neustart; Autostart an → App startet nach Windows-Anmeldung minimiert; Sprache folgt der Systemsprache.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Alle genannten Tests in `tests/` laufen grün.
- [ ] Ein geänderter Shortcut ist sofort aktiv und bleibt nach Neustart erhalten.
- [ ] Ein bereits belegter Shortcut wird mit verständlicher Meldung abgelehnt und nicht gespeichert.
- [ ] Die Oberfläche ist vollständig auf Deutsch und Englisch verfügbar.

## Offene Fragen / Annahmen

Keine.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- Rust: 10 Tests (`tests/rust/settings.rs`) grün; UI: 14 Vitest-Tests grün (Recorder, Übersetzungen, Toast-Texte, Komponenten).
- Optische Prüfung im Browser-Vorschaumodus (`npx vite`, `src/lib/devmock.ts` ersetzt das Backend): Shortcuts-, Allgemein- und Konto-Seite sowie Toasts entsprechen dem Design; Recorder nimmt `Strg + Alt + K` korrekt auf. Gefundener Fehler (Hintergrund reichte nicht bis unten, `#app` ohne Höhe) behoben.
- Echter Start (`tauri dev`): Konflikterkennung funktioniert – die laufende 1.x-App belegt Alt+Space, Alt+V, Alt+Shift+V, Alt+N, Alt+J; es erscheint der Toast „Shortcut belegt“ mit Liste.
- **Manuelle Prüfliste offen für den Nutzer:** Shortcut ändern (sofort aktiv + nach Neustart), Autostart, Sprachumschaltung im echten Fenster.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** Statt `tauri-plugin-store` eine eigene `settings.json` (serde, `#[serde(default)]`, atomisches Speichern, Backup `settings.broken.json` bei Defekt) – besser testbar. Das komplette Settings-Modell (inkl. `voice`, `window`, `prompts`) existiert schon; Folge-Tasks müssen nur UI/Logik ergänzen. Einstellungen werden sofort beim Ändern gespeichert (wie Windows-Einstellungen), kein Speichern-Knopf. Toast-Fenster (`toast.rs`, `src/pages/toast`) ist hier mit umgesetzt.
- **Learnings & Stolpersteine:** `listen()`/`invoke()` funktionieren nur in Tauri → `src/lib/events.ts` (`onEvent`) und `invoke` in `api.ts` fallen im Browser auf `src/lib/devmock.ts` zurück. So lassen sich alle Seiten mit `npx vite` im Browser prüfen (Mocks für neue Befehle in `mockHandlers` ergänzen). `#app` braucht `height: 100%`. Overlay-Fenster: `appwindows::overlay_window` (randlos, transparent, nicht fokussierbar, immer oben) und `appwindows::place(w, bottom_right|bottom_center)`.
- **Wichtige Entscheidungen und ihre Gründe:** Shortcut-Änderung = alle abmelden, neue registrieren; schlägt eine neue fehl, wird der alte Satz wiederhergestellt und `Taken` gemeldet. Ein bereits beim Start belegter, unveränderter Shortcut blockiert das Speichern anderer Änderungen nicht. Während der Aufnahme im Recorder sind alle globalen Shortcuts pausiert (`pause_shortcuts`/`resume_shortcuts`).
- **Auswirkungen auf Folge-Tasks:** Neue Aktionen in `actions::run` eintragen (derzeit „noch nicht verfügbar“-Toast). Neue Einstellungsseiten: Komponente in `src/pages/settings/sections/` + Eintrag in `sections/index.ts`. Meldungen über `notify::show(app, Level, "schluessel", detail)` + Texte unter `toast.<schluessel>.{title,body}` in beiden Sprachdateien (Test prüft Gleichheit der Schlüssel).
- **Hinweise zu Tests und Befehlen:** UI-Vorschau: `.claude/launch.json` „ui-preview“ bzw. `npx vite` → `http://localhost:1420/settings.html#shortcuts`. Läuft der Vorschau-Server, nutzt `tauri dev` ihn mit (Port 1420).
