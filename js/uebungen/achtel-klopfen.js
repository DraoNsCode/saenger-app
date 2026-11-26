// Etappe 4, „Achtel klopfen“. Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden
// (LERNWEG.md, „Stationen der Etappe 4“). Wie „Rhythmus klopfen“ aus Etappe 2, jetzt mit Achteln.
// leicht: nötige Station, ein 4/4-Takt mit Klick und Mitlese-Hilfe. schwer: freiwillig, zwei Takte ohne Klick, mit Achtelpausen.
import { waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { achtelTakt, abcAchtel, einsaetze } from './hilfen.js';
import { tippAufgabe, trefferText } from './tippen.js';

const TEMPO = { leicht: 66, schwer: 76 };
const TOLERANZ = { leicht: 0.13, schwer: 0.1 };
const RHYTHMUS_TON = 67;

export default {
  id: 'achtel-klopfen',
  titel: 'Achtel klopfen',
  themaId: 'achtel',
  aufgaben: 4,
  tippen: true,
  stufen: {
    leicht: 'Ein Takt, der Klick läuft mit',
    schwer: 'Zwei Takte, nach dem Einzählen kein Klick mehr, mit Achtelpausen',
  },
  erklaerung: [
    'Lies den Rhythmus und tippe ihn: bei **jedem Notenanfang** einmal, also bei zwei Achteln zweimal pro Schlag.',
    'Zähl innerlich mit „1 und 2 und …“. Bei Pausen wartest du, bis die nächste Note beginnt.',
    'Zuerst kommt ein Takt Klicks zum Einzählen.',
  ],
  neu(stufe) {
    const takt = stufe === 'schwer' ? waehle([4, 3]) : 4;
    const anzahl = stufe === 'leicht' ? 1 : 2;
    const tempo = TEMPO[stufe];
    const takte = Array.from({ length: anzahl }, () => achtelTakt(takt, { achtelPausen: stufe === 'schwer', halbe: true }));
    const noten = einsaetze(takte, takt);
    const abc = kopf({ schluessel: 'perc', takt: `${takt}/4` }) + abcAchtel(takte);
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
            breite: anzahl === 2 ? 300 : 220,
            scale: 1.4,
            tempo,
            takt,
            punkte: 0,
            spiele: (start) => {
              if (stufe === 'leicht') klicks(start, tempo, takt * anzahl, takt);
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
