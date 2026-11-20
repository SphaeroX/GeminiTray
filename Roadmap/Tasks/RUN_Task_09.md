# Task_09: Prompt-Menü

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_09.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Der Nutzer verwaltet gespeicherte Prompts in den Einstellungen und wählt sie per `Alt+J` aus einem Schnellmenü. Ein gewählter Prompt wird bei Sprachnachricht und Screenshot nativ vorangestellt und bei getippten Nachrichten ins Eingabefeld vorbefüllt – ohne das Senden auf der Webseite abzufangen.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_04, Task_07 und Task_08 archiviert.
- **Relevantes Vorwissen:** Alte Oberfläche als Referenz: `git show main:src/components/PromptsMenu.vue`. Präfix-Haken aus Task 07 und Task 08. **Design:** Artboard „Prompt-Schnellmenü“ im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Prompt-Verwaltung in den Einstellungen: anlegen, bearbeiten, löschen, sortieren (Name + Inhalt).
- Schnellmenü-Fenster (`Alt+J`): Suche, Pfeiltasten, Enter wählt, `Esc` schließt.
- Verhalten nach Auswahl: Prompt wird „aktiv“ (sichtbar im Indikator bzw. als Tray-Tooltip) und gilt für die nächste Sprachnachricht oder den nächsten Screenshot; zusätzlich wird er sofort per `insertText` ins Gemini-Eingabefeld vorbefüllt.
- Aktiver Prompt wird nach einmaliger Verwendung zurückgesetzt; Option „Auswahl aufheben“ im Menü.

**Gehört nicht dazu:**

- Abfangen des Gemini-Senden-Knopfs oder der Enter-Taste.
- Synchronisation mit Gemini-Gems.

## Umsetzungsschritte

1. Prompt-Liste im Settings-Modell ergänzen (mit Schema-Version) und Verwaltungs-UI bauen.
2. Schnellmenü-Fenster mit Suche und Tastatursteuerung bauen.
3. Zustand „aktiver Prompt“ in Rust halten und an die Präfix-Haken aus Task 07/08 anbinden.
4. Vorbefüllung per `insertText` bei Auswahl umsetzen.
5. Shortcut anbinden, Hinweis „noch nicht verfügbar“ entfernen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: aktiver Prompt wird genau einmal angewendet und danach zurückgesetzt; Präfix-Formatierung.
- Rust: Laden alter Settings ohne Prompt-Liste (Schema-Upgrade) ergibt leere Liste.
- UI: Suche filtert nach Name und Inhalt, Tastatursteuerung wählt den richtigen Eintrag.
- Manuelle Prüfliste: Prompt wählen → Sprachnachricht → Präfix steht in der gesendeten Nachricht; Prompt wählen → Screenshot → Präfix im Eingabefeld; Prompt wählen und tippen.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Alle genannten Tests laufen grün.
- [ ] Manuelle Prüfliste bestanden.
- [ ] Kein Code fängt Senden oder Enter auf der Gemini-Seite ab (per Code-Suche belegt).

## Offene Fragen / Annahmen

- Annahme (aus der Planung bestätigt): Vorbefüllen statt Abfangen beim Senden getippter Nachrichten.

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
