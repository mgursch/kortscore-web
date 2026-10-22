#!/usr/bin/env node
/* Prüft den ITN-Rechner, bevor er live geht.

       python3 build.py && node tools/check_itn.mjs

   Geprüft wird:
     - static/assets/js/itn-core.mjs (aus dem Kotlin-Modul :itn-core, siehe
       tools/sync_itn_core.sh) liefert die Testwerte aus ItnCalculatorTest:
       Einzel lang und kurz, Doppel samt Teamschnitt und Partner*in
     - die Beispieltabelle auf der Seite: jede Zeile wird aus data-winner und
       data-loser neu gerechnet (0,070, 0,232, 0,003)
     - das vorgerenderte Ergebnis in _site/itn-rechner/index.html entspricht
       itnSingles(7,512; 7,180; lang; beide sicher)

   Ändert sich die Formel im Bundle, passt das statische HTML nicht mehr, und
   dieses Skript schlägt an. Keine Abhängigkeiten außer Node (ab 18).
   Exit-Code 1 bei einem Fehler. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const core = await import(pathToFileURL(join(ROOT, 'static/assets/js/itn-core.mjs')).href);
const { itnParse, itnFormat, itnFormatDelta, itnSingles, itnDoubles, itnRawDelta, itnRound } = core;

const errors = [];
let checks = 0;
function eq(what, actual, expected) {
  checks += 1;
  if (actual !== expected) { errors.push(`${what}: ${JSON.stringify(actual)}, erwartet ${JSON.stringify(expected)}`); }
}

/* ── Bundle gegen die Testwerte der App ─────────────────────────────────── */
eq('itnParse("7,512")', itnParse('7,512'), 7.512);
eq('itnParse("7.18")', itnParse('7.18'), 7.18);
eq('itnParse("10,0")', itnParse('10,0'), 10);
eq('itnParse("10,3")', itnParse('10,3'), null);
eq('itnParse("0,9")', itnParse('0,9'), null);
eq('itnParse("7,5125")', itnParse('7,5125'), null);
eq('itnParse("")', itnParse(''), null);
eq('itnFormat(7.5)', itnFormat(7.5), '7,500');
eq('itnFormatDelta(-0.138)', itnFormatDelta(-0.138), '−0,138');
eq('itnFormatDelta(0.027)', itnFormatDelta(0.027), '+0,027');

const s = itnSingles(7.512, 7.180, false, true, true);
eq('Einzel Sieg', s.winAfterText, '7,374');
eq('Einzel Sieg Änderung', s.winChangeText, '−0,138');
eq('Einzel Niederlage', s.lossAfterText, '7,539');
eq('Einzel Niederlage Änderung', s.lossChangeText, '+0,027');
eq('Einzel Gewichtung', s.weightPercent, 100);

const k = itnSingles(7.512, 7.180, true, true, true);
eq('Einzel kurz Sieg', k.winAfterText, '7,443');
eq('Einzel kurz Gewichtung', k.weightPercent, 50);

eq('Einzel unsicher gegen sicher', itnSingles(7.512, 7.180, false, false, true).weightPercent, 200);
eq('Einzel sicher gegen unsicher', itnSingles(7.512, 7.180, false, true, false).weightPercent, 50);

const d = itnDoubles(7.512, 7.840, 7.180, 7.900, false);
eq('Doppel Teamschnitt', itnFormat(d.ownTeamAvg), '7,676');
eq('Doppel Gegenseite', itnFormat(d.opponentTeamAvg), '7,540');
eq('Doppel Sieg', d.winAfterText, '7,488');
eq('Doppel Sieg Änderung', d.winChangeText, '−0,024');
eq('Doppel Niederlage', d.lossAfterText, '7,524');
eq('Doppel Niederlage Änderung', d.lossChangeText, '+0,012');
eq('Doppel Partner*in Sieg', d.partnerWinAfterText, '7,816');
eq('Doppel Partner*in Niederlage', d.partnerLossAfterText, '7,852');
eq('Doppel Gewichtung', d.weightPercent, 25);

