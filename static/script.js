/* ============================================================================
   Kortscore — Website
   ============================================================================
   Die Seite funktioniert vollstaendig ohne JavaScript. Dieses Skript ergaenzt
   drei Dinge: die Sprachweiche auf den Seiten der Standardsprache, den
   Sprachhinweis auf allen anderen und die Messung der Store-Klicks samt
   Kampagnen-Referrer.
   ========================================================================= */
(function () {
  'use strict';

  /* ── Sprachwahl merken ──────────────────────────────────────────────────
     Die Wahl liegt in localStorage, damit Weiche und Hinweis nur einmal
     greifen. Im privaten Modus mancher Browser wirft der Zugriff, deshalb
     steht alles in try/catch: ohne Speicher fehlt nur das Gedaechtnis, nicht
     die Seite.
     ─────────────────────────────────────────────────────────────────────── */
  var KEY = 'ks-lang';

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function writeChoice(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* egal */ }
  }

  function code(value) {
    return (value || '').toLowerCase().slice(0, 2);
  }

  var pageLang = code(document.documentElement.lang) || 'en';

  /* ── Sprachumschalter ───────────────────────────────────────────────────
     Ein <details> mit normalen Links, funktioniert also ohne Skript. Wer
     einen davon benutzt, hat sich bewusst entschieden: Das halten wir fest,
     damit Weiche und Hinweis auf der Zielseite nicht sofort das Gegenteil
     vorschlagen. Dazu schliesst das Menue bei Klick daneben und mit Escape. */
  var switches = document.querySelectorAll('[data-lang-switch]');
  Array.prototype.forEach.call(switches, function (link) {
    link.addEventListener('click', function () {
      writeChoice(code(link.getAttribute('hreflang')) || pageLang);
    });
  });

  var menu = document.querySelector('[data-lang-menu]');
  if (menu) {
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) { menu.open = false; }
    });
    document.addEventListener('keydown', function (e) {
      if (menu.open && e.key === 'Escape') {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  /* ── Verfuegbare Sprachen ───────────────────────────────────────────────
     Kommen aus den <link rel="alternate" hreflang> im Kopf, die der Build
     fuer jede Seite erzeugt. Damit braucht das Skript keine Daten pro Seite.
     Gemerkt wird nur der Pfad: So fuehrt die Weiche auch auf einem lokalen
     Testserver zur lokalen Fassung statt zur Live-Seite. */
  function pathOf(href) {
    try { return new URL(href, location.href).pathname; } catch (e) { return null; }
  }

  var targets = {};
  var defaultPath = null;
  Array.prototype.forEach.call(
    document.querySelectorAll('link[rel="alternate"][hreflang]'),
    function (link) {
      var lang = (link.getAttribute('hreflang') || '').toLowerCase();
      var path = pathOf(link.getAttribute('href'));
      if (!path) { return; }
      if (lang === 'x-default') { defaultPath = path; } else { targets[code(lang)] = path; }
    }
  );

  /* Die Seite ist x-default, wenn ihre eigene Fassung die x-default-Adresse
     ist. Heute ist das Englisch, das Skript nimmt es aber aus dem Kopf. */
  var isDefault = defaultPath !== null && targets[pageLang] === defaultPath;

  /* Die erste Sprache aus navigator.languages, die es hier gibt. Die Liste
     ist die vollstaendige Wunschliste des Browsers, navigator.language nur
     ihr erster Eintrag: wer Deutsch an zweiter Stelle fuehrt, versteht es
     auch. Steht die Sprache dieser Seite vor allen anderen, ist die Sache
     erledigt. */
  function preferred() {
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var p = code(prefs[i]);
      if (p && targets[p]) { return p; }
    }
    return null;
  }

  var wanted = preferred();
  if (!wanted || wanted === pageLang || readChoice()) return;

  /* ── Sprachweiche ───────────────────────────────────────────────────────
     Wer eine andere verfuegbare Sprache bevorzugt, soll nicht erst auf der
     Standardfassung landen und dort einen Hinweis wegklicken muessen. Deshalb
     schickt ihn diese Weiche gleich auf seine Fassung derselben Seite.

     Sie greift nur einmal: Bei der Umleitung wird die Zielsprache notiert,
     und readChoice() oben haelt jeden weiteren Aufruf davon ab. Wer danach
     im Umschalter eine andere Sprache waehlt, ueberschreibt die Notiz und
     bleibt bei ihr. Ohne dieses Gedaechtnis wuerde die Weiche den Umschalter
     sofort wieder rueckgaengig machen.

     Nur von der Standardsprache aus: Die uebrigen Seiten bieten per Hinweis
     an, leiten aber nie um. Sonst koennten sich zwei Weichen gegenseitig
     aufrufen.
     ───────────────────────────────────────────────────────────────────── */
  if (isDefault) {
    writeChoice(wanted);
    /* replace statt href: der Zurueck-Knopf soll auf die Seite davor fuehren
       und nicht in die Umleitung zurueck. Hash und Suchparameter kommen mit,
       damit Anker und Kampagnen-Parameter die Weiche ueberleben. */
    location.replace(targets[wanted] + location.search + location.hash);
    return;
  }

  /* ── Sprachhinweis ──────────────────────────────────────────────────────
     Der Build legt fuer jede andere Sprache einen versteckten Balken an, in
     ihrer eigenen Sprache. Eingeblendet wird nur der passende. */
  var bar = document.querySelector('[data-langbar][data-langbar-lang="' + wanted + '"]');
  if (!bar) return;

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
      writeChoice(wanted);
    });
  }
})();

