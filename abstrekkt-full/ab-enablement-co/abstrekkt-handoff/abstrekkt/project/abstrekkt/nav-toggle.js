// Abstrekkt — accessible mobile nav disclosure.
// Wires any header.nav containing a .nav-toggle button + .nav-links menu into an
// open/close disclosure: click to toggle, Escape / outside click / link click to close.
(function () {
  function init(nav) {
    var toggle = nav.querySelector('.nav-toggle');
    var links = nav.querySelector('.nav-links');
    if (!toggle || !links) return;
    if (!links.id) links.id = 'primary-nav';
    toggle.setAttribute('aria-controls', links.id);

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.setAttribute('data-open', String(open));
    }
    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) setOpen(false);
    });
  }
  document.querySelectorAll('header.nav').forEach(init);
})();
