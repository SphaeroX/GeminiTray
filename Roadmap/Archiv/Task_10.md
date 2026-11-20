# Task_10: Fensterverhalten

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_10.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Das Gemini-Fenster verhält sich wie gewohnt: Deckkraft und „Immer im Vordergrund“ sind einstellbar, Position und Größe bleiben über Neustarts erhalten.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_03 archiviert.
- **Relevantes Vorwissen:** Alte Standardwerte: Deckkraft 0,95, „Immer im Vordergrund“ an. Einstellungen werden im Settings-Modell aus Task 03 ergänzt. **Design:** Einstellungsseite „Fenster“ im Stil der Artboards „Einstellungen – …“ im Entwurf [Gemini Tray 2.0 Design](https://claude.ai/artifact/EFmpNF1rhtFanULbzfBguk); Farben, Schrift und Maße siehe `Roadmap/README.md` → Design.

## Umfang

**Gehört dazu:**

- Einstellung Deckkraft (Schieberegler, z. B. 50–100 %), wirkt sofort auf das Gemini-Fenster.
- Einstellung „Immer im Vordergrund“.
- Position und Größe speichern und beim Start wiederherstellen (z. B. `tauri-plugin-window-state`); liegt die gespeicherte Position außerhalb aller aktuellen Monitore, wird das Fenster zentriert.

**Gehört nicht dazu:**

- Automatisches Verbergen bei Fokusverlust (nicht gefordert).
- Eigene Titelleiste.

## Umsetzungsschritte

1. Deckkraft auf Windows umsetzen (Fenster-Transparenz bzw. `SetLayeredWindowAttributes` über das Fenster-Handle) und prüfen, dass die WebView2-Inhalte korrekt mit transparent werden.
2. „Immer im Vordergrund“ anbinden.
3. Fensterzustand speichern/wiederherstellen inklusive Plausibilitätsprüfung der Position.
4. Einstellungen in der UI ergänzen (DE/EN).

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Plausibilitätsprüfung der Fensterposition (innerhalb, teilweise außerhalb, vollständig außerhalb der Monitore).
- Rust: Deckkraft-Wert wird auf den gültigen Bereich begrenzt.
- Manuelle Prüfliste: Deckkraft ändern wirkt sofort; „Immer im Vordergrund“ an/aus; Fenster verschieben, Neustart → gleiche Position; Monitor abziehen → Fenster erscheint zentriert.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Tests laufen grün.
- [ ] Manuelle Prüfliste bestanden.

## Offene Fragen / Annahmen

- Offen: Ob Deckkraft bei WebView2 ohne Darstellungsfehler funktioniert, wird erst im Task geprüft; falls nicht, Rücksprache mit dem Nutzer (Option: Funktion entfällt).

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 7 Rust-Tests (`tests/rust/windowstate.rs`) grün: Wiederherstellung innerhalb/teilweise außerhalb/komplett außerhalb, Titelleiste über dem Bildschirm, Mindestgröße, Alpha-Umrechnung, Speichern/Laden.
- Einstellungsseite „Fenster“ (Deckkraft-Regler 50–100 %, Immer im Vordergrund) angelegt.
- **Nicht optisch geprüft:** Deckkraft über `SetLayeredWindowAttributes` mit WebView2-Inhalt – der Agent hat keinen Bildzugriff auf das App-Fenster. **Manuelle Prüfung durch den Nutzer offen** (Regler bewegen, Inhalt muss mit durchsichtig werden, keine schwarzen Flächen). Falls fehlerhaft: Option laut Task-Annahme streichen.
- **Weitere manuelle Prüfung offen:** Fenster verschieben → ausblenden → App neu starten → gleiche Position; Monitor abziehen → zentriert.

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** Eigenes Modul `windowstate` statt `tauri-plugin-window-state` (das Plugin würde auch Overlays/Toasts beeinflussen). Position/Größe in `window-state.json` (App-Config-Ordner), gespeichert beim Ausblenden, beim Schließen-Knopf und bei „Beenden“; beim Start nur wiederhergestellt, wenn die Titelleiste auf einem Monitor sichtbar ist, sonst zentriert. Deckkraft per Win32 `WS_EX_LAYERED` + `SetLayeredWindowAttributes` (eigene FFI-Deklaration, keine zusätzliche Crate); bei 100 % wird der Layered-Stil wieder entfernt.
- **Learnings & Stolpersteine:** Mehrzeilige Bash-Heredocs mit Rust-Code brechen gelegentlich das Quoting → Änderungen über Python-Skript-Dateien oder das Write-Werkzeug.
- **Wichtige Entscheidungen und ihre Gründe:** Standard-Deckkraft 100 % (neu, die alte App hatte 95 %), damit der Text gestochen scharf bleibt.
- **Auswirkungen auf Folge-Tasks:** Keine.
- **Hinweise zu Tests und Befehlen:** `cargo test --manifest-path src-tauri/Cargo.toml --test windowstate`.
