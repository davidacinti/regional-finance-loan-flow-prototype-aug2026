// Prequal landing · DESIGN 1 · Today (for the team, Oct 2026). Not wired into the prototype's flows.
// Today's landing design (assets/prequal/landing-a.html) unchanged, plus "We'll text your code to ***-***-7890" below the offer
// card (same spot as the Credit Karma mobile field). Writes assets/prequal/design-1-today.html.
// (Design 2 · Get started is in the prototype: index.html ?design=2. Design 3 · Offer page: index.html ?design=3.)
// "This isn't my number" (and Credit Karma, which sends no number) shows: mobile number, then date of birth + SSN last 4.
// Situations (?state=): notmine, nophone (Credit Karma), nomatch (no match → no offer for this information; submit a new application).
//   node tools/design-1-today.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const NUM = '***-***-7890';
const link = (cls = '') => `<button type="button" class="pp-link${cls}" data-notmine>This isn’t my number</button>`;

// The block that replaces "we'll text the number on file": the same for "This isn't my number" and for Credit Karma (no number
// on file). Number first, then date of birth + SSN last 4 to match it to the offer. No security wording; never "call us".
const check = `<section class="lf2-ph pp-check" id="ppCheck" hidden aria-labelledby="ppCheckTitle">
<h2 class="pp-title" id="ppCheckTitle">Where should we text your code?</h2>
<div class="pp-field"><label class="lf2-ph-label" for="ppPhone">Mobile number</label><input class="lf2-ph-input" id="ppPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14"></div>
<p class="pp-sub">Add your date of birth and the last 4 of your SSN to match this number to your offer.</p>
<div class="pp-row">
<div class="pp-field"><label class="lf2-ph-label" for="ppDob">Date of birth</label><input class="lf2-ph-input" id="ppDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div class="pp-field"><label class="lf2-ph-label" for="ppSsn">SSN last 4</label><input class="lf2-ph-input" id="ppSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
</div>
<button type="button" class="pp-link" id="ppBack">Use ${NUM} instead</button>
</section>
<section class="pp-nomatch" id="ppNoMatch" hidden role="alert">
<h2 class="pp-title">Sorry, we don’t have an offer for this information</h2>
<p class="pp-sub">If you’d like, you can submit a new application.</p>
<a class="btn rf-btn pp-call" href="#">Submit a new application</a>
</section>`;

const OPTIONS = [
  { file: 'design-1-today.html', title: 'Design 1 · Today',
    place: (h) => h.replace('<div class="lf2-next lf2-know">', `<section class="lf2-ph pp-file" id="ppFile"><span class="lf2-ph-label">We’ll text your code to</span><div class="pp-num">${NUM}</div>${link()}</section>\n${check}\n<div class="lf2-next lf2-know">`) },
];

const js = `<script>(function(){
var c=document.getElementById('legal'),b=document.querySelector('.lf2-paybar .rf-btn'),F=document.getElementById('ppFile'),K=document.getElementById('ppCheck'),M=document.getElementById('ppNoMatch');
var d=function(v,n){return v.replace(/\\D/g,'').slice(0,n)};
var fmt={ppPhone:function(v){v=d(v,10);return v.length<4?v:v.length<7?'('+v.slice(0,3)+') '+v.slice(3):'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6)},
 ppDob:function(v){v=d(v,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v},ppSsn:function(v){return d(v,4)}};
var need={ppDob:8,ppSsn:4,ppPhone:10};
function ok(){if(!M.hidden)return false;return K.hidden||Object.keys(need).every(function(k){return d(document.getElementById(k).value,20).length===need[k]})}
function s(){b.disabled=!(c.checked&&ok())}
Object.keys(fmt).forEach(function(k){var i=document.getElementById(k);i.addEventListener('input',function(){i.value=fmt[k](i.value);s()})});
function show(st){F.hidden=st!=='file';K.hidden=st!=='notmine'&&st!=='nophone';M.hidden=st!=='nomatch';
 // Credit Karma: no number on file, so there is nothing to go back to.
 document.getElementById('ppBack').hidden=st==='nophone';s()}
document.querySelectorAll('[data-notmine]').forEach(function(x){x.addEventListener('click',function(){show('notmine');K.scrollIntoView({block:'center'})})});
document.getElementById('ppBack').addEventListener('click',function(){show('file')});
c.addEventListener('change',s);
var m=location.search.match(/[?&]state=(notmine|nophone|nomatch)\\b/);show(m?m[1]:'file');
})();</script>`;

for (const o of OPTIONS) {
  let html = o.place(base).replace(/<title>[^<]*<\/title>/, `<title>${o.title}</title>`)
    .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="phone.css?v=2"><link rel="stylesheet" href="pq-offer.css')
    .replace('</body>', js + '</body>');
  if (!html.includes('id="ppFile"')) throw new Error('placement failed: ' + o.file);
  writeFileSync('assets/prequal/' + o.file, html);
  console.log(o.file);
}
