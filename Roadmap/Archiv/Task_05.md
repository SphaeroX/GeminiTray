# Task_05: Lokale Spracherkennung (Parakeet)

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_05.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Ein Rust-Modul wandelt Audio lokal und offline in Text um (Deutsch und Englisch, automatisch erkannt), mit Parakeet TDT 0.6B v3. Das Modell wird beim ersten Gebrauch mit Fortschrittsanzeige heruntergeladen und geprüft. Dies ist das zweite große technische Risiko und liegt deshalb vor den Sprachfunktionen.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 archiviert (Task_03 ist hilfreich für die Fortschrittsanzeige, aber nicht zwingend).
- **Relevantes Vorwissen:** Entscheidung aus dem Interview: lokal, Parakeet, DE/EN automatisch, kein Cloud-STT. Kandidaten für die Laufzeit: `sherpa-onnx` (Rust-Bindings, unterstützt Parakeet-TDT-ONNX) oder `ort` (ONNX Runtime) mit eigener Vor-/Nachverarbeitung. **Design:** Artboard „Einstellungen – Sprache“ (Download-Fortschritt des Modells) im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Auswahl und Einbindung der Inferenz-Laufzeit (Spike: beide Kandidaten kurz prüfen, Entscheidung mit Begründung dokumentieren).
- Modul `stt` mit Funktion `transcribe(samples: &[f32], sample_rate) -> Result<String>`; Resampling auf 16 kHz mono intern.
- Modell-Verwaltung: Speicherort im App-Datenordner, Download beim ersten Gebrauch mit Fortschritt (Event an die UI), SHA-256-Prüfung, Wiederaufnahme bzw. sauberer Neustart bei Abbruch.
- Modell beim ersten Gebrauch laden und danach im Speicher halten; optional nach längerer Inaktivität entladen.
- Kleine Anzeige des Download-Fortschritts (Toast oder Abschnitt in den Einstellungen).

**Gehört nicht dazu:**

- Mikrofonaufnahme und Shortcuts (Task 06).
- Streaming-Transkription während der Aufnahme; transkribiert wird nach dem Stoppen.
- Weitere Engines (Whisper, Cloud).

## Umsetzungsschritte

1. Kandidaten `sherpa-onnx` und `ort` mit einer kurzen deutschen und englischen Test-WAV vergleichen (Genauigkeit, Latenz, Größe der Windows-Binärdateien, Build-Aufwand); Entscheidung in den Notizen und in `Roadmap/README.md` festhalten.
2. Download-Quelle und Prüfsummen der Modell-Dateien festlegen und als Konstanten hinterlegen.
3. Modell-Verwaltung (Pfad, Download mit Fortschritt, Prüfsumme, Abbruchbehandlung) umsetzen.
4. `transcribe` inklusive Resampling implementieren.
5. Fortschritts-Event an die UI anbinden und anzeigen.
6. Latenz für 10 s Audio auf der Entwicklungsmaschine messen und dokumentieren.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust (`tests/rust/stt.rs`): Kurze Test-WAVs (DE und EN, je wenige Sekunden, unter `tests/rust/fixtures/`) werden korrekt transkribiert (Prüfung auf Schlüsselwörter statt exakter Gleichheit). Diese Tests laufen nur, wenn das Modell vorhanden ist, und werden sonst mit klarer Meldung übersprungen (`#[ignore]` + eigener Befehl dokumentieren).
- Rust: Resampling (48 kHz Stereo → 16 kHz Mono) liefert die erwartete Länge und Amplitude.
- Rust: Prüfsummen-Fehler führt zu Löschen der Datei und typisiertem Fehler; Download-Logik mit simuliertem HTTP-Server bzw. injizierbarem Downloader.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Deutsche und englische Test-WAV werden korrekt erkannt (Test grün mit vorhandenem Modell).
- [ ] Resampling- und Download-Tests laufen grün ohne Modell und ohne Netz.
- [ ] Transkription von 10 s Audio dauert auf der Entwicklungsmaschine höchstens 2 s (gemessen, in den Notizen festgehalten); wird das verfehlt, Rücksprache mit dem Nutzer.
- [ ] Laufzeit-Entscheidung ist in `Roadmap/README.md` dokumentiert.

