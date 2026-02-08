import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as os from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const IS_DEV = !!process.env['VITE_DEV_SERVER_URL']

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

export const APP_ROOT = process.env.APP_ROOT
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(APP_ROOT, 'dist')

export const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST

// In production, resources are in resources/electron/prompt-injection.js
// In dev, they are in electron/prompt-injection.js relative to project root
export const PROMPT_INJECTION_PATH = IS_DEV
    ? path.join(APP_ROOT, 'electron/prompt-injection.js')
    : path.join(process.resourcesPath, 'electron/prompt-injection.js');

export const DEBUG_DIR = path.join(os.tmpdir(), 'gemini-tray-debug')
