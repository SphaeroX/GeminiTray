import { BrowserWindow, BrowserView, session, shell, screen, desktopCapturer, clipboard } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { store } from '../utils/store'
import { IS_DEV, OPEN_DEVTOOLS, VITE_DEV_SERVER_URL, RENDERER_DIST, VITE_PUBLIC, DEBUG_DIR, getPlatformUserAgent } from '../utils/constants'
import { ScriptInjector } from './script-injector'

export class WindowManager {
    public win: BrowserWindow | null = null
    public view: BrowserView | null = null
    public selectionWindow: BrowserWindow | null = null
    public fullScreenshot: Electron.NativeImage | null = null
    private __dirname: string
    private scriptInjector: ScriptInjector

    public isQuitting = false
    public isRecordingShortcut: (() => boolean) | null = null
    public isDictating = false

    constructor(dirname: string) {
        this.__dirname = dirname
        this.scriptInjector = new ScriptInjector()
    }

    setQuitting(quitting: boolean) {
        this.isQuitting = quitting
    }

    createWindow() {
        const opacity = store.get('opacity');
        const alwaysOnTop = store.get('alwaysOnTop');
        this.win = new BrowserWindow({
            icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
            width: 500,
            height: 650,
            minWidth: 400,
            minHeight: 300,
            frame: false,
            show: false,
            backgroundColor: '#000000',
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#000000',
                symbolColor: '#ffffff',
                height: 40
            },
            opacity: opacity,
            alwaysOnTop: alwaysOnTop,
            webPreferences: {
                preload: path.join(this.__dirname, 'preload.mjs'),
                partition: 'persist:gemini'
            },
        })

        if (alwaysOnTop) {
            this.win.setAlwaysOnTop(true, 'screen-saver');
        }

        this.win.on('close', (event) => {
            if (!this.isQuitting) {
                event.preventDefault()
                this.win?.hide()
                return false
            }
            return true
        })

        this.createBrowserView()

        this.win.on('resize', () => this.updateViewBounds())
        this.win.on('hide', () => this.cancelDictation())
        this.win.on('maximize', () => this.updateViewBounds())
        this.win.on('unmaximize', () => this.updateViewBounds())

