import { describe, expect, it } from "vitest";
import { formatDuration, levelBars } from "../../src/lib/indicator";

describe("recording indicator", () => {
  it("formats the timer", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(7.9)).toBe("0:07");
    expect(formatDuration(83)).toBe("1:23");
    expect(formatDuration(725)).toBe("12:05");
  });

  it("produces a fixed number of bars between 4 and 20 px", () => {
    const bars = levelBars([0, 0.01, 0.05, 0.2, 1, 5], 7);
    expect(bars).toHaveLength(7);
    expect(Math.min(...bars)).toBe(4);
    expect(Math.max(...bars)).toBe(20);
    expect(bars[2]).toBeLessThan(bars[4]);
  });
});
