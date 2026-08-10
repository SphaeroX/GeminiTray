// This script is injected into the Gemini web page by the main process

(function () {
    // Guard to prevent multiple injections
    if (window.__GEMINI_TRAY_INJECTED) return;
    window.__GEMINI_TRAY_INJECTED = true;

    let activePrompt = null;
    let indicatorElement = null;
    let isHandlingSend = false;

    // --- Visual Indicator Logic ---

    function updateIndicator(errorMessage = null) {
        if (!activePrompt) {
            if (indicatorElement) {
                indicatorElement.remove();
                indicatorElement = null;
            }
            return;
        }

        if (!indicatorElement) {
            indicatorElement = document.createElement('div');
            indicatorElement.id = 'gemini-tray-prompt-indicator';
            Object.assign(indicatorElement.style, {
                position: 'fixed',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#131314',
                color: '#e3e3e3',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #444746',
                zIndex: '99999',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                fontSize: '14px',
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                userSelect: 'none'
            });

            // Add hover effects
            indicatorElement.addEventListener('mouseenter', () => {
                indicatorElement.style.backgroundColor = '#1e1f20';
                indicatorElement.style.borderColor = '#5f6368';
                indicatorElement.style.transform = 'translateX(-50%) scale(1.02)';
            });
            indicatorElement.addEventListener('mouseleave', () => {
                indicatorElement.style.backgroundColor = '#131314';
                indicatorElement.style.borderColor = '#444746';
                indicatorElement.style.transform = 'translateX(-50%) scale(1)';
            });

            // Click anywhere on the indicator to deactivate
            indicatorElement.addEventListener('click', () => {
                window.__GEMINI_TRAY_SET_PROMPT(null);
            });

            document.body.appendChild(indicatorElement);
        }

        const inputContainer = document.querySelector('.input-area-container') || document.querySelector('rich-textarea') || document.querySelector('.input-area') || document.querySelector('[class*="input-area"]');
        if (inputContainer) {
            const rect = inputContainer.getBoundingClientRect();
            if (rect.top > 0) {
                indicatorElement.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
                indicatorElement.style.left = (rect.left + rect.width / 2) + 'px';
            }
        }

        while (indicatorElement.firstChild) {
            indicatorElement.removeChild(indicatorElement.firstChild);
        }

        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px'
        });

        const label = document.createElement('span');
        label.textContent = errorMessage ? '⚠️ ERROR' : 'ACTIVE PROMPT';
        Object.assign(label.style, {
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: errorMessage ? '#f28b82' : '#a8c7fa',
            fontWeight: '600'
        });

        const value = document.createElement('span');
        value.textContent = errorMessage || activePrompt.name;
        Object.assign(value.style, {
            fontWeight: '400',
            fontSize: '14px'
        });

        container.appendChild(label);
        container.appendChild(value);
        indicatorElement.appendChild(container);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'transparent', border: 'none', color: '#9aa0a6', fontSize: '18px', cursor: 'pointer', padding: '0 4px', lineHeight: '1', borderRadius: '4px'
        });
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.__GEMINI_TRAY_SET_PROMPT(null);
        });
        indicatorElement.appendChild(closeBtn);
    }

    // --- Interaction Logic ---

    function isSendButton(element) {
        if (!element) return false;
        const btn = element.closest('button, [role="button"]');
        if (!btn) return false;

        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const testId = (btn.getAttribute('data-test-id') || btn.getAttribute('data-testid') || '').toLowerCase();
        const text = (btn.textContent || '').toLowerCase();
        const className = (typeof btn.className === 'string' ? btn.className : '').toLowerCase();

        const keywords = ['send', 'senden', 'submit', 'übermitteln', 'abschicken', 'übertragen'];
        
        for (const kw of keywords) {
            if (ariaLabel.includes(kw) || title.includes(kw) || testId.includes(kw) || className.includes(kw)) {
                return true;
            }
        }

        if (btn.querySelector('mat-icon[data-mat-icon-name*="send" i]') ||
            btn.querySelector('svg[data-test-id*="send" i]') ||
            btn.querySelector('svg[data-testid*="send" i]') ||
            btn.querySelector('[class*="send-icon" i]')) {
            return true;
        }

        // Fallback for simple button text
        if (text && keywords.some(kw => text.trim() === kw)) {
            return true;
        }

        return false;
    }

    function getSendButton() {
        // 1. Try CSS selectors with case-insensitive flag i
        const selectors = [
            'button[aria-label*="send" i]',
            'button[aria-label*="senden" i]',
            'button[aria-label*="submit" i]',
            'button[data-test-id*="send" i]',
            'button[data-testid*="send" i]',
            '[role="button"][aria-label*="send" i]',
            '[role="button"][aria-label*="senden" i]',
            'button mat-icon[data-mat-icon-name*="send" i]',
            'button svg[data-test-id*="send" i]',
            '.send-button-container button',
            'button.send-button'
        ];

        for (const selector of selectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    return el.closest('button, [role="button"]') || el;
                }
            } catch (e) {}
        }

        // 2. Fallback scan all buttons
        const allButtons = Array.from(document.querySelectorAll('button, [role="button"]'));
        return allButtons.find(b => isSendButton(b)) || null;
    }

    function getEditor() {
        // 1. Check focused element
        if (document.activeElement) {
            if (document.activeElement.isContentEditable) {
                return document.activeElement.closest('[contenteditable="true"]') || document.activeElement;
            }
            if (document.activeElement.tagName === 'TEXTAREA') {
                return document.activeElement;
            }
        }

        // 2. Query selectors for Gemini editor
        const selectors = [
            '.ql-editor[contenteditable="true"]',
            'div[contenteditable="true"][role="textbox"]',
            'rich-textarea div[contenteditable="true"]',
            '[aria-label*="Prompt" i][contenteditable="true"]',
            '.input-area div[contenteditable="true"]',
            'div[contenteditable="true"]',
            'textarea'
        ];

        for (const selector of selectors) {
            try {
                const el = document.querySelector(selector);
                if (el) return el;
            } catch (e) {}
        }

        return null;
    }

    async function setEditorText(editor, text) {
        editor.focus();
        
        // Strategy 1: document.execCommand (Most compatible with rich text editors)
        try {
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, text);
            console.log('[GeminiTray] Text set via execCommand');

            // Dispatch input and change events to notify framework
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } catch (e) {
            console.warn('[GeminiTray] execCommand failed:', e);
        }

        // Strategy 2: Direct DOM structure setting
        try {
            if (editor.tagName === 'TEXTAREA') {
                editor.value = text;
            } else {
                editor.innerHTML = '';
                const lines = text.split('\n');
                lines.forEach(line => {
                    const p = document.createElement('p');
                    p.textContent = line || '\u200B';
                    editor.appendChild(p);
                });
            }

            editor.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: text }));
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[GeminiTray] Text set via DOM manipulation fallback');
            return true;
        } catch (e) {
            console.error('[GeminiTray] setEditorText fallback failed:', e);
            return false;
        }
    }

    async function handleSendWithPrompt(originalEvent) {
        if (!activePrompt || isHandlingSend) return;

        const editor = getEditor();
        if (!editor) {
            console.error('[GeminiTray] ERROR: Editor not found');
            updateIndicator('Editor not found');
            return;
        }

        isHandlingSend = true;
        const currentPrompt = activePrompt;
        const userText = (editor.innerText || editor.textContent || '').trim();
        
        if (originalEvent) {
            originalEvent.preventDefault();
            originalEvent.stopPropagation();
        }

        try {
            const combinedText = `${currentPrompt.content}\n\n${userText}`;
            await setEditorText(editor, combinedText);

            // Deactivate prompt immediately to avoid loops
            window.__GEMINI_TRAY_SET_PROMPT(null);

            // Wait for send button to be enabled (Gemini enables it after input)
            let attempts = 0;
            let sendBtn = null;
            while (attempts < 20) {
                sendBtn = getSendButton();
                if (sendBtn && !sendBtn.disabled && sendBtn.getAttribute('aria-disabled') !== 'true') break;
                
                // Trigger input event to help the framework notice the change
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }

            if (sendBtn) {
                console.log('[GeminiTray] Clicking send button');
                sendBtn.click();
                // Fallback click events
                const events = ['mousedown', 'mouseup', 'click'];
                for (const type of events) {
                    sendBtn.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true }));
                }
            } else {
                console.warn('[GeminiTray] Send button not found or disabled, trying Enter key');
                editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        } catch (err) {
            console.error('[GeminiTray] Critical error in handleSendWithPrompt:', err);
        } finally {
            setTimeout(() => { isHandlingSend = false; }, 1000);
        }
    }

    // --- Event Listeners ---

    // Capture Enter key (using capture phase for maximum priority)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && activePrompt) {
            const target = e.target;
            const isEditor = target && (
                target.isContentEditable ||
                target.getAttribute?.('contenteditable') === 'true' ||
                target.closest?.('[contenteditable="true"]') ||
                target.closest?.('rich-textarea') ||
                target.closest?.('.input-area') ||
                target.tagName === 'TEXTAREA'
            );
            if (isEditor) {
                handleSendWithPrompt(e);
            }
        }
    }, true);

    // Capture Click on Send button
    window.addEventListener('click', (e) => {
        if (!activePrompt) return;
        if (isSendButton(e.target)) {
            handleSendWithPrompt(e);
        }
    }, true);

    // API for Main process
    window.__GEMINI_TRAY_SET_PROMPT = function (prompt) {
        activePrompt = prompt;
        updateIndicator();
        if (prompt) {
            setTimeout(() => {
                const editor = getEditor();
                if (editor) editor.focus();
            }, 100);
        }
    };

    console.log('[GeminiTray] Enhanced Prompt Injection Ready');
})();

