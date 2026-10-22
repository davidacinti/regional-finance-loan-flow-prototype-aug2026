// Prequal landing · where to confirm the phone (for the team, Oct 2026). Not wired into the prototype's flows.
// Today's landing design (assets/prequal/landing-a.html) unchanged, plus the phone confirmation in one of three places:
//   phone-1-below.html   below the offer card (same spot as the Credit Karma mobile field)
//   phone-2-bar.html     in the pinned bar, above the consent
//   phone-3-card.html    inside the offer card, as its last row
// "This isn't my number" opens the same check in the page (date of birth + SSN last 4 + new number) before any code.
// Situations (?state=): notmine (they tapped the link), nophone (Credit Karma: no number on file),
// nomatch (the details didn't match after 3 tries).   node tools/phone-options.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const NUM = '***-***-7890';
const link = (cls = '') => `<button type="button" class="pp-link${cls}" data-notmine>This isn’t my number</button>`;

// The check that replaces "we'll text the number on file" (the same block for every option and situation).
const check = `<section class="lf2-ph pp-check" id="ppCheck" hidden aria-labelledby="ppCheckTitle">
<h2 class="pp-title" id="ppCheckTitle">Confirm it’s you</h2>
<p class="pp-sub" id="ppWhy">For your security, we confirm a few details before we text a new number.</p>
<div class="pp-field"><label class="lf2-ph-label" for="ppDob">Date of birth</label><input class="lf2-ph-input" id="ppDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div class="pp-field"><label class="lf2-ph-label" for="ppSsn">SSN · last 4</label><input class="lf2-ph-input" id="ppSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
<div class="pp-field"><label class="lf2-ph-label" for="ppPhone" id="ppPhoneLabel">New mobile number</label><input class="lf2-ph-input" id="ppPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14"></div>
<p class="lf2-ph-help" id="ppHelp">We’ll text you a code to confirm it’s you.</p>
<button type="button" class="pp-link" id="ppBack">Use ${NUM} instead</button>
</section>
<section class="pp-nomatch" id="ppNoMatch" hidden role="alert">
<h2 class="pp-title">We couldn’t match those details</h2>
<p class="pp-sub">For your security, we can’t text a new number online. Give us a call and we’ll help you finish your loan.</p>
<a class="btn rf-btn pp-call" href="#">Call us</a>
</section>`;

const OPTIONS = [
  { file: 'phone-1-below.html', title: 'Phone · 1 below the offer',
    place: (h) => h.replace('<div class="lf2-next lf2-know">', `<section class="lf2-ph pp-file" id="ppFile"><span class="lf2-ph-label">We’ll text your code to</span><div class="pp-num">${NUM}</div>${link()}</section>\n${check}\n<div class="lf2-next lf2-know">`) },
  { file: 'phone-2-bar.html', title: 'Phone · 2 in the pinned bar',
    place: (h) => h.replace('<div class="lf2-next lf2-know">', `${check}\n<div class="lf2-next lf2-know">`)
      .replace('<div class="rf-paybar lf2-paybar" role="region" aria-label="Your selected offer"><div class="in">', `<div class="rf-paybar lf2-paybar" role="region" aria-label="Your selected offer"><div class="in"><div class="pp-barline" id="ppFile"><span>We’ll text your code to <b>${NUM}</b></span>${link()}</div>`) },
  { file: 'phone-3-card.html', title: 'Phone · 3 inside the offer card',
    place: (h) => h.replace('<!-- PARKED', `<div class="pp-cardrow" id="ppFile"><div><span class="data-label">We’ll text your code to</span><b>${NUM}</b></div>${link()}</div>\n<!-- PARKED`)
      .replace('<div class="lf2-next lf2-know">', `${check}\n<div class="lf2-next lf2-know">`) },
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
 var ck=st==='nophone';document.getElementById('ppBack').hidden=ck;
 document.getElementById('ppWhy').textContent=ck?'For your security, we confirm a few details before we text you a code.':'For your security, we confirm a few details before we text a new number.';
 document.getElementById('ppPhoneLabel').textContent=ck?'Mobile number':'New mobile number';s()}
document.querySelectorAll('[data-notmine]').forEach(function(x){x.addEventListener('click',function(){show('notmine');K.scrollIntoView({block:'center'})})});
document.getElementById('ppBack').addEventListener('click',function(){show('file')});
c.addEventListener('change',s);
var m=location.search.match(/[?&]state=(notmine|nophone|nomatch)\\b/);show(m?m[1]:'file');
})();</script>`;

for (const o of OPTIONS) {
  let html = o.place(base).replace(/<title>[^<]*<\/title>/, `<title>${o.title}</title>`)
    .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="phone.css?v=1"><link rel="stylesheet" href="pq-offer.css')
    .replace('</body>', js + '</body>');
  if (!html.includes('id="ppFile"')) throw new Error('placement failed: ' + o.file);
  writeFileSync('assets/prequal/' + o.file, html);
  console.log(o.file);
}
