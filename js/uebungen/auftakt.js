// Etappe 4, „Der Auftakt“. Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden
// (LERNWEG.md, „Stationen der Etappe 4“). „Auftakt“ meint nur den unvollständigen ersten Takt (ENTSCHEIDUNGEN.md,
// „Sprache des Chors“). leicht: nötige Station, Auftakte aus ganzen Schlägen. schwer: freiwillig, auch Achtel-Auftakte.
import { STIMMEN, waehle, abcTon } from '../musik.js';
import { kopf } from '../noten.js';
import { achtelTakt, abcAchtel, zaehlSilbe, silbenOptionen, melodiePositionen, diasAusPositionen } from './hilfen.js';

const DAUER = { 0.5: 'einen halben Schlag', 1: 'einen Schlag', 1.5: 'eineinhalb Schläge', 2: 'zwei Schläge' };

// Auftakt als Notenwerte. laenge in Schlägen.
function auftaktNoten(laenge) {
  if (laenge === 0.5) return [{ d: 0.5, pause: false }];
  if (laenge === 1) return waehle([[{ d: 1, pause: false }], [{ d: 0.5, pause: false }, { d: 0.5, pause: false }]]);
  if (laenge === 1.5) return [{ d: 0.5, pause: false }, { d: 1, pause: false }];
  return waehle([[{ d: 1, pause: false }, { d: 1, pause: false }], [{ d: 2, pause: false }]]);
}

export default {
  id: 'auftakt',
  titel: 'Der Auftakt',
  themaId: 'achtel',
  aufgaben: 8,
  stufen: {
    leicht: 'Auftakte aus ganzen Schlägen',
    schwer: 'Auch Auftakte mit Achteln',
  },
  erklaerung: [
    'Viele Lieder beginnen nicht auf der 1. Dann ist der erste Takt nicht voll. Diesen unvollständigen ersten Takt nennt man **Auftakt**.',
    'Der Auftakt füllt die **letzten Schläge** des Takts. Zähl vom ersten Taktstrich aus rückwärts, wie viele Schläge davor stehen, nicht wie viele Noten.',
    'Beispiel im 4/4-Takt: Dauert der Auftakt einen Schlag, ist das die 4, das Lied beginnt auf **4**. Dauert er zwei Schläge, sind das 3 und 4, es beginnt auf **3**. Dauert er nur einen halben Schlag, beginnt es auf **„4 und“**.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    const t = s === 'treble' ? ['D', 'G', 'G', 'A', 'B'] : ['D,,', 'G,,', 'G,,', 'A,,', 'B,,'];
    return { abc: kopf({ schluessel: s, takt: '4/4' }) + `"_4"${t[0]} | "_1"${t[1]} "_2"${t[2]} "_3"${t[3]} "_4"${t[4]} |`, breite: 260 };
  },
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const schlaege = waehle([4, 3]);
    const laengen = stufe === 'schwer' ? [0.5, 1, 1.5, 2] : [1, 2];
    const laenge = waehle(laengen);
    const auftakt = auftaktNoten(laenge);
    const takte = [0, 1].map(() => achtelTakt(schlaege, { mindAchtel: 0 }));
    const tonAnzahl = auftakt.length + takte.flat().length;
    const dias = diasAusPositionen(k.stimme, melodiePositionen(tonAnzahl, { min: 1, max: 7 }));
    const abc = kopf({ schluessel: s, takt: `${schlaege}/4` }) + abcAchtel([auftakt, ...takte], (i) => abcTon(dias[i])).replace(/ \|\]$/, ' |');
    const loesung = zaehlSilbe(schlaege - laenge);
    const optionen = stufe === 'schwer' ? silbenOptionen(schlaege) : Array.from({ length: schlaege }, (_, i) => ({ text: String(i + 1), wert: String(i + 1) }));
    return {
      frage: 'Auf welche Zählzeit fällt die erste Note?',
      hinweis: schlaege === 3 ? 'Dreivierteltakt: drei Schläge pro Takt.' : null,
      bild: { abc, breite: 300, scale: 1.35 },
      optionen,
      spalten: stufe === 'schwer' ? 2 : schlaege,
      loesung,
      warum: `Der Auftakt dauert ${DAUER[laenge]}. Er füllt die letzten Zählzeiten des ${schlaege}/4-Takts: ${Array.from({ length: laenge * 2 }, (_, i) => zaehlSilbe(schlaege - laenge + i / 2)).join(' · ')}. Also beginnt das Lied auf „${loesung}“.`,
      laenge, // für die Prüfung
      schlaege,
    };
  },
};
