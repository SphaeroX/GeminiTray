// Typed wrappers around the Rust commands.
import { invoke as tauriInvoke, isTauri } from "@tauri-apps/api/core";

/** Calls Rust; in a plain browser during development a mock answers instead. */
async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri()) return tauriInvoke<T>(cmd, args);
  if (import.meta.env.DEV) {
    const { mockInvoke } = await import("./devmock");
    return (await mockInvoke(cmd, args)) as T;
  }
  throw new Error(`Tauri backend not available for ${cmd}`);
}

export type ShortcutAction = "toggle" | "voice" | "dictation" | "screenshot" | "newChat" | "prompts";
export const SHORTCUT_ACTIONS: ShortcutAction[] = ["toggle", "voice", "dictation", "screenshot", "newChat", "prompts"];

export type Shortcuts = Record<ShortcutAction, string>;

export interface Prompt {
  id: string;
  name: string;
  content: string;
}

export interface Settings {
  schemaVersion: number;
  language: "system" | "de" | "en";
  autostart: boolean;
  startMinimized: boolean;
  shortcuts: Shortcuts;
  voice: { autoSend: boolean; microphone: string | null; maxMinutes: number };
  window: { opacity: number; alwaysOnTop: boolean };
  prompts: Prompt[];
}

export interface SettingsView {
  settings: Settings;
  shortcutFailures: ShortcutAction[];
  language: "de" | "en";
  version: string;
}

export type ShortcutProblem =
  | { kind: "invalid"; action: ShortcutAction }
  | { kind: "duplicate"; action: ShortcutAction; other: ShortcutAction }
  | { kind: "taken"; action: ShortcutAction };

export type SaveError = { kind: "shortcuts"; problems: ShortcutProblem[] } | { kind: "io"; message: string };

export interface ModelStatus {
  installed: boolean;
  downloading: boolean;
  downloaded: number;
  total: number;
  error: string | null;
}

export interface IndicatorState {
  phase: "idle" | "recording" | "transcribing";
  mode?: "dictation" | "message";
  prompt: string | null;
  error: "accessDenied" | "noDevice" | "device" | null;
}

export type UpdateStatus =
  | { state: "disabled" | "idle" | "checking" | "upToDate" }
  | { state: "available"; version: string; notes: string | null }
  | { state: "downloading"; percent: number }
  | { state: "error"; message: string };

export type Level = "info" | "success" | "warning" | "error";
export interface Notification {
  level: Level;
  key: string;
  detail: string | null;
}

export const api = {
  getSettings: () => invoke<SettingsView>("get_settings"),
  updateSettings: (settings: Settings) => invoke<SettingsView>("update_settings", { settings }),
  pauseShortcuts: () => invoke<void>("pause_shortcuts"),
  resumeShortcuts: () => invoke<void>("resume_shortcuts"),
  openSettings: (category?: string) => invoke<void>("open_settings", { category }),
  loginWithBrowser: () => invoke<void>("login_with_browser"),
  resetSession: () => invoke<void>("reset_session"),
  showGemini: () => invoke<void>("show_gemini"),
  closeWindow: () => invoke<void>("close_window"),
  autostartEnabled: () => invoke<boolean>("autostart_enabled"),
  toastReady: () => invoke<Notification[]>("toast_ready"),
  toastIdle: () => invoke<void>("toast_idle"),
  modelStatus: () => invoke<ModelStatus>("model_status"),
  modelDownload: () => invoke<void>("model_download"),
  modelCancel: () => invoke<void>("model_cancel"),
  voiceFinish: () => invoke<void>("voice_finish"),
  voiceCancel: () => invoke<void>("voice_cancel"),
  voiceDismiss: () => invoke<void>("voice_dismiss"),
  openMicPrivacy: () => invoke<void>("open_mic_privacy"),
  listMicrophones: () => invoke<string[]>("list_microphones"),
  promptsMenuData: () => invoke<{ prompts: Prompt[]; activeId: string | null }>("prompts_menu_data"),
  promptSelect: (id: string) => invoke<void>("prompt_select", { id }),
  promptClear: () => invoke<void>("prompt_clear"),
  promptsClose: () => invoke<void>("prompts_close"),
  updateStatus: () => invoke<UpdateStatus>("update_status"),
  updateCheck: () => invoke<UpdateStatus>("update_check"),
  updateInstall: () => invoke<void>("update_install"),
  openReleases: () => invoke<void>("open_releases"),
  titlebarAction: (action: string) => invoke<void>("titlebar_action", { action }),
  overlayImage: (index: number) => invoke<{ dataUrl: string; width: number; height: number }>("overlay_image", { index }),
  overlayCancel: () => invoke<void>("overlay_cancel"),
  overlaySelect: (index: number, rect: { x: number; y: number; width: number; height: number }) =>
    invoke<void>("overlay_select", { index, rect }),
};
