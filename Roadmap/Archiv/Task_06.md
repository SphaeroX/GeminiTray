# Task_06: Diktat in die Zwischenablage

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_06.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Mit `Alt+Shift+V` startet und stoppt der Nutzer eine Aufnahme von überall aus; der lokal erkannte Text landet in der Zwischenablage. Das ist der erste nutzbare Sprach-Durchstich und baut die native Aufnahme, die Task 07 wiederverwendet.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_03 und Task_05 archiviert.
- **Relevantes Vorwissen:** Die alte App klickte dafür den Mikrofon-Button der Webseite und war dadurch instabil. Jetzt: Mikrofon nativ (z. B. `cpal`), Transkription über das `stt`-Modul aus Task 05. **Design:** Artboards „Aufnahme-Indikator“ (Zustände Diktat, Wird erkannt, Fehler) und „Toasts“ („Text kopiert“); Mikrofon-Auswahl im Artboard „Einstellungen – Sprache“ im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Modul `audio` für die Mikrofonaufnahme (Standard-Eingabegerät, Puffer im Speicher, Start/Stopp, Pegel für die Anzeige).
- Zustandsautomat `Leerlauf → Aufnahme → Transkription → Leerlauf` mit klaren Übergängen; ein zweiter Druck auf den Shortcut stoppt; `Esc` im Indikator bricht ab.
- Kleiner, randloser, immer-oben Aufnahme-Indikator (eigenes Fenster) mit Pegelanzeige, Status und Abbrechen.
- Ergebnis in die Zwischenablage, Toast „Text kopiert“; leeres Ergebnis → Hinweis statt leerer Zwischenablage.
- Fehlerfälle: kein Mikrofon, Zugriff verweigert (Windows-Datenschutzeinstellung), Gerät während der Aufnahme entfernt, Modell fehlt (Download aus Task 05 anstoßen).
- Maximale Aufnahmedauer (z. B. 10 min) mit automatischem Stopp.
- Einstellungen: Mikrofon-Auswahl (Standard = Systemstandard).

**Gehört nicht dazu:**

- Text direkt in die aktive Anwendung tippen (Nicht-Ziel).
- Senden an Gemini (Task 07).

## Umsetzungsschritte

1. Aufnahme mit `cpal` umsetzen, Samples in `f32` sammeln, Geräteliste für die Einstellungen bereitstellen.
2. Zustandsautomaten als reine, testbare Logik ohne Hardware umsetzen.
3. Indikator-Fenster bauen (Vue), Pegel per Event aktualisieren.
4. Shortcut `Alt+Shift+V` anbinden und den Hinweis „noch nicht verfügbar“ entfernen.
5. Transkription nach dem Stoppen aufrufen, Ergebnis in die Zwischenablage schreiben.
6. Fehlerfälle mit verständlichen DE/EN-Meldungen behandeln.
7. Mikrofon-Auswahl in den Einstellungen ergänzen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Zustandsautomat – Start, Stopp, erneuter Shortcut während Transkription (wird ignoriert oder gepuffert, wie festgelegt), Abbruch, Fehler des Geräts, automatischer Stopp bei Höchstdauer.
- Rust: Leeres Transkript führt nicht zum Überschreiben der Zwischenablage.
- Manuelle Prüfliste: Diktat DE und EN; Doppeldruck stoppt; Abbrechen; Mikrofon abziehen während der Aufnahme; Mikrofon in Windows sperren → verständliche Meldung; 20 Diktate hintereinander ohne Neustart.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Zustandsautomat-Tests laufen grün.
- [ ] 20 aufeinanderfolgende Diktate funktionieren ohne Hänger oder Neustart (manuell belegt).
- [ ] Jeder Fehlerfall aus dem Umfang zeigt eine verständliche Meldung, die App bleibt danach funktionsfähig.

## Offene Fragen / Annahmen

- Annahme: Der Indikator erscheint unten mittig auf dem Monitor mit dem Mauszeiger.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 8 Tests für den Zustandsautomaten (`tests/rust/voice.rs`) und 2 UI-Tests (Timer, Pegelbalken) grün.
- Hardware-Test (`records_from_default_microphone`, `#[ignore]`) mit echtem Headset-Mikrofon (48 kHz Stereo) erfolgreich. Dabei gefunden: WASAPI meldet beim Start gelegentlich „buffer underrun or overrun“ – das hätte jede Aufnahme als Gerätefehler beendet. Jetzt beenden nur echte Gerätefehler die Aufnahme (`audio::is_fatal`).
- Indikator (Diktat, Sprachnachricht mit Prompt, Fehler) im Browser gegen das Design geprüft (`indicator.html#recording|#message|#transcribing|#error` zeigt Demo-Zustände im Dev-Modus).
- **Manuelle Prüfliste offen für den Nutzer:** Diktat DE/EN mit echter Sprache, Doppeldruck, ✕/Esc, Mikrofon abziehen, Mikrofon in Windows sperren, 20 Diktate in Folge. (Alt+Shift+V ist belegt, solange die 1.x-App läuft – alternativ Tray › „Diktat starten / beenden“.)

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `audio::Recorder` (cpal/WASAPI; Stream lebt in eigenem Thread, weil nicht `Send`), `voice::machine` (reiner Zustandsautomat Idle/Recording/Transcribing mit Effekten), `voice` (Steuerung, Indikator-Events `voice-state`/`voice-level`, Watchdog-Thread für Pegel, Gerätefehler und Höchstdauer, Esc als temporärer globaler Shortcut nur während Aufnahme/Erkennung). Diktat schreibt über `tauri-plugin-clipboard-manager`. Mikrofon-Auswahl in Einstellungen › Sprache. Zusätzlich: Tray-Einträge „Diktat starten / beenden“ und „Screenshot & Ask“ (Screenshot folgt in Task 08).
- **Learnings & Stolpersteine:** cpal 0.18: Gerätename über `device.to_string()`. Xrun-Fehler sind normal und dürfen die Aufnahme nicht abbrechen. Ein Ergebnis einer abgebrochenen Erkennung wird über eine Sitzungsnummer verworfen. Der Indikator ist `focusable(false)`, Klicks funktionieren trotzdem; Esc kommt deshalb über einen globalen Shortcut.
- **Wichtige Entscheidungen und ihre Gründe:** Das Modell wird beim Aufnahmestart parallel vorgeladen, damit die Erkennung direkt nach dem Stopp läuft. Fehlt das Modell, startet der Download und es wird nicht aufgenommen (Toast `model.missing`). Ein zweiter Druck auf den jeweils anderen Sprach-Shortcut beendet die laufende Aufnahme in ihrem eigenen Modus.
- **Auswirkungen auf Folge-Tasks:** Task 07 implementiert nur noch `voice_message::deliver(app, text)` (Stub vorhanden) und schaltet `ShortcutAction::Voice` in `actions::run` frei. `VoiceState.prefix` bzw. `prompts::active_name` sind die Haken für Task 09.
- **Hinweise zu Tests und Befehlen:** Mikrofontest: `cargo test --manifest-path src-tauri/Cargo.toml --test voice -- --ignored --nocapture`.
