#!/usr/bin/env node
/* Prüft die Zählregeln des Scoreboards (static/scoreboard.js).

       node tools/check_scoreboard.mjs

   Geprüft wird:
     - Punkte 0, 15, 30, 40 und das Spiel
     - Einstand, Vorteil, zurück auf Einstand, Spiel nach Vorteil
     - NoAd/Golden Point: bei 40:40 entscheidet der nächste Punkt, in beide
       Richtungen, und erst ab dem nächsten Punkt nach dem Einschalten
     - Golden Point mitten im Vorteil (eingeschaltet oder als Startstand
       [4, 3]): wer Vorteil hat, gewinnt mit dem nächsten Punkt, der andere
       holt nur 40:40 zurück und der Punkt danach entscheidet
     - Startwerte: ungültige Punkte, Spiele und Sätze werden auf den
       nächsten gültigen Stand gezogen, die Anzeige bleibt nie leer
     - Rückgängig über mehrere Punkte, über ein gewonnenes Spiel hinweg, ohne
       Verlauf, und dass der NoAd-Schalter dabei stehen bleibt
     - Punkt drehen (dreimal tippen)
     - Satz 6:4, kein Satz bei 6:5, 7:5, Tiebreak bei 6:6 bis 7 mit zwei
       Punkten Abstand, Satz 7:6, kein Golden Point im Tiebreak
     - Tippgruppen: Zeitfenster wie auf der Uhr (600 ms), 1 = ich, 2 = Gegner, 3 = drehen, 4 = zurück, Gruppen
       trennen sich nach dem Zeitfenster

   Die Datei ist ein Browser-Modul ohne package.json daneben. Damit Node sie
   unabhängig von seiner Version als ES-Modul liest, kommt sie als data:-URL
   herein. Ihr DOM-Teil läuft nur, wenn es document gibt. Keine
   Abhängigkeiten außer Node (ab 18). Exit-Code 1 bei einem Fehler. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(ROOT, 'static/scoreboard.js'), 'utf8');
const sb = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const {
  newScore, scorePoint, undoPoint, flipPoint, setGolden, resetScore, scoreView,
  inTiebreak, canUndo, tapAction, createTapGrouper, TAP_WINDOW_MS,
} = sb;

const errors = [];
let checks = 0;
function eq(actual, expected, what) {
  checks += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) errors.push(`${what}: erwartet ${e}, bekommen ${a}`);
}

/** Spielt eine Folge wie "1121" (1 = ich, 2 = Gegner) ab. */
const play = (s, seq) => [...seq].reduce((acc, c) => scorePoint(acc, c === '1' ? 0 : 1), s);
const shown = (s) => scoreView(s).points.join(':');
const phase = (s) => scoreView(s).phase;

// ── Punkte und Spiel ─────────────────────────────────────────────────────
let s = newScore();
eq(shown(s), '0:0', 'Start');
eq(shown(play(s, '1')), '15:0', 'ein Punkt');
eq(shown(play(s, '11')), '30:0', 'zwei Punkte');
eq(shown(play(s, '112')), '30:15', '30:15');
eq(shown(play(s, '111')), '40:0', '40:0');
s = play(newScore(), '1111');
eq([shown(s), s.games, s.last], ['0:0', [1, 0], { type: 'game', side: 0 }], 'Spiel zu null');
s = play(newScore(), '2222');
eq([s.games, s.last], [[0, 1], { type: 'game', side: 1 }], 'Spiel für den Gegner');

// ── Einstand und Vorteil ─────────────────────────────────────────────────
s = play(newScore(), '111222');
eq([shown(s), phase(s)], ['40:40', 'deuce'], 'Einstand');
s = scorePoint(s, 0);
eq([shown(s), phase(s), scoreView(s).lead], ['A:40', 'advantage', 0], 'Vorteil ich');
s = scorePoint(s, 1);
eq([shown(s), phase(s), s.points], ['40:40', 'deuce', [3, 3]], 'zurück auf Einstand, Stand gekürzt');
s = scorePoint(s, 1);
eq([shown(s), scoreView(s).lead], ['40:A', 1], 'Vorteil Gegner');
s = scorePoint(s, 1);
eq([s.games, shown(s), s.last], [[0, 1], '0:0', { type: 'game', side: 1 }], 'Spiel nach Vorteil');
eq(shown(play(newScore(), '1112221212')), '40:40', 'langer Einstand bleibt 40:40');
eq(scoreView(play(newScore(), '111222'), 'Ad').points, ['40', '40'], 'eigenes Vorteilszeichen bei Einstand');
eq(scoreView(play(newScore(), '1112221'), 'Ad').points, ['Ad', '40'], 'eigenes Vorteilszeichen');
eq(shown(newScore({ points: [3, 2], games: [2, 1] })), '40:30', 'Start mitten im Spiel');
eq(shown(newScore({ points: [6, 5] })), 'A:40', 'Start gekürzt auf Vorteil');

