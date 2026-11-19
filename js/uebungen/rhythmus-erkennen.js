import { waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { zufallsTakt, abcRhythmus, einsaetze, gleicheTakte, beschreibe } from './hilfen.js';

const TEMPO = { leicht: 76, mittel: 84, schwer: 92 };
const RHYTHMUS_TON = 67;

function anfaenge(takte, takt) {
  return einsaetze(takte, takt)
    .filter((n) => !n.pause)
    .map((n) => n.beginn)
    .join(',');
}

export default {
  id: 'rhythmus-erkennen',
  titel: 'Rhythmus erkennen',
  themaId: 'schlag-takt',
  aufgaben: 8,
  stufen: {
    leicht: 'Ein Takt, zwei Bilder zur Wahl',
    mittel: 'Mit Pausen, auch im 3/4-Takt',
    schwer: 'Zwei Takte, ähnliche Bilder',
  },
  erklaerung: [
    'Nach einem Takt Klicks zum Einzählen erklingt ein **Rhythmus** auf einem Ton.',
    'Zähl innerlich mit und such das Notenbild, das dazu passt. Mit „Anhören“ hörst du ihn noch einmal.',
  ],
  neu(stufe) {
    const takt = stufe === 'leicht' ? 4 : waehle([4, 3]);
    const anzahl = stufe === 'schwer' ? 2 : 1;
    const tempo = TEMPO[stufe];
    const mk = () =>
      Array.from({ length: anzahl }, () =>
        zufallsTakt(takt, { ganze: stufe === 'leicht', pausen: stufe === 'leicht' ? 0 : Math.random() < 0.5 ? 1 : 0 })
      );
    const richtig = mk();
    const ablenkungen = [];
    let schutz = 0;
    while (ablenkungen.length < (stufe === 'leicht' ? 1 : 2) && schutz++ < 200) {
      let a;
      if (stufe === 'schwer') {
        // nur ein Takt anders
        a = richtig.map((t) => t.map((n) => ({ ...n })));
        a[Math.floor(Math.random() * anzahl)] = zufallsTakt(takt, { pausen: Math.random() < 0.5 ? 1 : 0 });
      } else a = mk();
      if (gleicheTakte(a, richtig) || ablenkungen.some((x) => gleicheTakte(x, a))) continue;
      // In „leicht“ müssen sich schon die Notenanfänge unterscheiden
      if (stufe === 'leicht' && anfaenge(a, takt) === anfaenge(richtig, takt)) continue;
      ablenkungen.push(a);
    }
    const abcAus = (takte) => kopf({ schluessel: 'perc', takt: `${takt}/4` }) + abcRhythmus(takte);
    const optionen = mische([{ takte: richtig, wert: 'r' }, ...ablenkungen.map((t, i) => ({ takte: t, wert: 'a' + i }))]).map((o) => ({
      abc: abcAus(o.takte),
      wert: o.wert,
      breite: anzahl === 2 ? 280 : 170,
      scale: 1.2,
    }));
    const folge = einsaetze(richtig, takt).map((n) => ({ midi: n.pause ? null : RHYTHMUS_TON, schlaege: n.d }));
    const spiele = () => {
      const c = audio();
      const sps = 60 / tempo;
      const t0 = c.currentTime + 0.2;
      klicks(t0, tempo, takt, takt);
      const start = t0 + takt * sps;
      if (stufe !== 'schwer') klicks(start, tempo, takt * anzahl, takt, true);
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
      warum: `Gehört: ${richtig.map(beschreibe).join(' | ')}.`,
    };
  },
};
