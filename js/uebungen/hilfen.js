// Gemeinsame Hilfen für die Übungen: Rhythmen, Melodien, ABC-Texte.
import { zufall, waehle, gewichtet, mische, abcTon, diaAusPos } from '../musik.js';
import { laenge } from '../noten.js';

export const WERT = {
  note: { 4: 'Ganze', 2: 'Halbe', 1: 'Viertel' },
  pause: { 4: 'ganze Pause', 2: 'halbe Pause', 1: 'Viertelpause' },
};

export function schlaegeText(n) {
  return n === 1 ? '1 Schlag' : `${n} Schläge`;
}

// Ein Takt aus Notenwerten. Ergebnis: [{ d: Schläge, pause: bool }]
export function zufallsTakt(schlaege, { ganze = false, pausen = 0, halbeVersetzt = false, ersteKeinePause = true } = {}) {
  let takt = [];
  let pos = 0;
  while (pos < schlaege) {
    const rest = schlaege - pos;
    const moeglich = [[1, 3]];
    if (rest >= 2 && (halbeVersetzt || schlaege === 3 || pos % 2 === 0)) moeglich.push([2, 2]);
    if (ganze && rest >= 4 && pos === 0) moeglich.push([4, 1]);
    const d = gewichtet(moeglich);
    takt.push({ d, pause: false });
    pos += d;
  }
  if (pausen > 0 && takt.length > 1) {
    const kandidaten = takt.map((_, i) => i).filter((i) => !(ersteKeinePause && i === 0));
    mische(kandidaten)
      .slice(0, Math.min(pausen, takt.length - 1))
      .forEach((i) => (takt[i].pause = true));
  }
  return takt;
}

export function gleicherTakt(a, b) {
  return a.length === b.length && a.every((x, i) => x.d === b[i].d && x.pause === b[i].pause);
}

export function gleicheTakte(a, b) {
  return a.length === b.length && a.every((t, i) => gleicherTakt(t, b[i]));
}

// Einsätze (Notenanfänge) in Schlägen ab Beginn
export function einsaetze(takte, schlaegeProTakt) {
  const liste = [];
  takte.forEach((takt, ti) => {
    let pos = ti * schlaegeProTakt;
    takt.forEach((n) => {
      liste.push({ beginn: pos, d: n.d, pause: n.pause });
      pos += n.d;
    });
  });
  return liste;
}

// Rhythmus als ABC (ein Ton für alle Noten)
export function abcRhythmus(takte, ton = 'B') {
  return takte.map((t) => t.map((n) => (n.pause ? 'z' : ton) + laenge(n.d)).join(' ')).join(' | ') + ' |]';
}

// Melodie als ABC: takte + Tonhöhen (dia) für alle Nicht-Pausen der Reihe nach
export function abcMelodie(takte, dias) {
  let i = 0;
  return (
    takte
      .map((t) =>
        t
          .map((n) => {
            if (n.pause) return 'z' + laenge(n.d);
            return abcTon(dias[i++]) + laenge(n.d);
          })
          .join(' ')
      )
      .join(' | ') + ' |]'
  );
}

export function beschreibe(takt) {
  return takt.map((n) => (n.pause ? WERT.pause[n.d] : WERT.note[n.d])).join(', ');
}

// Melodie in Schritten und kleinen Sprüngen innerhalb von Positionen [min, max] des Notensystems
export function melodiePositionen(anzahl, { min = 1, max = 7, sprung = 2 } = {}) {
  const pos = [zufall(min, max)];
  while (pos.length < anzahl) {
    const letzte = pos[pos.length - 1];
    const schritt = gewichtet([
      [1, 5],
      [-1, 5],
      [2, sprung >= 2 ? 2 : 0],
      [-2, sprung >= 2 ? 2 : 0],
      [0, 1],
    ]);
    const neu = letzte + schritt;
    if (neu >= min && neu <= max) pos.push(neu);
  }
  return pos;
}

export function diasAusPositionen(stimme, positionen) {
  return positionen.map((p) => diaAusPos(stimme, p));
}

export { zufall, waehle, mische, gewichtet };
