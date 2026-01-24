/// <reference types="vite/client" />
/// <reference types="electron-vite/node" />

interface Window {
    ipcRenderer: {
        send(channel: string, ...args: unknown[]): void
        on(channel: string, listener: (event: unknown, ...args: unknown[]) => void): void
        off(channel: string, listener: (...args: unknown[]) => void): void
        invoke(channel: string, ...args: unknown[]): Promise<unknown>
        onScreenshotTaken(callback: (path: string) => void): void
        onUpdateAvailable(callback: (info: unknown) => void): void
        onUpdateDownloaded(callback: (info: unknown) => void): void
    }
}
