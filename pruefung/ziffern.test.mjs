// Prüft Etappe 5 „Tonleiter und Ziffern“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Ziffern wie im Chor (ENTSCHEIDUNGEN.md, „Sprache des Chors“): Die obere 1 bleibt die 1.
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DUR, istHalbton, ziffer, halbtoeneBis } from '../js/uebungen/ziffern.js';
import { notenname, diaAusPosIn } from '../js/uebungen/namen.js';
import ganzHalbton from '../js/uebungen/ganz-halbton.js';
import tonleiter, { C_POS } from '../js/uebungen/tonleiter.js';
import zifferLesen from '../js/uebungen/ziffer-lesen.js';
import stufenHoeren from '../js/uebungen/stufen-hoeren.js';

const STIMMEN = ['S', 'A', 'T', 'B'];
const N = 300;

test('Dur-Tonleiter: Halbtöne zwischen 3–4 und 7–1, obere 1 bleibt 1', () => {
  assert.equal(DUR.reduce((s, x) => s + x, 0), 12);
  assert.deepEqual(DUR.map((x, i) => (x === 1 ? `${ziffer(i)}-${ziffer(i + 1)}` : null)).filter(Boolean), ['3-4', '7-1']);
  assert.equal(ziffer(7), '1');
  assert.equal(halbtoeneBis(4), 7);
});

test('Halbton nur bei e–f und h–c', () => {
  const namen = ['c', 'd', 'e', 'f', 'g', 'a', 'h'];
  const halb = namen.map((n, i) => istHalbton(n, namen[(i + 1) % 7]));
  assert.deepEqual(halb, [false, false, true, false, false, false, true]);
});

test('C-Dur beginnt in beiden Schlüsseln auf einem c', () => {
  for (const s of ['treble', 'bass']) assert.equal(notenname(diaAusPosIn(s, C_POS[s])), 'c');
});

test('Ganzton oder Halbton: Lösung passt zu den Namen', () => {
  for (const stimme of STIMMEN)
    for (const stufe of ['leicht', 'schwer'])
      for (let n = 0; n < N; n++) {
        const a = ganzHalbton.neu(stufe, { stimme });
        assert.equal(a.loesung, istHalbton(...a.namen) ? 'halb' : 'ganz');
      }
});

test('Tonleiter: Halbton genau bei den Schritten 3→4 und 7→1', () => {
  for (let n = 0; n < N; n++) {
    const a = tonleiter.neu('leicht', { stimme: 'B' });
    assert.equal(a.loesung === 'halb', a.schritt === 2 || a.schritt === 6);
  }
});

test('Welche Ziffer: c ist 1, das obere c wieder 1', () => {
  for (const stimme of STIMMEN)
    for (const stufe of ['leicht', 'schwer'])
      for (let n = 0; n < N; n++) {
        const a = zifferLesen.neu(stufe, { stimme });
        assert.equal(a.loesung, ziffer(a.stufeIndex));
        if (stufe === 'leicht') assert.ok(a.stufeIndex >= 1);
      }
});

test('Stufen hören: leicht nur 1, 3 und 5', () => {
  for (let n = 0; n < N; n++) {
    const a = stufenHoeren.neu('leicht', { stimme: 'A' });
    assert.ok(['1', '3', '5'].includes(a.loesung));
    assert.deepEqual(a.optionen.map((o) => o.wert), ['1', '3', '5']);
  }
});
