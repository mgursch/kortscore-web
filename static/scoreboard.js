/* ============================================================================
   Kortscore, Scoreboard zum Selbstzählen
   ============================================================================
   Der Besucher zählt ein echtes Spiel mit dem Tippcode der Uhr: einmal tippen
   ist der eigene Punkt, zweimal der Punkt des Gegners, dreimal dreht den
   letzten Punkt um, viermal nimmt ihn zurück. Dazu Knöpfe für Tastatur und
   Screenreader.

   Die Datei hat zwei Teile:
     1. Zählregeln als reine Funktionen ohne DOM (Punkte, Einstand, Vorteil,
        Spiel, Satz, Tiebreak, NoAd/Golden Point, Rückgängig). Exportiert,
        damit tools/check_scoreboard.mjs sie unter Node prüfen kann.
     2. Die Anbindung an das Markup aus templates/partials/scoreboard.html.
        Sie läuft nur im Browser und hängt sich an jedes [data-scoreboard].

   Ohne JavaScript bleibt der vorgerenderte Spielstand stehen, Tippfläche und
   Knöpfe sind dann versteckt. Alle Texte, die das Skript schreibt, kommen aus
   data-sb-text und damit aus i18n/<sprache>/scoreboard.yaml.
   ========================================================================= */

/* ── 1. Zählregeln ─────────────────────────────────────────────────────────
   Ein Stand ist ein schlichtes Objekt. Seite 0 bin ich, Seite 1 der Gegner.
     points   Punkte im laufenden Spiel (Rohzahl, 3 heißt 40), im Tiebreak
              die Tiebreak-Punkte
     games    Spiele im laufenden Satz
     sets     gewonnene Sätze
     golden   NoAd (Tennis) bzw. Golden Point (Padel): bei 40:40 entscheidet
              der nächste Punkt. Vorteil gibt es dann nicht mehr; wer beim
              Einschalten gerade Vorteil hat, behält ihn (siehe scorePoint)
     last     was der letzte Punkt ausgelöst hat: null, {type: 'game', side}
              oder {type: 'set', side, score: [6, 4]}
     history  frühere Stände für Rückgängig, jüngster zuletzt
   Jede Funktion gibt einen neuen Stand zurück und lässt den alten in Ruhe.
   ─────────────────────────────────────────────────────────────────────── */

export const POINT_LABELS = ['0', '15', '30', '40'];
const HISTORY_LIMIT = 300;

const pair = (v, fallback = [0, 0]) =>
  Array.isArray(v) && v.length === 2 ? [Number(v[0]) || 0, Number(v[1]) || 0] : [...fallback];

/* Ganzzahl zwischen 0 und max. Alles Unbrauchbare (NaN, Text, Unendlich)
   wird 0. */
const clampInt = (n, max) => (Number.isFinite(n) ? Math.min(max, Math.max(0, Math.trunc(n))) : 0);

/* Startwerte, die im echten Spiel nicht vorkommen, werden auf den nächsten
   gültigen Stand gezogen, damit die Anzeige nie leer bleibt:
     Sätze    0 bis 9
     Spiele   0 bis 6; ist ein Satz mit 6:0 bis 6:4 schon entschieden, bleibt
              der Führende bei 5 (6:5 und 6:6 sind gültig)
     Punkte   im Spiel höchstens 40 mit zwei Punkten Abstand: [4, 0] wird
              [3, 0], [5, 2] wird [3, 2], [6, 3] wird [4, 3]; ab 3:3 zählt
              nur der Abstand (siehe deuceNormal). Im Tiebreak ebenso mit 7
              statt 4 als Spielende. */
function normalizeStart({ points, games, sets }) {
  const g = pair(games).map((n) => clampInt(n, 6));
  const hi = g[0] >= g[1] ? 0 : 1;
  if (g[hi] === 6 && g[1 - hi] < 5) g[hi] = 5;

  const tb = g[0] === 6 && g[1] === 6;
  const end = tb ? 7 : 4;
  const p = pair(points).map((n) => clampInt(n, 99));
  const lead = p[0] >= p[1] ? 0 : 1;
  if (p[lead] >= end && p[lead] - p[1 - lead] >= 2) {
    p[lead] = Math.max(end - 1, p[1 - lead] + 1);
  }
  return { points: deuceNormal(p, g), games: g, sets: pair(sets).map((n) => clampInt(n, 9)) };
}

/** Neuer Stand, optional mitten im Spiel (z. B. 40:30, Spiele 2:1). */
export function newScore({ points, games, sets, golden = false } = {}) {
  return {
    ...normalizeStart({ points, games, sets }),
    golden: Boolean(golden),
    last: null,
    history: [],
  };
}

