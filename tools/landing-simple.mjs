// Prequal landing · SIMPLE (Oct 22 2026 proposal, for the team). Not wired into the prototype's flows.
// Today's landing (assets/prequal/landing-a.html) with less to read: one card with the offer under the navy "strong fit"
// ribbon and, as its last row, one line "Let’s keep going. Next, we’ll text a code to ***-***-7890 to move forward · Update". update (and ?state=notmine|nophone|
// nomatch) opens Design 1's block: mobile number, date of birth, SSN last 4; no match → submit a new application.
// Under the card, one line with the 3 steps to the money; the pinned bar adds "Continuing won't affect your credit score."
// Today's value props (+ 100% online; payment prop reworded), reviews, pinned consent + Continue bar, its scripts and legal footer are verbatim.
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
const check = pick1(/<section class="lf2-ph pp-check"[\s\S]*?<section class="pp-nomatch" id="ppTaken"[\s\S]*?<\/section>/, 'new-number block');
const checkJs = pick1(/<script>\(function\(\)\{\nvar c=document\.getElementById\('legal'\)[\s\S]*?<\/script>/, 'new-number script');
// The pinned bar gets one more line under Continue: continuing doesn't touch their credit score.
const barNote = bar.replace(/(<\/button><\/div>\n)(<\/div><\/div>)/, '$1<p class="lf2-note ps-credit">Continuing won’t affect your credit score.</p>\n$2');
if (barNote === bar) throw new Error('credit note placement failed');
const reviews = pick(/<section class="rf-section rf-social"[\s\S]*?<\/section>/, 'reviews');
const seal = '<img src="rf-check-seal.svg" alt="">';
// "Borrow your way" value props, in the user's order: credit score and money today verbatim from landing-a,
// 100% online (new), then the payment one reworded around customizing the amount and term.
const know = pick(/<div class="lf2-next lf2-know">[\s\S]*?<\/ul><\/div>/, 'value props');
const li = (text) => { const m = know.match(new RegExp('<li>(?:(?!<li>)[\\s\\S])*?' + text + '[\\s\\S]*?<\\/li>')); if (!m) throw new Error('value prop not found: ' + text); return m[0]; };
const online = `<li>${seal}<div><b>Simple, fast, and 100% online</b><span>Start now and finish on your own time.</span></div></li>`;
const payment = `<li>${seal}<div><b>A payment you’re comfortable with</b><span>Customize your amount and term as you continue.</span></div></li>`;
const props = know.slice(0, know.indexOf('<ul>') + 4).replace('lf2-know"', 'lf2-know ps-why"') + '\n' +
  [li('We look beyond your credit score'), online, li('Money as soon as today'), payment].join('\n') + '\n</ul></div>';

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prequal Landing · Simple</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="rf-landing.css"><link rel="stylesheet" href="rf-landing-v2.css"><link rel="stylesheet" href="ds.css"><script defer src="rf-social-proof.js"></script><link rel="stylesheet" href="pq-offer.css?v=3"><link rel="stylesheet" href="phone.css?v=9"><link rel="stylesheet" href="landing-simple.css?v=8"></head><body>
<header class="rf-header"><div class="rf-shell"><a class="rf-logo-link" href="#" aria-label="Regional Finance home"><img src="logo-header.svg" alt="Regional Finance"></a></div></header>
<main class="rf-main ps">
<section class="ps-hero"><div class="rf-shell"><div class="rf-task"><h1 class="ps-h1">Hi Jordan, your loan offer is ready.</h1></div></div></section>
<div class="rf-shell"><div class="rf-task">
<section class="ps-card" aria-labelledby="psLabel">
<div class="lf2-ribbon">You’re a strong fit for this offer</div>
<div class="ps-body">
<span class="ps-label" id="psLabel">Your selected offer<sup class="ps-fn">1</sup></span>
<div class="ps-amount">$12,500</div>
<p class="ps-terms"><b>$421</b>/month · 36 months · 13.01% APR</p>
<p class="ps-exp">Offer expires Nov 6</p>
<p class="ps-num" id="ppFile"><span data-first>Let’s keep going. Next, we’ll</span><span data-back hidden>Welcome back. We’ll</span> text a code to <b>***-***-7890</b> to <span data-first>move</span><span data-back hidden>pick up where you left</span> <span class="ps-nowrap"><span data-first>forward</span><span data-back hidden>off</span> · <button type="button" class="pp-link" data-notmine>Update</button></span></p>
${check}
</div>
</section>
<p class="ps-steps"><b>3 steps to your money:</b> verify your phone · link your bank · sign · about 5 minutes</p>
${props}
</div></div>
</main>
${reviews}
${footer}
${barNote}<div class="rf-paybar-space"></div>
${scripts}${checkJs}
<script>/* Came back (?returning=1): the card line welcomes them back instead of "Let's keep going … save your offer". */
if (/[?&]returning=1\\b/.test(location.search)) document.querySelectorAll('[data-first],[data-back]').forEach(function (x) { x.hidden = x.hasAttribute('data-first'); });</script></body></html>
`;
writeFileSync('assets/prequal/landing-simple.html', html);
console.log('landing-simple.html');
