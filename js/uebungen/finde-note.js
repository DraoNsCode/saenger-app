// Etappe 3, „Finde die Note“ (LERNWEG.md, „Stationen der Etappe 3“, von Daniel vorläufig angenommen am 26.11.2026).
// leicht: nötige Station, drei Noten zur Wahl im Tonraum der eigenen Stimme.
// mittel: freiwillig, vier Noten nah beieinander, auch mit Hilfslinien.
// schwer: freiwillig, im anderen Schlüssel (Daniel: „Als optionale Aufgabe“; Ort von Claude gewählt, ENTSCHEIDUNGEN.md, „Etappe 3“).
import { STIMMEN, ANDERER_SCHLUESSEL, SCHLUESSEL_NAME, abcTon, midi, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { ton, jetzt } from '../klang.js';
import { notenname, WEIT, bereichPos, bereichImSchluessel, diaAusPosIn, ortText, zaehlHilfe, zufallsPos, schluesselSatz } from './namen.js';

let letzte = null;

// Ablenkungen: andere Namen, andere Positionen
function andere(schluessel, richtig, anzahl, kandidaten) {
  const name = (p) => notenname(diaAusPosIn(schluessel, p));
  const genommen = new Set([name(richtig)]);
  const liste = [];
  for (const p of mische(kandidaten)) {
    if (liste.length >= anzahl) break;
    if (genommen.has(name(p))) continue;
    genommen.add(name(p));
    liste.push(p);
  }
  return liste;
}

function bereichListe([von, bis]) {
  return Array.from({ length: bis - von + 1 }, (_, i) => von + i);
}

export default {
  id: 'finde-note',
  titel: 'Finde die Note',
  themaId: 'notennamen',
  aufgaben: 8,
  // Bilder in diesen Stufen stehen absichtlich im anderen Schlüssel (für die Prüfung in pruefung/uebungen.test.mjs)
  andererSchluessel: ['schwer'],
  stufen: {
    leicht: 'Drei Noten zur Wahl, im Bereich deiner Stimme',
    mittel: 'Vier Noten zur Wahl, nah beieinander, auch mit Hilfslinien',
    schwer: 'Im anderen Schlüssel',
  },
  erklaerung: [
    'Hier ist es umgekehrt: Du kennst den Namen und suchst die passende Note. Jeder Name kommt mehrmals vor, höher und tiefer. Unter den Antworten steht er nur einmal.',
    'Nimm eine Merknote: im **Violinschlüssel** das **g** auf der zweiten Linie von unten, im **Bassschlüssel** das **f** auf der vierten Linie von unten, dazu in beiden die **c**.',
    'Von dort zählst du weiter: nach oben c d e f g a h, dann wieder c. Nach unten rückwärts: … e, d, c, h, a …',
    'Als freiwillige Station kannst du das auch im anderen Schlüssel üben. So kannst du im Chorbuch die anderen Stimmen mitlesen.',
  ],
  neu(stufe, k) {
    const eigener = STIMMEN[k.stimme].schluessel;
    const s = stufe === 'schwer' ? ANDERER_SCHLUESSEL[eigener] : eigener;
    let richtig;
    let ablenkung;
    if (stufe === 'mittel') {
      richtig = zufallsPos(Math.random() < 0.5 ? [0, 8] : WEIT, letzte);
      // Nachbarn: höchstens drei Stufen entfernt, im weiten Bereich
      const nah = [-3, -2, -1, 1, 2, 3].map((d) => richtig + d).filter((p) => p >= WEIT[0] && p <= WEIT[1]);
      ablenkung = andere(s, richtig, 3, nah);
    } else {
      const bereich = stufe === 'schwer' ? bereichImSchluessel(s) : bereichPos(k.stimme);
      richtig = zufallsPos(bereich, letzte);
      ablenkung = andere(s, richtig, 2, bereichListe(bereich));
    }
    letzte = richtig;
    const name = notenname(diaAusPosIn(s, richtig));
    const kopfText = kopf({ schluessel: s });
    const optionen = mische([richtig, ...ablenkung]).map((p) => ({
      abc: `${kopfText}x ${abcTon(diaAusPosIn(s, p))}4 x |]`,
      wert: p === richtig ? 'r' : 'a' + p,
      breite: 60,
      scale: 1.7,
    }));
    const frage = stufe === 'schwer' ? `Im ${SCHLUESSEL_NAME[s]}: Welche Note ist ein ${name}?` : `Welche Note ist ein ${name}?`;
    const dia = diaAusPosIn(s, richtig);
    return {
      frage,
      hinweis: stufe === 'schwer' ? schluesselSatz(s) : null,
      optionen,
      spalten: optionen.length === 4 ? 2 : 3,
      loesung: 'r',
      pos: richtig, // für die Prüfung
      positionen: [richtig, ...ablenkung],
      warum: `Das ${name} steht hier ${ortText(richtig)}. ${zaehlHilfe(s, richtig)}`.trim(),
      nachher: () => ton(midi(dia), jetzt() + 0.05, 0.9),
    };
  },
};

