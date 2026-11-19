import { STIMMEN, midi, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge, klicks } from '../klang.js';
import { zufallsTakt, abcMelodie, melodiePositionen, diasAusPositionen, einsaetze } from './hilfen.js';
import { tippAufgabe, trefferText } from './tippen.js';

// Stufen nach Inhalt (ENTSCHEIDUNGEN.md, 19.11.2026): „leicht“ ist die nötige Station. Sie hat lange Noten,
// denn der Kern ist, dass der Schlag weiterläuft, auch wenn eine Note länger klingt. Nur Viertel gibt es nicht mehr.
// „schwer“ ist die freiwillige Station ohne Klick.
const TEMPO = { leicht: 76, schwer: 100 };
const TOLERANZ = { leicht: 0.15, schwer: 0.1 };

export default {
  id: 'grundschlag',
  titel: 'Im Schlag tippen',
  themaId: 'schlag-takt',
  aufgaben: 4,
  tippen: true,
  stufen: {
    leicht: 'Viertel und Halbe, langsam, mit leisem Klick',
    schwer: 'Schneller, ohne Klick, auch im 3/4-Takt',
  },
  erklaerung: [
    'Musik hat einen gleichmäßigen Puls, den **Grundschlag**, so gleichmäßig wie Schritte beim Gehen.',
    'Zuerst kommt ein Takt **Klicks zum Einzählen**. Dann tippst du bei jedem Schlag auf die Fläche oder drückst die Leertaste.',
    'Tippe gleichmäßig weiter, auch wenn eine Note länger klingt. Der Schlag läuft immer weiter.',
  ],
  neu(stufe, k) {
    const takt = stufe === 'schwer' ? waehle([4, 3]) : 4;
    const tempo = TEMPO[stufe];
    let takte;
    do {
      takte = [0, 1].map(() => zufallsTakt(takt, { ganze: stufe === 'schwer' && takt === 4, pausen: stufe === 'schwer' && Math.random() < 0.5 ? 1 : 0 }));
      // Mindestens eine Note, die länger als einen Schlag klingt: Daran zeigt sich, dass der Schlag weiterläuft.
    } while (!takte.flat().some((n) => n.d > 1));
    const noten = einsaetze(takte, takt);
    const tonAnzahl = noten.filter((n) => !n.pause).length;
    const dias = diasAusPositionen(k.stimme, melodiePositionen(tonAnzahl, { min: 1, max: 7 }));
    const schlaege = takt * 2;
    const abc = kopf({ schluessel: STIMMEN[k.stimme].schluessel, takt: `${takt}/4` }) + abcMelodie(takte, dias);
    return {
      eigene: (el, fertig) =>
        tippAufgabe(
          el,
          {
            frage: 'Tippe bei jedem Schlag.',
            hinweis: takt === 3 ? 'Dreivierteltakt: drei Schläge pro Takt.' : null,
            abc,
            breite: 300,
            scale: 1.3,
            tempo,
            takt,
            punkte: schlaege,
            spiele: (start) => {
              let i = 0;
              const folge = noten.map((n) => ({ midi: n.pause ? null : midi(dias[i++]), schlaege: n.d }));
              const { zeiten, ende } = spieleFolge(folge, { tempo, start });
              const sps = 60 / tempo;
              if (stufe !== 'schwer') klicks(start, tempo, schlaege, takt, true);
              const mitlesen = [
                ...zeiten.map((zeit, index) => ({ zeit, index })),
                // Die Schlag-Punkte leuchten nur, solange auch ein Klick hilft
                ...(stufe === 'schwer' ? [] : Array.from({ length: schlaege }, (_, p) => ({ zeit: start + p * sps, punkt: p }))),
              ].sort((a, b) => a.zeit - b.zeit);
              return { ende, mitlesen };
            },
            ziele: (start) => Array.from({ length: schlaege }, (_, p) => start + (p * 60) / tempo),
            toleranz: TOLERANZ[stufe],
            bewerte: (e) => ({
              richtig: e.anzahl >= Math.ceil(e.treffer.length * 0.75) && e.extra <= 2,
              text: trefferText(e, 'Schlägen'),
            }),
            zeige: (e, { punkte }) => {
              e.treffer.forEach((t, i) => punkte.children[i].classList.add(t ? 'treffer' : 'daneben'));
            },
          },
          fertig
        ),
    };
  },
};
