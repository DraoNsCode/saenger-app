// Etappe 5, „Die Dur-Tonleiter“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Nur eine Stufe: Die Regel (Halbtöne zwischen 3–4 und 7–1) wird nicht schwerer.
import { STIMMEN, abcTon, midi } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';
import { notenname, diaAusPosIn } from './namen.js';
import { DUR, ziffer } from './ziffern.js';

// Position des c, mit dem die Tonleiter beginnt: Violinschlüssel c' (erste Hilfslinie unten), Bassschlüssel c (zweiter Zwischenraum)
export const C_POS = { treble: -2, bass: 3 };

let letzte = null;

export default {
  id: 'tonleiter',
  titel: 'Die Dur-Tonleiter',
  themaId: 'ziffern',
  aufgaben: 8,
  stufen: {
    leicht: 'Wo liegen die Halbtöne?',
  },
  erklaerung: [
    'Eine **Dur-Tonleiter** hat sieben Töne. Im Chor nennen wir sie mit **Ziffern**: 1 2 3 4 5 6 7. Danach kommt wieder die 1, die obere 1. Sie heißt nicht 8.',
    'Die 1 ist der **Grundton**. Hier ist es das c, deshalb heißt diese Tonleiter C-Dur.',
    'Fast alle Schritte sind Ganztöne. **Halbtöne** liegen nur zwischen **3 und 4** und zwischen **7 und 1**. Das gilt in jeder Dur-Tonleiter.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const c = C_POS[s];
    // Halbtöne (Schritt 3→4 und 7→1) etwa so oft wie Ganztöne
    let i;
    do i = Math.random() < 0.45 ? (Math.random() < 0.5 ? 2 : 6) : [0, 1, 3, 4, 5][Math.floor(Math.random() * 5)];
    while (i === letzte);
    letzte = i;
    const halb = DUR[i] === 1;
    const [z1, z2] = [ziffer(i), ziffer(i + 1)];
    const [n1, n2] = [notenname(diaAusPosIn(s, c + i)), notenname(diaAusPosIn(s, c + i + 1))];
    const noten = Array.from({ length: 8 }, (_, j) => `"_${ziffer(j)}"${abcTon(diaAusPosIn(s, c + j))}`).join(' ');
    return {
      frage: `Ist der Schritt von ${z1} nach ${z2} ein Ganzton oder ein Halbton?`,
      bild: {
        abc: kopf({ schluessel: s }) + noten + ' |]',
        breite: 300,
        scale: 1.3,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note');
          [i, i + 1].forEach((j) => alle[j] && alle[j].classList.add('markiert'));
        },
      },
      optionen: [{ text: 'Ganzton', wert: 'ganz' }, { text: 'Halbton', wert: 'halb' }],
      loesung: halb ? 'halb' : 'ganz',
      warum: `Von ${z1} nach ${z2} ist ein ${halb ? 'Halbton' : 'Ganzton'} (hier ${n1}–${n2}). In jeder Dur-Tonleiter liegen die Halbtöne zwischen 3 und 4 und zwischen 7 und 1.`,
      nachher: () =>
        spieleFolge([{ midi: midi(diaAusPosIn(s, c + i)), schlaege: 1 }, { midi: midi(diaAusPosIn(s, c + i + 1)), schlaege: 1.5 }], { tempo: 80 }),
      schritt: i, // für die Prüfung
    };
  },
};
