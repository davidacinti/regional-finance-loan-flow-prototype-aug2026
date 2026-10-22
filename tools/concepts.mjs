// Prequal landing CONCEPTS for the team's brainstorm (Oct 2026). Not wired into the prototype's flows.
// Each concept is the current landing (assets/prequal/landing-a.html: head, reviews, legal footer, consent bar) with its own
// main content and button. Writes assets/prequal/concept-*.html.   node tools/concepts.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const mainStart = base.indexOf('<main'), mainEnd = base.indexOf('</main>') + 7;

const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const hero = (lead = 'Simple, fast, and 100% online.') => `<section class="lf2-hero"><div class="rf-shell"><div class="rf-task">
<h1 class="lf2-h1">Hi Jordan, let's finish your loan.</h1>
<p class="lf2-lead lf2-trust">${lead} <span class="lf2-tp"><span aria-hidden="true">★</span> 4.5 on Trustpilot</span></p>
</div></div></section>`;
const offer = `<div class="lf2-offer"><div class="lf2-ribbon">You’re a strong fit for this offer</div><div class="lf2-offer-body">
<div class="lf2-top"><div><span class="data-label">Your pre-qualified offer<sup class="lf2-fn">1</sup></span><div class="money-primary">$15,000</div><div class="lf2-type">Unsecured personal loan</div></div><span class="data-label">Expires Nov 6</span></div>
<div class="lf2-stats"><div><span>Monthly</span><b>$505</b></div><div><span>Term</span><b>36 mo</b></div><div><span>APR</span><b>13.01%</b></div></div>
</div></div>`;
const borrow = `<div class="lf2-next lf2-know"><h2>Borrow your way</h2><ul>
<li><img src="rf-check-seal.svg" alt=""><div><b>We look beyond your credit score</b><span>Your income and budget count, not just your score.<sup class="lf2-fn lf2-fn-dag">&dagger;</sup></span></div></li>
<li><img src="rf-check-seal.svg" alt=""><div><b>Money as soon as today<sup class="lf2-fn">2</sup></b><span>Link an eligible bank account for instant funding.</span></div></li>
<li><img src="rf-check-seal.svg" alt=""><div><b>A payment you’re comfortable with</b><span>Go longer for a lower monthly payment, or shorter to pay it off sooner.</span></div></li>
</ul></div>`;
const stack = (inner) => `<div class="rf-shell"><div class="rf-task lf2-stack">${inner}</div></div>`;

// Shared input formatting + "Continue only when everything is filled in" (runs after the page's own consent script).
const formJs = (fields, extra = '') => `<script>(function(){
var c=document.getElementById('legal'),b=document.querySelector('.lf2-paybar .rf-btn');
var d=function(v,n){return v.replace(/\\D/g,'').slice(0,n)};
var fmt={phone:function(v){v=d(v,10);return v.length<4?v:v.length<7?'('+v.slice(0,3)+') '+v.slice(3):'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6)},
 dob:function(v){v=d(v,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v},ssn4:function(v){return d(v,4)}};
var need=${JSON.stringify(fields)};
function ok(){return need.every(function(f){var i=document.getElementById(f[0]);return i&&d(i.value,20).length===f[1]})${extra}}
function s(){b.disabled=!(c.checked&&ok())}
need.forEach(function(f){var i=document.getElementById(f[0]);i.addEventListener('input',function(){i.value=fmt[f[2]](i.value);s()})});
c.addEventListener('change',s);document.querySelectorAll('input[name="cxSend"]').forEach(function(r){r.addEventListener('change',s)});s();
})();</script>`;

