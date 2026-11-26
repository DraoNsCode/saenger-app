// Etappe 4, „Mitzählen mit und“. Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden
// (LERNWEG.md, „Stationen der Etappe 4“).
// leicht: nötige Station, Viertel, Halbe und Achtelpaare, 4/4- und 3/4-Takt. schwer: freiwillig, auch mit Achtelpausen.
import { STIMMEN, waehle, gewichtet, abcTon } from '../musik.js';
import { kopf } from '../noten.js';
import { achtelTakt, abcAchtel, zaehlSilbe, silbenOptionen, zaehlWeise, melodiePositionen, diasAusPositionen } from './hilfen.js';

export default {
  id: 'mitzaehlen',
  titel: 'Mitzählen mit „und“',
  themaId: 'achtel',
  aufgaben: 8,
  stufen: {
    leicht: 'Viertel, Halbe und Achtel',
    schwer: 'Auch mit Achtelpausen',
  },
  erklaerung: [
    'Eine **Achtel** dauert einen halben Schlag. Eine einzelne Achtel hat ein Fähnchen. Zwei Achtel sind oft mit einem Balken verbunden und dauern zusammen so lange wie eine Viertel.',
    'Damit du die Hälften zählen kannst, sagst du zwischen den Schlägen „und“: **1 und 2 und 3 und 4 und**. Du zählst immer so durch, auch bei Vierteln und Halben.',
    'Jede Achtel füllt eine Hälfte des Schlags: entweder den Schlag selbst oder das „und“.',
    'Eine **Achtelpause** dauert ebenfalls einen halben Schlag. Du zählst sie mit, singst aber nicht. Wie sie aussieht, zeigt das zweite Bild.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    const tief = s === 'treble' ? ['G', 'A', 'B', 'c'] : ['D,', 'E,', 'F,', 'G,'];
    return [
      { abc: kopf({ schluessel: s, takt: '4/4' }) + `"_1 und"${tief[0]} "_2"${tief[1]}/"_und"${tief[2]}/ "_3 und 4 und"${tief[3]}2 |]`, breite: 300 },
      // Einzelne Achtel und Achtelpause
      { abc: kopf({ schluessel: s, takt: '2/4' }) + `"_1"${tief[0]}/ "_und"z/ "_2"z/ "_und"${tief[1]}/ |]`, breite: 200 },
    ];
  },
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const schlaege = waehle([4, 3]);
    const takt = achtelTakt(schlaege, { pausen: Math.random() < 0.3 ? 1 : 0, achtelPausen: stufe === 'schwer', mindAchtel: stufe === 'schwer' ? 2 : 1 });
    // Ziel: eine Note, lieber auf einem „und“
    let pos = 0;
    const kandidaten = [];
    takt.forEach((n, i) => {
      if (!n.pause) kandidaten.push([{ i, beginn: pos }, Number.isInteger(pos) ? 1 : 3]);
      pos += n.d;
    });
    const ziel = gewichtet(kandidaten);
    const tonAnzahl = takt.filter((n) => !n.pause).length;
    const dias = diasAusPositionen(k.stimme, melodiePositionen(tonAnzahl, { min: 2, max: 6 }));
    const loesung = zaehlSilbe(ziel.beginn);
    return {
      frage: 'Auf welche Zählzeit fällt der Anfang der farbigen Note?',
      bild: {
        abc: kopf({ schluessel: s, takt: `${schlaege}/4` }) + abcAchtel([takt], (i) => abcTon(dias[i])),
        breite: 230,
        scale: 1.6,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note, .abcjs-rest');
          if (alle[ziel.i]) alle[ziel.i].classList.add('markiert');
        },
      },
      optionen: silbenOptionen(schlaege),
      spalten: 2,
      loesung,
      warum: `Die farbige Note beginnt auf „${loesung}“. So zählst du: ${zaehlWeise(takt)}.`,
      takt, // für die Prüfung
      ziel,
    };
  },
};
