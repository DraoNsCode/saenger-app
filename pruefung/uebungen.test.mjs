// Prüft die Übungsarten, ohne Browser: Aufbau, erzeugte Aufgaben, Schlüssel je Stimme.
// Start: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UEBUNGEN } from '../js/uebungen/index.js';
import { THEMEN, STUFEN } from '../js/lernweg.js';

const STIMMEN = ['S', 'A', 'T', 'B'];
const SCHLUESSEL = { S: 'treble', A: 'treble', T: 'bass', B: 'bass' };
const ANDERER = { treble: 'bass', bass: 'treble' };
const DURCHLAEUFE = 200; // Aufgaben je Übung, Stufe und Stimme (die Aufgaben sind zufällig)

// Übungen, deren Bild nicht die eigene Stimme zeigt, sind von der Schlüsselprüfung ausgenommen:
// Der Chorsatz zeigt alle vier Stimmen.
const ALLE_SCHLUESSEL = new Set(['chorsatz']);

const themenIds = new Set(THEMEN.map((t) => t.id));

for (const [id, u] of Object.entries(UEBUNGEN)) {
  test(`${id}: Aufbau`, () => {
    assert.equal(u.id, id, 'id passt nicht zum Eintrag in index.js');
    assert.ok(u.titel, 'titel fehlt');
    assert.ok(themenIds.has(u.themaId), `themaId „${u.themaId}“ gibt es nicht in lernweg.js`);
    assert.ok(Number.isInteger(u.aufgaben) && u.aufgaben > 0, 'aufgaben muss eine positive ganze Zahl sein');
    // Leicht, Mittel und Schwer sind nur grobe Orientierungswerte; nicht jede Übung hat alle drei (ENTSCHEIDUNGEN.md, 19.11.2026).
    const stufen = Object.keys(u.stufen);
    assert.ok(stufen.length > 0, 'stufen fehlt');
    for (const s of stufen) assert.ok(STUFEN.includes(s), `Stufe „${s}“ ist nicht leicht, mittel oder schwer`);
    assert.ok(Array.isArray(u.erklaerung) && u.erklaerung.length > 0, 'erklaerung fehlt');
    assert.equal(typeof u.neu, 'function', 'neu() fehlt');
  });

  for (const stufe of Object.keys(u.stufen)) {
    test(`${id}: Aufgaben in der Stufe ${stufe}`, () => {
      for (const stimme of STIMMEN) {
        for (let n = 0; n < DURCHLAEUFE; n++) {
          const a = u.neu(stufe, { stimme });
          const wo = `${stufe}, Stimme ${stimme}`;
          if (a.eigene) {
            assert.equal(typeof a.eigene, 'function', `eigene muss eine Funktion sein (${wo})`);
            continue;
          }
          assert.ok(a.frage, `Frage fehlt (${wo})`);
          assert.ok(a.warum, `Erklärung bei falscher Antwort (warum) fehlt (${wo})`);
          assert.ok(Array.isArray(a.optionen) && a.optionen.length >= 2, `weniger als zwei Antworten (${wo})`);
          const werte = a.optionen.map((o) => String(o.wert));
          assert.ok(werte.includes(String(a.loesung)), `die richtige Lösung steht nicht unter den Antworten (${wo})`);
          assert.equal(new Set(werte).size, werte.length, `zwei Antworten haben denselben Wert (${wo})`);
          const inhalte = a.optionen.map((o) => o.text ?? o.abc);
          assert.equal(new Set(inhalte).size, inhalte.length, `zwei Antworten sehen gleich aus (${wo})`);

          if (!ALLE_SCHLUESSEL.has(id)) {
            // Manche freiwilligen Stationen zeigen absichtlich den anderen Schlüssel (ENTSCHEIDUNGEN.md, „Etappe 3“)
            const anders = (u.andererSchluessel || []).includes(stufe);
            const erwartet = anders ? ANDERER[SCHLUESSEL[stimme]] : SCHLUESSEL[stimme];
            const bilder = [a.bild?.abc, ...a.optionen.map((o) => o.abc)].filter(Boolean);
            for (const abc of bilder) {
              for (const [, schluessel] of abc.matchAll(/clef=(\w+)/g)) {
                if (schluessel === 'perc') continue; // reine Rhythmen ohne Tonhöhe
                assert.equal(schluessel, erwartet, `falscher Schlüssel für Stimme ${stimme} (${wo})`);
              }
            }
          }
        }
      }
    });
  }
}

// Entscheidung vom 19.11.2026 (ENTSCHEIDUNGEN.md): „Die Stimmen im Chorsatz“ hat nur eine Stufe, auch im Reiter „Themen“.
test('chorsatz: nur eine Stufe', () => {
  assert.deepEqual(Object.keys(UEBUNGEN.chorsatz.stufen), ['leicht']);
});
