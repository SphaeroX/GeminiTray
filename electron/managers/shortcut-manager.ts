import { globalShortcut } from 'electron'
import { store } from '../utils/store'
import { WindowManager } from './window-manager'

export type ConfigurableShortcut = 
    | 'globalShortcut' 
    | 'screenshotShortcut' 
    | 'newChatShortcut' 
    | 'voiceShortcut' 
    | 'promptMenuShortcut';

export interface ShortcutResult {
    success: boolean;
    error?: string;
}

export class ShortcutManager {
    private windowManager: WindowManager
    private isRecordingShortcut = false

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
    }

    public isRecording(): boolean {
        return this.isRecordingShortcut;
    }

    private getShortcutLabel(type: ConfigurableShortcut): string {
        switch (type) {
            case 'globalShortcut': return 'Toggle Visibility';
            case 'screenshotShortcut': return 'Screenshot & Ask';
            case 'newChatShortcut': return 'New Chat';
            case 'voiceShortcut': return 'Voice Input';
            case 'promptMenuShortcut': return 'Prompts Menu';
            default: return type;
        }
    }

    // Handle prompt shortcuts (Alt+1 to Alt+9)
    private handlePromptShortcut = (index: number) => {
        if (this.windowManager.win) {
            if (!this.windowManager.win.isVisible()) {
                this.windowManager.win.show();
                this.windowManager.win.focus();
            }
            // Send event to renderer to select prompt by index
            this.windowManager.win.webContents.send('select-prompt-by-index', index);
        }
    };

    registerGlobalShortcuts() {
        if (this.isRecordingShortcut) return;

        globalShortcut.unregisterAll();

        const handlers: Record<ConfigurableShortcut, () => void> = {
            globalShortcut: () => this.windowManager.toggleWindowVisibility(),
            screenshotShortcut: () => this.windowManager.takeScreenshot(),
            newChatShortcut: () => this.windowManager.handleNewChat(),
            voiceShortcut: () => this.windowManager.handleVoiceInput(),
            promptMenuShortcut: () => {
                if (this.windowManager.win) {
                    if (!this.windowManager.win.isVisible()) {
                        this.windowManager.win.show();
                        this.windowManager.win.focus();
                    }
                    this.windowManager.win.webContents.send('toggle-prompt-menu');
                }
            }
        };

        const keys: ConfigurableShortcut[] = [
            'globalShortcut',
            'screenshotShortcut',
            'newChatShortcut',
            'voiceShortcut',
            'promptMenuShortcut'
        ];

        for (const key of keys) {
            const accelerator = store.get(key);
            if (accelerator && accelerator.trim()) {
                try {
                    const ok = globalShortcut.register(accelerator, handlers[key]);
                    if (!ok) {
                        console.warn(`[ShortcutManager] Failed to register global shortcut ${key}: "${accelerator}" (already in use)`);
                    }
                } catch (err) {
                    console.error(`[ShortcutManager] Error registering global shortcut ${key}: "${accelerator}":`, err);
                }
            }
        }

        // Register prompt shortcuts (Alt+1 to Alt+9)
        for (let i = 1; i <= 9; i++) {
            const shortcut = `Alt+${i}`;
            try {
                globalShortcut.register(shortcut, () => this.handlePromptShortcut(i));
            } catch (e) {
                console.error(`[ShortcutManager] Failed to register prompt shortcut ${shortcut}:`, e);
            }
        }
    }

    setShortcut(type: ConfigurableShortcut, accelerator: string): ShortcutResult {
        if (!accelerator || !accelerator.trim()) {
            return { success: false, error: 'Shortcut cannot be empty' };
        }

        const normalized = accelerator.trim();

        // Check if reserved prompt shortcut (Alt+1 to Alt+9)
        if (/^Alt\+[1-9]$/i.test(normalized)) {
            return { success: false, error: `Shortcut "${normalized}" is reserved for quick prompts (Alt+1 to Alt+9)` };
        }

        // Check collision with other configurable shortcuts in store
        const keys: ConfigurableShortcut[] = [
            'globalShortcut',
            'screenshotShortcut',
            'newChatShortcut',
            'voiceShortcut',
            'promptMenuShortcut'
        ];

        for (const otherKey of keys) {
            if (otherKey !== type) {
                const otherVal = store.get(otherKey);
                if (otherVal && otherVal.toLowerCase() === normalized.toLowerCase()) {
                    const label = this.getShortcutLabel(otherKey);
                    return { success: false, error: `Shortcut "${normalized}" is already assigned to "${label}"` };
                }
            }
        }

        // Test if Electron can register this accelerator
        try {
            const wasRecording = this.isRecordingShortcut;
            this.isRecordingShortcut = true;
            globalShortcut.unregisterAll();

            const canRegister = globalShortcut.register(normalized, () => {});
            if (canRegister) {
                globalShortcut.unregister(normalized);
            }

            this.isRecordingShortcut = wasRecording;

            if (!canRegister) {
                if (!wasRecording) {
                    this.registerGlobalShortcuts();
                }
                return { success: false, error: `Shortcut "${normalized}" could not be registered (may be in use by another program)` };
            }
        } catch (e) {
            if (!this.isRecordingShortcut) {
                this.registerGlobalShortcuts();
            }
            return { success: false, error: `Invalid shortcut format: "${normalized}"` };
        }

        // Persist directly to store
        store.set(type, normalized);

        // If not recording, re-register all shortcuts immediately
        if (!this.isRecordingShortcut) {
            this.registerGlobalShortcuts();
        }

        return { success: true };
    }

    // Convenience methods matching previous API
    setGlobalShortcut(shortcut: string): boolean {
        return this.setShortcut('globalShortcut', shortcut).success;
    }

    setScreenshotShortcut(shortcut: string): boolean {
        return this.setShortcut('screenshotShortcut', shortcut).success;
    }

    setNewChatShortcut(shortcut: string): boolean {
        return this.setShortcut('newChatShortcut', shortcut).success;
    }

    setVoiceShortcut(shortcut: string): boolean {
        return this.setShortcut('voiceShortcut', shortcut).success;
    }

    setPromptMenuShortcut(shortcut: string): boolean {
        return this.setShortcut('promptMenuShortcut', shortcut).success;
    }

    startRecording() {
        if (this.isRecordingShortcut) return;
        this.isRecordingShortcut = true;
        // Release all global shortcuts so keystrokes reach renderer
        globalShortcut.unregisterAll();
    }

    stopRecording() {
        if (!this.isRecordingShortcut) return;
        this.isRecordingShortcut = false;
        // Re-register all shortcuts from store
        this.registerGlobalShortcuts();
    }

    unregisterAll() {
        globalShortcut.unregisterAll();
    }

    // Get prompts from store for shortcut handling
    getPrompts(): Array<{ id: string; name: string; content: string }> {
        return store.get('prompts') || [];
    }
}
