// Etappe 6, „Was bedeutet das Zeichen?“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// leicht: nötige Station, häufige Zeichen. schwer: freiwillig, weitere Lautstärken, Klammern und Sprungzeichen.
import { STIMMEN, waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';

// Zeichen mit Bild (ABC, in C-Dur-Tönen eines Violinschlüssels, wird für den Bassschlüssel verschoben) und Bedeutung.
// ort: wo das Zeichen im Bild steht, für die Frage.
export const ZEICHEN = {
  wiederholung: { stufe: 'leicht', abc: '|: C D E F :|', name: 'Wiederholungszeichen', satz: 'Das sind Wiederholungszeichen.', bedeutung: 'Den Teil zwischen den Zeichen noch einmal singen' },
  fermate: { stufe: 'leicht', abc: 'C2 !fermata!D2 |]', name: 'Fermate', satz: 'Das ist eine Fermate.', bedeutung: 'Den Ton länger halten, so lange der Dirigent es zeigt' },
  atem: { stufe: 'leicht', abc: 'C2 !breath!y D2 |]', name: 'Atemzeichen', satz: 'Das ist ein Atemzeichen.', bedeutung: 'Hier atmen' },
  p: { stufe: 'leicht', abc: '!p!C2 D2 |]', name: 'p (piano)', satz: 'Das ist p, gesprochen „piano“.', bedeutung: 'Leise singen' },
  f: { stufe: 'leicht', abc: '!f!C2 D2 |]', name: 'f (forte)', satz: 'Das ist f, gesprochen „forte“.', bedeutung: 'Laut singen' },
  cresc: { stufe: 'leicht', abc: '!crescendo(!C D E !crescendo)!F |]', name: 'Crescendo', satz: 'Das ist eine sich öffnende Gabel, ein Crescendo.', bedeutung: 'Allmählich lauter werden' },
  dim: { stufe: 'leicht', abc: '!diminuendo(!F E D !diminuendo)!C |]', name: 'Decrescendo', satz: 'Das ist eine sich schließende Gabel, ein Decrescendo.', bedeutung: 'Allmählich leiser werden' },
  pp: { stufe: 'schwer', abc: '!pp!C2 D2 |]', name: 'pp (pianissimo)', satz: 'Das ist pp, gesprochen „pianissimo“.', bedeutung: 'Sehr leise singen' },
  ff: { stufe: 'schwer', abc: '!ff!C2 D2 |]', name: 'ff (fortissimo)', satz: 'Das ist ff, gesprochen „fortissimo“.', bedeutung: 'Sehr laut singen' },
  mp: { stufe: 'schwer', abc: '!mp!C2 D2 |]', name: 'mp (mezzopiano)', satz: 'Das ist mp, gesprochen „mezzopiano“.', bedeutung: 'Etwas leise singen' },
  mf: { stufe: 'schwer', abc: '!mf!C2 D2 |]', name: 'mf (mezzoforte)', satz: 'Das ist mf, gesprochen „mezzoforte“.', bedeutung: 'Etwas laut singen' },
  volta: { stufe: 'schwer', abc: '|: C D E F |1 G4 :|2 c4 |]', name: 'Klammern 1 und 2', satz: 'Das sind die Klammern 1 und 2.', bedeutung: 'Beim ersten Durchgang Klammer 1 singen und zurückgehen, beim zweiten Durchgang Klammer 1 auslassen und Klammer 2 singen' },
  dc: { stufe: 'schwer', abc: 'C D E !fine!F | G A B "^D.C. al Fine"c |]', name: 'D.C. al Fine', satz: 'Das ist „D.C. al Fine“, gesprochen „da capo al fine“.', bedeutung: 'Von vorn singen bis zum Wort Fine' },
  ds: { stufe: 'schwer', abc: 'C D !segno!E F | G !fine!A B "^D.S. al Fine"c |]', name: 'D.S. al Fine', satz: 'Das ist „D.S. al Fine“, gesprochen „dal segno al fine“. Das Segno-Zeichen sieht aus wie ein schräges S mit Strich und zwei Punkten.', bedeutung: 'Zurück zum Segno-Zeichen und von dort bis Fine singen' },
};

// Bedeutungen, die im Bild eines Zeichens ebenfalls zu sehen sind, dürfen dort keine Ablenkung sein
const AUCH_IM_BILD = { volta: ['wiederholung'] };

// Ähnliche Zeichen als Ablenkung bevorzugen (Lautstärke zu Lautstärke)
const GRUPPE = { p: 'laut', f: 'laut', pp: 'laut', ff: 'laut', mp: 'laut', mf: 'laut', cresc: 'gabel', dim: 'gabel' };

// Bass: alle Töne eine Oktave tiefer schreiben (C → C,), damit sie im Bassschlüssel im System stehen.
// Verzierungen (!…!), Texte ("…") und Klammern (|1, :|2) bleiben unverändert.
export function fuerSchluessel(abc, schluessel) {
  if (schluessel === 'treble') return abc;
  return abc.replace(/![^!]*!|"[^"]*"|[A-Ga-g]/g, (m) => {
    if (m.length > 1) return m;
    return m === m.toLowerCase() ? m.toUpperCase() : m + ',';
  });
}

let letzte = null;

export default {
  id: 'zeichen',
  titel: 'Was bedeutet das Zeichen?',
  themaId: 'zeichen',
  aufgaben: 8,
  stufen: {
    leicht: 'Wiederholung, Fermate, Atemzeichen, laut und leise',
    schwer: 'Weitere Lautstärken, Klammern, D.C., D.S. und Coda',
  },
  erklaerung: [
    'Im Notenbild stehen neben den Noten viele **Zeichen**. Sie sagen dir, wie du singst: laut oder leise, wo du atmest, was du wiederholst.',
    'Die Lautstärke steht als Buchstaben über oder unter den Noten: **p** heißt leise, **f** heißt laut. Eine sich öffnende Gabel heißt lauter werden, eine sich schließende leiser werden.',
    'Wiederholungszeichen sind zwei Punkte an einem doppelten Taktstrich. Was dazwischen steht, singst du zweimal.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const pool = Object.keys(ZEICHEN).filter((z) => (stufe === 'leicht' ? ZEICHEN[z].stufe === 'leicht' : true));
    let z;
    do z = waehle(stufe === 'schwer' && Math.random() < 0.7 ? pool.filter((x) => ZEICHEN[x].stufe === 'schwer') : pool);
    while (z === letzte);
    letzte = z;
    const andere = pool.filter((x) => x !== z && !(AUCH_IM_BILD[z] || []).includes(x));
    const nah = andere.filter((x) => GRUPPE[x] && GRUPPE[x] === GRUPPE[z]);
    const ablenkung = mische([...mische(nah).slice(0, 1), ...mische(andere.filter((x) => !nah.includes(x)))]).slice(0, 2);
    const eintrag = ZEICHEN[z];
    const optionen = mische([z, ...ablenkung]).map((x) => ({ text: ZEICHEN[x].bedeutung, wert: x }));
    return {
      frage: 'Was bedeutet das Zeichen?',
      bild: { abc: kopf({ schluessel: s, takt: null }) + fuerSchluessel(eintrag.abc, s), breite: 220, scale: 1.5, rechts: eintrag.abc.includes('al Fine') ? 70 : 8 },
      optionen,
      spalten: 1,
      loesung: z,
      warum: `${eintrag.satz} Bedeutung: ${eintrag.bedeutung}.`,
    };
  },
};
