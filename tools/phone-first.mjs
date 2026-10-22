// Prequal landing · PHONE FIRST (for the team, Oct 2026). Not wired into the prototype's flows.
// Today's landing design with the mobile number field at the top. The customer types their number (autofill makes it a tap);
// we compare it with the number on file without saying so:
//   same number      → Continue → code. Nothing else shows.
//   different / none → date of birth + SSN last 4 slide in under it ("Provide this information to finalize your loan"), then the code.
//                      Credit Karma sends no number, so it always takes this path; same screen as everyone else.
//   details wrong 3× → "Sorry, we don't have an offer for this information" + submit a new application. Never "call us".
// Demo: the number on file is (123) 456-7890. ?state=match | new | nomatch prefill a case for the board.
// Writes assets/prequal/phone-first.html.   node tools/phone-first.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = readFileSync('assets/prequal/landing-a.html', 'utf8');
const ON_FILE = '1234567890';

const field = `<section class="lf2-ph pf" id="pf" aria-labelledby="pfLabel">
<label class="lf2-ph-label" id="pfLabel" for="pfPhone">Mobile number</label>
<input class="lf2-ph-input" id="pfPhone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 555-5555" maxlength="14">
<p class="lf2-ph-help" id="pfHelp">We’ll text you a code to continue.</p>
<div class="pf-more" id="pfMore" hidden>
<p class="pf-note">Provide this information to finalize your loan.</p>
<div class="pf-row">
<div><label class="lf2-ph-label" for="pfDob">Date of birth</label><input class="lf2-ph-input" id="pfDob" inputmode="numeric" autocomplete="bday" placeholder="MM/DD/YYYY" maxlength="10"></div>
<div><label class="lf2-ph-label" for="pfSsn">SSN last 4</label><input class="lf2-ph-input" id="pfSsn" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" maxlength="4"></div>
</div>
</div>
<div class="pf-nomatch" id="pfNoMatch" hidden role="alert"><b>Sorry, we don’t have an offer for this information</b><span>If you’d like, you can submit a new application.</span><a class="pf-call" href="#">Submit a new application</a></div>
</section>`;

const js = `<script>(function(){
var ON_FILE='${ON_FILE}';
var c=document.getElementById('legal'),b=document.querySelector('.lf2-paybar .rf-btn'),P=document.getElementById('pfPhone'),M=document.getElementById('pfMore'),X=document.getElementById('pfNoMatch'),H=document.getElementById('pfHelp');
var d=function(v,n){return v.replace(/\\D/g,'').slice(0,n)};
var fmt={pfPhone:function(v){v=d(v,10);return v.length<4?v:v.length<7?'('+v.slice(0,3)+') '+v.slice(3):'('+v.slice(0,3)+') '+v.slice(3,6)+'-'+v.slice(6)},
 pfDob:function(v){v=d(v,8);return v.length>4?v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4):v.length>2?v.slice(0,2)+'/'+v.slice(2):v},pfSsn:function(v){return d(v,4)}};
function phone(){return d(P.value,10)}
function sync(){var full=phone().length===10, other=full&&phone()!==ON_FILE;
 M.hidden=!other||!X.hidden; H.hidden=other;
 var ready=full&&X.hidden&&(!other||(d(document.getElementById('pfDob').value,8).length===8&&d(document.getElementById('pfSsn').value,4).length===4));
 b.disabled=!(c.checked&&ready)}
Object.keys(fmt).forEach(function(k){var i=document.getElementById(k);i.addEventListener('input',function(){i.value=fmt[k](i.value);sync()})});
c.addEventListener('change',sync);
var m=location.search.match(/[?&]state=(match|new|nomatch)\\b/),st=m&&m[1];
if(st==='match')P.value=fmt.pfPhone(ON_FILE);
if(st==='new'||st==='nomatch')P.value=fmt.pfPhone('8645551234');
if(st==='nomatch'){X.hidden=false;M.hidden=true}
sync();
})();</script>`;

let html = base.replace('<div class="rf-shell"><div class="rf-task lf2-stack">', `<div class="rf-shell"><div class="rf-task lf2-stack">\n${field}`)
  .replace(/<title>[^<]*<\/title>/, '<title>Prequal landing · phone first</title>')
  .replace('<link rel="stylesheet" href="pq-offer.css', '<link rel="stylesheet" href="phone-first.css?v=2"><link rel="stylesheet" href="pq-offer.css')
  .replace('</body>', js + '</body>');
if (!html.includes('id="pf"')) throw new Error('placement failed');
writeFileSync('assets/prequal/phone-first.html', html);
console.log('phone-first.html');
