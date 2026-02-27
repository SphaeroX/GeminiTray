import { BrowserView } from 'electron'
import * as fs from 'node:fs'
import { store } from '../utils/store'
import { PROMPT_INJECTION_PATH } from '../utils/constants'

// Load prompt injection script once
let PROMPT_INJECTION_SCRIPT = ''
try {
    PROMPT_INJECTION_SCRIPT = fs.readFileSync(PROMPT_INJECTION_PATH, 'utf-8')
} catch (e) {
    console.error('Failed to load prompt injection script:', e)
}

// Script to auto-scroll chat to bottom on input and new messages
const AUTO_SCROLL_SCRIPT = `
(function initAutoScroll() {
    console.log('[GeminiTray] Auto-scroll script initialized');
    
    let scrollTimeout = null;
    let isUserScrolling = false;
    let lastScrollTop = 0;
    let findInProgress = false;
    
    // Find the main scrollable container
    function findScrollContainer() {
        const selectors = [
            'main[role="main"]',
            'main',
            '[data-test-id="chat-container"]',
            '[data-test-id="chat-messages"]',
            'body > div',
            'body'
        ];
        
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                const style = window.getComputedStyle(el);
                if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                    style.overflowY === 'auto' || style.overflowY === 'scroll') {
                    console.log('[GeminiTray] Found scroll container:', selector);
                    return el;
                }
            }
        }
        return document.documentElement;
    }
    
    function findLastMessage() {
        const selectors = [
            '[data-test-id="chat-message"]:last-of-type',
            '[data-test-id="chat-turn"]:last-of-type',
            'message-content:last-of-type',
            '.response-container:last-of-type',
            'main > div > div:last-of-type',
            'main > div:last-of-type'
        ];
        
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }
        return null;
    }
    
    function scrollToBottom() {
        if (isUserScrolling && !findInProgress) return;
        
        const scrollContainer = findScrollContainer();
        const lastMessage = findLastMessage();
        
        console.log('[GeminiTray] Scrolling to bottom, container:', scrollContainer.tagName, 'findInProgress:', findInProgress);
        
        if (lastMessage) {
            lastMessage.scrollIntoView({ 
                behavior: findInProgress ? 'auto' : 'smooth', 
                block: 'end' 
            });
            console.log('[GeminiTray] Scrolled to last message');
        } else {
            if (scrollContainer === document.documentElement) {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: findInProgress ? 'auto' : 'smooth'
                });
            } else {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: findInProgress ? 'auto' : 'smooth'
                });
            }
            console.log('[GeminiTray] Scrolled to scrollHeight');
        }
        
        const nestedContainers = document.querySelectorAll('[style*="overflow"]');
        nestedContainers.forEach(container => {
            container.scrollTop = container.scrollHeight;
        });
    }
    
    function handleScroll() {
        const scrollContainer = findScrollContainer();
        const currentScrollTop = scrollContainer === document.documentElement 
            ? (window.scrollY || document.documentElement.scrollTop)
            : scrollContainer.scrollTop;
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        
        if (currentScrollTop < lastScrollTop && currentScrollTop < maxScroll - 100) {
            if (!findInProgress) {
                isUserScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isUserScrolling = false;
                }, 3000);
            }
        }
        
        if (currentScrollTop >= maxScroll - 50) {
            isUserScrolling = false;
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    function handleFind() {
        findInProgress = true;
        console.log('[GeminiTray] Find triggered, will scroll to bottom');
        
        const attempts = [100, 300, 500, 800, 1200];
        attempts.forEach((delay, index) => {
            setTimeout(() => {
                scrollToBottom();
                if (index === attempts.length - 1) {
                    setTimeout(() => {
                        findInProgress = false;
                    }, 500);
                }
            }, delay);
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            handleFind();
        }
    });
    
    function watchInput() {
        const inputSelectors = [
            'textarea[placeholder*="Ask"]',
            'textarea[placeholder*="Fragen"]',
            'textarea[aria-label*="chat"]',
            'textarea[data-test-id="chat-input"]',
            'textarea',
            'div[contenteditable="true"]',
            'div[role="textbox"]'
        ];
        
        let inputElement = null;
        for (const selector of inputSelectors) {
            inputElement = document.querySelector(selector);
            if (inputElement) break;
        }
        
        if (inputElement) {
            console.log('[GeminiTray] Found chat input element');
            
            inputElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    setTimeout(() => {
                        isUserScrolling = false;
                        scrollToBottom();
                    }, 100);
                    setTimeout(scrollToBottom, 300);
                    setTimeout(scrollToBottom, 600);
                }
            });
            
            let inputTimeout;
            inputElement.addEventListener('input', () => {
                if (!isUserScrolling) {
                    clearTimeout(inputTimeout);
                    inputTimeout = setTimeout(scrollToBottom, 200);
                }
            });
        }
    }
    
    function watchMessages() {
        const chatContainerSelectors = [
            '[data-test-id="chat-container"]',
            '[data-test-id="chat-messages"]',
            'main',
            'body'
        ];
        
        let chatContainer = null;
        for (const selector of chatContainerSelectors) {
            chatContainer = document.querySelector(selector);
            if (chatContainer) break;
        }
        
        if (chatContainer) {
            console.log('[GeminiTray] Found chat container, watching for new messages');
            
            let lastContentHeight = chatContainer.scrollHeight;
            
            const observer = new MutationObserver((mutations) => {
                let shouldScroll = false;
                let contentAdded = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                                contentAdded = true;
                                break;
                            }
                        }
                    }
                    if (mutation.type === 'characterData') {
                        contentAdded = true;
                    }
                }
                
                if (contentAdded && chatContainer.scrollHeight > lastContentHeight + 20) {
                    shouldScroll = true;
                    lastContentHeight = chatContainer.scrollHeight;
                }
                
                if (shouldScroll && (!isUserScrolling || findInProgress)) {
                    scrollToBottom();
                    setTimeout(scrollToBottom, 100);
                    setTimeout(scrollToBottom, 300);
                    setTimeout(scrollToBottom, 600);
                    setTimeout(scrollToBottom, 1000);
                }
            });
            
            observer.observe(chatContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }
    
    function watchSendButton() {
        const sendButtonSelectors = [
            '[data-test-id="send-button"]',
            'button[aria-label*="send" i]',
            'button[aria-label*="Send" i]',
            'button svg[data-test-id="send-icon"]',
            'button:has(svg[data-test-id="send-icon"])'
        ];
        
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            let el = target;
            for (let i = 0; i < 3; i++) {
                if (el && el.tagName === 'BUTTON') {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    if (ariaLabel.toLowerCase().includes('send')) {
                        console.log('[GeminiTray] Send button clicked');
                        setTimeout(() => {
                            isUserScrolling = false;
                            scrollToBottom();
                        }, 100);
                        setTimeout(scrollToBottom, 300);
                        setTimeout(scrollToBottom, 600);
                        return;
                    }
                }
                el = el?.parentElement;
            }
        });
    }
    
    function init() {
        watchInput();
        watchMessages();
        watchSendButton();
        setTimeout(scrollToBottom, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[GeminiTray] URL changed, re-initializing auto-scroll');
            setTimeout(() => {
                watchInput();
                watchMessages();
                watchSendButton();
                setTimeout(scrollToBottom, 500);
            }, 1000);
        }
    });
    
    urlObserver.observe(document, { subtree: true, childList: true });
})();
`