/* Δ der Beispieltabelle, unabhängig von der Seite. */
const delta = (winner, loser) => itnFormat(itnRound(itnRawDelta(winner, loser)));
eq('Δ gleich stark', delta(7, 7), '0,070');
eq('Δ 6,0 schlägt 5,0', delta(6, 5), '0,232');
eq('Δ 5,0 schlägt 6,0', delta(5, 6), '0,003');

/* ── Gebaute Seite ──────────────────────────────────────────────────────── */
const pagePath = join(ROOT, '_site/itn-rechner/index.html');
let html = '';
try {
  html = readFileSync(pagePath, 'utf8');
} catch {
  errors.push('_site/itn-rechner/index.html fehlt, erst python3 build.py ausführen');
}

/* Entitäten, wie sie im gebauten HTML vorkommen können, und Tags weg. */
const text = (s) => s.replace(/<[^>]+>/g, '')
  .replace(/&minus;/g, '−').replace(/&#8722;/g, '−')
  .replace(/&amp;/g, '&').trim();

/* Inhalt des ersten Elements mit diesem Attribut (ohne Verschachtelung). */
function byAttr(attr) {
  const m = html.match(new RegExp(`<[a-z]+[^>]*\\s${attr}(?=[\\s>=])[^>]*>([^<]*)<`));
  return m ? text(m[1]) : null;
}
function valueOf(field) {
  const m = html.match(new RegExp(`<input[^>]*data-itn-field="${field}"[^>]*>`));
  const v = m && m[0].match(/\svalue="([^"]*)"/);
  return v ? v[1] : null;
}

if (html) {
  /* Vorbelegung der Felder: das Beispiel, das vorgerendert ist. */
  eq('Seite: Feld Dein ITN', valueOf('own'), '7,512');
  eq('Seite: Feld Gegenüber', valueOf('opponent'), '7,180');

  const own = itnParse(valueOf('own') || '');
  const opp = itnParse(valueOf('opponent') || '');
  if (own === null || opp === null) {
    errors.push('Seite: Vorbelegung nicht lesbar');
  } else {
    const r = itnSingles(own, opp, false, true, true);
    eq('Seite: Sieg', byAttr('data-itn-win'), r.winAfterText);
    eq('Seite: Sieg Änderung', byAttr('data-itn-win-change'), r.winChangeText);
    eq('Seite: Niederlage', byAttr('data-itn-loss'), r.lossAfterText);
    eq('Seite: Niederlage Änderung', byAttr('data-itn-loss-change'), r.lossChangeText);
    const weight = byAttr('data-itn-weight') || '';
    checks += 1;
    if (!weight.includes(`${r.weightPercent} %`)) {
      errors.push(`Seite: Gewichtung ${JSON.stringify(weight)} nennt nicht ${r.weightPercent} %`);
    }
  }

  /* Beispieltabelle: jede Zeile aus ihren eigenen Daten nachrechnen. */
  const rows = [...html.matchAll(/<tr[^>]*data-itn-example[^>]*>[\s\S]*?<\/tr>/g)].map((m) => m[0]);
  eq('Seite: Zeilen der Beispieltabelle', rows.length, 3);
  for (const row of rows) {
    const winner = Number((row.match(/data-winner="([^"]+)"/) || [])[1]);
    const loser = Number((row.match(/data-loser="([^"]+)"/) || [])[1]);
    const shown = text((row.match(/data-itn-example-change[^>]*>([^<]*)</) || [, ''])[1]);
    if (!Number.isFinite(winner) || !Number.isFinite(loser)) {
      errors.push(`Seite: Beispielzeile ohne data-winner/data-loser: ${row.slice(0, 80)}`);
      continue;
    }
    eq(`Seite: Beispiel ${winner} schlägt ${loser}`, shown, delta(winner, loser));
  }
}

console.log(`${checks} ITN-Prüfungen`);
for (const e of errors) { console.log('FEHLER', e); }
console.log(errors.length ? `${errors.length} Fehler` : 'OK');
process.exit(errors.length ? 1 : 0);
