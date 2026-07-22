// Abstrekkt — accessible mobile nav disclosure + shared book navigation.
(function () {
  'use strict';

  function resolveBookHref() {
    var script = document.currentScript;
    var src = script && script.getAttribute('src');
    if (src && /abstrekkt\/nav-toggle\.js(?:[?#].*)?$/.test(src)) {
      return src.replace(/abstrekkt\/nav-toggle\.js(?:[?#].*)?$/, 'Tax the Damage.html');
    }
    return 'Tax the Damage.html';
  }

  var bookHref = resolveBookHref();

  function sameDocumentPath(left, right) {
    try {
      return decodeURIComponent(new URL(left, window.location.href).pathname)
        .toLowerCase() ===
        decodeURIComponent(new URL(right, window.location.href).pathname)
          .toLowerCase();
    } catch (_) {
      return false;
    }
  }

  function ensureLink(container, selector, label, beforeSelector) {
    if (!container || container.querySelector(selector)) return;

    var link = document.createElement('a');
    link.href = bookHref;
    link.textContent = label;
    link.setAttribute('data-tax-the-damage-link', '');

    if (sameDocumentPath(window.location.href, bookHref)) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }

    var before = beforeSelector ? container.querySelector(beforeSelector) : null;
    container.insertBefore(link, before || null);
  }

  function ensureBookNavigation() {
    document.querySelectorAll('.nav-links').forEach(function (links) {
      ensureLink(
        links,
        '[data-tax-the-damage-link], a[href$="Tax%20the%20Damage.html"], a[href$="Tax the Damage.html"]',
        'Book',
        'a[href*="Abstrekkt Pillars"], a[href*="Manifesto"]'
      );
    });

    document.querySelectorAll('.foot__links').forEach(function (links) {
      ensureLink(
        links,
        '[data-tax-the-damage-link], a[href$="Tax%20the%20Damage.html"], a[href$="Tax the Damage.html"]',
        'Book',
        'a[href*="Abstrekkt Contact"], a[href*="Contact"]'
      );
    });
  }

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

    links.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) setOpen(false);
    });
  }

  ensureBookNavigation();
  document.querySelectorAll('header.nav').forEach(init);
})();
