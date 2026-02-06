import { app, BrowserWindow, BrowserView, ipcMain, IpcMainEvent, globalShortcut, IpcMainInvokeEvent, Tray, Menu, nativeImage, screen, desktopCapturer, clipboard } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as fs from 'node:fs'
import * as os from 'node:os'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IS_DEV = !!process.env['VITE_DEV_SERVER_URL']

// In production, resources are in resources/electron/prompt-injection.js
// In dev, they are in electron/prompt-injection.js relative to project root
const PROMPT_INJECTION_PATH = IS_DEV
  ? path.join(__dirname, '../electron/prompt-injection.js')
  : path.join(process.resourcesPath, 'electron/prompt-injection.js');

let PROMPT_INJECTION_SCRIPT = '';
try {
  PROMPT_INJECTION_SCRIPT = fs.readFileSync(PROMPT_INJECTION_PATH, 'utf-8');
} catch (e) {
  console.error('Failed to load prompt injection script:', e);
}

// Fix for Google Login "This browser or app may not be secure"
app.commandLine.appendSwitch('disable-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-site-isolation-trials');
// Allow third-party/partitioned cookies used by Google Sign-In (from GeminiDesk)
app.commandLine.appendSwitch('enable-features', 'ThirdPartyStoragePartitioning');

// Disable hardware acceleration to match GeminiDesk (stealth/stability)
app.disableHardwareAcceleration();


// Debug mode - only active in development
// const IS_DEV = !!process.env['VITE_DEV_SERVER_URL'] // Moved to top
const DEBUG_DIR = path.join(os.tmpdir(), 'gemini-tray-debug')

// Ensure debug directory exists in dev mode
if (IS_DEV) {
  if (!fs.existsSync(DEBUG_DIR)) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true })
  }
  console.log('[DEBUG] Debug mode enabled. Debug files will be saved to:', DEBUG_DIR)
}

