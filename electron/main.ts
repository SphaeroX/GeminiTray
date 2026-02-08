import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { WindowManager } from './managers/window-manager'
import { TrayManager } from './managers/tray-manager'
import { ShortcutManager } from './managers/shortcut-manager'
import { registerIpcHandlers } from './managers/ipc-manager'
import { VITE_DEV_SERVER_URL } from './utils/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Fix for Google Login "This browser or app may not be secure"
app.commandLine.appendSwitch('disable-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-site-isolation-trials');
// Allow third-party/partitioned cookies used by Google Sign-In (from GeminiDesk)
app.commandLine.appendSwitch('enable-features', 'ThirdPartyStoragePartitioning');

// Disable hardware acceleration to match GeminiDesk (stealth/stability)
app.disableHardwareAcceleration();


const windowManager = new WindowManager(__dirname)
const trayManager = new TrayManager(windowManager)
const shortcutManager = new ShortcutManager(windowManager)

function setupAutoUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info: unknown) => {
    windowManager.win?.webContents.send('update-available', info);
  });

  autoUpdater.on('update-downloaded', (info: unknown) => {
    windowManager.win?.webContents.send('update-downloaded', info);
  });

  autoUpdater.on('error', (error: Error) => {
    console.error('Auto-updater error:', error);
  });

  // Check for updates after app starts (only in production)
  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdates().catch(console.error);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    windowManager.win = null
    windowManager.view = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.createWindow()
  }
})

app.on('before-quit', () => {
  windowManager.setQuitting(true)
})

app.on('will-quit', () => {
  shortcutManager.unregisterAll()
})

app.whenReady().then(() => {
  windowManager.createWindow()
  trayManager.createTray()
  setupAutoUpdater()
  registerIpcHandlers(windowManager, shortcutManager)
  shortcutManager.registerGlobalShortcuts()
})
