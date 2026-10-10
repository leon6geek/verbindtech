/* Machine catalogue: category chips, search, shareable URLs and enquiry dialog. */
(function () {
  'use strict';

  var C = window.VT_CATALOG;
  var VT = window.VT || {};
  if (!C) return;
  var lang = VT.lang === 'id' ? 'id' : 'en';
  var L = C.labels;
  var base = C.imgBase.replace(/\/?$/, '/');

  var chipsEl = document.querySelector('[data-chips]');
  var gridEl = document.querySelector('[data-grid]');
  var searchEl = document.querySelector('[data-search]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');
  if (!chipsEl || !gridEl) return;

  var params = new URLSearchParams(window.location.search);
  var state = { cat: L.cats[params.get('cat')] ? params.get('cat') : 'all', q: params.get('q') || '' };
  searchEl.value = state.q;

  ['all'].concat(C.categories).forEach(function (key) {
    var n = key === 'all' ? C.items.length : C.items.filter(function (p) { return p.cat === key; }).length;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.cat = key;
    b.setAttribute('aria-pressed', String(key === state.cat));
    b.appendChild(document.createTextNode(key === 'all' ? L.all : L.cats[key]));
    var s = document.createElement('small');
    s.textContent = n;
    b.appendChild(s);
    b.addEventListener('click', function () { state.cat = key; sync(); render(); });
    chipsEl.appendChild(b);
  });

  var cards = C.items.map(function (p) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'product';
    card.innerHTML = '<span class="product-img"><img loading="lazy" decoding="async"></span>' +
      '<span class="product-body"><span class="product-cat"></span><strong class="product-name"></strong><span class="product-desc"></span></span>';
    var img = card.querySelector('img');
    img.src = p.img || base + p.id + '.webp';
    img.alt = p.name;
    card.querySelector('.product-cat').textContent = L.cats[p.cat] || '';
    card.querySelector('.product-name').textContent = p.name;
    card.querySelector('.product-desc').textContent = p.desc[lang];
    card.addEventListener('click', function () { open(p); });
    gridEl.appendChild(card);
    return { el: card, p: p, hay: (p.name + ' ' + p.desc.en + ' ' + p.desc.id + ' ' + (L.cats[p.cat] || '')).toLowerCase() };
  });

  function render() {
    var q = state.q.trim().toLowerCase();
    var terms = q ? q.split(/\s+/) : [];
    var shown = 0;
    cards.forEach(function (c) {
      var ok = (state.cat === 'all' || c.p.cat === state.cat) && terms.every(function (t) { return c.hay.indexOf(t) !== -1; });
      c.el.hidden = !ok;
      if (ok) shown++;
    });
    chipsEl.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)); });
    countEl.textContent = shown + ' ' + (shown === 1 ? L.machine : L.machines) +
      (state.cat !== 'all' ? ' · ' + L.cats[state.cat] : '') + (q ? ' · “' + state.q.trim() + '”' : '');
    emptyEl.hidden = shown !== 0;
  }

  function sync() {
    var p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.q.trim()) p.set('q', state.q.trim());
    var qs = p.toString();
    try { history.replaceState(null, '', qs ? '?' + qs : window.location.pathname); } catch (e) { /* sandboxed preview */ }
  }

  var timer;
  searchEl.addEventListener('input', function () {
    state.q = searchEl.value;
    render();
    clearTimeout(timer);
    timer = setTimeout(sync, 300);
  });

  var dlg = document.querySelector('[data-product-dialog]');
  function open(p) {
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var img = dlg.querySelector('[data-pd-img]');
    img.src = p.img || base + p.id + '.webp';
    img.alt = p.name;
    dlg.querySelector('[data-pd-cat]').textContent = L.cats[p.cat] || '';
    dlg.querySelector('[data-pd-name]').textContent = p.name;
    dlg.querySelector('[data-pd-desc]').textContent = p.desc[lang];
    var text = L.enquiry.replace('%s', p.name);
    dlg.querySelector('[data-pd-wa]').href = 'https://wa.me/' + VT.wa + '?text=' + encodeURIComponent(text);
    dlg.querySelector('[data-pd-mail]').href = 'mailto:' + VT.email + '?subject=' + encodeURIComponent(L.subject + ': ' + p.name) + '&body=' + encodeURIComponent(text);
    dlg.showModal();
  }
  if (dlg) {
    dlg.querySelector('[data-pd-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  render();
  var active = chipsEl.querySelector('[aria-pressed="true"]');
  if (active && state.cat !== 'all') chipsEl.scrollLeft = active.offsetLeft - 16;
})();
