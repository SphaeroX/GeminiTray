import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, app, screen, clipboard } from 'electron'
import { autoUpdater } from 'electron-updater'
import { store } from '../utils/store'
import { WindowManager } from './window-manager'
import { ShortcutManager } from './shortcut-manager'
import { IS_DEV, DEBUG_DIR } from '../utils/constants'
import { saveDebugSnapshot } from '../services/debug-service'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'

export function registerIpcHandlers(windowManager: WindowManager, shortcutManager: ShortcutManager) {
    ipcMain.on('toggle-settings', (_event: IpcMainEvent, isOpen: boolean) => {
        if (!windowManager.win || !windowManager.view) return

        if (isOpen) {
            windowManager.win.setBrowserView(null)
        } else {
            windowManager.win.setBrowserView(windowManager.view)
            windowManager.updateViewBounds()
        }
    })

    ipcMain.handle('get-settings', (_event: IpcMainInvokeEvent) => {
        return {
            opacity: store.get('opacity'),
            globalShortcut: store.get('globalShortcut'),
            screenshotShortcut: store.get('screenshotShortcut'),
            openAtLogin: store.get('openAtLogin'),
            openAsHidden: store.get('openAsHidden'),
            alwaysOnTop: store.get('alwaysOnTop'),
            newChatShortcut: store.get('newChatShortcut'),
            promptMenuShortcut: store.get('promptMenuShortcut'),
            prompts: store.get('prompts') || [],
            defaultModel: store.get('defaultModel') || 'fast'
        }
    })

    ipcMain.on('set-autostart', (_event: IpcMainEvent, settings: { openAtLogin: boolean, openAsHidden: boolean }) => {
        store.set('openAtLogin', settings.openAtLogin)
        store.set('openAsHidden', settings.openAsHidden)

        app.setLoginItemSettings({
            openAtLogin: settings.openAtLogin,
            openAsHidden: settings.openAsHidden,
            args: settings.openAsHidden ? ['--hidden'] : []
        })
    })

    ipcMain.on('save-prompts', (_event: IpcMainEvent, prompts: Array<{ id: string; name: string; content: string }>) => {
        store.set('prompts', prompts)
    })

    ipcMain.on('set-active-prompt', (_event: IpcMainEvent, prompt: { id: string; name: string; content: string } | null) => {
        console.log('[DEBUG] Main received set-active-prompt:', prompt);
        if (windowManager.view) {
            windowManager.view.webContents.executeJavaScript(`
        if (window.__GEMINI_TRAY_SET_PROMPT) {
          window.__GEMINI_TRAY_SET_PROMPT(${JSON.stringify(prompt)});
        } else {
             console.error('window.__GEMINI_TRAY_SET_PROMPT not found');
        }
      `).catch(err => console.error('Failed to set active prompt:', err));
        } else {
            console.error('[DEBUG] View is null');
        }
    })

    ipcMain.on('set-opacity', (_event: IpcMainEvent, opacity: number) => {
        if (windowManager.win) {
            windowManager.win.setOpacity(opacity)
            store.set('opacity', opacity)
        }
    })

    ipcMain.on('set-default-model', (_event: IpcMainEvent, model: 'fast' | 'thinking' | 'pro') => {
        store.set('defaultModel', model)
    })

    ipcMain.handle('set-global-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
        return shortcutManager.setGlobalShortcut(shortcut)
    })

    ipcMain.handle('set-screenshot-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
        return shortcutManager.setScreenshotShortcut(shortcut)
    })

    ipcMain.handle('set-new-chat-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
        return shortcutManager.setNewChatShortcut(shortcut)
    })

    ipcMain.handle('set-prompt-menu-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
        return shortcutManager.setPromptMenuShortcut(shortcut)
    })

    ipcMain.on('start-shortcut-recording', () => {
        shortcutManager.startRecording()
    })

    ipcMain.on('stop-shortcut-recording', () => {
        shortcutManager.stopRecording()
    })

    ipcMain.handle('check-for-updates', async () => {
        try {
            const result = await autoUpdater.checkForUpdates();
            return result;
        } catch (error) {
            console.error('Update check failed:', error);
            return null;
        }
    })

    ipcMain.handle('reset-session', async () => {
        if (windowManager.view) {
            try {
                await windowManager.view.webContents.session.clearStorageData();
                console.log('[GeminiTray] Session storage cleared');
                windowManager.view.webContents.reload();
                return true;
            } catch (error) {
                console.error('Failed to reset session:', error);
                return false;
            }
        }
        return false;
    })

    // DOM Handler for Screenshot selection
    ipcMain.on('screenshot-region-selected', async (_event, bounds: { x: number, y: number, width: number, height: number }) => {
        // Since this logic is tightly coupled with window manager's selection window and screenshot handling,
        // we might want to move the implementation details to WindowManager or keep it here but call WindowManager methods.
        // However, the original code had heavy logic here including cropping and pasting.
        // Let's try to extract the logic to a method in IPC Manager or leave it here if it doesn't fit WindowManager well.
        // Actually, the pasting logic interacts with the view, which is in WindowManager.
        // Let's keep the logic here for now but access windowManager properties.

        if (windowManager.selectionWindow) {
            windowManager.selectionWindow.close();
            windowManager.selectionWindow = null;
        }

        if (!windowManager.fullScreenshot) {
            windowManager.win?.show();
            return;
        }

        try {
            // Screen, clipboard, fs, path, os are now imported at top level



            const primaryDisplay = screen.getPrimaryDisplay();
            const scaleFactor = primaryDisplay.scaleFactor;

            const scaledBounds = {
                x: Math.round(bounds.x * scaleFactor),
                y: Math.round(bounds.y * scaleFactor),
                width: Math.round(bounds.width * scaleFactor),
                height: Math.round(bounds.height * scaleFactor)
            };

            const croppedScreenshot = windowManager.fullScreenshot.crop(scaledBounds);
            const tempPath = path.join(os.tmpdir(), `gemini-screenshot-${Date.now()}.png`);
            fs.writeFileSync(tempPath, croppedScreenshot.toPNG());

            windowManager.win?.show();
            windowManager.win?.focus();
            windowManager.win?.webContents.send('screenshot-taken', tempPath);

            if (IS_DEV && windowManager.view) {
                await saveDebugSnapshot(windowManager.view, 'before-paste');
            }

            if (windowManager.view) {
                clipboard.writeImage(croppedScreenshot);

                await windowManager.view.webContents.executeJavaScript(`
            (function() {
              const editor = document.querySelector('.ql-editor[contenteditable="true"]');
              if (editor) {
                editor.focus();
              }
            })();
          `);

                await new Promise(resolve => setTimeout(resolve, 100));

                windowManager.view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'V', modifiers: ['control'] });
                windowManager.view.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'V', modifiers: ['control'] });

                // Wait logic...
                let attempts = 0;
                const maxAttempts = 50;
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const uploadStatus = await windowManager.view.webContents.executeJavaScript(`
              (function() {
                const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
                if (!inputField) return { ready: false, reason: 'no-input-field' };
                
                const fileChips = inputField.querySelectorAll('[class*="chip"], [class*="thumbnail"], [class*="preview"], [class*="attachment"], [class*="media"]');
                const images = inputField.querySelectorAll('img:not([class*="icon"])');
                
                const isLoading = inputField.querySelector('[class*="loading"], [class*="uploading"], [class*="progress"], mat-spinner, .spinner') !== null;
                
                const uploader = document.querySelector('uploader');
                const uploaderLoading = uploader?.querySelector('[class*="loading"], [class*="progress"]') !== null;
                
                const hasAttachment = fileChips.length > 0 || images.length > 0;
                
                return {
                  ready: hasAttachment && !isLoading && !uploaderLoading,
                  hasAttachment: hasAttachment,
                  isLoading: isLoading || uploaderLoading,
                  chipCount: fileChips.length,
                  imageCount: images.length
                };
              })();
            `);

                    if (uploadStatus.ready) {
                        console.log('Screenshot upload confirmed ready:', uploadStatus);
                        break;
                    }
                    if (uploadStatus.hasAttachment && uploadStatus.isLoading) {
                        attempts++;
                        continue;
                    }
                    attempts++;
                }

                if (attempts >= maxAttempts) {
                    console.log('Screenshot upload wait timed out, proceeding anyway');
                }

                if (IS_DEV) {
                    await saveDebugSnapshot(windowManager.view, 'after-paste');
                }

                windowManager.view.webContents.focus();
            }

            windowManager.fullScreenshot = null;
        } catch (error) {
            console.error('Screenshot crop failed:', error);
            windowManager.win?.show();
            windowManager.fullScreenshot = null;
        }
    })

    ipcMain.on('screenshot-selection-cancelled', () => {
        if (windowManager.selectionWindow) {
            windowManager.selectionWindow.close();
            windowManager.selectionWindow = null;
        }
        windowManager.fullScreenshot = null;
        windowManager.win?.show();
    })

    if (IS_DEV) {
        ipcMain.handle('debug-save-snapshot', async (_event: IpcMainInvokeEvent, label: string = 'manual') => {
            if (!windowManager.view) return null;
            return await saveDebugSnapshot(windowManager.view, label);
        });

        ipcMain.handle('debug-get-gemini-state', async () => {
            if (!windowManager.view) return null;
            try {
                return await windowManager.view.webContents.executeJavaScript(`
        (function () {
          const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
          const editor = document.querySelector('.ql-editor[contenteditable="true"]');
    
          // Get all elements that might contain uploaded images
          const allElements = document.body.innerHTML;
          const blobUrls = allElements.match(/blob:[^"'\\s]+/g) || [];
          const dataUrls = (allElements.match(/data:image[^"'\\s]+/g) || []).map(u => u.substring(0, 100));
    
          return {
            timestamp: new Date().toISOString(),
            inputFieldHTML: inputField?.outerHTML?.substring(0, 10000) || null,
            editorHTML: editor?.innerHTML || null,
            blobUrlCount: blobUrls.length,
            blobUrls: blobUrls.slice(0, 5),
            dataUrlCount: dataUrls.length,
            documentReadyState: document.readyState,
            activeElement: document.activeElement?.tagName,
            activeElementClasses: document.activeElement?.className
          };
        })()
        `);
            } catch (error) {
                console.error('[DEBUG] Failed to get Gemini state:', error);
                return null;
            }
        });

        ipcMain.handle('debug-open-devtools', () => {
            if (windowManager.view) {
                windowManager.view.webContents.openDevTools({ mode: 'detach' });
                return true;
            }
            return false;
        });

        ipcMain.handle('debug-get-dir', () => {
            return DEBUG_DIR;
        });

        console.log('[DEBUG] Debug IPC handlers registered');
    }
}
