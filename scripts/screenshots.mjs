// Captures screenshots of the app's own windows (settings, prompt menu, voice indicator, Screenshot & Ask
// overlay, toasts) in light and dark mode and refreshes the screenshot gallery in README.md.
//
// The pages run in a normal browser with the development mock (src/lib/devmock.ts) answering instead of
// the Rust backend, so no Tauri build and no Google sign-in is needed. The Gemini page itself is not
// captured (it needs a signed-in Google account); the hero image shows it as a neutral placeholder.
//
//   node scripts/screenshots.mjs              # capture + update README
//   node scripts/screenshots.mjs --no-readme  # capture only
//
// Output: images/screenshots/<name>-<light|dark>.png
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";
import { chromium } from "playwright";
import { galleryMarkdown, replaceBetweenMarkers } from "./readme-gallery.mjs";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "images/screenshots");
const readmePath = resolve(root, "README.md");
const version = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")).version;
const PORT = 1421;
const BASE = `http://localhost:${PORT}`;
const THEMES = ["light", "dark"];

/** One entry per screenshot. `url` is relative to the dev server, `size` is the real window size. */
const SHOTS = [
  { name: "hero", scene: "hero", size: [1280, 800] },
  { name: "settings-shortcuts", url: "settings.html#shortcuts", size: [880, 600] },
  { name: "settings-voice", url: "settings.html#voice", size: [880, 600] },
  { name: "settings-prompts", url: "settings.html#prompts", size: [880, 600] },
  { name: "prompts", url: "prompts.html", size: [560, 420], transparent: true },
  { name: "indicator", url: "indicator.html#message", size: [520, 76], transparent: true },
  { name: "toast", url: "toast.html", size: [400, 130], transparent: true, bottom: true },
  { name: "overlay", url: "overlay.html", size: [1280, 720], drag: [[110, 392], [742, 540]] },
];

const pageUrl = (path) => {
  const [file, hash] = path.split("#");
  return `${BASE}/${file}?shot&version=${version}${hash ? `#${hash}` : ""}`;
};

/** Desktop scene for the hero image: the Gemini window (our title bar + placeholder page) with the
 *  voice indicator and a toast, on a Windows-like wallpaper. */
function heroScene(theme) {
  const dark = theme === "dark";
  const wall = dark
    ? "radial-gradient(1200px 700px at 20% 10%, #1d3a6e 0%, transparent 60%), radial-gradient(900px 600px at 90% 90%, #4a2a6a 0%, transparent 60%), #0d1117"
    : "radial-gradient(1200px 700px at 20% 10%, #b9d4ff 0%, transparent 60%), radial-gradient(900px 600px at 90% 90%, #e5d4ff 0%, transparent 60%), #eef3fb";
  const page = dark ? "#131314" : "#ffffff";
  const line = dark ? "#2a2b2e" : "#eceff3";
  const bubble = dark ? "#2a2b2e" : "#f0f4f9";
  const text = dark ? "#e3e3e3" : "#1f1f1f";
  return `<!doctype html><html><head><style>
    :root{color-scheme:light dark} /* same as the app pages, so their iframes stay transparent */
    html,body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif}
    body{background:${wall}}
    .win{position:absolute;left:96px;top:40px;width:520px;height:720px;border-radius:8px;overflow:hidden;
      box-shadow:0 32px 64px rgba(0,0,0,${dark ? 0.55 : 0.22}),0 0 0 1px rgba(${dark ? "255,255,255,.08" : "0,0,0,.08"});background:${page}}
    .win iframe{display:block;border:0;width:520px;height:40px}
    .gem{height:680px;display:flex;flex-direction:column;padding:28px 32px;box-sizing:border-box;gap:18px;color:${text}}
    .hello{font-size:26px;font-weight:600;margin-top:110px;background:linear-gradient(90deg,#4f8cff,#9b72ff 55%,#ff7aa8);-webkit-background-clip:text;color:transparent}
    .sub{font-size:20px;opacity:.55;margin-top:-10px}
    .me{align-self:flex-end;background:${bubble};border-radius:18px;padding:12px 16px;font-size:14px;max-width:70%}
    .sk{height:10px;border-radius:5px;background:${line}}
    .input{margin-top:auto;height:56px;border-radius:28px;background:${bubble};display:flex;align-items:center;padding:0 20px;font-size:14px;opacity:.9}
    .ind{position:absolute;left:660px;top:600px;width:520px;height:76px;border:0;background:transparent}
    .menu{position:absolute;left:660px;top:190px;width:560px;height:420px;border:0;background:transparent}
  </style></head><body>
    <div class="win">
      <iframe src="${pageUrl("titlebar.html")}"></iframe>
      <div class="gem">
        <div class="hello">Hello there</div>
        <div class="sub">How can I help you today?</div>
        <div class="me">Explain briefly: what does a tray app do?</div>
        <div class="sk" style="width:92%"></div><div class="sk" style="width:84%"></div><div class="sk" style="width:60%"></div>
        <div class="input">Ask Gemini</div>
      </div>
    </div>
    <iframe class="menu" src="${pageUrl("prompts.html")}" allowtransparency="true"></iframe>
    <iframe class="ind" src="${pageUrl("indicator.html#message")}" allowtransparency="true"></iframe>
  </body></html>`;
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  // Let Vue mount, the mock answer and CSS transitions finish; stop animations for stable images.
  await page.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}" }).catch(() => {});
  await page.waitForTimeout(700);
}

