// Etappe 8, „Punktiert hören“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Wie „Achtel hören“ aus Etappe 4, jetzt mit punktierten Noten und Haltebogen.
// leicht: nötige Station, ein 4/4-Takt, zwei Bilder. schwer: freiwillig, mit Haltebogen, auch 3/4, drei Bilder.
import { waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { punktTakt, abcAchtel, klingend, zaehlWeise } from './hilfen.js';

const TEMPO = { leicht: 72, schwer: 80 };
const RHYTHMUS_TON = 67;

const anfaenge = (takt, schlaege) =>
  klingend([takt], schlaege)
    .map((n) => n.beginn)
    .join(',');

export default {
  id: 'punkt-hoeren',
  titel: 'Punktiert hören',
  themaId: 'punktierung',
  aufgaben: 8,
  stufen: {
    leicht: 'Ein Takt, zwei Bilder zur Wahl',
    schwer: 'Mit Haltebogen, auch im 3/4-Takt, drei Bilder',
  },
  erklaerung: [
    'Nach einem Takt Klicks zum Einzählen erklingt ein **Rhythmus** auf einem Ton, jetzt mit punktierten Noten.',
    'Eine punktierte Viertel mit Achtel klingt „lang – kurz“: Der zweite Ton kommt spät, erst auf dem „und“.',
    'Zähl innerlich mit „1 und 2 und …“ und such das Notenbild, das dazu passt.',
  ],
  neu(stufe) {
    const schlaege = stufe === 'leicht' ? 4 : waehle([4, 3]);
    const tempo = TEMPO[stufe];
    const mk = () => punktTakt(schlaege, { bogen: stufe === 'schwer' && Math.random() < 0.5 });
    const richtig = mk();
    const ablenkungen = [];
    let schutz = 0;
    while (ablenkungen.length < (stufe === 'leicht' ? 1 : 2) && schutz++ < 400) {
      const a = mk();
      // Hörbar verschieden: andere Tonanfänge als die richtige und die anderen Ablenkungen
      if ([richtig, ...ablenkungen].some((x) => anfaenge(x, schlaege) === anfaenge(a, schlaege))) continue;
      ablenkungen.push(a);
    }
    const abcAus = (takt) => kopf({ schluessel: 'perc', takt: `${schlaege}/4` }) + abcAchtel([takt]);
    const optionen = mische([{ takt: richtig, wert: 'r' }, ...ablenkungen.map((t, i) => ({ takt: t, wert: 'a' + i }))]).map((o) => ({
      abc: abcAus(o.takt),
      wert: o.wert,
      breite: 190,
      scale: 1.2,
    }));
    const folge = klingend([richtig], schlaege).map((n) => ({ midi: n.pause ? null : RHYTHMUS_TON, schlaege: n.d }));
    const spiele = () => {
      const c = audio();
      const sps = 60 / tempo;
      const t0 = c.currentTime + 0.2;
      klicks(t0, tempo, schlaege, schlaege);
      const start = t0 + schlaege * sps;
      if (stufe === 'leicht') klicks(start, tempo, schlaege, schlaege, true);
      spieleFolge(folge, { tempo, start, art: 'orgel' });
    };
    return {
      frage: 'Welcher Rhythmus erklingt?',
      hinweis: schlaege === 3 ? 'Dreivierteltakt: eingezählt wird „1, 2, 3“.' : null,
      klang: spiele,
      klangAuto: true,
      optionen,
      spalten: 1,
      loesung: 'r',
      warum: `Gehört: ${zaehlWeise(richtig)}.`,
    };
  },
};
