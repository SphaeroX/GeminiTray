import { describe, expect, it } from "vitest";
// @ts-expect-error – plain ESM script without type declarations
import { cargoVersion, checkVersions, readVersions } from "../../scripts/versions.mjs";

const cargo = (v: string) => `[package]\nname = "gemini-tray"\nversion = "${v}"\n\n[dependencies]\nfoo = { version = "1.0.0" }\n`;

describe("release version check", () => {
  it("reads the package version from Cargo.toml, not a dependency version", () => {
    expect(cargoVersion(cargo("2.0.0"))).toBe("2.0.0");
  });

  it("accepts matching versions", () => {
    const r = checkVersions('{"version":"2.1.0"}', '{"version":"2.1.0"}', cargo("2.1.0"));
    expect(r).toEqual({ version: "2.1.0", errors: [] });
  });

  it("rejects differing versions", () => {
    const r = checkVersions('{"version":"2.1.0"}', '{"version":"2.0.0"}', cargo("2.1.0"));
    expect(r.errors[0]).toMatch(/versions differ/);
  });

  it("rejects invalid versions", () => {
    const r = checkVersions('{"version":"2.1"}', '{"version":"2.1"}', cargo("2.1"));
    expect(r.errors.some((e: string) => e.includes("invalid version"))).toBe(true);
  });

  it("the repository itself is consistent", () => {
    expect(readVersions().errors).toEqual([]);
  });
});
