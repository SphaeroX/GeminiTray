// This script is injected into the Gemini web page by the main process

(function () {
    // Guard to prevent multiple injections
    if (window.__GEMINI_TRAY_INJECTED) return;
    window.__GEMINI_TRAY_INJECTED = true;

    let activePrompt = null;
    let indicatorElement = null;
    let isHandlingSend = false;
    let isVoiceRecording = false;

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

    function isMicButton(element) {
        if (!element) return false;
        const btn = element.closest('button, [role="button"]');
        if (!btn) return false;

        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const testId = (btn.getAttribute('data-test-id') || btn.getAttribute('data-testid') || '').toLowerCase();
        const className = (typeof btn.className === 'string' ? btn.className : '').toLowerCase();

        const micKeywords = ['mic', 'mikrofon', 'sprache', 'speech', 'voice', 'audio', 'dikt', 'record', 'aufnahme'];
        for (const kw of micKeywords) {
            if (ariaLabel.includes(kw) || title.includes(kw) || testId.includes(kw) || className.includes(kw)) {
                return true;
            }
        }

        if (btn.querySelector('mat-icon[data-mat-icon-name*="mic" i]') ||
            btn.querySelector('mat-icon[data-mat-icon-name*="voice" i]') ||
            btn.querySelector('svg[data-test-id*="mic" i]') ||
            btn.querySelector('svg[data-testid*="mic" i]')) {
            return true;
        }

        return false;
    }

    function isVisible(el) {
        return !!el && (el.offsetParent !== null || el.getClientRects().length > 0);
    }

    // Recording indicators are only searched inside the prompt input area. Page-wide selectors such as
    // button[aria-pressed="true"] or the "stop" icon of the stop-generation button caused false positives,
    // which made the mic toggle immediately stop (or never start) a recording.
    function getInputArea() {
        return document.querySelector('input-area-v2') ||
            document.querySelector('.input-area-container') ||
            document.querySelector('.input-area') ||
            document.querySelector('[class*="input-area"]') ||
            document;
    }

    const STOP_RECORDING_LABEL_SELECTORS = [
        '[aria-label*="Aufnahme beenden" i]',
        '[aria-label*="Aufnahme stoppen" i]',
        '[aria-label*="Spracheingabe beenden" i]',
        '[aria-label*="Spracheingabe stoppen" i]',
        '[aria-label*="Stop recording" i]',
        '[aria-label*="Stop listening" i]',
        '[aria-label*="Stop dictation" i]',
        '[aria-label*="Diktat beenden" i]'
    ];

    function isVoiceRecordingActiveInDOM() {
        const scope = getInputArea();
        const recordingSelectors = [
            ...STOP_RECORDING_LABEL_SELECTORS,
            '[class*="waveform"]',
            '[class*="audio-bar"]',
            '[class*="listening"]',
            '[class*="speech-indicator"]',
            '[class*="mic-active"]',
            '[class*="is-recording"]',
            'mat-icon[data-mat-icon-name*="mic_off" i]'
        ];

        for (const sel of recordingSelectors) {
            try {
                if (isVisible(scope.querySelector(sel))) return true;
            } catch (e) {}
        }

        // A pressed mic toggle also means "recording"
        const micBtn = getMicButton();
        if (micBtn && micBtn.getAttribute('aria-pressed') === 'true') return true;

        return false;
    }

    function getStopRecordingButton() {
        const scope = getInputArea();
        const selectors = [
            ...STOP_RECORDING_LABEL_SELECTORS.map(s => 'button' + s),
            'button mat-icon[data-mat-icon-name*="mic_off" i]'
        ];

        for (const sel of selectors) {
            try {
                const el = scope.querySelector(sel);
                if (isVisible(el)) {
                    return el.closest('button, [role="button"]') || el;
                }
            } catch (e) {}
        }

        // Gemini's mic is a toggle: while recording, clicking it again stops the recording
        return getMicButton();
    }

    // Exactly ONE click. The old code called el.click() AND dispatched a synthetic click,
    // which toggled the mic on and immediately off again (or stopped and restarted it).
    function clickOnce(el) {
        if (!el) return;
        try {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        } catch (e) {}
        el.click();
    }

    async function waitFor(predicate, timeoutMs, intervalMs = 100) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            if (predicate()) return true;
            await new Promise(r => setTimeout(r, intervalMs));
        }
        return predicate();
    }

    async function stopVoiceRecording() {
        isVoiceRecording = false;
        if (!isVoiceRecordingActiveInDOM()) return true;
        const stopBtn = getStopRecordingButton();
        if (!stopBtn) return false;
        clickOnce(stopBtn);
        return waitFor(() => !isVoiceRecordingActiveInDOM(), 1500);
    }

    function isStopButton(element) {
        if (!element) return false;
        const btn = element.closest('button, [role="button"]');
        if (!btn) return false;

        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const testId = (btn.getAttribute('data-test-id') || btn.getAttribute('data-testid') || '').toLowerCase();

        const stopKeywords = [
            'spracheingabe beenden',
            'spracheingabe stoppen',
            'aufnahme beenden',
            'aufnahme stoppen',
            'diktat beenden',
            'stop recording',
            'stop listening',
            'stop dictation'
        ];
        for (const kw of stopKeywords) {
            if (ariaLabel.includes(kw) || title.includes(kw) || testId.includes(kw)) {
                return true;
            }
        }

        if (btn.querySelector('mat-icon[data-mat-icon-name*="mic_off" i]')) {
            return true;
        }

        if (isVoiceRecordingActiveInDOM() && isMicButton(btn)) {
            return true;
        }

        return false;
    }

    async function clearEditorText(editor) {
        if (!editor) return;
        try {
            editor.focus();
            if (editor.tagName === 'TEXTAREA') {
                editor.value = '';
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                editor.dispatchEvent(new Event('change', { bubbles: true }));
                return;
            }

            try {
                document.execCommand('selectAll', false, null);
                document.execCommand('delete', false, null);
            } catch (e) {}

            editor.innerHTML = '<p><br></p>';
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {
            console.warn('[GeminiTray] clearEditorText failed:', e);
            try {
                editor.innerHTML = '<p><br></p>';
                editor.dispatchEvent(new Event('input', { bubbles: true }));
            } catch (inner) {}
        }
    }

    function getMicButton() {
        const selectors = [
            'button[aria-label*="Mikrofon" i]',
            'button[aria-label*="Microphone" i]',
            'button[aria-label*="Spracheingabe" i]',
            'button[aria-label*="speech" i]',
            'button[aria-label*="voice" i]',
            'button[aria-label*="dikt" i]',
            'button[aria-label*="mic" i]',
            'button[aria-label*="audio" i]',
            'button[data-test-id*="mic" i]',
            'button[data-testid*="mic" i]',
            'button[data-test-id*="dictat" i]',
            'button[data-test-id*="speech" i]',
            'button[data-test-id*="voice" i]',
            'button mat-icon[data-mat-icon-name*="mic" i]',
            'button mat-icon[data-mat-icon-name*="voice" i]',
            'button svg[data-test-id*="mic" i]',
            'button svg[data-testid*="mic" i]',
            'speech-dictation-mic button',
            '.speech-dictation button',
            '.speech-mic button',
            '[class*="mic-button"] button',
            'button[class*="mic"]'
        ];

        for (const sel of selectors) {
            try {
                const el = document.querySelector(sel);
                if (el && (el.offsetParent !== null || el.getClientRects().length > 0)) {
                    return el.closest('button, [role="button"]') || el;
                }
            } catch (e) {}
        }

        const allButtons = Array.from(document.querySelectorAll('button, [role="button"]'));
        for (const btn of allButtons) {
            if (isMicButton(btn) && (btn.offsetParent !== null || btn.getClientRects().length > 0)) {
                return btn;
            }
        }

        return null;
    }

    let isActivatingVoice = false;

    async function activateVoiceInput() {
        if (isVoiceRecordingActiveInDOM()) {
            console.log('[GeminiTray] Voice recording already active');
            return true;
        }
        // Ignore repeated triggers while a start is in flight (they would toggle the mic off again)
        if (isActivatingVoice) return false;
        isActivatingVoice = true;
        try {
            return await activateVoiceInputInner();
        } finally {
            isActivatingVoice = false;
        }
    }

    async function activateVoiceInputInner() {
        console.log('[GeminiTray] Attempting to activate voice input...');
        let attempts = 0;
        const maxAttempts = 25; // Try for ~2.5s

        while (attempts < maxAttempts) {
            if (isVoiceRecordingActiveInDOM()) {
                console.log('[GeminiTray] Voice recording is now active');
                return true;
            }

            const micBtn = getMicButton();
            if (micBtn && !micBtn.disabled && micBtn.getAttribute('aria-disabled') !== 'true') {
                console.log('[GeminiTray] Found mic button, triggering click');
                micBtn.focus();
                clickOnce(micBtn);
                isVoiceRecording = true;
                // Starting can take a moment (permission check, audio device). Wait so a second trigger
                // in the meantime is not interpreted as "stop".
                const started = await waitFor(isVoiceRecordingActiveInDOM, 3000);
                if (!started) {
                    console.warn('[GeminiTray] Mic button clicked, but no recording indicator detected');
                }
                return true;
            }

            // Also try focusing the editor so input controls appear
            const editor = getEditor();
            if (editor && attempts % 5 === 0) {
                editor.focus();
            }

            await new Promise(r => setTimeout(r, 100));
            attempts++;
        }

        console.warn('[GeminiTray] Could not find microphone button after multiple attempts');
        return false;
    }

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
            btn.querySelector('mat-icon[data-mat-icon-name*="spark" i]') ||
            btn.querySelector('svg[data-test-id*="send" i]') ||
            btn.querySelector('svg[data-testid*="send" i]') ||
            btn.querySelector('[class*="send-icon" i]')) {
            return true;
        }

        // When voice recording is active, finish/stop/submit buttons also act as send
        const voiceStopKeywords = ['aufnahme beenden', 'spracheingabe beenden', 'stop recording', 'done', 'fertig'];
        for (const kw of voiceStopKeywords) {
            if (ariaLabel.includes(kw) || title.includes(kw) || testId.includes(kw)) {
                return true;
            }
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

        if (editor.tagName === 'TEXTAREA') {
            editor.value = text;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }

        const lines = text.split('\n');

        // Approach 1: Try document.execCommand line-by-line using insertText and insertParagraph
        // This simulates native user typing and triggers native contenteditable mutations
        let execCommandSuccess = false;
        try {
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);

            for (let i = 0; i < lines.length; i++) {
                if (i > 0) {
                    document.execCommand('insertParagraph', false, null);
                }
                if (lines[i]) {
                    document.execCommand('insertText', false, lines[i]);
                }
            }

            const currentText = (editor.innerText || editor.textContent || '').trim();
            const firstLinePrefix = lines[0].trim().substring(0, Math.min(20, lines[0].trim().length));
            if (currentText && (firstLinePrefix.length === 0 || currentText.includes(firstLinePrefix))) {
                execCommandSuccess = true;
                console.log('[GeminiTray] Text inserted via execCommand line-by-line');
            }
        } catch (e) {
            console.warn('[GeminiTray] execCommand line-by-line failed:', e);
        }

        // Approach 2: Direct DOM construction fallback if execCommand was incomplete or failed
        if (!execCommandSuccess) {
            try {
                editor.innerHTML = '';
                lines.forEach(line => {
                    const p = document.createElement('p');
                    if (line) {
                        p.textContent = line;
                    } else {
                        p.appendChild(document.createElement('br'));
                    }
                    editor.appendChild(p);
                });
                console.log('[GeminiTray] Text inserted via direct DOM paragraphs fallback');
            } catch (e) {
                console.error('[GeminiTray] DOM fallback failed:', e);
            }
        }

        // Position cursor at the end of the text
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {}

        // Dispatch input and change events to ensure Angular / Lit / Quill detects the change
        const richTextarea = editor.closest('rich-textarea') || editor.closest('[class*="rich-textarea"]');

        const inputEvents = [
            new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: text }),
            new Event('input', { bubbles: true, composed: true }),
            new Event('change', { bubbles: true, composed: true })
        ];

        inputEvents.forEach(evt => {
            try { editor.dispatchEvent(evt); } catch (e) {}
            if (richTextarea) {
                try { richTextarea.dispatchEvent(evt); } catch (e) {}
            }
        });

        // Delay to allow UI / framework microtasks to sync
        await new Promise(r => setTimeout(r, 100));
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
        
        if (originalEvent) {
            originalEvent.preventDefault();
            originalEvent.stopPropagation();
        }

        try {
            // If voice recording is active, explicitly stop the voice recording first so Gemini finalizes transcription
            if (isVoiceRecording || isVoiceRecordingActiveInDOM()) {
                console.log('[GeminiTray] Voice recording active on send. Triggering stop to obtain transcription...');
                if (isVoiceRecordingActiveInDOM()) {
                    clickOnce(getStopRecordingButton());
                }

                const maxWait = 2500;
                const pollInterval = 100;
                let waited = 0;
                let lastText = (editor.innerText || editor.textContent || '').trim();

                while (waited < maxWait) {
                    await new Promise(r => setTimeout(r, pollInterval));
                    waited += pollInterval;

                    const currentText = (editor.innerText || editor.textContent || '').trim();
                    const isStillRecording = isVoiceRecordingActiveInDOM();

                    if (currentText.length > 0) {
                        if (currentText === lastText && !isStillRecording) {
                            break;
                        }
                        lastText = currentText;
                    } else if (!isStillRecording && waited > 600) {
                        break;
                    }
                }
                await new Promise(r => setTimeout(r, 200));
                isVoiceRecording = false;
            }

            const userText = (editor.innerText || editor.textContent || '').trim();
            const combinedText = userText ? `${currentPrompt.content}\n\n${userText}` : currentPrompt.content;
            console.log('[GeminiTray] Injecting combined prompt text (user text length:', userText.length, ')...');
            
            await setEditorText(editor, combinedText);

            // Deactivate prompt indicator after text insertion
            window.__GEMINI_TRAY_SET_PROMPT(null);

            // Delay before clicking send button so Gemini framework completes internal model sync
            await new Promise(r => setTimeout(r, 200));

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
                console.log('[GeminiTray] Clicking send button with updated prompt content');
                // A second click would hit the "stop generating" button that replaces send
                clickOnce(sendBtn);
            } else {
                console.warn('[GeminiTray] Send button not found or disabled, trying Enter key');
                editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }
        } catch (err) {
            console.error('[GeminiTray] Critical error in handleSendWithPrompt:', err);
        } finally {
            isVoiceRecording = false;
            setTimeout(() => { isHandlingSend = false; }, 1000);
        }
    }

    // --- Dictation (Speech to Clipboard) Mode ---
    let isDictationMode = false;
    let isFinishingDictation = false;
    let dictationResolver = null;
    let dictationMonitorInterval = null;
    let dictationIndicator = null;

    function showDictationIndicator(text) {
        if (!dictationIndicator) {
            dictationIndicator = document.createElement('div');
            dictationIndicator.id = 'gemini-tray-dictation-indicator';
            Object.assign(dictationIndicator.style, {
                position: 'fixed',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#131314',
                color: '#e3e3e3',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #1a73e8',
                zIndex: '999999',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none',
                userSelect: 'none',
                transition: 'all 0.2s ease'
            });
            document.body.appendChild(dictationIndicator);
        }

        const inputContainer = document.querySelector('.input-area-container') ||
            document.querySelector('rich-textarea') ||
            document.querySelector('.input-area') ||
            document.querySelector('[class*="input-area"]');
        if (inputContainer) {
            const rect = inputContainer.getBoundingClientRect();
            if (rect.top > 0) {
                dictationIndicator.style.bottom = (window.innerHeight - rect.top + 16) + 'px';
                dictationIndicator.style.left = (rect.left + rect.width / 2) + 'px';
            }
        }

        dictationIndicator.textContent = text;
        dictationIndicator.style.display = 'flex';
    }

    function hideDictationIndicator() {
        if (dictationIndicator) {
            dictationIndicator.style.display = 'none';
        }
    }

    async function finishDictation(userAlreadyStopped = false) {
        if (!isDictationMode || isFinishingDictation) return;
        isFinishingDictation = true;

        if (dictationMonitorInterval) {
            clearInterval(dictationMonitorInterval);
            dictationMonitorInterval = null;
        }

        try {
            console.log('[GeminiTray] Finishing dictation session...');
            showDictationIndicator('⏳ Kopiere in Zwischenablage...');

            const editor = getEditor();

            // If voice recording is still active in DOM, click the stop button. Skipped when the user
            // clicked stop themselves: the DOM may not have updated yet, and a second click on the
            // mic toggle would start a new recording that is never stopped.
            if (!userAlreadyStopped && isVoiceRecordingActiveInDOM()) {
                clickOnce(getStopRecordingButton());
            }

            // Wait for Gemini transcription to settle into the editor
            const maxWait = 2500;
            const pollInterval = 100;
            let waited = 0;
            let lastText = editor ? (editor.innerText || editor.textContent || '').trim() : '';

            while (waited < maxWait) {
                await new Promise(r => setTimeout(r, pollInterval));
                waited += pollInterval;

                const currentText = editor ? (editor.innerText || editor.textContent || '').trim() : '';
                const stillRecording = isVoiceRecordingActiveInDOM();

                if (currentText.length > 0) {
                    if (currentText === lastText && !stillRecording && waited >= 300) {
                        break;
                    }
                    lastText = currentText;
                } else if (!stillRecording && waited >= 500) {
                    break;
                }
            }

            const finalText = editor ? (editor.innerText || editor.textContent || '').trim() : '';
            console.log('[GeminiTray] Dictation transcription finished. Text length:', finalText.length);

            // Copy to clipboard in renderer
            if (finalText) {
                try {
                    await navigator.clipboard.writeText(finalText);
                    console.log('[GeminiTray] Copied to navigator.clipboard');
                } catch (e) {
                    console.warn('[GeminiTray] navigator.clipboard.writeText failed (will rely on main process):', e);
                }
            }

            // Clear editor so it is completely empty again
            if (editor) {
                await clearEditorText(editor);
            }

            hideDictationIndicator();

            if (dictationResolver) {
                const resolve = dictationResolver;
                dictationResolver = null;
                resolve(finalText);
            }
        } catch (err) {
            console.error('[GeminiTray] Error in finishDictation:', err);
            hideDictationIndicator();
            if (dictationResolver) {
                const resolve = dictationResolver;
                dictationResolver = null;
                resolve(null);
            }
        } finally {
            isDictationMode = false;
            isFinishingDictation = false;
            isVoiceRecording = false;
        }
    }

    function cancelDictation() {
        if (dictationMonitorInterval) {
            clearInterval(dictationMonitorInterval);
            dictationMonitorInterval = null;
        }
        hideDictationIndicator();
        const wasDictating = isDictationMode;
        isDictationMode = false;
        isFinishingDictation = false;
        isVoiceRecording = false;
        // Release the microphone instead of leaving a recording running in the background
        if (wasDictating) stopVoiceRecording();
        if (dictationResolver) {
            const resolve = dictationResolver;
            dictationResolver = null;
            resolve(null);
        }
    }

    function startDictation() {
        if (isDictationMode) {
            console.log('[GeminiTray] Dictation already active, stopping...');
            finishDictation();
            return;
        }

        return new Promise(async (resolve) => {
            dictationResolver = resolve;
            isDictationMode = true;
            isFinishingDictation = false;

            // Clear any prior editor content
            const editor = getEditor();
            if (editor) {
                await clearEditorText(editor);
            }

            showDictationIndicator('🎙️ Diktat aktiv – Sprich & klicke auf Stopp');

            const activated = await activateVoiceInput();
            if (!activated) {
                console.warn('[GeminiTray] Failed to activate voice input for dictation');
                cancelDictation();
                return;
            }

            // Start monitoring recording status
            let recordingHadStarted = false;
            let inactiveCount = 0;
            const monitorStartedAt = Date.now();
            const START_TIMEOUT_MS = 8000;
            const MAX_DICTATION_MS = 10 * 60 * 1000;

            dictationMonitorInterval = setInterval(() => {
                if (!isDictationMode || isFinishingDictation) {
                    clearInterval(dictationMonitorInterval);
                    dictationMonitorInterval = null;
                    return;
                }

                const elapsed = Date.now() - monitorStartedAt;
                // Watchdog: without it a recording that never started kept dictation mode active
                // forever, and every later mic click was treated as "stop dictation".
                if ((!recordingHadStarted && elapsed > START_TIMEOUT_MS) || elapsed > MAX_DICTATION_MS) {
                    console.warn('[GeminiTray] Dictation watchdog fired, ending dictation');
                    if (recordingHadStarted) {
                        finishDictation();
                    } else {
                        cancelDictation();
                    }
                    return;
                }

                const currentlyRecording = isVoiceRecordingActiveInDOM();
                if (currentlyRecording) {
                    recordingHadStarted = true;
                    inactiveCount = 0;
                } else if (recordingHadStarted) {
                    inactiveCount++;
                    // If recording was active and now has been inactive for ~400ms, finalize!
                    if (inactiveCount >= 2) {
                        console.log('[GeminiTray] Voice recording ended in DOM, finalizing dictation');
                        clearInterval(dictationMonitorInterval);
                        dictationMonitorInterval = null;
                        finishDictation();
                    }
                }
            }, 200);
        });
    }

    // --- Event Listeners ---

    // Capture Enter key (using capture phase for maximum priority)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && activePrompt) {
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

    // Capture Click on Send / Mic button
    window.addEventListener('click', (e) => {
        // Synthetic clicks issued by this script must not be re-interpreted here
        if (!e.isTrusted) return;

        if (isDictationMode && !isFinishingDictation) {
            if (isStopButton(e.target)) {
                console.log('[GeminiTray] Stop button clicked during dictation mode');
                setTimeout(() => {
                    finishDictation(true);
                }, 50);
                return;
            }
        }

        // Mic clicks always go straight to Gemini. Previously a mic click with a stale
        // isVoiceRecording flag fell through to the send handling below, which called
        // preventDefault()/stopPropagation() and swallowed the click.
        if (isMicButton(e.target) && !isSendButton(e.target)) {
            isVoiceRecording = !isVoiceRecordingActiveInDOM();
            return;
        }

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

    window.__GEMINI_TRAY_ACTIVATE_VOICE = async function () {
        // Toggle: a second press stops a running recording
        if (isVoiceRecordingActiveInDOM()) {
            console.log('[GeminiTray] Voice recording active, stopping via shortcut');
            await stopVoiceRecording();
            return true;
        }
        return activateVoiceInput();
    };

    window.__GEMINI_TRAY_STOP_VOICE = function () {
        if (isDictationMode) {
            cancelDictation();
            return true;
        }
        return stopVoiceRecording();
    };

    window.__GEMINI_TRAY_START_DICTATION = function () {
        return startDictation();
    };

    window.__GEMINI_TRAY_STOP_DICTATION = function () {
        return finishDictation();
    };

    window.__GEMINI_TRAY_CANCEL_DICTATION = function () {
        return cancelDictation();
    };

    console.log('[GeminiTray] Enhanced Prompt Injection Ready');
})();


