# Gemini Tray

## Projektübersicht
 **Gemini Tray** ist eine Desktop-Anwendung, die die Fähigkeiten von Google Gemini nahtlos in den Workflow auf dem PC (Windows & Linux) integriert. Die Anwendung läuft primär im Hintergrund (System Tray) und ist durch globale Tastenkürzel sofort verfügbar.

## Ziele
Die aktuelle Nutzung von Gemini beschränkt sich oft auf den Browser oder mobile Apps. Gemini Tray soll diese Lücke auf dem Desktop schließen, indem es einen schnellen und kontextbezogenen Zugriff ermöglicht, ähnlich wie Spotlight auf macOS oder spezialisierte AI-Tools.

## Kernfunktionen

### 1. Hintergrund-Anwendung (System Tray)
- Die App startet minimiert in den System Tray.
- Sie verbraucht wenig Ressourcen, wenn sie nicht aktiv genutzt wird.

### 2. Globale Shortcuts
- **Chat Öffnen**: Ein Shortcut öffnet sofort das Chat-Fenster für schnelle Fragen.
- **Screenshot & Ask**: Ein separater Shortcut (ähnlich Snipping Tool) erlaubt es, einen Bereich des Bildschirms auszuwählen oder den ganzen Bildschirm aufzunehmen. Das Bild wird automatisch in den Chat-Kontext geladen, und der Fokus liegt direkt im Eingabefeld, um eine Frage dazu zu stellen (z.B. "Erkläre diesen Code-Schnipsel" oder "Was bedeutet diese Fehlermeldung?").

### 3. Gemini Web-Integration
- **Keine API-Bindung**: Die Anwendung lädt direkt die Gemini-Webseite (`gemini.google.com`), um vollen Zugriff auf alle Features (auch für Advanced-Abo Nutzer) zu gewährleisten.
- **Login**: Der Benutzer loggt sich direkt im Anwendungsfenster in seinen Google-Account ein.
- **Session-Management**: Cookies und Sessions bleiben erhalten, sodass kein ständiges Einloggen nötig ist.

### 4. Model Context Protocol (MCP) Support
- Die Anwendung soll als Client für MCP-Server fungieren können.
- Dies ermöglicht die Verbindung mit lokalen Tools und Datenquellen über standardisierte Protokolle.

### 4. Fenster-Management
- **Always on Top**: Das Chat-Fenster bleibt immer im Vordergrund über allen anderen Fenstern, solange es geöffnet ist.

### 5. Updates & Deployment
- **Auto-Updates**: Benachrichtigung bei neuen Versionen und Download-Möglichkeit direkt über GitHub Releases.
- **CI/CD**: GitHub Actions Workflow zum automatischen Bauen und Veröffentlichen der Anwendung.

## Technologie-Stack
- **Framework**: Electron (Cross-Platform Desktop)
- **Frontend**: Vue.js (Reaktivität und UI)
- **Sprachen**: JavaScript/TypeScript, HTML, CSS (Tailwind oder Vanilla CSS für Premium-Look)
- **Store / Persistence**: electron-store (für lokale Einstellungen)
- **Update-Mechanismus**: Electron-Updater / GitHub Releases
- **OS Support**: 
    - Windows (Primär)
    - Linux (Sekundär)

## Architektur & Struktur

Die Electron-Anwendung (`electron/`) wurde modular aufgebaut, um Wartbarkeit und Erweiterbarkeit zu gewährleisten. Anstatt einer monolithischen `main.ts` wird der Code in spezialisierte Manager und Services aufgeteilt.

### Ordnerstruktur (`electron/`)

- **`main.ts`**: Der Einstiegspunkt der Anwendung. Initialisiert die Manager und verwaltet den Lebenszyklus der App.
- **`managers/`**: Enthält Klassen für die Verwaltung der Kernkomponenten.
    - **`window-manager.ts`**: Verwaltet das Hauptfenster (`BrowserWindow`) und die `BrowserView` (Gemini Web). Kümmert sich um Sichtbarkeit, Resizing und Screenshots.
    - **`tray-manager.ts`**: Verwaltet das System Tray Icon und das Kontextmenü.
    - **`shortcut-manager.ts`**: Registriert und verwaltet globale Tastenkürzel.
    - **`ipc-manager.ts`**: Zentraler Ort für alle IPC (Inter-Process Communication) Handler. Verbindet Renderer-Events mit Manager-Methoden.
