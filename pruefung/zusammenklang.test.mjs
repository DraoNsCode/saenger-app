// Prüft Etappe 9 „Zusammenklang“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { durMoll, dreiklang, einsatzton } from '../js/uebungen/zusammenklang.js';

test('Dur oder Moll: Lösung passt', () => {
  for (let n = 0; n < 200; n++) {
    const a = durMoll.neu('leicht', { stimme: 'S' });
    assert.equal(a.loesung, a.dur ? 'dur' : 'moll');
  }
});

test('Dreiklang: die Töne sind jeweils eine Terz voneinander entfernt', () => {
  const namen = ['c', 'd', 'e', 'f', 'g', 'a', 'h'];
  for (let n = 0; n < 300; n++) {
    const a = dreiklang.neu('schwer', { stimme: 'T' });
    const [x, y, z] = a.loesung.split(' – ').map((b) => namen.indexOf(b));
    assert.equal((y - x + 7) % 7, 2, a.loesung);
    assert.equal((z - y + 7) % 7, 2, a.loesung);
  }
});

test('Einsatzton: 1, 3 oder 5', () => {
  for (const stufe of ['leicht', 'schwer'])
    for (let n = 0; n < 200; n++) {
      const a = einsatzton.neu(stufe, { stimme: 'B' });
      assert.equal(a.loesung, ['1', '3', '5'][a.stufeIndex]);
    }
});
