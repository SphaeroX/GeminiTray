// Version consistency between package.json, src-tauri/tauri.conf.json and src-tauri/Cargo.toml.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Extract the [package] version from Cargo.toml text. */
export function cargoVersion(cargoToml) {
  const pkg = cargoToml.split(/^\[/m).find((section) => section.startsWith("package]"));
  const m = pkg && pkg.match(/^version\s*=\s*"([^"]+)"/m);
  return m ? m[1] : null;
}

/**
 * Returns { version, errors }. `errors` is empty when all three files agree on a valid
 * semantic version.
 */
export function checkVersions(packageJson, tauriConfJson, cargoToml) {
  const versions = {
    "package.json": JSON.parse(packageJson).version ?? null,
    "src-tauri/tauri.conf.json": JSON.parse(tauriConfJson).version ?? null,
    "src-tauri/Cargo.toml": cargoVersion(cargoToml),
  };
  const errors = [];
  const values = Object.values(versions);
  if (new Set(values).size !== 1) {
    errors.push(`versions differ: ${Object.entries(versions).map(([f, v]) => `${f}=${v}`).join(", ")}`);
  }
  for (const [file, v] of Object.entries(versions)) {
    if (!v || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(v)) errors.push(`${file}: invalid version "${v}"`);
  }
  return { version: values[0], errors };
}

export function readVersions(root = resolve(import.meta.dirname, "..")) {
  return checkVersions(
    readFileSync(resolve(root, "package.json"), "utf8"),
    readFileSync(resolve(root, "src-tauri/tauri.conf.json"), "utf8"),
    readFileSync(resolve(root, "src-tauri/Cargo.toml"), "utf8"),
  );
}
