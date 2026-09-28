/* ==========================================================
   Portfolio — simple vanilla JavaScript (no libraries)
   1. Navbar: scrolled state + active link
   2. Mobile menu
   3. Scroll reveal
   4. Screenshot fallback
   ========================================================== */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var links = Array.prototype.slice.call(menu.querySelectorAll('a'));

  /* ---------- 1. Navbar: scrolled state + active link ---------- */
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateNavbar() {
    header.classList.toggle('scrolled', window.scrollY > 12);

    var y = window.scrollY + header.offsetHeight + 120;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= y) current = section;
    });

    // At the very bottom of the page, highlight the last link
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    links.forEach(function (a) {
      var isActive = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateNavbar();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', updateNavbar);
  updateNavbar();

  /* ---------- 2. Mobile menu ---------- */
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after choosing a link
  links.forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // Close with Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Close when tapping outside the header
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });

  // Reset when resizing up to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- 3. Scroll reveal ---------- */
  // Auto-stagger children of any element marked with data-stagger
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (child.classList.contains('reveal')) {
        child.style.setProperty('--d', (i * 0.1) + 's');
      }
    });
  });

  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. Screenshot fallback ----------
     If a project image is missing, show a neat placeholder
     telling you which file to add. */
  document.querySelectorAll('.shot img').forEach(function (img) {
    var shot = img.closest('.shot');
    function markMissing() { shot.classList.add('no-img'); }

    if (img.complete && img.naturalWidth === 0) markMissing();
    else img.addEventListener('error', markMissing, { once: true });
  });
})();