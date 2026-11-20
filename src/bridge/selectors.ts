// All DOM selectors for gemini.google.com in one place. Tried in order; first match wins.
// Last verified against the live page: 2026-11-20 (German UI, signed out).
// When Google changes the page, update this file and the fixtures in tests/ui/fixtures/.

export const SELECTORS = {
  /** The prompt editor (Quill, contenteditable). */
  editor: [
    'rich-textarea .ql-editor[contenteditable="true"]',
    'div.ql-editor[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"][role="textbox"]',
  ],
  /** Element that accepts file drops (same path as the "+" upload). */
  dropZone: ["[xapfileselectordropzone]", ".text-input-field", "rich-textarea"],
  /** Send button – only present while the editor has content. */
  sendButton: [
    ".send-button button",
    'button[aria-label*="senden" i]',
    'button[aria-label*="send" i]',
    'button:has(mat-icon[fonticon="arrow_upward"])',
    'button:has(mat-icon[fonticon="send"])',
  ],
  /** Gemini's microphone (voice input) button inside the input area. */
  micButton: [
    "speech-dictation-mic-button button",
    'button:has(mat-icon[fonticon="mic"])',
    'button:has(mat-icon[fonticon="mic_off"])',
    'button[aria-label*="Spracheingabe" i]',
    'button[aria-label*="voice" i]',
    'button[aria-label*="Mikrofon" i]',
    'button[aria-label*="microphone" i]',
  ],
  /** Visible signs that Gemini is listening (secondary signal, see bridge/mic.ts). */
  recordingIndicator: [
    '[aria-label*="Spracheingabe beenden" i]',
    '[aria-label*="Spracheingabe stoppen" i]',
    '[aria-label*="Aufnahme beenden" i]',
    '[aria-label*="Stop recording" i]',
    '[aria-label*="Stop listening" i]',
    '[aria-label*="Stop dictation" i]',
    '[class*="is-recording"]',
    '[class*="listening"]',
    '[class*="waveform"]',
  ],
  /** Anything that shows an attached file inside the input area. */
  attachmentPreview: [
    "uploader-file-preview",
    "uploader-file-preview-container",
    '[class*="file-preview"]',
    '[class*="thumbnail"]',
    'img[src^="blob:"]',
    '[class*="attachment"]',
  ],
} as const;

export type SelectorName = keyof typeof SELECTORS;
