export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Rectangle between two drag points, independent of the drag direction. */
export function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
}

/** "620 × 240" in physical pixels (what ends up in the image). */
export function selectionLabel(r: Rect, devicePixelRatio: number): string {
  const dpr = devicePixelRatio > 0 ? devicePixelRatio : 1;
  return `${Math.round(r.width * dpr)} × ${Math.round(r.height * dpr)}`;
}
