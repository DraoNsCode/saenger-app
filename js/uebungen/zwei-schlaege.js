// Etappe 8, „Wie viele Schläge?“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Im Chor werden 2/2 und 6/8 in zwei Schlägen gezählt (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
// leicht: nötige Station, wie viele Schläge zählst du im Takt? schwer: freiwillig, welche Note dauert einen Schlag?
import { STIMMEN, abcTon, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { melodiePositionen, diasAusPositionen } from './hilfen.js';

// Taktarten: Noten des Beispieltakts als Längen in der jeweiligen Grundeinheit (L), Zahl der Schläge, Schlag-Note
export const TAKTARTEN = {
  '4/4': { laenge: '1/4', muster: [[1, 1, 1, 1], [2, 1, 1], [1, 1, 2]], schlaege: 4, schlag: 'Viertel' },
  '3/4': { laenge: '1/4', muster: [[1, 1, 1], [2, 1]], schlaege: 3, schlag: 'Viertel' },
  '2/2': { laenge: '1/4', muster: [[2, 2], [2, 1, 1], [1, 1, 2]], schlaege: 2, schlag: 'Halbe' },
  '6/8': { laenge: '1/8', muster: [[1, 1, 1, 1, 1, 1], [3, 3], [2, 1, 3], [3, 1, 1, 1]], schlaege: 2, schlag: 'punktierte Viertel' },
};

const WARUM = {
  '4/4': 'Im 4/4-Takt zählst du vier Schläge, jeder Schlag ist eine Viertel.',
  '3/4': 'Im 3/4-Takt zählst du drei Schläge, jeder Schlag ist eine Viertel.',
  '2/2': 'Im 2/2-Takt zählst du zwei Schläge, jeder Schlag ist eine Halbe.',
  '6/8': 'Im 6/8-Takt zählst du im Chor zwei Schläge, nur „1“ und „2“. Je drei Achtel bilden einen Schlag, so lang wie eine punktierte Viertel.',
};

let letzte = null;

export default {
  id: 'zwei-schlaege',
  titel: 'Wie viele Schläge?',
  themaId: 'punktierung',
  aufgaben: 8,
  stufen: {
    leicht: 'Schläge im Takt zählen',
    schwer: 'Welche Note dauert einen Schlag?',
  },
  erklaerung: [
    'Die **Taktangabe**: Die obere Zahl sagt, wie viele Noten in einen Takt passen, die untere, welche (2 = Halbe, 4 = Viertel, 8 = Achtel). Im Chor zählen wir aber nicht immer jede davon als Schlag.',
    '**2/2-Takt**: zwei Halbe pro Takt. Du zählst zwei Schläge, jeder Schlag ist eine Halbe. Im Gesangbuch steht dafür oft ein durchgestrichenes C.',
    '**6/8-Takt**: sechs Achtel pro Takt. Du zählst zwei Schläge, je drei Achtel sind ein Schlag. Die drei Achtel zählst du nicht einzeln, du zählst nur „1“ und „2“.',
    'Im 4/4- und 3/4-Takt bleibt es bei vier und drei Schlägen, jeder Schlag ist eine Viertel.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    // Die neuen Taktarten häufiger als die bekannten
    let art;
    do art = waehle(['2/2', '6/8', '2/2', '6/8', '4/4', '3/4']);
    while (art === letzte);
    letzte = art;
    const t = TAKTARTEN[art];
    const muster = waehle(t.muster);
    const dias = diasAusPositionen(k.stimme, melodiePositionen(muster.length, { min: 2, max: 6 }));
    // 6/8: Achtel in Dreiergruppen balken (ohne Leerzeichen innerhalb eines Schlags)
    let noten = '';
    let pos = 0;
    muster.forEach((d, i) => {
      const imSelbenSchlag = art === '6/8' && i > 0 && muster[i - 1] === 1 && d === 1 && Math.floor((pos - 1) / 3) === Math.floor(pos / 3);
      noten += (i && !imSelbenSchlag ? ' ' : '') + abcTon(dias[i]) + (d === 1 ? '' : String(d));
      pos += d;
    });
    const abc = kopf({ schluessel: s, takt: art, laenge: t.laenge }) + noten + ' |]';
    if (stufe === 'leicht') {
      return {
        frage: 'Wie viele Schläge zählst du in diesem Takt?',
        bild: { abc, breite: 220, scale: 1.6 },
        optionen: ['2', '3', '4', '6'].map((x) => ({ text: x, wert: x })),
        spalten: 4,
        loesung: String(t.schlaege),
        warum: WARUM[art],
        art, // für die Prüfung
      };
    }
    return {
      frage: 'Welche Note dauert in diesem Takt genau einen Schlag?',
      bild: { abc, breite: 220, scale: 1.6 },
      optionen: ['Achtel', 'Viertel', 'punktierte Viertel', 'Halbe'].map((x) => ({ text: x, wert: x })),
      spalten: 2,
      loesung: t.schlag,
      warum: WARUM[art],
      art,
    };
  },
};
