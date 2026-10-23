// Prequal landing · SIMPLE (Oct 22 2026 proposal, for the team). Not wired into the prototype's flows.
// Today's landing (assets/prequal/landing-a.html) with less to read: one card with the offer under the navy "strong fit"
// ribbon and, as its last row, one line "To finish your loan, we’ll text you a code to ***-***-7890 · update". update (and ?state=notmine|nophone|
// nomatch) opens Design 1's block: mobile number, date of birth, SSN last 4; no match → submit a new application.
// Today's value props (+ 100% online), reviews, pinned consent + Continue bar, its scripts and legal footer are verbatim.
//   node tools/landing-simple.mjs   → assets/prequal/landing-simple.html
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const pick = (re, what) => { const m = base.match(re); if (!m) throw new Error('not found in landing-a: ' + what); return m[0]; };
// Pinned consent + Continue bar and its scripts (pq.js, enable, nudge): today's, verbatim.
const bar = pick(/<div class="rf-paybar lf2-paybar"[\s\S]*?(?=<section class="rf-section rf-social")/, 'pinned bar');
const scripts = pick(/<script src="pq\.js[\s\S]*?(?=<\/body>)/, 'scripts');
const footer = pick(/<footer class="rf-footer pq-legal-footer">[\s\S]*?<\/style>/, 'footer');
// The new-number block, its no-match message and their script: Design 1's (tools/design-1-today.mjs), verbatim.
const d1 = readFileSync('assets/prequal/design-1-today.html', 'utf8');
const pick1 = (re, what) => { const m = d1.match(re); if (!m) throw new Error('not found in design-1-today: ' + what); return m[0]; };
const check = pick1(/<section class="lf2-ph pp-check"[\s\S]*?<section class="pp-nomatch"[\s\S]*?<\/section>/, 'new-number block');
const checkJs = pick1(/<script>\(function\(\)\{\nvar c=document\.getElementById\('legal'\)[\s\S]*?<\/script>/, 'new-number script');
const reviews = pick(/<section class="rf-section rf-social"[\s\S]*?<\/section>/, 'reviews');
const seal = '<img src="rf-check-seal.svg" alt="">';
// Today's "Borrow your way" value props, verbatim, plus one for 100% online.
const online = `<li>${seal}<div><b>Simple, fast, and 100% online</b><span>Finish your loan from your phone or computer.</span></div></li>\n</ul>`;
const props = pick(/<div class="lf2-next lf2-know">[\s\S]*?<\/ul><\/div>/, 'value props').replace(/<\/ul>(?=<\/div>$)/, online).replace('lf2-know"', 'lf2-know ps-why"');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prequal Landing · Simple</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="rf-landing.css"><link rel="stylesheet" href="rf-landing-v2.css"><link rel="stylesheet" href="ds.css"><script defer src="rf-social-proof.js"></script><link rel="stylesheet" href="pq-offer.css?v=3"><link rel="stylesheet" href="phone.css?v=4"><link rel="stylesheet" href="landing-simple.css?v=7"></head><body>
<header class="rf-header"><div class="rf-shell"><a class="rf-logo-link" href="#" aria-label="Regional Finance home"><img src="logo-header.svg" alt="Regional Finance"></a></div></header>
<main class="rf-main ps">
<section class="ps-hero"><div class="rf-shell"><div class="rf-task"><h1 class="ps-h1">Hi Jordan, your loan offer is ready.</h1></div></div></section>
<div class="rf-shell"><div class="rf-task">
<section class="ps-card" aria-labelledby="psLabel">
<div class="lf2-ribbon">You’re a strong fit for this offer</div>
<div class="ps-body">
<span class="ps-label" id="psLabel">You’re pre-qualified for<sup class="ps-fn">1</sup></span>
<div class="ps-amount">$15,000</div>
<p class="ps-terms"><b>$505</b>/month · 36 months · 13.01% APR</p>
<p class="ps-change">Prefer a different amount or term? You can change it later.</p>
<p class="ps-exp">Offer expires Nov 6</p>
<p class="ps-num" id="ppFile">To finish your loan, we’ll text you a code to <span class="ps-nowrap"><b>***-***-7890</b> · <button type="button" class="pp-link" data-notmine>update</button></span></p>
${check}
</div>
</section>
${props}
</div></div>
</main>
${reviews}
${footer}
${bar}<div class="rf-paybar-space"></div>
${scripts}${checkJs}</body></html>
`;
writeFileSync('assets/prequal/landing-simple.html', html);
console.log('landing-simple.html');
