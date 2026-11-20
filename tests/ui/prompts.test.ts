import { describe, expect, it } from "vitest";
import { filterPrompts, moveItem, moveSelection, newId, previewContent } from "../../src/lib/prompts";

const prompts = [
  { id: "1", name: "Kurz erklären", content: "Erkläre das Folgende in drei Sätzen" },
  { id: "2", name: "Fehler erklären", content: "Erkläre diese Fehlermeldung" },
  { id: "3", name: "Text auf Englisch", content: "Übersetze ins Englische" },
];

describe("prompt menu", () => {
  it("searches name and content, ignoring case and umlauts", () => {
    expect(filterPrompts(prompts, "").map((p) => p.id)).toEqual(["1", "2", "3"]);
    expect(filterPrompts(prompts, "fehler").map((p) => p.id)).toEqual(["2"]);
    expect(filterPrompts(prompts, "erklaren").map((p) => p.id)).toEqual(["1", "2"]);
    expect(filterPrompts(prompts, "uebersetze").map((p) => p.id)).toEqual([]);
    expect(filterPrompts(prompts, "ubersetze").map((p) => p.id)).toEqual(["3"]);
    expect(filterPrompts(prompts, "drei kurz").map((p) => p.id)).toEqual(["1"]);
  });

  it("wraps keyboard selection", () => {
    expect(moveSelection(0, 1, 3)).toBe(1);
    expect(moveSelection(2, 1, 3)).toBe(0);
    expect(moveSelection(0, -1, 3)).toBe(2);
    expect(moveSelection(0, 1, 0)).toBe(-1);
  });

  it("reorders prompts", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b", "c"], 2, 1)).toEqual(["a", "b", "c"]);
  });

  it("creates unique ids and short previews", () => {
    expect(newId()).not.toBe(newId());
    expect(previewContent("Zeile 1\nZeile 2")).toBe("Zeile 1");
    expect(previewContent("x".repeat(100), 10)).toBe(`${"x".repeat(9)}…`);
  });
});