// ── NoAd / Golden Point ──────────────────────────────────────────────────
s = play(newScore({ golden: true }), '111222');
eq(phase(s), 'deuce', 'Golden Point: 40:40');
eq(scorePoint(s, 0).games, [1, 0], 'Golden Point für mich');
eq(scorePoint(s, 1).games, [0, 1], 'Golden Point für den Gegner');
eq(play(newScore({ golden: true }), '1112').games, [0, 0], 'Golden Point ändert 40:15 nicht');
s = play(newScore(), '111222');
s = setGolden(s, true);
eq(scorePoint(s, 1).games, [0, 1], 'Golden Point eingeschaltet bei 40:40');
s = play(setGolden(newScore(), true), '1112221');
eq(s.games, [1, 0], 'Golden Point schon beim ersten 40:40');

// Golden Point eingeschaltet, während eine Seite Vorteil hat.
s = setGolden(play(newScore(), '1112221'), true);
eq([shown(s), phase(s)], ['A:40', 'advantage'], 'Golden Point mitten im Vorteil: Anzeige bleibt');
eq([scorePoint(s, 0).games, scorePoint(s, 0).last], [[1, 0], { type: 'game', side: 0 }], 'Vorteil mit Golden Point: Seite mit Vorteil gewinnt');
eq(scorePoint(s, 1).games, [0, 0], 'Vorteil mit Golden Point: Rückstand gewinnt das Spiel nicht');
eq([shown(scorePoint(s, 1)), phase(scorePoint(s, 1)), scorePoint(s, 1).points], ['40:40', 'deuce', [3, 3]], 'Vorteil mit Golden Point: Punkt der anderen Seite gibt 40:40');
eq(scorePoint(scorePoint(s, 1), 1).games, [0, 1], 'danach entscheidet der nächste Punkt (Gegner)');
eq(scorePoint(scorePoint(s, 1), 0).games, [1, 0], 'danach entscheidet der nächste Punkt (ich)');
s = setGolden(play(newScore(), '1112222'), true);
eq(shown(s), '40:A', 'Golden Point mitten im Vorteil des Gegners: Anzeige');
eq(scorePoint(s, 0).games, [0, 0], 'Gegnervorteil mit Golden Point: ich gewinne das Spiel nicht');
eq(shown(scorePoint(s, 0)), '40:40', 'Gegnervorteil mit Golden Point: zurück auf 40:40');
eq(scorePoint(s, 1).games, [0, 1], 'Gegnervorteil mit Golden Point: Gegner gewinnt');
s = newScore({ points: [4, 3], golden: true });
eq(scorePoint(s, 1).games, [0, 0], 'Startstand [4, 3] golden: Rückstand gewinnt nicht');
eq(scorePoint(s, 0).games, [1, 0], 'Startstand [4, 3] golden: Vorteil gewinnt');
s = newScore({ points: [3, 4], golden: true });
eq([scorePoint(s, 0).games, scorePoint(s, 1).games], [[0, 0], [0, 1]], 'Startstand [3, 4] golden');
s = setGolden(play(newScore(), '1112221'), false);
eq(scorePoint(s, 1).games, [0, 0], 'Golden Point wieder aus: Vorteil wie gehabt');
eq(scorePoint(s, 0).games, [1, 0], 'Golden Point aus: Spiel nach Vorteil');

