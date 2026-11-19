import { STIMMEN, diaAusPos, aufLinie, abcTon, midi, zufall, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { ton, jetzt } from '../klang.js';

let letzte = null;

export default {
  id: 'linie-zwischenraum',
  titel: 'Linie oder Zwischenraum',
  themaId: 'notenbild',
  aufgaben: 8,
  stufen: {
    leicht: 'Noten im Notensystem',
    mittel: 'Auch direkt unter und über dem System',
    schwer: 'Mit Hilfslinien',
  },
  erklaerung: [
    'Das Notensystem hat **fünf Linien**. Jede Note sitzt entweder **auf einer Linie** oder **in einem Zwischenraum**.',
    'Auf einer Linie geht die Linie mitten durch den Notenkopf. Im Zwischenraum liegt der Notenkopf zwischen zwei Linien.',
    'Reicht das System nicht aus, bekommt die Note kurze **Hilfslinien**. Auch dort gilt: Linie durch den Kopf oder Zwischenraum.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    return {
      abc: kopf({ schluessel: s }) + `"_Linie"${abcTon(diaAusPos(k.stimme, 4))}2 x "_Zwischenraum"${abcTon(diaAusPos(k.stimme, 5))}2 x |]`,
      breite: 220,
    };
  },
  neu(stufe, k) {
    let pos;
    do {
      if (stufe === 'leicht') pos = zufall(0, 8);
      else if (stufe === 'mittel') pos = Math.random() < 0.35 ? waehle([-1, 9]) : zufall(0, 8);
      else pos = Math.random() < 0.6 ? waehle([-4, -3, -2, -1, 9, 10, 11, 12]) : zufall(0, 8);
    } while (pos === letzte);
    letzte = pos;
    const dia = diaAusPos(k.stimme, pos);
    const linie = aufLinie(pos);
    const hilfslinie = pos < -1 || pos > 9;
    let warum;
    if (linie) warum = hilfslinie ? 'Die Hilfslinie geht mitten durch den Notenkopf: Die Note sitzt auf einer Linie.' : 'Die Linie geht mitten durch den Notenkopf: Die Note sitzt auf einer Linie.';
    else if (pos === -1) warum = 'Die Note hängt unter der untersten Linie, keine Linie geht durch den Kopf. Auch das zählt als Zwischenraum.';
    else if (pos === 9) warum = 'Die Note liegt über der obersten Linie, keine Linie geht durch den Kopf. Auch das zählt als Zwischenraum.';
    else if (hilfslinie) warum = 'Keine Hilfslinie geht durch den Notenkopf, die Note liegt neben der Hilfslinie. Das zählt als Zwischenraum.';
    else warum = 'Der Notenkopf liegt zwischen zwei Linien: Die Note sitzt in einem Zwischenraum.';
    return {
      frage: 'Sitzt die Note auf einer Linie oder in einem Zwischenraum?',
      bild: { abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel }) + `x2 ${abcTon(dia)}4 x2 |]`, breite: 150, scale: 1.9 },
      optionen: [
        { text: 'Linie', wert: 'linie' },
        { text: 'Zwischenraum', wert: 'raum' },
      ],
      loesung: linie ? 'linie' : 'raum',
      warum,
      nachher: () => ton(midi(dia), jetzt() + 0.05, 0.9),
    };
  },
};