        // Handle external links
        this.view!.webContents.setWindowOpenHandler(({ url }) => {
            if (
                url.includes('accounts.google.') ||
                url.includes('myaccount.google.') ||
                url.includes('accounts.youtube.')
            ) {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        webPreferences: {
                            partition: 'persist:gemini'
                        }
                    }
                }
            }
            shell.openExternal(url)
            return { action: 'deny' }
        })

        this.view!.webContents.on('will-navigate', (event, url) => {
            if (
                url.startsWith('https://gemini.google.com') ||
                url.includes('accounts.google.') ||
                url.includes('myaccount.google.') ||
                url.includes('accounts.youtube.')
            ) {
                return
            }
            event.preventDefault()
            shell.openExternal(url)
        })

        this.view!.webContents.loadURL('https://gemini.google.com/app')

        if (VITE_DEV_SERVER_URL) {
            this.win.loadURL(VITE_DEV_SERVER_URL)
        } else {
            this.win.loadFile(path.join(RENDERER_DIST, 'index.html'))
        }

        this.win.webContents.on('before-input-event', (event, input) => {
            if (input.alt && input.key === ' ') {
                event.preventDefault()
                if (input.type === 'keyDown' && this.isRecordingShortcut && this.isRecordingShortcut()) {
                    this.win?.webContents.send('shortcut-recorded', 'Alt+Space')
                }
            }
        })

        if (process.platform === 'win32') {
            const WM_SYSCOMMAND = 0x0112
            const SC_KEYMENU = 0xF100
            this.win.hookWindowMessage(WM_SYSCOMMAND, (wParam) => {
                if ((wParam.readBigUInt64LE(0) & 0xFFF0n) === BigInt(SC_KEYMENU)) {
                    return true
                }
                return false
            })
        }

        this.win.once('ready-to-show', () => {
            this.updateViewBounds()
            if (!process.argv.includes('--hidden')) {
                this.win?.show()
            }
        })
    }

    createBrowserView() {
        if (!this.win) return

        const chromeUA = getPlatformUserAgent('chrome');
        const firefoxUA = getPlatformUserAgent('firefox');

        const geminiSession = session.fromPartition('persist:gemini');
        geminiSession.setUserAgent(chromeUA);

        // Clear potential Google rejection cookies on startup so user is not stuck
        geminiSession.cookies.remove('https://accounts.google.com', '__Host-GAPS').catch(() => { });
        geminiSession.cookies.remove('https://accounts.google.com', 'GAPS').catch(() => { });

        // Rewrite headers for Google auth endpoints to use Firefox UA and strip Chromium Client Hints
        geminiSession.webRequest.onBeforeSendHeaders((details, callback) => {
            const isGoogleAuth = details.url.includes('accounts.google.') || details.url.includes('accounts.youtube.');
            if (isGoogleAuth) {
                details.requestHeaders['User-Agent'] = firefoxUA;
                delete details.requestHeaders['Sec-CH-UA'];
                delete details.requestHeaders['Sec-CH-UA-Mobile'];
                delete details.requestHeaders['Sec-CH-UA-Platform'];
                delete details.requestHeaders['sec-ch-ua'];
                delete details.requestHeaders['sec-ch-ua-mobile'];
                delete details.requestHeaders['sec-ch-ua-platform'];
            }
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        });

        this.view = new BrowserView({
            webPreferences: {
                partition: 'persist:gemini',
                devTools: IS_DEV,
                nodeIntegration: false,
                contextIsolation: true,
                spellcheck: true
            }
        })

        // Set User Agent properly on the session
        this.view.webContents.setUserAgent(chromeUA);

        // Automatically grant media (microphone) and notification permissions
        this.view.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
            if (permission === 'media' || permission === 'notifications') {
                callback(true);
            } else {
                callback(true);
            }
        });

        this.view.webContents.session.setPermissionCheckHandler((_webContents, _permission) => {
            return true;
        });

        this.view.webContents.on('did-finish-load', () => {
            // Use ScriptInjector to inject all scripts
            this.scriptInjector.setView(this.view!);
            this.scriptInjector.injectAllScripts().then(() => {
                console.log('[GeminiTray] All scripts injected successfully');
            }).catch(err => console.error('Failed to inject scripts:', err));
        });

        if (IS_DEV) {
            this.view.webContents.on('console-message', (_event, level, message, line, sourceId) => {
                const logMsg = `[Gemini Console] [${level}] ${message} (${sourceId}:${line})`;
                console.log(logMsg);
                try {
                    fs.appendFileSync(path.join(DEBUG_DIR, 'console.log'), `[${new Date().toISOString()}] ${logMsg}\n`);
                } catch (e) { }
            });
        }

        this.win.setBrowserView(this.view)

        // Open DevTools automatically when OPEN_DEVTOOLS is set
        if (OPEN_DEVTOOLS) {
            this.view.webContents.openDevTools({ mode: 'detach' })
            // Bring DevTools to front after a short delay
            setTimeout(() => {
                const devTools = BrowserWindow.getAllWindows().find(w => 
                    w.webContents.getURL().includes('devtools')
                )
                if (devTools) {
                    devTools.show()
                    devTools.focus()
                }
            }, 1000)
        }
    }

    updateViewBounds() {
        if (this.win && this.view) {
            const bounds = this.win.getBounds()
            this.view.setBounds({ x: 0, y: 40, width: bounds.width, height: bounds.height - 40 })
        }
    }

    toggleWindowVisibility() {
        if (this.win) {
            if (this.win.isVisible()) {
                if (this.win.isFocused()) {
                    this.cancelDictation();
                    this.win.hide();
                } else {
                    this.win.show();
                    this.win.focus();
                }
            } else {
                this.win.show();
                this.win.focus();
            }
        }
    }

    async handleNewChat() {
        if (this.win) {
            if (!this.win.isVisible()) {
                this.win.show();
            }
            if (!this.win.isFocused()) {
                this.win.focus();
            }
        }

        if (this.view) {
            try {
                console.log('[GeminiTray] Reloading Gemini for new chat');
                this.view.webContents.loadURL('https://gemini.google.com/app');
                
                // The 'did-finish-load' event in createBrowserView will 
                // automatically trigger selectDefaultModel() once it's loaded.
            } catch (e) {
                console.error('Failed to start new chat via reload:', e);
            }
        }
    }

    async handleVoiceInput() {
        if (this.win) {
            if (!this.win.isVisible()) {
                this.win.show();
            }
            if (!this.win.isFocused()) {
                this.win.focus();
            }
        }

        if (this.view) {
            try {
                console.log('[GeminiTray] Activating voice input in Gemini view');
                await this.view.webContents.executeJavaScript(`
                    if (window.__GEMINI_TRAY_ACTIVATE_VOICE) {
                        window.__GEMINI_TRAY_ACTIVATE_VOICE();
                    } else {
                        console.warn('[GeminiTray] window.__GEMINI_TRAY_ACTIVATE_VOICE not available yet');
                    }
                `);
            } catch (e) {
                console.error('Failed to trigger voice input:', e);
            }
        }
    }

    async handleDictation() {
        if (this.isDictating) {
            console.log('[GeminiTray] Dictation already active, requesting stop...');
            if (this.view) {
                try {
                    await this.view.webContents.executeJavaScript(`
                        if (window.__GEMINI_TRAY_STOP_DICTATION) {
                            window.__GEMINI_TRAY_STOP_DICTATION();
                        }
                    `);
                } catch (e) {
                    console.error('Failed to trigger stop dictation:', e);
                }
            }
            return;
        }

        if (this.win) {
            if (!this.win.isVisible()) {
                this.win.show();
            }
            if (!this.win.isFocused()) {
                this.win.focus();
            }
        }

        if (!this.view) return;

        this.isDictating = true;
        try {
            console.log('[GeminiTray] Starting dictation (speech-to-clipboard)...');
            const text = await this.view.webContents.executeJavaScript(`
                (function() {
                    if (window.__GEMINI_TRAY_START_DICTATION) {
                        return window.__GEMINI_TRAY_START_DICTATION();
                    } else {
                        console.warn('[GeminiTray] window.__GEMINI_TRAY_START_DICTATION not available');
                        return null;
                    }
                })()
            `);

            console.log('[GeminiTray] Dictation returned:', text);
            if (typeof text === 'string' && text.trim().length > 0) {
                clipboard.writeText(text.trim());
                if (this.win?.isVisible()) {
                    this.win.hide();
                }
                this.win?.webContents.send('show-toast', 'Transkript in Zwischenablage kopiert!', 'success');
            } else if (text !== null) {
                if (this.win?.isVisible()) {
                    this.win.hide();
                }
            }
        } catch (e) {
            console.error('Failed to run dictation:', e);
        } finally {
            this.isDictating = false;
        }
    }

    cancelDictation() {
        if (this.isDictating && this.view) {
            this.isDictating = false;
            this.view.webContents.executeJavaScript(`
                if (window.__GEMINI_TRAY_CANCEL_DICTATION) {
                    window.__GEMINI_TRAY_CANCEL_DICTATION();
                }
            `).catch(() => {});
        }
    }

    async selectDefaultModel() {
        if (!this.view) return;

        // Check if auto-select is enabled
        const autoSelectModel = store.get('autoSelectModel') ?? false;
        if (!autoSelectModel) {
            console.log('[GeminiTray] Auto-select model is disabled');
            return;
        }

        const defaultModel = store.get('defaultModel') || 'fast';
        console.log(`[GeminiTray] Selecting default model: ${defaultModel}`);

        try {
            await this.view.webContents.executeJavaScript(`
                (function selectModel() {
                    const modelName = '${defaultModel}';
                    console.log('[GeminiTray] Attempting to select model:', modelName);
                    
                    // Map internal model names to data-test-id attributes (most reliable!)
                    const modelConfig = {
                        'fast': {
                            testId: 'bard-mode-option-fast',
                            titleText: 'Fast'
                        },
                        'thinking': {
                            testId: 'bard-mode-option-thinking-modus',
                            titleText: 'Thinking-Modus'
                        },
                        'pro': {
                            testId: 'bard-mode-option-pro',
                            titleText: 'Pro'
                        }
                    };
                    
                    const targetModel = modelConfig[modelName];
                    if (!targetModel) {
                        console.log('[GeminiTray] Unknown model name:', modelName);
                        return;
                    }
                    
                    // First, check if the desired model is already selected
                    // Look for the checkmark icon in the target model's option
                    const alreadySelectedButton = document.querySelector('[data-test-id="' + targetModel.testId + '"]');
                    if (alreadySelectedButton) {
                        const checkmark = alreadySelectedButton.querySelector('.mode-check, mat-icon[data-mat-icon-name="check_circle"]');
                        if (checkmark) {
                            console.log('[GeminiTray] Model already selected:', targetModel.titleText);
                            return; // Model is already selected, nothing to do
                        }
                    }
                    
                    // Find the model selector button using specific selectors
                    const modelSelectors = [
                        '[data-test-id="bard-mode-menu-button"]',
                        '[data-test-id="model-selector"]',
                        '[aria-label*="Modus" i]',
                        '[aria-label*="Mode" i]',
                        'button[aria-haspopup="listbox"]',
                        '.model-picker-container button',
                        '[class*="model-picker"] button',
                        'bard-mode-switcher button'
                    ];
                    
                    let modelButton = null;
                    for (const selector of modelSelectors) {
                        try {
                            const el = document.querySelector(selector);
                            if (el) {
                                modelButton = el;
                                console.log('[GeminiTray] Found model selector:', selector);
                                break;
                            }
                        } catch (e) {}
                    }
                    
                    // If no specific selector found, try to find by text content
                    if (!modelButton) {
                        const allButtons = document.querySelectorAll('button');
                        for (const btn of allButtons) {
                            const text = btn.textContent || '';
                            const ariaLabel = btn.getAttribute('aria-label') || '';
                            // Look for any model-related text or dropdown indicator
                            if (text.includes('Fast') || text.includes('Flash') || text.includes('Pro') || 
                                text.includes('Thinking') || text.includes('Modus') || text.includes('Mode') ||
                                ariaLabel.includes('Modus') || ariaLabel.includes('Mode') ||
                                btn.querySelector('mat-icon[data-mat-icon-name="keyboard_arrow_down"]')) {
                                modelButton = btn;
                                console.log('[GeminiTray] Found model button by text/content:', text, ariaLabel);
                                break;
                            }
                        }
                    }
                    
                    if (modelButton) {
                        // Click to open the dropdown
                        modelButton.click();
                        console.log('[GeminiTray] Clicked model selector button');
                        
                        // Wait a bit for the dropdown to open
                        setTimeout(() => {
                            // Use the specific data-test-id to find the model option
                            const testId = targetModel.testId;
                            console.log('[GeminiTray] Looking for model option with test-id:', testId);
                            
                            // Try to find by data-test-id first (most reliable)
                            const targetButton = document.querySelector('[data-test-id="' + testId + '"]');
                            
                            if (targetButton) {
                                console.log('[GeminiTray] Found model option by test-id, clicking:', testId);
                                targetButton.click();
                                return;
                            }
                            
                            // Fallback: search by title text
                            console.log('[GeminiTray] Could not find by test-id, searching by title:', targetModel.titleText);
                            const buttons = document.querySelectorAll('button[role="menuitem"]');
                            
                            for (const btn of buttons) {
                                const titleEl = btn.querySelector('.gds-title-m');
                                if (titleEl && titleEl.textContent.trim().includes(targetModel.titleText)) {
                                    console.log('[GeminiTray] Found model option by title, clicking:', titleEl.textContent);
                                    btn.click();
                                    return;
                                }
                            }
                            
                            console.log('[GeminiTray] Could not find model option for:', modelName);
                            // Log all available options for debugging
                            const allOptions = document.querySelectorAll('button[role="menuitem"]');
                            console.log('[GeminiTray] Available options:');
                            allOptions.forEach((opt, i) => {
                                const title = opt.querySelector('.gds-title-m');
                                if (i < 10) console.log('  -', title?.textContent || opt.textContent?.substring(0, 100));
                            });
                        }, 400);
                    } else {
                        console.log('[GeminiTray] Could not find model selector button');
                    }
                })();
            `);
        } catch (error) {
            console.error('[GeminiTray] Failed to select default model:', error);
        }
    }

    async takeScreenshot() {
        try {
            const wasVisible = this.win?.isVisible();
            if (wasVisible) this.win?.hide();
            await new Promise(resolve => setTimeout(resolve, 200));

            const primaryDisplay = screen.getPrimaryDisplay();
            const { width, height } = primaryDisplay.size;
            const scaleFactor = primaryDisplay.scaleFactor;

            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: { width: width * scaleFactor, height: height * scaleFactor }
            });

            if (sources.length > 0) {
                this.fullScreenshot = sources[0].thumbnail;
                this.openSelectionWindow();
            } else {
                if (wasVisible) this.win?.show();
            }
        } catch (error) {
            console.error('Screenshot failed:', error);
            this.win?.show();
        }
    }

    openSelectionWindow() {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.bounds;

        this.selectionWindow = new BrowserWindow({
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

        this.selectionWindow.loadFile(path.join(this.__dirname, 'screenshot-selection.html'));
        this.selectionWindow.setAlwaysOnTop(true, 'screen-saver');

        this.selectionWindow.on('closed', () => {
            this.selectionWindow = null;
        });
    }
}
