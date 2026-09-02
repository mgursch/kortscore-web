/* ============================================================================
   Kortscore — Website
   ============================================================================
   Die Seite funktioniert vollstaendig ohne JavaScript. Dieses Skript ergaenzt
   vier Dinge: die Sprachweiche, den Sprachhinweis als Rueckweg, die Messung
   des Play-Store-Klicks samt Kampagnen-Referrer, und das Absenden des
   iOS-Formulars ohne Seitenwechsel.
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

  /* Prueft, ob der Besucher die angebotene Sprache der Sprache dieser Seite
     vorzieht. navigator.languages ist die vollstaendige Wunschliste,
     navigator.language nur der erste Eintrag: wer Deutsch an zweiter Stelle
     fuehrt, versteht es auch. Steht die Sprache dieser Seite weiter vorne,
     ist die Sache erledigt. */
  function prefers(other) {
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var p = (prefs[i] || '').toLowerCase();
      if (p.indexOf(other) === 0) { return true; }
      if (p.indexOf(pageLang) === 0) { return false; }
    }
    return false;
  }

  var bar = document.querySelector('[data-langbar]');
  if (!bar) return;

  var offers = (bar.getAttribute('data-langbar-lang') || '').slice(0, 2);
  if (!offers || offers === pageLang) return;

  /* ── Sprachweiche ───────────────────────────────────────────────────────
     Wer Deutsch bevorzugt, soll nicht erst auf einer englischen Seite landen
     und dort einen Hinweis wegklicken muessen. Deshalb schickt ihn diese
     Weiche gleich auf die deutsche Fassung.

     Sie greift nur einmal: Bei der Umleitung wird die Zielsprache notiert,
     und readChoice() weiter unten haelt jeden weiteren Aufruf davon ab. Wer
     auf der deutschen Seite auf "English" klickt, ueberschreibt die Notiz und
     bleibt danach bei Englisch. Ohne dieses Gedaechtnis wuerde die Weiche den
     Umschalter sofort wieder rueckgaengig machen.

     Nur in eine Richtung: Der Balken auf der deutschen Seite bietet Englisch
     an, umgeleitet wird von dort aber nie. Sonst haetten zwei Weichen
     einander abwechselnd aufgerufen.
     ───────────────────────────────────────────────────────────────────────
   */
  var target = bar.getAttribute('data-langbar-redirect');
  if (target && !readChoice() && prefers(offers)) {
    writeChoice(offers);
    /* replace statt href: der Zurueck-Knopf soll auf die Seite davor fuehren
       und nicht in die Umleitung zurueck. Hash und Suchparameter kommen mit,
       damit Anker und Kampagnen-Parameter die Weiche ueberleben. */
    location.replace(target + location.search + location.hash);
    return;
  }

  if (readChoice()) return;

  if (!prefers(offers)) return;

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
    var href = a.getAttribute('href') || '';
    if (href.indexOf('play.google.com') === -1) { return; }

    /* Der Wert wird als Ganzes kodiert — Google Play erwartet den referrer
       als eine einzige, prozentkodierte Zeichenkette. */
    if (href.indexOf('&referrer=') === -1) {
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
      /* Eigene Statistik, unabhaengig von Google. */
      if (window.umami && typeof umami.track === 'function') {
        try { umami.track('play-store-klick'); } catch (e) { /* egal */ }
      }
    });
  });
})();

/* ============================================================================
   iOS-Interesse: Adresse eintragen, ohne die Seite zu verlassen
   ============================================================================
   Das Formular funktioniert auch ohne dieses Skript, dann laedt der Browser
   die JSON-Antwort des Apps Scripts als neue Seite. Hier wird daraus ein
   Absenden im Hintergrund mit einer Rueckmeldung an Ort und Stelle.

   Die Antwort des Skripts lesen wir bewusst nicht aus: Apps Script leitet auf
   eine andere Domain um, deshalb laeuft die Anfrage als no-cors und kommt
   undurchsichtig zurueck. Ob der Eintrag geklappt hat, steht damit nur im
   Sheet. Das ist der Preis dafuer, ohne eigenen Server auszukommen, und fuer
   eine Interessentenliste vertretbar: ein Fehlschlag kostet eine Adresse,
   keine Bestellung.
   ========================================================================= */
(function () {
  'use strict';

  /* Solange hier der Platzhalter steht, wird nichts verschickt, sondern die
     Sektion versteckt. Damit kann die Seite live gehen, bevor das Sheet
     existiert, ohne ein Formular zu zeigen, das ins Leere laeuft. Dasselbe
     Prinzip wie beim Umami-Guard weiter oben. */
  var PLACEHOLDER = 'IOS_INTEREST_ENDPOINT';

  var forms = document.querySelectorAll('[data-ios-form]');
  if (!forms.length) { return; }

  Array.prototype.forEach.call(forms, function (form) {
    var endpoint = form.getAttribute('action') || '';
    var section  = form.closest('.ios');

    if (endpoint === PLACEHOLDER || !endpoint) {
      if (section) { section.hidden = true; }
      return;
    }

    var msg  = form.parentNode.querySelector('[data-ios-msg]');
    var lang = (document.documentElement.lang || 'en').slice(0, 2);

    var TEXT = lang === 'de' ? {
      sending: 'Wird eingetragen …',
      ok:      'Danke, du stehst auf der Liste.',
      err:     'Das hat nicht geklappt. Bitte später noch einmal versuchen.'
    } : {
      sending: 'Signing you up …',
      ok:      'Thanks, you are on the list.',
      err:     'That did not work. Please try again later.'
    };

    function say(text, kind) {
      if (!msg) { return; }
      msg.textContent = text;
      msg.className = 'ios__msg' + (kind ? ' ios__msg--' + kind : '');
    }

    form.addEventListener('submit', function (event) {
      /* Ungueltige Eingaben faengt der Browser selbst ab, dann kommt dieses
         Ereignis gar nicht erst an. */
      event.preventDefault();

      var button = form.querySelector('button[type="submit"]');
      if (button && button.disabled) { return; }
      if (button) { button.disabled = true; }
      say(TEXT.sending);

      var data = new FormData(form);
      data.append('lang', lang);
      data.append('source', location.pathname);

      /* URLSearchParams statt FormData als Koerper: FormData sendet
         multipart, und darauf antwortet der Browser mit einem Preflight, den
         Apps Script nicht beantwortet. Form-urlencoded gilt als einfache
         Anfrage und geht direkt durch. */
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(data)
      }).then(function () {
        form.reset();
        say(TEXT.ok, 'ok');
        if (window.umami && typeof umami.track === 'function') {
          try { umami.track('ios-interesse'); } catch (e) { /* egal */ }
        }
      }).catch(function () {
        say(TEXT.err, 'err');
      }).then(function () {
        /* In beiden Faellen wieder freigeben: das Formular ist leer, und wer
           eine zweite Adresse eintragen will, etwa fuer den Doppelpartner,
           soll das koennen. Der Schutz gegen Doppelklicks bleibt, weil der
           Button waehrend der laufenden Anfrage gesperrt ist. */
        if (button) { button.disabled = false; }
      });
    });
  });
})();