## Offene Fragen / Annahmen

- Offen: `sherpa-onnx` oder `ort` – Entscheidung im Spike.
- Annahme: Das Modell wird nicht in den Installer gepackt, sondern beim ersten Gebrauch geladen (Installer bleibt klein).
- Offen: Größe des Modells in der gewählten Quantisierung (int8 bevorzugt).

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- Spike: `parakeet-rs` 0.4.4 (ONNX Runtime, unterstützt Parakeet TDT v3 und int8-Dateien direkt) gegenüber `sherpa-onnx` geprüft → `parakeet-rs` gewählt (einfachere API, statisch gelinkte ONNX Runtime, kein eigenes Pre-/Postprocessing). `sherpa-onnx` wurde nicht weiter gebaut.
- Modell: int8-Export von `istupakov/parakeet-tdt-0.6b-v3-onnx` (Revision `8f23f0c0`, CC-BY-4.0): `encoder-model.int8.onnx` (652 MB), `decoder_joint-model.int8.onnx` (18 MB), `vocab.txt` – zusammen ≈ 670 MB. SHA-256 aller drei Dateien gepinnt.
- Messung (Release, Entwicklungsrechner, CPU): 10 s Audio in **0,45 s** transkribiert; Laden des Modells < 2 s. Test-WAVs (Windows-TTS, 48 kHz Stereo) DE und EN wurden wortgenau erkannt.
- 11 Rust-Tests in `tests/rust/stt.rs` grün (3 davon `#[ignore]`, brauchen das Modell). Einstellungsseite „Sprache“ mit Modellkarte im Browser geprüft.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `stt::{Engine, model, resample, service}`. `Engine::transcribe(samples, rate, channels)` resampelt selbst auf 16 kHz Mono (Mittelwert-Tiefpass + linear) und lädt das Modell beim ersten Aufruf (`preload()` kann vorab laden). Stille/zu kurz (< 0,3 s, RMS < 0,002) → leerer Text. Download mit Fortschritts-Event `model-progress`, Abbrechen, `.part`-Dateien, Prüfsummen; Befehle `model_status`, `model_download`, `model_cancel`. Einstellungsseite „Sprache“ (Modellkarte, automatisch senden, max. Dauer) bereits angelegt; Mikrofonauswahl folgt in Task 06 (Slot `microphone` vorbereitet).
- **Learnings & Stolpersteine:** Die vorkompilierte ONNX Runtime (pyke) linkt unter Windows immer `DirectML.dll` und `MSVCP140.dll`. Lösung: `/DELAYLOAD:DirectML.dll` + `delayimp` in `build.rs` (getestet: Erkennung läuft ohne DirectML.dll), und die VC++-Laufzeit (msvcp140, msvcp140_1, vcruntime140, vcruntime140_1) wird per `scripts/collect-runtime.mjs` aus dem VS-Redist-Ordner nach `src-tauri/runtime/` kopiert und über `bundle.resources` neben die exe gelegt. Debug-Builds sind für die Erkennung deutlich langsamer – Messungen immer mit `--release`.
- **Wichtige Entscheidungen und ihre Gründe:** int8 statt fp32 (670 MB statt 2,5 GB, Qualität für Diktat ausreichend). Modell wird nicht mitgeliefert, sondern bei Bedarf nach `%LOCALAPPDATA%\com.sphaerox.geminitray\models\parakeet-tdt-0.6b-v3-int8\` geladen.
- **Auswirkungen auf Folge-Tasks:** Task 06/07: vor der Aufnahme `engine.preload()` in einem Thread starten; fehlt das Modell → `service::start_download` + Toast `model.missing`. `Engine` ist `Arc` in `SttState` (`app.state::<SttState>().engine`).
- **Hinweise zu Tests und Befehlen:** Modelltests: `cargo test --manifest-path src-tauri/Cargo.toml --release --test stt -- --include-ignored --nocapture`.
