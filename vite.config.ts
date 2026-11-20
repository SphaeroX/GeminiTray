import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "src");

// One HTML entry per app-owned window. The Gemini window itself loads gemini.google.com.
export const pages = ["settings", "indicator", "prompts", "overlay", "toast", "titlebar"];

export default defineConfig({
  root,
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])),
    },
  },
});
