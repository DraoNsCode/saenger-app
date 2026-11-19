import { STIMMEN, diaAusPos, abcTon, midi, zufall, waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';

const ANZAHL = { leicht: 2, mittel: 3, schwer: 4 };
const ABSTAND = { leicht: [3, 5], mittel: [1, 4], schwer: [1, 3] };

function alleRichtungen(n) {
  // alle Folgen aus +1/-1 der Länge n
  if (n === 0) return [[]];
  return alleRichtungen(n - 1).flatMap((r) => [[...r, 1], [...r, -1]]);
}

function positionen(start, richtungen, abstaende) {
  const p = [start];
  richtungen.forEach((r, i) => p.push(p[i] + r * abstaende[i]));
  return p;
}

function inBereich(p) {
  return p.every((x) => x >= 0 && x <= 8);
}

function inWorten(richtungen) {
  return richtungen.map((r) => (r > 0 ? 'hinauf' : 'hinunter')).join(', dann ');
}

export default {
  id: 'hoeren-sehen',
  titel: 'Hören und sehen',
  themaId: 'notenbild',
  aufgaben: 8,
  stufen: {
    leicht: 'Zwei Töne, große Abstände',
    mittel: 'Drei Töne',
    schwer: 'Vier Töne, ähnliche Bilder',
  },
  erklaerung: [
    'Du hörst ein paar Töne. Achte darauf, ob es **hinauf** oder **hinunter** geht.',
    'Such dann das Notenbild, das genauso verläuft. Mit „Anhören“ kannst du die Töne so oft hören, wie du willst.',
  ],
  neu(stufe, k) {
    const n = ANZAHL[stufe];
    const [amin, amax] = ABSTAND[stufe];
    let richtig, start, abstaende, pos;
    do {
      richtig = Array.from({ length: n - 1 }, () => waehle([1, -1]));
      abstaende = Array.from({ length: n - 1 }, () => zufall(amin, amax));
      start = zufall(0, 8);
      pos = positionen(start, richtig, abstaende);
    } while (!inBereich(pos));

    // Andere Verläufe als Ablenkung, mit denselben Abständen
    let andere = alleRichtungen(n - 1).filter((r) => r.join() !== richtig.join());
    if (stufe === 'schwer') andere = andere.filter((r) => r.filter((x, i) => x !== richtig[i]).length === 1);
    const anzahlOptionen = stufe === 'leicht' ? 2 : 3;
    const ablenkungen = [];
    for (const r of mische(andere)) {
      if (ablenkungen.length >= anzahlOptionen - 1) break;
      // Startton so wählen, dass das Bild im System bleibt
      const starts = mische([start, ...Array.from({ length: 9 }, (_, i) => i)]);
      const s = starts.find((st) => inBereich(positionen(st, r, abstaende)));
      if (s != null) ablenkungen.push(positionen(s, r, abstaende));
    }
    const schluessel = STIMMEN[k.stimme].schluessel;
    const abcAus = (p) => kopf({ schluessel }) + 'x ' + p.map((x) => abcTon(diaAusPos(k.stimme, x)) + '2').join(' ') + ' x |]';
    const optionen = mische([
      { abc: abcAus(pos), wert: 'r' },
      ...ablenkungen.map((p, i) => ({ abc: abcAus(p), wert: 'a' + i })),
    ]).map((o) => ({ ...o, breite: 60 + 38 * n, scale: 1.25 }));
    const folge = pos.map((x, i) => ({ midi: midi(diaAusPos(k.stimme, x)), schlaege: i === n - 1 ? 1.6 : 1 }));
    const spiele = () => spieleFolge(folge, { tempo: 76 });
    return {
      frage: 'Welches Notenbild passt zu den Tönen?',
      klang: spiele,
      klangAuto: true,
      optionen,
      spalten: 1,
      loesung: 'r',
      warum: `Die Töne gehen ${inWorten(richtig)}.`,
    };
  },
};
