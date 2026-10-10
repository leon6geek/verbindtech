/* Verbindtech Machinery — site behaviour (no dependencies). */
(function () {
  'use strict';

  var VT = window.VT || { lang: 'en', wa: '6281932237600', email: 'marketing@verbind-tech.net' };
  var desktop = window.matchMedia('(min-width: 1101px)');
  document.documentElement.classList.add('js');

  /* ---------- Header ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mega menus ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item.has-mega'));
  function closeAll(except) {
    items.forEach(function (it) {
      if (it === except) return;
      it.classList.remove('is-open');
      it.querySelector('[data-mega-toggle]').setAttribute('aria-expanded', 'false');
    });
  }
  items.forEach(function (it) {
    var btn = it.querySelector('[data-mega-toggle]');
    var timer;
    btn.addEventListener('click', function () {
      var open = !it.classList.contains('is-open');
      closeAll(it);
      it.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    it.addEventListener('mouseenter', function () {
      if (!desktop.matches) return;
      clearTimeout(timer);
      timer = setTimeout(function () { closeAll(it); it.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }, 90);
    });
    it.addEventListener('mouseleave', function () {
      if (!desktop.matches) return;
      clearTimeout(timer);
      timer = setTimeout(function () { it.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }, 160);
    });
  });
  document.addEventListener('click', function (e) {
    if (desktop.matches && !e.target.closest('.nav-item.has-mega')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.nav-item.is-open [data-mega-toggle]');
    closeAll();
    if (open) open.focus();
    setNav(false);
  });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  function setNav(open) {
    if (!toggle || !header) return;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setNav(!header.classList.contains('is-open')); });
    document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    desktop.addEventListener('change', function () { setNav(false); closeAll(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Tabs (solutions explorer) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(tabs[(i + d + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- Design / site photo switch ---------- */
  document.querySelectorAll('[data-compare]').forEach(function (root) {
    var btns = root.querySelectorAll('[data-view]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        root.querySelectorAll('[data-pane]').forEach(function (p) { p.classList.toggle('is-active', p.dataset.pane === b.dataset.view); });
      });
    });
  });

  /* ---------- Project filter ---------- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var target = document.querySelector('[data-filter-target="' + group.dataset.filterGroup + '"]');
    if (!target) return;
    var btns = group.querySelectorAll('[data-filter]');
    function apply(f) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
      target.querySelectorAll('[data-industries]').forEach(function (c) {
        c.classList.toggle('is-hidden', f !== 'all' && c.dataset.industries.split(' ').indexOf(f) === -1);
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter); }); });
  });

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.querySelector('[data-gallery]');
  var lb = document.querySelector('[data-lightbox]');
  if (gallery && lb && typeof lb.showModal === 'function') {
    var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    var lbImg = lb.querySelector('[data-lb-img]');
    var lbCap = lb.querySelector('[data-lb-cap]');
    var idx = 0;
    var show = function (i) {
      idx = (i + links.length) % links.length;
      var th = links[idx].querySelector('img');
      lbImg.src = th ? (th.currentSrc || th.src) : links[idx].href;
      lbImg.alt = th ? th.alt : '';
      lbCap.textContent = (th ? th.alt : '') + '  ·  ' + (idx + 1) + ' / ' + links.length;
    };
    links.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); show(i); lb.showModal(); }); });
    lb.querySelector('[data-lb-close]').addEventListener('click', function () { lb.close(); });
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Sub-navigation scrollspy ---------- */
  var spy = document.querySelector('[data-scrollspy]');
  if (spy && 'IntersectionObserver' in window) {
    var spyLinks = spy.querySelectorAll('a[href^="#"]');
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyLinks.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) so.observe(s); });
  }

  /* ---------- Request-a-quote form (3 steps → WhatsApp / email) ---------- */
  var rfq = document.querySelector('[data-rfq]');
  if (rfq) {
    var id = VT.lang === 'id';
    var T = {
      need: id ? 'Pilih apa yang Anda butuhkan.' : 'Please choose what you need.',
      contact: id ? 'Mohon isi nama, perusahaan, email, dan nomor telepon Anda.' : 'Please fill in your name, company, email and phone number.',
      email: id ? 'Alamat email tampaknya belum benar.' : 'That email address does not look right.',
      hello: id ? 'Halo Verbindtech, saya ingin meminta penawaran.' : 'Hello Verbindtech, I would like to request a quotation.',
      labels: id
        ? { need: 'Kebutuhan', industry: 'Industri', form: 'Bentuk produk', output: 'Target output', pack: 'Kemasan/wadah', timeline: 'Jadwal', name: 'Nama', role: 'Peran', company: 'Perusahaan', email: 'Email', phone: 'Telepon', message: 'Catatan', urs: 'Dokumen URS/gambar akan dikirim via email.' }
        : { need: 'Need', industry: 'Industry', form: 'Product form', output: 'Target output', pack: 'Pack/container', timeline: 'Timeline', name: 'Name', role: 'Role', company: 'Company', email: 'Email', phone: 'Phone', message: 'Notes', urs: 'URS/drawings will follow by email.' },
      subject: id ? 'Permintaan penawaran' : 'Quotation request'
    };
    var steps = rfq.querySelectorAll('[data-step]');
    var progress = rfq.querySelectorAll('.rfq-progress li');
    var prev = rfq.querySelector('[data-prev]');
    var next = rfq.querySelector('[data-next]');
    var submit = rfq.querySelector('[data-submit]');
    var err = rfq.querySelector('[data-error]');
    var step = 1;

    var preset = new URLSearchParams(window.location.search).get('need');
    if (preset) {
      var r = rfq.querySelector('input[name="need"][value="' + preset + '"]');
      if (r) r.checked = true;
    }

    function go(n) {
      step = n;
      steps.forEach(function (s) {
        var on = Number(s.dataset.step) === n;
        s.hidden = !on;
        s.classList.toggle('is-active', on);
      });
      progress.forEach(function (p, i) {
        p.classList.toggle('is-active', i + 1 === n);
        p.classList.toggle('is-done', i + 1 < n);
      });
      prev.hidden = n === 1;
      next.hidden = n === 3;
      submit.hidden = n !== 3;
      err.hidden = true;
    }
    function fail(msg) { err.textContent = msg; err.hidden = false; }
    function valid(n) {
      if (n === 1 && !rfq.querySelector('input[name="need"]:checked')) { fail(T.need); return false; }
      if (n === 3) {
        var miss = ['name', 'company', 'email', 'phone'].filter(function (k) {
          var el = rfq.elements[k];
          var bad = !el.value.trim();
          el.closest('.field').classList.toggle('is-invalid', bad);
          return bad;
        });
        if (miss.length) { fail(T.contact); return false; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rfq.elements.email.value.trim())) {
          rfq.elements.email.closest('.field').classList.add('is-invalid');
          fail(T.email); return false;
        }
      }
      return true;
    }
    next.addEventListener('click', function () {
      if (!valid(step)) return;
      go(step + 1);
      rfq.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    prev.addEventListener('click', function () { go(step - 1); });
    rfq.querySelectorAll('input[name="need"]').forEach(function (r) {
      r.addEventListener('change', function () { if (step === 1) { err.hidden = true; } });
    });

    rfq.addEventListener('submit', function (e) {
      e.preventDefault();
      if (step !== 3) { next.click(); return; }
      if (!valid(3)) return;
      var f = rfq.elements;
      var L = T.labels;
      var need = rfq.querySelector('input[name="need"]:checked');
      var forms = Array.prototype.map.call(rfq.querySelectorAll('input[name="form"]:checked'), function (c) { return c.value; });
      var lines = [T.hello, ''];
      var add = function (k, v) { if (v) lines.push(k + ': ' + v); };
      add(L.need, need ? need.dataset.label : '');
      add(L.industry, f.industry.value);
      add(L.form, forms.join(', '));
      add(L.output, f.output.value.trim());
      add(L.pack, f.pack.value.trim());
      add(L.timeline, f.timeline.value);
      lines.push('');
      add(L.name, f.name.value.trim());
      add(L.role, f.role.value);
      add(L.company, f.company.value.trim());
      add(L.email, f.email.value.trim());
      add(L.phone, f.phone.value.trim());
      if (f.message.value.trim()) { lines.push(''); add(L.message, f.message.value.trim()); }
      if (f.urs.checked) lines.push(L.urs);
      var body = lines.join('\n');
      var channel = e.submitter ? e.submitter.dataset.channel : 'wa';
      if (channel === 'mail') {
        window.location.href = 'mailto:' + VT.email + '?subject=' + encodeURIComponent(T.subject + ' — ' + f.company.value.trim()) + '&body=' + encodeURIComponent(body);
      } else {
        window.open('https://wa.me/' + VT.wa + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
      }
    });
    go(1);
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
