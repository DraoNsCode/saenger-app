// Prüft Etappe 10 „Vorzeichen und Tonarten“, ohne Browser. Vorschlag von Claude vom 26.11.2026 (LERNWEG.md).
// In Moll ist der Moll-Grundton die 1 (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KREUZ, BE, TONARTEN, vorzeichen, tonart } from '../js/uebungen/vorzeichen.js';

const HALBTON = { c: 0, cis: 1, des: 1, d: 2, dis: 3, es: 3, e: 4, f: 5, fis: 6, ges: 6, g: 7, gis: 8, as: 8, a: 9, ais: 10, b: 10, h: 11 };

test('Namen mit Vorzeichen: Kreuz einen Halbton höher, Be einen tiefer; es, as, b', () => {
  for (const [g, n] of Object.entries(KREUZ)) assert.equal((HALBTON[n] - HALBTON[g] + 12) % 12, 1, n);
  for (const [g, n] of Object.entries(BE)) assert.equal((HALBTON[g] - HALBTON[n] + 12) % 12, 1, n);
  assert.equal(BE.e, 'es');
  assert.equal(BE.a, 'as');
  assert.equal(BE.h, 'b');
});

test('Tonarten: Moll-1 liegt drei Halbtöne unter der Dur-1', () => {
  for (const t of TONARTEN) assert.equal((HALBTON[t.dur] - HALBTON[t.moll] + 12) % 12, 3, t.abc);
});

test('Die 1 finden: Lösung unter den Antworten, Antworten verschieden', () => {
  for (const stufe of ['leicht', 'schwer'])
    for (let n = 0; n < 300; n++) {
      const a = tonart.neu(stufe, { stimme: 'S' });
      assert.equal(a.loesung, a.moll ? a.tonart.moll : a.tonart.dur);
      if (stufe === 'leicht') assert.ok(a.tonart.zahl <= 3 && !a.moll);
    }
});

test('Gilt das Vorzeichen noch: im Takt ja, nach Auflösung oder Taktstrich nein', () => {
  for (let n = 0; n < 300; n++) {
    const a = vorzeichen.neu('schwer', { stimme: 'A' });
    const mitZeichen = a.loesung.length > 1 || a.loesung === 'b';
    assert.equal(mitZeichen, a.fall === 'gilt', `${a.fall}: ${a.loesung}`);
  }
});
