// Board renders of the prequal landings: full mobile pages (390 wide, 1x; the cropped state @2x) for the FigJam board, written to assets/board/.
// Render publishes assets/ without the password, so the board loads them with figma.createImageAsync(<site>/assets/board/<file>).
//   node tools/board-renders.mjs [part of a file name: render only those]
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
  // Came back with a different number than the one the offer is saved to: "This offer is already saved to another number".
  { file: 'scenario-taken.png', page: 'design-1-today.html', q: '&returning=1&state=taken', el: '#ppTaken' },
  // Phone first (tools/phone-first.mjs): the landing as people open it, then the top of the page for each case.
  { file: 'phone-first-landing.png', page: 'phone-first.html', first: true },
  { file: 'phone-first-match.png', page: 'phone-first.html', q: '&state=match', upTo: '#pf' },
  { file: 'phone-first-new.png', page: 'phone-first.html', q: '&state=new', upTo: '#pf' },
  { file: 'phone-first-nomatch.png', page: 'phone-first.html', q: '&state=nomatch', upTo: '#pf' },
  // Three landing designs (1 Today, 2 Get started and 3 Offer page in the prototype): from the top down to the number
  // we'll text (upTo), then each situation as just its input block (el), in that design.
  { file: 'design-1-number.png', page: 'design-1-today.html', upTo: '#ppFile' },
  // Designs 2 (Unlock) and 3 (Simple): from the top down to the number we'll text.
  { file: 'design-2-number.png', page: 'landing-unlock.html', upTo: '#ppFile' },
  { file: 'design-3-number.png', page: 'landing-simple.html', upTo: '#ppFile' },
  // The same three designs as full-page mockups (top to footer, pinned bar at the bottom), without the prototype's design toggle.
  // Simpler landing proposal (tools/landing-simple.mjs): the first screen a customer sees, and the full page.
  { file: 'simple-first.png', page: 'landing-simple.html', first: true },
  { file: 'simple-full.png', page: 'landing-simple.html' },
  { file: 'simple-change.png', page: 'landing-simple.html', q: '&state=notmine', el: '.ps-card' },
  { file: 'simple-nomatch.png', page: 'landing-simple.html', q: '&state=nomatch', el: '.ps-card' },
  // Came back (number already saved to the offer): the card's welcome-back line, then a different number → already saved.
  { file: 'simple-back.png', page: 'landing-simple.html', q: '&returning=1', el: '.ps-card' },
  { file: 'simple-taken.png', page: 'landing-simple.html', q: '&returning=1&state=taken', el: '.ps-card' },
  // Known journeys, review + credit check (Oct 23): the SSN on file masked on the review page; editing opens an empty field;
  // no SSN on file opens the row on load; the credit check no longer shows the SSN.
  { file: 'review-ssn.png', app: '?scenario=1', run: "start('known'); S.hist=[]; go('review',false);", first: true },
  { file: 'review-ssn-edit.png', app: '?scenario=1', run: "start('known'); S.hist=[]; go('review',false); document.querySelector('[data-pq-ssn-open]').click();", first: true },
  { file: 'review-ssn-missing.png', app: '?nossn=1', run: "start('prequal'); S.hist=[]; go('review',false);", first: true },
  { file: 'credit-no-ssn.png', app: '?scenario=1', run: "start('prequal'); S.amount=12500; S.term=3; S.hist=[]; S.page='bankSuccess'; go('credit',false);", first: true },
  // Full pages for the release board's "4 · Confirm" (review, SSN masked) and "13 · Apply" (credit check, no SSN card).
  { file: 'review-full.png', app: '?scenario=1', run: "start('known'); S.hist=[]; go('review',false);" },
  { file: 'credit-full.png', app: '?scenario=1', run: "start('prequal'); S.amount=12500; S.term=3; S.hist=[]; S.page='bankSuccess'; go('credit',false);" },
  // Design 5 · Unlock (tools/landing-unlock.mjs): first screen, full page, and the card after Update.
  { file: 'unlock-first.png', page: 'landing-unlock.html', first: true },
  { file: 'unlock-full.png', page: 'landing-unlock.html' },
  { file: 'unlock-update.png', page: 'landing-unlock.html', q: '&state=notmine', el: '.lu-card' },
  { file: 'design-1-full.png', page: 'design-1-today.html' },
  // Design 4 · Simple + Unlock (tools/landing-blend.mjs): first screen, full page, the card after Update, and down to the number.
  { file: 'blend-first.png', page: 'landing-blend.html', first: true },
  { file: 'blend-full.png', page: 'landing-blend.html' },
  { file: 'blend-update.png', page: 'landing-blend.html', q: '&state=notmine', el: '.ps-card' },
  { file: 'design-4-number.png', page: 'landing-blend.html', upTo: '#ppFile' },
  // Release board slot "0 · New borrower landing" (taller than Figma's 4096 px: full pages scale down to fit).
  { file: 'new-borrower-landing-v2.png', page: 'landing-new.html' },
];

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => { const p = join('.', decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p)); });
await new Promise(r => server.listen(0, r));
const BASE = 'http://localhost:' + server.address().port + '/assets/prequal/';
const browser = await puppeteer.launch({ executablePath: SHELL, headless: 'shell', args: ['--disable-gpu', '--hide-scrollbars'] });
const tab = await browser.newPage();
mkdirSync('assets/board', { recursive: true });
for (const s of SHOTS.filter(s => !process.argv[2] || s.file.includes(process.argv[2]))) {
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
    const box = await tab.evaluate((sel) => { const bar = document.querySelector('.lf2-paybar'); if (bar && !document.querySelector(sel).contains(bar)) bar.style.display = 'none'; const r = document.querySelector(sel).getBoundingClientRect(); return { x: Math.max(0, r.left - 16), y: r.top + scrollY - 16, width: Math.min(390, r.width + 32), height: r.height + 32 }; }, s.el);
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
  await tab.setViewport({ width: 390, height: h, deviceScaleFactor: Math.min(1, 4090 / h) });
  await new Promise(r => setTimeout(r, 600));
  await tab.screenshot({ path: 'assets/board/' + s.file, fullPage: false });
  console.log(s.file, 390 + 'x' + h);
}
await browser.close(); server.close();
