// Gemeinsame Hilfen für Etappe 3 „Notennamen“ (ENTSCHEIDUNGEN.md, „Etappe 3“, 26.11.2026).
// Positionen im Notensystem: 0 = unterste Linie, 1 = erster Zwischenraum … 8 = oberste Linie,
// darunter und darüber geht es mit Hilfslinien weiter (-2 = erste Hilfslinie unten, 10 = erste Hilfslinie oben).
import { STIMMEN, UNTEN, NAMEN, notenname, zufall } from '../musik.js';

export { NAMEN, notenname };

// Bis zu drei Hilfslinien unter und über dem System (freiwillige Stationen)
export const WEIT = [-6, 14];

export const ORDNUNG = ['ersten', 'zweiten', 'dritten', 'vierten', 'fünften'];

export function diaAusPosIn(schluessel, pos) {
  return UNTEN[schluessel] + pos;
}
export function posAusDiaIn(schluessel, dia) {
  return dia - UNTEN[schluessel];
}

// Positionen des Tonraums einer Stimme (ENTSCHEIDUNGEN.md, „Etappe 3“)
export function bereichPos(stimme) {
  const st = STIMMEN[stimme];
  return [posAusDiaIn(st.schluessel, st.bereich[0]), posAusDiaIn(st.schluessel, st.bereich[1])];
}

// Tonraum, wenn man die Noten im anderen Schlüssel liest: die beiden Stimmen, die dort zu Hause sind
export function bereichImSchluessel(schluessel) {
  const stimmen = Object.values(STIMMEN).filter((s) => s.schluessel === schluessel);
  const tief = Math.min(...stimmen.map((s) => s.bereich[0]));
  const hoch = Math.max(...stimmen.map((s) => s.bereich[1]));
  return [posAusDiaIn(schluessel, tief), posAusDiaIn(schluessel, hoch)];
}

// Wo eine Note im System steht, in Worten
export function ortText(pos) {
  if (pos >= 0 && pos <= 8) return pos % 2 === 0 ? `auf der ${ORDNUNG[pos / 2]} Linie` : `im ${ORDNUNG[(pos - 1) / 2]} Zwischenraum`;
  if (pos === -1) return 'direkt unter dem Notensystem';
  if (pos === 9) return 'direkt über dem Notensystem';
  if (pos < -1) {
    const n = Math.floor(-pos / 2) - 1; // -2, -3 → erste Hilfslinie; -4, -5 → zweite
    return pos % 2 === 0 ? `auf der ${ORDNUNG[n]} Hilfslinie unter dem System` : `unter der ${ORDNUNG[n]} Hilfslinie`;
  }
  const n = Math.floor((pos - 10) / 2); // 10, 11 → erste Hilfslinie; 12, 13 → zweite
  return pos % 2 === 0 ? `auf der ${ORDNUNG[n]} Hilfslinie über dem System` : `über der ${ORDNUNG[n]} Hilfslinie`;
}

// Merknoten je Schlüssel: die Note des Schlüssels (zuerst) und die c. Beide führen die Erklärungen ein.
export const MERKNOTEN = {
  treble: [
    { pos: 2, hinweis: 'Um diese Linie kreist die runde Schnecke des Violinschlüssels.' },
    { pos: -2 },
    { pos: 5 },
    { pos: 12, fern: true },
  ],
  bass: [
    { pos: 6, hinweis: 'Die zwei Punkte des Bassschlüssels stehen über und unter dieser Linie.' },
    { pos: 3 },
    { pos: 10 },
    { pos: -4, fern: true },
  ],
};

export function schluesselSatz(schluessel) {
  return schluessel === 'treble'
    ? 'Die runde Schnecke des Violinschlüssels kreist um die zweite Linie von unten: Dort steht das g.'
    : 'Die zwei Punkte des Bassschlüssels stehen über und unter der vierten Linie von unten: Dort steht das f.';
}

// Namen von einer Position zur anderen, beide eingeschlossen: g, a, h …
export function reihe(schluessel, von, bis) {
  const schritt = bis >= von ? 1 : -1;
  const liste = [];
  for (let p = von; p !== bis + schritt; p += schritt) liste.push(notenname(diaAusPosIn(schluessel, p)));
  return liste;
}

// Die nächste Merknote zu einer Position. Die c auf der zweiten Hilfslinie (fern) nennt die Erklärung nicht
// ausdrücklich; sie zählen nur für Noten, die noch weiter draußen liegen.
function naechsteMerknote(schluessel, pos) {
  const abstand = (m) => Math.abs(m.pos - pos) + (m.fern ? 2 : 0);
  let anker = MERKNOTEN[schluessel][0];
  for (const m of MERKNOTEN[schluessel]) if (abstand(m) < abstand(anker)) anker = m;
  return anker;
}

// Wie man von der nächsten Merknote aus auf die Note kommt. Steht die Note selbst auf einer Merknote,
// nur deren Hinweis (oder nichts).
export function zaehlHilfe(schluessel, pos) {
  const anker = naechsteMerknote(schluessel, pos);
  if (anker.pos === pos) return anker.hinweis || '';
  const aName = notenname(diaAusPosIn(schluessel, anker.pos));
  const richtung = pos > anker.pos ? 'hinauf' : 'hinunter';
  return `Zähl vom ${aName} ${ortText(anker.pos)} aus ${richtung}: ${reihe(schluessel, anker.pos, pos).join(', ')}.`;
}

// Erklärung, wie man auf den Namen einer Note kommt
export function zaehlText(schluessel, pos) {
  const name = notenname(diaAusPosIn(schluessel, pos));
  const anker = naechsteMerknote(schluessel, pos);
  const hilfe = zaehlHilfe(schluessel, pos);
  if (anker.pos === pos) return `Die Note steht ${ortText(pos)}: Das ist das ${name}.${hilfe ? ' ' + hilfe : ''}`;
  return `Das ist das ${name}. ${hilfe}`;
}

// Eine Position im Bereich [von, bis], nicht dieselbe wie die letzte
export function zufallsPos([von, bis], letzte = null) {
  let p;
  do p = zufall(von, bis);
  while (p === letzte && bis > von);
  return p;
}

// Die sieben Namen als Antworten
export function namensOptionen() {
  return NAMEN.map((n) => ({ text: n, wert: n }));
}

// Eine einzelne Note als ABC-Bild
export function einzelnote(kopfText, abc) {
  return `${kopfText}x2 ${abc}4 x2 |]`;
}
