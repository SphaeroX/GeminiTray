import type { Level, Notification } from "./api";

type T = (key: string, params?: Record<string, unknown>) => string;
type TE = (key: string) => boolean;

/** Title and body for a notification; unknown keys fall back to the detail text. */
export function toastText(t: T, te: TE, n: Notification): { title: string; body: string } {
  const base = `toast.${n.key}`;
  const params = { detail: n.detail ?? "" };
  if (!te(`${base}.title`)) return { title: n.detail ?? n.key, body: "" };
  let body = te(`${base}.body`) ? t(`${base}.body`, params) : "";
  if (!body && n.detail) body = n.detail;
  return { title: t(`${base}.title`, params), body };
}

/** How long a toast stays visible (ms). Errors stay longer. */
export function toastTimeout(level: Level): number {
  return level === "error" ? 9000 : level === "warning" ? 7000 : 4500;
}
