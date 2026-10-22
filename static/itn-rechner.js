/* ============================================================================
   Kortscore, ITN-Rechner (/itn-rechner/)
   ============================================================================
   Verbindet die Eingaben der Seite mit itn-core.mjs. Gerechnet wird dort und
   nur dort: Das Bundle ist das nach JavaScript übersetzte Kotlin-Modul
   :itn-core der App, dieselbe Logik, dieselben Tests. In dieser Datei steht
   keine ITN-Regel und keine Formel, nur Lesen, Weiterreichen und Anzeigen.

   Ohne JavaScript bleibt das vorgerenderte Beispiel (7,512 gegen 7,180) auf
   der Seite stehen. Alle Texte, die das Skript schreibt, stehen als
   data-Attribute im HTML und kommen damit aus i18n/de/itn.yaml.
   ========================================================================= */
import { itnParse, itnFormat, itnSingles, itnDoubles } from './assets/js/itn-core.mjs';

const calc = document.querySelector('[data-itn-calc]');
if (calc) { initCalculator(calc); }

const waitlist = document.querySelector('[data-itn-waitlist]');
if (waitlist) { initWaitlist(waitlist); }

/* ── Rechner ───────────────────────────────────────────────────────────────
   Jede Eingabe, jeder Umschalter und jede Checkbox löst eine Neuberechnung
   aus. Die Ergebnisse stehen in einem aria-live-Bereich, Screenreader lesen
   die neuen Werte also vor.
   ─────────────────────────────────────────────────────────────────────── */
function initCalculator(root) {
  const out = root.querySelector('[data-itn-out]');
  const field = (name) => root.querySelector(`[data-itn-field="${name}"]`);
  const fields = {
    own: field('own'),
    opponent: field('opponent'),
    partner: field('partner'),
    opponent1: field('opponent1'),
    opponent2: field('opponent2'),
  };
  const shortFormat = root.querySelector('[data-itn-short]');
  const safe = {
    own: root.querySelector('[data-itn-safe="own"]'),
    opponent: root.querySelector('[data-itn-safe="opponent"]'),
  };
  const youth = {
    own: root.querySelector('[data-itn-youth="own"]'),
    opponent: root.querySelector('[data-itn-youth="opponent"]'),
  };
  const el = (attr) => out.querySelector(`[${attr}]`);
  const view = {
    valid: el('data-itn-valid'),
    invalid: out.querySelector('[data-itn-invalid]'),
    ownAvg: el('data-itn-own-avg'),
    opponentAvg: el('data-itn-opponent-avg'),
    win: el('data-itn-win'),
    winChange: el('data-itn-win-change'),
    loss: el('data-itn-loss'),
    lossChange: el('data-itn-loss-change'),
    partnerWin: el('data-itn-partner-win'),
    partnerLoss: el('data-itn-partner-loss'),
    weight: el('data-itn-weight'),
    youthNote: el('data-itn-youth-note'),
  };

  const checked = (name) => {
    const input = root.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : null;
  };

  /* Gewichtung in Prozent, mit Komma wie im restlichen Text (12,5 im
     Kurzformat-Doppel). Reine Darstellung, der Wert kommt aus itn-core. */
  const percent = (value) => String(value).replace('.', ',');

  /* Liest ein Feld und markiert es, wenn itnParse es ablehnt. Ein leeres
     Feld gilt als ungültig, wird aber nicht rot markiert, solange jemand
     noch tippt. */
  function read(input) {
    const value = itnParse(input.value);
    const bad = value === null && input.value.trim() !== '';
    if (bad) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    return value;
  }

  function update() {
    const doubles = checked('itn-mode') === 'doubles';
    const short = shortFormat.checked;
    const mode = doubles ? 'doubles' : 'singles';

    root.querySelectorAll('[data-itn-only]').forEach((node) => {
      node.hidden = node.getAttribute('data-itn-only') !== mode;
    });

    const names = doubles ? ['own', 'partner', 'opponent1', 'opponent2'] : ['own', 'opponent'];
    const values = names.map((name) => read(fields[name]));
    /* Felder des anderen Modus nicht rot stehen lassen, sie sind gerade
       unsichtbar. */
    Object.keys(fields).forEach((name) => {
      if (!names.includes(name)) { fields[name].removeAttribute('aria-invalid'); }
    });

    if (values.some((v) => v === null)) {
      view.valid.hidden = true;
      view.invalid.hidden = false;
      view.invalid.textContent = out.getAttribute(doubles ? 'data-invalid-doubles' : 'data-invalid-singles');
      return;
    }
    view.valid.hidden = false;
    view.invalid.hidden = true;

    let res;
    let weightText;
    if (doubles) {
      const [own, partner, opp1, opp2] = values;
      res = itnDoubles(own, partner, opp1, opp2, short);
      view.ownAvg.textContent = itnFormat(res.ownTeamAvg);
      view.opponentAvg.textContent = itnFormat(res.opponentTeamAvg);
      view.partnerWin.textContent = res.partnerWinAfterText;
      view.partnerLoss.textContent = res.partnerLossAfterText;
      weightText = out.getAttribute('data-weight-doubles').replace('{pct}', percent(res.weightPercent));
      view.youthNote.hidden = true;
    } else {
      const [own, opponent] = values;
      res = itnSingles(own, opponent, short, safe.own.checked, safe.opponent.checked,
        youth.own.checked, youth.opponent.checked);
      /* Zählen Sieg und Niederlage verschieden (Jugendregel), beide nennen,
         sonst ein Wert wie bisher. */
      weightText = res.winWeightPercent === res.lossWeightPercent
        ? out.getAttribute('data-weight-singles').replace('{pct}', percent(res.winWeightPercent))
        : out.getAttribute('data-weight-singles-split')
          .replace('{win}', percent(res.winWeightPercent))
          .replace('{loss}', percent(res.lossWeightPercent));
      view.youthNote.hidden = !res.youthRuleActive;
    }

    view.win.textContent = res.winAfterText;
    view.winChange.textContent = res.winChangeText;
    view.loss.textContent = res.lossAfterText;
    view.lossChange.textContent = res.lossChangeText;
    view.weight.textContent = weightText;
  }

  root.addEventListener('input', update);
  root.addEventListener('change', update);
  /* Einmal sofort: Der Browser kann nach "Zurück" alte Eingaben wiederherstellen,
     dann passt das vorgerenderte Beispiel nicht mehr dazu. */
  update();
}

