import type { Prompt } from "./api";

const fold = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Prompts whose name or content contains every word of the query (case/umlaut-insensitive). */
export function filterPrompts(prompts: Prompt[], query: string): Prompt[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return prompts;
  return prompts.filter((p) => {
    const hay = fold(`${p.name} ${p.content}`);
    return words.every((w) => hay.includes(w));
  });
}

/** Keyboard navigation with wrap-around. */
export function moveSelection(index: number, delta: number, count: number): number {
  if (count <= 0) return -1;
  return (((index + delta) % count) + count) % count;
}

/** Move a list item up (-1) or down (+1); returns a new array. */
export function moveItem<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** First line of the content, shortened for the menu. */
export function previewContent(content: string, max = 70): string {
  const line = content.trim().split("\n")[0] ?? "";
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}
