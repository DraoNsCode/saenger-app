// Prüft Etappe 7 „Intervalle“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INTERVALL, intervallLesen, intervallHoeren } from '../js/uebungen/intervalle.js';
import { halbtoeneBis } from '../js/uebungen/ziffern.js';

test('Intervallnamen von der Sekunde bis zur Oktave', () => {
  assert.deepEqual(Object.values(INTERVALL), ['Sekunde', 'Terz', 'Quarte', 'Quinte', 'Sexte', 'Septime', 'Oktave']);
});

test('Intervalle lesen: Lösung passt zur Größe, leicht nur bis zur Quinte', () => {
  for (const stimme of ['S', 'A', 'T', 'B'])
    for (const stufe of ['leicht', 'schwer'])
      for (let n = 0; n < 300; n++) {
        const a = intervallLesen.neu(stufe, { stimme });
        assert.equal(a.loesung, String(a.groesse));
        if (stufe === 'leicht') assert.ok(a.groesse <= 4);
        assert.ok(a.warum.includes(`${a.groesse + 1} Töne`));
      }
});

test('Intervalle hören: Dur-Abstände ab der 1, Oktave sind 12 Halbtöne', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(halbtoeneBis), [2, 4, 5, 7, 9, 11]);
  for (let n = 0; n < 300; n++) {
    const a = intervallHoeren.neu('leicht', { stimme: 'B' });
    assert.ok(['2', '4', '7'].includes(a.loesung));
  }
});