const CONCEPTS = [
  {
    file: 'concept-a-verify.html', title: 'Concept A · Confirm it’s you (phone, birthday, SSN last 4)', button: 'Continue',
    main: hero() + stack(offer + `
<section class="cx-card" aria-labelledby="cxIdTitle"><h2 class="cx-h2" id="cxIdTitle">Confirm it’s you</h2>
<p class="cx-sub">Next, we’ll text a 6-digit code to your mobile number.</p>
<div class="cx-field"><label for="cxPhone">Mobile number</label><input class="cx-input" id="cxPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14"></div>
<div class="cx-row">
<div class="cx-field"><label for="cxDob">Date of birth</label><input class="cx-input" id="cxDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div class="cx-field"><label for="cxSsn">SSN · last 4</label><input class="cx-input" id="cxSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
</div>
<p class="cx-help cx-lock">${lock}<span>We use these to find your offer and protect your account.</span></p>
</section>` + borrow),
    js: formJs([['cxPhone', 10, 'phone'], ['cxDob', 8, 'dob'], ['cxSsn', 4, 'ssn4']]),
  },
  {
    file: 'concept-b-code.html', title: 'Concept B · Birthday + choose where to get the code', button: 'Send my code',
    main: hero() + stack(offer + `
<section class="cx-card" aria-labelledby="cxCodeTitle"><h2 class="cx-h2" id="cxCodeTitle">Let’s make sure it’s you</h2>
<p class="cx-sub">Confirm your date of birth, then we’ll send you a 6-digit code.</p>
<div class="cx-field"><label for="cxDob">Date of birth</label><input class="cx-input" id="cxDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<fieldset class="cx-choices"><legend class="cx-legend">Where should we send your code?</legend>
<label class="cx-choice"><input type="radio" name="cxSend" value="sms" checked><span><b>Text me</b><small>***-***-7890</small></span></label>
<label class="cx-choice"><input type="radio" name="cxSend" value="email"><span><b>Email me</b><small>t•••••r@gmail.com</small></span></label>
</fieldset>
<p class="cx-help cx-lock">${lock}<span>We only use this to confirm it’s you.</span></p>
</section>` + borrow),
    js: formJs([['cxDob', 8, 'dob']]),
  },
  {
    file: 'concept-c-ticket.html', title: 'Concept C · New design: offer ticket + what’s next', button: 'Continue', cls: 'cx-c',
    main: `<section class="lf2-hero"><div class="rf-shell"><div class="rf-task">
<span class="cx-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>Pre-qualified</span>
<h1 class="lf2-h1">Jordan, your loan offer is waiting.</h1>
<p class="lf2-lead">Simple, fast, and 100% online.</p>
</div></div></section>` + stack(`
<div class="cx-ticket"><div class="cx-ticket-top"><span class="cx-exp">Expires Nov 6</span><span class="data-label">Your pre-qualified offer<sup class="lf2-fn">1</sup></span><div class="cx-amt">$15,000</div><div class="cx-kind">Unsecured personal loan</div></div>
<div class="cx-perf" aria-hidden="true"></div>
<div class="cx-ticket-rows"><div><span>Monthly payment</span><b>$505</b></div><div><span>Term</span><b>36 months</b></div><div><span>APR</span><b>13.01%</b></div><div><span>Origination fee</span><b>$450</b></div></div></div>
<div class="cx-next"><h2>What’s next</h2><ol class="cx-steps">
<li><i>1</i><div><b>Confirm it’s you</b><span>We text a 6-digit code to the phone on file.</span></div></li>
<li><i>2</i><div><b>Link your bank</b><span>It confirms your income and where to send your money.</span></div></li>
<li><i>3</i><div><b>Sign and get your money</b><span>As soon as today with an eligible bank account.<sup class="lf2-fn">2</sup></span></div></li>
</ol></div>
<div class="cx-trust"><div><b class="tp">★ 4.5</b>on Trustpilot</div><div><b>2M+</b>customers helped</div><div><b>100%</b>online</div></div>`),
    js: '',
  },
];

for (const c of CONCEPTS) {
  let html = base.slice(0, mainStart) + `<main class="rf-main lf2${c.cls ? ' ' + c.cls : ''}">` + c.main + '</main>' + base.slice(mainEnd);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${c.title}</title>`)
    .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="concepts.css?v=1"><link rel="stylesheet" href="pq-offer.css')
    .replace('<button type="button" class="btn rf-btn rf-btn-primary">Continue</button>', `<button type="button" class="btn rf-btn rf-btn-primary">${c.button}</button>`)
    .replace('</body>', c.js + '</body>');
  writeFileSync('assets/prequal/' + c.file, html);
  console.log(c.file);
}
