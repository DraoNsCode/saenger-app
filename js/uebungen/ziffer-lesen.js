// Etappe 5, „Welche Ziffer?“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Gelesen wird in C-Dur, die 1 ist das c (Vorzeichen kommen erst in Etappe 10). Die obere 1 bleibt die 1.
// leicht: nötige Station, die 1 steht als erste Note da. schwer: freiwillig, nur die Note, die 1 ist das c.
import { STIMMEN, abcTon, midi, zufall } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';
import { notenname, diaAusPosIn } from './namen.js';
import { ziffer } from './ziffern.js';
import { C_POS } from './tonleiter.js';

let letzte = null;

export default {
  id: 'ziffer-lesen',
  titel: 'Welche Ziffer?',
  themaId: 'ziffern',
  aufgaben: 8,
  stufen: {
    leicht: 'Die 1 steht daneben',
    schwer: 'Nur die Note, die 1 ist das c',
  },
  erklaerung: [
    'In C-Dur ist das **c** die **1**. Von dort zählst du die Tonleiter hinauf: c ist 1, d ist 2, e ist 3, f ist 4, g ist 5, a ist 6, h ist 7.',
    'Das nächste c ist wieder die **1**, die obere 1.',
    'Ziffern sagen dir, wo ein Ton in der Tonleiter steht. Das hilft dir, Töne sicher zu treffen. Die meisten Lieder enden auf der 1.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const c = C_POS[s];
    let j;
    do j = zufall(stufe === 'leicht' ? 1 : 0, 7);
    while (j === letzte);
    letzte = j;
    const d1 = diaAusPosIn(s, c);
    const d2 = diaAusPosIn(s, c + j);
    const z = ziffer(j);
    const zaehlen = Array.from({ length: j + 1 }, (_, x) => `${ziffer(x)} ${notenname(diaAusPosIn(s, c + x))}`).join(' · ');
    const abc =
      stufe === 'leicht'
        ? kopf({ schluessel: s }) + `x "_1"${abcTon(d1)}2 ${abcTon(d2)}2 x |]`
        : kopf({ schluessel: s }) + `x2 ${abcTon(d2)}4 x2 |]`;
    return {
      frage: stufe === 'leicht' ? 'Die erste Note ist die 1. Welche Ziffer hat die zweite?' : 'Welche Ziffer hat die Note?',
      hinweis: stufe === 'schwer' ? 'In C-Dur ist das c die 1.' : null,
      bild: { abc, breite: 180, scale: 1.8 },
      optionen: Array.from({ length: 7 }, (_, x) => ({ text: String(x + 1), wert: String(x + 1) })),
      spalten: 4,
      loesung: z,
      warum: `Die Note ist das ${notenname(d2)}. Von der 1 (c) hinauf gezählt: ${zaehlen}.${j === 7 ? ' Die obere 1 bleibt die 1.' : ''}`,
      nachher: () => spieleFolge(Array.from({ length: j + 1 }, (_, x) => ({ midi: midi(diaAusPosIn(s, c + x)), schlaege: x === j ? 1.5 : 0.5 })), { tempo: 90 }),
      stufeIndex: j, // für die Prüfung
    };
  },
};
