// Etappe 7, „Intervalle lesen“ und „Intervalle hören“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden
// (LERNWEG.md, „Stationen der Etappe 7“). Groß und klein (etwa große und kleine Terz) werden noch nicht unterschieden.
// Merklieder aus dem Chorliederbuch (Baustein H) kommen später dazu, wenn Daniel die Lieder ausgewählt hat.
import { STIMMEN, abcTon, midi, waehle, mische, zufall } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge, akkord, jetzt } from '../klang.js';
import { notenname, bereichPos, diaAusPosIn } from './namen.js';
import { halbtoeneBis, GRUNDTON } from './ziffern.js';
import { singAufgabe } from './singen.js';

// Größe in Notenschritten (1 = Sekunde) → Name
export const INTERVALL = { 1: 'Sekunde', 2: 'Terz', 3: 'Quarte', 4: 'Quinte', 5: 'Sexte', 6: 'Septime', 7: 'Oktave' };

// Antworten: die richtige und Nachbarn, damit die Wahl nicht zu leicht wird
function optionen(richtig, groessen, anzahl) {
  const nah = mische(groessen.filter((g) => g !== richtig)).sort((a, b) => Math.abs(a - richtig) - Math.abs(b - richtig));
  return [richtig, ...nah.slice(0, anzahl - 1)].sort((a, b) => a - b).map((g) => ({ text: INTERVALL[g], wert: String(g) }));
}

let letzteLesen = null;
let letzteHoeren = null;

export const intervallLesen = {
  id: 'intervall-lesen',
  titel: 'Intervalle lesen',
  themaId: 'intervalle',
  aufgaben: 8,
  stufen: {
    leicht: 'Sekunde bis Quinte, nacheinander',
    schwer: 'Bis zur Oktave, auch übereinander',
  },
  erklaerung: [
    'Ein **Intervall** ist der Abstand zwischen zwei Tönen. Sein Name kommt von einer lateinischen Zahl und sagt, wie viele Notennamen er umfasst.',
    'Zähl die Notennamen, beide Noten mit: Von c bis e sind es c, d, e, also drei. Das ist eine **Terz** (drei).',
    'Sekunde (2), Terz (3), Quarte (4), Quinte (5), Sexte (6), Septime (7), Oktave (8).',
    'Im Notenbild: Bei einer **Sekunde** steht eine Note auf einer Linie und die andere im Zwischenraum direkt daneben. Bei einer **Terz** stehen beide auf benachbarten Linien oder in benachbarten Zwischenräumen.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const [von, bis] = bereichPos(k.stimme);
    const groessen = stufe === 'leicht' ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7];
    let g;
    let p1;
    do {
      g = waehle(groessen);
      p1 = zufall(von, bis - g);
      // f–h (Quarte) und h–f (Quinte) klingen anders als die gehörten Quarten und Quinten: weglassen
      const unten = notenname(diaAusPosIn(s, p1));
      if ((unten === 'f' && g === 3) || (unten === 'h' && g === 4)) p1 = -99;
    } while (`${g}/${p1}` === letzteLesen || p1 < von || p1 + g > bis);
    letzteLesen = `${g}/${p1}`;
    const zusammen = stufe === 'schwer' && Math.random() < 0.4;
    const runter = !zusammen && Math.random() < 0.4;
    const [a, b] = runter ? [p1 + g, p1] : [p1, p1 + g];
    const d1 = diaAusPosIn(s, a);
    const d2 = diaAusPosIn(s, b);
    const reihe = [];
    for (let p = Math.min(a, b); p <= Math.max(a, b); p++) reihe.push(notenname(diaAusPosIn(s, p)));
    const abc = zusammen ? kopf({ schluessel: s }) + `x2 [${abcTon(d1)}${abcTon(d2)}]4 x2 |]` : kopf({ schluessel: s }) + `x ${abcTon(d1)}2 ${abcTon(d2)}2 x |]`;
    return {
      frage: zusammen ? 'Welches Intervall bilden die beiden Noten?' : 'Welches Intervall ist das?',
      bild: { abc, breite: 180, scale: 1.8 },
      optionen: optionen(g, groessen, 4),
      spalten: 2,
      loesung: String(g),
      warum: `Zähl die Notennamen, beide Noten mit: ${reihe.join(', ')}. Das sind ${g + 1}, also eine ${INTERVALL[g]}.`,
      nachher: () =>
        zusammen ? akkord([midi(d1), midi(d2)], jetzt() + 0.05, 1.2) : spieleFolge([{ midi: midi(d1), schlaege: 1 }, { midi: midi(d2), schlaege: 1.5 }], { tempo: 80 }),
      groesse: g, // für die Prüfung
    };
  },
};

