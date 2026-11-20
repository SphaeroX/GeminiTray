# Task_03: Einstellungen, Shortcuts, Autostart, i18n

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_03.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Es gibt ein eigenes Einstellungsfenster auf Deutsch und Englisch, in dem Shortcuts aufgenommen und geändert sowie Autostart und „minimiert starten“ geschaltet werden können. Alle Einstellungen werden dauerhaft gespeichert. Folge-Tasks hängen ihre Einstellungen hier an.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 archiviert.
- **Relevantes Vorwissen:** Gestaltung und Kategorien der alten Einstellungen als Referenz: `git show main:src/components/SettingsView.vue`, Texte: `git show main:src/locales/en.json`. Standard-Shortcuts: `Alt+Space` (Ein-/Ausblenden), `Alt+Shift+S` (Screenshot), `Alt+V` (Sprachnachricht), `Alt+Shift+V` (Diktat), `Alt+N` (Neuer Chat), `Alt+J` (Prompt-Menü).

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
