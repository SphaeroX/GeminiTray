import { describe, expect, it } from "vitest";
import { displayAccelerator, recordKey, type KeyLike } from "../../src/lib/accelerator";
import { resolveLanguage } from "../../src/lib/i18n";
import { toastText, toastTimeout } from "../../src/lib/toast";
import de from "../../src/locales/de.json";
import en from "../../src/locales/en.json";

const key = (over: Partial<KeyLike>): KeyLike => ({
  key: "",
  code: "",
  altKey: false,
  ctrlKey: false,
  shiftKey: false,
  metaKey: false,
  ...over,
});

describe("shortcut recorder", () => {
  it("builds Tauri accelerators in a fixed modifier order", () => {
    expect(recordKey(key({ key: "S", code: "KeyS", altKey: true, shiftKey: true }))).toEqual({
      kind: "done",
      accelerator: "Alt+Shift+S",
    });
    expect(recordKey(key({ key: " ", code: "Space", altKey: true }))).toEqual({ kind: "done", accelerator: "Alt+Space" });
    expect(recordKey(key({ key: "v", code: "KeyV", ctrlKey: true, altKey: true }))).toEqual({
      kind: "done",
      accelerator: "Ctrl+Alt+V",
    });
    expect(recordKey(key({ key: "7", code: "Digit7", metaKey: true }))).toEqual({ kind: "done", accelerator: "Super+7" });
  });

  it("waits while only modifiers are held", () => {
    expect(recordKey(key({ key: "Alt", code: "AltLeft", altKey: true }))).toEqual({ kind: "pending" });
    expect(recordKey(key({ key: "Shift", code: "ShiftLeft", shiftKey: true }))).toEqual({ kind: "pending" });
  });

  it("requires a modifier except for function keys", () => {
    expect(recordKey(key({ key: "a", code: "KeyA" }))).toEqual({ kind: "needsModifier" });
    expect(recordKey(key({ key: "A", code: "KeyA", shiftKey: true }))).toEqual({ kind: "needsModifier" });
    expect(recordKey(key({ key: "F9", code: "F9" }))).toEqual({ kind: "done", accelerator: "F9" });
  });

  it("supports cancel and clear", () => {
    expect(recordKey(key({ key: "Escape", code: "Escape" }))).toEqual({ kind: "cancel" });
    expect(recordKey(key({ key: "Delete", code: "Delete" }))).toEqual({ kind: "clear" });
    expect(recordKey(key({ key: "Backspace", code: "Backspace" }))).toEqual({ kind: "clear" });
  });

  it("displays accelerators per language", () => {
    expect(displayAccelerator("Ctrl+Alt+V", "de")).toBe("Strg + Alt + V");
    expect(displayAccelerator("Ctrl+Alt+V", "en")).toBe("Ctrl + Alt + V");
    expect(displayAccelerator("Super+Space", "en")).toBe("Win + Space");
  });
});

function keys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("translations", () => {
  it("German and English have the same keys", () => {
    expect(keys(de).sort()).toEqual(keys(en).sort());
  });

  it("no translation is empty except intentional empty bodies", () => {
    const empty = (obj: unknown) =>
      keys(obj).filter((k) => {
        const v = k.split(".").reduce<any>((o, p) => o[p], obj);
        return v === "" && !k.endsWith(".body");
      });
    expect(empty(de)).toEqual([]);
    expect(empty(en)).toEqual([]);
  });

  it("resolves the UI language", () => {
    expect(resolveLanguage("system", "de-AT")).toBe("de");
    expect(resolveLanguage("system", "fr-FR")).toBe("en");
    expect(resolveLanguage("en", "de-DE")).toBe("en");
  });
});

describe("toasts", () => {
  const dict: Record<string, string> = {
    "toast.login.failed.title": "Anmeldung fehlgeschlagen",
    "toast.login.failed.body": "{detail}",
    "toast.x.title": "X",
  };
  const t = (k: string, p?: Record<string, unknown>) => dict[k].replace("{detail}", String(p?.detail ?? ""));
  const te = (k: string) => k in dict;

  it("fills the detail into the body", () => {
    expect(toastText(t, te, { level: "error", key: "login.failed", detail: "Timeout" })).toEqual({
      title: "Anmeldung fehlgeschlagen",
      body: "Timeout",
    });
  });

  it("shows the detail when the key has no body", () => {
    expect(toastText(t, te, { level: "info", key: "x", detail: "Hallo" }).body).toBe("Hallo");
  });

  it("falls back to the detail for unknown keys", () => {
    expect(toastText(t, te, { level: "info", key: "unknown", detail: "Text" }).title).toBe("Text");
  });

  it("keeps errors longer than infos", () => {
    expect(toastTimeout("error")).toBeGreaterThan(toastTimeout("info"));
  });
});
