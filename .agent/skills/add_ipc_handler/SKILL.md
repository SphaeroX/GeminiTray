---
name: add_ipc_handler
description: Add a new IPC communication channel between Main and Renderer processes.
---

# Add IPC Handler Skill

This skill guides you through adding a new IPC handler to enable communication between the Electron Main process and the Vue Renderer process.

## Step-by-Step Instructions

### 1. Determine Communication Type
- **One-way (Renderer -> Main)**: Use `ipcMain.on` and `ipcRenderer.send`. (e.g., "Minimize Window")
- **Two-way (Renderer <-> Main)**: Use `ipcMain.handle` and `ipcRenderer.invoke`. (e.g., "Get Settings", "Save Data")
- **Main -> Renderer**: Use `webContents.send` and `ipcRenderer.on`. (e.g., "Download Complete")

### 2. Implement Handler in Main Process (`electron/managers/ipc-manager.ts`)
Locate `registerIpcHandlers` function in `electron/managers/ipc-manager.ts`.

#### Two-way Example (Async/Await)
```typescript
ipcMain.handle('my-feature:get-data', async (_event, id: string) => {
    try {
        const data = await someService.getData(id);
        return data; // Returns to renderer
    } catch (error) {
        console.error('Failed to get data:', error);
        throw error; // Propagates to renderer
    }
})
```

#### One-way Example
```typescript
ipcMain.on('my-feature:do-action', (_event, payload: any) => {
    // Perform action
    someService.performAction(payload);
})
```

### 3. Usage in Renderer (Vue Component)
In your Vue component (`<script setup lang="ts">`), use the exposed `window.ipcRenderer`.

#### Invoking a Handler
```typescript
const fetchData = async () => {
    try {
        const result = await window.ipcRenderer.invoke('my-feature:get-data', '123')
        console.log('Result:', result)
    } catch (err) {
        console.error('IPC Error:', err)
    }
}
```

#### Sending a Message
```typescript
const sendAction = () => {
    window.ipcRenderer.send('my-feature:do-action', { foo: 'bar' })
}
```

#### Listening to Main Process
```typescript
import { onMounted, onUnmounted } from 'vue'

const handleUpdate = (_event: any, data: any) => {
    console.log('Received update:', data)
}

onMounted(() => {
    window.ipcRenderer.on('my-feature:update', handleUpdate)
})

onUnmounted(() => {
    // Clean up listener to avoid memory leaks
    window.ipcRenderer.off('my-feature:update', handleUpdate)
})
```

### 4. Naming Convention
- Use kebab-case for channel names.
- Prefix with feature name if possible (e.g., `settings:get`, `chat:new-message`) to avoid collisions.

### 5. Type Safety (Optional but Recommended)
For complex data structures, define shared interfaces in `src/types.ts` (or similar) or keep them simple.
