// Etappe 10, „Vorzeichen und Tonarten“: Kreuz, Be und Auflösungszeichen; die 1 finden. Vorschlag von Claude vom
// 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md, „Stationen der Etappe 10“).
// In Moll ist der Moll-Grundton die 1 (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
import { STIMMEN, abcTon, midi, waehle, mische, zufall } from '../musik.js';
import { kopf } from '../noten.js';
import { ton, jetzt } from '../klang.js';
import { notenname, bereichPos, diaAusPosIn } from './namen.js';

// Namen mit Vorzeichen (nur die schwarzen Tasten; eis, his, ces und fes kommen im Chor kaum vor)
export const KREUZ = { c: 'cis', d: 'dis', f: 'fis', g: 'gis', a: 'ais' };
export const BE = { d: 'des', e: 'es', g: 'ges', a: 'as', h: 'b' };

// Tonarten: ABC-Tonart, Vorzeichen, Dur-1, Moll-1
export const TONARTEN = [
  { abc: 'G', art: 'kreuz', zahl: 1, dur: 'g', moll: 'e' },
  { abc: 'D', art: 'kreuz', zahl: 2, dur: 'd', moll: 'h' },
  { abc: 'A', art: 'kreuz', zahl: 3, dur: 'a', moll: 'fis' },
  { abc: 'E', art: 'kreuz', zahl: 4, dur: 'e', moll: 'cis' },
  { abc: 'F', art: 'be', zahl: 1, dur: 'f', moll: 'd' },
  { abc: 'Bb', art: 'be', zahl: 2, dur: 'b', moll: 'g' },
  { abc: 'Eb', art: 'be', zahl: 3, dur: 'es', moll: 'c' },
  { abc: 'Ab', art: 'be', zahl: 4, dur: 'as', moll: 'f' },
];
const KREUZ_FOLGE = ['fis', 'cis', 'gis', 'dis'];
const BE_FOLGE = ['b', 'es', 'as', 'des'];

function kopfMitTonart(schluessel, tonart, takt = null) {
  return kopf({ schluessel, takt }).replace('K:C clef=', `K:${tonart} clef=`);
}

let letzteNote = null;

export const vorzeichen = {
  id: 'vorzeichen',
  titel: 'Kreuz und Be',
  themaId: 'tonarten',
  aufgaben: 8,
  stufen: {
    leicht: 'Wie heißt die Note mit Vorzeichen?',
    schwer: 'Gilt das Vorzeichen noch?',
  },
  erklaerung: [
    'Ein **Kreuz** ♯ vor einer Note macht sie einen Halbton höher. An den Namen hängst du **„is“**: f wird fis, c wird cis.',
    'Ein **Be** ♭ macht sie einen Halbton tiefer. An den Namen hängst du **„es“**: d wird des, g wird ges. Ausnahmen: e wird **es**, a wird **as** und h wird **b**.',
    'Ein Vorzeichen vor einer Note gilt bis zum Ende des Takts. Ein **Auflösungszeichen** ♮ hebt es vorher auf.',
    'Auf der Klaviatur sind die Töne mit Vorzeichen meist die schwarzen Tasten.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const [von, bis] = bereichPos(k.stimme);
    const kreuz = Math.random() < 0.5;
    const tabelle = kreuz ? KREUZ : BE;
    let p;
    do p = zufall(Math.max(von, -1), Math.min(bis, 9));
    while (!tabelle[notenname(diaAusPosIn(s, p))] || p === letzteNote);
    letzteNote = p;
    const dia = diaAusPosIn(s, p);
    const grund = notenname(dia);
    const mitZeichen = tabelle[grund];
    const zeichen = kreuz ? '^' : '_';
    const klang = midi(dia) + (kreuz ? 1 : -1);
    if (stufe === 'leicht') {
      const andere = kreuz ? BE : KREUZ;
      const nachbarn = Object.values(tabelle).filter((n) => n !== mitZeichen);
      const pool = [grund, ...(andere[grund] ? [andere[grund]] : []), ...mische(nachbarn).slice(0, 2)];
      const optionen = mische([mitZeichen, ...mische(pool).slice(0, 3)]).map((n) => ({ text: n, wert: n }));
      const regel = kreuz
        ? `Das Kreuz macht das ${grund} einen Halbton höher. Aus ${grund} wird ${mitZeichen}.`
        : `Das Be macht das ${grund} einen Halbton tiefer. Aus ${grund} wird ${mitZeichen}.${['e', 'a', 'h'].includes(grund) ? ' Das ist eine der Ausnahmen.' : ''}`;
      return {
        frage: 'Wie heißt die Note?',
        bild: { abc: kopf({ schluessel: s }) + `x2 ${zeichen}${abcTon(dia)}4 x2 |]`, breite: 150, scale: 1.9 },
        optionen,
        spalten: 2,
        loesung: mitZeichen,
        warum: regel,
        nachher: () => ton(klang, jetzt() + 0.05, 0.9),
      };
    }
    // schwer: dieselbe Note später im Takt, ohne Zeichen, mit Auflösungszeichen oder nach dem Taktstrich
    const fall = waehle(['gilt', 'aufgeloest', 'neuer-takt']);
    const n = abcTon(dia);
    const anderer = abcTon(dia + (p > von ? -1 : 1));
    let abc;
    if (fall === 'gilt') abc = `${zeichen}${n} ${anderer} ${n} ${anderer} |]`;
    else if (fall === 'aufgeloest') abc = `${zeichen}${n} ${anderer} =${n} ${anderer} |]`;
    else abc = `${anderer} ${zeichen}${n} ${anderer}2 | ${n} ${anderer}2 ${anderer} |]`;
    const index = fall === 'neuer-takt' ? 3 : 2;
    const loesung = fall === 'gilt' ? mitZeichen : grund;
    const warum = {
      gilt: `Das Vorzeichen vorn im Takt gilt bis zum Taktende. Die farbige Note ist deshalb auch ein ${mitZeichen}.`,
      aufgeloest: `Das Auflösungszeichen ♮ hebt das Vorzeichen auf. Die farbige Note ist wieder ein ${grund}.`,
      'neuer-takt': `Nach dem Taktstrich gilt das Vorzeichen nicht mehr. Die farbige Note ist wieder ein ${grund}.`,
    }[fall];
    return {
      frage: 'Wie heißt die farbige Note?',
      bild: {
        abc: kopf({ schluessel: s, takt: '4/4' }) + abc,
        breite: fall === 'neuer-takt' ? 260 : 200,
        scale: 1.6,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note');
          if (alle[index]) alle[index].classList.add('markiert');
        },
      },
      optionen: mische([mitZeichen, grund]).map((x) => ({ text: x, wert: x })),
      spalten: 2,
      loesung,
      warum,
      fall, // für die Prüfung
    };
  },
};

