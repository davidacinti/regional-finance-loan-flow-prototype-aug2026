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
  // One example of the "This isn't my number" / no number on file (Credit Karma) scenario, under the designs:
  // the input, then the lookup: match → the real code screen with the new number; no match → no offer, new application.
  { file: 'scenario-input.png', page: 'design-1-today.html', q: '&state=notmine', el: '#ppCheck' },
  { file: 'scenario-match.png', app: '?scenario=1', run: "start('prequal'); S.customer.phone='(864) 555-1234'; S.hist=[]; go('sms',false);", hide: '.ios-note', first: true },
  { file: 'scenario-nomatch.png', page: 'design-1-today.html', q: '&state=nomatch', el: '#ppNoMatch' },
  // Phone first (tools/phone-first.mjs): the landing as people open it, then the top of the page for each case.
  { file: 'phone-first-landing.png', page: 'phone-first.html', first: true },
  { file: 'phone-first-match.png', page: 'phone-first.html', q: '&state=match', upTo: '#pf' },
  { file: 'phone-first-new.png', page: 'phone-first.html', q: '&state=new', upTo: '#pf' },
  { file: 'phone-first-nomatch.png', page: 'phone-first.html', q: '&state=nomatch', upTo: '#pf' },
  // Three landing designs (1 Today, 2 Get started and 3 Offer page in the prototype): from the top down to the number
  // we'll text (upTo), then each situation as just its input block (el), in that design.
  { file: 'design-1-number.png', page: 'design-1-today.html', upTo: '#ppFile' },
  { file: 'design-2-number.png', app: '?design=2', upTo: '.btn-alt' },
  { file: 'design-3-number.png', app: '?design=3', upTo: '.d3-file' },
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
  if (s.run) { await tab.evaluate(s.run); await new Promise(r => setTimeout(r, 1200)); }
  if (s.open) await tab.click('.lf2-toggle');
  if (s.hide) await tab.addStyleTag({ content: s.hide + '{display:none!important}' });
  await new Promise(r => setTimeout(r, 1200));
  if (s.upTo) {
    const bottom = await tab.evaluate((sel) => Math.ceil(document.querySelector(sel).getBoundingClientRect().bottom + scrollY + 24), s.upTo);
    await tab.setViewport({ width: 390, height: Math.max(844, bottom + (s.app ? 0 : 150)), deviceScaleFactor: 2 }); await new Promise(r => setTimeout(r, 500));
    await tab.screenshot({ path: 'assets/board/' + s.file }); console.log(s.file, '390x' + Math.max(844, bottom) + ' @2x'); continue;
  }
  // First screen: what a customer sees before scrolling (pinned bar included), @2x.
  if (s.first) { await tab.screenshot({ path: 'assets/board/' + s.file }); console.log(s.file, '390x844 @2x'); continue; }
  // Just one block (an input state), with a little white around it, @2x.
  if (s.el) {
    const box = await tab.evaluate((sel) => { const bar = document.querySelector('.lf2-paybar'); if (bar) bar.style.display = 'none'; const r = document.querySelector(sel).getBoundingClientRect(); return { x: Math.max(0, r.left - 16), y: r.top + scrollY - 16, width: Math.min(390, r.width + 32), height: r.height + 32 }; }, s.el);
    await tab.screenshot({ path: 'assets/board/' + s.file, clip: box, captureBeyondViewport: true }); console.log(s.file, Math.round(box.width) + 'x' + Math.round(box.height) + ' @2x'); continue;
  }
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
