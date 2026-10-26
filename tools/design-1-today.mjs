// Prequal landing · DESIGN 1 · Today (for the team, Oct 2026). Not wired into the prototype's flows.
// Today's landing design (assets/prequal/landing-a.html) unchanged, plus "We'll text your code to ***-***-7890" below the offer
// card (same spot as the Credit Karma mobile field). Writes assets/prequal/design-1-today.html.
// (Design 2 · Get started is in the prototype: index.html ?design=2. Design 3 · Offer page: index.html ?design=3.)
// "This isn't my number" (and Credit Karma, which sends no number) shows: mobile number, date of birth + SSN last 4. No way back to the number on file.
// Situations (?state=): notmine, nophone (Credit Karma), nomatch (no match → no offer for this information; submit a new application).
//   node tools/design-1-today.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const NUM = '***-***-7890';
// One small line: the masked number we'll text, with "Edit" to give a different number.
const line = `<p class="pp-line" id="ppFile">We’ll text your code to <b>${NUM}</b> <button type="button" class="pp-link" data-notmine>Edit</button></p>`;

// The block that replaces "we'll text the number on file": the same for "This isn't my number" and for Credit Karma (no number
// on file). Number first, then date of birth + SSN last 4 to match it to the offer. No security wording; never "call us".
const check = `<section class="lf2-ph pp-check" id="ppCheck" hidden aria-labelledby="ppCheckTitle">
<h2 class="pp-title" id="ppCheckTitle">Where should we text your code?</h2>
<p class="pp-sub">We’ll send a code to this number to save your offer.</p>
<div class="pp-field"><label class="lf2-ph-label" for="ppPhone">Mobile number</label><input class="lf2-ph-input" id="ppPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14"></div>
<div class="pp-row">
<div class="pp-field"><label class="lf2-ph-label" for="ppDob">Date of birth</label><input class="lf2-ph-input" id="ppDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div class="pp-field"><label class="lf2-ph-label" for="ppSsn">SSN last 4</label><input class="lf2-ph-input" id="ppSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
</div>
</section>
<section class="pp-nomatch" id="ppNoMatch" hidden role="alert">
<h2 class="pp-title">Sorry, we don’t have an offer for this information</h2>
<p class="pp-sub">If you’d like, you can submit a new application.</p>
<a class="btn rf-btn pp-call" href="#" data-pq-newapp>Submit a new application</a>
</section>
<section class="pp-nomatch" id="ppTaken" hidden role="alert">
<h2 class="pp-title">This offer is already saved to another number</h2>
<p class="pp-sub">When you started, we saved it to <b>${NUM}</b>. To use a new number, you may need to submit a new application.</p>
<a class="btn rf-btn pp-call" href="#" data-pq-newapp>Submit a new application</a>
<p class="pp-back"><button type="button" class="pp-link" data-pp-back>Go back</button></p>
</section>`;

const OPTIONS = [
  { file: 'design-1-today.html', title: 'Design 1 · Today',
    place: (h) => h.replace('<div class="lf2-next lf2-know">', `${line}\n${check}\n<div class="lf2-next lf2-know">`) },
];

const js = `<script>(function(){
var c=document.getElementById('legal'),b=document.querySelector('.lf2-paybar .rf-btn'),F=document.getElementById('ppFile'),K=document.getElementById('ppCheck'),M=document.getElementById('ppNoMatch'),T=document.getElementById('ppTaken');
// Came back (?returning=1): they gave us a number on their first visit, and the offer is saved to it.
var R=/[?&]returning=1\\b/.test(location.search);
var d=function(v,n){return v.replace(/\\D/g,'').slice(0,n)};
var fmt={ppPhone:function(v){v=d(v,10);return v.length<4?v:v.length<7?'('+v.slice(0,3)+') '+v.slice(3):'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6)},
 ppDob:function(v){v=d(v,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v},ppSsn:function(v){return d(v,4)}};
var need={ppDob:8,ppSsn:4,ppPhone:10};
// Centers a block by scrolling this page only (scrollIntoView would also scroll the prototype page around the iframe).
function ctr(el){var r=el.getBoundingClientRect();window.scrollTo(0,Math.max(0,r.top+window.pageYOffset-(window.innerHeight-r.height)/2))}
function ok(){if(!M.hidden||!T.hidden)return false;return K.hidden||Object.keys(need).every(function(k){return d(document.getElementById(k).value,20).length===need[k]})}
function s(){b.disabled=!(c.checked&&ok())}
Object.keys(fmt).forEach(function(k){var i=document.getElementById(k);i.addEventListener('input',function(){i.value=fmt[k](i.value);s()})});
// While they type a new number, the consent + Continue sit at the end of that block instead of in the pinned bar (a pinned
// bar under a form felt odd). The bar element itself moves, so every script bound to it keeps working.
var bar=document.querySelector('.lf2-paybar'),home=bar.parentNode,after=bar.nextSibling,gap=document.querySelector('.rf-paybar-space');
// A page whose bar is always inline (data-inline, e.g. Design 5 · Unlock) keeps it inline in both places.
var always=bar.hasAttribute('data-inline');
function place(inl){if(inl)K.appendChild(bar);else home.insertBefore(bar,after);bar.classList.toggle('pp-inline',inl||always);if(gap)gap.hidden=inl||always}
function show(st){F.hidden=st!=='file';K.hidden=st!=='notmine'&&st!=='nophone';M.hidden=st!=='nomatch';T.hidden=st!=='taken';place(!K.hidden);s()}
document.querySelectorAll('[data-notmine]').forEach(function(x){x.addEventListener('click',function(){show('notmine');ctr(K)})});
document.querySelectorAll('[data-pp-back]').forEach(function(x){x.addEventListener('click',function(){show('file');ctr(F)})});
c.addEventListener('change',s);
// We look the details up when they continue: a match goes on to the code (pq.js sends the new number); no match (prototype:
// SSN last 4 0000) shows "Sorry, we don't have an offer for this information" here instead. Came back with a number other
// than the one the offer is saved to (prototype: not ending 7890): "This offer is already saved to another number".
// Capture runs before pq.js.
document.addEventListener('click',function(e){if(!e.target.closest('.lf2-paybar .rf-btn')||b.disabled||K.hidden)return;
 var no=d(document.getElementById('ppSsn').value,4)==='0000',taken=!no&&R&&d(document.getElementById('ppPhone').value,10).slice(-4)!=='7890';
 if(!no&&!taken)return;e.stopImmediatePropagation();e.preventDefault();show(no?'nomatch':'taken');ctr(no?M:T)},true);
var m=location.search.match(/[?&]state=(notmine|nophone|nomatch|taken)\\b/);show(m?m[1]:'file');
})();</script>`;

for (const o of OPTIONS) {
  let html = o.place(base).replace(/<title>[^<]*<\/title>/, `<title>${o.title}</title>`)
    .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="phone.css?v=7"><link rel="stylesheet" href="pq-offer.css')
    .replace('</body>', js + '</body>');
  if (!html.includes('id="ppFile"')) throw new Error('placement failed: ' + o.file);
  writeFileSync('assets/prequal/' + o.file, html);
  console.log(o.file);
}
