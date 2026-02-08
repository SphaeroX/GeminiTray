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
            this.view?.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT).catch(err => console.error('Failed to inject prompt script:', err));
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
            } catch (e) {
                console.error('Failed to trigger new chat:', e);
            }
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
