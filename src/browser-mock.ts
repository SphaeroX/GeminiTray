// Mock for Electron's ipcRenderer when running in a standard browser
// This file is injected in src/main.ts before the app is mounted

const mockStore: Record<string, any> = {};

// Default settings fallback
const DEFAULT_SETTINGS = {
    opacity: 0.95,
    globalShortcut: 'Ctrl+Shift+Space',
    screenshotShortcut: 'Ctrl+Shift+S',
    openAtLogin: false,
    openAsHidden: true,
    alwaysOnTop: false,
    newChatShortcut: 'Ctrl+Shift+N',
    promptMenuShortcut: 'Alt+P',
    prompts: [],
    defaultModel: 'fast',
    autoSelectModel: false
};

const getStorageSettings = () => {
    try {
        const data = localStorage.getItem('gemini-tray-settings');
        return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
};

const saveStorageSettings = (newSettings: any) => {
    try {
        localStorage.setItem('gemini-tray-settings', JSON.stringify(newSettings));
    } catch (e) {
        console.error('Save error', e);
    }
}

if (!window.ipcRenderer) {
    console.warn('[Browser Mock] Electron ipcRenderer not found. Initializing mock mode for browser debugging.');

    const listeners: Record<string, ((event: any, ...args: any[]) => void)[]> = {};

    window.ipcRenderer = {
        send: (channel: string, ...args: any[]) => {
            console.log(`[Browser Mock] send: ${channel}`, args);
            // Mock storing of settings directly to localStorage
            const settings = getStorageSettings();

            if (channel === 'set-opacity') settings.opacity = args[0];
            if (channel === 'set-autostart') {
                settings.openAtLogin = args[0].openAtLogin;
                settings.openAsHidden = args[0].openAsHidden;
            }
            if (channel === 'set-always-on-top') settings.alwaysOnTop = args[0];
            if (channel === 'save-prompts') settings.prompts = args[0];
            if (channel === 'set-default-model') settings.defaultModel = args[0];
            if (channel === 'set-auto-select-model') settings.autoSelectModel = args[0];

            saveStorageSettings(settings);

            // Simulate IPC responses if necessary
            if (channel === 'start-shortcut-recording') {
                console.log("[Browser Mock] Recording shortcuts... (Press keys manually to simulate response or inject events)")
            }
            if (channel === 'stop-shortcut-recording') {
                console.log("[Browser Mock] Stop recording shortcut.")
            }
        },
        invoke: async (channel: string, ...args: any[]) => {
            console.log(`[Browser Mock] invoke: ${channel}`, args);

            const settings = getStorageSettings();

            if (channel === 'get-settings') {
                return settings;
            }
            if (channel === 'set-global-shortcut') {
                settings.globalShortcut = args[0];
                saveStorageSettings(settings);
                return true;
            }
            if (channel === 'set-screenshot-shortcut') {
                settings.screenshotShortcut = args[0];
                saveStorageSettings(settings);
                return true;
            }
            if (channel === 'set-new-chat-shortcut') {
                settings.newChatShortcut = args[0];
                saveStorageSettings(settings);
                return true;
            }
            if (channel === 'set-prompt-menu-shortcut') {
                settings.promptMenuShortcut = args[0];
                saveStorageSettings(settings);
                return true;
            }
            if (channel === 'reset-session') {
                console.log("[Browser Mock] Session reset simulated.");
                return true;
            }

            return null;
        },
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
            if (!listeners[channel]) listeners[channel] = [];
            listeners[channel].push(listener);
            console.log(`[Browser Mock] Registered listener for: ${channel}`);
        },
        off: (channel: string, listener: (...args: any[]) => void) => {
            if (!listeners[channel]) return;
            listeners[channel] = listeners[channel].filter(l => l !== listener);
            console.log(`[Browser Mock] Removed listener for: ${channel}`);
        },
        onScreenshotTaken: (callback: (path: string) => void) => {
            console.log(`[Browser Mock] mock onScreenshotTaken`);
        },
        onUpdateAvailable: (callback: (info: any) => void) => {
            console.log(`[Browser Mock] mock onUpdateAvailable`);
        },
        onUpdateDownloaded: (callback: (info: any) => void) => {
            console.log(`[Browser Mock] mock onUpdateDownloaded`);
        },
        onShowToast: (callback: (message: string, type: 'info' | 'success' | 'error') => void) => {
            console.log(`[Browser Mock] mock onShowToast`);
        }
    };

    // Attach a helper to window to simulate main process sending events
    (window as any).simulateMainProcessEvent = (channel: string, ...args: any[]) => {
        if (listeners[channel]) {
            listeners[channel].forEach(listener => listener({}, ...args));
        }
    };
}
