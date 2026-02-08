import Store from 'electron-store'
import { IS_DEV } from './constants'

// Define the store schema
export interface StoreSchema {
    opacity: number;
    globalShortcut: string;
    screenshotShortcut: string;
    openAtLogin: boolean;
    openAsHidden: boolean;
    alwaysOnTop: boolean;
    newChatShortcut: string;
    promptMenuShortcut: string;
    prompts: Array<{ id: string; name: string; content: string }>;
    defaultModel: 'fast' | 'thinking' | 'pro';
}

export const store = new Store<StoreSchema>({
    name: IS_DEV ? 'config-dev' : 'config',
    defaults: {
        opacity: 0.95,
        globalShortcut: 'Alt+Space',
        screenshotShortcut: 'Alt+Shift+S',
        openAtLogin: false,
        openAsHidden: true,
        alwaysOnTop: true,
        newChatShortcut: 'Alt+N',
        promptMenuShortcut: 'Alt+J',
        prompts: [],
        defaultModel: 'fast'
    }
});
