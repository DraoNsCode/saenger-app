// Etappe 3, „Wie heißt die Note?“ (LERNWEG.md, „Stationen der Etappe 3“, von Daniel vorläufig angenommen am 26.11.2026).
// leicht: nötige Station, Noten im Tonraum der eigenen Stimme (STIMMEN.bereich in musik.js).
// mittel: freiwillig, das ganze System und bis zu drei Hilfslinien.
// schwer: freiwillig, Notenwörter: mehrere Noten ergeben ein Wort.
import { STIMMEN, abcTon, midi, waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { ton, jetzt, spieleFolge } from '../klang.js';
import { notenname, bereichPos, diaAusPosIn, zaehlText, zufallsPos, namensOptionen, einzelnote, schluesselSatz } from './namen.js';

// Wörter nur aus c d e f g a h. Anzeige und Buchstaben getrennt.
export const WOERTER = ['Ade', 'Ehe', 'Fee', 'Gag', 'Hefe', 'Affe', 'Dach', 'Fach', 'Chef', 'Egge', 'Gehege'];

let letzte = null;

// Für jedes Wort die Noten im Tonraum der Stimme, möglichst nah an der vorigen Note
function wortPositionen(stimme, wort) {
  const [von, bis] = bereichPos(stimme);
  const s = STIMMEN[stimme].schluessel;
  const kandidaten = (buchstabe) => {
    const liste = [];
    for (let p = von; p <= bis; p++) if (notenname(diaAusPosIn(s, p)) === buchstabe) liste.push(p);
    return liste;
  };
  const pos = [];
  for (const b of wort.toLowerCase()) {
    const k = kandidaten(b);
    if (!pos.length) pos.push(waehle(k));
    else {
      const vorher = pos[pos.length - 1];
      pos.push(k.reduce((x, y) => (Math.abs(y - vorher) < Math.abs(x - vorher) ? y : x)));
    }
  }
  return pos;
}

function ablenkungen(wort) {
  const andere = mische(WOERTER.filter((w) => w !== wort));
  const punkte = (w) => (w[0] === wort[0] ? 2 : 0) + (w.length === wort.length ? 1 : 0);
  return andere.sort((a, b) => punkte(b) - punkte(a)).slice(0, 2);
}

export default {
  id: 'notenname',
  titel: 'Wie heißt die Note?',
  themaId: 'notennamen',
  aufgaben: 8,
  stufen: {
    leicht: 'Noten im Bereich deiner Stimme',
    mittel: 'Das ganze Notensystem, auch mit Hilfslinien',
    schwer: 'Notenwörter: Die Noten ergeben ein Wort',
  },
  erklaerung: [
    'Die Noten heißen **c d e f g a h**. Danach fängt die Reihe wieder mit c an. Jeder Name kommt deshalb mehrmals vor, höher und tiefer.',
    'Von einer Linie zum Zwischenraum darüber geht es einen Namen weiter, vom Zwischenraum zur nächsten Linie wieder einen. Nach unten zählst du rückwärts: … e, d, c, h, a …',
    '**Violinschlüssel** (Sopran und Alt): Die runde Schnecke unten im Schlüssel kreist um die zweite Linie von unten. Dort steht das **g**. Das ist deine erste **Merknote**. Weitere Merknoten sind die **c**: auf der ersten Hilfslinie unter dem System und im dritten Zwischenraum.',
    '**Bassschlüssel** (Tenor und Bass): Die zwei Punkte des Schlüssels stehen über und unter der vierten Linie von unten. Dort steht das **f**. Das ist deine erste **Merknote**. Weitere Merknoten sind die **c**: im zweiten Zwischenraum und auf der ersten Hilfslinie über dem System.',
    'Von der nächsten Merknote aus zählst du weiter, bis du bei deiner Note bist.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    const merk = s === 'treble' ? 2 : 6;
    const noten = [merk, merk + 1, merk + 2].map((p, i) => `"_${notenname(diaAusPosIn(s, p))}"${abcTon(diaAusPosIn(s, p))}2${i < 2 ? ' ' : ''}`).join('');
    return { abc: kopf({ schluessel: s }) + `x ${noten} x |]`, breite: 240 };
  },
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    if (stufe === 'schwer') {
      const wort = waehle(WOERTER);
      const pos = wortPositionen(k.stimme, wort);
      const dias = pos.map((p) => diaAusPosIn(s, p));
      const optionen = mische([wort, ...ablenkungen(wort)]).map((w) => ({ text: w, wert: w }));
      return {
        frage: 'Welches Wort ergeben die Noten?',
        hinweis: schluesselSatz(s),
        bild: { abc: kopf({ schluessel: s }) + 'x ' + dias.map((d) => abcTon(d) + '2').join(' ') + ' x |]', breite: 70 + 44 * dias.length, scale: 1.5 },
        optionen,
        spalten: 1,
        loesung: wort,
        warum: `Die Noten heißen ${wort.toLowerCase().split('').join(', ')}: ${wort}.`,
        nachher: () => spieleFolge(dias.map((d) => ({ midi: midi(d), schlaege: 1 })), { tempo: 100 }),
      };
    }
    let pos;
    if (stufe === 'mittel' && Math.random() < 0.5) {
      // Die Hälfte der Aufgaben mit Hilfslinien oder direkt am Rand des Systems
      pos = waehle([-6, -5, -4, -3, -2, -1, 9, 10, 11, 12, 13, 14].filter((p) => p !== letzte));
    } else {
      pos = zufallsPos(stufe === 'leicht' ? bereichPos(k.stimme) : [0, 8], letzte);
    }
    letzte = pos;
    const dia = diaAusPosIn(s, pos);
    return {
      frage: 'Wie heißt die Note?',
      bild: { abc: einzelnote(kopf({ schluessel: s }), abcTon(dia)), breite: 150, scale: 1.9 },
      optionen: namensOptionen(),
      spalten: 4,
      loesung: notenname(dia),
      warum: zaehlText(s, pos),
      pos, // für die Prüfung
      nachher: () => ton(midi(dia), jetzt() + 0.05, 0.9),
    };
  },
};

