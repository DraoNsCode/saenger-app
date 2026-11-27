// Prüft die Hilfen für „Chorlieder üben“ ohne Netz: Suche in der Liste und Fehlermeldungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtere, meldung, KontoFehler, MELDUNGEN } from '../js/konto.js';

const LISTE = [
  { id: 1, sprache: 'D', kennung: 'D 47', nummer: 47, titel: 'Der Herr ist mein Hirte' },
  { id: 2, sprache: 'D', kennung: 'D 4', nummer: 4, titel: 'Vater, erhör uns' },
  { id: 3, sprache: 'R', kennung: 'R 47', nummer: 47, titel: 'Отче наш' },
];

test('Suche nach Nummer, Kennung, Titel und Sprache', () => {
  assert.deepEqual(filtere(LISTE, '47').map((l) => l.id), [1, 3]);
  assert.deepEqual(filtere(LISTE, '47', 'R').map((l) => l.id), [3]);
  assert.deepEqual(filtere(LISTE, 'd 47').map((l) => l.id), [1]);
  assert.deepEqual(filtere(LISTE, 'hirte').map((l) => l.id), [1]);
  assert.deepEqual(filtere(LISTE, 'отче').map((l) => l.id), [3]);
  assert.equal(filtere(LISTE, '').length, 3);
});

test('Jede Fehlerart hat eine Meldung auf Deutsch', () => {
  for (const art of ['invalid_credentials', 'code', 'vorhanden', 'passwort', 'email', 'anmelden', 'nicht-erreichbar', 'netz']) {
    assert.equal(meldung(new KontoFehler(art)), MELDUNGEN[art]);
  }
  assert.equal(meldung(new KontoFehler('unbekannt')), MELDUNGEN.fehler);
});
