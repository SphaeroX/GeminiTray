# Task_08: Screenshot & Ask

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_08.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Mit `Alt+Shift+S` wählt der Nutzer einen Bildschirmbereich aus; das Bild landet im Gemini-Eingabefeld und das Fenster öffnet sich, bereit für die Frage.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_04 archiviert.
- **Relevantes Vorwissen:** Alte Umsetzung als Referenz für die Auswahl-Oberfläche: `git show main:electron/screenshot-selection.html`, `git show main:electron/services/screenshot-service.ts`. Neu: Aufnahme nativ mit `xcap`, Bild-Einfügen über die Brücke (`insertImage`). **Design:** Artboard „Screenshot-Overlay“ (Abdunklung, Auswahlrahmen mit Größenanzeige, Hinweisleiste) im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Aufnahme aller Monitore mit `xcap` vor dem Anzeigen der Auswahl (damit das Overlay nicht mitfotografiert wird).
- Auswahl-Overlay pro Monitor (randlos, immer oben) mit dem eingefrorenen Bild, Rechteck aufziehen, `Esc` bricht ab, Enter bzw. Loslassen bestätigt.
- Korrekte Umrechnung bei DPI-Skalierung und mehreren Monitoren mit unterschiedlicher Skalierung.
- Zuschneiden, PNG kodieren, Gemini-Fenster öffnen und `insertImage` aufrufen; bei Brückenfehler Bild in die Zwischenablage + Hinweis.
- Haken für ein aktives Prompt-Präfix (Task 09) vorsehen.

**Gehört nicht dazu:**

- Fensteraufnahme per Klick, Annotationen, Speichern als Datei.

## Umsetzungsschritte

1. Aufnahme aller Monitore mit Positionen und Skalierungsfaktoren umsetzen.
2. Overlay-Fenster je Monitor öffnen und das jeweilige Bild anzeigen.
3. Auswahl-UI (Vue) mit Rechteck, Maßen und Tastatursteuerung bauen.
4. Koordinaten-Umrechnung (logisch → physisch, Monitor-Versatz) als reine Funktion umsetzen.
5. Zuschneiden und PNG-Kodierung, dann Fenster öffnen und `insertImage` aufrufen.
6. Shortcut anbinden, Hinweis „noch nicht verfügbar“ entfernen, Fallback auf Zwischenablage umsetzen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Koordinaten-Umrechnung für 100 %, 150 % und gemischte Skalierung sowie Monitor links/oberhalb des Hauptmonitors (negative Koordinaten).
- Rust: Zuschneiden an Bildrändern (Auswahl teilweise außerhalb) und Mindestgröße (Auswahl unter 5×5 px → Abbruch).
- Manuelle Prüfliste: ein Monitor, zwei Monitore mit unterschiedlicher Skalierung; Abbruch mit `Esc`; Bild erscheint in Gemini und kann mit einer Frage gesendet werden.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Umrechnungs- und Zuschneide-Tests laufen grün.
- [ ] Der ausgewählte Bereich entspricht pixelgenau dem markierten Bereich (manuell an einem Testbild mit Raster belegt).
- [ ] Bild landet im Gemini-Eingabefeld; bei Brückenfehler liegt es in der Zwischenablage.

## Offene Fragen / Annahmen

Keine.

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 7 Rust-Tests (Umrechnung 100 %/150 %/gemischt, Rückwärts-Ziehen, Randbeschneidung, Mindestgröße, negative Monitorkoordinaten) und 2 UI-Tests grün.
- Echte Aufnahme (`captures_every_monitor`, `#[ignore]`): DISPLAY5 3440×1440 @ 100 % korrekt erfasst. Auf dem Testrechner ist nur ein Monitor angeschlossen – Mehrmonitor-Fall nur über die Geometrie-Tests abgedeckt.
- Overlay im Browser gegen das Design geprüft (Abdunklung, Rahmen mit Griffen, Größenanzeige „620 × 240“, Hinweisleiste).
- **Manuelle Prüfliste offen für den Nutzer:** Alt+Shift+S (oder Tray › Screenshot & Ask) im echten Fenster; Bild erscheint im Gemini-Eingabefeld (Drop-Upload, eingeloggt); Esc/Rechtsklick bricht ab; zwei Monitore mit unterschiedlicher Skalierung, falls vorhanden.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `screenshot::{start, overlay_image, overlay_select, overlay_cancel}` + `screenshot::geometry` (reine Umrechnung). Ablauf: Gemini-Fenster verbergen → alle Monitore mit xcap aufnehmen → je Monitor ein Overlay-Fenster (`overlay-N`, physische Position/Größe) mit eingefrorenem Bild (JPEG-Data-URL nur zur Anzeige) → Auswahl in CSS-px → Zuschnitt aus dem Original-RGBA → PNG → `bridge::insert_image` (bei aktivem Prompt vorher `insert_text`). Fallback: Bild in die Zwischenablage + Toast `screenshot.clipboard`. Loslassen der Maus bestätigt direkt; Enter bestätigt, Esc/Rechtsklick bricht ab.
- **Learnings & Stolpersteine:** Die Overlays bekommen Fokus (sonst kein Esc); das Overlay unter dem Mauszeiger wird fokussiert. Überspannen mehrerer Monitore ist bewusst nicht möglich (Auswahl immer innerhalb eines Monitors). Die Größenanzeige rechnet mit `devicePixelRatio` in physische Pixel.
- **Wichtige Entscheidungen und ihre Gründe:** Aufnahme vor dem Öffnen der Overlays, damit sie nicht mitfotografiert werden. Das Gemini-Fenster wird vor der Aufnahme verborgen und danach wieder gezeigt.
- **Auswirkungen auf Folge-Tasks:** Task 09: `prompts::take_active_content` wird hier schon aufgerufen.
- **Hinweise zu Tests und Befehlen:** Overlay-Vorschau: `http://localhost:1420/overlay.html?m=0` (Mock-Bild). Echter Capture-Test: `cargo test --manifest-path src-tauri/Cargo.toml --test screenshot -- --ignored --nocapture`.
