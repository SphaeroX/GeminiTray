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

        const inputContainer = document.querySelector('.input-area-container') || document.querySelector('rich-textarea') || document.querySelector('.input-area');
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

    function getSendButton() {
        return document.querySelector('button[aria-label*="Senden"]') ||
            document.querySelector('button[aria-label*="Send"]') ||
            document.querySelector('button[data-test-id*="send"]') ||
            document.querySelector('button mat-icon[data-mat-icon-name="send_spark"]')?.closest('button') ||
            document.querySelector('button mat-icon[data-mat-icon-name="send"]')?.closest('button') ||
            document.querySelector('button svg[data-test-id="send-icon"]')?.closest('button') ||
            document.querySelector('.send-button-container button') ||
            document.querySelector('button.send-button') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('send'));
    }

    function getEditor() {
        return document.querySelector('.ql-editor[contenteditable="true"]') ||
            document.querySelector('div[contenteditable="true"][role="textbox"]') ||
            document.querySelector('rich-textarea div[contenteditable="true"]') ||
            document.querySelector('[aria-label*="Prompt"][contenteditable="true"]') ||
            document.querySelector('.input-area div[contenteditable="true"]') ||
            document.querySelector('div[contenteditable="true"]');
    }

    async function setEditorText(editor, text) {
        editor.focus();
        
        // Strategy 1: document.execCommand (Most compatible with frameworks as it simulates user input)
        try {
            // Select all and delete
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            // Insert new text
            document.execCommand('insertText', false, text);
            console.log('[GeminiTray] Text set via execCommand');
            return true;
        } catch (e) {
            console.warn('[GeminiTray] execCommand failed:', e);
        }

        // Strategy 2: Manual manipulation (Fallback)
        editor.innerHTML = '';
        const textNode = document.createTextNode(text);
        editor.appendChild(textNode);
        editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
        console.log('[GeminiTray] Text set via innerHTML fallback');
        return true;
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
        const userText = editor.innerText || editor.textContent || '';
        
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
                console.warn('[GeminiTray] Send button not found or disabled, trying Enter');
                editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        } catch (err) {
            console.error('[GeminiTray] Critical error:', err);
        } finally {
            setTimeout(() => { isHandlingSend = false; }, 1000);
        }
    }

    // --- Event Listeners ---

    // Capture Enter key (using capture phase for maximum priority)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && activePrompt) {
            const target = e.target;
            const isEditor = target.getAttribute('contenteditable') === 'true' || target.closest('rich-textarea') || target.closest('.input-area');
            if (isEditor) {
                handleSendWithPrompt(e);
            }
        }
    }, true);

    // Capture Click on Send button
    window.addEventListener('click', (e) => {
        if (!activePrompt) return;
        const sendBtn = e.target.closest('button');
        if (sendBtn) {
            const ariaLabel = sendBtn.getAttribute('aria-label') || '';
            const isSend = ariaLabel.includes('Send') || ariaLabel.includes('Senden') ||
                sendBtn.querySelector('mat-icon[data-mat-icon-name*="send"]') ||
                sendBtn.getAttribute('data-test-id')?.includes('send');

            if (isSend) {
                handleSendWithPrompt(e);
            }
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
