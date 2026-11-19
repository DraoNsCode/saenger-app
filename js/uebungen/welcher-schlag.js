import { STIMMEN, waehle, gewichtet, abcTon, diaAusPos } from '../musik.js';
import { kopf } from '../noten.js';
import { zufallsTakt, abcMelodie, melodiePositionen, diasAusPositionen, WERT } from './hilfen.js';

function schlaegeWorte(beginn, d) {
  const s = beginn + 1;
  if (d === 1) return `auf ${s}`;
  if (d === 2) return `auf ${s} und ${s + 1}`;
  return `auf ${s} bis ${s + d - 1}`;
}

function taktBeschreibung(takt) {
  let pos = 0;
  return takt
    .map((n) => {
      const t = `${n.pause ? WERT.pause[n.d] : WERT.note[n.d]} ${schlaegeWorte(pos, n.d)}`;
      pos += n.d;
      return t;
    })
    .join(', ');
}

export default {
  id: 'welcher-schlag',
  titel: 'Auf welchem Schlag?',
  themaId: 'schlag-takt',
  aufgaben: 8,
  stufen: {
    leicht: 'Viertel und Halbe im 4/4-Takt',
    mittel: 'Mit Pausen, auch im 3/4-Takt',
    schwer: 'Zwei Takte, Noten auch versetzt',
  },
  erklaerung: [
    'Die **Taktangabe** am Anfang sagt, wie viele Schläge in einen Takt gehören: Bei 4/4 sind es vier, bei 3/4 drei.',
    'In jedem Takt zählst du wieder von **1** an. Eine Halbe dauert zwei Schläge: Die nächste Note beginnt also zwei Schläge später.',
    'Pausen zählst du genauso mit.',
  ],
  beispiel(k) {
    const d = (p) => abcTon(diaAusPos(k.stimme, p));
    return {
      abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel, takt: '4/4' }) + `"_1 2"${d(4)}2 "_3"${d(3)} "_4"${d(2)} | "_1"${d(3)} "_2"z "_3 4"${d(4)}2 |]`,
      breite: 260,
    };
  },
  neu(stufe, k) {
    const takt = stufe === 'leicht' ? 4 : waehle([4, 3]);
    const anzahl = stufe === 'schwer' ? 2 : 1;
    const takte = Array.from({ length: anzahl }, () =>
      zufallsTakt(takt, {
        pausen: stufe === 'leicht' ? 0 : Math.random() < 0.6 ? 1 : 0,
        halbeVersetzt: stufe === 'schwer',
      })
    );
    const letzter = takte[anzahl - 1];
    // Ziel: eine Note (keine Pause) im letzten Takt, lieber nicht immer auf 1
    let pos = 0;
    const kandidaten = [];
    letzter.forEach((n, i) => {
      if (!n.pause) kandidaten.push([{ i, beginn: pos }, pos === 0 ? 1 : 3]);
      pos += n.d;
    });
    const ziel = gewichtet(kandidaten);
    // Index unter allen Elementen (Noten und Pausen) im Bild
    const vorher = takte.slice(0, anzahl - 1).reduce((s, t) => s + t.length, 0);
    const index = vorher + ziel.i;
    const tonAnzahl = takte.flat().filter((n) => !n.pause).length;
    const dias = diasAusPositionen(k.stimme, melodiePositionen(tonAnzahl, { min: 2, max: 6 }));
    const optionen = Array.from({ length: takt }, (_, i) => ({ text: String(i + 1), wert: i + 1 }));
    return {
      frage: anzahl === 2 ? 'Auf welchem Schlag in ihrem Takt beginnt die farbige Note?' : 'Auf welchem Schlag beginnt die farbige Note?',
      bild: {
        // Zwei Takte stehen untereinander, damit die Noten auf dem Handy groß bleiben
        abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel, takt: `${takt}/4` }) + abcMelodie(takte, dias).replace(' | ', ' |\n'),
        breite: 200,
        scale: 1.6,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note, .abcjs-rest');
          if (alle[index]) alle[index].classList.add('markiert');
        },
      },
      optionen,
      spalten: takt,
      loesung: ziel.beginn + 1,
      warum: `Mitgezählt: ${taktBeschreibung(letzter)}.`,
    };
  },
};
