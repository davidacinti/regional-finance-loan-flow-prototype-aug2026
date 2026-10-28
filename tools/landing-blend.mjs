// Prequal landing · DESIGN 1 · SIMPLE + UNLOCK (Oct 27 2026; the default). Design 3's page (hero, offer card, 3 steps line, value props,
// reviews, footer) with Design 2's "Unlock your application" section, unchanged, as the bottom of the offer card: the number
// we'll text with Update (opens the mobile number + date of birth + SSN last 4 block), the consent and Continue inline
// (no pinned bar), and Design 3's "Continuing won't affect your credit score." under Continue.
// Built from the two generated pages, so run tools/landing-simple.mjs and tools/landing-unlock.mjs first.
//   node tools/landing-blend.mjs   → assets/prequal/landing-blend.html
import { readFileSync, writeFileSync } from 'node:fs';

let html = readFileSync('assets/prequal/landing-simple.html', 'utf8');
const unlock = readFileSync('assets/prequal/landing-unlock.html', 'utf8');
const swap = (re, to, what) => { const before = html; html = html.replace(re, to); if (html === before) throw new Error('not found in landing-simple: ' + what); };

// Design 2's Unlock card as a section of the offer card, with the credit line under Continue.
const m = unlock.match(/<section class="lu-card"[\s\S]*?<\/section>\n<\/div><\/div>/);
if (!m) throw new Error('not found in landing-unlock: Unlock card');
const card = m[0].replace(/\n<\/div><\/div>$/, '').replace('<section class="lu-card"', '<div class="lu-card lu-in"').replace(/<\/section>$/, '</div>')
  .replace(/(<\/button><\/div>\n)(<\/div><\/div>\n<\/div>)$/, '$1<p class="lf2-note ps-credit">Continuing won’t affect your credit score.</p>\n$2');
if (!card.includes('ps-credit')) throw new Error('credit line placement failed');

// Design 3's card loses its number row and new-number block (the Unlock section has them) and ends at the expiry date.
swap(/<p class="ps-num" id="ppFile">[\s\S]*?<\/p>\n<section class="lf2-ph pp-check"[\s\S]*?<section class="pp-nomatch" id="ppTaken"[\s\S]*?<\/section>\n<\/div>\n<\/section>/,
  '</div>\n' + card + '\n</section>', 'card number row');
swap(/<div class="rf-paybar lf2-paybar"[\s\S]*?<div class="rf-paybar-space"><\/div>/, '', 'pinned bar');
swap(/<link rel="stylesheet" href="landing-simple\.css\?v=\d+">/, (s) => s + '<link rel="stylesheet" href="landing-unlock.css?v=5">', 'stylesheet');
swap('<title>Prequal Landing · Simple</title>', '<title>Prequal Landing · Simple + Unlock</title>', 'title');
html = html.replace('</head>', `<style>
/* Design 2's Unlock card inside Design 3's offer card: no second border, a line above it. */
.ps-card .lu-in{margin:0;border:0;border-top:1px solid var(--outline-light-gray);border-radius:0}
.ps-card .ps-body{padding-bottom:20px}
.lu-in .ps-credit{margin:0;text-align:center}
</style></head>`);
if ((html.match(/id="ppFile"/g) || []).length !== 1) throw new Error('expected one number row');
writeFileSync('assets/prequal/landing-blend.html', html);
console.log('landing-blend.html');
