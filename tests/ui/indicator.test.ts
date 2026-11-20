import { describe, expect, it } from "vitest";
import { formatDuration } from "../../src/lib/indicator";

describe("recording indicator", () => {
  it("formats the timer", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(7.9)).toBe("0:07");
    expect(formatDuration(83)).toBe("1:23");
    expect(formatDuration(725)).toBe("12:05");
  });
});