// Script to auto-select default model when new chat is created
const MODEL_SELECTOR_SCRIPT = `
(function initModelSelector() {
    console.log('[GeminiTray] Model selector script initialized');
    
    const modelTextMap = {
        'fast': {
            texts: ['Fast', 'Flash', '1.5 Flash', '2.0 Flash', 'Gemini 2.0 Flash']
        },
        'thinking': {
            texts: ['Thinking', 'Thinking-Modus', 'Flash Thinking', '2.0 Flash Thinking', 'Gemini 2.0 Flash Thinking']
        },
        'pro': {
            texts: ['Pro', '1.5 Pro', '2.0 Pro', 'Pro Experimental', 'Gemini 2.0 Pro']
        }
    };
    
    let lastUrl = location.href;
    let isProcessing = false;
    
    function getDefaultModel() {
        return window.__GEMINI_TRAY_DEFAULT_MODEL || 'fast';
    }
    
    function selectModel() {
        if (isProcessing) return;
        
        if (window.__GEMINI_TRAY_AUTO_SELECT === false) {
            console.log('[GeminiTray] Auto-select is disabled');
            return;
        }
        
        isProcessing = true;
        
        const modelName = getDefaultModel();
        console.log('[GeminiTray] Auto-selecting model:', modelName);
        
        const modelConfig = modelTextMap[modelName];
        if (!modelConfig) {
            isProcessing = false;
            return;
        }
        
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = btn.textContent || '';
            for (const searchText of modelConfig.texts.slice(0, 2)) {
                if (text.includes(searchText)) {
                    console.log('[GeminiTray] Model already selected:', text);
                    isProcessing = false;
                    return;
                }
            }
        }
        
        const modelSelectors = [
            '[data-test-id="bard-mode-menu-button"]',
            '[data-test-id="model-selector"]',
            '[aria-label*="Modus" i]',
            '[aria-label*="Mode" i]',
            'button[aria-haspopup="listbox"]',
            '.model-picker-container button',
            'bard-mode-switcher button'
        ];
        
        let modelButton = null;
        for (const selector of modelSelectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    modelButton = el;
                    break;
                }
            } catch (e) {}
        }
        
        if (!modelButton) {
            const allButtons = document.querySelectorAll('button');
            for (const btn of allButtons) {
                const text = btn.textContent || '';
                const ariaLabel = btn.getAttribute('aria-label') || '';
                if (text.includes('Fast') || text.includes('Flash') || text.includes('Pro') || 
                    text.includes('Thinking') || text.includes('Modus') || text.includes('Mode') ||
                    ariaLabel.includes('Modus') || ariaLabel.includes('Mode')) {
                    modelButton = btn;
                    break;
                }
            }
        }
        
        if (modelButton) {
            modelButton.click();
            console.log('[GeminiTray] Clicked model selector');
            
            setTimeout(() => {
                const targetTexts = modelConfig.texts;
                let found = false;
                
                const optionSelectors = [
                    '[role="option"]',
                    '[role="menuitem"]',
                    'mat-option',
                    'li',
                    'button',
                    '.model-option',
                    '[class*="mode-"]'
                ];
                
                for (const selector of optionSelectors) {
                    const options = document.querySelectorAll(selector);
                    for (const option of options) {
                        const text = option.textContent || '';
                        const ariaLabel = option.getAttribute('aria-label') || '';
                        
                        for (const targetText of targetTexts) {
                            if (text.includes(targetText) || ariaLabel.includes(targetText)) {
                                console.log('[GeminiTray] Clicking model option:', text);
                                option.click();
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }
                    if (found) break;
                }
                
                if (!found) {
                    console.log('[GeminiTray] Could not find model option');
                }
                isProcessing = false;
            }, 400);
        } else {
            console.log('[GeminiTray] Could not find model selector button');
            isProcessing = false;
        }
    }
    
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[GeminiTray] URL changed, checking model selection');
            setTimeout(selectModel, 500);
        }
    });
    
    observer.observe(document, { subtree: true, childList: true });
    
    setTimeout(selectModel, 1000);
    
    window.addEventListener('gemini-tray-select-model', () => {
        setTimeout(selectModel, 100);
    });
})();
`

