// Converting keyboard events into Tauri accelerator strings ("Alt+Shift+S") and back for display.

export type RecordResult =
  | { kind: "pending" } // only modifiers pressed so far
  | { kind: "clear" } // Delete/Backspace without modifiers
  | { kind: "cancel" } // Escape
  | { kind: "needsModifier" }
  | { kind: "done"; accelerator: string };

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta", "AltGraph", "OS"]);

/** Maps `KeyboardEvent.code` to the key names understood by Tauri's global-shortcut parser. */
export function keyFromCode(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code;
  if (/^Numpad[0-9]$/.test(code)) return `Num${code.slice(6)}`;
  const map: Record<string, string> = {
    Space: "Space",
    Enter: "Enter",
    Tab: "Tab",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
    Insert: "Insert",
    Minus: "Minus",
    Equal: "Equal",
    Comma: "Comma",
    Period: "Period",
    Slash: "Slash",
    Backslash: "Backslash",
    Semicolon: "Semicolon",
    Quote: "Quote",
    BracketLeft: "BracketLeft",
    BracketRight: "BracketRight",
    Backquote: "Backquote",
    PrintScreen: "PrintScreen",
    Pause: "Pause",
  };
  return map[code] ?? null;
}

export interface KeyLike {
  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export function recordKey(e: KeyLike): RecordResult {
  const hasModifier = e.altKey || e.ctrlKey || e.metaKey;
  if (MODIFIER_KEYS.has(e.key)) return { kind: "pending" };
  if (e.key === "Escape" && !hasModifier && !e.shiftKey) return { kind: "cancel" };
  if ((e.key === "Delete" || e.key === "Backspace") && !hasModifier && !e.shiftKey) return { kind: "clear" };
  const key = keyFromCode(e.code);
  if (!key) return { kind: "needsModifier" };
  const isFunctionKey = /^F\d+$/.test(key);
  if (!hasModifier && !isFunctionKey) return { kind: "needsModifier" };
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");
  if (e.metaKey) parts.push("Super");
  parts.push(key);
  return { kind: "done", accelerator: parts.join("+") };
}

/** "Ctrl+Shift+S" → "Strg + Shift + S" (German) for display. */
export function displayAccelerator(accel: string, lang: "de" | "en"): string {
  const names: Record<string, string> =
    lang === "de"
      ? { Ctrl: "Strg", Super: "Win" }
      : { Super: "Win" };
  return accel
    .split("+")
    .map((p) => names[p] ?? p)
    .join(" + ");
}
