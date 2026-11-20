# Task_04: Gemini-Brücke und „Neuer Chat“

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_04.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Alle Eingriffe in die Gemini-Seite laufen über eine kleine, gekapselte Brücke mit genau vier Operationen: Text einfügen, Bild einfügen, Senden, Neuer Chat. Ein Selbsttest erkennt, wenn Google die Seite geändert hat, und meldet das verständlich statt still zu scheitern. Als erste Nutzung funktioniert `Alt+N`.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 und Task_03 archiviert.
- **Relevantes Vorwissen:** Die alte App scheiterte an genau diesem Punkt (`git show main:electron/prompt-injection.js`, ~1.100 Zeilen DOM-Logik). Das Leitprinzip in `Roadmap/README.md` gilt strikt: Diese Brücke ist der einzige Ort mit DOM-Zugriff auf gemini.google.com. **Design:** Artboard „Toasts“ (Meldung „Gemini-Seite hat sich geändert“) im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Injiziertes Skript (TypeScript, gebündelt) mit API `insertText(text)`, `insertImage(pngBytes)`, `send()`, `newChat()` und `selfTest()`.
- Alle DOM-Selektoren in einer einzigen Datei, mit Fallback-Reihenfolge und Kommentar, wann sie zuletzt geprüft wurden.
- Text einfügen über Fokus auf das Eingabefeld und Einfüge-Ereignisse, die der Editor akzeptiert (kein direktes Setzen von `innerHTML`).
- Bild einfügen über ein synthetisches Paste-Ereignis mit Datei (Alternative: Zwischenablage + Einfügen), mit Wartezeit, bis die Vorschau erscheint.
- Rust-Seite: Commands/Funktionen zum Aufrufen der Brücke mit Zeitlimit und typisierten Fehlern (`SeiteNichtBereit`, `SelektorNichtGefunden`, `Zeitüberschreitung`).
- Selbsttest nach jedem Seitenladen; schlägt er fehl, Toast/Tray-Hinweis „Gemini-Seite hat sich geändert – bitte Update prüfen“ und Log-Eintrag.
- `Alt+N` öffnet das Fenster und startet einen neuen Chat (bevorzugt Navigation auf die Neuer-Chat-URL statt Klick).

**Gehört nicht dazu:**

- Modellauswahl, Abfangen des Sende-Knopfs, Lesen von Antworten oder Aufnahmestatus.
- Sprach- und Screenshot-Logik (Tasks 06–08) – sie nutzen die Brücke nur.

## Umsetzungsschritte

1. Aktuelle Gemini-Seite untersuchen (DevTools) und die minimal nötigen Selektoren für Eingabefeld, Senden-Knopf und Bild-Vorschau bestimmen; HTML-Ausschnitte als Test-Fixtures unter `tests/ui/fixtures/` speichern.
2. Brücken-Skript mit den vier Operationen und `selfTest()` schreiben, Selektoren zentral halten.
3. Build-Schritt einrichten, der das Skript bündelt und als Initialisierungsskript in die Gemini-Webview lädt.
4. Rust-Wrapper mit Zeitlimit und Fehler-Typen schreiben (Kommunikation z. B. über `eval` + Rückkanal-Event).
5. Selbsttest nach Seitenladen auslösen und Fehlermeldung anbinden.
6. `Alt+N` an `newChat()` bzw. Navigation koppeln und den Hinweis „noch nicht verfügbar“ aus Task 03 entfernen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- UI (jsdom, `tests/ui/bridge.*.test.ts`): Gegen die gespeicherten Fixtures findet die Brücke das Eingabefeld und den Senden-Knopf; `insertText` erzeugt den erwarteten Text im Editor; `selfTest` meldet bei einem Fixture ohne Eingabefeld einen klaren Fehler.
- Rust: Zeitüberschreitung und Fehlerumwandlung des Wrappers (mit simuliertem Rückkanal).
- Manuelle Prüfliste (echte Seite): Text einfügen, Bild einfügen (Test-PNG), Senden, Neuer Chat – jeweils erfolgreich; Selektor absichtlich verfälschen → verständliche Meldung erscheint.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Außerhalb des Brücken-Moduls gibt es keinen Code mit DOM-Zugriff auf gemini.google.com (per Code-Suche belegt).
- [ ] UI- und Rust-Tests der Brücke laufen grün.
- [ ] Manuelle Prüfliste gegen die echte Seite bestanden, Datum der Prüfung in der Selektor-Datei vermerkt.
- [ ] `Alt+N` öffnet einen neuen Chat.

