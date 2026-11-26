// Etappe 5, „Ziffern hören“ (id bleibt stufen-hoeren; „Stufe“ meint in der App den Schwierigkeitsgrad). Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Erst erklingt 1–3–5–3–1 in einer Dur-Tonart, dann ein Ton: Welche Ziffer? Gehört wird in wechselnden Tonarten.
// leicht: nötige Station, nur 1, 3 und 5. schwer: freiwillig, alle Stufen.
import { zufall, waehle } from '../musik.js';
import { spieleFolge } from '../klang.js';
import { ziffer, halbtoeneBis, GRUNDTON } from './ziffern.js';

let letzte = null;

export default {
  id: 'stufen-hoeren',
  titel: 'Ziffern hören',
  themaId: 'ziffern',
  aufgaben: 8,
  stufen: {
    leicht: 'Die 1, 3 oder 5',
    schwer: 'Alle Ziffern von 1 bis 7',
  },
  erklaerung: [
    'Zuerst hörst du **1 – 3 – 5 – 3 – 1**. So weißt du, wo die 1 liegt. Dann kommt nach einer kleinen Pause ein einzelner Ton.',
    'Der Ton liegt immer zwischen der 1 und der 7 darüber. Welche Ziffer hat er? Sing innerlich von der 1 aus die Tonleiter hinauf, bis du beim Ton bist.',
    'Die 1 liegt bei jeder Aufgabe auf einem anderen Ton. Du erkennst sie am Anfang an 1 – 3 – 5 – 3 – 1.',
  ],
  neu(stufe, k) {
    const [tief, hoch] = GRUNDTON[k.stimme] || GRUNDTON.S;
    const grund = zufall(tief, hoch);
    const moeglich = stufe === 'leicht' ? [0, 2, 4] : [0, 1, 2, 3, 4, 5, 6];
    let st;
    do st = waehle(moeglich);
    while (st === letzte);
    letzte = st;
    const m = (x) => grund + halbtoeneBis(x);
    const folge = [0, 2, 4, 2, 0].map((x) => ({ midi: m(x), schlaege: 0.75 })).concat([{ midi: null, schlaege: 1 }, { midi: m(st), schlaege: 2 }]);
    const spiele = () => spieleFolge(folge, { tempo: 96 });
    const z = ziffer(st);
    return {
      frage: 'Welche Ziffer hat der letzte Ton?',
      klang: spiele,
      klangAuto: true,
      optionen: moeglich.map((x) => ({ text: ziffer(x), wert: ziffer(x) })),
      spalten: moeglich.length === 3 ? 3 : 4,
      loesung: z,
      warum: st > 0 ? `Der Ton war die ${z}. Du hörst jetzt die Tonleiter von der 1 bis zur ${z}.` : 'Der Ton war die 1, derselbe Ton wie am Anfang.',
      nachherText: st > 0 ? `Du hörst jetzt die Tonleiter von der 1 bis zur ${z}.` : 'Derselbe Ton wie am Anfang.',
      nachher: () => spieleFolge(Array.from({ length: st + 1 }, (_, x) => ({ midi: m(x), schlaege: x === st ? 1.5 : 0.5 })), { tempo: 100 }),
      stufeIndex: st, // für die Prüfung
    };
  },
};
