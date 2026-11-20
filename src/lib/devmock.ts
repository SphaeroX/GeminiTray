// Development-only stand-in for the Rust backend, so the app's pages can be previewed in a normal
// browser (`npm run dev` → http://localhost:1420/settings.html). Never used inside Tauri.
import type { Settings, SettingsView } from "./api";

const settings: Settings = {
  schemaVersion: 1,
  language: "system",
  autostart: false,
  startMinimized: true,
  shortcuts: {
    toggle: "Alt+Space",
    voice: "Alt+V",
    dictation: "Alt+Shift+V",
    screenshot: "Alt+Shift+S",
    newChat: "Alt+N",
    prompts: "Alt+J",
  },
  voice: { autoSend: true, microphone: null, maxMinutes: 10 },
  window: { opacity: 1, alwaysOnTop: true },
  prompts: [
    { id: "1", name: "Kurz erklären", content: "Erkläre das Folgende in drei Sätzen für Einsteiger:" },
    { id: "2", name: "Fehler erklären", content: "Erkläre diese Fehlermeldung und schlage eine Lösung vor:" },
  ],
};

function view(): SettingsView {
  return {
    settings: JSON.parse(JSON.stringify(settings)),
    shortcutFailures: ["toggle"],
    language: navigator.language.startsWith("de") ? "de" : "en",
    version: "2.0.0-dev",
  };
}

export async function mockInvoke(cmd: string, args?: Record<string, unknown>): Promise<unknown> {
  switch (cmd) {
    case "get_settings":
      return view();
    case "update_settings":
      Object.assign(settings, args?.settings);
      return view();
    case "toast_ready":
      return [
        { level: "success", key: "x", detail: "Text kopiert" },
        { level: "warning", key: "login.required", detail: null },
      ];
    default:
      return mockExtra(cmd, args);
  }
}

// Extended by later features (microphones, model status …).
export const mockHandlers: Record<string, (args?: Record<string, unknown>) => unknown> = {
  model_status: () => ({ installed: false, downloading: true, downloaded: 412_000_000, total: 670_480_000, error: null }),
};

function mockExtra(cmd: string, args?: Record<string, unknown>): unknown {
  const h = mockHandlers[cmd];
  return h ? h(args) : null;
}