- **`services/`**: Enthält eigenständige Dienste.
    - **`debug-service.ts`**: Funktionen zum Erstellen von Snapshots und Debugging-Logs.
- **`utils/`**: Hilfsfunktionen und Konstanten.
    - **`constants.ts`**: Globale Konstanten wie Pfade, Dev-Modus Flags, etc.
    - **`store.ts`**: Konfiguration und Instanz des `electron-store` zur Datenspeicherung.

### Datenfluss
1.  **Main Process**: `main.ts` startet und instanziiert die Manager (`WindowManager`, `TrayManager`, `ShortcutManager`).
2.  **IPC**: Der Renderer (Vue.js) kommuniziert über definierte Kanäle (in `ipc-manager.ts`) mit dem Main Process, um Aktionen wie "Fenster verbergen" oder "Einstellungen speichern" auszulösen.
3.  **Events**: Manager können Events untereinander austauschen oder direkt Methoden aufrufen (z.B. ruft `TrayManager` Methoden des `WindowManager` auf, um das Fenster zu zeigen).


## Design-Philosophie
- **Modern & Premium**: Glassmorphismus, Dark Mode, flüssige Animationen.
- **Unobtrusive**: Soll nicht im Weg stehen, aber sofort da sein, wenn man es braucht.

## Entwicklungs-Regeln
- **AI-Sprache**: Die AI kommuniziert mit dem Benutzer immer auf Deutsch.
- **Code-Sprache**: Der Code (Variablennamen, Kommentare, Commits) ist immer auf Englisch.
- **Text-Management**:
    - Es darf kein fest codierter Text im Code stehen.
    - Alle UI-Texte werden über das `i18n` System (Sprachvariablen) verwaltet.
    - Die Standardsprache ist Englisch (`en.json`).
    - Zusätzliche Sprachen werden bei Bedarf hinzugefügt, aber die Entwicklung startet immer mit Englisch als Basis.
- **Einstellungen**:
    - Wenn eine neue Funktion konfigurierbare Optionen bietet, müssen diese zwingend in die Einstellungsseite integriert werden.

## Live-Debugging (nur im Dev-Modus)

Im Entwicklungsmodus (`npm run dev`) sind erweiterte Debugging-Funktionen verfügbar:

### Automatische Features
- **DevTools für BrowserView**: Die Chrome DevTools für die Gemini-Webseite öffnen sich automatisch in einem separaten Fenster
- **Debug-Verzeichnis**: Alle Debug-Dateien werden gespeichert in: `%TEMP%/gemini-tray-debug/`
- **Automatische Snapshots**: Bei Screenshot-Operationen werden automatisch HTML- und State-Snapshots gespeichert

### Debug-Dateien
- `{label}-{timestamp}.html` - Vollständiges HTML der Gemini-Seite
- `{label}-{timestamp}-state.json` - Detaillierter Zustand des Input-Felds, Bilder, Chips, Upload-Status

### IPC Debug-Befehle (für Entwickler)
Diese können über die Electron-Konsole oder im Preload-Script verwendet werden:
- `debug-save-snapshot` - Manuell einen Snapshot speichern
- `debug-get-gemini-state` - Aktuellen Zustand der Gemini-Seite abrufen
- `debug-open-devtools` - DevTools für BrowserView öffnen
- `debug-get-dir` - Pfad zum Debug-Verzeichnis abrufen

### Workflow für AI-Agenten
1. User führt `npm run dev` aus
2. App startet mit aktiviertem Debug-Modus
3. Bei Problemen (z.B. Screenshot-Upload) werden automatisch Snapshots erstellt
4. Agent kann die HTML/JSON-Dateien in `%TEMP%/gemini-tray-debug/` analysieren
5. DevTools ermöglichen Live-Inspektion der Gemini-Webseite


## Sonstiges
Wenn du etwas neues macht erhöhe schrittweise die Version bei Elekctron (nicht vergessen)