let letzteTonart = null;

export const tonart = {
  id: 'tonart',
  titel: 'Die 1 finden',
  themaId: 'tonarten',
  aufgaben: 8,
  stufen: {
    leicht: 'Dur, bis zu drei Vorzeichen',
    schwer: 'Dur oder Moll, bis zu vier Vorzeichen',
  },
  erklaerung: [
    'Die Vorzeichen am Anfang jeder Zeile heißen **Tonart**. Sie gelten für das ganze Lied. Aus ihnen findest du die **1**.',
    '**Kreuze:** Das letzte Kreuz (ganz rechts) ist die 7. Einen Halbton darüber liegt die 1. Ein Kreuz auf f, also fis: Die 1 ist g.',
    '**Be:** Ein einzelnes Be heißt, die 1 ist f. Bei mehreren Be ist das vorletzte Be die 1.',
    'Ohne Vorzeichen ist die 1 das c. **In Moll** ist die 1 drei Halbtöne tiefer als in Dur: ohne Vorzeichen also das a.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const pool = TONARTEN.filter((t) => (stufe === 'leicht' ? t.zahl <= 3 : true));
    let t;
    do t = waehle(pool);
    while (t === letzteTonart);
    letzteTonart = t;
    const moll = stufe === 'schwer' && Math.random() < 0.5;
    const loesung = moll ? t.moll : t.dur;
    const alle = [...new Set(TONARTEN.flatMap((x) => [x.dur, x.moll]))].filter((x) => x !== loesung);
    // Ablenkungen: die andere 1 derselben Tonart (Dur statt Moll), das letzte Vorzeichen, sonst zufällig
    const folge = t.art === 'kreuz' ? KREUZ_FOLGE : BE_FOLGE;
    const letztes = folge[t.zahl - 1];
    const naheliegend = [moll ? t.dur : t.moll, letztes].filter((x) => x !== loesung);
    const optionen = mische([loesung, ...naheliegend, ...mische(alle.filter((x) => !naheliegend.includes(x)))].slice(0, 4)).map((x) => ({ text: x, wert: x }));
    const regel =
      t.art === 'kreuz'
        ? `Das letzte Kreuz ist ${letztes}, die 7. Einen Halbton darüber liegt die Dur-1: ${t.dur}.`
        : t.zahl === 1
          ? 'Ein einzelnes Be: Die Dur-1 ist f.'
          : `Das vorletzte Be ist ${folge[t.zahl - 2]}. Das ist die Dur-1.`;
    return {
      frage: `Das Lied steht in ${moll ? 'Moll' : 'Dur'}. Welcher Ton ist die 1?`,
      bild: { abc: kopfMitTonart(s, t.abc) + 'x4 |]', breite: 140, scale: 1.9 },
      optionen: [...new Map(optionen.map((o) => [o.wert, o])).values()],
      spalten: 2,
      loesung,
      warum: moll ? `${regel} In Moll liegt die 1 drei Halbtöne tiefer: ${t.moll}.` : regel,
      moll, // für die Prüfung
      tonart: t,
    };
  },
};
