import { BrowserWindow, BrowserView, shell, screen, desktopCapturer } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { store } from '../utils/store'
import { IS_DEV, OPEN_DEVTOOLS, PROMPT_INJECTION_PATH, VITE_DEV_SERVER_URL, RENDERER_DIST, VITE_PUBLIC, DEBUG_DIR } from '../utils/constants'

// Load prompt injection script once
let PROMPT_INJECTION_SCRIPT = '';
try {
    PROMPT_INJECTION_SCRIPT = fs.readFileSync(PROMPT_INJECTION_PATH, 'utf-8');
} catch (e) {
    console.error('Failed to load prompt injection script:', e);
}

// Script to auto-select default model when new chat is created
const MODEL_SELECTOR_SCRIPT = `
(function initModelSelector() {
    console.log('[GeminiTray] Model selector script initialized');
    
    // Map internal model names to display texts (multilingual)
    const modelTextMap = {
        'fast': {
            texts: ['Fast', 'Flash', '1.5 Flash', '2.0 Flash', 'Gemini 2.0 Flash']
        },
        'thinking': {
            texts: ['Thinking', 'Thinking-Modus', 'Flash Thinking', '2.0 Flash Thinking', 'Gemini 2.0 Flash Thinking']
        },
        'pro': {
            texts: ['Pro', '1.5 Pro', '2.0 Pro', 'Pro Experimental', 'Gemini 2.0 Pro']
        }
    };
    
    let lastUrl = location.href;
    let isProcessing = false;
    
    function getDefaultModel() {
        // Try to get from window object (set by main process) or default to fast
        return window.__GEMINI_TRAY_DEFAULT_MODEL || 'fast';
    }
    
    function selectModel() {
        if (isProcessing) return;
        
        // Check if auto-select is enabled
        if (window.__GEMINI_TRAY_AUTO_SELECT === false) {
            console.log('[GeminiTray] Auto-select is disabled');
            return;
        }
        
        isProcessing = true;
        
        const modelName = getDefaultModel();
        console.log('[GeminiTray] Auto-selecting model:', modelName);
        
        const modelConfig = modelTextMap[modelName];
        if (!modelConfig) {
            isProcessing = false;
            return;
        }
        
        // Check if model is already selected
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.textContent || '';
            for (const searchText of modelConfig.texts.slice(0, 2)) {
                if (text.includes(searchText)) {
                    console.log('[GeminiTray] Model already selected:', text);
                    isProcessing = false;
                    return;
                }
            }
        }
        
        // Find model selector button
        const modelSelectors = [
            '[data-test-id="bard-mode-menu-button"]',
            '[data-test-id="model-selector"]',
            '[aria-label*="Modus" i]',
            '[aria-label*="Mode" i]',
            'button[aria-haspopup="listbox"]',
            '.model-picker-container button',
            'bard-mode-switcher button'
        ];
        
        let modelButton = null;
        for (const selector of modelSelectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    modelButton = el;
                    break;
                }
            } catch (e) {}
        }
        
        if (!modelButton) {
            // Fallback: search by text content
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
                const text = btn.textContent || '';
                const ariaLabel = btn.getAttribute('aria-label') || '';
                if (text.includes('Fast') || text.includes('Flash') || text.includes('Pro') || 
                    text.includes('Thinking') || text.includes('Modus') || text.includes('Mode') ||
                    ariaLabel.includes('Modus') || ariaLabel.includes('Mode')) {
                    modelButton = btn;
                    break;
                }
            }
        }
        
        if (modelButton) {
            modelButton.click();
            console.log('[GeminiTray] Clicked model selector');
            
            setTimeout(() => {
                const targetTexts = modelConfig.texts;
                let found = false;
                
                const optionSelectors = [
                    '[role="option"]',
                    '[role="menuitem"]',
                    'mat-option',
                    'li',
                    'button',
                    '.model-option',
                    '[class*="mode-"]'
                ];
                
                for (const selector of optionSelectors) {
                    const options = document.querySelectorAll(selector);
                    for (const option of options) {
                        const text = option.textContent || '';
                        const ariaLabel = option.getAttribute('aria-label') || '';
                        
                        for (const targetText of targetTexts) {
                            if (text.includes(targetText) || ariaLabel.includes(targetText)) {
                                console.log('[GeminiTray] Clicking model option:', text);
                                option.click();
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }
                    if (found) break;
                }
                
                if (!found) {
                    console.log('[GeminiTray] Could not find model option');
                }
                isProcessing = false;
            }, 400);
        } else {
            console.log('[GeminiTray] Could not find model selector button');
            isProcessing = false;
        }
    }
    
    // Listen for URL changes (indicates new chat)
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[GeminiTray] URL changed, checking model selection');
            setTimeout(selectModel, 500);
        }
    });
    
    observer.observe(document, { subtree: true, childList: true });
    
    // Also check on initial load
    setTimeout(selectModel, 1000);
    
    // Listen for custom event from main process
    window.addEventListener('gemini-tray-select-model', () => {
        setTimeout(selectModel, 100);
    });
})();
`;

