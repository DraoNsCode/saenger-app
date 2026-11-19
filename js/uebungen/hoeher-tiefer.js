import { STIMMEN, diaAusPos, abcTon, midi, zufall, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';

// Stufen nach Inhalt (ENTSCHEIDUNGEN.md, 19.11.2026): „leicht“ ist die nötige Station mit großen und kleinen
// Abständen im System (früher zwei Stufen), „schwer“ die freiwillige mit Hilfslinien.
const BEREICH = { leicht: [0, 8], schwer: [-4, 12] };
const ABSTAND = { leicht: [1, 6], schwer: [1, 2] };

export default {
  id: 'hoeher-tiefer',
  titel: 'Höher oder tiefer',
  themaId: 'notenbild',
  aufgaben: 8,
  stufen: {
    leicht: 'Große und kleine Abstände im Notensystem',
    schwer: 'Kleine Abstände mit Hilfslinien',
  },
  erklaerung: [
    'Je **höher** eine Note im Notensystem steht, desto höher klingt sie. Je **tiefer** sie steht, desto tiefer klingt sie.',
    'Vergleiche, wo der **Notenkopf** sitzt. Der Notenhals zeigt mal nach oben, mal nach unten. Für die Tonhöhe spielt er keine Rolle.',
  ],
  beispiel(k) {
    return {
      abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel }) + `"_tief"${abcTon(diaAusPos(k.stimme, 1))}2 "_hoch"${abcTon(diaAusPos(k.stimme, 7))}2 |]`,
      breite: 180,
    };
  },
  neu(stufe, k) {
    const [min, max] = BEREICH[stufe];
    const gleich = Math.random() < (stufe === 'leicht' ? 0.12 : 0.15);
    let a, b;
    do {
      a = zufall(min, max);
      if (gleich) b = a;
      else {
        const [amin, amax] = ABSTAND[stufe];
        b = a + waehle([-1, 1]) * zufall(amin, amax);
      }
    } while (b < min || b > max || (stufe === 'schwer' && !gleich && a >= 0 && a <= 8 && b >= 0 && b <= 8 && Math.random() < 0.6));
    const da = diaAusPos(k.stimme, a);
    const db = diaAusPos(k.stimme, b);
    const loesung = b > a ? 'hoeher' : b < a ? 'tiefer' : 'gleich';
    const warum = {
      hoeher: 'Die zweite Note steht weiter oben. Sie klingt höher.',
      tiefer: 'Die zweite Note steht weiter unten. Sie klingt tiefer.',
      gleich: 'Beide Noten sitzen an derselben Stelle. Sie klingen gleich hoch.',
    }[loesung];
    return {
      frage: 'Ist die zweite Note höher oder tiefer als die erste?',
      bild: { abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel }) + `x ${abcTon(da)}2 x ${abcTon(db)}2 x |]`, breite: 190, scale: 1.8 },
      optionen: [
        { text: 'Höher', wert: 'hoeher' },
        { text: 'Gleich', wert: 'gleich' },
        { text: 'Tiefer', wert: 'tiefer' },
      ],
      spalten: 3,
      loesung,
      warum,
      nachher: () => spieleFolge([{ midi: midi(da), schlaege: 1 }, { midi: midi(db), schlaege: 1.5 }], { tempo: 90 }),
    };
  },
};
