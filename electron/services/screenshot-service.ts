import { BrowserWindow, BrowserView, screen, desktopCapturer, clipboard } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as os from 'node:os'

export interface ScreenshotResult {
    success: boolean
    tempPath?: string
    error?: string
}

export class ScreenshotService {
    private windowManager: { win: BrowserWindow | null; view: BrowserView | null; fullScreenshot: Electron.NativeImage | null; selectionWindow: BrowserWindow | null }
    private __dirname: string

    constructor(windowManager: { win: BrowserWindow | null; view: BrowserView | null; fullScreenshot: Electron.NativeImage | null; selectionWindow: BrowserWindow | null }, dirname: string) {
        this.windowManager = windowManager
        this.__dirname = dirname
    }

    async takeScreenshot(): Promise<ScreenshotResult> {
        try {
            const wasVisible = this.windowManager.win?.isVisible()
            if (wasVisible) this.windowManager.win?.hide()
            await new Promise(resolve => setTimeout(resolve, 200))

            const primaryDisplay = screen.getPrimaryDisplay()
            const { width, height } = primaryDisplay.size
            const scaleFactor = primaryDisplay.scaleFactor

            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: { width: width * scaleFactor, height: height * scaleFactor }
            })

            if (sources.length > 0) {
                this.windowManager.fullScreenshot = sources[0].thumbnail
                this.openSelectionWindow()
                return { success: true }
            } else {
                if (wasVisible) this.windowManager.win?.show()
                return { success: false, error: 'No screen sources found' }
            }
        } catch (error) {
            console.error('[ScreenshotService] Screenshot failed:', error)
            this.windowManager.win?.show()
            return { success: false, error: String(error) }
        }
    }

    openSelectionWindow() {
        const primaryDisplay = screen.getPrimaryDisplay()
        const { width, height } = primaryDisplay.bounds

        this.windowManager.selectionWindow = new BrowserWindow({
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
        })

        this.windowManager.selectionWindow.loadFile(path.join(this.__dirname, 'screenshot-selection.html'))
        this.windowManager.selectionWindow.setAlwaysOnTop(true, 'screen-saver')

        this.windowManager.selectionWindow.on('closed', () => {
            this.windowManager.selectionWindow = null
        })
    }

    async processSelectedRegion(bounds: { x: number; y: number; width: number; height: number }): Promise<ScreenshotResult> {
        if (this.windowManager.selectionWindow) {
            this.windowManager.selectionWindow.close()
            this.windowManager.selectionWindow = null
        }

        if (!this.windowManager.fullScreenshot) {
            this.windowManager.win?.show()
            return { success: false, error: 'No screenshot available' }
        }

        try {
            const primaryDisplay = screen.getPrimaryDisplay()
            const scaleFactor = primaryDisplay.scaleFactor

            const scaledBounds = {
                x: Math.round(bounds.x * scaleFactor),
                y: Math.round(bounds.y * scaleFactor),
                width: Math.round(bounds.width * scaleFactor),
                height: Math.round(bounds.height * scaleFactor)
            }

            const croppedScreenshot = this.windowManager.fullScreenshot.crop(scaledBounds)
            const tempPath = path.join(os.tmpdir(), `gemini-screenshot-${Date.now()}.png`)
            fs.writeFileSync(tempPath, croppedScreenshot.toPNG())

            this.windowManager.win?.show()
            this.windowManager.win?.focus()
            this.windowManager.win?.webContents.send('screenshot-taken', tempPath)

            if (this.windowManager.view) {
                clipboard.writeImage(croppedScreenshot)

                await this.windowManager.view.webContents.executeJavaScript(`
                    (function() {
                        const editor = document.querySelector('.ql-editor[contenteditable="true"]');
                        if (editor) {
                            editor.focus();
                        }
                    })();
                `)

                await new Promise(resolve => setTimeout(resolve, 100))

                this.windowManager.view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'V', modifiers: ['control'] })
                this.windowManager.view.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'V', modifiers: ['control'] })

                // Wait for upload
                let attempts = 0
                const maxAttempts = 50
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                    const uploadStatus = await this.windowManager.view.webContents.executeJavaScript(`
                        (function() {
                            const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
                            if (!inputField) return { ready: false, reason: 'no-input-field' };
                            
                            const fileChips = inputField.querySelectorAll('[class*="chip"], [class*="thumbnail"], [class*="preview"], [class*="attachment"], [class*="media"]');
                            const images = inputField.querySelectorAll('img:not([class*="icon"])');
                            
                            const isLoading = inputField.querySelector('[class*="loading"], [class*="uploading"], [class*="progress"], mat-spinner, .spinner') !== null;
                            
                            const uploader = document.querySelector('uploader');
                            const uploaderLoading = uploader?.querySelector('[class*="loading"], [class*="progress"]') !== null;
                            
                            const hasAttachment = fileChips.length > 0 || images.length > 0;
                            
                            return {
                                ready: hasAttachment && !isLoading && !uploaderLoading,
                                hasAttachment: hasAttachment,
                                isLoading: isLoading || uploaderLoading,
                                chipCount: fileChips.length,
                                imageCount: images.length
                            };
                        })();
                    `)

                    if (uploadStatus.ready) {
                        console.log('[ScreenshotService] Screenshot upload confirmed ready:', uploadStatus)
                        break
                    }
                    if (uploadStatus.hasAttachment && uploadStatus.isLoading) {
                        attempts++
                        continue
                    }
                    attempts++
                }

                if (attempts >= maxAttempts) {
                    console.log('[ScreenshotService] Screenshot upload wait timed out, proceeding anyway')
                }

                this.windowManager.view.webContents.focus()
            }

            this.windowManager.fullScreenshot = null
            return { success: true, tempPath }
        } catch (error) {
            console.error('[ScreenshotService] Screenshot crop failed:', error)
            this.windowManager.win?.show()
            this.windowManager.fullScreenshot = null
            return { success: false, error: String(error) }
        }
    }

    cancelSelection() {
        if (this.windowManager.selectionWindow) {
            this.windowManager.selectionWindow.close()
            this.windowManager.selectionWindow = null
        }
        this.windowManager.fullScreenshot = null
        this.windowManager.win?.show()
    }
}
