// Prüft Etappe 6 „Zeichen im Notenbild“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import zeichen, { ZEICHEN, fuerSchluessel } from '../js/uebungen/zeichen.js';
import { ABLAEUFE } from '../js/uebungen/ablauf.js';
import strophen, { TEXTE } from '../js/uebungen/strophen.js';

test('Zeichen: jedes hat Bild, Satz und Bedeutung; leicht nur leichte', () => {
  for (const [id, z] of Object.entries(ZEICHEN)) assert.ok(z.abc && z.satz && z.bedeutung, id);
  for (let n = 0; n < 300; n++) assert.equal(ZEICHEN[zeichen.neu('leicht', { stimme: 'S' }).loesung].stufe, 'leicht');
});

test('Bassschlüssel: Verzierungen und Texte bleiben unverändert', () => {
  assert.equal(fuerSchluessel('!mf!C2 "^D.C. al Fine"c |1 G :|2 c', 'bass'), '!mf!C,2 "^D.C. al Fine"C |1 G, :|2 C');
});

test('Reihenfolgen: nur Takte, die es gibt; richtige Antwort nicht unter den falschen', () => {
  for (const a of ABLAEUFE) {
    const takte = [...a.abc.matchAll(/"_([A-D])"/g)].map((m) => m[1]);
    for (const r of [a.reihe, ...a.falsch]) for (const b of r.split(' ')) assert.ok(takte.includes(b), `${a.abc}: ${b}`);
    assert.ok(!a.falsch.includes(a.reihe));
    assert.equal(new Set(a.falsch).size, a.falsch.length);
  }
});

test('Strophen: Lösung ist die Silbe der gefragten Strophe, alle Strophen gleich lang', () => {
  for (const t of TEXTE) for (const v of t) assert.equal(v.length, t[0].length);
  for (const stufe of ['leicht', 'schwer'])
    for (let n = 0; n < 300; n++) {
      const a = strophen.neu(stufe, { stimme: 'T' });
      assert.equal(a.loesung, a.text[a.strophe][a.note]);
      assert.equal(a.text.length, stufe === 'leicht' ? 2 : 3);
      assert.equal(new Set(a.text.map((v) => v[a.note])).size, a.text.length, 'gleiche Silben unter der farbigen Note');
    }
});

// Bei den Klammern sieht man auch Wiederholungszeichen: deren Bedeutung darf dort keine falsche Antwort sein.
test('Zeichen: keine Ablenkung, die im Bild auch richtig wäre', () => {
  for (let n = 0; n < 2000; n++) {
    const a = zeichen.neu('schwer', { stimme: 'S' });
    if (a.loesung === 'volta') assert.ok(!a.optionen.some((o) => o.wert === 'wiederholung'));
  }
});
