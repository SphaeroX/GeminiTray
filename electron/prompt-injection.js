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
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #444746',
                zIndex: '99999',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                fontSize: '14px',
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'none',
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
            alignItems: 'flex-start'
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
            document.querySelector('button mat-icon[data-mat-icon-name="send_spark"]')?.closest('button') ||
            document.querySelector('button mat-icon[data-mat-icon-name="send"]')?.closest('button');
    }

    function getEditor() {
        return document.querySelector('.ql-editor[contenteditable="true"]') ||
            document.querySelector('div[contenteditable="true"]');
    }

    async function handleSendWithPrompt(originalEvent) {
        if (!activePrompt) return;

        // Capture active prompt immediately to avoid race conditions if it gets nulled
        const currentPrompt = activePrompt;

        const editor = getEditor();
        if (!editor) return;

        // 1. Get current user text
        const userText = editor.innerText;

        // Prevent default only if we are actually going to handle it
        if (originalEvent) {
            originalEvent.preventDefault();
            originalEvent.stopPropagation();
            originalEvent.stopImmediatePropagation();
        }

        // 2. Clear current content and replace with combined text
        editor.focus();
        document.execCommand('selectAll', false, null);
        await new Promise(r => setTimeout(r, 10));

        const combinedText = `${currentPrompt.content}\n\n${userText}`;
        document.execCommand('insertText', false, combinedText);

        // 3. Find and click send button
        await new Promise(r => setTimeout(r, 100)); // Increased wait time for UI update
        const sendBtn = getSendButton();

        if (sendBtn && !sendBtn.disabled) {
            // Clear active prompt BEFORE clicking send to avoid double-handling if enter is pressed again rapidly
            // But we already captured currentPrompt so we are safe.
            window.__GEMINI_TRAY_SET_PROMPT(null);

            // Dispatch a proper click event
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            sendBtn.dispatchEvent(clickEvent);

        } else {
            console.warn('[GeminiTray] Send button not found or disabled');
            // If we fail to send, we should probably NOT clear the prompt so the user can try again?
            // Or maybe we should, to avoid stuck state. Let's keep it but log.
        }
    }

    // Capture Enter key on the window/document level
    window.addEventListener('keydown', (e) => {
        if (!activePrompt) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            const target = e.target;
            const isEditor = target.getAttribute('contenteditable') === 'true' ||
                target.classList.contains('ql-editor') ||
                target.closest('rich-textarea');

            if (isEditor) {
                handleSendWithPrompt(e);
            }
        }
    }, true);

    // Capture Click on Send button
    window.addEventListener('click', (e) => {
        if (!activePrompt) return;

        const target = e.target;
        const sendBtn = target.closest('button');
        if (sendBtn) {
            const ariaLabel = sendBtn.getAttribute('aria-label') || '';
            const isSend = ariaLabel.includes('Send') || ariaLabel.includes('Senden') ||
                sendBtn.querySelector('mat-icon[data-mat-icon-name*="send"]');

            if (isSend) {
                handleSendWithPrompt(e);
            }
        }
    }, true);

    // Expose API for Electron Main process
    window.__GEMINI_TRAY_SET_PROMPT = function (prompt) {
        activePrompt = prompt;
        updateIndicator();
    };

    console.log('[GeminiTray] Prompt Injection Ready');

})();
