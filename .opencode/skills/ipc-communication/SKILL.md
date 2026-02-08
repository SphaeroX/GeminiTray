---
name: ipc-communication
description: Sichere IPC-Kommunikation zwischen Electron Main und Renderer mit Preload-Script Pattern
license: MIT
compatibility: opencode
metadata:
  category: communication
  scope: electron-main-renderer
---

## IPC Kommunikation in Gemini Tray

### Architektur

```
Main Process                    Renderer (Vue)
     ↓                              ↑
ipc-manager.ts ←——IPC——→ preload.ts → window.electronAPI
```

### Preload-Script (Sicherheit)

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    // Settings
    toggleSettings: (isOpen: boolean) => 
        ipcRenderer.send('toggle-settings', isOpen),
    getSettings: () => 
        ipcRenderer.invoke('get-settings'),
    
    // Shortcuts
    setGlobalShortcut: (shortcut: string) => 
        ipcRenderer.invoke('set-global-shortcut', shortcut),
    setScreenshotShortcut: (shortcut: string) => 
        ipcRenderer.invoke('set-screenshot-shortcut', shortcut),
    
    // Prompts
    savePrompts: (prompts: any[]) => 
        ipcRenderer.send('save-prompts', prompts),
    setActivePrompt: (prompt: any) => 
        ipcRenderer.send('set-active-prompt', prompt),
    
    // Updates
    checkForUpdates: () => 
        ipcRenderer.invoke('check-for-updates'),
    onUpdateAvailable: (callback: (info: any) => void) => 
        ipcRenderer.on('update-available', (_event, info) => callback(info)),
    onUpdateDownloaded: (callback: (info: any) => void) => 
        ipcRenderer.on('update-downloaded', (_event, info) => callback(info)),
    
    // Session
    resetSession: () => 
        ipcRenderer.invoke('reset-session'),
})
```

### IPC Handler (Main Process)

```typescript
// electron/managers/ipc-manager.ts
import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export function registerIpcHandlers(
    windowManager: WindowManager, 
    shortcutManager: ShortcutManager
) {
    // Send/Receive Pattern (one-way)
    ipcMain.on('toggle-settings', (_event: IpcMainEvent, isOpen: boolean) => {
        if (!windowManager.win || !windowManager.view) return
        
        if (isOpen) {
            windowManager.win.setBrowserView(null)
        } else {
            windowManager.win.setBrowserView(windowManager.view)
            windowManager.updateViewBounds()
        }
    })
    
    // Invoke/Handle Pattern (request/response)
    ipcMain.handle('get-settings', (_event: IpcMainInvokeEvent) => {
        return {
            opacity: store.get('opacity'),
            globalShortcut: store.get('globalShortcut'),
            // ...
        }
    })
    
    // Main → Renderer (Events)
    autoUpdater.on('update-available', (info: unknown) => {
        windowManager.win?.webContents.send('update-available', info)
    })
}
```

### Frontend Verwendung

```vue
<!-- SettingsView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const settings = ref({})
const updateAvailable = ref(false)

onMounted(async () => {
    // Invoke/Handle
    settings.value = await window.electronAPI.getSettings()
    
    // Event Listener
    window.electronAPI.onUpdateAvailable((info) => {
        updateAvailable.value = true
        console.log('Update available:', info)
    })
})

const saveSettings = () => {
    // Send (one-way)
    window.electronAPI.savePrompts(prompts.value)
}

const checkUpdates = async () => {
    // Invoke mit Rückgabewert
    const result = await window.electronAPI.checkForUpdates()
    console.log('Update check result:', result)
}
</script>
```

### TypeScript Typisierung

```typescript
// src/vite-env.d.ts
export interface IElectronAPI {
    toggleSettings: (isOpen: boolean) => void
    getSettings: () => Promise<Settings>
    setGlobalShortcut: (shortcut: string) => Promise<boolean>
    savePrompts: (prompts: any[]) => void
    checkForUpdates: () => Promise<any>
    onUpdateAvailable: (callback: (info: any) => void) => void
    resetSession: () => Promise<boolean>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
```

### Neue IPC-Kommunikation hinzufügen

**Szenario: Neue Einstellung hinzufügen**

1. **Preload erweitern**:
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
    // ... bestehende
    setNotificationSound: (enabled: boolean) => 
        ipcRenderer.send('set-notification-sound', enabled),
})
```

2. **Interface aktualisieren**:
```typescript
// vite-env.d.ts
export interface IElectronAPI {
    // ... bestehende
    setNotificationSound: (enabled: boolean) => void
}
```

3. **Handler registrieren**:
```typescript
// ipc-manager.ts
ipcMain.on('set-notification-sound', (_event, enabled: boolean) => {
    store.set('notificationSound', enabled)
})
```

4. **Frontend verwenden**:
```vue
<script setup>
const toggleSound = () => {
    window.electronAPI.setNotificationSound(soundEnabled.value)
}
</script>
```

### Security Best Practices

✅ **Richtig**:
- Nur notwendige APIs im Preload expose
- Parameter validieren im Main Process
- Keine sensitiven Daten über IPC senden
- Channel-Namen als Konstanten definieren

❌ **Falsch**:
```typescript
// NIEMALS direkten IPC-Zugriff erlauben!
contextBridge.exposeInMainWorld('ipc', ipcRenderer)

// Im Renderer (SICHERHEITSLÜCKE!):
window.ipc.send('any-channel', userInput)  // Code Injection!
```

### Async Patterns

```typescript
// Serialisierbare Daten zurückgeben
ipcMain.handle('complex-operation', async () => {
    try {
        const result = await doSomethingAsync()
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: error.message }
    }
})

// Frontend
const result = await window.electronAPI.complexOperation()
if (result.success) {
    console.log(result.data)
} else {
    console.error(result.error)
}
```
