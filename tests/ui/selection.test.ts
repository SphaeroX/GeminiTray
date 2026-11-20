import { describe, expect, it } from "vitest";
import { normalizeRect, selectionLabel } from "../../src/lib/selection";

describe("screenshot selection", () => {
  it("normalises any drag direction", () => {
    const r = { x: 10, y: 20, width: 90, height: 40 };
    expect(normalizeRect({ x: 10, y: 20 }, { x: 100, y: 60 })).toEqual(r);
    expect(normalizeRect({ x: 100, y: 60 }, { x: 10, y: 20 })).toEqual(r);
    expect(normalizeRect({ x: 100, y: 20 }, { x: 10, y: 60 })).toEqual(r);
  });

  it("labels the size in physical pixels", () => {
    expect(selectionLabel({ x: 0, y: 0, width: 400, height: 160 }, 1.5)).toBe("600 × 240");
    expect(selectionLabel({ x: 0, y: 0, width: 400, height: 160 }, 0)).toBe("400 × 160");
  });
});
