---
name: inspect_gemini_page
description: Launches a browser subagent to inspect the Gemini web page (gemini.google.com) as if it were the Electron app. Use this to find CSS selectors, debug DOM structure, or verify element visibility.
---

# Inspect Gemini Page Skill

This skill allows you to "see" the Gemini web interface exactly as the Gemini Tray application does. It is useful for:
- Identifying stable CSS selectors for new features.
- Debugging why a script (like `prompt-injection.js`) might be failing.
- Verifying the DOM structure after Google updates the website.

## Prerequisites

- **Login**: The `browser_subagent` starts with a fresh profile. You may need to log in to Google manually or handle the login flow if the element you need is behind auth.
    - *Tip*: If you just need to inspect the login page structure, no login is needed.
    - *Tip*: If you need to inspect the chat interface, you must guide the subagent to log in first.

## Browser Configuration

The Gemini Tray app masquerades as a standard Chrome browser to avoid "unsecure browser" warnings from Google.

**User-Agent to use:**
`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
*(Note: The app uses `process.versions.chrome`, so using a recent Chrome version like 120+ is a good approximation).*

## Instructions

### 1. Launch Browser Subagent

Call the `browser_subagent` tool with a task description that includes:
- **URL**: `https://gemini.google.com/app`
- **User-Agent**: Explicitly request the subagent to set the User-Agent if possible, or note it in the context (currently `browser_subagent` might use its own, but the context helps the model understand).

**Example Task Description for Subagent:**
> "Go to https://gemini.google.com/app. I need to find the CSS selector for the 'Send' button. Please log in if necessary (I will provide credentials if asked, or use a temporary flow). Once on the chat page, inspect the 'Send' button and return its unique CSS selector, aria-label, and any consistent classes."

### 2. Identify Selectors

When the subagent returns, look for:
- **`aria-label`**: Google often uses aria-labels like "Send" or "Senden".
- **`mat-icon`**: Material Design icons often have `data-mat-icon-name` attributes (e.g., `send`, `send_spark`).
- **Classes**: Classes like `input-area-container`, `rich-textarea`, `ql-editor` have been stable in the past.

### 3. Compare with Existing Logic

Check `electron/prompt-injection.js` to see if your findings match the current implementation.

**Current Known Selectors (Reference):**
- **Input Area**: `.input-area-container`, `rich-textarea`, `.ql-editor[contenteditable="true"]`
- **Send Button**: `button[aria-label*="Send"]`, `button[aria-label*="Senden"]`, `mat-icon[data-mat-icon-name="send"]`

## Troubleshooting

- **"Browser not secure"**: If Google blocks the login, it's likely due to the User-Agent or automation flags. The real app uses:
    ```javascript
    app.commandLine.appendSwitch('disable-features', 'AutomationControlled');
    ```
    The `browser_subagent` might not support these flags directly. If you cannot log in, try to inspect the public landing page or ask the user for help (e.g., "I cannot pass the login screen with the subagent, can you provide a snapshot using the `debug-save-snapshot` IPC command instead?").
