// Board renders of the prequal landings: full mobile pages (390 wide, 1x; the cropped state @2x) for the FigJam board, written to assets/board/.
// Render publishes assets/ without the password, so the board loads them with figma.createImageAsync(<site>/assets/board/<file>).
//   node tools/board-renders.mjs
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const SHELL_DIR = join(process.env.LOCALAPPDATA || '', 'lf-browsers', 'chrome-headless-shell');
const SHELL = existsSync(SHELL_DIR) ? readdirSync(SHELL_DIR).map(v => join(SHELL_DIR, v, 'chrome-headless-shell-win32', 'chrome-headless-shell.exe')).find(existsSync) : null;
if (!SHELL) { console.log('Headless browser not installed (see tools/agent-pages.mjs).'); process.exit(1); }

// file, page, what to do before the shot
const SHOTS = [
  // Nov 2026 board slots 1 and 1b. The landing's offer editor is parked (offer changes happen on the existing offer page).
  { file: 'prequal-landing-a-nov.png', page: 'landing-a.html' },
  { file: 'prequal-landing-b-creditkarma-nov.png', page: 'landing-b.html' },
  // Landing options for the team (tools/concepts.mjs): each in state a (phone on file) and b ("Have a new number? Update it").
  { file: 'option-1-ticket-a.png', page: 'option-1-ticket.html' },
  { file: 'option-1-ticket-b.png', page: 'option-1-ticket.html', q: '&state=b' },
  { file: 'option-2-classic-a.png', page: 'option-2-classic.html' },
  { file: 'option-2-classic-b.png', page: 'option-2-classic.html', q: '&state=b' },
  { file: 'option-3-steps-a.png', page: 'option-3-steps.html' },
  { file: 'option-3-steps-b.png', page: 'option-3-steps.html', q: '&state=b' },
  { file: 'option-4-minimal-a.png', page: 'option-4-minimal.html' },
  { file: 'option-4-minimal-b.png', page: 'option-4-minimal.html', q: '&state=b' },
  // Option 5 is rendered from the prototype app itself (the funnel's Get Started screen).
  { file: 'option-5-getstarted-a.png', app: '?option=5' },
  { file: 'option-5-getstarted-b.png', app: '?option=5&state=b' },
];

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => { const p = join('.', decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p)); });
await new Promise(r => server.listen(0, r));
const BASE = 'http://localhost:' + server.address().port + '/assets/prequal/';
const browser = await puppeteer.launch({ executablePath: SHELL, headless: 'shell', args: ['--disable-gpu', '--hide-scrollbars'] });
const tab = await browser.newPage();
mkdirSync('assets/board', { recursive: true });
for (const s of SHOTS) {
  await tab.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await tab.goto(s.app ? BASE.replace('/assets/prequal/', '/index.html') + s.app + '&t=' + Date.now() : BASE + s.page + '?t=' + Date.now() + (s.q || ''), { waitUntil: 'networkidle0' });
  if (s.app) await tab.addStyleTag({ content: 'html body .panel button.flow-fab,html body .flow-fab{display:none!important;visibility:hidden!important}' });
  if (s.open) await tab.click('.lf2-toggle');
  if (s.hide) await tab.addStyleTag({ content: s.hide + '{display:none!important}' });
  await new Promise(r => setTimeout(r, 1200));
  if (s.clipTo) {
    const bottom = await tab.evaluate((sel) => { document.querySelector('.lf2-paybar').style.display = 'none'; return Math.ceil(document.querySelector(sel).getBoundingClientRect().bottom + 24); }, s.clipTo);
    await tab.setViewport({ width: 390, height: bottom, deviceScaleFactor: 2 }); await new Promise(r => setTimeout(r, 400));
    await tab.screenshot({ path: 'assets/board/' + s.file }); console.log(s.file, 390 + 'x' + bottom); continue;
  }
  // Full page: grow the viewport to the page height so the pinned bar sits at the very bottom, under the footer.
  const h = await tab.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  // Figma takes images up to 4096 px per side: full pages render at 1x (390 wide is still sharper than the 300 px board slot).
  await tab.setViewport({ width: 390, height: h, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 600));
  await tab.screenshot({ path: 'assets/board/' + s.file, fullPage: false });
  console.log(s.file, 390 + 'x' + h);
}
await browser.close(); server.close();
