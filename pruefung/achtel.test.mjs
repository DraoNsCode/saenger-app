// Prüft Etappe 4 „Achtel und Auftakt“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { achtelTakt, abcAchtel, zaehlSilbe, silbenOptionen } from '../js/uebungen/hilfen.js';
import mitzaehlen from '../js/uebungen/mitzaehlen.js';
import auftakt from '../js/uebungen/auftakt.js';

const DURCHLAEUFE = 400;

test('Achtel-Takte: voll, keine Note über eine Schlaggrenze (außer Halben), genug Achtel', () => {
  for (const schlaege of [3, 4]) {
    for (const opt of [{}, { achtelPausen: true, pausen: 1, mindAchtel: 2 }, { mindAchtel: 0 }]) {
      for (let n = 0; n < DURCHLAEUFE; n++) {
        const t = achtelTakt(schlaege, opt);
        let pos = 0;
        let achtelSchlaege = new Set();
        for (const x of t) {
          if (x.d === 0.5) achtelSchlaege.add(Math.floor(pos));
          if (x.d === 2) assert.ok(schlaege === 3 || pos % 2 === 0, `Halbe auf ${pos + 1} im ${schlaege}/4-Takt`);
          else assert.equal(Math.floor(pos), Math.floor(pos + x.d - 0.001), `Note über Schlaggrenze bei ${pos}`);
          pos += x.d;
        }
        assert.equal(pos, schlaege);
        assert.ok(achtelSchlaege.size >= (opt.mindAchtel ?? 1));
        assert.ok(t.some((x) => !x.pause), 'nur Pausen');
        if (!opt.achtelPausen) assert.ok(!t.some((x) => x.pause && x.d === 0.5), 'Achtelpause ohne achtelPausen');
      }
    }
  }
});

test('Achtel im selben Schlag sind gebalkt, über den Schlag hinaus nicht', () => {
  const t = [{ d: 0.5, pause: false }, { d: 0.5, pause: false }, { d: 0.5, pause: false }, { d: 0.5, pause: false }, { d: 2, pause: false }];
  assert.equal(abcAchtel([t]), 'B/B/ B/B/ B2 |]');
});

test('Zählsilben', () => {
  assert.deepEqual([0, 0.5, 1, 3.5].map(zaehlSilbe), ['1', '1 und', '2', '4 und']);
  assert.equal(silbenOptionen(3).length, 6);
});

test('Mitzählen: Lösung ist die Zählzeit der farbigen Note', () => {
  for (const stufe of ['leicht', 'schwer']) {
    for (let n = 0; n < DURCHLAEUFE; n++) {
      const a = mitzaehlen.neu(stufe, { stimme: 'A' });
      assert.ok(!a.takt[a.ziel.i].pause, 'Ziel ist eine Pause');
      const beginn = a.takt.slice(0, a.ziel.i).reduce((s, x) => s + x.d, 0);
      assert.equal(a.loesung, zaehlSilbe(beginn));
    }
  }
});

test('Auftakt: Lösung passt zur Länge, leicht ohne „und“', () => {
  for (const stufe of ['leicht', 'schwer']) {
    for (let n = 0; n < DURCHLAEUFE; n++) {
      const a = auftakt.neu(stufe, { stimme: 'T' });
      assert.equal(a.loesung, zaehlSilbe(a.schlaege - a.laenge));
      if (stufe === 'leicht') assert.ok(!a.loesung.includes('und'));
      assert.ok(a.laenge < a.schlaege, 'Auftakt so lang wie ein ganzer Takt');
    }
  }
});
