import { Tray, Menu, nativeImage, app } from 'electron'
import * as path from 'node:path'
import { WindowManager } from './window-manager'
import { VITE_PUBLIC } from '../utils/constants'

export class TrayManager {
    public tray: Tray | null = null
    private windowManager: WindowManager

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager
    }

    createTray() {
        const icon = nativeImage.createFromPath(path.join(VITE_PUBLIC, 'tray-icon.png'))
        this.tray = new Tray(icon)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show/Hide',
                click: () => this.windowManager.toggleWindowVisibility()
            },
            {
                label: 'Screenshot & Ask',
                click: () => this.windowManager.takeScreenshot()
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    // We need a way to signal quiting
                    // In main.ts: isQuitting = true
                    // app.quit()
                    // slightly complex cyclic dependency or state management needed here.
                    // Ideally Main should handle the quit logic or we expose a method.
                    app.emit('before-quit') // Trigger before-quit
                    app.quit()
                }
            }
        ])

        this.tray.setToolTip('Gemini Tray')
        this.tray.setContextMenu(contextMenu)

        this.tray.on('click', () => {
            this.windowManager.toggleWindowVisibility()
        })
    }
}
