import { globalShortcut } from 'electron'
import { store } from '../utils/store'
import { WindowManager } from './window-manager'

export class ShortcutManager {
    private windowManager: WindowManager
    private isRecordingShortcut = false
    private shortcutRecordingCallback: ((shortcut: string) => void) | null = null

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
    }

    private handleAltSpace = () => {
        if (this.isRecordingShortcut && this.shortcutRecordingCallback) {
            this.shortcutRecordingCallback('Alt+Space');
        } else {
            this.windowManager.toggleWindowVisibility();
        }
    };

    private ensureAltSpaceRegistered() {
        if (!globalShortcut.isRegistered('Alt+Space')) {
            try {
                globalShortcut.register('Alt+Space', this.handleAltSpace);
            } catch (e) {
                console.error('Failed to register Alt+Space:', e);
            }
        }
    }

    registerGlobalShortcuts() {
        // Register initial shortcuts
        const initialShortcut = store.get('globalShortcut');
        if (initialShortcut === 'Alt+Space') {
            this.ensureAltSpaceRegistered();
        } else if (initialShortcut) {
            globalShortcut.register(initialShortcut, () => this.windowManager.toggleWindowVisibility());
        }

        const initialScreenshotShortcut = store.get('screenshotShortcut');
        if (initialScreenshotShortcut) {
            globalShortcut.register(initialScreenshotShortcut, () => this.windowManager.takeScreenshot());
        }

        const initialNewChatShortcut = store.get('newChatShortcut');
        if (initialNewChatShortcut) {
            globalShortcut.register(initialNewChatShortcut, () => this.windowManager.handleNewChat());
        }

        const initialPromptMenuShortcut = store.get('promptMenuShortcut');
        if (initialPromptMenuShortcut) {
            globalShortcut.register(initialPromptMenuShortcut, () => {
                if (this.windowManager.win) {
                    if (!this.windowManager.win.isVisible()) this.windowManager.win.show();
                    this.windowManager.win.webContents.send('toggle-prompt-menu');
                }
            });
        }
    }

    // Methods for IPC Handling
    setGlobalShortcut(shortcut: string): boolean {
        const oldShortcut = store.get('globalShortcut');

        if (oldShortcut && oldShortcut !== 'Alt+Space') {
            globalShortcut.unregister(oldShortcut);
        }

        try {
            let ret: boolean;

            if (shortcut === 'Alt+Space') {
                if (globalShortcut.isRegistered('Alt+Space')) {
                    ret = true;
                } else {
                    ret = globalShortcut.register('Alt+Space', this.handleAltSpace);
                }
            } else {
                if (oldShortcut === 'Alt+Space') {
                    try { globalShortcut.unregister('Alt+Space'); } catch (e) { /* ignore */ }
                }
                ret = globalShortcut.register(shortcut, () => this.windowManager.toggleWindowVisibility());
            }

            if (!ret) {
                if (oldShortcut === 'Alt+Space') {
                    this.ensureAltSpaceRegistered();
                } else if (oldShortcut) {
                    globalShortcut.register(oldShortcut, () => this.windowManager.toggleWindowVisibility());
                }
                return false;
            }

            store.set('globalShortcut', shortcut);
            return true;
        } catch (error) {
            console.error('Failed to register shortcut:', error);
            if (oldShortcut === 'Alt+Space') {
                this.ensureAltSpaceRegistered();
            } else if (oldShortcut) {
                globalShortcut.register(oldShortcut, () => this.windowManager.toggleWindowVisibility());
            }
            return false;
        }
    }

    setScreenshotShortcut(shortcut: string): boolean {
        const oldShortcut = store.get('screenshotShortcut');
        if (oldShortcut) {
            globalShortcut.unregister(oldShortcut);
        }

        try {
            const ret = globalShortcut.register(shortcut, () => {
                this.windowManager.takeScreenshot();
            });

            if (!ret) {
                if (oldShortcut) {
                    globalShortcut.register(oldShortcut, () => this.windowManager.takeScreenshot());
                }
                return false;
            }

            store.set('screenshotShortcut', shortcut);
            return true;
        } catch (error) {
            console.error('Failed to register screenshot shortcut:', error);
            if (oldShortcut) {
                globalShortcut.register(oldShortcut, () => this.windowManager.takeScreenshot());
            }
            return false;
        }
    }

    setNewChatShortcut(shortcut: string): boolean {
        const oldShortcut = store.get('newChatShortcut');
        if (oldShortcut) {
            globalShortcut.unregister(oldShortcut);
        }

        try {
            const ret = globalShortcut.register(shortcut, () => {
                this.windowManager.handleNewChat();
            });

            if (!ret) {
                if (oldShortcut) {
                    globalShortcut.register(oldShortcut, () => this.windowManager.handleNewChat());
                }
                return false;
            }

            store.set('newChatShortcut', shortcut);
            return true;
        } catch (error) {
            console.error('Failed to register new chat shortcut:', error);
            if (oldShortcut) {
                globalShortcut.register(oldShortcut, () => this.windowManager.handleNewChat());
            }
            return false;
        }
    }

    setPromptMenuShortcut(shortcut: string): boolean {
        const oldShortcut = store.get('promptMenuShortcut');
        if (oldShortcut) {
            globalShortcut.unregister(oldShortcut);
        }

        try {
            const ret = globalShortcut.register(shortcut, () => {
                if (this.windowManager.win) {
                    if (!this.windowManager.win.isVisible()) {
                        this.windowManager.win.show();
                        this.windowManager.win.focus();
                    }
                    this.windowManager.win.webContents.send('toggle-prompt-menu');
                }
            });

            if (!ret) {
                if (oldShortcut) {
                    globalShortcut.register(oldShortcut, () => {
                        if (this.windowManager.win) {
                            if (!this.windowManager.win.isVisible()) this.windowManager.win.show();
                            this.windowManager.win.webContents.send('toggle-prompt-menu');
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
                    if (this.windowManager.win) {
                        if (!this.windowManager.win.isVisible()) this.windowManager.win.show();
                        this.windowManager.win.webContents.send('toggle-prompt-menu');
                    }
                });
            }
            return false;
        }
    }

    startRecording() {
        if (this.isRecordingShortcut) return;
        this.isRecordingShortcut = true;

        this.shortcutRecordingCallback = (shortcut: string) => {
            this.windowManager.win?.webContents.send('shortcut-recorded', shortcut);
        };

        const currentGlobal = store.get('globalShortcut');
        const currentScreenshot = store.get('screenshotShortcut');

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

        this.ensureAltSpaceRegistered();
    }

    stopRecording() {
        if (!this.isRecordingShortcut) return;
        this.isRecordingShortcut = false;
        this.shortcutRecordingCallback = null;

        const currentGlobal = store.get('globalShortcut');
        const currentScreenshot = store.get('screenshotShortcut');
        const currentNewChat = store.get('newChatShortcut');
        const currentPromptMenu = store.get('promptMenuShortcut');

        if (currentGlobal === 'Alt+Space') {
            this.ensureAltSpaceRegistered();
        } else {
            try {
                globalShortcut.unregister('Alt+Space');
            } catch (e) { }

            if (currentGlobal) {
                globalShortcut.register(currentGlobal, () => this.windowManager.toggleWindowVisibility());
            }
        }

        if (currentScreenshot && currentScreenshot !== 'Alt+Space') {
            globalShortcut.register(currentScreenshot, () => this.windowManager.takeScreenshot());
        }

        if (currentNewChat && currentNewChat !== 'Alt+Space') {
            globalShortcut.register(currentNewChat, () => this.windowManager.handleNewChat());
        }

        if (currentPromptMenu && currentPromptMenu !== 'Alt+Space') {
            globalShortcut.register(currentPromptMenu, () => {
                if (this.windowManager.win) {
                    if (!this.windowManager.win.isVisible()) this.windowManager.win.show();
                    this.windowManager.win.webContents.send('toggle-prompt-menu');
                }
            });
        }
    }

    unregisterAll() {
        globalShortcut.unregisterAll();
    }
}
