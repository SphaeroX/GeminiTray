import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (event: any, ...args: any[]) => void) {
    ipcRenderer.on(channel, listener)
  },
  off(channel: string, listener: (event: any, ...args: any[]) => void) {
    ipcRenderer.off(channel, listener)
  },
  send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args)
  },
  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args)
  },
  // Keep these for backward compatibility if needed, but they still have the leak issue if called multiple times
  onScreenshotTaken(callback: (path: string) => void) {
    ipcRenderer.on('screenshot-taken', (_event, path) => callback(path))
  },
  onUpdateAvailable(callback: (info: unknown) => void) {
    ipcRenderer.on('update-available', (_event, info) => callback(info))
  },
  onUpdateDownloaded(callback: (info: unknown) => void) {
    ipcRenderer.on('update-downloaded', (_event, info) => callback(info))
  },
  onShowToast(callback: (message: string, type: 'info' | 'success' | 'error') => void) {
    ipcRenderer.on('show-toast', (_event, message, type) => callback(message, type))
  }
})
