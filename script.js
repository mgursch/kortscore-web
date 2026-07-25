/* Kortscore Landingpage – Scroll-Reveal, Nav-Zustand, Jahr im Footer. */

(function () {
  'use strict';

  // ── Scroll-Reveal: Elemente einblenden, sobald sie in den Viewport kommen.
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    // Ohne Observer-Support alles direkt sichtbar lassen.
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ── Nav bekommt eine Trennlinie, sobald man den Hero verlässt.
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Footer-Jahr.
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