/* ── Warteliste "Bald als App" ─────────────────────────────────────────────
   Der Block steht nur im HTML, wenn site.yaml einen echten Endpunkt hat.
   Abgeschickt wird wie bei der alten iOS-Liste (Commit 49489a3): als
   form-urlencoded POST mit mode no-cors an ein Google Apps Script.

   Die Antwort lesen wir bewusst nicht aus: Apps Script leitet auf eine andere
   Domain um, die Anfrage kommt deshalb undurchsichtig zurück. Ob der Eintrag
   geklappt hat, steht nur im Sheet. Für eine Warteliste vertretbar: ein
   Fehlschlag kostet eine Adresse, keine Bestellung.
   ─────────────────────────────────────────────────────────────────────── */
function initWaitlist(form) {
  const msg = form.querySelector('[data-itn-waitlist-msg]');
  const button = form.querySelector('button[type="submit"]');
  const endpoint = form.getAttribute('action') || '';

  function say(key, kind) {
    if (!msg) { return; }
    msg.textContent = form.getAttribute(`data-msg-${key}`) || '';
    msg.className = 'app__msg' + (kind ? ` app__msg--${kind}` : '');
  }

  form.addEventListener('submit', (event) => {
    /* Ungültige Adressen fängt der Browser selbst ab (required, type=email),
       dann kommt dieses Ereignis gar nicht erst an. */
    event.preventDefault();
    if (button.disabled) { return; }
    button.disabled = true;
    say('sending');

    /* Felder laut Vertrag mit tools/waitlist.gs: email, list (itn-app),
       lang, der leere Honeypot website und source. URLSearchParams statt
       FormData als Körper: FormData sendet multipart und löst einen
       Preflight aus, den Apps Script nicht beantwortet. */
    const data = new URLSearchParams(new FormData(form));
    data.set('source', location.pathname);

    fetch(endpoint, { method: 'POST', mode: 'no-cors', body: data })
      .then(() => {
        form.reset();
        say('ok', 'ok');
        if (window.umami && typeof window.umami.track === 'function') {
          try { window.umami.track('itn-app-warteliste'); } catch (e) { /* egal */ }
        }
      })
      .catch(() => { say('err', 'err'); })
      .then(() => {
        /* In beiden Fällen wieder freigeben: Wer eine zweite Adresse
           eintragen will, etwa für den Doppelpartner, soll das können. */
        button.disabled = false;
      });
  });
}