export class ScriptInjector {
    private view: BrowserView | null = null

    setView(view: BrowserView) {
        this.view = view
    }

    async injectAllScripts(): Promise<void> {
        if (!this.view) return

        try {
            // Inject prompt handling script
            await this.view.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT)
            console.log('[ScriptInjector] Prompt injection script injected')
        } catch (err) {
            console.error('[ScriptInjector] Failed to inject prompt script:', err)
        }

        try {
            // Inject auto-scroll script
            await this.view.webContents.executeJavaScript(AUTO_SCROLL_SCRIPT)
            console.log('[ScriptInjector] Auto-scroll script injected')
        } catch (err) {
            console.error('[ScriptInjector] Failed to inject auto-scroll script:', err)
        }

        // Inject model selector script with current settings
        const defaultModel = store.get('defaultModel') || 'fast'
        const autoSelectModel = store.get('autoSelectModel') ?? false

        if (autoSelectModel) {
            try {
                const modelScriptWithConfig = MODEL_SELECTOR_SCRIPT
                    .replace("window.__GEMINI_TRAY_DEFAULT_MODEL || 'fast'", `'${defaultModel}'`)
                    .replace("window.__GEMINI_TRAY_AUTO_SELECT !== false", 'true')
                await this.view.webContents.executeJavaScript(modelScriptWithConfig)
                console.log('[ScriptInjector] Model selector script injected')
            } catch (err) {
                console.error('[ScriptInjector] Failed to inject model selector script:', err)
            }
        }

