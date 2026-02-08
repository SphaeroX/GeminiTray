---
name: use_debugging
description: Use built-in debugging tools to analyze the application state and Gemini integration.
---

# Use Debugging Skill

This skill explains how to use the built-in debugging features to diagnose issues, especially with the Gemini web integration.

## Overview

The application includes a `DebugService` that can capture the state of the `BrowserView` (HTML and internal state) to a temporary directory.

**Debug Directory:** `%TEMP%/gemini-tray-debug/` (Windows)

## How to Use

### 1. Manual Snapshot (from Renderer/Console)
You can trigger a snapshot from the frontend or DevTools console using the exposed IPC handler.

```javascript
// In Frontend Code or DevTools Console
await window.ipcRenderer.invoke('debug-save-snapshot', 'my-label');
```

This will create files:
- `my-label-{timestamp}.html`: Full HTML of the Gemini page.
- `my-label-{timestamp}-state.json`: JSON containing details about the input field, uploaded images, and loading state.

### 2. Automatic Snapshot (from Main Process)
To debug a specific flow in the Main process (e.g., after taking a screenshot), inject usage of `saveDebugSnapshot`.

**Import:**
```typescript
import { saveDebugSnapshot } from '../services/debug-service';
import { IS_DEV } from '../utils/constants';
```

**Usage:**
```typescript
if (IS_DEV && windowManager.view) {
    await saveDebugSnapshot(windowManager.view, 'step-name');
}
```

### 3. Analyze Results
1.  Open the `%TEMP%/gemini-tray-debug/` folder.
2.  **HTML**: Open the `.html` file in a browser to see exactly what the bot saw. Use "Inspect Element" to check selectors.
3.  **JSON**: Open `.json` to see if elements were found (`inputFieldExists`, `imageCount`, etc.).

### 4. Live Inspection
To open Chrome DevTools for the background Gemini view:

```javascript
// In Frontend Code or DevTools Console
await window.ipcRenderer.invoke('debug-open-devtools');
```

This opens a separate DevTools window attached to the hidden `BrowserView`.
