/* Machine catalogue: category chips, search and product detail dialog. */
(function () {
  'use strict';

  var products = window.VT_PRODUCTS || [];
  var contact = window.VT_CONTACT || { wa: '6281932237600', email: 'marketing@verbind-tech.net' };

  var CATEGORIES = [
    { id: 'all', label: 'All machines', chip: 'All' },
    { id: 'mixing', label: 'Mixing', chip: 'Mixing' },
    { id: 'size', label: 'Crushing & grinding', chip: 'Milling' },
    { id: 'sieving', label: 'Sieving & screening', chip: 'Sieving' },
    { id: 'conveying', label: 'Conveying & feeding', chip: 'Conveying' },
    { id: 'filling', label: 'Filling', chip: 'Filling' },
    { id: 'packaging', label: 'Packaging', chip: 'Packaging' },
    { id: 'capping', label: 'Sealing, capping & labeling', chip: 'Capping & labeling' },
    { id: 'inspection', label: 'Inspection & weighing', chip: 'Inspection' }
  ];
  var labelOf = {};
  CATEGORIES.forEach(function (c) { labelOf[c.id] = c.label; });

  var chipsEl = document.querySelector('[data-chips]');
  var gridEl = document.querySelector('[data-grid]');
  var searchEl = document.querySelector('[data-search]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');
  if (!chipsEl || !gridEl) return;

  var params = new URLSearchParams(window.location.search);
  var state = { cat: labelOf[params.get('cat')] ? params.get('cat') : 'all', q: params.get('q') || '' };
  searchEl.value = state.q;

  /* Chips */
  CATEGORIES.forEach(function (c) {
    var n = c.id === 'all' ? products.length : products.filter(function (p) { return p.cat === c.id; }).length;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('data-cat', c.id);
    b.setAttribute('aria-pressed', String(c.id === state.cat));
    b.innerHTML = '<span></span><small></small>';
    b.firstChild.textContent = c.chip;
    b.title = c.label;
    b.lastChild.textContent = n;
    b.addEventListener('click', function () { state.cat = c.id; sync(); render(); });
    chipsEl.appendChild(b);
  });

  /* Cards */
  var cards = products.map(function (p) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'product';
    card.innerHTML =
      '<div class="product-img"><img loading="lazy" decoding="async"></div>' +
      '<div class="product-body"><span class="product-cat"></span><h3></h3><p></p></div>';
    var img = card.querySelector('img');
    img.src = p.img || 'assets/img/products/' + p.id + '.webp';
    img.alt = p.name;
    img.width = p.w; img.height = p.h;
    card.querySelector('.product-cat').textContent = labelOf[p.cat] || '';
    card.querySelector('h3').textContent = p.name;
    card.querySelector('p').textContent = p.desc;
    card.addEventListener('click', function () { openProduct(p); });
    gridEl.appendChild(card);
    return { el: card, p: p, hay: (p.name + ' ' + p.desc + ' ' + (labelOf[p.cat] || '')).toLowerCase() };
  });

  function render() {
    var q = state.q.trim().toLowerCase();
    var terms = q ? q.split(/\s+/) : [];
    var shown = 0;
    cards.forEach(function (c) {
      var ok = (state.cat === 'all' || c.p.cat === state.cat) &&
        terms.every(function (t) { return c.hay.indexOf(t) !== -1; });
      c.el.hidden = !ok;
      if (ok) shown++;
    });
    chipsEl.querySelectorAll('.chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === state.cat));
    });
    countEl.textContent = shown + (shown === 1 ? ' machine' : ' machines') +
      (state.cat !== 'all' ? ' · ' + labelOf[state.cat] : '') +
      (q ? ' · “' + state.q.trim() + '”' : '');
    emptyEl.hidden = shown !== 0;
  }

  function sync() {
    var p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.q.trim()) p.set('q', state.q.trim());
    var qs = p.toString();
    try { history.replaceState(null, '', qs ? '?' + qs : window.location.pathname); } catch (e) { /* sandboxed preview */ }
  }

  var t;
  searchEl.addEventListener('input', function () {
    state.q = searchEl.value;
    render();
    clearTimeout(t);
    t = setTimeout(sync, 300);
  });

  /* Detail dialog */
  var dlg = document.querySelector('[data-product-dialog]');
  function openProduct(p) {
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var img = dlg.querySelector('[data-pd-img]');
    img.src = p.img || 'assets/img/products/' + p.id + '.webp';
    img.alt = p.name;
    dlg.querySelector('[data-pd-cat]').textContent = labelOf[p.cat] || '';
    dlg.querySelector('[data-pd-name]').textContent = p.name;
    dlg.querySelector('[data-pd-desc]').textContent = p.desc;
    var text = 'Hello Verbindtech, I am interested in the ' + p.name + '. Could you send me the specifications and a quotation?';
    dlg.querySelector('[data-pd-wa]').href = 'https://wa.me/' + contact.wa + '?text=' + encodeURIComponent(text);
    dlg.querySelector('[data-pd-mail]').href = 'mailto:' + contact.email +
      '?subject=' + encodeURIComponent('Enquiry: ' + p.name) + '&body=' + encodeURIComponent(text);
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