/** Im Tiebreak steht es 6:6 bei den Spielen. */
export const inTiebreak = (s) => s.games[0] === 6 && s.games[1] === 6;

/* Nach Einstand zählt nur noch der Abstand: 5:5 ist wieder 3:3 (40:40), 5:4
   ist Vorteil wie 4:3. So bleibt der Stand klein und vergleichbar. Im
   Tiebreak zählt jeder Punkt einzeln und wird nicht gekürzt. */
function deuceNormal(p, games) {
  if (games[0] === 6 && games[1] === 6) return p;
  const m = Math.min(p[0], p[1]);
  if (m > 3) return [p[0] - (m - 3), p[1] - (m - 3)];
  return p;
}

const snapshot = (s, side) => ({
  points: [...s.points], games: [...s.games], sets: [...s.sets],
  golden: s.golden, last: s.last, side,
});

/** Punkt für Seite 0 (ich) oder 1 (Gegner). */
export function scorePoint(s, side) {
  const o = 1 - side;
  const history = [...s.history, snapshot(s, side)].slice(-HISTORY_LIMIT);
  const p = [...s.points];
  const games = [...s.games];
  const sets = [...s.sets];
  p[side] += 1;

  let won;
  if (inTiebreak(s)) {
    // Tiebreak bis 7, mit zwei Punkten Abstand. Golden Point gilt hier nicht.
    won = p[side] >= 7 && p[side] - p[o] >= 2;
  } else if (p[side] < 4) {
    won = false;
  } else if (s.golden) {
    /* NoAd/Golden Point: wer ab dem vierten Punkt vorne liegt, gewinnt. Bei
       40:40 (3:3) entscheidet damit der nächste Punkt. Wird der Schalter
       mitten im Vorteil eingeschaltet, behält die Seite mit Vorteil ihren
       Vorteil: gewinnt sie den Punkt, ist das Spiel aus; gewinnt die andere
       Seite ihn, steht es wieder 40:40, und der Punkt danach entscheidet.
       Der Gegner mit Rückstand kann das Spiel also nie mit einem einzelnen
       Punkt holen (4:4 ist kein Vorsprung). Dieselbe Regel gilt für den
       Startstand [4, 3] mit golden. */
    won = p[side] > p[o];
  } else {
    // Normal: ab dem vierten Punkt mit zwei Punkten Abstand.
    won = p[side] - p[o] >= 2;
  }

  if (!won) {
    return { ...s, points: deuceNormal(p, games), games, sets, last: null, history };
  }

  games[side] += 1;
  const setWon =
    (games[side] === 7) ||
    (games[side] >= 6 && games[side] - games[o] >= 2);
  if (setWon) {
    const score = [...games];
    sets[side] += 1;
    return {
      ...s, points: [0, 0], games: [0, 0], sets,
      last: { type: 'set', side, score }, history,
    };
  }
  return { ...s, points: [0, 0], games, sets, last: { type: 'game', side }, history };
}

/** Letzten Punkt zurücknehmen. Ohne Verlauf bleibt der Stand, wie er ist.
    Der NoAd-Schalter gehört nicht zum Spielstand und bleibt stehen. */
export function undoPoint(s) {
  if (!s.history.length) return s;
  const history = s.history.slice(0, -1);
  const prev = s.history[s.history.length - 1];
  return {
    points: [...prev.points], games: [...prev.games], sets: [...prev.sets],
    golden: s.golden, last: prev.last, history,
  };
}

/** Letzten Punkt der anderen Seite geben (dreimal tippen auf der Uhr). */
export function flipPoint(s) {
  if (!s.history.length) return s;
  const side = s.history[s.history.length - 1].side;
  return scorePoint(undoPoint(s), 1 - side);
}

export const canUndo = (s) => s.history.length > 0;

/** NoAd bzw. Golden Point ein- oder ausschalten. Gilt ab dem nächsten Punkt;
    ein laufender Vorteil bleibt dabei bestehen (siehe scorePoint). */
export const setGolden = (s, on) => ({ ...s, golden: Boolean(on) });

/** Zurück an den Start: ohne start auf 0:0, sonst auf den vorgegebenen
    Stand (z. B. Einstand oder Tiebreak 5:4 auf den Regelseiten). Der
    Schalter bleibt, wie ihn der Besucher gestellt hat. */
export const resetScore = (s, start = {}) => newScore({ ...start, golden: s.golden });

/** Was die Anzeige zeigt. phase ist 'points', 'deuce', 'advantage' oder
    'tiebreak'; lead ist bei Vorteil die führende Seite. */