/* ============================================================================
   Play-Store-Klick: messen und die Kampagne in den Store mitnehmen
   ============================================================================
   Zwei Aufgaben, beide freiwillig — ohne JavaScript bleibt der Badge ein
   normaler Link auf den Store, nur eben ungemessen.

   1. Der Klick auf den Badge wird als Google-Ads-Conversion gemeldet. Das ist
      der Punkt, an dem sich Interesse zeigt; der reine Seitenaufruf sagt
      darueber nichts aus.

   2. An den Store-Link kommt ein referrer-Parameter. Google Play reicht
      dessen Inhalt nach der Installation an die App weiter, das Firebase-SDK
      liest ihn beim ersten Start aus. Dadurch laesst sich spaeter sagen,
      welche Kampagne zu einer Installation gefuehrt hat — und nicht nur zu
      einem Klick. Der Weg funktioniert ohne Cookies, weil die Kennung in der
      URL reist.
   ========================================================================= */
(function () {
  'use strict';

  var ADS_ID = 'AW-18314402307';

  /* Conversion-Label der Aktion "Play-Store-Klick" aus Google Ads. Leer lassen
     schaltet die Meldung ab, ohne den Rest anzuruehren: Referrer und eigene
     Statistik laufen dann trotzdem. */
  var ADS_LABEL = 'cDUqCM-ViOwcEIO0_pxE';

  var FIELDS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign',
                'utm_content', 'utm_term'];
  var KEY = 'ks-campaign';

  /* ── Kampagnenparameter einsammeln ──────────────────────────────────────
     Sie stehen nur beim ersten Aufruf in der URL. Wer danach auf "Uhren"
     klickt und erst dort den Badge drueckt, haette sie sonst verloren,
     deshalb der Zwischenspeicher fuer die Sitzung. */
  function fromUrl() {
    var out = {}, q;
    try { q = new URLSearchParams(location.search); } catch (e) { return out; }
    FIELDS.forEach(function (f) {
      var v = q.get(f);
      if (v) { out[f] = v; }
    });
    return out;
  }

  function remember(obj) {
    try { sessionStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) { /* egal */ }
  }
  function recall() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }

  var params = fromUrl();
  if (Object.keys(params).length) { remember(params); } else { params = recall(); }

  /* ── Referrer bauen ─────────────────────────────────────────────────────
     Voreinstellung ist der Weg ueber die Website. Kommt der Besuch aus einer
     Anzeige, ueberschreiben gclid und die utm-Werte das. So laesst sich in
     Firebase spaeter zwischen "ueber die Website installiert" und "ueber eine
     Anzeige installiert" unterscheiden. */
  function referrer() {
    var r = { utm_source: 'kortscore.com', utm_medium: 'website' };
    if (params.gclid) { r.utm_source = 'google'; r.utm_medium = 'cpc'; }
    FIELDS.forEach(function (f) { if (params[f]) { r[f] = params[f]; } });

    return Object.keys(r).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(r[k]);
    }).join('&');
  }

  var badges = document.querySelectorAll('a.storebadge');
  if (!badges.length) { return; }

  var ref = referrer();

  Array.prototype.forEach.call(badges, function (a) {
    var href  = a.getAttribute('href') || '';
    var play  = href.indexOf('play.google.com') !== -1;
    var apple = href.indexOf('apps.apple.com')  !== -1;
    if (!play && !apple) { return; }

    /* Nur Google Play nimmt den Referrer in der URL entgegen. Der Wert wird
       als Ganzes kodiert, Play erwartet ihn als eine einzige, prozentkodierte
       Zeichenkette. Apple hat dafuer kein Gegenstueck: dort uebernimmt das
       App-Store-Connect die Zuordnung ueber eigene Kampagnenlinks. */
    if (play && href.indexOf('&referrer=') === -1) {
      a.setAttribute('href', href + '&referrer=' + encodeURIComponent(ref));
    }

    a.addEventListener('click', function () {
      if (ADS_LABEL && typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: ADS_ID + '/' + ADS_LABEL,
          value: 1.0,
          currency: 'EUR'
        });
      }
      /* Eigene Statistik, unabhaengig von Google. Die beiden Stores werden
         getrennt gezaehlt, sonst laesst sich nicht sagen, welche Plattform
         die Installationen bringt. */
      if (window.umami && typeof umami.track === 'function') {
        try {
          umami.track(play ? 'play-store-klick' : 'app-store-klick');
        } catch (e) { /* egal */ }
      }
    });
  });
})();
