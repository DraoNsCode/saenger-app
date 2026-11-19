import { waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { zufallsTakt, abcRhythmus, einsaetze } from './hilfen.js';
import { tippAufgabe, trefferText } from './tippen.js';

const TEMPO = { leicht: 72, mittel: 80, schwer: 92 };
const TOLERANZ = { leicht: 0.16, mittel: 0.13, schwer: 0.1 };
const RHYTHMUS_TON = 67;

export default {
  id: 'rhythmus-klopfen',
  titel: 'Rhythmus klopfen',
  themaId: 'schlag-takt',
  aufgaben: 4,
  tippen: true,
  stufen: {
    leicht: 'Ein Takt mit Klick',
    mittel: 'Zwei Takte mit Pausen, leiser Klick',
    schwer: 'Zwei Takte ohne Klick, auch im 3/4-Takt',
  },
  erklaerung: [
    'Lies den Rhythmus und tippe ihn: bei **jedem Notenanfang** einmal.',
    'Bei langen Noten und bei **Pausen** wartest du, bis die nächste Note beginnt. Zähl dabei innerlich mit.',
    'Zuerst kommt ein Takt Klicks zum Einzählen.',
  ],
  neu(stufe) {
    const takt = stufe === 'schwer' ? waehle([4, 3]) : 4;
    const anzahl = stufe === 'leicht' ? 1 : 2;
    const tempo = TEMPO[stufe];
    let takte;
    do {
      takte = Array.from({ length: anzahl }, () =>
        zufallsTakt(takt, { ganze: false, pausen: stufe === 'leicht' ? 0 : Math.random() < 0.6 ? 1 : 0 })
      );
    } while (takte.every((t) => t.every((n) => n.d === 1 && !n.pause)));
    const noten = einsaetze(takte, takt);
    const abc = kopf({ schluessel: 'perc', takt: `${takt}/4` }) + abcRhythmus(takte);
    const folge = noten.map((n) => ({ midi: n.pause ? null : RHYTHMUS_TON, schlaege: n.d }));
    const sps = 60 / tempo;
    return {
      eigene: (el, fertig) =>
        tippAufgabe(
          el,
          {
            frage: 'Tippe den Rhythmus.',
            hinweis: takt === 3 ? 'Dreivierteltakt: drei Schläge pro Takt.' : null,
            abc,
            breite: anzahl === 2 ? 300 : 200,
            scale: 1.4,
            tempo,
            takt,
            punkte: 0,
            spiele: (start) => {
              if (stufe !== 'schwer') klicks(start, tempo, takt * anzahl, takt, stufe === 'mittel');
              // Mitlesen-Markierung nur in „leicht“; sonst liest man selbst
              const mitlesen = stufe === 'leicht' ? noten.map((n, index) => ({ zeit: start + n.beginn * sps, index })) : [];
              return { ende: start + takt * anzahl * sps, mitlesen };
            },
            ziele: (start) => noten.filter((n) => !n.pause).map((n) => start + n.beginn * sps),
            toleranz: TOLERANZ[stufe],
            bewerte: (e) => {
              const erlaubt = e.treffer.length >= 6 ? 1 : 0;
              return {
                richtig: e.treffer.length - e.anzahl <= erlaubt && e.extra <= 1,
                text: trefferText(e, e.treffer.length === 1 ? 'Note' : 'Noten'),
              };
            },
            zeige: (e, { notenEls }) => {
              let i = 0;
              noten.forEach((n, idx) => {
                if (n.pause) return;
                const el2 = notenEls[idx];
                if (el2) el2.classList.add(e.treffer[i] ? 'treffer' : 'daneben');
                i++;
              });
            },
            anhoeren: () => {
              const c = audio();
              const t0 = c.currentTime + 0.2;
              klicks(t0, tempo, takt, takt);
              spieleFolge(folge, { tempo, start: t0 + takt * sps, art: 'orgel' });
            },
          },
          fertig
        ),
    };
  },
};