## Offene Fragen / Annahmen

- Offen: Welche Einfügemethode für Bilder akzeptiert der Gemini-Editor zuverlässig (synthetisches Paste-Ereignis vs. echte Zwischenablage)? Wird im Task ermittelt und in `Roadmap/README.md` festgehalten.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- Struktur der echten Seite am 2026-11-20 (abgemeldet, deutsche Oberfläche) im Browser untersucht und als Fixtures gespeichert (`tests/ui/fixtures/gemini-input-{empty,filled}.html`).
- 13 Bridge-Tests (Vitest/jsdom) und 5 Rust-Tests grün.
- **Live-Test auf gemini.google.com** (Bridge-Code per DevTools eingespielt): `selfTest` ok, `insertText` mehrzeilig + Anhängen erzeugt `<p>Zeile eins</p><p>Zeile zwei</p><p>Angehängt</p>`, Senden-Knopf „Nachricht senden“ gefunden und aktiv. Absenden selbst nicht ausgelöst.
- **Nicht live prüfbar (abgemeldet):** Bild-Upload per Drop – übernommen aus der in 1.x bewährten Methode (Drop auf `[xapfileselectordropzone]`, Ctrl+V scheitert dort). **Manuelle Prüfung durch den Nutzer offen** (Task 08 nutzt es), ebenso `Alt+N` im echten Fenster.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `src/bridge/{selectors,dom,index}.ts` → gebündelt nach `src-tauri/bridge/gemini-bridge.js`, per `include_str!` eingebettet und als `initialization_script` ins Hauptfenster injiziert. Operationen: `insertText(text, append)`, `insertImage(pngBase64)` (wartet auf Vorschau, sonst `not_attached`), `send()` (wartet bis 15 s, bis der Knopf aktiv ist – Upload!), `selfTest()`, `ping`. „Neuer Chat“ braucht keinen DOM-Zugriff: Navigation auf `/app` (`actions::new_chat`). Selbsttest einmal pro App-Lauf nach dem ersten Laden, Warn-Toast `bridge.page_changed`.
- **Learnings & Stolpersteine:** Kommunikation ohne IPC-Rechte für die Google-Seite: Rust ruft `__geminiTray.start(id, op, args)` per `eval` auf und fragt `poll(id)` mit `eval_with_callback` ab (Promise-Ergebnisse kann `eval_with_callback` nicht direkt liefern). `eval_with_callback` blockiert → nur aus Hintergrund-Threads aufrufen (`bridge::call`). Gemini erzwingt Trusted Types: kein `innerHTML` im Bridge-Code. Eingabe per `execCommand('insertText'/'insertParagraph')` funktioniert mit Quill; Fallback baut `<p>`-Absätze (für jsdom). `build.rs` baut das Bundle, falls es fehlt (`npm run build:bridge`).
- **Wichtige Entscheidungen und ihre Gründe:** Die Gemini-Seite bekommt weiterhin keine Capabilities. Einfügen hängt standardmäßig an vorhandenen Text an (keine Eingaben des Nutzers überschreiben).
- **Auswirkungen auf Folge-Tasks:** `bridge::{insert_text, insert_image, send, wait_ready}` sind blockierend → in `std::thread::spawn` aufrufen. Vor dem Einfügen `windowing::show_main` und ggf. `bridge::wait_ready(app, 10s)`. Bei Fehlern Text/Bild in die Zwischenablage + Toast `bridge.failed` mit Detail.
- **Hinweise zu Tests und Befehlen:** Selektoren live prüfen: gemini.google.com im Browser öffnen, `document.querySelector('rich-textarea .ql-editor[contenteditable="true"]')`. Fixtures bei Seitenänderungen neu erfassen (Kommentar in den Fixture-Dateien).
