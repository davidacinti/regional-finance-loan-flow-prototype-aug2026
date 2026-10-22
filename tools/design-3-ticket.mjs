// Prequal landing · DESIGN 3 · Ticket (for the team, Oct 2026). Not wired into the prototype's flows.
// A new design (offer as a ticket, fee up front) on today's landing parts (head, reviews, legal footer, consent bar).
// "We'll text your code to ***-***-7890" + "This isn't my number". Situations (?state=): notmine (date of birth + SSN last 4 +
// new number), nophone (Credit Karma: no number on file), nomatch (details didn't match after 3 tries → call us).
// Writes assets/prequal/design-3-ticket.html.   node tools/design-3-ticket.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const mainStart = base.indexOf('<main'), mainEnd = base.indexOf('</main>') + 7;
const stack = (inner) => `<div class="rf-shell"><div class="rf-task lf2-stack">${inner}</div></div>`;
const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
const tp = '<span class="lf2-tp"><span aria-hidden="true">★</span> 4.5 on Trustpilot</span>';

// The shared verification card (both states) and its behavior.
const verify = `<section class="cx-card cx-a" aria-labelledby="cxSendTitle"><h2 class="cx-h2" id="cxSendTitle">We’ll text your code to</h2>
<p class="cx-phone">***-***-7890</p>
<button type="button" class="cx-link" id="cxNotMine">This isn’t my number</button>
</section>
<section class="cx-card cx-b" aria-labelledby="cxIdTitle" hidden><h2 class="cx-h2" id="cxIdTitle">Confirm it’s you</h2>
<p class="cx-sub" id="cxWhy">For your security, we confirm a few details before we text a new number.</p>
<div class="cx-field"><label for="cxDob">Date of birth</label><input class="cx-input" id="cxDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div class="cx-field"><label for="cxSsn">SSN · last 4</label><input class="cx-input" id="cxSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
<div class="cx-field"><label for="cxPhone" id="cxPhoneLabel">New mobile number</label><input class="cx-input" id="cxPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14"></div>
<p class="cx-help">${lock}<span id="cxHelp">We’ll text a 6-digit code to the new number.</span></p>
<button type="button" class="cx-link" id="cxBack">Use ***-***-7890 instead</button>
</section>
<section class="cx-card cx-nomatch" id="cxNoMatch" hidden role="alert"><h2 class="cx-h2">We couldn’t match those details</h2>
<p class="cx-sub">For your security, we can’t text a new number online. Give us a call and we’ll help you finish your loan.</p>
<a class="cx-call" href="#">Call us</a></section>`;
const verifyJs = `<script>(function(){
var c=document.getElementById('legal'),b=document.querySelector('.lf2-paybar .rf-btn'),A=document.querySelector('.cx-a'),B=document.querySelector('.cx-b');
var d=function(v,n){return v.replace(/\\D/g,'').slice(0,n)};
var fmt={cxPhone:function(v){v=d(v,10);return v.length<4?v:v.length<7?'('+v.slice(0,3)+') '+v.slice(3):'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6)},
 cxDob:function(v){v=d(v,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v},cxSsn:function(v){return d(v,4)}};
var need={cxDob:8,cxSsn:4,cxPhone:10};
function ok(){if(!document.getElementById('cxNoMatch').hidden)return false;return B.hidden||Object.keys(need).every(function(k){return d(document.getElementById(k).value,20).length===need[k]})}
function s(){b.disabled=!(c.checked&&ok())}
Object.keys(fmt).forEach(function(k){var i=document.getElementById(k);i.addEventListener('input',function(){i.value=fmt[k](i.value);s()})});
function show(useNew){A.hidden=useNew;B.hidden=!useNew;s()}
document.getElementById('cxNotMine').addEventListener('click',function(){show(true);document.getElementById('cxDob').focus({preventScroll:true})});
document.getElementById('cxBack').addEventListener('click',function(){show(false)});
c.addEventListener('change',s);s();
if(/[?&]state=notmine/.test(location.search))show(true);
// Credit Karma: no phone number on file, so there is nothing to go back to.
if(/[?&]state=nomatch/.test(location.search)){A.hidden=true;B.hidden=true;document.getElementById('cxNoMatch').hidden=false;s()}
if(/[?&]state=nophone/.test(location.search)){show(true);document.getElementById('cxBack').hidden=true;document.getElementById('cxWhy').textContent='For your security, we confirm a few details before we text you a code.';document.getElementById('cxPhoneLabel').textContent='Mobile number';document.getElementById('cxHelp').textContent='We’ll text a 6-digit code to this number.'}
})();</script>`;
const steps = (first = 'Verify by text') => `<div><h2 class="cx-next-h">What’s next</h2><ol class="cx-strip">
<li><i>1</i><b>${first}</b></li><li><i>2</i><b>Link your bank</b></li><li><i>3</i><b>Sign and get your money<sup class="lf2-fn">2</sup></b></li></ol></div>`;
const borrow = `<div class="lf2-next lf2-know"><h2>Borrow your way</h2><ul>
<li><img src="rf-check-seal.svg" alt=""><div><b>We look beyond your credit score</b><span>Your income and budget count, not just your score.<sup class="lf2-fn lf2-fn-dag">&dagger;</sup></span></div></li>
<li><img src="rf-check-seal.svg" alt=""><div><b>Money as soon as today<sup class="lf2-fn">2</sup></b><span>Link an eligible bank account for instant funding.</span></div></li>
<li><img src="rf-check-seal.svg" alt=""><div><b>A payment you’re comfortable with</b><span>Go longer for a lower monthly payment, or shorter to pay it off sooner.</span></div></li>
</ul></div>`;

