import { STIMMEN, diaAusPos, abcTon, midi, zufall, waehle, mische } from '../musik.js';
import { kopf, laenge } from '../noten.js';
import { audio, ton, klicks } from '../klang.js';
import { schlaegeText } from './hilfen.js';

const NAME = {
  note: { 4: 'Ganze Note', 2: 'Halbe Note', 1: 'Viertelnote' },
  pause: { 4: 'Ganze Pause', 2: 'Halbe Pause', 1: 'Viertelpause' },
};
const WARUM = {
  note: {
    4: 'Die Ganze ist hohl und hat keinen Hals. Sie dauert 4 Schläge.',
    2: 'Die Halbe ist hohl und hat einen Hals. Sie dauert 2 Schläge.',
    1: 'Die Viertel ist ausgefüllt und hat einen Hals. Sie dauert 1 Schlag.',
  },
  pause: {
    4: 'Die ganze Pause hängt unter der Linie. Sie dauert 4 Schläge.',
    2: 'Die halbe Pause liegt auf der Linie. Sie dauert 2 Schläge.',
    1: 'Die Viertelpause sieht aus wie ein kleiner Blitz. Sie dauert 1 Schlag.',
  },
};
const TEMPO = 80;

function zeichen(art, d, dia) {
  return (art === 'pause' ? 'z' : abcTon(dia)) + laenge(d);
}

export default {
  id: 'notenwerte',
  titel: 'Notenwerte',
  themaId: 'schlag-takt',
  aufgaben: 8,
  stufen: {
    leicht: 'Ganze, Halbe und Viertel',
    mittel: 'Vor allem Pausen',
    schwer: 'Namen und Dauer, Noten und Pausen',
  },
  erklaerung: [
    'Die Form einer Note zeigt, wie lange sie klingt. Meist ist **ein Schlag eine Viertelnote**.',
    '**Viertel**: ausgefüllt, mit Hals, 1 Schlag. **Halbe**: hohl, mit Hals, 2 Schläge. **Ganze**: hohl, ohne Hals, 4 Schläge.',
    '**Pausen** sind Stille und haben dieselben Längen. Die ganze Pause **hängt** unter der Linie, die halbe Pause **liegt** auf der Linie.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    const d = abcTon(diaAusPos(k.stimme, 4));
    return [
      { abc: kopf({ schluessel: s }) + `"_Ganze"${d}4 "_Halbe"${d}2 "_Viertel"${d} |]`, breite: 230 },
      { abc: kopf({ schluessel: s }) + `"_ganze Pause"z4 "_halbe Pause"z2 "_Viertelpause"z |]`, breite: 260 },
    ];
  },
  neu(stufe, k) {
    const schluessel = STIMMEN[k.stimme].schluessel;
    const art = stufe === 'leicht' ? 'note' : stufe === 'mittel' ? (Math.random() < 0.7 ? 'pause' : 'note') : waehle(['note', 'pause']);
    const form = stufe === 'schwer' ? waehle(['dauer', 'name', 'name', 'umgekehrt']) : 'dauer';
    const d = waehle([1, 2, 4]);
    const dia = diaAusPos(k.stimme, zufall(2, 6));
    const wort = art === 'pause' ? 'Pause' : 'Note';
    const nachher = () => {
      const c = audio();
      const t = c.currentTime + 0.1;
      klicks(t, TEMPO, d, 4, true);
      if (art === 'note') ton(midi(dia), t, (d * 60) / TEMPO * 0.95, { art: 'orgel' });
    };
    const bildAbc = kopf({ schluessel }) + `x2 ${zeichen(art, d, dia)} x2 |]`;

    if (form === 'umgekehrt') {
      const optionen = mische([1, 2, 4]).map((w) => ({
        abc: kopf({ schluessel }) + `x ${zeichen(art, w, diaAusPos(k.stimme, 4))} x |]`,
        wert: w,
        breite: 90,
        scale: 1.4,
      }));
      return {
        frage: `Welche ${wort} dauert ${schlaegeText(d)}?`,
        optionen,
        spalten: 3,
        loesung: d,
        warum: WARUM[art][d],
        nachher,
      };
    }
    if (form === 'name') {
      return {
        frage: art === 'pause' ? 'Wie heißt diese Pause?' : 'Wie heißt diese Note?',
        bild: { abc: bildAbc, breite: 150, scale: 1.9 },
        optionen: [4, 2, 1].map((w) => ({ text: NAME[art][w], wert: w })),
        spalten: 3,
        loesung: d,
        warum: WARUM[art][d],
        nachher,
      };
    }
    return {
      frage: `Wie viele Schläge dauert diese ${wort}?`,
      bild: { abc: bildAbc, breite: 150, scale: 1.9 },
      optionen: [1, 2, 4].map((w) => ({ text: schlaegeText(w), wert: w })),
      spalten: 3,
      loesung: d,
      warum: WARUM[art][d],
      nachher,
    };
  },
};
