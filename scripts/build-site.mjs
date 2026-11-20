// Assembles the GitHub Pages website into _site/: the landing page (site/) plus the current screenshots
// (images/screenshots/). The version number in the page is filled in from package.json.
//
//   node scripts/build-site.mjs     # then open _site/index.html
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "_site");
const { version } = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(resolve(root, "site"), out, { recursive: true });
await cp(resolve(root, "images/screenshots"), resolve(out, "images/screenshots"), { recursive: true });
await cp(resolve(root, "src-tauri/app-icon.png"), resolve(out, "images/app-icon.png"));

const index = resolve(out, "index.html");
const html = await readFile(index, "utf8");
await writeFile(index, html.replaceAll("{{VERSION}}", version));
await writeFile(resolve(out, ".nojekyll"), "");
console.log(`Site built in _site/ (v${version}).`);
