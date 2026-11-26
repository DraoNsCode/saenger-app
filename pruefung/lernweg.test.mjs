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

const { THEMEN, STUFEN, noetigeRichtige, alleStationen, noetigeStationen, freiwilligeZu, mischungsPaare, verfuegbar, uebungenImThema } =
  await import('../js/lernweg.js');
const { UEBUNGEN } = await import('../js/uebungen/index.js');
const { ergebnisErfassen, zuruecksetzen, naechsteStation, stationOffen, stationSichtbar, etappeGeschafft, etappeErreicht, fortschrittGesamt } =
  await import('../js/speicher.js');

const gebaut = THEMEN.filter(verfuegbar);

// Station mit einer geschafften Runde abschließen
function schaffe(s) {
  const gesamt = s.mischung ? 8 : UEBUNGEN[s.uebung].aufgaben;
  ergebnisErfassen({ themaId: s.themaId, uebungId: s.uebung || null, stufe: s.stufe, stationId: s.id, richtig: gesamt, gesamt });
}

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

// Entscheidungen vom 19.11.2026 (ENTSCHEIDUNGEN.md, „Der Weg als Klostergarten“ und „Stationen nach Inhalt“)

test('Stationen: jede Übung hat in ihrer Etappe genau eine nötige Station', () => {
  for (const t of gebaut) {
    for (const uid of uebungenImThema(t)) {
      const noetige = noetigeStationen(t).filter((s) => s.uebung === uid);
      assert.equal(noetige.length, 1, `${t.id}: „${uid}“ hat ${noetige.length} nötige Stationen`);
    }
  }
});

test('Stationen: jede freiwillige Station gehört zu einer nötigen derselben Übung, keine Stufe doppelt', () => {
  for (const t of gebaut) {
    const gesehen = new Set();
    for (const s of t.stationen.filter((x) => !x.mischung)) {
      const schluessel = `${s.uebung}/${s.stufe}`;
      assert.ok(!gesehen.has(schluessel), `${t.id}: ${schluessel} kommt zweimal vor`);
      gesehen.add(schluessel);
      if (s.freiwillig) assert.ok(noetigeStationen(t).some((n) => n.uebung === s.uebung), `${s.id}: keine nötige Station zur Übung`);
    }
  }
});

test('Stationen: jede Stufe einer Übung kommt im Leitfaden vor', () => {
  for (const t of gebaut) {
    for (const uid of uebungenImThema(t)) {
      for (const stufe of Object.keys(UEBUNGEN[uid].stufen)) {
        assert.ok(
          t.stationen.some((s) => s.uebung === uid && s.stufe === stufe),
          `${t.id}: „${uid}“ in der Stufe ${stufe} hat keine Station`
        );
      }
    }
  }
});

test('Abschluss: letzte Station jeder Etappe, nötig, mischt die nötigen Stationen', () => {
  for (const t of gebaut) {
    const letzte = t.stationen[t.stationen.length - 1];
    assert.ok(letzte.mischung && !letzte.freiwillig, `${t.id}: die letzte Station ist kein nötiger Abschluss`);
    assert.equal(t.stationen.filter((s) => s.mischung).length, 1, `${t.id}: mehr als ein Abschluss`);
    const erwartet = noetigeStationen(t)
      .filter((s) => !s.mischung)
      .map((s) => `${s.uebung}/${s.stufe}`);
    assert.deepEqual(mischungsPaare(t).map((p) => `${p.uebung}/${p.stufe}`), erwartet);
  }
});

