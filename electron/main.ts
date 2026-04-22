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
// Essential for modern Google apps in Electron
app.commandLine.appendSwitch('enable-features', 'ThirdPartyStoragePartitioning,NetworkService,NetworkServiceInProcess');
app.commandLine.appendSwitch('no-sandbox'); // Sometimes needed for specific GPU/Stealth combinations

// RE-ENABLE hardware acceleration (disabling it is a bot signal)
// app.disableHardwareAcceleration(); 

const gotTheLock = app.requestSingleInstanceLock()

const windowManager = new WindowManager(__dirname)
const trayManager = new TrayManager(windowManager)
const shortcutManager = new ShortcutManager(windowManager)

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, _commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (windowManager.win) {
      if (windowManager.win.isMinimized()) windowManager.win.restore()
      windowManager.win.show()
      windowManager.win.focus()
    }
  })

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
}
