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
  voice: { autoSend: true, maxMinutes: 10 },
  window: { opacity: 1, alwaysOnTop: true },
  prompts: [
    { id: "1", name: "Kurz erklären", content: "Erkläre das Folgende in drei Sätzen für Einsteiger:" },
    { id: "2", name: "Fehler erklären", content: "Erkläre diese Fehlermeldung und schlage eine Lösung vor:" },
    { id: "3", name: "Text auf Englisch", content: "Übersetze ins Englische, erkläre schwierige Begriffe:" },
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
  update_status: () => ({ state: "available", version: "2.0.1", notes: null }),
  update_check: () => ({ state: "upToDate" }),
  prompts_menu_data: () => ({ prompts: settings.prompts, activeId: "2" }),
  overlay_image: () => ({
    dataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#3E5468"/><rect x="80" y="60" width="700" height="520" rx="8" fill="#F9F9F9"/><rect x="120" y="110" width="400" height="18" rx="4" fill="#C9CED4"/><rect x="840" y="140" width="360" height="440" rx="8" fill="#2B2B2B"/></svg>',
      ),
    width: 1280,
    height: 720,
  }),
};

function mockExtra(cmd: string, args?: Record<string, unknown>): unknown {
  const h = mockHandlers[cmd];
  return h ? h(args) : null;
}