// Vorläufig angenommen am 19.11.2026: die Liste in LERNWEG.md, „Stationen der Etappen 1 und 2“.
// Ändert Daniel sie, diese Tabelle im selben Schritt anpassen.
test('Stationen der Etappen 1 und 2 wie in LERNWEG.md', () => {
  const ist = (t) =>
    Object.fromEntries(
      uebungenImThema(t).map((uid) => [
        uid,
        {
          noetig: noetigeStationen(t).find((s) => s.uebung === uid).stufe,
          freiwillig: t.stationen.filter((s) => s.freiwillig && s.uebung === uid).map((s) => s.stufe),
        },
      ])
    );
  assert.deepEqual(ist(THEMEN[0]), {
    'linie-zwischenraum': { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
    'hoeher-tiefer': { noetig: 'leicht', freiwillig: ['schwer'] },
    'schritt-sprung': { noetig: 'leicht', freiwillig: ['schwer'] },
    'hoeren-sehen': { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
    chorsatz: { noetig: 'leicht', freiwillig: [] },
  });
  assert.deepEqual(ist(THEMEN[1]), {
    grundschlag: { noetig: 'leicht', freiwillig: ['schwer'] },
    notenwerte: { noetig: 'leicht', freiwillig: ['schwer'] },
    'welcher-schlag': { noetig: 'leicht', freiwillig: ['schwer'] },
    'takt-ergaenzen': { noetig: 'leicht', freiwillig: ['schwer'] },
    'rhythmus-erkennen': { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
    'rhythmus-klopfen': { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
  });
});

// Vorläufig angenommen am 26.11.2026: LERNWEG.md, „Stationen der Etappe 3“ (ENTSCHEIDUNGEN.md, „Etappe 3“).
test('Stationen der Etappe 3 wie in LERNWEG.md', () => {
  const t = THEMEN[2];
  assert.equal(t.id, 'notennamen');
  const ist = Object.fromEntries(
    uebungenImThema(t).map((uid) => [
      uid,
      {
        noetig: noetigeStationen(t).find((s) => s.uebung === uid).stufe,
        freiwillig: t.stationen.filter((s) => s.freiwillig && s.uebung === uid).map((s) => s.stufe),
      },
    ])
  );
  assert.deepEqual(ist, {
    notenname: { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
    'finde-note': { noetig: 'leicht', freiwillig: ['mittel', 'schwer'] },
    weiterzaehlen: { noetig: 'leicht', freiwillig: ['schwer'] },
    klavier: { noetig: 'leicht', freiwillig: ['schwer'] },
  });
  assert.ok(!t.stationen.some((s) => s.abThema), 'Etappe 3 hat keine Spätblüher');
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 4“.
test('Stationen der Etappe 4 wie in LERNWEG.md', () => {
  const t = THEMEN[3];
  assert.equal(t.id, 'achtel');
  const ist = Object.fromEntries(
    uebungenImThema(t).map((uid) => [
      uid,
      {
        noetig: noetigeStationen(t).find((s) => s.uebung === uid).stufe,
        freiwillig: t.stationen.filter((s) => s.freiwillig && s.uebung === uid).map((s) => s.stufe),
      },
    ])
  );
  assert.deepEqual(ist, {
    mitzaehlen: { noetig: 'leicht', freiwillig: ['schwer'] },
    auftakt: { noetig: 'leicht', freiwillig: ['schwer'] },
    'achtel-hoeren': { noetig: 'leicht', freiwillig: ['schwer'] },
    'achtel-klopfen': { noetig: 'leicht', freiwillig: ['schwer'] },
  });
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 5“.
test('Stationen der Etappe 5 wie in LERNWEG.md', () => {
  const t = THEMEN[4];
  assert.equal(t.id, 'ziffern');
  const ist = Object.fromEntries(
    uebungenImThema(t).map((uid) => [
      uid,
      {
        noetig: noetigeStationen(t).find((s) => s.uebung === uid).stufe,
        freiwillig: t.stationen.filter((s) => s.freiwillig && s.uebung === uid).map((s) => s.stufe),
      },
    ])
  );
  assert.deepEqual(ist, {
    'ganz-halbton': { noetig: 'leicht', freiwillig: ['schwer'] },
    tonleiter: { noetig: 'leicht', freiwillig: [] },
    'ziffer-lesen': { noetig: 'leicht', freiwillig: ['schwer'] },
    'stufen-hoeren': { noetig: 'leicht', freiwillig: ['schwer'] },
  });
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 6“.
test('Stationen der Etappe 6 wie in LERNWEG.md', () => {
  const t = THEMEN[5];
  assert.equal(t.id, 'zeichen');
  const ist = Object.fromEntries(
    uebungenImThema(t).map((uid) => [
      uid,
      {
        noetig: noetigeStationen(t).find((s) => s.uebung === uid).stufe,
        freiwillig: t.stationen.filter((s) => s.freiwillig && s.uebung === uid).map((s) => s.stufe),
      },
    ])
  );
  assert.deepEqual(ist, {
    zeichen: { noetig: 'leicht', freiwillig: ['schwer'] },
    ablauf: { noetig: 'leicht', freiwillig: ['schwer'] },
    strophen: { noetig: 'leicht', freiwillig: ['schwer'] },
  });
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 7“.
test('Stationen der Etappe 7 wie in LERNWEG.md', () => {
  const t = THEMEN[6];
  assert.equal(t.id, 'intervalle');
  assert.deepEqual(
    t.stationen.map((s) => `${s.uebung || 'mischung'}/${s.stufe}${s.freiwillig ? '/frei' : ''}`),
    ['intervall-lesen/leicht', 'intervall-lesen/schwer/frei', 'intervall-hoeren/leicht', 'intervall-hoeren/schwer/frei', 'mischung/gemischt']
  );
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 8“.
test('Stationen der Etappe 8 wie in LERNWEG.md', () => {
  const t = THEMEN[7];
  assert.equal(t.id, 'punktierung');
  assert.deepEqual(
    t.stationen.map((s) => `${s.uebung || 'mischung'}/${s.stufe}${s.freiwillig ? '/frei' : ''}`),
    ['punktierung/leicht', 'punktierung/schwer/frei', 'zwei-schlaege/leicht', 'zwei-schlaege/schwer/frei', 'punkt-hoeren/leicht', 'punkt-hoeren/schwer/frei', 'mischung/gemischt']
  );
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 9“.
test('Stationen der Etappe 9 wie in LERNWEG.md', () => {
  const t = THEMEN[8];
  assert.equal(t.id, 'zusammenklang');
  assert.deepEqual(
    t.stationen.map((s) => `${s.uebung || 'mischung'}/${s.stufe}${s.freiwillig ? '/frei' : ''}`),
    ['dreiklang/leicht', 'dreiklang/schwer/frei', 'dur-moll/leicht', 'dur-moll/schwer/frei', 'einsatzton/leicht', 'einsatzton/schwer/frei', 'mischung/gemischt']
  );
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 10“.
test('Stationen der Etappe 10 wie in LERNWEG.md', () => {
  const t = THEMEN[9];
  assert.equal(t.id, 'tonarten');
  assert.deepEqual(
    t.stationen.map((s) => `${s.uebung || 'mischung'}/${s.stufe}${s.freiwillig ? '/frei' : ''}`),
    ['vorzeichen/leicht', 'vorzeichen/schwer/frei', 'tonart/leicht', 'tonart/schwer/frei', 'mischung/gemischt']
  );
});

// Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden: LERNWEG.md, „Stationen der Etappe 11“.
test('Stationen der Etappe 11 wie in LERNWEG.md', () => {
  const t = THEMEN[10];
  assert.equal(t.id, 'rhythmus-fein');
  assert.deepEqual(
    t.stationen.map((s) => `${s.uebung || 'mischung'}/${s.stufe}${s.freiwillig ? '/frei' : ''}`),
    ['synkope/leicht', 'synkope/schwer/frei', 'schlag-gruppen/leicht', 'schlag-gruppen/schwer/frei', 'mischung/gemischt']
  );
});

test('Freischalten: nötige nacheinander, freiwillige nach ihrer nötigen Station', () => {
  zuruecksetzen();
  const noetige = noetigeStationen();
  assert.equal(naechsteStation().id, noetige[0].id);
  assert.ok(stationOffen(noetige[0].id));
  assert.ok(!stationOffen(noetige[1].id), 'die zweite nötige Station darf noch nicht offen sein');

  const fw = freiwilligeZu(noetige[0]);
  assert.ok(fw.length > 0, 'die erste Station sollte freiwillige haben, sonst prüft dieser Test nichts');
  for (const f of fw) assert.ok(!stationOffen(f.id), `${f.id} ist offen, bevor die nötige Station geschafft ist`);

  schaffe(noetige[0]);
  assert.equal(naechsteStation().id, noetige[1].id, 'nach der ersten nötigen Station kommt die zweite nötige');
  for (const f of fw) assert.ok(stationOffen(f.id), `${f.id} ist nach der nötigen Station nicht offen`);

  // Freiwillige Stationen ändern nichts am Weg
  for (const f of fw) schaffe(f);
  assert.equal(naechsteStation().id, noetige[1].id);
  zuruecksetzen();
});

test('Etappe geschafft und Fortschritt: nur nötige Stationen zählen', () => {
  zuruecksetzen();
  const [t1, t2] = gebaut;
  assert.ok(!etappeErreicht(t2.id));
  for (const s of noetigeStationen(t1)) schaffe(s);
  assert.ok(etappeGeschafft(t1.id), 'Etappe 1 muss ohne freiwillige Stationen geschafft sein');
  assert.ok(etappeErreicht(t2.id), 'Etappe 2 muss danach erreicht sein');
  assert.equal(naechsteStation().id, noetigeStationen(t2)[0].id);
  const f = fortschrittGesamt();
  assert.equal(f.gesamt, noetigeStationen().length);
  assert.equal(f.geschafft, noetigeStationen(t1).length);
  zuruecksetzen();
});

test('Spätblüher: erscheinen erst, wenn ihre Etappe erreicht ist', () => {
  zuruecksetzen();
  const [t1, t2] = gebaut;
  const kern = noetigeStationen(t1)[0];
  const probe = { id: 'probe-spaetbluehende', titel: 'Probe', uebung: kern.uebung, stufe: kern.stufe, freiwillig: true, abThema: t2.id };
  t1.stationen.push(probe);
  try {
    schaffe(kern);
    assert.ok(!stationSichtbar(probe.id), 'vor Etappe 2 darf der Spätblüher nicht erscheinen');
    assert.ok(!stationOffen(probe.id));
    for (const s of noetigeStationen(t1)) schaffe(s);
    assert.ok(stationSichtbar(probe.id), 'mit Etappe 2 muss der Spätblüher erscheinen');
    assert.ok(stationOffen(probe.id));
  } finally {
    t1.stationen.pop();
    zuruecksetzen();
  }
});
