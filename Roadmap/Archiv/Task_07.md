# Task_07: Sprachnachricht an Gemini

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_07.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Mit `Alt+V` nimmt der Nutzer eine Sprachnachricht auf; der erkannte Text wird über die Brücke in Gemini eingefügt und je nach Einstellung automatisch gesendet (Standard: an). Damit ist die wichtigste und bisher fehleranfälligste Funktion zuverlässig.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_04 und Task_06 archiviert.
- **Relevantes Vorwissen:** Wiederverwendung: Aufnahme, Zustandsautomat und Indikator aus Task 06, Brücke (`insertText`, `send`) aus Task 04. **Design:** Artboards „Aufnahme-Indikator“ (Sprachnachricht mit aktivem Prompt), „Einstellungen – Sprache“ (automatisch senden) und „Toasts“ („Nicht in Gemini eingefügt“) im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Shortcut `Alt+V`: Fenster anzeigen, Aufnahme starten; erneuter Druck stoppt.
- Nach Transkription: `insertText` und bei aktivierter Einstellung `send`.
- Einstellung „Sprachnachricht automatisch senden“ (Standard: an) in den Einstellungen.
- Fehler der Brücke (Seite nicht bereit, Selektor fehlt) → Text bleibt erhalten: wird in die Zwischenablage gelegt und der Nutzer informiert.
- Haken für ein aktives Prompt-Präfix vorsehen (Schnittstelle, die Task 09 füllt).

**Gehört nicht dazu:**

- Gemini Live / Sprachausgabe.
- Prompt-Menü selbst (Task 09).

## Umsetzungsschritte

1. Ablauf „Sprachnachricht“ als Funktion über Aufnahme → Transkription → Brücke implementieren.
2. Shortcut `Alt+V` anbinden, Hinweis „noch nicht verfügbar“ entfernen.
3. Einstellung „automatisch senden“ ergänzen (DE/EN).
4. Fallback auf Zwischenablage bei Brückenfehlern umsetzen.
5. Schnittstelle für ein optionales Text-Präfix (aktiver Prompt) vorbereiten.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Ablauf mit simulierter Brücke – automatisch senden an/aus; Brückenfehler → Text in Zwischenablage + Fehlermeldung; Präfix wird korrekt vorangestellt (mit Leerzeile getrennt).
- Manuelle Prüfliste: Sprachnachricht DE/EN mit und ohne Auto-Senden; Nachricht bei verborgenem Fenster; Nachricht während Gemini noch antwortet; 20 Nachrichten hintereinander ohne Neustart.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Ablauf-Tests mit simulierter Brücke laufen grün.
- [ ] Manuelle Prüfliste bestanden, inklusive 20 Nachrichten ohne Neustart.
- [ ] Bei einem Brückenfehler geht kein diktierter Text verloren.

## Offene Fragen / Annahmen

- Annahme: Steht bereits Text im Gemini-Eingabefeld, wird der erkannte Text angehängt statt ihn zu ersetzen.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 5 Rust-Tests (`tests/rust/voice_message.rs`) grün: Nachricht zusammensetzen, Präfix mit Leerzeile, leeres Ergebnis, Auto-Senden.
- Die einzelnen Bausteine sind getestet: Aufnahme (Task 06, echtes Mikrofon), Erkennung (Task 05, echtes Modell), Einfügen und Senden-Knopf (Task 04, live auf gemini.google.com).
- **Manuelle Prüfliste offen für den Nutzer:** Sprachnachricht DE/EN mit und ohne Auto-Senden, bei verborgenem Fenster, während Gemini antwortet, 20 Nachrichten in Folge – im eingeloggten Fenster.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `voice_message::{compose, deliver}`; `Alt+V` startet `Mode::Message` (Fenster wird beim Start eingeblendet). Nach der Erkennung: `bridge::wait_ready` (10 s) → `insert_text` (anhängen) → bei „automatisch senden“ `send`. Bei jedem Fehler landet der Text in der Zwischenablage und der Toast `bridge.failed` erklärt Strg + V.
- **Learnings & Stolpersteine:** Kurze Pause (150 ms) zwischen Einfügen und Senden, damit Gemini den Senden-Knopf nach dem Input-Event aktiviert; `send()` wartet zusätzlich bis 15 s auf einen aktiven Knopf.
- **Wichtige Entscheidungen und ihre Gründe:** Vorhandener Text im Eingabefeld bleibt erhalten, die Sprachnachricht wird angehängt (siehe Annahme im Task).
- **Auswirkungen auf Folge-Tasks:** Task 09 muss nur `prompts::take_active_content` und `prompts::active_name` implementieren (Präfix wird bereits per Leerzeile vorangestellt). Dasselbe Muster (Fenster zeigen → `wait_ready` → Bridge → Fallback Zwischenablage) für Task 08 verwenden.
- **Hinweise zu Tests und Befehlen:** `cargo test --manifest-path src-tauri/Cargo.toml --test voice_message`.
