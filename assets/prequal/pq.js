// Known customer prequal landing inside the v1 prototype: Continue (enabled by the page's own rules) tells the prototype
// to move on to the existing SMS code screen, with the offer the customer chose. Landing links are inert in the demo.
(function () {
  // The offer editor ("Select another option"). Price model, shared with index.html (pqApr / pqPayment there):
  // APR by term, 0.25% off with autopay, 3% origination fee, fixed monthly payment (amortized).
  var APR = { 3: 13.01, 4: 13.49, 5: 13.99 };
  var offer = { amount: 15000, term: 3, autopay: false };
  var apr = function (t) { return APR[t] - (offer.autopay ? 0.25 : 0); };
  var payment = function () { var r = apr(offer.term) / 1200, n = offer.term * 12; return offer.amount * r / (1 - Math.pow(1 + r, -n)); };
  var money = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); };
  var set = function (key, text) {
    document.querySelectorAll('[data-pq="' + key + '"]').forEach(function (el) {
      if (el.textContent === text) return;
      el.textContent = text; el.classList.remove('lf2-flash'); void el.offsetWidth; el.classList.add('lf2-flash');
    });
  };
  var edit = document.getElementById('pqEdit');
  function show() {
    set('amount', money(offer.amount)); set('monthly', money(payment())); set('term', offer.term * 12 + ' mo');
    set('apr', apr(offer.term).toFixed(2) + '%'); set('fee', money(offer.amount * 0.03));
    if (!edit) return;
    var range = document.getElementById('pqAmount');
    range.value = offer.amount; range.setAttribute('aria-valuetext', money(offer.amount));
    range.style.setProperty('--p', ((offer.amount - range.min) / (range.max - range.min) * 100) + '%');
    edit.querySelectorAll('.lf2-step').forEach(function (b) { var s = +b.dataset.step; b.disabled = s < 0 ? offer.amount <= +range.min : offer.amount >= +range.max; });
    edit.querySelectorAll('[data-term]').forEach(function (b) { b.setAttribute('aria-checked', String(+b.dataset.term === offer.term)); });
    edit.querySelectorAll('[data-pq-apr]').forEach(function (s) { s.textContent = apr(+s.dataset.pqApr).toFixed(2) + '% APR'; });
    edit.querySelector('.lf2-switch').setAttribute('aria-checked', String(offer.autopay));
  }
  if (edit) {
    var toggle = document.querySelector('.lf2-toggle');
    toggle.addEventListener('click', function () {
      var open = edit.hidden; edit.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Hide options' : 'Select another option';
    });
    document.getElementById('pqAmount').addEventListener('input', function (e) { offer.amount = +e.target.value; show(); });
    edit.querySelectorAll('.lf2-step').forEach(function (b) { b.addEventListener('click', function () { offer.amount = Math.min(15000, Math.max(1000, offer.amount + +b.dataset.step)); show(); }); });
    edit.querySelectorAll('[data-term]').forEach(function (b) { b.addEventListener('click', function () { offer.term = +b.dataset.term; show(); }); });
    edit.querySelector('.lf2-switch').addEventListener('click', function () { offer.autopay = !offer.autopay; show(); });
    show();
  }

  var b = document.querySelector('.lf2-paybar .rf-btn');
  if (b) b.addEventListener('click', function () {
    if (b.disabled) return;
    var m = document.getElementById('mobile');
    parent.postMessage({ rfPq: 'continue', phone: m ? m.value : '', offer: offer }, '*');
  });
  document.querySelectorAll('[data-pq-continue]').forEach(function (x) { x.addEventListener('click', function () { parent.postMessage({ rfPq: 'continue', phone: '' }, '*'); }); });
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
})();
