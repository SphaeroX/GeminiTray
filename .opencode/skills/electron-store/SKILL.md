---
name: electron-store
description: Persistenz mit electron-store für Settings, Prompts und App-State in Gemini Tray
license: MIT
compatibility: opencode
metadata:
  category: storage
  scope: electron-main
---

## Electron Store für Gemini Tray

### Store Konfiguration

```typescript
// electron/utils/store.ts
import Store from 'electron-store'

interface StoreSchema {
    opacity: number
    globalShortcut: string
    screenshotShortcut: string
    newChatShortcut: string
    promptMenuShortcut: string
    openAtLogin: boolean
    openAsHidden: boolean
    alwaysOnTop: boolean
    prompts: Array<{ id: string; name: string; content: string }>
}

const store = new Store<StoreSchema>({
    defaults: {
        opacity: 1.0,
        globalShortcut: 'CommandOrControl+Shift+G',
        screenshotShortcut: 'CommandOrControl+Shift+S',
        newChatShortcut: 'CommandOrControl+Shift+N',
        promptMenuShortcut: 'CommandOrControl+Shift+P',
        openAtLogin: false,
        openAsHidden: false,
        alwaysOnTop: true,
        prompts: []
    }
})

export { store }
```

### Settings Lesen

```typescript
// Im IPC Handler
ipcMain.handle('get-settings', () => {
    return {
        opacity: store.get('opacity'),
        globalShortcut: store.get('globalShortcut'),
        screenshotShortcut: store.get('screenshotShortcut'),
        // ... weitere Settings
    }
})
```

### Settings Schreiben

```typescript
// Einzelne Werte
ipcMain.on('set-opacity', (_event, opacity: number) => {
    if (windowManager.win) {
        windowManager.win.setOpacity(opacity)
        store.set('opacity', opacity)
    }
})

// Objekte
ipcMain.on('set-autostart', (_event, settings) => {
    store.set('openAtLogin', settings.openAtLogin)
    store.set('openAsHidden', settings.openAsHidden)
    
    app.setLoginItemSettings({
        openAtLogin: settings.openAtLogin,
        openAsHidden: settings.openAsHidden
    })
})

// Arrays (Prompts)
ipcMain.on('save-prompts', (_event, prompts) => {
    store.set('prompts', prompts)
})
```

### Schema erweitern

Wenn du ein neues Setting hinzufügst:

1. **Interface erweitern**:
```typescript
interface StoreSchema {
    // ... bestehende Felder
    notificationSound: boolean  // NEU
}
```

2. **Default Wert setzen**:
```typescript
const store = new Store<StoreSchema>({
    defaults: {
        // ... bestehende Defaults
        notificationSound: true  // NEU
    }
})
```

3. **IPC Handler hinzufügen**:
```typescript
ipcMain.handle('get-settings', () => {
    return {
        // ... bestehende Settings
        notificationSound: store.get('notificationSound')
    }
})

ipcMain.on('set-notification-sound', (_event, enabled: boolean) => {
    store.set('notificationSound', enabled)
})
```

4. **Frontend integrieren**:
```vue
<!-- SettingsView.vue -->
<template>
  <div>
    <label>{{ t('app.notification_sound') }}</label>
    <input 
      type="checkbox" 
      v-model="settings.notificationSound"
      @change="updateNotificationSound"
    />
  </div>
</template>

<script setup>
const updateNotificationSound = () => {
    window.electronAPI.setNotificationSound(settings.value.notificationSound)
}
</script>
```

5. **Preload erweitern**:
```typescript
// preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
    // ... bestehende APIs
    setNotificationSound: (enabled: boolean) => 
        ipcRenderer.send('set-notification-sound', enabled)
})
```

6. **i18n Key hinzufügen**:
```json
// src/locales/en.json
{
    "app": {
        "notification_sound": "Notification sound",
        "notification_sound_desc": "Play sound on new responses"
    }
}
```

### Store Reset

```typescript
ipcMain.handle('reset-store', () => {
    store.clear()  // Alle Daten löschen
    // Oder einzelne Keys:
    store.delete('prompts')
})
```

### Best Practices

- **Immer Defaults setzen** für neue Keys
- **TypeScript Interface** für Type-Safety
- **Nur im Main Process** verwenden (nicht Renderer)
- **IPC** für Kommunikation mit Frontend
- **Migrationen** planen wenn Schema sich ändert
