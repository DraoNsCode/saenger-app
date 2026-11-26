// Prüft Etappe 8 „Punktierung und Haltebogen“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// 2/2 und 6/8 werden im Chor in zwei Schlägen gezählt (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { punktTakt, klingend, abcAchtel } from '../js/uebungen/hilfen.js';
import punktierung, { dauerText } from '../js/uebungen/punktierung.js';
import zweiSchlaege, { TAKTARTEN } from '../js/uebungen/zwei-schlaege.js';

test('Punktierte Takte: voll, mit Punkt, Haltebogen nur zwischen zwei Noten', () => {
  for (const schlaege of [3, 4])
    for (let n = 0; n < 500; n++) {
      const t = punktTakt(schlaege, { bogen: n % 2 === 0 });
      assert.equal(t.reduce((s, x) => s + x.d, 0), schlaege);
      assert.ok(t.some((x) => x.d === 1.5 || x.d === 3));
      t.forEach((x, i) => x.bogen && assert.ok(i < t.length - 1));
    }
});

test('Haltebogen: gebundene Noten klingen als ein Ton', () => {
  const t = [{ d: 1, pause: false, bogen: true }, { d: 1.5, pause: false }, { d: 0.5, pause: false }, { d: 1, pause: false }];
  assert.deepEqual(klingend([t], 4).map((x) => [x.beginn, x.d]), [[0, 2.5], [2.5, 0.5], [3, 1]]);
  assert.equal(abcAchtel([t]), 'B- B3/2 B/ B |]');
});

test('Punkt und Haltebogen: Dauer stimmt', () => {
  assert.equal(dauerText(1.5), '1½ Schläge');
  for (let n = 0; n < 500; n++) {
    const a = punktierung.neu('leicht', { stimme: 'S' });
    const z = a.ziel;
    const dauer = z.n.bogen ? z.n.d + a.takt[z.i + 1].d : z.n.d;
    assert.equal(a.loesung, dauerText(dauer));
    assert.ok(a.optionen.some((o) => o.wert === a.loesung));
  }
});

test('Wie viele Schläge: 2/2 und 6/8 in zwei', () => {
  assert.equal(TAKTARTEN['2/2'].schlaege, 2);
  assert.equal(TAKTARTEN['6/8'].schlaege, 2);
  for (const [art, t] of Object.entries(TAKTARTEN)) {
    const grund = art === '6/8' ? 6 : art === '2/2' ? 4 : Number(art[0]);
    for (const m of t.muster) assert.equal(m.reduce((s, x) => s + x, 0), grund, `${art}: ${m}`);
  }
  for (let n = 0; n < 300; n++) {
    const a = zweiSchlaege.neu('leicht', { stimme: 'B' });
    assert.equal(a.loesung, String(TAKTARTEN[a.art].schlaege));
  }
});
