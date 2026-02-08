---
name: add_global_shortcut
description: Add a new global keyboard shortcut to the application.
---

# Add Global Shortcut Skill

This skill guides you through the process of adding a new configurable global shortcut.

## Step-by-Step Instructions

### 1. Update Store Schema (`electron/utils/store.ts`)
Add the new shortcut key to the `StoreSchema` interface and the default values.

```typescript
export interface StoreSchema {
  // ... existing keys
  myNewShortcut: string; // Add this
}

export const store = new Store<StoreSchema>({
  // ...
  defaults: {
    // ... existing defaults
    myNewShortcut: 'CommandOrControl+Shift+M', // Add default
  }
});
```

### 2. Update Shortcut Manager (`electron/managers/shortcut-manager.ts`)

#### A. Add Setter Method
Add a method to update the shortcut. This handles unregistering the old one and registering the new one.

```typescript
setMyNewShortcut(shortcut: string): boolean {
    const oldShortcut = store.get('myNewShortcut');
    if (oldShortcut) {
        globalShortcut.unregister(oldShortcut);
    }
    
    // Register new shortcut
    const ret = globalShortcut.register(shortcut, () => {
        // Define action here
        console.log('My New Shortcut triggered');
        // e.g., this.windowManager.doSomething();
    });

    if (!ret) {
        console.warn('Registration failed for:', shortcut);
        // Revert to old if failed
        if (oldShortcut) {
            globalShortcut.register(oldShortcut, () => { /* action */ });
        }
        return false;
    }

    store.set('myNewShortcut', shortcut);
    return true;
}
```

#### B. Register Initial Shortcut
Update `registerGlobalShortcuts()` to register the shortcut on app start.

```typescript
const initialMyNewShortcut = store.get('myNewShortcut');
if (initialMyNewShortcut) {
    globalShortcut.register(initialMyNewShortcut, () => {
        // Define action here (same as above)
    });
}
```

### 3. Add IPC Handler (`electron/managers/ipc-manager.ts`)
Expose the setter to the renderer.

```typescript
ipcMain.handle('set-my-new-shortcut', (_event, shortcut: string) => {
    return shortcutManager.setMyNewShortcut(shortcut);
})
```

Also ensure `get-settings` handler returns the new key.

### 4. Update Settings UI (`src/components/SettingsView.vue`)
Add a new input field for the shortcut. Use the existing shortcut recording component logic (or create a new one if not available).

```html
<!-- Example Settings Row -->
<div class="setting-row">
  <label>{{ $t('settings.myNewShortcut') }}</label>
  <div class="shortcut-recorder">
    <!-- Implementation of shortcut recording input -->
  </div>
</div>
```

### 5. Localization (`src/locales/en.json`)
Add a label for the settings menu.

```json
"settings": {
  "myNewShortcut": "My New Feature Shortcut"
}
```
