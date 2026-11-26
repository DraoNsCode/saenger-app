// Tonhöhen, Stimmen und Zufallshilfen.
// Diatonische Zählung: dia = Oktave * 7 + Stufe (C = 0 … H = 6), c' (C4) = 28.

const HALBTOENE = [0, 2, 4, 5, 7, 9, 11];
const BUCHSTABEN = 'CDEFGAB';

// bereich: Tonraum, den die Stimme in einem Laienchor meist singt, als [tiefste, höchste] diatonische Zahl.
// Claudes Wahl, von Daniel überlassen (ENTSCHEIDUNGEN.md, „Etappe 3“, 26.11.2026). Daniel korrigiert, falls nötig.
export const STIMMEN = {
  S: { name: 'Sopran', schluessel: 'treble', unten: 30, bereich: [28, 39] }, // unterste Linie e'; c' bis g''
  A: { name: 'Alt', schluessel: 'treble', unten: 30, bereich: [26, 36] }, // a bis d''
  T: { name: 'Tenor', schluessel: 'bass', unten: 18, bereich: [21, 31] }, // unterste Linie G (im Chor singt der Tenor im Bassschlüssel); c bis f'
  B: { name: 'Bass', schluessel: 'bass', unten: 18, bereich: [17, 28] }, // F bis c'
};

// Unterste Linie je Schlüssel, für Bilder, die nicht im Schlüssel der eigenen Stimme stehen
export const UNTEN = { treble: 30, bass: 18 };
export const ANDERER_SCHLUESSEL = { treble: 'bass', bass: 'treble' };

// Notennamen ohne Oktave (ENTSCHEIDUNGEN.md, „Etappe 3“: Der Buchstabe reicht)
export const NAMEN = ['c', 'd', 'e', 'f', 'g', 'a', 'h'];
export function notenname(dia) {
  return NAMEN[((dia % 7) + 7) % 7];
}

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
