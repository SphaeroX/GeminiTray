/** "0:07", "1:23", "12:05" */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Bar heights (px, 4–20) for the level meter from the most recent RMS levels. Speech RMS is
 * usually 0.01–0.2, so a square-root curve makes quiet speech visible.
 */
export function levelBars(levels: number[], count: number): number[] {
  const recent = levels.slice(-count);
  const padded = [...Array(Math.max(0, count - recent.length)).fill(0), ...recent];
  return padded.map((l) => Math.round(4 + Math.min(1, Math.sqrt(Math.max(0, l)) * 2.2) * 16));
}
