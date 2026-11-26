// Etappe 4, „Achtel hören“. Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden
// (LERNWEG.md, „Stationen der Etappe 4“). Wie „Rhythmus erkennen“ aus Etappe 2, jetzt mit Achteln.
// leicht: nötige Station, ein 4/4-Takt, zwei Bilder. schwer: freiwillig, mit Achtelpausen, auch 3/4, drei ähnliche Bilder.
import { waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { achtelTakt, abcAchtel, einsaetze, gleicheTakte, zaehlWeise } from './hilfen.js';

const TEMPO = { leicht: 72, schwer: 84 };
const RHYTHMUS_TON = 67;

const anfaenge = (takte, takt) =>
  einsaetze(takte, takt)
    .filter((n) => !n.pause)
    .map((n) => n.beginn)
    .join(',');

export default {
  id: 'achtel-hoeren',
  titel: 'Achtel hören',
  themaId: 'achtel',
  aufgaben: 8,
  stufen: {
    leicht: 'Ein Takt, zwei Bilder zur Wahl',
    schwer: 'Mit Achtelpausen, auch im 3/4-Takt, ähnliche Bilder',
  },
  erklaerung: [
    'Nach einem Takt Klicks zum Einzählen erklingt ein **Rhythmus** auf einem Ton, jetzt auch mit Achteln.',
    'Zwei Achtel klingen doppelt so schnell wie Viertel: Auf einen Schlag kommen zwei Töne.',
    'Zähl innerlich mit „1 und 2 und …“ und such das Notenbild, das dazu passt. Mit „Anhören“ hörst du ihn noch einmal.',
  ],
  neu(stufe) {
    const takt = stufe === 'leicht' ? 4 : waehle([4, 3]);
    const tempo = TEMPO[stufe];
    const mk = () => achtelTakt(takt, { achtelPausen: stufe === 'schwer', pausen: stufe === 'schwer' && Math.random() < 0.3 ? 1 : 0 });
    const richtig = [mk()];
    const ablenkungen = [];
    let schutz = 0;
    while (ablenkungen.length < (stufe === 'leicht' ? 1 : 2) && schutz++ < 400) {
      const a = [mk()];
      if (gleicheTakte(a, richtig) || ablenkungen.some((x) => gleicheTakte(x, a))) continue;
      // Hörbar verschieden: andere Notenanfänge
      if (anfaenge(a, takt) === anfaenge(richtig, takt) || ablenkungen.some((x) => anfaenge(x, takt) === anfaenge(a, takt))) continue;
      ablenkungen.push(a);
    }
    const abcAus = (takte) => kopf({ schluessel: 'perc', takt: `${takt}/4` }) + abcAchtel(takte);
    const optionen = mische([{ takte: richtig, wert: 'r' }, ...ablenkungen.map((t, i) => ({ takte: t, wert: 'a' + i }))]).map((o) => ({
      abc: abcAus(o.takte),
      wert: o.wert,
      breite: 190,
      scale: 1.2,
    }));
    const folge = einsaetze(richtig, takt).map((n) => ({ midi: n.pause ? null : RHYTHMUS_TON, schlaege: n.d }));
    const spiele = () => {
      const c = audio();
      const sps = 60 / tempo;
      const t0 = c.currentTime + 0.2;
      klicks(t0, tempo, takt, takt);
      const start = t0 + takt * sps;
      if (stufe === 'leicht') klicks(start, tempo, takt, takt, true);
      spieleFolge(folge, { tempo, start, art: 'orgel' });
    };
    return {
      frage: 'Welcher Rhythmus erklingt?',
      hinweis: takt === 3 ? 'Dreivierteltakt: eingezählt wird „1, 2, 3“.' : null,
      klang: spiele,
      klangAuto: true,
      optionen,
      spalten: 1,
      loesung: 'r',
      warum: `Gehört: ${zaehlWeise(richtig[0])}.`,
    };
  },
};
