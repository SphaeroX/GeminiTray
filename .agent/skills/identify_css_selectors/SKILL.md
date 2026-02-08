---
name: identify_css_selectors
description: Identify and test CSS selectors for the Gemini web interface by using the Developer Tools console.
---

# CSS Selector Identification Skill

This skill guides you through identifying and testing CSS selectors for the Gemini web interface elements.

## Overview

When you need to find the correct CSS selectors for Gemini interface elements (buttons, input fields, etc.), you can use the browser's Developer Tools to inspect and test selectors.

## Prerequisites

**IMPORTANT:** You must run the app with `npm run dev:console` to have DevTools automatically opened.

```bash
npm run dev:console
```

This will start the app with the Developer Tools already open for the Gemini BrowserView. The DevTools window will automatically be brought to the front after 1 second.

## Step-by-Step Guide

### 1. Wait for DevTools to Appear

When using `npm run dev:console`:
1. The app starts normally
2. After ~1 second, the DevTools window appears (it may appear behind the main window initially)
3. Look for a separate window titled "DevTools" or similar
4. If you don't see it, check your taskbar for a new window

### 2. Select Elements to Inspect

Once DevTools is open, you can select elements directly from the Gemini page:

**Method A: Click the Element Picker Icon**
1. In DevTools, look for the icon that looks like a cursor in a box (top-left corner of DevTools)
2. Click it - the icon should turn blue/active
3. Move your mouse over the Gemini window
4. Elements will be highlighted with a blue overlay as you hover
5. Click on the element you want to inspect
6. The Elements tab will automatically scroll to that element's HTML

**Method B: Right-click on Element**
1. In the Gemini window, right-click on the element you want to inspect
2. Select "Inspect" from the context menu
3. DevTools will open directly to that element

### 3. Find the CSS Selector

Once an element is selected in the Elements tab:

**Option 1: Copy Selector**
1. Right-click on the highlighted HTML element
2. Select "Copy" → "Copy selector"
3. This gives you the full CSS selector path (e.g., `body > div > div.input-area > button`)

**Option 2: Manual Selection**
1. Look at the element's attributes in the HTML
2. Note useful attributes like:
   - `class` → `.class-name`
   - `id` → `#element-id`
   - `aria-label` → `[aria-label="text"]`
   - `data-*` → `[data-attribute="value"]`

### 4. Test Selectors in Console

Switch to the **Console** tab in DevTools and test your selectors:

```javascript
// Test if a selector works
const element = document.querySelector('button[aria-label*="Senden"]');
console.log('Found:', element);

// Test multiple selectors
document.querySelector('button[aria-label*="Senden"]') ||
document.querySelector('button[aria-label*="Send"]') ||
document.querySelector('.send-button')

// Get all matching elements
document.querySelectorAll('button')

// Find by text content
Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Send')
)
```

### 5. Common Selectors for Gemini

Here are some commonly used selectors:

| Element | Selector |
|---------|----------|
| Send Button (German) | `button[aria-label*="Senden"]` |
| Send Button (English) | `button[aria-label*="Send"]` |
| Rich Text Editor | `div.ql-editor[contenteditable="true"]` |
| Any Content Editable | `div[contenteditable="true"]` |
| Send Icon | `button mat-icon[data-mat-icon-name="send"]` |
| Input Area Container | `.input-area-container` |
| Rich Textarea | `rich-textarea` |

## Practical Example: Finding the Send Button

1. Run `npm run dev:console`
2. Wait for DevTools to open
3. Click the element picker icon in DevTools
4. Hover over the Send button in Gemini
5. Click on it
6. In the Elements tab, you'll see HTML like:
   ```html
   <button aria-label="Senden" class="send-button">
     <mat-icon data-mat-icon-name="send"></mat-icon>
   </button>
   ```
7. Right-click the `<button>` element → Copy → Copy selector
8. Result: `body > div.main-container > div.input-area > button.send-button`
9. Simplify it: `button[aria-label*="Senden"]`

## Testing in prompt-injection.js

Once you have identified the correct selector, add it to `electron/prompt-injection.js`:

```javascript
function getSendButton() {
    return document.querySelector('button[aria-label*="Senden"]') ||
           document.querySelector('button[aria-label*="Send"]') ||
           document.querySelector('YOUR_NEW_SELECTOR');  // Add here
}
```

## Troubleshooting

### DevTools doesn't appear
- Check if `cross-env` is installed: `npm list cross-env`
- Try running: `npx cross-env OPEN_DEVTOOLS=true vite`
- Check Windows taskbar for minimized window

### Can't select elements
- Make sure you're in the **Elements** tab
- Try the keyboard shortcut `Ctrl+Shift+C` to activate element picker
- The Gemini page must be loaded (not showing a loading spinner)

### Selector doesn't work in code
- Test it multiple times - Gemini's UI changes dynamically
- Use `console.log(document.querySelector('your-selector'))` to verify
- Try more generic selectors first, then narrow down
- Check if the element exists but is hidden with CSS

## Tips for Robust Selectors

1. **Use partial attribute matches**: `aria-label*="Send"` works for "Send", "Send message", "Senden", etc.
2. **Check multiple languages**: Gemini may be in different languages
3. **Prefer data attributes**: `[data-mat-icon-name="send"]` is more stable than class names
4. **Add fallbacks**: Always have multiple selector options
5. **Test after page updates**: Google changes Gemini's UI frequently

## Alternative: DebugService

If you need to capture the page state programmatically, use the DebugService:

```javascript
// In DevTools console
await window.ipcRenderer.invoke('debug-save-snapshot', 'selector-test');
```

This saves HTML and state to `%TEMP%/gemini-tray-debug/` for analysis.
