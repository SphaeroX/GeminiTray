/**
 * Centralized logging utility for Gemini Tray
 * Provides consistent logging format across all modules
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export interface LogEntry {
    timestamp: string
    level: string
    source: string
    message: string
    data?: unknown
}

class Logger {
    private static instance: Logger
    private minLevel: LogLevel = LogLevel.INFO

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    setLevel(level: LogLevel) {
        this.minLevel = level
    }

    private formatMessage(level: string, source: string, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString()
        let formatted = `[${timestamp}] [${level}] [${source}] ${message}`
        if (data !== undefined) {
            formatted += ` ${JSON.stringify(data)}`
        }
        return formatted
    }

    debug(source: string, message: string, data?: unknown) {
        if (this.minLevel <= LogLevel.DEBUG) {
            console.debug(this.formatMessage('DEBUG', source, message, data))
        }
    }

    info(source: string, message: string, data?: unknown) {
        if (this.minLevel <= LogLevel.INFO) {
            console.info(this.formatMessage('INFO', source, message, data))
        }
    }

    warn(source: string, message: string, data?: unknown) {
        if (this.minLevel <= LogLevel.WARN) {
            console.warn(this.formatMessage('WARN', source, message, data))
        }
    }

    error(source: string, message: string, error?: unknown) {
        if (this.minLevel <= LogLevel.ERROR) {
            const errorData = error instanceof Error 
                ? { message: error.message, stack: error.stack }
                : error
            console.error(this.formatMessage('ERROR', source, message, errorData))
        }
    }
}

export const logger = Logger.getInstance()

// Convenience loggers for each module
export const log = {
    main: (message: string, data?: unknown) => logger.info('Main', message, data),
    window: (message: string, data?: unknown) => logger.info('WindowManager', message, data),
    tray: (message: string, data?: unknown) => logger.info('TrayManager', message, data),
    shortcut: (message: string, data?: unknown) => logger.info('ShortcutManager', message, data),
    ipc: (message: string, data?: unknown) => logger.info('IPCManager', message, data),
    script: (message: string, data?: unknown) => logger.info('ScriptInjector', message, data),
    screenshot: (message: string, data?: unknown) => logger.info('ScreenshotService', message, data),
    debug: (message: string, data?: unknown) => logger.debug('Debug', message, data)
}