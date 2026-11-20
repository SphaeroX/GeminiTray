// Development-only stand-in for the Rust backend, so the app's pages can be previewed in a normal
// browser (`npm run dev` → http://localhost:1420/settings.html). Never used inside Tauri.
import type { Settings, SettingsView } from "./api";

const params = new URLSearchParams(location.search);
const german = navigator.language.startsWith("de");
/** `?shot` = screenshot mode (scripts/screenshots.mjs): no simulated errors, real version number. */
const shot = params.has("shot");

const samplePrompts = german
  ? [
      { id: "1", name: "Kurz erklären", content: "Erkläre das Folgende in drei Sätzen für Einsteiger:" },
      { id: "2", name: "Fehler erklären", content: "Erkläre diese Fehlermeldung und schlage eine Lösung vor:" },
      { id: "3", name: "Text auf Englisch", content: "Übersetze ins Englische, erkläre schwierige Begriffe:" },
    ]
  : [
      { id: "1", name: "Explain briefly", content: "Explain the following in three sentences for beginners:" },
      { id: "2", name: "Explain an error", content: "Explain this error message and suggest a fix:" },
      { id: "3", name: "Polish my text", content: "Fix grammar and style, keep my tone:" },
    ];

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
  prompts: samplePrompts,
};

function view(): SettingsView {
  return {
    settings: JSON.parse(JSON.stringify(settings)),
    shortcutFailures: shot ? [] : ["toggle"],
    language: german ? "de" : "en",
    version: params.get("version") ?? "2.0.0-dev",
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
        {
          level: "success",
          key: "voice.copied",
          detail: german ? "„Termin am Donnerstag um zehn passt mir gut.“" : "“Thursday at ten works great for me.”",
        },
        ...(shot ? [] : [{ level: "warning", key: "login.required", detail: null }]),
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
    // A made-up desktop (code editor with an error + a chart) as the frozen screen for the overlay preview.
    dataUrl: "data:image/svg+xml;utf8," + encodeURIComponent(sampleDesktop()),
    width: 1280,
    height: 720,
  }),
};

function mockExtra(cmd: string, args?: Record<string, unknown>): unknown {
  const h = mockHandlers[cmd];
  return h ? h(args) : null;
}

function sampleDesktop(): string {
  const code = [
    ["#569cd6", "async function", "#dcdcaa", " loadConfig", "#d4d4d4", "(path) {"],
    ["#c586c0", "  const", "#9cdcfe", " raw", "#d4d4d4", " = await readFile(path, \"utf8\");"],
    ["#9cdcfe", "  return", "#d4d4d4", " JSON.parse(raw).settings", "#d4d4d4", ";"],
    ["#d4d4d4", "}", "#d4d4d4", "", "#d4d4d4", ""],
  ];
  const lines = code
    .map(
      (l, i) =>
        `<text x="110" y="${190 + i * 34}" font-family="Consolas,monospace" font-size="20"><tspan fill="${l[0]}">${l[1]}</tspan><tspan fill="${l[2]}">${l[3]}</tspan><tspan fill="${l[4]}">${l[5]}</tspan></text>`,
    )
    .join("");
  const bars = [120, 180, 150, 240, 210, 300]
    .map((h, i) => `<rect x="${880 + i * 50}" y="${560 - h}" width="32" height="${h}" rx="4" fill="#60cdff" opacity="${0.5 + i * 0.08}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
    <defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d3a6e"/><stop offset="1" stop-color="#4a2a6a"/></linearGradient></defs>
    <rect width="1280" height="720" fill="url(#w)"/>
    <rect x="80" y="100" width="700" height="480" rx="8" fill="#1e1e1e"/>
    <rect x="80" y="100" width="700" height="40" rx="8" fill="#2d2d2d"/>
    <text x="104" y="126" font-family="Segoe UI,sans-serif" font-size="14" fill="#c8c8c8">config.js</text>
    ${lines}
    <rect x="110" y="410" width="610" height="110" rx="6" fill="#3b1e1e" stroke="#f14c4c"/>
    <text x="130" y="448" font-family="Consolas,monospace" font-size="18" fill="#f48771">SyntaxError: Unexpected token } in JSON</text>
    <text x="130" y="480" font-family="Consolas,monospace" font-size="18" fill="#f48771">  at position 214 (config.js:3)</text>
    <rect x="840" y="160" width="360" height="420" rx="8" fill="#f9f9f9"/>
    <text x="870" y="205" font-family="Segoe UI,sans-serif" font-size="20" font-weight="600" fill="#1a1a1a">Weekly sign-ups</text>
    ${bars}
  </svg>`;
}
