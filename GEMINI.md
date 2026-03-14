# Gemini Tray - Projektübersicht

Gemini Tray ist eine Desktop-Anwendung, die das Google Gemini Webinterface in den System-Tray integriert. Sie ermöglicht den schnellen Zugriff auf Gemini über globale Tastenkombinationen und bietet spezialisierte Funktionen wie "Screenshot & Ask".

## Architektur & Technologien

- **Framework:** Electron mit Vue 3 (Renderer-Prozess)
- **Build-Tool:** Vite
- **Sprache:** TypeScript
- **Styling:** CSS (Scoped in Vue-Komponenten)
- **Zentrale Komponenten:**
    - **Main Process (`electron/`):**
        - `WindowManager`: Verwaltet das Hauptfenster (`BrowserWindow`) und die Gemini-Ansicht (`BrowserView`).
        - `TrayManager`: Erstellt das Tray-Icon und das zugehörige Menü.
        - `ShortcutManager`: Registriert globale Hotkeys (Standard: `Alt+Space` für Sichtbarkeit, `Alt+Shift+S` für Screenshots).
        - `IpcManager`: Kommunikationsbrücke zwischen Renderer und Main Process.
        - `prompt-injection.js`: Skript, das in die Gemini-Webseite injiziert wird, um Prompts voranzustellen und UI-Indikatoren anzuzeigen.
    - **Renderer Process (`src/`):**
        - `App.vue`: Hauptlayout mit Overlay-Management für Einstellungen und Prompts.
        - `SettingsView.vue`: Konfiguration von Shortcuts, Erscheinungsbild und vordefinierten Prompts.
        - `PromptsMenu.vue`: Auswahlmenü für Schnellsuch-Prompts.

## Wichtige Befehle

- **Entwicklung:**
    - `npm run dev`: Startet die Anwendung im Entwicklungsmodus mit Vite.
    - `npm run dev:console`: Startet im Entwicklungsmodus mit automatisch geöffneten DevTools.
- **Build:**
    - `npm run build`: Erstellt die Anwendung für das aktuelle Betriebssystem.
    - `npm run build:win`: Erstellt die Anwendung spezifisch für Windows.
    - `npm run build:linux`: Erstellt die Anwendung spezifisch für Linux.
- **Vorschau:**
    - `npm run preview`: Startet die gebaute Anwendung zur Vorschau.

## Entwicklungskonventionen

- **Struktur:** Logik für den Hauptprozess liegt in `electron/`, die UI-Logik in `src/`.
- **IPC-Kommunikation:** Alle Interaktionen zwischen UI und System (z. B. Einstellungen speichern, Screenshots auslösen) erfolgen über definierte IPC-Handler in `electron/managers/ipc-manager.ts`.
- **Skript-Injektion:** Änderungen am Verhalten der Gemini-Webseite müssen über `electron/prompt-injection.js` oder den `ScriptInjector` implementiert werden.
- **Einstellungen:** Werden über `electron-store` persistiert (siehe `electron/utils/store.ts`).
- **Build & Test:** Nach jeder Code-Änderung muss ein Build durchgeführt werden (`npm run build`), um die Änderungen in der Electron-Umgebung zu validieren.
- **Versionierung:** Bei jeder Änderung muss die Versionsnummer in der `package.json` um `0.001` erhöht werden.

## Besonderheiten

- **Screenshot & Ask:** Nutzt den `desktopCapturer` von Electron, um den Bildschirm zu erfassen. Ein transparentes Fenster (`screenshot-selection.html`) ermöglicht die Auswahl des Bereichs.
- **Automatisierung:** Die Anwendung versucht automatisch, das in den Einstellungen gewählte Gemini-Modell (Fast, Pro, Thinking) per JavaScript-Klick zu aktivieren.
- **Stealth-Modus:** Verschiedene Browser-Flags werden gesetzt, um "AutomationControlled" zu deaktivieren und Google-Logins zu ermöglichen.
