// Prüft den Lernweg und das Speichern, ohne Browser.
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Ersatz für den Speicher des Browsers, bevor speicher.js geladen wird
const ablage = new Map();
globalThis.localStorage = {
  getItem: (k) => (ablage.has(k) ? ablage.get(k) : null),
  setItem: (k, v) => ablage.set(k, String(v)),
  removeItem: (k) => ablage.delete(k),
};

const { THEMEN, STUFEN, noetigeRichtige, alleStationen } = await import('../js/lernweg.js');
const { UEBUNGEN } = await import('../js/uebungen/index.js');
const { ergebnisErfassen, zuruecksetzen } = await import('../js/speicher.js');

test('Stationen: eindeutige ids, vorhandene Übungen und Stufen', () => {
  const ids = new Set();
  for (const s of alleStationen()) {
    assert.ok(!ids.has(s.id), `Station ${s.id} gibt es zweimal`);
    ids.add(s.id);
    if (s.mischung) {
      assert.equal(s.stufe, 'gemischt', `${s.id}: eine gemischte Station hat die Stufe „gemischt“`);
      continue;
    }
    const u = UEBUNGEN[s.uebung];
    assert.ok(u, `${s.id}: Übung „${s.uebung}“ gibt es nicht`);
    assert.ok(STUFEN.includes(s.stufe) && u.stufen[s.stufe], `${s.id}: Stufe „${s.stufe}“ gibt es bei „${s.uebung}“ nicht`);
  }
});

test('Themen: eindeutige ids', () => {
  const ids = THEMEN.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

// Entscheidungen vom 19.11.2026 (ENTSCHEIDUNGEN.md): Eine Runde gilt ab 6 von 8 richtigen als geschafft,
// bei Runden mit 4 Aufgaben müssen alle 4 richtig sein.
test('Runde: 6 von 8, bei 4 Aufgaben alle 4', () => {
  assert.equal(noetigeRichtige(8), 6);
  assert.equal(noetigeRichtige(4), 4);
  const station = alleStationen()[0];
  const runde = { themaId: station.themaId, uebungId: station.uebung, stufe: station.stufe, stationId: station.id, gesamt: 8 };

  zuruecksetzen();
  assert.equal(ergebnisErfassen({ ...runde, richtig: 5 }).geschafft, false, '5 von 8 darf nicht reichen');
  assert.equal(ergebnisErfassen({ ...runde, richtig: 6 }).geschafft, true, '6 von 8 muss reichen');
  assert.equal(ergebnisErfassen({ ...runde, gesamt: 4, richtig: 3 }).geschafft, false, '3 von 4 darf nicht reichen');
  assert.equal(ergebnisErfassen({ ...runde, gesamt: 4, richtig: 4 }).geschafft, true, '4 von 4 muss reichen');
  zuruecksetzen();
});

// Für andere Rundenlängen ist nichts entschieden. Braucht eine Übung eine andere Zahl, zuerst Daniel fragen.
test('Rundenlängen: nur 8 oder 4 Aufgaben', () => {
  for (const [id, u] of Object.entries(UEBUNGEN)) {
    assert.ok([8, 4].includes(u.aufgaben), `${id} hat ${u.aufgaben} Aufgaben; dafür ist keine Grenze entschieden`);
  }
});
