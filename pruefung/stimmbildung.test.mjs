// Prüft den Übe-Teil „Besser singen“ ohne Browser: Daten, Noten, Begleitung je Stimme, Abläufe,
// und dass inhalt/stimmbildung.md zu js/ueben/stimmbildung.js passt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { THEMEN, UEBUNGEN, ERKLAERUNGEN, ABLAEUFE } from '../js/ueben/stimmbildung.js';
import { setzeAbcjs, notenAus, plane, tonumfang } from '../js/ueben/spieler.js';
import { STIMMEN, midi } from '../js/musik.js';
import { stimmbildungMarkdown } from './stimmbildung-md.mjs';
import { ablaufAuswahl } from '../js/views/ueben.js';

// abcjs aus vendor/ laden (die Datei ist für den Browser gebaut)
const quelle = readFileSync(new URL('../vendor/abcjs-basic-min.js', import.meta.url), 'utf8');
const modul = { exports: {} };
new Function('module', 'exports', quelle)(modul, modul.exports);
const ABCJS = modul.exports;
setzeAbcjs(ABCJS);

const ARTEN = new Set(['keine', 'klicks', 'ton', 'muster', 'halteton', 'anfangston']);
const themen = new Set(THEMEN.map((t) => t.id));

test('inhalt/stimmbildung.md ist aus js/ueben/stimmbildung.js erzeugt (sonst: node pruefung/stimmbildung-md.mjs)', () => {
  const datei = readFileSync(new URL('../inhalt/stimmbildung.md', import.meta.url), 'utf8');
  assert.equal(datei, stimmbildungMarkdown());
});

test('Übungsliste nach ENTSCHEIDUNGEN.md (27.11.2026): 18 Übungen, mit Lippenflattern und Strohhalm', () => {
  assert.equal(UEBUNGEN.length, 18);
  assert.ok(UEBUNGEN.find((u) => u.id === 'flattern'));
  assert.ok(UEBUNGEN.find((u) => u.id === 'strohhalm'));
  assert.equal(new Set(UEBUNGEN.map((u) => u.id)).size, 18, 'ids doppelt');
});

for (const u of UEBUNGEN) {
  test(`${u.id}: Aufbau`, () => {
    assert.ok(themen.has(u.thema), 'Thema fehlt');
    for (const f of ['titel', 'quelle', 'wozu', 'gelingt', 'fehler', 'hilft']) assert.ok(u[f], `${f} fehlt`);
    assert.ok(u.schritte?.length >= 2, 'zu wenige Schritte');
    assert.ok(ARTEN.has(u.begleitung.art), 'Begleitung unbekannt');
    for (const v of u.varianten || []) {
      assert.ok(v.name && v.text, 'Variante ohne Name oder Text');
      if (v.begleitung) assert.ok(ARTEN.has(v.begleitung.art), `Begleitung von „${v.name}“ unbekannt`);
    }
  });

  const faelle = [{ name: 'Grundübung', b: u.begleitung, abc: u.abc }];
  for (const v of u.varianten || []) faelle.push({ name: v.name, b: v.begleitung || u.begleitung, abc: v.abc || (v.begleitung && !v.abc ? null : u.abc) });

  for (const f of faelle) {
    test(`${u.id}, ${f.name}: Noten und Begleitung`, () => {
      if (['muster', 'halteton'].includes(f.b.art)) assert.ok(f.abc, 'Muster ohne Noten');
      if (f.abc) {
        const tune = ABCJS.parseOnly(f.abc)[0];
        assert.deepEqual(tune.warnings || [], [], 'abcjs meldet Fehler');
        const n = notenAus(f.abc);
        assert.ok(n.stimmen[0].some((x) => x.midi != null), 'keine Töne');
        if (f.b.art === 'halteton') assert.equal(n.stimmen.length, 2, 'Halteton braucht zwei Stimmen');
      }
      for (const stimme of Object.keys(STIMMEN)) {
        if (f.b.art === 'keine' || f.b.art === 'klicks') continue;
        const p = plane(f.b, stimme, f.abc ? notenAus(f.abc).stimmen[0].find((x) => x.midi != null).midi : 65);
        assert.ok(p.length > 0, 'kein Durchgang');
        if (f.b.art === 'muster') assert.ok(p[0].zuhoeren && !p[1].zuhoeren, 'erster Durchgang zum Zuhören fehlt');
        if (f.b.tonarten && f.b.tonarten[1] >= f.b.tonarten[0] && f.b.art !== 'anfangston') {
          const gesungen = p.filter((x) => !x.zuhoeren);
          assert.equal(gesungen[0].verschiebung, gesungen[gesungen.length - 1].verschiebung, 'endet nicht am Anfang');
        }
        // Tonraum: höchstens drei Halbtöne über oder unter dem, was die Stimme im Laienchor meist singt
        if (f.b.art !== 'anfangston' && !(f.b.tonarten && f.b.tonarten[1] < f.b.tonarten[0])) {
          const { tief, hoch } = tonumfang(f.b, f.abc, stimme);
          const [lo, hi] = STIMMEN[stimme].bereich.map(midi);
          assert.ok(hoch <= hi + 3, `${stimme}: zu hoch (${hoch} > ${hi + 3})`);
          assert.ok(tief >= lo - 3, `${stimme}: zu tief (${tief} < ${lo - 3})`);
        }
      }
    });
  }
}

test('Erklärungen verweisen auf vorhandene Übungen', () => {
  assert.equal(ERKLAERUNGEN.length, 7);
  for (const e of ERKLAERUNGEN) {
    assert.ok(e.titel && e.kurz && e.absaetze.length, e.id);
    for (const id of e.passtZu || []) assert.ok(UEBUNGEN.find((u) => u.id === id), `${e.id}: ${id} fehlt`);
  }
});

test('Abläufe: alle Schritte vorhanden, Strohhalm nur mit Einstellung', () => {
  assert.deepEqual(ABLAEUFE.map((a) => a.id), ['einsingen', 'nachher']);
  for (const a of ABLAEUFE) {
    for (const s of a.schritte) {
      for (const w of s.wahl) {
        const u = UEBUNGEN.find((x) => x.id === w.uebung);
        assert.ok(u, `${a.id}: ${w.uebung} fehlt`);
        if (w.variante != null) assert.ok(u.varianten[w.variante], `${a.id}: Variante ${w.variante} von ${w.uebung} fehlt`);
      }
    }
    for (let n = 0; n < 6; n++) {
      assert.ok(!ablaufAuswahl(a, n, false).some((s) => s.strohhalm), 'Strohhalm ohne Einstellung');
      assert.ok(ablaufAuswahl(a, n, false).length >= 1);
    }
  }
  assert.equal(ablaufAuswahl(ABLAEUFE[0], 0, true).length, 5);
  assert.ok(ablaufAuswahl(ABLAEUFE[0], 2, true).some((s) => s.uebung === 'strohhalm'), 'Strohhalm kommt reihum nie vor');
});
