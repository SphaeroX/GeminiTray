// Gemini's own voice input (microphone button) – start, stop, and take the recognised text.
//
// "Is it recording?" is answered primarily by tracking the microphone tracks the page opens via
// getUserMedia (installed at document start). Gemini's mic icon alone is ambiguous: it also shows
// "mic_off" when access is blocked, which made the old app's microphone get stuck.
import { BridgeError, find } from "./dom";
import { SELECTORS } from "./selectors";

interface TrackerWindow {
  __gtAudioTracks?: Set<MediaStreamTrack>;
  __gtEscapeAt?: number;
}

/** Remember Escape presses in the Gemini page (cancels voice input; a global Escape hotkey is often taken). */
export function installEscapeWatch(win: Window): void {
  const w = win as Window & TrackerWindow & { __gtEscapeWatch?: boolean };
  if (w.__gtEscapeWatch) return;
  w.__gtEscapeWatch = true;
  win.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") w.__gtEscapeAt = Date.now();
    },
    true,
  );
}

/** Recording state plus "Escape was pressed since the last call" (the flag is cleared). */
export function voiceStatus(doc: Document): { recording: boolean; escape: boolean } {
  const w = doc.defaultView as (Window & TrackerWindow) | null;
  const escape = !!w?.__gtEscapeAt;
  if (w) w.__gtEscapeAt = undefined;
  return { recording: isRecording(doc), escape };
}

/** Wrap getUserMedia to remember live audio tracks. Safe to call more than once. */
export function installMicTracker(win: Window): void {
  const w = win as Window & TrackerWindow;
  const md = win.navigator?.mediaDevices as (MediaDevices & { __gtWrapped?: boolean }) | undefined;
  if (!md || typeof md.getUserMedia !== "function" || md.__gtWrapped) return;
  w.__gtAudioTracks = w.__gtAudioTracks ?? new Set();
  const original = md.getUserMedia.bind(md);
  md.getUserMedia = async (constraints?: MediaStreamConstraints) => {
    const stream = await original(constraints);
    for (const t of stream.getAudioTracks()) {
      w.__gtAudioTracks!.add(t);
      t.addEventListener("ended", () => w.__gtAudioTracks!.delete(t));
    }
    return stream;
  };
  md.__gtWrapped = true;
}

/** Number of microphone tracks the page currently has open. */
export function liveAudioTracks(win: Window): number {
  const set = (win as Window & TrackerWindow).__gtAudioTracks;
  if (!set) return 0;
  let n = 0;
  for (const t of [...set]) {
    if (t.readyState === "live") n++;
    else set.delete(t);
  }
  return n;
}

function inputArea(doc: Document): ParentNode {
  return doc.querySelector("fieldset.input-area-fieldset") ?? doc.querySelector(".text-input-field") ?? doc;
}

export function micButton(doc: Document): HTMLElement | null {
  return find(doc, "micButton", inputArea(doc));
}

/** Visible signs in the input area that Gemini is listening (secondary signal). */
export function domSaysRecording(doc: Document): boolean {
  const area = inputArea(doc);
  for (const sel of SELECTORS.recordingIndicator) {
    try {
      if (area.querySelector(sel)) return true;
    } catch {
      // ignore unsupported selectors
    }
  }
  return micButton(doc)?.getAttribute("aria-pressed") === "true";
}

export function isRecording(doc: Document): boolean {
  const win = doc.defaultView;
  return (win ? liveAudioTracks(win) > 0 : false) || domSaysRecording(doc);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitUntil(fn: () => boolean, timeoutMs: number, stepMs = 100): Promise<boolean> {
  const end = Date.now() + timeoutMs;
  for (;;) {
    if (fn()) return true;
    if (Date.now() >= end) return false;
    await sleep(stepMs);
  }
}

function editorText(doc: Document): string {
  const ed = find(doc, "editor");
  if (!ed) return "";
  // innerText keeps paragraph breaks; engines without layout (jsdom) fall back to the paragraphs.
  const raw =
    typeof ed.innerText === "string" ? ed.innerText : [...ed.children].map((c) => c.textContent ?? "").join("\n");
  return raw.replace(/​/g, "").trim();
}

/** Turn Gemini's microphone on. Resolves once it is listening. */
export async function micStart(doc: Document, timeoutMs = 6000): Promise<void> {
  if (isRecording(doc)) return;
  const button = micButton(doc);
  if (!button) throw new BridgeError("selector_missing", "micButton");
  find(doc, "editor")?.focus();
  button.click();
  if (!(await waitUntil(() => isRecording(doc), timeoutMs))) {
    throw new BridgeError("mic_not_started", button.querySelector("mat-icon")?.getAttribute("fonticon") ?? "");
  }
}

/**
 * Turn Gemini's microphone off and wait until the transcript in the editor stops changing.
 * Returns the editor text afterwards.
 */
export async function micStop(doc: Document, settleMs = 900, maxWaitMs = 10000): Promise<string> {
  if (isRecording(doc)) {
    micButton(doc)?.click();
    await waitUntil(() => !isRecording(doc), 3000);
  }
  // Gemini may still be finalising the last words: wait until the text is stable.
  const end = Date.now() + maxWaitMs;
  let last = editorText(doc);
  let stableSince = Date.now();
  while (Date.now() < end) {
    await sleep(150);
    const now = editorText(doc);
    if (now !== last) {
      last = now;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= settleMs) {
      break;
    }
  }
  return last;
}

/** Cut the whole prompt text: return it and leave the editor empty. */
export async function takeText(doc: Document): Promise<string> {
  const editor = find(doc, "editor");
  if (!editor) throw new BridgeError("selector_missing", "editor");
  const text = editorText(doc);
  editor.focus();
  let cleared = false;
  try {
    cleared = doc.execCommand("selectAll") && doc.execCommand("delete");
  } catch {
    cleared = false;
  }
  if (!cleared || editorText(doc)) {
    const p = doc.createElement("p");
    p.appendChild(doc.createElement("br"));
    editor.replaceChildren(p);
    editor.classList.add("ql-blank");
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
  return text;
}
