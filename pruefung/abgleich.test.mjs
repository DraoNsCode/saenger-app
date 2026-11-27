// Prüft das Zusammenführen des Fortschritts (Gerät und Konto) ohne Netz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mische } from '../js/abgleich.js';

const geraet = {
  stimme: 'T',
  stationen: { a: { geschafft: true, beste: 7, gesamt: 8, versuche: 2 }, b: { geschafft: false, beste: 4, gesamt: 8, versuche: 1 } },
  runden: { notenbild: { leicht: 3, schwer: 1 } },
  uebungen: { x: { leicht: { runden: 2, richtig: 14, aufgaben: 16 } } },
  tage: ['2026-11-20', '2026-11-27'],
  fehlerfrei: 1,
  abzeichen: { erste: '2026-11-21' },
  gesehen: { x: true },
  einstellungen: { lautstaerke: 0.5, strohhalm: false },
  ueben: { ablauf: { einsingen: 3 } },
};
const konto = {
  stimme: 'T',
  stationen: { b: { geschafft: true, beste: 6, gesamt: 8, versuche: 3 }, c: { geschafft: true, beste: 8, gesamt: 8, versuche: 1 } },
  runden: { notenbild: { leicht: 5 } },
  uebungen: { x: { leicht: { runden: 5, richtig: 36, aufgaben: 40 } }, y: { schwer: { runden: 1, richtig: 7, aufgaben: 8 } } },
  tage: ['2026-11-19', '2026-11-20'],
  fehlerfrei: 4,
  abzeichen: { erste: '2026-11-19', zweite: '2026-11-22' },
  gesehen: { y: true },
  einstellungen: { lautstaerke: 0.9, strohhalm: true },
  ueben: { ablauf: { einsingen: 1, nachher: 2 } },
};

test('Nichts Geschafftes geht verloren', () => {
  const m = mische(geraet, konto);
  assert.deepEqual(Object.keys(m.stationen).sort(), ['a', 'b', 'c']);
  assert.equal(m.stationen.b.geschafft, true);
  assert.equal(m.stationen.b.beste, 6);
  assert.equal(m.stationen.b.versuche, 3);
  assert.equal(m.runden.notenbild.leicht, 5);
  assert.equal(m.runden.notenbild.schwer, 1);
  assert.equal(m.uebungen.x.leicht.runden, 5);
  assert.ok(m.uebungen.y);
  assert.deepEqual(m.tage, ['2026-11-19', '2026-11-20', '2026-11-27']);
  assert.equal(m.fehlerfrei, 4);
  assert.deepEqual(m.abzeichen, { erste: '2026-11-19', zweite: '2026-11-22' });
  assert.deepEqual(m.gesehen, { x: true, y: true });
  assert.deepEqual(m.ueben.ablauf, { einsingen: 3, nachher: 2 });
});

test('Einstellungen: dieses Gerät, auf einem neuen Gerät die aus dem Konto', () => {
  assert.equal(mische(geraet, konto).einstellungen.lautstaerke, 0.5);
  const neu = { stimme: null, stationen: {}, einstellungen: { lautstaerke: 0.8 } };
  const m = mische(neu, konto);
  assert.equal(m.einstellungen.lautstaerke, 0.9);
  assert.equal(m.einstellungen.strohhalm, true);
  assert.equal(m.stimme, 'T');
});

test('Zweimal zusammenführen ändert nichts mehr', () => {
  const einmal = mische(geraet, konto);
  assert.deepEqual(mische(einmal, konto), einmal);
  assert.deepEqual(mische(geraet, null), geraet);
});
