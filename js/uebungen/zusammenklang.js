// Etappe 9, „Zusammenklang“: Dur oder Moll, der Dreiklang, der Einsatzton. Vorschlag von Claude vom 26.11.2026,
// umgesetzt, nicht entschieden (LERNWEG.md, „Stationen der Etappe 9“). „Die eigene Stimme im Satz hören“ ist noch offen.
import { STIMMEN, abcTon, midi, waehle, mische, zufall } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge, akkord, jetzt, audio } from '../klang.js';
import { notenname, diaAusPosIn } from './namen.js';
import { GRUNDTON } from './ziffern.js';
import { singAufgabe } from './singen.js';

const DUR = [0, 4, 7];
const MOLL = [0, 3, 7];

let letzteDurMoll = null;

export const durMoll = {
  id: 'dur-moll',
  titel: 'Dur oder Moll?',
  themaId: 'zusammenklang',
  aufgaben: 8,
  stufen: {
    leicht: 'Die drei Töne erst nacheinander, dann zusammen',
    schwer: 'Nur zusammen',
  },
  erklaerung: [
    'Ein **Dreiklang** besteht aus drei Tönen. Zählst du vom untersten Ton des Dreiklangs aus, sind es die 1, die 3 und die 5.',
    'Ein **Dur**-Dreiklang klingt meist hell und fest. Ein **Moll**-Dreiklang klingt meist dunkler und weicher.',
    'Der Unterschied liegt im mittleren Ton: Bei Moll ist er einen Halbton tiefer als bei Dur auf demselben untersten Ton.',
  ],
  neu(stufe, k) {
    const [tief, hoch] = GRUNDTON[k.stimme] || GRUNDTON.S;
    const grund = zufall(tief, hoch);
    let dur;
    do dur = Math.random() < 0.5;
    while (stufe === 'schwer' && dur === letzteDurMoll && Math.random() < 0.5);
    letzteDurMoll = dur;
    const toene = (dur ? DUR : MOLL).map((x) => grund + x);
    const spiele = () => {
      const c = audio();
      const t0 = c.currentTime + 0.1;
      if (stufe === 'leicht') {
        spieleFolge(toene.map((m) => ({ midi: m, schlaege: 0.8 })), { tempo: 90, start: t0 });
        akkord(toene, t0 + (60 / 90) * 2.6, 1.6);
      } else akkord(toene, t0, 1.8);
    };
    return {
      frage: 'Klingt der Dreiklang nach Dur oder nach Moll?',
      klang: spiele,
      klangAuto: true,
      optionen: [{ text: 'Dur', wert: 'dur' }, { text: 'Moll', wert: 'moll' }],
      loesung: dur ? 'dur' : 'moll',
      warum: dur
        ? 'Das war Dur: Der mittlere Ton liegt einen Halbton höher als bei Moll, der Klang ist heller. Zum Vergleich hörst du jetzt erst Dur, dann Moll.'
        : 'Das war Moll: Der mittlere Ton liegt einen Halbton tiefer als bei Dur, der Klang ist dunkler. Zum Vergleich hörst du jetzt erst Dur, dann Moll.',
      nachher: () => {
        // Zum Vergleich: erst Dur, dann Moll auf demselben Grundton
        const t0 = jetzt() + 0.1;
        akkord(DUR.map((x) => grund + x), t0, 1.1);
        akkord(MOLL.map((x) => grund + x), t0 + 1.4, 1.1);
      },
      nachherText: 'Zum Vergleich hörst du jetzt erst Dur, dann Moll.',
      dur, // für die Prüfung
    };
  },
};

// Dreiklänge aus weißen Tasten: Grundton-Position im Notensystem, drei Töne im Terzabstand (je zwei Positionen)
let letzteDreiklang = null;