// Debug utility functions (only active in dev mode)
async function saveDebugSnapshot(view: BrowserView, label: string = 'snapshot') {
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

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// Define the store schema
interface StoreSchema {
  opacity: number;
  globalShortcut: string;
  screenshotShortcut: string;
  openAtLogin: boolean;
  openAsHidden: boolean;
  alwaysOnTop: boolean;
  newChatShortcut: string;
  promptMenuShortcut: string;
  prompts: Array<{ id: string; name: string; content: string }>;
}

const store = new Store<StoreSchema>({
  defaults: {
    opacity: 0.95,
    globalShortcut: 'Alt+Space',
    screenshotShortcut: 'Alt+Shift+S',
    openAtLogin: false,
    openAsHidden: true,
    alwaysOnTop: true,
    newChatShortcut: 'Alt+N',
    promptMenuShortcut: 'Alt+J',
    prompts: []
  }
});

let win: BrowserWindow | null
let view: BrowserView | null
let tray: Tray | null = null
let isQuitting = false
let selectionWindow: BrowserWindow | null = null
let fullScreenshot: Electron.NativeImage | null = null

function createWindow() {
  const opacity = store.get('opacity');
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 500,
    height: 650,
    minWidth: 400,
    minHeight: 300,
    frame: false, // We use a custom titlebar implementation via HTML/CSS
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#00000000', // Transparent overlay
      symbolColor: '#ffffff', // White window controls
      height: 40 // Height of the caption buttons area
    },
    opacity: opacity, // Set initial opacity
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      partition: 'persist:gemini'
    },
  })

  // Apply alwaysOnTop with proper level
  const alwaysOnTop = store.get('alwaysOnTop');
  if (alwaysOnTop) {
    win.setAlwaysOnTop(true, 'screen-saver');
  }

  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      win?.hide()
      return false
    }
    return true
  })

  // Create BrowserView for Gemini
  // mimicking GeminiDesk: use the exact Chrome version of the Electron runtime
  const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

  view = new BrowserView({
    webPreferences: {
      partition: 'persist:gemini', // Share session/cookies
      devTools: IS_DEV, // Enable DevTools only in dev mode
      // @ts-ignore
      userAgent: userAgent // Set UA at creation time for stealth
    }
  })

  // Inject script to remove "navigator.webdriver" property
  // This is crucial for bypassing Google's anti-automation checks
  view.webContents.on('did-start-loading', () => {
    view?.webContents.executeJavaScript(`
      const newProto = navigator.__proto__;
      delete newProto.webdriver;
      navigator.__proto__ = newProto;
    `).catch(() => { });
  });

  // Inject prompt handling script when page finishes loading
  view.webContents.on('did-finish-load', () => {
    view?.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT).catch(err => console.error('Failed to inject prompt script:', err));
  });

  // Debug: Log console messages from Gemini view
  if (IS_DEV) {
    view.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      const logMsg = `[Gemini Console] [${level}] ${message} (${sourceId}:${line})`;
      console.log(logMsg);
      // Also append to a log file
      try {
        fs.appendFileSync(path.join(DEBUG_DIR, 'console.log'), `[${new Date().toISOString()}] ${logMsg}\n`);
      } catch (e) {
        // ignore write error
      }
    });
  }
  win.setBrowserView(view)

  // Initial bounds - will be updated by resize event
  const updateViewBounds = () => {
    if (win && view) {
      const bounds = win.getBounds()
      // Offset by Title Bar height (e.g. 40px)
      view.setBounds({ x: 0, y: 40, width: bounds.width, height: bounds.height - 40 })
    }
  }

  win.on('resize', updateViewBounds)
  win.on('maximize', updateViewBounds)
  win.on('unmaximize', updateViewBounds)

  view.webContents.loadURL('https://gemini.google.com/app')

  // Load the local UI (TitleBar + Settings)
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Prevent Alt+Space from opening Windows system menu
  win.webContents.on('before-input-event', (event, input) => {
    if (input.alt && input.key === ' ') {
      event.preventDefault()
    }
  })

  // Block Windows system menu (Alt+Space) at native level
  if (process.platform === 'win32') {
    const WM_SYSCOMMAND = 0x0112
    const SC_KEYMENU = 0xF100
    win.hookWindowMessage(WM_SYSCOMMAND, (wParam) => {
      // SC_KEYMENU is triggered by Alt+Space
      if ((wParam.readBigUInt64LE(0) & 0xFFF0n) === BigInt(SC_KEYMENU)) {
        return true // Block the message
      }
      return false
    })
  }

  // Ensure bounds are set correctly after creation
  win.once('ready-to-show', () => {
    updateViewBounds()

    // Check if we should start hidden
    const wasOpenedAsHidden = process.argv.includes('--hidden') || (app.getLoginItemSettings().wasOpenedAsHidden && process.platform === 'darwin');
    if (wasOpenedAsHidden) {
      win?.hide()
    } else {
      win?.show()
    }
  })

  // IPC Handlers
  ipcMain.on('toggle-settings', (_event: IpcMainEvent, isOpen: boolean) => {
    if (!win || !view) return

    if (isOpen) {
      // Hide Gemini view to show Settings overlay
      win.setBrowserView(null)
    } else {
      // Restore Gemini view
      win.setBrowserView(view)
      updateViewBounds()
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
      prompts: store.get('prompts') || []
    }
  })

  ipcMain.on('set-autostart', (_event: IpcMainEvent, settings: { openAtLogin: boolean, openAsHidden: boolean }) => {
    store.set('openAtLogin', settings.openAtLogin)
    store.set('openAsHidden', settings.openAsHidden)

    app.setLoginItemSettings({
      openAtLogin: settings.openAtLogin,
      openAsHidden: settings.openAsHidden, // macOS
      args: settings.openAsHidden ? ['--hidden'] : [] // Windows
    })
  })

  ipcMain.on('save-prompts', (_event: IpcMainEvent, prompts: Array<{ id: string; name: string; content: string }>) => {
    store.set('prompts', prompts)
  })

  ipcMain.on('set-active-prompt', (_event: IpcMainEvent, prompt: { id: string; name: string; content: string } | null) => {
    console.log('[DEBUG] Main received set-active-prompt:', prompt);
    if (view) {
      view.webContents.executeJavaScript(`
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
    if (win) {
      win.setOpacity(opacity)
      store.set('opacity', opacity)
    }
  })

  // Shortcut recording mode - registers a temporary global shortcut to block system menu
  let isRecordingShortcut = false;
  let shortcutRecordingCallback: ((shortcut: string) => void) | null = null;

  // Central function to handle Alt+Space - can switch between recording and toggle mode
  const handleAltSpace = () => {
    if (isRecordingShortcut && shortcutRecordingCallback) {
      shortcutRecordingCallback('Alt+Space');
    } else {
      toggleWindowVisibility();
    }
  };

  // Ensure Alt+Space is always registered to block Windows system menu
  const ensureAltSpaceRegistered = () => {
    if (!globalShortcut.isRegistered('Alt+Space')) {
      try {
        globalShortcut.register('Alt+Space', handleAltSpace);
      } catch (e) {
        console.error('Failed to register Alt+Space:', e);
      }
    }
  };

  ipcMain.handle('set-global-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
    const oldShortcut = store.get('globalShortcut');

    // Don't unregister Alt+Space if it's the old shortcut (keep it for blocking system menu)
    if (oldShortcut && oldShortcut !== 'Alt+Space') {
      globalShortcut.unregister(oldShortcut);
    }

    try {
      let ret: boolean;

      if (shortcut === 'Alt+Space') {
        // Alt+Space uses special handler that can switch between recording and toggle mode
        if (globalShortcut.isRegistered('Alt+Space')) {
          // Already registered, just update store
          ret = true;
        } else {
          ret = globalShortcut.register('Alt+Space', handleAltSpace);
        }
      } else {
        // For other shortcuts, if old was Alt+Space, unregister it now
        if (oldShortcut === 'Alt+Space') {
          try { globalShortcut.unregister('Alt+Space'); } catch (e) { /* ignore */ }
        }
        ret = globalShortcut.register(shortcut, () => toggleWindowVisibility());
      }

      if (!ret) {
        // Restore old shortcut on failure
        if (oldShortcut === 'Alt+Space') {
          ensureAltSpaceRegistered();
        } else if (oldShortcut) {
          globalShortcut.register(oldShortcut, () => toggleWindowVisibility());
        }
        return false;
      }

      store.set('globalShortcut', shortcut);
      return true;
    } catch (error) {
      console.error('Failed to register shortcut:', error);
      if (oldShortcut === 'Alt+Space') {
        ensureAltSpaceRegistered();
      } else if (oldShortcut) {
        globalShortcut.register(oldShortcut, () => toggleWindowVisibility());
      }
      return false;
    }
  })

  ipcMain.handle('set-screenshot-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
    const oldShortcut = store.get('screenshotShortcut');
    if (oldShortcut) {
      globalShortcut.unregister(oldShortcut);
    }

    try {
      const ret = globalShortcut.register(shortcut, () => {
        takeScreenshot();
      });

      if (!ret) {
        if (oldShortcut) {
          globalShortcut.register(oldShortcut, () => takeScreenshot());
        }
        return false;
      }

      store.set('screenshotShortcut', shortcut);
      return true;
    } catch (error) {
      console.error('Failed to register screenshot shortcut:', error);
      if (oldShortcut) {
        globalShortcut.register(oldShortcut, () => takeScreenshot());
      }
      return false;
    }
  })

  ipcMain.handle('set-new-chat-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
    const oldShortcut = store.get('newChatShortcut');
    if (oldShortcut) {
      globalShortcut.unregister(oldShortcut);
    }

    try {
      const ret = globalShortcut.register(shortcut, () => {
        handleNewChat();
      });

      if (!ret) {
        if (oldShortcut) {
          globalShortcut.register(oldShortcut, () => handleNewChat());
        }
        return false;
      }

      store.set('newChatShortcut', shortcut);
      return true;
    } catch (error) {
      console.error('Failed to register new chat shortcut:', error);
      if (oldShortcut) {
        globalShortcut.register(oldShortcut, () => handleNewChat());
      }
      return false;
    }
  })

  ipcMain.handle('set-prompt-menu-shortcut', (_event: IpcMainInvokeEvent, shortcut: string) => {
    const oldShortcut = store.get('promptMenuShortcut');
    if (oldShortcut) {
      globalShortcut.unregister(oldShortcut);
    }

    try {
      const ret = globalShortcut.register(shortcut, () => {
        if (win) {
          if (!win.isVisible()) {
            win.show();
            win.focus();
          }
          win.webContents.send('toggle-prompt-menu');
        }
      });

      if (!ret) {
        if (oldShortcut) {
          globalShortcut.register(oldShortcut, () => {
            if (win) {
              if (!win.isVisible()) win.show();
              win.webContents.send('toggle-prompt-menu');
            }
          });
        }
        return false;
      }

      store.set('promptMenuShortcut', shortcut);
      return true;
    } catch (error) {
      console.error('Failed to register prompt menu shortcut:', error);
      if (oldShortcut) {
        globalShortcut.register(oldShortcut, () => {
          if (win) {
            if (!win.isVisible()) win.show();
            win.webContents.send('toggle-prompt-menu');
          }
        });
      }
      return false;
    }
  })

  ipcMain.on('start-shortcut-recording', () => {
    if (isRecordingShortcut) return;
    isRecordingShortcut = true;

    // Set the callback to send recorded shortcuts to renderer
    shortcutRecordingCallback = (shortcut: string) => {
      win?.webContents.send('shortcut-recorded', shortcut);
    };

    // Unregister current shortcuts to allow recording them (but keep Alt+Space if it's the blocker)
    const currentGlobal = store.get('globalShortcut');
    const currentScreenshot = store.get('screenshotShortcut');

    // Only unregister if not Alt+Space (we keep Alt+Space registered always)
    if (currentGlobal && currentGlobal !== 'Alt+Space') {
      globalShortcut.unregister(currentGlobal);
    }
    if (currentScreenshot && currentScreenshot !== 'Alt+Space') {
      globalShortcut.unregister(currentScreenshot);
    }
    const currentNewChat = store.get('newChatShortcut');
    if (currentNewChat && currentNewChat !== 'Alt+Space') {
      globalShortcut.unregister(currentNewChat);
    }
    const currentPromptMenu = store.get('promptMenuShortcut');
    if (currentPromptMenu && currentPromptMenu !== 'Alt+Space') {
      globalShortcut.unregister(currentPromptMenu);
    }

    // Ensure Alt+Space is registered (for recording and to block system menu)
    ensureAltSpaceRegistered();
  });

  ipcMain.on('stop-shortcut-recording', () => {
    if (!isRecordingShortcut) return;
    isRecordingShortcut = false;
    shortcutRecordingCallback = null;

    const currentGlobal = store.get('globalShortcut');
    const currentScreenshot = store.get('screenshotShortcut');
    const currentNewChat = store.get('newChatShortcut');
    const currentPromptMenu = store.get('promptMenuShortcut');

    // Handle Alt+Space specially - keep it registered if it's the global shortcut
    if (currentGlobal === 'Alt+Space') {
      // Already registered and handleAltSpace will now call toggleWindowVisibility
      ensureAltSpaceRegistered();
    } else {
      // Unregister Alt+Space blocker if not needed as global shortcut
      try {
        globalShortcut.unregister('Alt+Space');
      } catch (e) {
        // Ignore
      }
      // Register the actual global shortcut
      if (currentGlobal) {
        globalShortcut.register(currentGlobal, () => toggleWindowVisibility());
      }
    }

    // Handle screenshot shortcut
    if (currentScreenshot && currentScreenshot !== 'Alt+Space') {
      globalShortcut.register(currentScreenshot, () => takeScreenshot());
    }

    // Handle new chat shortcut
    if (currentNewChat && currentNewChat !== 'Alt+Space') {
      globalShortcut.register(currentNewChat, () => handleNewChat());
    }

    if (currentPromptMenu && currentPromptMenu !== 'Alt+Space') {
      globalShortcut.register(currentPromptMenu, () => {
        if (win) {
          if (!win.isVisible()) win.show();
          win.webContents.send('toggle-prompt-menu');
        }
      });
    }
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
    if (view) {
      try {
        await view.webContents.session.clearStorageData();
        console.log('[GeminiTray] Session storage cleared');

        // Reload the view to reflect changes (user will be logged out)
        view.webContents.reload();

        return true;
      } catch (error) {
        console.error('Failed to reset session:', error);
        return false;
      }
    }
    return false;
  })

  // Debug IPC handlers (only active in dev mode)
  if (IS_DEV) {
    ipcMain.handle('debug-save-snapshot', async (_event: IpcMainInvokeEvent, label: string = 'manual') => {
      if (!view) return null;
      return await saveDebugSnapshot(view, label);
    });

    ipcMain.handle('debug-get-gemini-state', async () => {
      if (!view) return null;
      try {
        return await view.webContents.executeJavaScript(`
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
      if (view) {
        view.webContents.openDevTools({ mode: 'detach' });
        return true;
      }
      return false;
    });

    ipcMain.handle('debug-get-dir', () => {
      return DEBUG_DIR;
    });

    console.log('[DEBUG] Debug IPC handlers registered');
  }

  // Register initial shortcuts
  const initialShortcut = store.get('globalShortcut');
  if (initialShortcut === 'Alt+Space') {
    ensureAltSpaceRegistered();
  } else if (initialShortcut) {
    globalShortcut.register(initialShortcut, () => toggleWindowVisibility());
  }

  const initialScreenshotShortcut = store.get('screenshotShortcut');
  if (initialScreenshotShortcut) {
    globalShortcut.register(initialScreenshotShortcut, () => takeScreenshot());
  }

  const initialNewChatShortcut = store.get('newChatShortcut');
  if (initialNewChatShortcut) {
    globalShortcut.register(initialNewChatShortcut, () => handleNewChat());
  }

  const initialPromptMenuShortcut = store.get('promptMenuShortcut');
  if (initialPromptMenuShortcut) {
    globalShortcut.register(initialPromptMenuShortcut, () => {
      if (win) {
        if (!win.isVisible()) win.show();
        win.webContents.send('toggle-prompt-menu');
      }
    });
  }
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'tray-icon.png'))
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => toggleWindowVisibility()
    },
    {
      label: 'Screenshot & Ask',
      click: () => takeScreenshot()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Gemini Tray')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    toggleWindowVisibility()
  })
}

