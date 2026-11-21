// Renders the brand assets from the SVG sources in images/brand/ (logo.svg, tray.svg):
//   src-tauri/app-icon.png          1024 px source for `tauri icon` (app/installer icons)
//   src-tauri/icons/*               all app icons via `tauri icon`; icon.ico is then rebuilt so that
//                                   16/24/32 px use the simplified tray mark (crisper in Explorer/taskbar)
//   src-tauri/icons/tray.png        32 px tray icon (simplified mark)
//   images/brand/logo-512.png       plain app icon for docs
//   images/brand/wordmark-{light,dark}.png  logo + name, for README and slides
//   images/brand/social-preview.png 1280×640 GitHub social preview
//
//   npm run brand
import { execSync } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const brand = resolve(root, "images/brand");
const logo = await readFile(resolve(brand, "logo.svg"), "utf8");
const tray = await readFile(resolve(brand, "tray.svg"), "utf8");

const font = `"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif`;
const page = (body, bg = "transparent") =>
  `<!doctype html><html><head><style>html,body{margin:0;background:${bg};font-family:${font}}svg{display:block}</style></head><body>${body}</body></html>`;
const sized = (svg, px) => svg.replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`);

const wordmark = (dark) => {
  const ink = dark ? "#FFFFFF" : "#1A1A1A";
  return page(`<div id="c" style="display:inline-flex;align-items:center;gap:28px;padding:16px 24px 16px 8px">
    ${sized(logo, 160)}
    <span style="font-size:88px;font-weight:600;letter-spacing:-0.02em;color:${ink}">Gemini Tray</span></div>`);
};

const social = page(`<div id="c" style="width:1280px;height:640px;position:relative;overflow:hidden;
    background:radial-gradient(900px 600px at 78% 40%, #2C318F 0%, #161946 55%, #0B0C26 100%);color:#fff">
  <div style="position:absolute;right:120px;top:120px">${sized(logo, 400)}</div>
  <div style="position:absolute;left:96px;top:176px;width:640px">
    <div style="font-size:84px;font-weight:700;letter-spacing:-0.03em;line-height:1">Gemini Tray</div>
    <div style="margin-top:28px;font-size:34px;line-height:1.3;color:#C9CEFF">Gemini, one shortcut away.<br>Voice, dictation and Screenshot&nbsp;&amp;&nbsp;Ask from the Windows tray.</div>
    <div style="margin-top:44px;display:flex;gap:14px;font-size:26px;font-weight:600">
      <span style="padding:10px 20px;border-radius:12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)">Alt</span>
      <span style="align-self:center;color:#8E96D8">+</span>
      <span style="padding:10px 56px;border-radius:12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)">Space</span>
    </div>
  </div></div>`);

const jobs = [
  { html: page(sized(logo, 1024)), out: "src-tauri/app-icon.png", w: 1024, h: 1024 },
  { html: page(sized(logo, 512)), out: "images/brand/logo-512.png", w: 512, h: 512 },
  { html: page(sized(tray, 32)), out: "src-tauri/icons/tray.png", w: 32, h: 32 },
  ...[16, 24, 32].map((px) => ({ html: page(sized(tray, px)), ico: px, w: px, h: px })),
  ...[48, 64, 256].map((px) => ({ html: page(sized(logo, px)), ico: px, w: px, h: px })),
  { html: wordmark(false), out: "images/brand/wordmark-light.png", el: "#c", scale: 1 },
  { html: wordmark(true), out: "images/brand/wordmark-dark.png", el: "#c", scale: 1 },
  { html: social, out: "images/brand/social-preview.png", el: "#c", scale: 1 },
];

/** Builds a Windows .ico from PNG images (PNG-compressed entries, supported since Vista). */
export function buildIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.png)]);
}

const ico = [];
const browser = await chromium.launch({ channel: process.env.SCREENSHOT_BROWSER ?? "msedge" });
try {
  for (const job of jobs) {
    const p = await browser.newPage({ viewport: { width: job.w ?? 1400, height: job.h ?? 800 } });
    await p.setContent(job.html);
    const target = job.el ? p.locator(job.el) : p;
    if (job.ico) {
      ico.push({ size: job.ico, png: await target.screenshot({ omitBackground: true }) });
    } else {
      await target.screenshot({ path: resolve(root, job.out), omitBackground: true });
      console.log(`  ${job.out}`);
    }
    await p.close();
  }
} finally {
  await browser.close();
}

// App icons for the bundle (Windows only: drop the mobile sets), then the hand-tuned .ico.
execSync("npx tauri icon src-tauri/app-icon.png", { cwd: root, stdio: "ignore" });
for (const dir of ["android", "ios"]) await rm(resolve(root, "src-tauri/icons", dir), { recursive: true, force: true });
await writeFile(resolve(root, "src-tauri/icons/icon.ico"), buildIco(ico.sort((a, b) => a.size - b.size)));
console.log("  src-tauri/icons/* (tauri icon) + icon.ico");
