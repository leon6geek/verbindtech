/* Verbindtech Machinery — shared site behaviour (no dependencies). */
(function () {
  'use strict';

  var WA_NUMBER = '6281932237600';
  var EMAIL = 'marketing@verbind-tech.net';
  window.VT_CONTACT = { wa: WA_NUMBER, email: EMAIL };

  document.documentElement.classList.add('js');

  /* Header: solid background once the page scrolls */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.querySelector('[data-nav-toggle]');
  if (toggle && header) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    header.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Featured project: 3D design / on-site toggle */
  document.querySelectorAll('[data-compare]').forEach(function (root) {
    var tabs = root.querySelectorAll('[data-view]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var view = tab.getAttribute('data-view');
        tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
        root.querySelectorAll('[data-pane]').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-pane') === view);
        });
      });
    });
  });

  /* Segmented filters (special purpose machines) */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var name = group.getAttribute('data-filter-group');
    var target = document.querySelector('[data-filter-target="' + name + '"]');
    if (!target) return;
    var buttons = group.querySelectorAll('[data-filter]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
        target.querySelectorAll('[data-cat]').forEach(function (card) {
          card.classList.toggle('is-hidden', f !== 'all' && card.getAttribute('data-cat') !== f);
        });
      });
    });
  });

  /* Gallery lightbox */
  var gallery = document.querySelector('[data-gallery]');
  var lb = document.querySelector('[data-lightbox]');
  if (gallery && lb && typeof lb.showModal === 'function') {
    var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    var img = lb.querySelector('[data-lb-img]');
    var cap = lb.querySelector('[data-lb-cap]');
    var index = 0;
    var show = function (i) {
      index = (i + links.length) % links.length;
      var thumb = links[index].querySelector('img');
      img.src = thumb ? (thumb.currentSrc || thumb.src) : links[index].getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = (thumb ? thumb.alt : '') + '  ·  ' + (index + 1) + ' / ' + links.length;
    };
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(i); lb.showModal(); });
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', function () { lb.close(); });
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* Enquiry form → WhatsApp or email (static site, no server needed) */
  var form = document.querySelector('[data-enquiry]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var reply = (data.get('reply') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();
      var err = form.querySelector('.form-error');
      if (!name || !reply || !message) { err.hidden = false; return; }
      err.hidden = true;
      var company = (data.get('company') || '').toString().trim();
      var industry = (data.get('industry') || '').toString();
      var body = 'Hello Verbindtech,\n\n' + message + '\n\n' +
        'Name: ' + name + '\n' +
        (company ? 'Company: ' + company + '\n' : '') +
        'Industry: ' + industry + '\n' +
        'Contact: ' + reply;
      var channel = e.submitter ? e.submitter.getAttribute('data-channel') : 'wa';
      if (channel === 'mail') {
        var subject = 'Project enquiry' + (company ? ' — ' + company : '');
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      } else {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
      }
    });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