export const dreiklang = {
  id: 'dreiklang',
  titel: 'Der Dreiklang',
  themaId: 'zusammenklang',
  aufgaben: 8,
  stufen: {
    leicht: 'Welches Bild zeigt einen Dreiklang?',
    schwer: 'Welche Töne hat der Dreiklang?',
  },
  erklaerung: [
    'Ein **Dreiklang** sind drei Töne im Abstand von Terzen übereinander, zum Beispiel c, e und g.',
    'Im Notenbild erkennst du ihn leicht: Die drei Noten stehen jeweils eine Terz übereinander, also alle auf Linien oder alle in Zwischenräumen.',
    'Vom untersten Ton aus zählst du jeweils eine Terz weiter: c – e – g, d – f – a, und so fort.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    let p;
    // Im System (Dreiklänge sind hier Bilder, keine Töne zum Singen). Ohne den Dreiklang auf h:
    // h–d–f ist weder Dur noch Moll und würde die Regel aus „Dur oder Moll?“ widerlegen.
    do p = zufall(0, 4);
    while (p === letzteDreiklang || notenname(diaAusPosIn(s, p)) === 'h');
    letzteDreiklang = p;
    const name = (x) => notenname(diaAusPosIn(s, x));
    const akk = (lagen) => kopf({ schluessel: s }) + `x2 [${lagen.map((x) => abcTon(diaAusPosIn(s, x))).join('')}]4 x2 |]`;
    const richtig = [p, p + 2, p + 4];
    if (stufe === 'leicht') {
      const falsch = mische([
        [p, p + 1, p + 2],
        [p, p + 2, p + 3],
        [p, p + 3, p + 4],
        [p, p + 1, p + 4],
      ]).slice(0, 2);
      const optionen = mische([{ lagen: richtig, wert: 'r' }, ...falsch.map((l, i) => ({ lagen: l, wert: 'a' + i }))]).map((o) => ({
        abc: akk(o.lagen),
        wert: o.wert,
        breite: 70,
        scale: 1.5,
      }));
      return {
        frage: 'Welches Bild zeigt einen Dreiklang?',
        optionen,
        spalten: 3,
        loesung: 'r',
        warum: `Beim Dreiklang stehen die drei Noten im Notenbild jeweils eine Terz übereinander, alle auf Linien oder alle in Zwischenräumen. Hier: ${richtig.map(name).join(', ')}.`,
        nachher: () => akkord(richtig.map((x) => midi(diaAusPosIn(s, x))), jetzt() + 0.05, 1.3),
      };
    }
    const text = (l) => l.map(name).join(' – ');
    const falsch = [
      [p, p + 1, p + 2],
      [p, p + 3, p + 5],
      [p, p + 2, p + 5],
    ];
    const optionen = mische([richtig, ...mische(falsch).slice(0, 2)]).map((l) => ({ text: text(l), wert: text(l) }));
    return {
      frage: `Welche Töne hat der Dreiklang auf ${name(p)}?`,
      bild: { abc: akk(richtig), breite: 150, scale: 1.8 },
      optionen,
      spalten: 1,
      loesung: text(richtig),
      warum: `Vom ${name(p)} aus jeweils eine Terz weiter: ${text(richtig)}. Im Bild stehen die drei Noten direkt übereinander.`,
      nachher: () => akkord(richtig.map((x) => midi(diaAusPosIn(s, x))), jetzt() + 0.05, 1.3),
    };
  },
};

let letzteEinsatz = null;