export class WindowManager {
    public win: BrowserWindow | null = null
    public view: BrowserView | null = null
    public selectionWindow: BrowserWindow | null = null
    public fullScreenshot: Electron.NativeImage | null = null
    private __dirname: string

    public isQuitting = false

    constructor(dirname: string) {
        this.__dirname = dirname
    }

    setQuitting(quitting: boolean) {
        this.isQuitting = quitting
    }

    createWindow() {
        const opacity = store.get('opacity');
        this.win = new BrowserWindow({
            icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
            width: 500,
            height: 650,
            minWidth: 400,
            minHeight: 300,
            frame: false,
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#00000000',
                symbolColor: '#ffffff',
                height: 40
            },
            opacity: opacity,
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(this.__dirname, 'preload.mjs'),
                partition: 'persist:gemini'
            },
        })

        const alwaysOnTop = store.get('alwaysOnTop');
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
        this.win.on('maximize', () => this.updateViewBounds())
        this.win.on('unmaximize', () => this.updateViewBounds())

        // Handle external links
        this.view!.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url)
            return { action: 'deny' }
        })

        this.view!.webContents.on('will-navigate', (event, url) => {
            if (url.startsWith('https://gemini.google.com') || url.startsWith('https://accounts.google.com')) {
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
            // Check process.argv for --hidden is a bit hacky here but acceptable for now
            // or we can pass it in constructor.
        })
    }

    createBrowserView() {
        if (!this.win) return

        const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

        this.view = new BrowserView({
            webPreferences: {
                partition: 'persist:gemini',
                devTools: IS_DEV,
                // @ts-ignore
                userAgent: userAgent
            }
        })

        this.view.webContents.on('did-start-loading', () => {
            this.view?.webContents.executeJavaScript(`
                const newProto = navigator.__proto__;
                delete newProto.webdriver;
                navigator.__proto__ = newProto;
            `).catch(() => { });
        });

        this.view.webContents.on('did-finish-load', () => {
            // Inject prompt handling script
            this.view?.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT).catch(err => console.error('Failed to inject prompt script:', err));
            
            // Inject model selector script with current settings
            const defaultModel = store.get('defaultModel') || 'fast';
            const autoSelectModel = store.get('autoSelectModel') ?? false;
            
            if (autoSelectModel) {
                const modelScriptWithConfig = MODEL_SELECTOR_SCRIPT
                    .replace("window.__GEMINI_TRAY_DEFAULT_MODEL || 'fast'", `'${defaultModel}'`)
                    .replace("window.__GEMINI_TRAY_AUTO_SELECT !== false", 'true');
                this.view?.webContents.executeJavaScript(modelScriptWithConfig).catch(err => console.error('Failed to inject model selector script:', err));
                
                // Also trigger model selection from main process side
                setTimeout(() => this.selectDefaultModel(), 1500);
            }
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
                this.view.webContents.focus();
                await new Promise(resolve => setTimeout(resolve, 100));
                this.view.webContents.sendInputEvent({
                    type: 'keyDown',
                    keyCode: 'O',
                    modifiers: ['control', 'shift']
                });
                this.view.webContents.sendInputEvent({
                    type: 'keyUp',
                    keyCode: 'O',
                    modifiers: ['control', 'shift']
                });
                console.log('[GeminiTray] Sent Ctrl+Shift+O shortcut for new chat');

                // Wait for the new chat to load, then select the default model
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.selectDefaultModel();
            } catch (e) {
                console.error('Failed to trigger new chat:', e);
            }
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
