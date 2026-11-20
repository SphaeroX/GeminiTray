// Copies the Microsoft Visual C++ runtime DLLs (needed by ONNX Runtime) next to the app via
// src-tauri/runtime/ → bundled by tauri.conf.json "resources". App-local deployment of these files is
// permitted by the Visual C++ Redistributable license. Requires Visual Studio (Build Tools).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

export const DLLS = ["msvcp140.dll", "msvcp140_1.dll", "vcruntime140.dll", "vcruntime140_1.dll"];
const out = resolve(import.meta.dirname, "../src-tauri/runtime");

function vsRedistDir() {
  const vswhere = join(process.env["ProgramFiles(x86)"] ?? "C:\Program Files (x86)", "Microsoft Visual Studio", "Installer", "vswhere.exe");
  if (!existsSync(vswhere)) return null;
  const vs = execFileSync(vswhere, ["-products", "*", "-latest", "-property", "installationPath"], { encoding: "utf8" }).trim();
  const base = join(vs, "VC", "Redist", "MSVC");
  if (!existsSync(base)) return null;
  for (const ver of readdirSync(base).filter((d) => /^\d/.test(d)).sort().reverse()) {
    const x64 = join(base, ver, "x64");
    if (!existsSync(x64)) continue;
    const crt = readdirSync(x64).find((d) => /^Microsoft\.VC\d+\.CRT$/.test(d));
    if (crt) return join(x64, crt);
  }
  return null;
}

if (process.platform === "win32") {
  mkdirSync(out, { recursive: true });
  const src = vsRedistDir();
  for (const dll of DLLS) {
    const target = join(out, dll);
    const from = src && existsSync(join(src, dll)) ? join(src, dll) : join(process.env.SystemRoot ?? "C:\Windows", "System32", dll);
    if (!existsSync(from)) {
      console.error(`collect-runtime: ${dll} not found (install Visual Studio Build Tools)`);
      process.exit(1);
    }
    copyFileSync(from, target);
  }
  console.log(`collect-runtime: copied ${DLLS.length} DLLs from ${src ?? "System32"}`);
}