export function scoreView(s, advLabel = 'A') {
  const [a, b] = s.points;
  if (inTiebreak(s)) {
    return { points: [String(a), String(b)], phase: 'tiebreak', lead: null };
  }
  if (a >= 3 && b >= 3) {
    if (a === b) return { points: ['40', '40'], phase: 'deuce', lead: null };
    const lead = a > b ? 0 : 1;
    const pts = ['40', '40'];
    pts[lead] = advLabel;
    return { points: pts, phase: 'advantage', lead };
  }
  return { points: [POINT_LABELS[a], POINT_LABELS[b]], phase: 'points', lead: null };
}

/* ── Tippgruppen ───────────────────────────────────────────────────────────
   Tipps, die in kurzem Abstand kommen, gehören zusammen. Nach dem letzten
   Tipp wartet der Zähler windowMs; kommt bis dahin keiner mehr, meldet er die
   Anzahl. Die Uhr macht es genauso (MULTI_TAP_WINDOW_MS = 600 in
   InputTiming.kt der Uhren-App). Zeitgeber lassen sich für den Test
   austauschen.
   ─────────────────────────────────────────────────────────────────────── */

export const TAP_WINDOW_MS = 600;

/** Was eine Anzahl Tipps bedeutet: 'me', 'opp', 'flip' oder 'undo'. */
export const tapAction = (n) => (n <= 1 ? 'me' : n === 2 ? 'opp' : n === 3 ? 'flip' : 'undo');

export function createTapGrouper({
  windowMs = TAP_WINDOW_MS, onTap = () => {}, onCommit = () => {},
  setTimer = setTimeout, clearTimer = clearTimeout,
} = {}) {
  let count = 0;
  let timer = null;
  const commit = () => {
    const n = count;
    count = 0;
    timer = null;
    if (n) onCommit(n);
  };
  return {
    tap() {
      count += 1;
      if (timer !== null) clearTimer(timer);
      onTap(count);
      timer = setTimer(commit, windowMs);
    },
    /** Laufende Gruppe sofort abschließen, bevor ein Knopf greift. */
    flush() {
      if (timer !== null) clearTimer(timer);
      commit();
    },
    get pending() { return count; },
  };
}

/* ── 2. Anbindung an das Markup ────────────────────────────────────────────
   Erwartet das Markup aus templates/partials/scoreboard.html:
     [data-scoreboard]       Wurzel mit data-sb-state (JSON) und
                             data-sb-text (JSON, alle Texte)
     [data-sb="..."]         Zellen und Ausgaben, siehe Partial
     [data-sb-act="..."]     Knöpfe: me, opp, undo, reset
     [data-sb-js]            ohne JavaScript versteckt, hier eingeblendet
   ─────────────────────────────────────────────────────────────────────── */

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

