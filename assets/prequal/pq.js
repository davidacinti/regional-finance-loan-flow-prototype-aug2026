// Known customer prequal landing inside the v1 prototype: Continue (enabled by the page's own rules) tells the prototype
// to move on to the existing SMS code screen. Landing links are inert in the demo.
(function () {
  // ?via=<partner name> names the channel on the offer card ("Your offer from Credit Karma"); ?via= (empty) = Regional's own channel.
  var via = new URLSearchParams(location.search).get('via');
  if (via !== null) document.querySelectorAll('.data-label').forEach(function (l) {
    if (l.firstChild && /^Your offer from /.test(l.firstChild.nodeValue || '')) l.firstChild.nodeValue = via ? 'Your offer from ' + via : 'Your offer';
  });
  var b =document.querySelector('.lf2-paybar .rf-btn');
  if (b) b.addEventListener('click', function () {
    if (b.disabled) return;
    var m = document.getElementById('mobile');
    parent.postMessage({ rfPq: 'continue', phone: m ? m.value : '' }, '*');
  });
  document.querySelectorAll('[data-pq-continue]').forEach(function (x) { x.addEventListener('click', function () { parent.postMessage({ rfPq: 'continue', phone: '' }, '*'); }); });
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
})();