function toggleWindowVisibility() {
  if (win) {
    if (win.isVisible()) {
      if (win.isFocused()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    } else {
      win.show();
      win.focus();
    }
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
    view = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})


async function handleNewChat() {
  if (win) {
    if (!win.isVisible()) {
      win.show();
    }
    if (!win.isFocused()) {
      win.focus();
    }
  }

  if (view) {
    try {
      // Focus the Gemini view first
      view.webContents.focus();
      
      // Wait a bit for focus to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send Ctrl+Shift+O keyboard shortcut to open new chat
      // Using modifiers array instead of separate key events
      view.webContents.sendInputEvent({ 
        type: 'keyDown', 
        keyCode: 'O',
        modifiers: ['control', 'shift']
      });
      view.webContents.sendInputEvent({ 
        type: 'keyUp', 
        keyCode: 'O',
        modifiers: ['control', 'shift']
      });
      
      console.log('[GeminiTray] Sent Ctrl+Shift+O shortcut for new chat');
    } catch (e) {
      console.error('Failed to trigger new chat:', e);
    }
  }
}

async function takeScreenshot() {
  try {
    // Hide main window temporarily for clean screenshot
    const wasVisible = win?.isVisible();
    if (wasVisible) win?.hide();

    // Wait a bit for window to hide
    await new Promise(resolve => setTimeout(resolve, 200));

    // Get the primary display for full-resolution screenshot
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const scaleFactor = primaryDisplay.scaleFactor;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: width * scaleFactor, height: height * scaleFactor }
    });

    if (sources.length > 0) {
      // Store the full screenshot for later cropping
      fullScreenshot = sources[0].thumbnail;

      // Open the selection window
      openSelectionWindow();
    } else {
      if (wasVisible) win?.show();
    }
  } catch (error) {
    console.error('Screenshot failed:', error);
    win?.show();
  }
}

function openSelectionWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  selectionWindow = new BrowserWindow({
    x: primaryDisplay.bounds.x,
    y: primaryDisplay.bounds.y,
    width: width,
    height: height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  selectionWindow.loadFile(path.join(__dirname, 'screenshot-selection.html'));
  selectionWindow.setAlwaysOnTop(true, 'screen-saver');

  selectionWindow.on('closed', () => {
    selectionWindow = null;
  });
}

// IPC handler for region selection
ipcMain.on('screenshot-region-selected', async (_event, bounds: { x: number, y: number, width: number, height: number }) => {
  if (selectionWindow) {
    selectionWindow.close();
    selectionWindow = null;
  }

  if (!fullScreenshot) {
    win?.show();
    return;
  }

  try {
    // Get display scale factor for accurate cropping
    const primaryDisplay = screen.getPrimaryDisplay();
    const scaleFactor = primaryDisplay.scaleFactor;

    // Scale the bounds to match the screenshot resolution
    const scaledBounds = {
      x: Math.round(bounds.x * scaleFactor),
      y: Math.round(bounds.y * scaleFactor),
      width: Math.round(bounds.width * scaleFactor),
      height: Math.round(bounds.height * scaleFactor)
    };

    // Crop the screenshot to the selected region
    const croppedScreenshot = fullScreenshot.crop(scaledBounds);

    const tempPath = path.join(os.tmpdir(), `gemini-screenshot-${Date.now()}.png`);
    fs.writeFileSync(tempPath, croppedScreenshot.toPNG());

    // Show window and send screenshot path to renderer
    win?.show();
    win?.focus();
    win?.webContents.send('screenshot-taken', tempPath);

    // Debug: Save state before paste
    if (IS_DEV && view) {
      await saveDebugSnapshot(view, 'before-paste');
    }

    // Try to upload via Gemini's file upload mechanism
    if (view) {
      // Copy image to clipboard
      clipboard.writeImage(croppedScreenshot);

      // Focus the editor and simulate Ctrl+V paste
      await view.webContents.executeJavaScript(`
        (function() {
          const editor = document.querySelector('.ql-editor[contenteditable="true"]');
          if (editor) {
            editor.focus();
          }
        })();
      `);

      // Small delay to ensure focus
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate Ctrl+V to paste from clipboard
      view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'V', modifiers: ['control'] });
      view.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'V', modifiers: ['control'] });

      // Wait for image to actually appear in the UI (upload processing)
      // This ensures the image is ready before user can send
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));

        const uploadStatus = await view.webContents.executeJavaScript(`
          (function() {
            // Look for image thumbnails/previews in the input area
            const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
            if (!inputField) return { ready: false, reason: 'no-input-field' };
            
            // Check for uploaded file chips/thumbnails
            const fileChips = inputField.querySelectorAll('[class*="chip"], [class*="thumbnail"], [class*="preview"], [class*="attachment"], [class*="media"]');
            const images = inputField.querySelectorAll('img:not([class*="icon"])');
            
            // Check for loading/uploading states
            const isLoading = inputField.querySelector('[class*="loading"], [class*="uploading"], [class*="progress"], mat-spinner, .spinner') !== null;
            
            // Check if any file upload is in progress by looking at the uploader component
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

        // Image appeared and no upload in progress
        if (uploadStatus.ready) {
          console.log('Screenshot upload confirmed ready:', uploadStatus);
          break;
        }

        // If we detect attachment but still loading, keep waiting
        if (uploadStatus.hasAttachment && uploadStatus.isLoading) {
          attempts++;
          continue;
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        console.log('Screenshot upload wait timed out, proceeding anyway');
      }

      // Debug: Save state after paste attempt
      if (IS_DEV) {
        await saveDebugSnapshot(view, 'after-paste');
      }

      view.webContents.focus();
    }

    fullScreenshot = null;
  } catch (error) {
    console.error('Screenshot crop failed:', error);
    win?.show();
    fullScreenshot = null;
  }
});

ipcMain.on('screenshot-selection-cancelled', () => {
  if (selectionWindow) {
    selectionWindow.close();
    selectionWindow = null;
  }
  fullScreenshot = null;
  win?.show();
})

function setupAutoUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info: unknown) => {
    win?.webContents.send('update-available', info);
  });

  autoUpdater.on('update-downloaded', (info: unknown) => {
    win?.webContents.send('update-downloaded', info);
  });

  autoUpdater.on('error', (error: Error) => {
    console.error('Auto-updater error:', error);
  });

  // Check for updates after app starts (only in production)
  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdates().catch(console.error);
  }
}

app.whenReady().then(() => {
  createWindow()
  createTray()
  setupAutoUpdater()
})
