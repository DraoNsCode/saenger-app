// Etappe 6, „Welche Reihenfolge?“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Takte mit Buchstaben A, B, C, D; Wiederholungen und Sprünge bestimmen, in welcher Reihenfolge man sie singt.
// leicht: nötige Station, Wiederholungszeichen. schwer: freiwillig, Klammern 1 und 2, D.C. al Fine, D.S. al Fine.
import { STIMMEN, waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { fuerSchluessel } from './zeichen.js';

// abc in Tönen für den Violinschlüssel; reihe: richtige Reihenfolge; falsch: typische Fehler; warum: die Regel
export const ABLAEUFE = [
  { stufe: 'leicht', abc: '|: "_A"C4 | "_B"D4 :| "_C"E4 |]', reihe: 'A B A B C', falsch: ['A B C', 'A B C A B C'], warum: 'Zwischen den Wiederholungszeichen stehen A und B. Du singst sie zweimal, dann geht es mit C weiter.' },
  { stufe: 'leicht', abc: '"_A"C4 |: "_B"D4 | "_C"E4 :| "_D"F4 |]', reihe: 'A B C B C D', falsch: ['A B C A B C D', 'A B C D B C'], warum: 'Die Wiederholung beginnt erst bei B. Nach C springst du zurück zu B, nicht an den Anfang.' },
  { stufe: 'leicht', abc: '"_A"C4 | "_B"D4 :| "_C"E4 |]', reihe: 'A B A B C', falsch: ['A B B C', 'A B C'], warum: 'Fehlt das Anfangszeichen der Wiederholung, wiederholst du von Anfang an.' },
  { stufe: 'leicht', abc: '|: "_A"C4 | "_B"D4 :: "_C"E4 | "_D"F4 :|', reihe: 'A B A B C D C D', falsch: ['A B C D A B C D', 'A B A B C D'], warum: 'Das sind zwei Wiederholungen hintereinander: zuerst A und B zweimal, dann C und D zweimal.' },
  { stufe: 'schwer', abc: '|: "_A"C4 | "_B"D4 |1 "_C"E4 :|2 "_D"F4 |]', reihe: 'A B C A B D', falsch: ['A B C A B C D', 'A B C D'], warum: 'Beim ersten Durchgang singst du Klammer 1 (C) und gehst zurück zum Anfang. Beim zweiten Durchgang lässt du Klammer 1 aus und singst Klammer 2 (D).' },
  { stufe: 'schwer', abc: '"_A"C4 |: "_B"D4 |1 "_C"E4 :|2 "_D"F4 |]', reihe: 'A B C B D', falsch: ['A B C A B D', 'A B C B C D'], warum: 'Die Wiederholung beginnt bei B. Nach Klammer 1 (C) gehst du zurück zu B. Beim zweiten Durchgang lässt du Klammer 1 aus und singst Klammer 2 (D).' },
  { stufe: 'schwer', abc: '"_A"C4 | "_B"!fine!D4 | "_C"E4 | "^D.C. al Fine""_D"F4 |]', reihe: 'A B C D A B', falsch: ['A B C D A B C D', 'A B C D'], warum: 'D.C. al Fine heißt: von vorn bis zum Wort Fine. Fine steht über Takt B: Takt B singst du noch, danach endet das Stück.' },
  { stufe: 'schwer', abc: '"_A"C4 | "_B"!segno!D4 | "_C"!fine!E4 | "^D.S. al Fine""_D"F4 |]', reihe: 'A B C D B C', falsch: ['A B C D A B C', 'A B C D B C D'], warum: 'D.S. al Fine heißt: zurück zum Segno-Zeichen über Takt B und von dort bis Fine über Takt C. Takt C singst du noch, danach endet das Stück.' },
];

let letzte = null;

export default {
  id: 'ablauf',
  titel: 'Welche Reihenfolge?',
  themaId: 'zeichen',
  aufgaben: 8,
  stufen: {
    leicht: 'Wiederholungszeichen',
    schwer: 'Klammern 1 und 2, D.C. und D.S.',
  },
  erklaerung: [
    'Die Buchstaben unter den Takten gibt es nur in dieser Übung. Sie helfen dir, die Reihenfolge anzugeben.',
    'Zwischen **Wiederholungszeichen** (Doppelstrich mit zwei Punkten) singst du alles zweimal. Fehlt das Anfangszeichen, wiederholst du von Anfang an.',
    'Bei **Klammern 1 und 2** singst du beim ersten Durchgang Klammer 1 und gehst zurück. Beim zweiten Durchgang lässt du Klammer 1 aus und singst Klammer 2.',
    '**D.C. al Fine** heißt: von vorn bis „Fine“. **D.S. al Fine** heißt: zurück zum Segno-Zeichen (ein schräges S mit Strich und zwei Punkten) und von dort bis „Fine“. Den Takt, über dem „Fine“ steht, singst du noch.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const pool = ABLAEUFE.filter((a) => (stufe === 'leicht' ? a.stufe === 'leicht' : true));
    let a;
    do a = waehle(stufe === 'schwer' && Math.random() < 0.7 ? pool.filter((x) => x.stufe === 'schwer') : pool);
    while (a === letzte);
    letzte = a;
    return {
      frage: 'In welcher Reihenfolge singst du die Takte?',
      bild: { abc: kopf({ schluessel: s, takt: '4/4' }) + fuerSchluessel(a.abc, s), breite: 260, scale: 1.3, rechts: a.abc.includes('al Fine') ? 70 : 8 },
      optionen: mische([a.reihe, ...a.falsch]).map((r) => ({ text: r, wert: r })),
      spalten: 1,
      loesung: a.reihe,
      warum: a.warum,
    };
  },
};