const OPTIONS = [
  { file: 'design-3-ticket.html', title: 'Design 3 · Ticket', cls: 'opt-ticket',
    main: `<section class="lf2-hero"><div class="rf-shell"><div class="rf-task">
<span class="cx-chip">${check}Pre-qualified</span>
<h1 class="lf2-h1">Jordan, your loan offer is waiting.</h1>
<p class="lf2-lead lf2-trust">Simple, fast, and 100% online. ${tp}</p>
</div></div></section>` + stack(`<div class="cx-ticket"><div class="cx-ticket-top"><span class="cx-exp">Expires Nov 6</span><span class="data-label">Your pre-qualified offer<sup class="lf2-fn">1</sup></span><div class="cx-amt">$15,000</div><div class="cx-kind">Unsecured personal loan</div></div>
<div class="cx-perf" aria-hidden="true"></div>
<div class="cx-terms"><div><span>Monthly</span><b>$505</b></div><div><span>Term</span><b>36 months</b></div><div><span>APR</span><b>13.01%</b></div><div><span>Origination fee</span><b>$450</b></div></div></div>` + verify + steps()) },

];

for (const o of OPTIONS) {
  let html = base.slice(0, mainStart) + `<main class="rf-main lf2${o.cls ? ' ' + o.cls : ''}">` + o.main + '</main>' + base.slice(mainEnd);
  if (o.noBar) {
    // No pinned bar (the consent and buttons are in the page); reviews show portraits, heading and rating only.
    const b0 = html.indexOf('<div class="rf-paybar'), b1 = html.indexOf('<section class="rf-section rf-social"');
    html = html.slice(0, b0) + html.slice(b1);
    html = html.replace('<rf-social-proof cta-target="_blank"', '<rf-social-proof compact cta-target="_blank"')
      .replace('src="rf-social-proof.js"', 'src="rf-social-proof.js?v=2"');
  }
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${o.title}</title>`)
    .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="concepts.css?v=2"><link rel="stylesheet" href="pq-offer.css')
    .replace('</body>', (o.js || verifyJs) + '</body>');
  writeFileSync('assets/prequal/' + o.file, html);
  console.log(o.file);
}
