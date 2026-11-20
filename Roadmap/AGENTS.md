# Roadmap-Regelwerk für KI-Agenten – Gemini Tray 2.0

Diese Datei legt fest, wie Tasks dieses Projekts abgearbeitet werden. Lies sie vollständig, bevor du an einem Task arbeitest, und halte dich strikt daran. Die Regeln sind bewusst starr: Mehrere Agenten arbeiten nacheinander am selben Projekt, und nur ein einheitlicher Ablauf stellt sicher, dass jeder den Stand des Vorgängers findet.

## 1. Ordner-Logik

| Ort | Inhalt |
|---|---|
| `Roadmap/Tasks/` | Offene und aktuell laufende Tasks (`Task_01.md`, `Task_02.md`, ...). |
| `Roadmap/Archiv/` | Vollständig erledigte Tasks. |
| `tests/` (Hauptverzeichnis des Projekts, **nicht** in `Roadmap/`) | Die permanente Testing-Suite des Projekts. |
| `Roadmap/README.md` | Projekt- und taskübergreifendes Gedächtnis: Ziel, Status, globale Entwicklungsinfos, Auffälligkeiten. |

## 2. Strikte Reihenfolge

Die Tasks in `Roadmap/Tasks/` werden streng numerisch nacheinander abgearbeitet: erst `Task_01`, dann `Task_02`, dann `Task_03` und so weiter. Es wird nie ein Task übersprungen, vorgezogen oder parallel begonnen. Der nächste Task ist immer der mit der kleinsten Nummer, der noch in `Roadmap/Tasks/` liegt.

Liegt dort eine Datei mit dem Präfix `RUN_`, ist das der laufende Task: Mache dort weiter, statt einen neuen zu beginnen. Es darf nie mehr als eine `RUN_`-Datei geben.

## 3. Start-Prozedur (`RUN`-Kürzel)

Wenn du einen Task beginnst, ist die **allererste Aktion** das Umbenennen der Task-Datei: Setze `RUN_` vor den Dateinamen.

```
Task_01.md  →  RUN_Task_01.md
```

Das passiert vor allem anderen: bevor du Code schreibst, planst oder recherchierst. So ist auf einen Blick erkennbar, welcher Task gerade läuft. Verwende `git mv`, wenn das Projekt ein Git-Repository ist.

Danach, in dieser Reihenfolge:

1. `Roadmap/README.md` lesen.
2. Den laufenden Task vollständig lesen.
3. Die Abschnitte "Erkenntnisse für Folge-Agenten" der Vorgänger-Tasks in `Roadmap/Archiv/` lesen, mindestens die der Tasks, von denen dieser Task abhängt.

## 4. Informations-Trennung

- **Taskspezifische** Informationen (Entscheidungen, Stolpersteine, Notizen zu diesem Task) gehören in die jeweilige Task-Datei.
- **Projekt- und taskübergreifende** Informationen (Architekturentscheidungen, globales Wissen, Besonderheiten, die mehrere Tasks betreffen) gehören in `Roadmap/README.md`.

Im Zweifel: Würde ein Agent bei einem *anderen* Task davon profitieren? Dann in die README.

## 5. Testing-Pflicht

Ist ein Task fertig programmiert, muss alles zwingend durch Testing bestätigt werden. Die dafür erstellten Tests liegen **permanent** im Hauptverzeichnis unter `tests/` und bauen dort eine dauerhafte Testing-Suite auf. Sie werden nie in `Roadmap/` abgelegt und beim Archivieren eines Tasks nie gelöscht.

Testing-Suite: **Vitest** (Vue/TypeScript, Tests unter `tests/ui/`) und **`cargo test`** (Rust, Integrationstests unter `tests/rust/`, je Datei per `[[test]] path = "../tests/rust/<name>.rs"` in `src-tauri/Cargo.toml` eingebunden). Task_01 richtet beides ein und trägt die exakten Befehle in `Roadmap/README.md` ein. Vorgesehen sind:

- Alle Tests: `npm test` (führt Vitest und `cargo test --manifest-path src-tauri/Cargo.toml` aus)
- Nur UI: `npx vitest run tests/ui`, einzelner Test: `npx vitest run tests/ui/<datei>`
- Nur Rust: `cargo test --manifest-path src-tauri/Cargo.toml`, einzelner Test: `cargo test --manifest-path src-tauri/Cargo.toml --test <name>`

Verhalten, das nur mit der echten Gemini-Seite oder echter Hardware (Mikrofon, Bildschirm) prüfbar ist, wird zusätzlich über die manuelle Prüfliste des jeweiligen Tasks bestätigt; das Ergebnis wird in den Notizen des Tasks festgehalten. Die manuelle Prüfung ersetzt keine automatisierbaren Tests.

Schlägt das Testing fehl, wird der Task nicht archiviert: Er bleibt als `RUN_Task_NN.md` in `Roadmap/Tasks/`, bis die Tests bestehen. Bestehende Tests werden nicht abgeschwächt oder gelöscht, um Grün zu erreichen; der Fehler liegt in der Implementierung.

## 6. Abschluss- und Archivierungs-Workflow

War das Testing erfolgreich, passieren vor dem Verschieben ins Archiv noch genau drei Dinge, in dieser Reihenfolge:

1. **Erkenntnisse dokumentieren.** Schreibe wichtige Erkenntnisse, Learnings und Details unten in die aktuelle Task-Datei, in den Abschnitt "Erkenntnisse für Folge-Agenten". Nachfolgende Agenten profitieren davon bei späteren Tasks.
2. **Folge-Tasks prüfen und anpassen.** Wenn vorne etwas fertig wird, ändert sich hinten oft etwas. Prüfe, ob sich für die darauffolgenden Tasks (`Task_02`, `Task_03` usw.) etwas geändert hat, und passe sie bei Bedarf an. Aktualisiere ebenso die `Roadmap/README.md`: den aktuellen Status und alle neuen taskübergreifenden Erkenntnisse.
3. **Ins Archiv verschieben.** Erst wenn Testing, Erkenntnis-Dokumentation und die Anpassung der Folge-Tasks erledigt sind, wird der Task **ohne** das `RUN_`-Präfix nach `Roadmap/Archiv/` verschoben:

   ```
   Roadmap/Tasks/RUN_Task_01.md  →  Roadmap/Archiv/Task_01.md
   ```

Danach kann der nächste Task begonnen werden (Abschnitt 3). Liegt in `Roadmap/Tasks/` kein Task mehr, ist die Roadmap abgeschlossen: Setze den Status in der `Roadmap/README.md` entsprechend und melde das dem Nutzer.

## 7. Zusammenspiel mit dem restlichen Projekt

Die Root-`AGENTS.md` beschreibt noch die Electron-App 1.x. Ihre Workflow-Regeln (Versionssprung um 0.001 pro Änderung, `npm run build`, `npm run release` nach jedem Commit) gelten für Roadmap-Tasks **nicht**: Gearbeitet wird auf dem Branch `rework/tauri`, ohne Releases, bis Task 11 die Root-`AGENTS.md` für den neuen Stack neu schreibt. Commits weiterhin als Conventional Commits auf Englisch. Bei jedem anderen Widerspruch zwischen der Root-`AGENTS.md` und diesem Regelwerk: anhalten und beim Nutzer nachfragen.