async function capture(browser, shot, theme) {
  const [width, height] = shot.size;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: theme,
    locale: "en-US",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.warn(`  [${shot.name}/${theme}] page error: ${e.message}`));

  if (shot.scene === "hero") {
    await page.goto(`${BASE}/settings.html?shot`); // same origin for the iframes
    await page.setContent(heroScene(theme), { waitUntil: "load" });
    for (const f of page.frames()) await f.waitForLoadState("load");
  } else {
    await page.goto(pageUrl(shot.url), { waitUntil: "load" });
  }
  await settle(page);
  for (const f of page.frames()) if (f !== page.mainFrame()) await f.addStyleTag({ content: "*{animation-play-state:paused!important}" }).catch(() => {});

  if (shot.drag) {
    const [[x1, y1], [x2, y2]] = shot.drag;
    await page.mouse.move(x1, y1);
    await page.mouse.down();
    await page.mouse.move(x2, y2, { steps: 8 });
    // Keep the button pressed: releasing it confirms the selection and the frame disappears.
    await page.waitForTimeout(200);
  }

  const file = resolve(outDir, `${shot.name}-${theme}.png`);
  if (shot.transparent) {
    // Crop to the visible content (toasts stack at the bottom of their window).
    const box = await page.evaluate(() => {
      const el = document.querySelector(".menu, .pill, .toast");
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const pad = 24;
    await page.screenshot({
      path: file,
      omitBackground: true,
      clip: {
        x: Math.max(0, box.x - pad),
        y: Math.max(0, box.y - pad),
        width: Math.min(width, box.width + pad * 2),
        height: Math.min(height, box.height + pad * 2),
      },
    });
  } else {
    await page.screenshot({ path: file });
  }
  await context.close();
  console.log(`  ${shot.name}-${theme}.png`);
}

async function main() {
  const updateReadme = !process.argv.includes("--no-readme");
  await mkdir(outDir, { recursive: true });

  const server = await createServer({
    configFile: resolve(root, "vite.config.ts"),
    server: { port: PORT, strictPort: true },
    logLevel: "warn",
  });
  await server.listen();
  // Edge = the same engine as WebView2, preinstalled on Windows and on GitHub's windows runners.
  const browser = await chromium.launch({ channel: process.env.SCREENSHOT_BROWSER ?? "msedge" });
  try {
    console.log(`Capturing ${SHOTS.length * THEMES.length} screenshots (v${version}) …`);
    for (const shot of SHOTS) for (const theme of THEMES) await capture(browser, shot, theme);
  } finally {
    await browser.close();
    await server.close();
  }

  if (updateReadme) {
    const readme = await readFile(readmePath, "utf8");
    const next = replaceBetweenMarkers(readme, galleryMarkdown());
    if (next !== readme) {
      await writeFile(readmePath, next);
      console.log("README.md gallery updated.");
    } else console.log("README.md gallery unchanged.");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  await main();
}
