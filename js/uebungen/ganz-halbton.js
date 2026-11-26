// Etappe 5, „Ganzton oder Halbton“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// leicht: nötige Station, zwei benachbarte weiße Tasten auf der Klaviatur. schwer: freiwillig, im Notenbild ohne Klaviatur.
import { STIMMEN, abcTon, midi, waehle, zufall } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';
import { notenname, bereichPos, diaAusPosIn } from './namen.js';
import { tasten, klaviaturBild } from './klavier.js';
import { istHalbton } from './ziffern.js';

let letzte = null;

function warumText(n1, n2, halb) {
  return halb
    ? `Zwischen ${n1} und ${n2} liegt keine schwarze Taste: Das ist ein Halbton. Halbtöne zwischen weißen Tasten gibt es nur bei e–f und h–c.`
    : `Zwischen ${n1} und ${n2} liegt eine schwarze Taste: Das ist ein Ganzton, also zwei Halbtöne.`;
}

export default {
  id: 'ganz-halbton',
  titel: 'Ganzton oder Halbton',
  themaId: 'ziffern',
  aufgaben: 8,
  stufen: {
    leicht: 'Auf der Klaviatur',
    schwer: 'Im Notenbild, ohne Klaviatur',
  },
  erklaerung: [
    'Ein **Halbton** ist der kleinste Schritt: von einer Taste zur direkt nächsten, egal ob weiß oder schwarz.',
    'Ein **Ganzton** besteht aus zwei Halbtönen. Zwischen zwei weißen Tasten mit einer schwarzen dazwischen liegt ein Ganzton.',
    'Zwischen **e und f** und zwischen **h und c** gibt es keine schwarze Taste. Dort ist der Schritt nur ein Halbton.',
  ],
  neu(stufe, k) {
    const st = STIMMEN[k.stimme];
    // Halbtöne etwa so oft wie Ganztöne, obwohl es weniger davon gibt
    const halb = Math.random() < 0.45;
    if (stufe === 'leicht') {
      const reihe = tasten(st.bereich[0] + zufall(0, 2), 9);
      let i;
      do i = zufall(0, reihe.length - 2);
      while (istHalbton(reihe[i].name, reihe[i + 1].name) !== halb || `${reihe[i].dia}` === letzte);
      letzte = `${reihe[i].dia}`;
      const [a, b] = [reihe[i], reihe[i + 1]];
      return {
        frage: `Von ${a.name} nach ${b.name}: Ganzton oder Halbton?`,
        bildEl: () => klaviaturBild(reihe, { markiert: [i, i + 1], namen: true }),
        optionen: [{ text: 'Ganzton', wert: 'ganz' }, { text: 'Halbton', wert: 'halb' }],
        loesung: halb ? 'halb' : 'ganz',
        warum: warumText(a.name, b.name, halb),
        nachher: () => spieleFolge([{ midi: a.midi, schlaege: 1 }, { midi: b.midi, schlaege: 1.5 }], { tempo: 80 }),
        halb, // für die Prüfung
        namen: [a.name, b.name],
      };
    }
    // schwer: zwei benachbarte Noten im Tonraum der Stimme
    const [von, bis] = bereichPos(k.stimme);
    let p;
    let richtung;
    do {
      p = zufall(von, bis - 1);
      richtung = waehle([1, -1]);
    } while (istHalbton(notenname(diaAusPosIn(st.schluessel, p)), notenname(diaAusPosIn(st.schluessel, p + 1))) !== halb || `${p}` === letzte);
    letzte = `${p}`;
    const [p1, p2] = richtung > 0 ? [p, p + 1] : [p + 1, p];
    const d1 = diaAusPosIn(st.schluessel, p1);
    const d2 = diaAusPosIn(st.schluessel, p2);
    const [n1, n2] = [notenname(d1), notenname(d2)];
    return {
      frage: 'Ganzton oder Halbton?',
      bild: { abc: kopf({ schluessel: st.schluessel }) + `x ${abcTon(d1)}2 ${abcTon(d2)}2 x |]`, breite: 180, scale: 1.8 },
      optionen: [{ text: 'Ganzton', wert: 'ganz' }, { text: 'Halbton', wert: 'halb' }],
      loesung: halb ? 'halb' : 'ganz',
      warum: `Die Noten sind ${n1} und ${n2}. ${warumText(n1, n2, halb)}`,
      nachher: () => spieleFolge([{ midi: midi(d1), schlaege: 1 }, { midi: midi(d2), schlaege: 1.5 }], { tempo: 80 }),
      halb,
      namen: [n1, n2],
    };
  },
};
