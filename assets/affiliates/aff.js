// Affiliate pages inside the v1 prototype (copied from loan-flow-v2/mockups). These pages belong to the affiliate,
// not Regional: the prototype only needs the tap on Regional's offer to move on to Regional's prequal landing.
(function () {
  // Board-only notes (redlines, "Mockup · demo values" tags) aren't part of the page.
  document.querySelectorAll('.redline, .demo').forEach(function (e) { e.remove(); });
  var css = document.createElement('style');
  css.textContent = 'html,body{overflow-x:hidden}.phone{width:100%!important;max-width:480px;margin:0 auto;height:auto!important;min-height:100vh}';
  document.head.appendChild(css);
  var next = function () { parent.postMessage({ rfAff: 'next' }, '*'); };
  // The CTA is the button on Regional's card (AmONE and LendingTree also show a competing lender card).
  var isRegional = function (el) {
    var card = el.closest('section, .card');
    return !card || !!card.querySelector('img[alt="Regional Finance"]');
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.btn, .go, .chip.main, [data-next]');
    if (!el) { if (e.target.closest('a')) e.preventDefault(); return; }
    e.preventDefault();
    if (el.disabled || !isRegional(el)) return;
    next();
  });
})();