export const einsatzton = {
  id: 'einsatzton',
  titel: 'Der Einsatzton',
  themaId: 'zusammenklang',
  singTitel: 'Einsatzton singen', // Titel der Stufe „mittel“ (Selbst singen)
  aufgaben: 8,
  stufen: {
    leicht: 'Der Ton liegt im Dreiklang',
    // „mittel“ ist hier keine Schwierigkeit, sondern das Selbersingen (freiwillige Station „Einsatzton singen“, 27.11.2026)
    mittel: 'Den Einsatzton selbst singen',
    schwer: 'Der Ton liegt auch eine Oktave höher oder tiefer',
  },
  erklaerung: [
    'Vor dem Singen spielt das Klavier oft einen **Dreiklang**. Daraus nimmt jede Stimme ihren **Einsatzton**, also den ersten Ton, den sie singt.',
    'Hier hörst du die drei Töne erst nacheinander, dann zusammen, danach einen einzelnen Ton. Ist er die 1, die 3 oder die 5 des Dreiklangs?',
    'Der Einsatzton kann auch eine Oktave höher oder tiefer liegen. Er hat dann trotzdem dieselbe Ziffer, so wie die obere 1 die 1 bleibt.',
  ],
  neu(stufe, k) {
    const [tief, hoch] = GRUNDTON[k.stimme] || GRUNDTON.S;
    const grund = zufall(tief, hoch);
    if (stufe === 'mittel') return einsatztonSingen(grund);
    let st;
    do st = waehle([0, 1, 2]);
    while (st === letzteEinsatz);
    letzteEinsatz = st;
    const toene = DUR.map((x) => grund + x);
    let einsatz = toene[st];
    if (stufe === 'schwer') einsatz += waehle([0, 12, -12].filter((o) => !(st === 0 && o === -12 && grund < 48)));
    const spiele = () => {
      const c = audio();
      const t0 = c.currentTime + 0.1;
      spieleFolge(toene.map((m) => ({ midi: m, schlaege: 0.7 })), { tempo: 96, start: t0 });
      const sps = 60 / 96;
      akkord(toene, t0 + sps * 2.3, 1.2);
      spieleFolge([{ midi: einsatz, schlaege: 1.6 }], { tempo: 96, start: t0 + sps * 2.3 + 2 });
    };
    const z = ['1', '3', '5'][st];
    return {
      frage: 'Welcher Ton des Dreiklangs ist der Einsatzton?',
      klang: spiele,
      klangAuto: true,
      optionen: ['1', '3', '5'].map((x) => ({ text: x, wert: x })),
      spalten: 3,
      loesung: z,
      warum: `Der Einsatzton war die ${z} des Dreiklangs.${einsatz !== toene[st] ? ' Er lag eine Oktave ' + (einsatz > toene[st] ? 'höher' : 'tiefer') + '.' : ''}`,
      nachher: () => spieleFolge([{ midi: toene[st], schlaege: 0.8 }, { midi: einsatz, schlaege: 1.2 }], { tempo: 90 }),
      stufeIndex: st, // für die Prüfung
    };
  },
};

let letzteGesungen = null;
function einsatztonSingen(grund) {
  let st;
  do st = waehle([0, 1, 2]);
  while (st === letzteGesungen);
  letzteGesungen = st;
  const toene = DUR.map((x) => grund + x);
  const z = ['1', '3', '5'][st];
  const welcher = ['den tiefsten Ton', 'den mittleren Ton', 'den höchsten Ton'][st];
  const vorspiel = () => {
    const c = audio();
    const t0 = c.currentTime + 0.1;
    spieleFolge(toene.map((m) => ({ midi: m, schlaege: 0.7 })), { tempo: 96, start: t0 });
    akkord(toene, t0 + (60 / 96) * 2.3, 1.4);
  };
  return singAufgabe({
    frage: `Sing die ${z} des Dreiklangs.`,
    hinweis: `Du hörst die drei Töne von unten nach oben, die 1, die 3 und die 5. Dann klingen sie zusammen, so wie das Klavier vor dem Einsatz. Sing daraus die ${z}, also ${welcher}. Danach tippst du auf „Lösung hören“ und vergleichst.`,
    vorspiel,
    loesung: () => spieleFolge([{ midi: toene[st], schlaege: 2 }], { tempo: 90 }),
    nachherText: `Die Lösung spielt die ${z} des Dreiklangs.`,
    trefferFrage: `Hast du die ${z} getroffen?`,
  });
}
