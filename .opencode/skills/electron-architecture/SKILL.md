---
name: electron-architecture
description: Best Practices für modulare Electron-Architektur mit Manager-Pattern, IPC-Kommunikation und sauberer Trennung von Concerns
license: MIT
compatibility: opencode
metadata:
  category: architecture
  scope: electron-main
---

## Electron Architecture Best Practices

### Manager-Pattern

Das Gemini Tray Projekt verwendet ein Manager-Pattern für saubere Trennung:

```
electron/
├── main.ts              # Entry Point, Initialisierung
├── managers/
│   ├── window-manager.ts    # BrowserWindow & BrowserView
│   ├── tray-manager.ts      # System Tray
│   ├── shortcut-manager.ts  # Globale Shortcuts
│   └── ipc-manager.ts       # IPC Handler
├── services/
│   └── debug-service.ts     # Debugging Utilities
└── utils/
    ├── constants.ts         # Globale Konstanten
    └── store.ts            # electron-store Config
```

### WindowManager Best Practices

```typescript
export class WindowManager {
    public win: BrowserWindow | null = null
    public view: BrowserView | null = null
    private __dirname: string
    public isQuitting = false

    constructor(dirname: string) {
        this.__dirname = dirname
    }

    createWindow() {
        // Frameless Window mit Custom Title Bar
        this.win = new BrowserWindow({
            width: 500,
            height: 650,
            frame: false,  // Wichtig für Custom Title Bar
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#00000000',
                symbolColor: '#ffffff',
                height: 40
            },
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(this.__dirname, 'preload.mjs'),
                partition: 'persist:gemini'  // Persistente Session
            },
        })

        // Hide statt Close (Tray-Verhalten)
        this.win.on('close', (event) => {
            if (!this.isQuitting) {
                event.preventDefault()
                this.win?.hide()
                return false
            }
        })
    }
}
```

### BrowserView Integration

```typescript
createBrowserView() {
    if (!this.win) return

    const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...`;

    this.view = new BrowserView({
        webPreferences: {
            partition: 'persist:gemini',
            devTools: IS_DEV,
            userAgent: userAgent
        }
    })

    // Automation Detection entfernen
    this.view.webContents.on('did-start-loading', () => {
        this.view?.webContents.executeJavaScript(`
            const newProto = navigator.__proto__;
            delete newProto.webdriver;
            navigator.__proto__ = newProto;
        `);
    });

    // Prompt Injection bei Load
    this.view.webContents.on('did-finish-load', () => {
        this.view?.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT);
    });

    this.win.setBrowserView(this.view)
    this.view.webContents.loadURL('https://gemini.google.com/app')
}
```

### Lifecycle Management

```typescript
// main.ts
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', () => {
    windowManager.setQuitting(true)
})

app.on('will-quit', () => {
    shortcutManager.unregisterAll()
})
```

### Neue Manager erstellen

Wenn du einen neuen Manager hinzufügst:

1. **Klasse erstellen** in `managers/neuer-manager.ts`
2. **Konstruktor** mit WindowManager als Dependency
3. **Initialisierung** in `main.ts` nach `whenReady`
4. **IPC Integration** in `ipc-manager.ts` falls nötig

```typescript
// Beispiel: NotificationManager
export class NotificationManager {
    constructor(private windowManager: WindowManager) {}

    showNotification(title: string, body: string) {
        // Implementation
    }
}
```

### Anti-Patterns vermeiden

❌ **Nicht**:
- Monolithische main.ts
- Globale Variablen für State
- Direkter Node-Zugriff aus Renderer
- Hardcoded Pfade ohne `path.join()`

✅ **Stattdessen**:
- Modulare Manager-Klassen
- Dependency Injection via Konstruktor
- IPC über Preload-Script
- Cross-Platform Pfade mit `path` Modul
