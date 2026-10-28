// Prequal landing · DESIGN 5 · UNLOCK (Oct 26 2026 proposal, for the team). Pattern from Achieve's "Access your form",
// in the landing family's look (gradient hero, white cards r24, no shadows): "You've unlocked Fast Track" with the offer
// and instant funding, then one task card: "Unlock your application" with the number we'll text (Update opens Design 1's mobile number + date
// of birth + SSN last 4 block), the consent and Continue inline (no pinned bar). Reviews and the legal footer below.
// Consent text, legal footer, reviews, pq.js and the number block/script are copied verbatim (landing-a, design-1-today).
//   node tools/landing-unlock.mjs   → assets/prequal/landing-unlock.html
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const pick = (re, what) => { const m = base.match(re); if (!m) throw new Error('not found in landing-a: ' + what); return m[0]; };
// The consent + Continue bar, always inline here (data-inline): the number script keeps it inline when it moves.
const bar = pick(/<div class="rf-paybar lf2-paybar"[\s\S]*?(?=<section class="rf-section rf-social")/, 'consent bar')
  .replace('<div class="rf-paybar lf2-paybar"', '<div class="rf-paybar lf2-paybar pp-inline" data-inline');
const scripts = pick(/<script src="pq\.js[\s\S]*?(?=<\/body>)/, 'scripts');
const footer = pick(/<footer class="rf-footer pq-legal-footer">[\s\S]*?<\/style>/, 'footer');
const reviews = pick(/<section class="rf-section rf-social"[\s\S]*?<\/section>/, 'reviews');
const d1 = readFileSync('assets/prequal/design-1-today.html', 'utf8');
const pick1 = (re, what) => { const m = d1.match(re); if (!m) throw new Error('not found in design-1-today: ' + what); return m[0]; };
const check = pick1(/<section class="lf2-ph pp-check"[\s\S]*?<section class="pp-nomatch" id="ppTaken"[\s\S]*?<\/section>/, 'new-number block');
const checkJs = pick1(/<script>\(function\(\)\{\nvar c=document\.getElementById\('legal'\)[\s\S]*?<\/script>/, 'new-number script');

// Lock icon (24px line icon) for the task card.
const ic = {
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[k]}</svg>`;
const check2 = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#177245"/><path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prequal Landing · Unlock</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="rf-landing.css"><link rel="stylesheet" href="rf-landing-v2.css"><link rel="stylesheet" href="ds.css"><script defer src="rf-social-proof.js"></script><link rel="stylesheet" href="pq-offer.css?v=3"><link rel="stylesheet" href="phone.css?v=11"><link rel="stylesheet" href="landing-unlock.css?v=5"></head><body>
<header class="rf-header"><div class="rf-shell"><a class="rf-logo-link" href="#" aria-label="Regional Finance home"><img src="logo-header.svg" alt="Regional Finance"></a></div></header>
<main class="rf-main lu">
<section class="lu-hero"><div class="rf-shell"><div class="rf-task"><h1 class="lu-h1" id="luFast"><span data-first>Hi Jordan, you’ve unlocked Fast Track</span><span data-back hidden>Welcome back, Jordan. Fast Track is still unlocked</span></h1></div></div></section>
<div class="rf-shell"><div class="rf-task">


<section class="lu-panel" aria-labelledby="luFast">
<ul class="lu-list">
<li>${check2}<span>Your selected offer: <b>$12,500</b> at <b>$421/month</b><sup class="lu-fn">1</sup></span></li>
<li>${check2}<span>Get your funds as fast as instant funding<sup class="lu-fn">2</sup></span></li>
<li>${check2}<span>Simple, fast, and 100% online</span></li>
</ul>
</section>

<section class="lu-card" aria-labelledby="luTitle">
<div class="lu-head"><span class="lu-lock">${svg('lock')}</span><h2 class="lu-title" id="luTitle">Unlock your application</h2></div>
<p class="lu-sub" data-pp-fileonly><span data-first>Confirm your mobile number to keep going.</span><span data-back hidden>Confirm your mobile number to pick up where you left off.</span></p>
<p class="lu-sub" data-pp-checkonly hidden>Confirm it’s you to keep going.</p>
<div class="lu-num" id="ppFile"><span class="lu-num-val">***-***-7890</span><button type="button" class="pp-link" data-notmine>Update</button></div>
${check}
${bar}
</section>
</div></div>
</main>
${reviews}
${footer}
${scripts}${checkJs}
<script>/* Came back (?returning=1): welcome-back wording in the panel and the card. */
if (/[?&]returning=1\\b/.test(location.search)) document.querySelectorAll('[data-first],[data-back]').forEach(function (x) { x.hidden = x.hasAttribute('data-first'); });</script></body></html>
`;
writeFileSync('assets/prequal/landing-unlock.html', html);
console.log('landing-unlock.html');
