// Tonhöhen, Stimmen und Zufallshilfen.
// Diatonische Zählung: dia = Oktave * 7 + Stufe (C = 0 … H = 6), c' (C4) = 28.

const HALBTOENE = [0, 2, 4, 5, 7, 9, 11];
const BUCHSTABEN = 'CDEFGAB';

export const STIMMEN = {
  S: { name: 'Sopran', schluessel: 'treble', unten: 30 }, // unterste Linie e'
  A: { name: 'Alt', schluessel: 'treble', unten: 30 },
  T: { name: 'Tenor', schluessel: 'bass', unten: 18 }, // unterste Linie G (im Chor singt der Tenor im Bassschlüssel)
  B: { name: 'Bass', schluessel: 'bass', unten: 18 },
};

export const SCHLUESSEL_NAME = { treble: 'Violinschlüssel', bass: 'Bassschlüssel' };

export function midi(dia) {
  const okt = Math.floor(dia / 7);
  const stufe = ((dia % 7) + 7) % 7;
  return 12 * (okt + 1) + HALBTOENE[stufe];
}

// Note als ABC-Text, z. B. dia 28 -> "C", 35 -> "c", 21 -> "C,"
export function abcTon(dia) {
  const okt = Math.floor(dia / 7);
  const stufe = ((dia % 7) + 7) % 7;
  const b = BUCHSTABEN[stufe];
  if (okt >= 5) return b.toLowerCase() + "'".repeat(okt - 5);
  if (okt === 4) return b;
  return b + ','.repeat(4 - okt);
}

// Position im Notensystem: 0 = unterste Linie, 1 = erster Zwischenraum … 8 = oberste Linie
export function diaAusPos(stimme, pos) {
  return STIMMEN[stimme].unten + pos;
}
export function aufLinie(pos) {
  return ((pos % 2) + 2) % 2 === 0;
}

// Zufall
export function zufall(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
export function waehle(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}
export function mische(liste) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function gewichtet(paare) {
  // paare: [[wert, gewicht], …]
  const summe = paare.reduce((s, p) => s + p[1], 0);
  let r = Math.random() * summe;
  for (const [w, g] of paare) {
    if ((r -= g) < 0) return w;
  }
  return paare[paare.length - 1][0];
}