// Merkhilfe über die Ziffern aus Etappe 5: Intervall ab der 1
const ZIFFER_HILFE = { 1: 'von der 1 zur 2', 2: 'von der 1 zur 3', 3: 'von der 1 zur 4', 4: 'von der 1 zur 5', 5: 'von der 1 zur 6', 6: 'von der 1 zur 7', 7: 'von der 1 zur oberen 1' };

export const intervallHoeren = {
  id: 'intervall-hoeren',
  titel: 'Intervalle hören',
  themaId: 'intervalle',
  singTitel: 'Intervalle singen', // Titel der Stufe „mittel“ (Selbst singen)
  aufgaben: 8,
  stufen: {
    leicht: 'Terz, Quinte oder Oktave',
    // „mittel“ ist hier keine Schwierigkeit, sondern das Selbersingen (freiwillige Station „Intervalle singen“, 27.11.2026)
    mittel: 'Intervalle selbst singen',
    schwer: 'Sekunde bis Oktave',
  },
  erklaerung: [
    'Du hörst zwei Töne nacheinander, der zweite ist höher. Wie groß ist der Abstand?',
    'Denk an die Ziffern: Eine **Terz** klingt wie von der 1 zur 3, eine **Quinte** wie von der 1 zur 5, eine **Oktave** wie von der 1 zur oberen 1.',
    'Sing innerlich die Tonleiter vom ersten Ton aus hinauf und zähl mit, bis du beim zweiten Ton bist.',
  ],
  neu(stufe, k) {
    const [tief, hoch] = GRUNDTON[k.stimme] || GRUNDTON.S;
    const grund = zufall(tief, hoch);
    if (stufe === 'mittel') return intervallSingen(grund);
    const groessen = stufe === 'leicht' ? [2, 4, 7] : [1, 2, 3, 4, 5, 6, 7];
    let g;
    do g = waehle(groessen);
    while (g === letzteHoeren);
    letzteHoeren = g;
    const zweiter = grund + (g === 7 ? 12 : halbtoeneBis(g));
    const spiele = () => spieleFolge([{ midi: grund, schlaege: 1.2 }, { midi: zweiter, schlaege: 1.6 }], { tempo: 76 });
    return {
      frage: 'Welches Intervall hörst du?',
      klang: spiele,
      klangAuto: true,
      optionen: stufe === 'leicht' ? groessen.map((x) => ({ text: INTERVALL[x], wert: String(x) })) : optionen(g, groessen, 4),
      spalten: stufe === 'leicht' ? 3 : 2,
      loesung: String(g),
      warum: `Das war eine ${INTERVALL[g]}, wie ${ZIFFER_HILFE[g]}. Du hörst jetzt die Tonleiter dazwischen.`,
      nachherText: `Wie ${ZIFFER_HILFE[g]}.`,
      nachher: () => spieleFolge(Array.from({ length: g + 1 }, (_, x) => ({ midi: grund + (x === 7 ? 12 : halbtoeneBis(x)), schlaege: x === g ? 1.5 : 0.5 })), { tempo: 100 }),
      groesse: g, // für die Prüfung
    };
  },
};

let letzteGesungen = null;
// Terz, Quarte oder Quinte aufwärts: in jeder Stimme bequem zu singen
function intervallSingen(grund) {
  let g;
  do g = waehle([2, 3, 4]);
  while (g === letzteGesungen);
  letzteGesungen = g;
  const zweiter = grund + halbtoeneBis(g);
  return singAufgabe({
    frage: `Sing eine ${INTERVALL[g]} nach oben.`,
    hinweis: `Du hörst einen Ton, das ist deine 1. Sing ihn nach und dann den Ton eine ${INTERVALL[g]} höher, wie ${ZIFFER_HILFE[g]}. Danach tippst du auf „Lösung hören“ und vergleichst den zweiten Ton.`,
    vorspiel: () => spieleFolge([{ midi: grund, schlaege: 2 }], { tempo: 76 }),
    loesung: () => spieleFolge([{ midi: grund, schlaege: 1.2 }, { midi: zweiter, schlaege: 2 }], { tempo: 76 }),
    nachherText: `Eine ${INTERVALL[g]} klingt wie ${ZIFFER_HILFE[g]}.`,
    trefferFrage: 'Hast du den zweiten Ton getroffen?',
  });
}
