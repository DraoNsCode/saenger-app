// Prüft Etappe 11 „Feinheiten im Rhythmus“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synkopenTakt, synkope, schlagGruppen, GRUPPEN } from '../js/uebungen/rhythmus-fein.js';
import { zaehlSilbe } from '../js/uebungen/hilfen.js';

test('Synkopen-Takte: voll, Synkope beginnt auf „und“', () => {
  for (const schlaege of [3, 4])
    for (let n = 0; n < 300; n++) {
      const t = synkopenTakt(schlaege, schlaege === 4 && n % 2 ? 2 : 1);
      assert.equal(t.reduce((s, x) => s + x.d, 0), schlaege);
      let pos = 0;
      for (const x of t) {
        if (x.synkope) assert.ok(!Number.isInteger(pos), 'Synkope auf einem Schlag');
        pos += x.d;
      }
    }
});

test('Synkopen: Lösung ist ein „und“', () => {
  for (const stufe of ['leicht', 'schwer'])
    for (let n = 0; n < 300; n++) {
      const a = synkope.neu(stufe, { stimme: 'S' });
      assert.equal(a.loesung, zaehlSilbe(a.ziel.beginn));
      assert.ok(a.loesung.endsWith('und'));
    }
});

test('Triolen und Sechzehntel: farbiger Schlag hat die gefragte Zahl Töne', () => {
  assert.equal(Object.keys(GRUPPEN).length, 4);
  for (let n = 0; n < 300; n++) {
    const a = schlagGruppen.neu('leicht', { stimme: 'S' });
    assert.equal(String(a.gruppen[a.schlag]), a.loesung);
  }
});
