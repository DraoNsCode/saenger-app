// Prüft Etappe 3 „Notennamen“, ohne Browser (ENTSCHEIDUNGEN.md, „Etappe 3“, 26.11.2026).
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STIMMEN, notenname, abcTon } from '../js/musik.js';
import { bereichPos, bereichImSchluessel, diaAusPosIn, zaehlText, zaehlHilfe, ortText, WEIT, NAMEN } from '../js/uebungen/namen.js';
import notennameUebung, { WOERTER } from '../js/uebungen/notenname.js';
import findeNote from '../js/uebungen/finde-note.js';
import weiterzaehlen from '../js/uebungen/weiterzaehlen.js';
import klavier, { tasten, TASTEN_ORT, WEISSE } from '../js/uebungen/klavier.js';

const STIMMLISTE = ['S', 'A', 'T', 'B'];
const DURCHLAEUFE = 300;

// Claudes Wahl, von Daniel überlassen (ENTSCHEIDUNGEN.md, „Etappe 3“). Ändert Daniel sie, hier im selben Schritt anpassen.
test('Tonraum je Stimme wie entschieden', () => {
  const ist = Object.fromEntries(STIMMLISTE.map((s) => [s, STIMMEN[s].bereich.map(abcTon).join(' bis ')]));
  assert.deepEqual(ist, { S: 'C bis g', A: 'A, bis d', T: 'C, bis F', B: 'F,, bis C' });
});

test('Notennamen: c d e f g a h, dann wieder c', () => {
  assert.deepEqual([28, 29, 30, 31, 32, 33, 34, 35].map(notenname), ['c', 'd', 'e', 'f', 'g', 'a', 'h', 'c']);
  assert.equal(notenname(27), 'h');
});

test('Tonraum jeder Stimme enthält alle sieben Namen', () => {
  for (const s of STIMMLISTE) {
    const [von, bis] = bereichPos(s);
    const namen = new Set();
    for (let p = von; p <= bis; p++) namen.add(notenname(diaAusPosIn(STIMMEN[s].schluessel, p)));
    assert.equal(namen.size, 7, `Stimme ${s}`);
  }
});

test('Merknoten-Erklärung nennt den richtigen Namen und zählt richtig', () => {
  for (const sch of ['treble', 'bass']) {
    for (let p = WEIT[0]; p <= WEIT[1]; p++) {
      const name = notenname(diaAusPosIn(sch, p));
      const t = zaehlText(sch, p);
      assert.ok(t.includes(`das ${name}.`), `${sch} ${p}: ${t}`);
      const hilfe = zaehlHilfe(sch, p);
      if (hilfe.startsWith('Zähl')) assert.ok(hilfe.endsWith(`, ${name}.`), `${sch} ${p}: ${hilfe}`);
      assert.ok(ortText(p).length > 0);
    }
  }
});

test('Wie heißt die Note: leicht bleibt im Tonraum der Stimme', () => {
  for (const s of STIMMLISTE) {
    const [von, bis] = bereichPos(s);
    for (let n = 0; n < DURCHLAEUFE; n++) {
      const a = notennameUebung.neu('leicht', { stimme: s });
      assert.ok(a.pos >= von && a.pos <= bis, `Stimme ${s}: Position ${a.pos}`);
      assert.equal(a.loesung, notenname(diaAusPosIn(STIMMEN[s].schluessel, a.pos)));
    }
  }
});

test('Notenwörter: nur Buchstaben aus c d e f g a h', () => {
  for (const w of WOERTER) for (const b of w.toLowerCase()) assert.ok(NAMEN.includes(b), `${w}: ${b}`);
  assert.equal(new Set(WOERTER).size, WOERTER.length);
});

test('Finde die Note: richtige Note im Tonraum, Ablenkungen mit anderen Namen', () => {
  for (const s of STIMMLISTE) {
    for (const stufe of ['leicht', 'schwer']) {
      const sch = stufe === 'schwer' ? (STIMMEN[s].schluessel === 'treble' ? 'bass' : 'treble') : STIMMEN[s].schluessel;
      const [von, bis] = stufe === 'schwer' ? bereichImSchluessel(sch) : bereichPos(s);
      for (let n = 0; n < DURCHLAEUFE; n++) {
        const a = findeNote.neu(stufe, { stimme: s });
        assert.ok(a.pos >= von && a.pos <= bis, `Stimme ${s}, ${stufe}: Position ${a.pos}`);
        const namen = a.positionen.map((p) => notenname(diaAusPosIn(sch, p)));
        assert.equal(new Set(namen).size, namen.length, `Stimme ${s}, ${stufe}: zwei Bilder mit demselben Namen`);
      }
    }
  }
});

test('Weiterzählen: Lösung ist der Name der zweiten Note, beide im Tonraum', () => {
  for (const s of STIMMLISTE) {
    const [von, bis] = bereichPos(s);
    const sch = STIMMEN[s].schluessel;
    for (const stufe of ['leicht', 'schwer']) {
      for (let n = 0; n < DURCHLAEUFE; n++) {
        const a = weiterzaehlen.neu(stufe, { stimme: s });
        const [p1, p2] = a.pos;
        assert.ok(p1 >= von && p1 <= bis && p2 >= von && p2 <= bis, `Stimme ${s}: ${p1}, ${p2}`);
        const abstand = Math.abs(p2 - p1);
        assert.ok(stufe === 'leicht' ? abstand === 1 : abstand >= 2 && abstand <= 4, `Abstand ${abstand} in ${stufe}`);
        assert.equal(a.loesung, notenname(diaAusPosIn(sch, p2)));
      }
    }
  }
});

test('Klavier: jede Klaviatur hat alle sieben Namen und das Ziel', () => {
  for (const name of NAMEN) assert.ok(TASTEN_ORT[name], `Erklärung für ${name} fehlt`);
  for (let start = 14; start < 42; start++) {
    const reihe = tasten(start);
    assert.equal(reihe.length, WEISSE);
    assert.equal(new Set(reihe.map((t) => t.name)).size, 7);
    // Zwischen e und f sowie h und c liegt keine schwarze Taste
    for (const t of reihe) if (t.name === 'e' || t.name === 'h') assert.equal(t.schwarzDanach, false);
  }
  for (const s of STIMMLISTE) {
    for (const stufe of ['leicht', 'schwer']) {
      for (let n = 0; n < DURCHLAEUFE; n++) {
        const a = klavier.neu(stufe, { stimme: s });
        assert.ok(NAMEN.includes(a.ziel));
        assert.ok(a.reihe.some((t) => t.name === a.ziel));
      }
    }
  }
});

// Rückmeldungen im Tonraum der eigenen Stimme zählen nur von Merknoten aus, die die Erklärung einführt
// (g bzw. f und die c nahe am System), nicht von den c auf der zweiten Hilfslinie.
test('Im Tonraum der Stimme nur eingeführte Merknoten', () => {
  for (const s of STIMMLISTE) {
    const [von, bis] = bereichPos(s);
    for (let p = von; p <= bis; p++) {
      const t = zaehlHilfe(STIMMEN[s].schluessel, p);
      assert.ok(!t.includes('zweiten Hilfslinie'), `Stimme ${s}, Position ${p}: ${t}`);
    }
  }
});
