import { describe, expect, it } from "vitest";
import { BAR_COUNT, formatDuration, pushLevel } from "../../src/lib/indicator";

describe("recording indicator", () => {
  it("formats the timer", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(7.9)).toBe("0:07");
    expect(formatDuration(83)).toBe("1:23");
    expect(formatDuration(725)).toBe("12:05");
  });
});

describe("level bars", () => {
  it("keeps the newest levels, oldest first", () => {
    let h: number[] = [];
    for (const l of [0.1, 0.2, 0.3, 0.4]) h = pushLevel(h, l, 3);
    expect(h).toEqual([0.2, 0.3, 0.4]);
  });

  it("clamps odd values", () => {
    expect(pushLevel([], 2)).toEqual([1]);
    expect(pushLevel([], -1)).toEqual([0]);
    expect(pushLevel([], Number.NaN)).toEqual([0]);
  });

  it("has a bar per slot by default", () => {
    let h: number[] = [];
    for (let i = 0; i < BAR_COUNT + 5; i++) h = pushLevel(h, 0.5);
    expect(h).toHaveLength(BAR_COUNT);
  });
});
