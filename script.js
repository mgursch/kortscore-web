/* ─────────────────────────────────────────────────────────────────────────
   Kortscore – Landingpage
   Scroll-Reveals, Parallax, Nav-Zustand und die gepinnte Zähl-Szene.
   Kein Framework, keine Abhängigkeiten.
   ───────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Schritte der gepinnten Szene. `mine`/`theirs` ist der Stand, den das
     nachgebaute Uhr-Display zeigt – der Score zählt beim Scrollen echt mit.

     Start bewusst bei 15:30: von 40:30 aus wäre das Game nach einem eigenen
     Punkt bereits gewonnen, die Uhr würde das Sieger-Banner zeigen statt
     weiterzuzählen. So bleibt die Sequenz im laufenden Game plausibel:
     15:30 → (1×) 30:30 → (2×) 30:40 → (3× umdrehen) 40:30 → (4× Undo)
     zurück auf 30:30 – der umgedrehte Punkt ist danach ganz weg. */
  var STEPS = [
    { tap: 0, mine: '15', theirs: '30' },
    { tap: 1, mine: '30', theirs: '30' },
    { tap: 2, mine: '30', theirs: '40' },
    { tap: 3, mine: '40', theirs: '30' },
    // Der letzte Schritt trägt bewusst keinen Untertitel: Er zeigt das Undo am
    // mitzählenden Display, die Geste selbst steht schon in der Tap-Liste.
    { tap: 4, mine: '30', theirs: '30' }
  ];

  var scene   = document.querySelector('[data-scene]');
  var nav     = document.querySelector('[data-nav]');
  var rail    = document.querySelector('[data-scene-rail]');
  var stepOut = document.querySelector('[data-scene-step]');
  var caption = document.querySelector('[data-scene-caption]');
  var watch   = document.querySelector('[data-scene-watch]');
  var flash   = document.querySelector('[data-tap-flash]');
  var faceMine   = document.querySelector('[data-face-mine]');
  var faceTheirs = document.querySelector('[data-face-theirs]');
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var taps  = Array.prototype.slice.call(document.querySelectorAll('[data-tap]'));

  var step = -1;
  var ticking = false;

  /* Die Untertitel stehen als data-cap-N am Caption-Element, nicht in dieser
     Datei: Sie ist für beide Sprachfassungen dieselbe, die Texte sind es
     nicht. Fehlt ein Attribut, bleibt der Untertitel leer. */
  function captionFor(i) {
    if (!caption) return '';
    var v = caption.getAttribute('data-cap-' + i);
    return v === null ? '' : v;
  }

  /* ── Count-up für die Statistik-Kacheln ──────────────────────────────── */
  function countUp(node) {
    if (node.dataset.counted) return;
    node.dataset.counted = '1';

    var target = Number(node.dataset.count);
    var suffix = node.dataset.countSuffix || '';

    if (reduced) { node.textContent = target + suffix; return; }

    var t0 = performance.now();
    var dur = 1100;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      // ease-out-cubic
      node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ── Reveals ─────────────────────────────────────────────────────────── */
  function setupReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-fx="up"]'));

    function show(el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      el.style.opacity = '1';
      el.style.transform = 'none';
      Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), countUp);
    }

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(show);
      return;
    }

    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(34px)';
      el.style.transition = 'opacity .9s cubic-bezier(.16,.84,.24,1), transform .9s cubic-bezier(.16,.84,.24,1)';
      el.style.transitionDelay = (Number(el.dataset.fxDelay || 0) * 0.09) + 's';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        show(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

    els.forEach(function (el) { io.observe(el); });

    /* Sicherheitsnetz: Was beim Laden (z. B. nach Anker-Sprung) schon im Bild
       steht, wird sofort gezeigt – sonst bliebe es unsichtbar. */
    function revealInView() {
      els.forEach(function (el) {
        if (el.dataset.revealed) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          show(el);
          io.unobserve(el);
        }
      });
    }
    requestAnimationFrame(revealInView);
    window.addEventListener('load', revealInView);
    window.addEventListener('resize', revealInView);
  }

  /* ── Szenen-Schritt anwenden ─────────────────────────────────────────── */
  function applyStep(i) {
    var s = STEPS[i];

    if (stepOut) {
      stepOut.textContent = String(i + 1).padStart(2, '0') + ' / ' +
                            String(STEPS.length).padStart(2, '0');
    }

    if (caption) {
      caption.style.opacity = '0';
      setTimeout(function () {
        caption.textContent = captionFor(i);
        caption.style.opacity = '1';
      }, reduced ? 0 : 180);
    }

    if (faceMine)   faceMine.textContent   = s.mine;
    if (faceTheirs) faceTheirs.textContent = s.theirs;

    taps.forEach(function (el) {
      el.classList.toggle('is-on', Number(el.dataset.tap) === s.tap);
    });

    if (flash && s.tap && !reduced) {
      flash.style.opacity = '1';
      setTimeout(function () { flash.style.opacity = '0'; }, 420);
    }
  }

  /* ── Ein Frame: Parallax, Nav, Szenen-Fortschritt ────────────────────── */
  function frame() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;

    if (!reduced) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' +
          (-mid * Number(el.dataset.parallax)).toFixed(1) + 'px,0)';
      });
    }

    if (nav) {
      var on = y > 40;
      nav.style.background = on ? 'rgba(242,244,228,.86)' : 'rgba(242,244,228,0)';
      nav.style.backdropFilter = on ? 'saturate(140%) blur(14px)' : 'none';
      nav.style.WebkitBackdropFilter = nav.style.backdropFilter;
      nav.style.boxShadow = on ? 'inset 0 -1px 0 rgba(20,23,15,.14)' : 'none';
    }

    if (!scene) return;

    var r = scene.getBoundingClientRect();
    var travel = scene.offsetHeight - vh;
    var p;

    if (travel > 0) {
      /* Gepinnt (Normalfall, Desktop und Mobil): Der Fortschritt zählt erst,
         sobald die Sektion oben anliegt – vorher steht Schritt 1, und die
         Karten werden nicht markiert, während der Block erst hereinscrollt. */
      p = Math.max(0, Math.min(1, -r.top / travel));
    } else {
      /* Nur reduced-motion: Sektion nicht gepinnt, Fortschritt aus der Lage
         im Viewport ableiten. */
      p = Math.max(0, Math.min(1,
        (vh - r.top) / (vh + scene.offsetHeight)));
    }

    if (rail) rail.style.width = (p * 100).toFixed(1) + '%';

    if (watch && !reduced) {
      watch.style.transform =
        'scale(' + (0.93 + 0.09 * Math.sin(Math.PI * Math.min(1, p * 1.1))).toFixed(3) + ')';
    }

    var i = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    if (i !== step) { step = i; applyStep(i); }
  }

  /* Scroll-Events werden per rAF gebündelt. Falls rAF gedrosselt wird (etwa in
     Hintergrund-Tabs oder eingebetteten Ansichten), greift ein Timer-Fallback,
     damit die Szene nicht auf dem ersten Schritt stehen bleibt. */
  function onScroll() {
    if (ticking) return;
    ticking = true;

    var done = false;
    var run = function () {
      if (done) return;
      done = true;
      ticking = false;
      frame();
    };

    requestAnimationFrame(run);
    setTimeout(run, 120);
  }

  /* Beim Laden mit #hash: Nach dem ersten Layout erneut zum Ziel springen.
     Die 520vh-Szene und die Reveals verändern die Höhen, wodurch der
     ursprüngliche Sprung des Browsers ins Leere zeigt. */
  function honourHash() {
    if (!location.hash || location.hash.length < 2) return;
    var target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    var root = document.documentElement;
    var behavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    /* Absolute Dokumentposition selbst rechnen und setzen – scrollIntoView()
       verlässt sich auf Layout, das sich hier noch verschiebt. */
    var y = target.getBoundingClientRect().top + window.pageYOffset -
            (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    window.scrollTo(0, Math.max(0, Math.round(y)));

    root.style.scrollBehavior = behavior;
  }

  /* ── Start ───────────────────────────────────────────────────────────── */
  setupReveals();
  applyStep(0);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  requestAnimationFrame(honourHash);
  window.addEventListener('load', function () { setTimeout(honourHash, 60); });

  /* ── Chat: Tawk.to erst auf Klick ────────────────────────────────────── */
  /* Das Tawk.to-Skript setzt Cookies und überträgt die IP an einen
     US-Dienst. Beim Seitenaufruf geladen, wäre die Seite nicht mehr
     cookiefrei und bräuchte ein Consent-Banner. Deshalb fällt der erste
     Request erst, wenn jemand den Chat wirklich will – bis dahin gibt es
     nur den eigenen Button.

     Danach übernimmt das Widget von Tawk.to die Ecke rechts unten, also
     blendet sich unser Button aus, sobald das Widget bereit ist. */
  function setupChat() {
    var btn = document.querySelector('[data-chat]');
    if (!btn) return;

    /* Erst hier sichtbar machen: Ohne JS könnte der Button nichts laden. */
    btn.hidden = false;

    var label = btn.querySelector('[data-chat-label]');

    /* Die drei Beschriftungen stehen als data-Attribute am Button, weil beide
       Sprachfassungen dieselbe Skriptdatei laden. Der zweite Parameter ist der
       deutsche Bestandstext für den Fall, dass ein Attribut fehlt. */
    function chatText(key, fallback) {
      var v = btn.getAttribute('data-chat-' + key);
      return v === null ? fallback : v;
    }
    var loading = false;
    var injected = false;
    var mailFallback = false;

    btn.addEventListener('click', function () {
      /* Skript kam nicht durch (Blocker, Netz): Der Button ist jetzt ein
         E-Mail-Button, damit der Kontaktweg nicht ins Leere führt. */
      if (mailFallback) {
        window.location.href = 'mailto:swordistudios@gmail.com';
        return;
      }

      /* Zweiter Klick, während das Skript noch lädt, würde es ein zweites
         Mal einhängen – Tawk.to beschwert sich dann über eine doppelte
         Einbindung. */
      if (loading) return;

      /* Skript ist schon da, das Widget hat sich nur nicht gemeldet (siehe
         Zeitgrenze unten): dann direkt über die geladene API öffnen statt
         ein zweites Mal zu laden. */
      if (injected) {
        if (window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
        return;
      }

      loading = true;
      injected = true;
      if (label) label.textContent = chatText('loading', 'Chat wird geladen …');

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      /* Falls onLoad ausbleibt (Widget-Property nicht freigegeben, Skript
         teilweise blockiert), soll wenigstens die Beschriftung nicht ewig
         "wird geladen" behaupten. Zurück auf den Ausgangstext, ein weiterer
         Klick maximiert dann über die bereits geladene API. */
      var settle = setTimeout(function () {
        if (btn.hidden) return;
        loading = false;
        if (label) label.textContent = chatText('idle', 'Fragen? Schreib uns');
      }, 8000);

      /* Ohne diesen Hook bliebe der Chat nach dem Laden zu und der Nutzer
         müsste ein zweites Mal klicken – auf das Widget, das er gerade
         erst geöffnet hat. */
      window.Tawk_API.onLoad = function () {
        clearTimeout(settle);
        btn.hidden = true;
        if (window.Tawk_API.maximize) window.Tawk_API.maximize();
      };

      var s1 = document.createElement('script');
      var s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6a75f79ec010c21d4b6318b2/1jvecuhhm';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');

      /* Blockt ein Adblocker das Skript, bliebe sonst "Chat wird geladen …"
         für immer stehen. Dann lieber ehrlich auf die E-Mail verweisen –
         der Klick-Handler oben ist ab hier stillgelegt (mailFallback), weil
         ein erneuter Ladeversuch am Blocker genauso scheitern würde. */
      s1.onerror = function () {
        clearTimeout(settle);
        loading = false;
        mailFallback = true;
        if (label) label.textContent = chatText('mail', 'Schreib uns eine E-Mail');
      };

      s0.parentNode.insertBefore(s1, s0);
    });
  }

  setupChat();

  /* ── Sprachhinweis ────────────────────────────────────────────────────────
     Besucher mit deutschem Browser sollen die deutsche Fassung finden, ohne
     dass ihnen jemand die Seite unter den Füßen wegzieht. Deshalb ein Hinweis
     statt einer Weiterleitung: Ein automatischer Sprung macht den Zurück-Button
     unbrauchbar (zurück landet wieder auf der Seite, die sofort weiterleitet)
     und schickt geteilte Links woanders hin, als der Absender wollte.

     Die Leiste erscheint höchstens einmal. Sobald jemand eine Sprache aktiv
     wählt – über die Leiste oder den Umschalter in der Navigation – merkt sich
     das die Seite und hält von da an den Mund. Ohne localStorage (privater
     Modus, alte Browser) passiert schlicht nichts: Die Seite bleibt, wie sie
     ist, nur der Hinweis kommt dann bei jedem Besuch neu.
     ───────────────────────────────────────────────────────────────────────── */
  function setupLangHint() {
    var bar = document.querySelector('[data-langbar]');
    if (!bar) return;

    var KEY = 'ks-lang';

    function stored(v) {
      try {
        if (v) { localStorage.setItem(KEY, v); return v; }
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;   /* localStorage gesperrt: kein Grund, hier auszusteigen */
      }
    }

    /* Der Umschalter in der Navigation ist eine bewusste Wahl – ab dann nie
       wieder fragen, egal in welche Richtung er führt. */
    var toggle = document.querySelector('.nav__lang');
    if (toggle) {
      toggle.addEventListener('click', function () {
        stored(toggle.getAttribute('hreflang') || 'en');
      });
    }

    /* Nur auf der Startseite fragen. Auf den Rechtsseiten wäre der Hinweis
       aufdringlich, und wer dort gezielt hinnavigiert hat, sucht keinen
       Sprachwechsel. */
    if (!bar.hasAttribute('data-langbar-home')) return;

    var pageLang  = document.documentElement.lang || 'en';
    var wantsGerman = (navigator.languages || [navigator.language || ''])
      .some(function (l) { return /^de\b/i.test(l); });

    /* Schon entschieden, oder der Browser spricht ohnehin die Seitensprache:
       nichts zu tun. */
    if (stored()) return;
    if (wantsGerman === (pageLang === 'de')) return;

    bar.hidden = false;

    /* Die Navigation ist fixiert und läge sonst unter der Leiste. Ihre Höhe
       wird gemessen statt geschätzt: Bei schmalen Fenstern bricht die Leiste
       um und ist dann höher als ein fester Wert es je träfe. */
    function offsetNav() {
      document.documentElement.style.setProperty(
        '--langbar-h', bar.hidden ? '0px' : bar.offsetHeight + 'px');
    }
    offsetNav();
    window.addEventListener('resize', offsetNav);

    var dismiss = bar.querySelector('[data-langbar-close]');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        stored(pageLang);          /* "ich bleibe hier" ist auch eine Wahl */
        bar.hidden = true;
        offsetNav();
      });
    }

    var accept = bar.querySelector('[data-langbar-go]');
    if (accept) {
      accept.addEventListener('click', function () {
        stored(accept.getAttribute('hreflang') || 'de');
      });
    }
  }

  setupLangHint();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
