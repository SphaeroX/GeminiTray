import { BrowserView } from 'electron'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { IS_DEV, DEBUG_DIR } from '../utils/constants'

// Ensure debug directory exists in dev mode
if (IS_DEV) {
    if (!fs.existsSync(DEBUG_DIR)) {
        fs.mkdirSync(DEBUG_DIR, { recursive: true })
    }
    console.log('[DEBUG] Debug mode enabled. Debug files will be saved to:', DEBUG_DIR)
}

export async function saveDebugSnapshot(view: BrowserView, label: string = 'snapshot') {
    if (!IS_DEV || !view) return null

    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `${label}-${timestamp}`

        // Get full HTML
        const html = await view.webContents.executeJavaScript(`document.documentElement.outerHTML`)
        const htmlPath = path.join(DEBUG_DIR, `${filename}.html`)
        fs.writeFileSync(htmlPath, html)

        // Get detailed input field state
        const inputState = await view.webContents.executeJavaScript(`
      (function() {
        const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
        const editor = document.querySelector('.ql-editor[contenteditable="true"]');
        const allImages = document.querySelectorAll('img');
        const allChips = document.querySelectorAll('[class*="chip"]');
        const allMedia = document.querySelectorAll('[class*="media"], [class*="thumbnail"], [class*="preview"]');
        const allUploading = document.querySelectorAll('[class*="loading"], [class*="uploading"], [class*="progress"]');
        const sendButton = document.querySelector('button[aria-label*="Senden"], button[aria-label*="Send"], button mat-icon[data-mat-icon-name="send_spark"], button mat-icon[data-mat-icon-name="send"]')?.closest('button');
        
        return {
          inputFieldExists: !!inputField,
          inputFieldClasses: inputField?.className || null,
          inputFieldHTML: inputField?.innerHTML?.substring(0, 5000) || null,
          editorExists: !!editor,
          editorContent: editor?.innerHTML?.substring(0, 2000) || null,
          imageCount: allImages.length,
          images: Array.from(allImages).slice(0, 10).map(img => ({
            src: img.src?.substring(0, 200),
            className: img.className,
            parentClasses: img.parentElement?.className
          })),
          chipCount: allChips.length,
          chips: Array.from(allChips).slice(0, 10).map(c => ({
            className: c.className,
            innerHTML: c.innerHTML?.substring(0, 500)
          })),
          mediaCount: allMedia.length,
          media: Array.from(allMedia).slice(0, 10).map(m => ({
            tagName: m.tagName,
            className: m.className,
            innerHTML: m.innerHTML?.substring(0, 500)
          })),
          uploadingCount: allUploading.length,
          uploading: Array.from(allUploading).slice(0, 5).map(u => u.className),
          sendButtonExists: !!sendButton,
          sendButtonDisabled: sendButton?.disabled || sendButton?.getAttribute('aria-disabled') === 'true',
          sendButtonHTML: sendButton?.outerHTML || null
        };
      })()
    `)

        const statePath = path.join(DEBUG_DIR, `${filename}-state.json`)
        fs.writeFileSync(statePath, JSON.stringify(inputState, null, 2))

        console.log(`[DEBUG] Snapshot saved: ${filename}`)
        return { htmlPath, statePath, inputState }
    } catch (error) {
        console.error('[DEBUG] Failed to save snapshot:', error)
        return null
    }
}
