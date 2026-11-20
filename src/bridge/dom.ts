// DOM operations of the Gemini bridge. Every function takes the document so tests can run them
// against saved fixtures in jsdom.
import { SELECTORS, type SelectorName } from "./selectors";

export class BridgeError extends Error {
  constructor(
    public code: "selector_missing" | "timeout" | "not_attached",
    public detail: string,
  ) {
    super(`${code}: ${detail}`);
  }
}

export function find(doc: Document, name: SelectorName, root: ParentNode = doc): HTMLElement | null {
  for (const sel of SELECTORS[name]) {
    try {
      const el = root.querySelector<HTMLElement>(sel);
      if (el) return el;
    } catch {
      // :has() or other selectors may be unsupported in some engines – try the next one.
    }
  }
  return null;
}

function require(doc: Document, name: SelectorName): HTMLElement {
  const el = find(doc, name);
  if (!el) throw new BridgeError("selector_missing", name);
  return el;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitFor<T>(fn: () => T | null | undefined | false, timeoutMs: number, stepMs = 100): Promise<T | null> {
  const end = Date.now() + timeoutMs;
  for (;;) {
    const v = fn();
    if (v) return v;
    if (Date.now() >= end) return null;
    await sleep(stepMs);
  }
}

function editorText(editor: HTMLElement): string {
  return (editor.innerText ?? editor.textContent ?? "").replace(/​/g, "").trim();
}

function placeCaretAtEnd(doc: Document, editor: HTMLElement) {
  const sel = doc.getSelection?.();
  if (!sel) return;
  const range = doc.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function tryExec(doc: Document, command: string, value?: string): boolean {
  try {
    return typeof doc.execCommand === "function" && doc.execCommand(command, false, value);
  } catch {
    return false;
  }
}

/** Fallback for engines without execCommand (jsdom): build Quill-like paragraphs. */
function insertParagraphsManually(doc: Document, editor: HTMLElement, lines: string[], append: boolean) {
  if (!append || !editorText(editor)) editor.replaceChildren();
  for (const line of lines) {
    const p = doc.createElement("p");
    if (line) p.textContent = line;
    else p.appendChild(doc.createElement("br"));
    editor.appendChild(p);
  }
  editor.classList.remove("ql-blank");
  editor.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Insert text into the prompt editor. With `append` (default) existing text is kept and the new
 * text starts in a new paragraph; otherwise the editor is replaced.
 */
export async function insertText(doc: Document, text: string, append = true): Promise<void> {
  const editor = require(doc, "editor");
  editor.focus();
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const hadText = editorText(editor).length > 0;

  if (!append && hadText) {
    tryExec(doc, "selectAll");
    tryExec(doc, "delete");
  }
  placeCaretAtEnd(doc, editor);

  let ok = true;
  if (append && hadText) ok = tryExec(doc, "insertParagraph");
  lines.forEach((line, i) => {
    if (!ok) return;
    if (i > 0) ok = tryExec(doc, "insertParagraph");
    if (ok && line) ok = tryExec(doc, "insertText", line);
  });

  const firstWords = lines.find((l) => l.trim())?.trim().slice(0, 20) ?? "";
  if (!ok || (firstWords && !editorText(editor).includes(firstWords))) {
    insertParagraphsManually(doc, editor, lines, append);
  }
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function countPreviews(root: ParentNode): number {
  const found = new Set<Element>();
  for (const sel of SELECTORS.attachmentPreview) {
    root.querySelectorAll(sel).forEach((e) => found.add(e));
  }
  return found.size;
}

/**
 * Attach a PNG to the prompt by dispatching a file drop on Gemini's drop zone (the same code path
 * as the "+" upload; a synthetic Ctrl+V makes Gemini's upload fail). Resolves when a preview
 * appears; throws `not_attached` otherwise.
 */
export async function insertImage(
  doc: Document,
  pngBase64: string,
  fileName = `screenshot-${Date.now()}.png`,
  confirmTimeoutMs = 4000,
): Promise<void> {
  const zone = require(doc, "dropZone");
  const area = zone.closest("fieldset") ?? zone.parentElement ?? zone;
  const before = countPreviews(area);
  const bytes = base64ToBytes(pngBase64);
  const file = new File([bytes as BlobPart], fileName, { type: "image/png", lastModified: Date.now() });
  const view = doc.defaultView as (Window & typeof globalThis) | null;
  const DT = view?.DataTransfer;
  if (!DT) throw new BridgeError("not_attached", "DataTransfer unavailable");
  const dt = new DT();
  dt.items.add(file);
  for (const type of ["dragenter", "dragover", "drop"]) {
    const ev = new (view!.DragEvent ?? Event)(type, { bubbles: true, cancelable: true, composed: true, dataTransfer: dt } as DragEventInit);
    zone.dispatchEvent(ev);
  }
  const attached = await waitFor(() => countPreviews(area) > before, confirmTimeoutMs);
  if (!attached) throw new BridgeError("not_attached", "no preview appeared");
}

function isEnabled(b: HTMLElement): boolean {
  return !(b as HTMLButtonElement).disabled && b.getAttribute("aria-disabled") !== "true";
}

/** Click the send button. Waits (e.g. while an image uploads) until it is present and enabled. */
export async function send(doc: Document, timeoutMs = 15000): Promise<void> {
  require(doc, "editor");
  const button = await waitFor(() => {
    const b = find(doc, "sendButton");
    return b && isEnabled(b) ? b : null;
  }, timeoutMs);
  if (!button) throw new BridgeError("timeout", "send button not available");
  button.click();
}

export interface SelfTestResult {
  ok: boolean;
  missing: SelectorName[];
}

/** Checks that everything the bridge needs is present on an idle Gemini page. */
export function selfTest(doc: Document): SelfTestResult {
  const missing = (["editor", "dropZone"] as SelectorName[]).filter((n) => !find(doc, n));
  return { ok: missing.length === 0, missing };
}
