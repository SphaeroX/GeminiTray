// This script is injected into the Gemini web page by the main process

(function () {
    // Guard to prevent multiple injections
    if (window.__GEMINI_TRAY_INJECTED) return;
    window.__GEMINI_TRAY_INJECTED = true;

    let activePrompt = null;
    let indicatorElement = null;

    // --- Visual Indicator Logic ---

    function updateIndicator() {
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
            // Style it to float above the input area
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
                transition: 'opacity 0.2s ease'
            });
            document.body.appendChild(indicatorElement);
        }

        // Attempt to position it relative to the input box if found
        const inputContainer = document.querySelector('.input-area-container') || document.querySelector('rich-textarea');
        if (inputContainer) {
            const rect = inputContainer.getBoundingClientRect();
            indicatorElement.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
            indicatorElement.style.left = (rect.left + rect.width / 2) + 'px';
        }

        // Clear existing content safely
        while (indicatorElement.firstChild) {
            indicatorElement.removeChild(indicatorElement.firstChild);
        }

        // Create container
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px'
        });

        // Label trace
        const label = document.createElement('span');
        label.textContent = 'ACTIVE PROMPT';
        Object.assign(label.style, {
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#a8c7fa',
            fontWeight: '600'
        });

        // Value trace
        const value = document.createElement('span');
        value.textContent = activePrompt.name;
        Object.assign(value.style, {
            fontWeight: '400',
            fontSize: '14px'
        });

        container.appendChild(label);
        container.appendChild(value);
        indicatorElement.appendChild(container);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'transparent',
            border: 'none',
            color: '#9aa0a6',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: '1',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto'
        });
        closeBtn.title = 'Deactivate prompt';
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#e8eaed';
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#9aa0a6';
            closeBtn.style.background = 'transparent';
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.__GEMINI_TRAY_SET_PROMPT(null);
        });

        indicatorElement.appendChild(closeBtn);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // --- Interaction Logic ---

    // --- Interaction Logic ---

    function getSendButton() {
        return document.querySelector('button[aria-label*="Senden"]') ||
            document.querySelector('button[aria-label*="Send"]') ||
            document.querySelector('button[data-test-id*="send"]') ||
            document.querySelector('button mat-icon[data-mat-icon-name="send_spark"]')?.closest('button') ||
            document.querySelector('button mat-icon[data-mat-icon-name="send"]')?.closest('button') ||
            document.querySelector('button svg[data-test-id="send-icon"]')?.closest('button') ||
            document.querySelector('button[aria-disabled="false"] mat-icon[data-mat-icon-name="send"]')?.closest('button');
    }

    function getEditor() {
        return document.querySelector('.ql-editor[contenteditable="true"]') ||
            document.querySelector('div[contenteditable="true"][role="textbox"]') ||
            document.querySelector('rich-textarea div[contenteditable="true"]');
    }

    async function simulateTyping(element, text) {
        element.focus();
        element.innerHTML = '';
        
        // Split text into chunks to be faster but still "natural"
        const chunks = text.split('\n');
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            
            // Insert chunk via text node to maintain cursor position and framework compatibility
            const textNode = document.createTextNode(chunk);
            const selection = window.getSelection();
            const range = document.createRange();
            
            if (element.lastChild && element.lastChild.nodeName === 'BR') {
                element.insertBefore(textNode, element.lastChild);
            } else {
                element.appendChild(textNode);
            }
            
            range.setStartAfter(textNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            // Trigger events for each line
            element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: chunk }));
            
            if (i < chunks.length - 1) {
                // Simulate Enter for new line
                const br = document.createElement('br');
                element.appendChild(br);
                element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertLineBreak' }));
            }
            
            // Tiny micro-delay
            await new Promise(r => setTimeout(r, 10));
        }
        
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        await new Promise(r => setTimeout(r, 50));
        element.focus();
    }

    async function handleSendWithPrompt(originalEvent) {
        if (!activePrompt || isHandlingSend) return;

        isHandlingSend = true;
        const currentPrompt = activePrompt;
        console.log('[GeminiTray] STARTING HUMAN-LIKE SEND:', currentPrompt.name);

        const editor = getEditor();
        if (!editor) {
            console.error('[GeminiTray] ERROR: Editor not found');
            isHandlingSend = false;
            return;
        }

        const userText = editor.innerText || editor.textContent || '';
        
        if (originalEvent) {
            originalEvent.preventDefault();
            originalEvent.stopPropagation();
        }

        try {
            const combinedText = `${currentPrompt.content}\n\n${userText}`;
            
            // Use human-like typing simulation
            await simulateTyping(editor, combinedText);

            // Give the UI time to enable the button
            let attempts = 0;
            let sendBtn = null;
            
            while (attempts < 10) {
                sendBtn = getSendButton();
                const isDisabled = !sendBtn || sendBtn.disabled || sendBtn.getAttribute('aria-disabled') === 'true';
                
                if (sendBtn && !isDisabled) break;
                
                console.log('[GeminiTray] Waiting for send button to enable... attempt', attempts + 1);
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(r => setTimeout(r, 150));
                attempts++;
            }

            if (sendBtn && sendBtn.getAttribute('aria-disabled') !== 'true') {
                window.__GEMINI_TRAY_SET_PROMPT(null);
                console.log('[GeminiTray] DISPATCHING FINAL CLICK');
                
                const events = ['mousedown', 'mouseup', 'click'];
                for (const type of events) {
                    sendBtn.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true }));
                    await new Promise(r => setTimeout(r, 10));
                }
            } else {
                console.warn('[GeminiTray] Button stuck. Trying Enter fallback.');
                editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        } catch (err) {
            console.error('[GeminiTray] Critical interaction error:', err);
        } finally {
            setTimeout(() => { isHandlingSend = false; }, 1000);
        }
    }

    // Capture Enter key on the window/document level
    window.addEventListener('keydown', (e) => {
        const target = e.target;
        const isEditor = target.getAttribute('contenteditable') === 'true' ||
            target.classList.contains('ql-editor') ||
            target.closest('rich-textarea');

        if (e.key === 'Enter' && !e.shiftKey && isEditor) {
            console.log('[GeminiTray] Enter pressed in editor. Active prompt:', activePrompt ? activePrompt.name : 'none');
            if (activePrompt) {
                handleSendWithPrompt(e);
            }
        }
    }, true);

    // Capture Click on Send button
    window.addEventListener('click', (e) => {
        const target = e.target;
        const sendBtn = target.closest('button');
        if (sendBtn) {
            const ariaLabel = sendBtn.getAttribute('aria-label') || '';
            const isSend = ariaLabel.includes('Send') || ariaLabel.includes('Senden') ||
                sendBtn.querySelector('mat-icon[data-mat-icon-name*="send"]') ||
                sendBtn.getAttribute('data-test-id')?.includes('send');

            if (isSend) {
                console.log('[GeminiTray] Send button clicked. Active prompt:', activePrompt ? activePrompt.name : 'none');
                if (activePrompt) {
                    handleSendWithPrompt(e);
                }
            }
        }
    }, true);

    function focusInputField() {
        // Try multiple selectors to find the input field
        const selectors = [
            '.ql-editor[contenteditable="true"]',
            'div[contenteditable="true"][role="textbox"]',
            'rich-textarea .ql-editor',
            '[aria-label*="Prompt"][contenteditable="true"]',
            '[data-placeholder*="Gemini"][contenteditable="true"]'
        ];

        let inputField = null;
        for (const selector of selectors) {
            inputField = document.querySelector(selector);
            if (inputField) break;
        }

        if (inputField) {
            // Focus the input field
            inputField.focus();

            // Set cursor at the end of content if there's any
            const range = document.createRange();
            const selection = window.getSelection();

            if (inputField.lastChild) {
                range.setStartAfter(inputField.lastChild);
            } else {
                range.setStart(inputField, 0);
            }
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);

            console.log('[GeminiTray] Input field focused');
        } else {
            console.log('[GeminiTray] Could not find input field to focus');
        }
    }

    // Expose API for Electron Main process
    window.__GEMINI_TRAY_SET_PROMPT = function (prompt) {
        activePrompt = prompt;
        updateIndicator();

        // Focus input field after setting the prompt
        if (prompt) {
            // Small delay to ensure UI is ready
            setTimeout(focusInputField, 100);
        }
    };

    console.log('[GeminiTray] Prompt Injection Ready');

})();
