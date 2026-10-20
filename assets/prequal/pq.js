// Known customer prequal landing inside the v1 prototype: Continue (enabled by the page's own rules) tells the prototype
// to move on to the existing SMS code screen. Landing links are inert in the demo.
(function () {
  var b = document.querySelector('.lf2-paybar .rf-btn');
  if (b) b.addEventListener('click', function () {
    if (b.disabled) return;
    var m = document.getElementById('mobile');
    parent.postMessage({ rfPq: 'continue', phone: m ? m.value : '' }, '*');
  });
  document.querySelectorAll('[data-pq-continue]').forEach(function (x) { x.addEventListener('click', function () { parent.postMessage({ rfPq: 'continue', phone: '' }, '*'); }); });
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
})();