        // Inject observer cleanup
        this.injectObserverCleanup()
    }

    private injectObserverCleanup() {
        if (!this.view) return

        const cleanupScript = `
            (function() {
                if (!window.__GEMINI_TRAY_OBSERVERS) {
                    window.__GEMINI_TRAY_OBSERVERS = [];
                }

                const OriginalMutationObserver = window.MutationObserver;
                window.MutationObserver = function(callback, options) {
                    const observer = new OriginalMutationObserver(callback, options);
                    window.__GEMINI_TRAY_OBSERVERS.push(observer);
                    return observer;
                };
                window.MutationObserver.prototype = OriginalMutationObserver.prototype;

                window.__GEMINI_TRAY_CLEANUP = function() {
                    console.log('[GeminiTray] Cleaning up MutationObservers');
                    window.__GEMINI_TRAY_OBSERVERS.forEach(observer => {
                        try {
                            observer.disconnect();
                        } catch (e) {
                            console.error('[GeminiTray] Error disconnecting observer:', e);
                        }
                    });
                    window.__GEMINI_TRAY_OBSERVERS = [];
                };

                window.addEventListener('beforeunload', window.__GEMINI_TRAY_CLEANUP);
                window.addEventListener('unload', window.__GEMINI_TRAY_CLEANUP);

                console.log('[GeminiTray] Observer cleanup injected');
            })();
        `

        this.view.webContents.executeJavaScript(cleanupScript).catch(err => {
            console.error('[ScriptInjector] Failed to inject observer cleanup:', err)
        })
    }

    async injectPromptScript(): Promise<void> {
        if (!this.view) return
        await this.view.webContents.executeJavaScript(PROMPT_INJECTION_SCRIPT).catch(err => {
            console.error('[ScriptInjector] Failed to inject prompt script:', err)
        })
    }

    async updateModelSettings(): Promise<void> {
        if (!this.view) return

        const defaultModel = store.get('defaultModel') || 'fast'
        const autoSelectModel = store.get('autoSelectModel') ?? false

        try {
            await this.view.webContents.executeJavaScript(`
                window.__GEMINI_TRAY_DEFAULT_MODEL = '${defaultModel}';
                window.__GEMINI_TRAY_AUTO_SELECT = ${autoSelectModel};
                console.log('[GeminiTray] Model settings updated: ${defaultModel}, autoSelect: ${autoSelectModel}');
            `)
        } catch (err) {
            console.error('[ScriptInjector] Failed to update model settings:', err)
        }
    }
}