// ── Startwerte ───────────────────────────────────────────────────────────
eq(newScore({ points: [4, 0] }).points, [3, 0], 'Start [4, 0] wird 40:0');
eq(shown(newScore({ points: [5, 2] })), '40:30', 'Start [5, 2] wird 40:30');
eq(shown(newScore({ points: [6, 3] })), 'A:40', 'Start [6, 3] wird Vorteil');
eq(shown(newScore({ points: [5, 5] })), '40:40', 'Start [5, 5] wird 40:40');
eq(shown(newScore({ points: [-2, 1] })), '0:15', 'negative Punkte werden 0');
eq(shown(newScore({ points: ['x', null] })), '0:0', 'Text und null werden 0');
eq(shown(newScore({ points: [1.7, 2.2] })), '15:30', 'Kommazahlen werden abgeschnitten');
eq(shown(newScore({ points: [Infinity, 0] })), '0:0', 'Unendlich wird 0');
eq(shown(newScore({ points: [3] })), '0:0', 'falsche Länge wird 0:0');
eq(newScore({ games: [6, 0] }).games, [5, 0], 'Spiele [6, 0] sind kein offener Satz');
eq(newScore({ games: [2, 6] }).games, [2, 5], 'Spiele [2, 6] werden [2, 5]');
eq(newScore({ games: [6, 5] }).games, [6, 5], 'Spiele [6, 5] gültig');
eq(newScore({ games: [9, 9] }).games, [6, 6], 'Spiele werden auf 6 gekappt');
eq(newScore({ sets: [12, -1] }).sets, [9, 0], 'Sätze 0 bis 9');
eq(newScore({ games: [6, 6], points: [7, 0] }).points, [6, 0], 'Tiebreak [7, 0] wird [6, 0]');
eq(newScore({ games: [6, 6], points: [9, 6] }).points, [7, 6], 'Tiebreak [9, 6] wird [7, 6]');
eq(newScore({ games: [6, 6], points: [8, 7] }).points, [8, 7], 'Tiebreak [8, 7] bleibt');
eq(shown(newScore({ games: [6, 6], points: [6, 3] })), '6:3', 'Tiebreak [6, 3] bleibt');
eq(scoreView(newScore({ points: [4, 0] })).points.every((x) => x !== '' && x !== undefined), true, 'Anzeige nie leer');
const empty = [];
for (let a = -1; a < 12; a += 1) {
  for (let b = -1; b < 12; b += 1) {
    for (const games of [[0, 0], [6, 6]]) {
      const v = scoreView(newScore({ points: [a, b], games }));
      if (v.points.some((x) => !x)) empty.push(`${a}:${b} bei Spielen ${games}`);
    }
  }
}
eq(empty, [], 'Anzeige bleibt für alle Startpunkte von -1 bis 11 gefüllt');

// ── Rückgängig ───────────────────────────────────────────────────────────
s = play(newScore(), '112');
eq(shown(undoPoint(s)), '30:0', 'einen Punkt zurück');
eq(shown(undoPoint(undoPoint(undoPoint(s)))), '0:0', 'drei Punkte zurück');
eq(undoPoint(newScore()), newScore(), 'nichts zurückzunehmen');
eq(canUndo(newScore()), false, 'canUndo ohne Verlauf');
s = play(newScore(), '1111');
s = undoPoint(s);
eq([s.games, shown(s), s.last], [[0, 0], '40:0', null], 'Spiel zurückgenommen');
s = play(newScore(), '1112221');
eq([shown(undoPoint(s)), phase(undoPoint(s))], ['40:40', 'deuce'], 'Vorteil zurück auf Einstand');
s = setGolden(play(newScore(), '11'), true);
eq(undoPoint(s).golden, true, 'Schalter bleibt beim Zurücknehmen');
s = play(newScore({ points: [3, 2], games: [2, 1] }), '1');
eq([undoPoint(s).games, shown(undoPoint(s))], [[2, 1], '40:30'], 'zurück auf den Startstand');

// ── Punkt drehen ─────────────────────────────────────────────────────────
s = play(newScore(), '11');
eq(shown(flipPoint(s)), '15:15', 'letzten Punkt drehen');
eq(shown(flipPoint(flipPoint(s))), '30:0', 'zweimal drehen');
s = play(newScore(), '1111');
eq([flipPoint(s).games, shown(flipPoint(s))], [[0, 0], '40:15'], 'Spielpunkt drehen');
eq(flipPoint(newScore()), newScore(), 'drehen ohne Verlauf');

