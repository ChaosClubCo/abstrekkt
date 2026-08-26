/* ============================================================
   KYLE ROSEBROOK — shared interactions
   Mobile nav · index filters · draft table panel · decision matrix
   ============================================================ */
(function () {
  'use strict';

  /* ---- mobile nav ---- */
  function initBurger() {
    var b = document.querySelector('.kr-burger');
    var links = document.querySelector('.kr-nav-links');
    if (!b || !links) return;
    b.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  /* ---- editorial index filters ----
     buttons: .kr-filter[data-cat]; rows: .kr-rowitem[data-cats="a b c"] */
  function initFilters() {
    var filterBar = document.querySelector('.kr-filters');
    if (!filterBar) return;
    var filters = filterBar.querySelectorAll('.kr-filter');
    var rows = document.querySelectorAll('.kr-rowlist .kr-rowitem');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.remove('active'); });
        f.classList.add('active');
        var cat = f.getAttribute('data-cat');
        var visible = 0;
        rows.forEach(function (r) {
          var cats = (r.getAttribute('data-cats') || '').split(/\s+/);
          var show = cat === 'all' || cats.indexOf(cat) !== -1;
          r.style.display = show ? '' : 'none';
          if (show) { visible++; var num = r.querySelector('.num'); if (num) num.textContent = String(visible).padStart(2, '0'); }
        });
      });
    });
  }

  /* ---- draft / item detail panel ----
     rows: tr[data-detail] or [data-row] carrying a JSON payload in data-detail
     target panel: #kr-panel with [data-field] slots */
  function initDetailTable() {
    var tables = document.querySelectorAll('[data-detail-table]');
    tables.forEach(function (table) {
      var panelId = table.getAttribute('data-detail-table');
      var panel = document.getElementById(panelId);
      if (!panel) return;
      var rows = table.querySelectorAll('tbody tr');
      function select(tr) {
        rows.forEach(function (r) { r.classList.remove('sel'); });
        tr.classList.add('sel');
        var data = {};
        try { data = JSON.parse(tr.getAttribute('data-detail') || '{}'); } catch (e) {}
        Object.keys(data).forEach(function (k) {
          var slot = panel.querySelector('[data-field="' + k + '"]');
          if (slot) {
            if (Array.isArray(data[k])) {
              slot.innerHTML = data[k].map(function (t) { return '<span class="kr-tag">' + t + '</span>'; }).join('');
            } else { slot.textContent = data[k]; }
          }
        });
        panel.classList.add('show');
        panel.style.display = '';
      }
      rows.forEach(function (tr) { tr.addEventListener('click', function () { select(tr); }); });
      var closeBtn = panel.querySelector('[data-panel-close]');
      if (closeBtn) closeBtn.addEventListener('click', function () { panel.style.display = 'none'; rows.forEach(function (r) { r.classList.remove('sel'); }); });
      var sel = table.querySelector('tbody tr');
      if (sel) select(sel);
    });
  }

  /* ---- decision matrix ----
     table#kr-matrix with editable number cells [contenteditable] in tbody,
     totals row #kr-matrix-total cells [data-col] */
  function initMatrix() {
    var matrix = document.getElementById('kr-matrix');
    if (!matrix) return;
    function recalc() {
      var cols = ['a', 'b', 'c'];
      var totals = { a: 0, b: 0, c: 0 };
      matrix.querySelectorAll('tbody tr[data-score]').forEach(function (tr) {
        cols.forEach(function (c) {
          var cell = tr.querySelector('[data-col="' + c + '"]');
          if (cell) { var v = parseFloat(cell.textContent) || 0; totals[c] += v; }
        });
      });
      var best = Math.max(totals.a, totals.b, totals.c);
      cols.forEach(function (c) {
        var t = document.querySelector('#kr-matrix-total [data-col="' + c + '"]');
        if (t) { t.textContent = totals[c]; t.classList.toggle('win', totals[c] === best && best > 0); }
      });
    }
    matrix.addEventListener('input', recalc);
    matrix.querySelectorAll('tbody [contenteditable]').forEach(function (c) {
      c.addEventListener('focus', function () { document.execCommand && document.getSelection().selectAllChildren(c); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); c.blur(); } });
    });
    recalc();
  }

  /* ---- live clock for rail chips [data-clock] (CT) ---- */
  function initClock() {
    var els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    function tick() {
      var t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago', hour12: true });
      els.forEach(function (e) { e.textContent = t + ' CT'; });
    }
    tick(); setInterval(tick, 30000);
  }

  function init() { initBurger(); initFilters(); initDetailTable(); initMatrix(); initClock(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
