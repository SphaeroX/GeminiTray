import { app, session } from 'electron'
import { spawn, ChildProcess } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import WebSocket from 'ws'

const LOGIN_URL = 'https://accounts.google.com/ServiceLogin?service=youtube&continue=https%3A%2F%2Fgemini.google.com%2Fapp'
const LOGIN_TIMEOUT_MS = 10 * 60 * 1000
const SESSION_COOKIE_LIFETIME_S = 30 * 24 * 60 * 60
const SESSION_COOKIES = ['SID', '__Secure-1PSID', '__Secure-3PSID']

interface CdpCookie {
    name: string
    value: string
    domain: string
    path: string
    expires: number
    httpOnly: boolean
    secure: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}

function findBrowser(): string | null {
    const env = process.env
    const candidates = process.platform === 'win32'
        ? [
            path.join(env['PROGRAMFILES'] || '', 'Google/Chrome/Application/chrome.exe'),
            path.join(env['PROGRAMFILES(X86)'] || '', 'Google/Chrome/Application/chrome.exe'),
            path.join(env['LOCALAPPDATA'] || '', 'Google/Chrome/Application/chrome.exe'),
            path.join(env['PROGRAMFILES(X86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
            path.join(env['PROGRAMFILES'] || '', 'Microsoft/Edge/Application/msedge.exe')
        ]
        : process.platform === 'darwin'
            ? [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
            ]
            : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge']
    return candidates.find(p => p && fs.existsSync(p)) ?? null
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function getBrowserWsUrl(port: number): Promise<string | null> {
    try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`)
        return ((await res.json()) as { webSocketDebuggerUrl: string }).webSocketDebuggerUrl
    } catch {
        return null
    }
}

function cdpCall<T>(ws: WebSocket, method: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const id = Math.floor(Math.random() * 1e9)
        const onMessage = (data: WebSocket.RawData) => {
            const msg = JSON.parse(data.toString())
            if (msg.id !== id) return
            ws.off('message', onMessage)
            if (msg.error) reject(new Error(msg.error.message))
            else resolve(msg.result as T)
        }
        ws.on('message', onMessage)
        ws.send(JSON.stringify({ id, method }))
    })
}

async function importCookies(cookies: CdpCookie[]): Promise<number> {
    const sess = session.fromPartition('persist:gemini')
    let count = 0
    for (const c of cookies) {
        const host = c.domain.replace(/^\./, '')
        const isHostPrefixed = c.name.startsWith('__Host-')
        try {
            await sess.cookies.set({
                url: `https://${host}${c.path}`,
                domain: isHostPrefixed || !c.domain.startsWith('.') ? undefined : c.domain,
                path: c.path,
                name: c.name,
                value: c.value,
                secure: c.secure || isHostPrefixed || c.name.startsWith('__Secure-'),
                httpOnly: c.httpOnly,
                // Session cookies would be dropped on app restart (user ends up logged out), so give them a lifetime
                expirationDate: c.expires > 0 ? c.expires : Math.floor(Date.now() / 1000) + SESSION_COOKIE_LIFETIME_S,
                sameSite: c.sameSite === 'Strict' ? 'strict' : c.sameSite === 'Lax' ? 'lax' : 'no_restriction'
            })
            count++
        } catch (e) {
            console.warn('[GeminiTray] Failed to import cookie ' + c.name + ':', e)
        }
    }
    return count
}

let running = false

export function isBrowserLoginRunning() {
    return running
}

/**
 * Google rejects sign-in inside Electron, so the user signs in with a real Chrome/Edge
 * (own profile dir) and the resulting Google cookies are copied into the app session.
 */
export async function loginWithSystemBrowser(): Promise<{ success: boolean; count: number; error?: string }> {
    if (running) return { success: false, count: 0, error: 'already-running' }
    const browserPath = findBrowser()
    if (!browserPath) return { success: false, count: 0, error: 'no-browser' }

    running = true
    let child: ChildProcess | null = null
    let ws: WebSocket | null = null
    try {
        const port = 49152 + Math.floor(Math.random() * 10000)
        const profileDir = path.join(app.getPath('userData'), 'browser-login-profile')
        child = spawn(browserPath, [
            `--remote-debugging-port=${port}`,
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--new-window',
            LOGIN_URL
        ], { stdio: 'ignore' })
        let exited = false
        child.on('exit', () => { exited = true })

        let wsUrl: string | null = null
        for (let i = 0; i < 30 && !wsUrl && !exited; i++) {
            await sleep(500)
            wsUrl = await getBrowserWsUrl(port)
        }
        if (!wsUrl) return { success: false, count: 0, error: 'browser-start-failed' }

        const socket = new WebSocket(wsUrl)
        ws = socket
        await new Promise<void>((resolve, reject) => {
            socket.once('open', () => resolve())
            socket.once('error', reject)
        })

        const deadline = Date.now() + LOGIN_TIMEOUT_MS
        while (Date.now() < deadline && !exited) {
            await sleep(2000)
            let cookies: CdpCookie[]
            try {
                cookies = (await cdpCall<{ cookies: CdpCookie[] }>(socket, 'Storage.getCookies')).cookies
            } catch {
                break
            }
            const relevant = cookies.filter(c => /(^|\.)(google|youtube)\.[a-z.]+$/.test(c.domain.replace(/^\./, '')))
            if (relevant.some(c => SESSION_COOKIES.includes(c.name))) {
                // Let Google finish setting the remaining cookies after the redirect to Gemini
                await sleep(2500)
                const final = (await cdpCall<{ cookies: CdpCookie[] }>(socket, 'Storage.getCookies')).cookies
                    .filter(c => /(^|\.)(google|youtube)\.[a-z.]+$/.test(c.domain.replace(/^\./, '')))
                const count = await importCookies(final)
                try { await cdpCall(socket, 'Browser.close') } catch { /* already closing */ }
                return { success: count > 0, count }
            }
        }
        return { success: false, count: 0, error: exited ? 'browser-closed' : 'timeout' }
    } catch (e) {
        console.error('[GeminiTray] Browser login failed:', e)
        return { success: false, count: 0, error: 'failed' }
    } finally {
        running = false
        try { ws?.close() } catch { /* ignore */ }
        if (child && child.exitCode === null) setTimeout(() => child?.kill(), 3000)
    }
}
