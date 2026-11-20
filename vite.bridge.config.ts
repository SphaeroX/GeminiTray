import { defineConfig } from "vite";
import { resolve } from "node:path";

// Bundles the Gemini bridge into one self-contained script that Rust injects into the Gemini webview.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, "src-tauri/bridge"),
    emptyOutDir: false,
    target: "es2022",
    minify: false,
    lib: {
      entry: resolve(import.meta.dirname, "src/bridge/index.ts"),
      formats: ["iife"],
      name: "GeminiTrayBridge",
      fileName: () => "gemini-bridge.js",
    },
  },
});