export function initScoreboard(root) {
  if (root.dataset.sbReady) return;
  root.dataset.sbReady = '1';

  const T = JSON.parse(root.dataset.sbText || '{}');
  const sport = root.dataset.sport === 'padel' ? 'padel' : 'tennis';
  const start = JSON.parse(root.dataset.sbState || '{}');
  let state = newScore(start);
  /* "Neu starten" führt zurück an den vorgegebenen Stand, damit Hinweise wie
     "Zähl von Einstand aus" wieder passen. data-sb-reset="zero" (der Hero)
     beginnt stattdessen ein frisches Spiel bei 0:0. */
  const resetTo = root.dataset.sbReset === 'zero' ? {} : start;

  const el = (name) => root.querySelector(`[data-sb="${name}"]`);
  const live = el('live');
  const status = el('status');
  const pad = el('pad');
  const padCount = el('pad-count');
  const padAction = el('pad-action');
  const pips = [...root.querySelectorAll('[data-sb="pip"]')];
  const goldenBox = el('golden');
  const undoBtn = root.querySelector('[data-sb-act="undo"]');
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

  const cells = {
    points: [el('points-0'), el('points-1')],
    games: [el('games-0'), el('games-1')],
    sets: [el('sets-0'), el('sets-1')],
  };

  /* Eine Zahl wechselt mit einem kurzen Rollen von unten, 160 ms. Wer
     reduzierte Bewegung eingestellt hat, sieht den Wechsel ohne Übergang. */
  function setNum(node, value) {
    if (!node || node.textContent === value) return;
    node.textContent = value;
    if (motion.matches && node.animate) {
      node.animate(
        [{ transform: 'translateY(0.32em)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 160, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }
  }

  function statusText() {
    const last = state.last;
    if (last && last.type === 'set') {
      return fill(last.side === 0 ? T.set_me : T.set_opp, { games: last.score.join(':') });
    }
    if (last && last.type === 'game') return last.side === 0 ? T.game_me : T.game_opp;
    const v = scoreView(state, T.adv_short);
    if (v.phase === 'tiebreak') return T.tiebreak;
    if (v.phase === 'deuce') return state.golden ? fill(T.deciding, { name: T.golden[sport] }) : T.deuce;
    if (v.phase === 'advantage') return v.lead === 0 ? T.adv_me : T.adv_opp;
    return '';
  }

  function spoken() {
    const v = scoreView(state, T.adv_short);
    const parts = [];
    const st = statusText();
    if (st) parts.push(st);
    if (state.last) {
      // Nach einem Spiel der Spielstand im Satz; nach einem Satz steht das
      // Ergebnis schon in der Statuszeile.
      if (state.last.type === 'game') {
        parts.push(fill(T.games_say, { me: state.games[0], opp: state.games[1] }));
      }
    } else if (v.phase === 'points' || v.phase === 'tiebreak') {
      parts.push(fill(T.score_say, { me: v.points[0], opp: v.points[1] }));
    }
    return parts.join('. ');
  }

  function render() {
    const v = scoreView(state, T.adv_short);
    for (const side of [0, 1]) {
      setNum(cells.points[side], v.points[side]);
      setNum(cells.games[side], String(state.games[side]));
      setNum(cells.sets[side], String(state.sets[side]));
    }
    root.dataset.phase = v.phase;
    root.dataset.lead = v.lead === null ? '' : String(v.lead);
    const st = statusText();
    if (status && status.textContent !== st) {
      status.textContent = st;
      if (motion.matches && status.animate && st) {
        status.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease' });
      }
    }
    if (undoBtn) undoBtn.setAttribute('aria-disabled', String(!canUndo(state)));
  }

  /* Ansage für Screenreader. Erst leeren, dann kurz danach setzen, damit auch
     eine gleichlautende Ansage wieder vorgelesen wird. setTimeout statt
     requestAnimationFrame, weil Frames in Hintergrund-Tabs pausieren. */
  let announceTimer = null;
  function announce(msg) {
    if (!live) return;
    live.textContent = '';
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => { live.textContent = msg; }, 50);
  }

  function act(action) {
    let prefix;
    if (action === 'me' || action === 'opp') {
      state = scorePoint(state, action === 'me' ? 0 : 1);
      prefix = action === 'me' ? T.btn_me : T.btn_opp;
    } else if (action === 'undo' || action === 'flip') {
      if (!canUndo(state)) {
        announce(action === 'undo' ? T.nothing : T.nothing_flip);
        return;
      }
      state = action === 'undo' ? undoPoint(state) : flipPoint(state);
      prefix = action === 'undo' ? T.undone : T.flipped;
    } else if (action === 'reset') {
      state = resetScore(state, resetTo);
      prefix = T.new_game;
    } else {
      return;
    }
    render();
    announce(`${prefix}. ${spoken()}`);
  }

  /* Anzeige auf der Tippfläche, solange eine Gruppe läuft: Anzahl, Punkte
     und was die Gruppe gerade bedeuten würde. */
  const ACTION_TEXT = { me: T.btn_me, opp: T.btn_opp, flip: T.act_flip, undo: T.btn_undo };
  function showPending(n) {
    if (!pad) return;
    pad.dataset.taps = String(n);
    pips.forEach((pip, i) => pip.classList.toggle('is-on', i < n));
    if (padCount) padCount.textContent = n ? `${Math.min(n, 4)}×` : T.pad;
    if (padAction) padAction.textContent = n ? ACTION_TEXT[tapAction(n)] : T.pad_note;
  }

  const grouper = createTapGrouper({
    onTap: showPending,
    onCommit: (n) => {
      showPending(0);
      act(tapAction(n));
    },
  });

  if (pad) {
    // click kommt von Maus, Finger und von Enter/Leertaste auf dem Knopf.
    pad.addEventListener('click', () => grouper.tap());
    // Gehaltene Enter-Taste löst sonst laufend click aus, und vier Tipps
    // würden zum Zurücknehmen. Nur der erste Tastendruck zählt.
    pad.addEventListener('keydown', (e) => { if (e.repeat) e.preventDefault(); });
  }
  root.querySelectorAll('[data-sb-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-disabled') === 'true') { announce(T.nothing); return; }
      grouper.flush();
      act(btn.dataset.sbAct);
    });
  });
  if (goldenBox) {
    goldenBox.checked = state.golden;
    goldenBox.addEventListener('change', () => {
      state = setGolden(state, goldenBox.checked);
      render();
    });
  }

  root.querySelectorAll('[data-sb-js]').forEach((node) => { node.hidden = false; });
  root.classList.add('is-live');
  render();
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-scoreboard]').forEach(initScoreboard);
}