// ── Satz und Tiebreak ────────────────────────────────────────────────────
const game = (side) => (side === 0 ? '1111' : '2222');
const games = (seq) => [...seq].map((c) => game(c === '1' ? 0 : 1)).join('');
s = play(newScore(), games('1112121221'));
eq([s.sets, s.games, s.last], [[1, 0], [0, 0], { type: 'set', side: 0, score: [6, 4] }], 'Satz 6:4');
s = play(newScore(), games('11111222221'));
eq([s.sets, s.games], [[0, 0], [6, 5]], 'kein Satz bei 6:5');
s = play(s, game(0));
eq([s.sets, s.last && s.last.score], [[1, 0], [7, 5]], 'Satz 7:5');
s = play(newScore(), games('111112222212'));
eq([s.games, inTiebreak(s), phase(s)], [[6, 6], true, 'tiebreak'], 'Tiebreak bei 6:6');
s = play(s, '1112');
eq(shown(s), '3:1', 'Tiebreak zählt 1, 2, 3');
s = play(s, '11');
eq([shown(s), s.games], ['5:1', [6, 6]], 'Tiebreak noch offen');
s = play(newScore({ games: [6, 6] }), '111111222222');
eq([shown(s), s.sets], ['6:6', [0, 0]], 'Tiebreak 6:6 wird nicht gekürzt');
s = scorePoint(s, 0);
eq(s.sets, [0, 0], 'kein Satz bei 7:6 im Tiebreak');
s = scorePoint(s, 0);
eq([s.sets, s.games, s.last], [[1, 0], [0, 0], { type: 'set', side: 0, score: [7, 6] }], 'Satz 7:6 nach Tiebreak 8:6');
s = play(newScore({ games: [6, 6] }), '2222222');
eq([s.sets, s.last.score], [[0, 1], [6, 7]], 'Tiebreak 0:7 für den Gegner');
s = play(newScore({ games: [6, 6], golden: true }), '111222');
eq([shown(scorePoint(s, 0)), s.sets], ['4:3', [0, 0]], 'kein Golden Point im Tiebreak');
s = play(newScore({ games: [6, 6] }), '1111112');
eq(shown(undoPoint(scorePoint(s, 0))), '6:1', 'Rückgängig nach Satzgewinn');
eq(undoPoint(scorePoint(s, 0)).games, [6, 6], 'Rückgängig stellt 6:6 wieder her');
eq(resetScore(setGolden(s, true)), { ...newScore(), golden: true }, 'Neu starten behält Schalter');
eq(shown(resetScore(play(newScore({ points: [3, 3] }), '1112'), { points: [3, 3] })), '40:40', 'Neu starten zurück auf Einstand');
eq(resetScore(play(newScore({ points: [5, 4], games: [6, 6] }), '11'), { points: [5, 4], games: [6, 6] }).games, [6, 6], 'Neu starten zurück in den Tiebreak');
eq(shown(resetScore(play(newScore({ points: [5, 4], games: [6, 6] }), '1'), { points: [5, 4], games: [6, 6] })), '5:4', 'Neu starten zurück auf Tiebreak 5:4');
eq(resetScore(setGolden(newScore({ points: [3, 3], golden: true }), false), { points: [3, 3], golden: true }).golden, false, 'Neu starten an den Start behält den Schalter');

// ── Tippgruppen ──────────────────────────────────────────────────────────
eq(TAP_WINDOW_MS, 600, 'Zeitfenster wie die Uhr (MULTI_TAP_WINDOW_MS)');
eq([1, 2, 3, 4, 5].map(tapAction), ['me', 'opp', 'flip', 'undo', 'undo'], 'Bedeutung der Tippanzahl');

// Fake-Zeitgeber: Zeit läuft nur, wenn der Test es sagt.
function fakeClock() {
  let now = 0; let seq = 0; const timers = new Map();
  return {
    set: (fn, ms) => { seq += 1; timers.set(seq, { fn, at: now + ms }); return seq; },
    clear: (id) => timers.delete(id),
    advance(ms) {
      now += ms;
      for (const [id, t] of [...timers]) if (t.at <= now) { timers.delete(id); t.fn(); }
    },
  };
}
const clock = fakeClock();
const commits = []; const pending = [];
const g = createTapGrouper({
  windowMs: TAP_WINDOW_MS, setTimer: clock.set, clearTimer: clock.clear,
  onTap: (n) => pending.push(n), onCommit: (n) => commits.push(n),
});
g.tap(); clock.advance(599);
eq(commits, [], 'noch im Zeitfenster');
clock.advance(1);
eq(commits, [1], 'ein Tipp nach 600 ms');
g.tap(); clock.advance(250); g.tap(); clock.advance(599);
eq(commits, [1], 'zweiter Tipp verlängert das Fenster');
clock.advance(1);
eq(commits, [1, 2], 'zwei Tipps');
for (let i = 0; i < 4; i += 1) { g.tap(); clock.advance(150); }
clock.advance(600);
eq(commits, [1, 2, 4], 'vier Tipps');
eq(pending, [1, 1, 2, 1, 2, 3, 4], 'Zwischenstand je Tipp');
g.tap(); clock.advance(700); g.tap(); clock.advance(700);
eq(commits, [1, 2, 4, 1, 1], 'Pause trennt zwei Gruppen');
g.tap(); g.tap(); g.tap(); g.flush();
eq([commits.at(-1), g.pending], [3, 0], 'flush schließt sofort ab');

if (errors.length) {
  console.error(`${errors.length} von ${checks} Prüfungen fehlgeschlagen:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`Scoreboard: ${checks} Prüfungen bestanden`);
