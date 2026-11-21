/** "0:07", "1:23", "12:05" */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Number of level bars in the recording pill. */
export const BAR_COUNT = 14;

/** Append the newest microphone level (0..1) and keep the last `count` values, oldest first. */
export function pushLevel(history: number[], level: number, count = BAR_COUNT): number[] {
  const v = Number.isFinite(level) ? Math.min(1, Math.max(0, level)) : 0;
  const next = [...history, v];
  return next.length > count ? next.slice(next.length - count) : next;
}
