/* ============================================================================
   Kortscore — Website
   ============================================================================
   Die Seite funktioniert vollstaendig ohne JavaScript. Dieses Skript macht
   genau zwei Dinge: es blendet den Sprachhinweis ein, wenn er passt, und es
   merkt sich die getroffene Sprachwahl.
   ========================================================================= */
(function () {
  'use strict';

  /* ── Sprachwahl merken ──────────────────────────────────────────────────
     Die Wahl liegt in localStorage, damit der Hinweis nur einmal erscheint.
     Im privaten Modus mancher Browser wirft der Zugriff, deshalb steht alles
     in try/catch: ohne Speicher fehlt nur das Gedaechtnis, nicht die Seite.
     ─────────────────────────────────────────────────────────────────────── */
  var KEY = 'ks-lang';

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function writeChoice(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* egal */ }
  }

  var pageLang = (document.documentElement.lang || 'en').slice(0, 2);

  /* Der Umschalter im Kopf ist ein normaler Link. Wer ihn benutzt, hat sich
     bewusst entschieden, das halten wir fest, damit der Hinweisbalken auf der
     Zielseite nicht sofort das Gegenteil vorschlaegt. */
  var toggle = document.querySelector('[data-lang-switch]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      writeChoice((toggle.getAttribute('hreflang') || 'en').slice(0, 2));
    });
  }

  /* ── Hinweisbalken ──────────────────────────────────────────────────────
     Erscheint nur, wenn drei Dinge zusammenkommen: der Balken existiert, der
     Besucher hat noch nie gewaehlt, und der Browser bevorzugt die andere
     Sprache. Sonst bleibt er hidden, so wie er aus dem HTML kommt.

     Damit ergibt sich das gewuenschte Verhalten von selbst: Englisch ist die
     Vorgabe, Deutschsprachige bekommen einen dezenten Hinweis, und niemand
     wird ungefragt umgeleitet.
     ─────────────────────────────────────────────────────────────────────── */
  var bar = document.querySelector('[data-langbar]');
  if (!bar) return;

  var offers = (bar.getAttribute('data-langbar-lang') || '').slice(0, 2);
  if (!offers || offers === pageLang) return;

  if (readChoice()) return;

  /* navigator.languages ist die vollstaendige Wunschliste des Besuchers,
     navigator.language nur der erste Eintrag. Wir sehen die ganze Liste an:
     wer Deutsch an zweiter Stelle fuehrt, versteht es auch. */
  var prefs = navigator.languages || [navigator.language || ''];
  var wantsOther = false;
  for (var i = 0; i < prefs.length; i++) {
    var p = (prefs[i] || '').toLowerCase();
    if (p.indexOf(offers) === 0) { wantsOther = true; break; }
    /* Steht die Sprache dieser Seite weiter vorne, ist die Sache erledigt. */
    if (p.indexOf(pageLang) === 0) break;
  }
  if (!wantsOther) return;

  bar.hidden = false;

  /* "Nein danke": Balken weg, Wahl notiert, Thema beendet. */
  var close = bar.querySelector('[data-langbar-close]');
  if (close) {
    close.addEventListener('click', function () {
      bar.hidden = true;
      writeChoice(pageLang);
    });
  }

  /* Beim Wechsel merken wir die Zielsprache, bevor der Link greift. */
  var go = bar.querySelector('[data-langbar-go]');
  if (go) {
    go.addEventListener('click', function () {
      writeChoice(offers);
    });
  }
})();
