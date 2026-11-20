# Task_06: Diktat in die Zwischenablage

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_06.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Mit `Alt+Shift+V` startet und stoppt der Nutzer eine Aufnahme von überall aus; der lokal erkannte Text landet in der Zwischenablage. Das ist der erste nutzbare Sprach-Durchstich und baut die native Aufnahme, die Task 07 wiederverwendet.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_03 und Task_05 archiviert.
- **Relevantes Vorwissen:** Die alte App klickte dafür den Mikrofon-Button der Webseite und war dadurch instabil. Jetzt: Mikrofon nativ (z. B. `cpal`), Transkription über das `stt`-Modul aus Task 05.

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
