// Gemini bridge – injected into gemini.google.com as initialization script.
// The only code in this project that touches the Gemini page (see AGENTS.md, "One bridge").
//
// Protocol (no IPC permissions needed): Rust calls `__geminiTray.start(id, op, args)` via eval and
// then polls `__geminiTray.poll(id)` with eval_with_callback until it returns a result.
import { attachmentCount, BridgeError, insertImage, insertText, selfTest, send } from "./dom";
import { installEscapeWatch, installMicTracker, isRecording, micStart, micStop, takeText, voiceStatus } from "./mic";

type Result = { ok: true; value: unknown } | { ok: false; code: string; detail: string };

interface Bridge {
  version: number;
  start(id: string, op: string, args: Record<string, unknown>): void;
  poll(id: string): Result | null;
}

declare global {
  interface Window {
    __geminiTray?: Bridge;
  }
}

const VERSION = 3;

function install() {
  if (window.top !== window || window.__geminiTray?.version === VERSION) return;
  installMicTracker(window);
  installEscapeWatch(window);
  const results = new Map<string, Result | null>();

  const ops: Record<string, (args: Record<string, unknown>) => Promise<unknown> | unknown> = {
    insertText: (a) => insertText(document, String(a.text ?? ""), a.append !== false),
    insertImage: (a) => insertImage(document, String(a.png ?? ""), a.name ? String(a.name) : undefined),
    send: () => send(document),
    attachmentCount: () => attachmentCount(document),
    selfTest: () => selfTest(document),
    micStart: () => micStart(document),
    micStop: () => micStop(document),
    isRecording: () => isRecording(document),
    voiceStatus: () => voiceStatus(document),
    takeText: () => takeText(document),
    ping: () => "pong",
  };

  window.__geminiTray = {
    version: VERSION,
    start(id, op, args) {
      results.set(id, null);
      const fn = ops[op];
      if (!fn) {
        results.set(id, { ok: false, code: "unknown_op", detail: op });
        return;
      }
      Promise.resolve()
        .then(() => fn(args ?? {}))
        .then(
          (value) => results.set(id, { ok: true, value: value ?? null }),
          (e: unknown) =>
            results.set(
              id,
              e instanceof BridgeError
                ? { ok: false, code: e.code, detail: e.detail }
                : { ok: false, code: "script", detail: String((e as Error)?.message ?? e) },
            ),
        );
    },
    poll(id) {
      const r = results.get(id) ?? null;
      if (r) results.delete(id);
      return r;
    },
  };
}

install();
