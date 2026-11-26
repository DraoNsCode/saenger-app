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

// ---------------------------------------------------------------------------------------------
// Achtel (Etappe 4). Gezählt wird mit Schlägen und „und“ (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
WERT.note[0.5] = 'Achtel';
WERT.pause[0.5] = 'Achtelpause';
// Punktierte Noten (Etappe 8)
WERT.note[1.5] = 'punktierte Viertel';
WERT.note[3] = 'punktierte Halbe';

// Ein Takt Schlag für Schlag: Viertel, zwei Achtel oder (mit achtelPausen) Achtel und Achtelpause.
// Halbe beginnen im 4/4-Takt auf 1 oder 3. Keine Note geht über eine Schlaggrenze hinaus, außer der Halben
// (Synkopen kommen erst in Etappe 11). mindAchtel: so viele Schläge mit Achteln mindestens.
export function achtelTakt(schlaege, { halbe = true, pausen = 0, achtelPausen = false, mindAchtel = 1 } = {}) {
  for (let versuch = 0; versuch < 200; versuch++) {
    const takt = [];
    let pos = 0;
    let achtelSchlaege = 0;
    while (pos < schlaege) {
      const rest = schlaege - pos;
      const moeglich = [['viertel', 3], ['paar', 3]];
      if (halbe && rest >= 2 && (schlaege === 3 || pos % 2 === 0)) moeglich.push(['halbe', 1]);
      if (achtelPausen) moeglich.push(['achtel-pause', 1], ['pause-achtel', 1]);
      const art = gewichtet(moeglich);
      if (art === 'viertel') takt.push({ d: 1, pause: false });
      if (art === 'halbe') takt.push({ d: 2, pause: false });
      if (art === 'paar') takt.push({ d: 0.5, pause: false }, { d: 0.5, pause: false });
      if (art === 'achtel-pause') takt.push({ d: 0.5, pause: false }, { d: 0.5, pause: true });
      if (art === 'pause-achtel') takt.push({ d: 0.5, pause: true }, { d: 0.5, pause: false });
      if (art !== 'viertel' && art !== 'halbe') achtelSchlaege++;
      pos += art === 'halbe' ? 2 : 1;
    }
    if (achtelSchlaege < mindAchtel) continue;
    // Viertelpausen: nie die erste Note
    const viertel = takt.map((n, i) => i).filter((i) => i > 0 && takt[i].d === 1);
    mische(viertel)
      .slice(0, pausen)
      .forEach((i) => (takt[i].pause = true));
    if (takt.some((n) => !n.pause)) return takt;
  }
  throw new Error('Kein passender Takt gefunden');
}

// Notenwerte als ABC, Achtel innerhalb eines Schlags zusammengebalkt. ton(i) liefert die Tonhöhe der i-ten Note.
export function abcAchtel(takte, ton = () => 'B') {
  let i = 0;
  return (
    takte
      .map((takt) => {
        let pos = 0;
        let text = '';
        let vorher = null;
        takt.forEach((n) => {
          const zeichen = (n.pause ? 'z' : ton(i++)) + laenge(n.d) + (n.bogen ? '-' : '');
          // Achtel ohne Leerzeichen dazwischen werden gebalkt, aber nur im selben Schlag
          const balken = vorher && !vorher.pause && !n.pause && vorher.d === 0.5 && n.d === 0.5 && Math.floor(vorher.beginn) === Math.floor(pos);
          text += (text && !balken ? ' ' : '') + zeichen;
          vorher = { ...n, beginn: pos };
          pos += n.d;
        });
        return text;
      })
      .join(' | ') + ' |]'
  );
}

// Zählsilbe für einen Beginn in Schlägen ab Taktanfang: 0 → „1“, 1.5 → „2 und“
export function zaehlSilbe(beginn) {
  return Number.isInteger(beginn) ? String(beginn + 1) : `${Math.floor(beginn) + 1} und`;
}

// Alle Zählsilben eines Takts als Antworten: 1, 1 und, 2, 2 und …
export function silbenOptionen(schlaege) {
  return Array.from({ length: schlaege * 2 }, (_, i) => {
    const t = zaehlSilbe(i / 2);
    return { text: t, wert: t };
  });
}

// Die Zählsilben einer Spanne in halben Schlägen: ab 2 für 1,5 Schläge → „2 und 3“
export function silbenSpanne(beginn, dauer) {
  return Array.from({ length: Math.round(dauer * 2) }, (_, k) => {
    const p = beginn + k / 2;
    return Number.isInteger(p) ? String(p + 1) : 'und';
  }).join(' ');
}

// So zählst du, durchgehend mit „und“: 1–und (Viertel) · 2 (Achtel) · und (Achtel) · 3–und–4–und (Halbe).
// Gehaltene Silben sind mit Strichen verbunden, damit „3 und“ allein immer einen Zeitpunkt meint.
// Gebundene Noten (Haltebogen) erscheinen als ein Ton.
export function zaehlWeise(takt) {
  let pos = 0;
  const teile = [];
  for (let i = 0; i < takt.length; i++) {
    const n = takt[i];
    if (n.bogen) {
      // Alle gebundenen Noten bis zur letzten zusammenfassen
      let d = n.d;
      const namen = [WERT.note[n.d]];
      while (takt[i].bogen && i + 1 < takt.length) {
        i++;
        d += takt[i].d;
        namen.push(WERT.note[takt[i].d]);
      }
      teile.push(`${silbenSpanne(pos, d).replace(/ /g, '–')} (${namen.join(' + ')} mit Haltebogen, ein Ton)`);
      pos += d;
      continue;
    }
    teile.push(`${silbenSpanne(pos, n.d).replace(/ /g, '–')} (${n.pause ? WERT.pause[n.d] : WERT.note[n.d]})`);
    pos += n.d;
  }
  return teile.join(' · ');
}

// ---------------------------------------------------------------------------------------------
// Punktierung und Haltebogen (Etappe 8)

// Ein Takt mit punktierten Noten: punktierte Viertel + Achtel (auf einem Schlag beginnend), punktierte Halbe (auf 1),
// dazu Viertel, Achtelpaare und Halbe. bogen: eine Viertel mit Haltebogen an die nächste Note binden.
export function punktTakt(schlaege, { bogen = false } = {}) {
  for (let versuch = 0; versuch < 200; versuch++) {
    const takt = [];
    let pos = 0;
    let punktiert = false;
    while (pos < schlaege) {
      const rest = schlaege - pos;
      const moeglich = [['viertel', 2], ['paar', 1]];
      if (rest >= 2) moeglich.push(['punkt-viertel', 4]);
      if (rest >= 3 && pos === 0) moeglich.push(['punkt-halbe', 2]);
      if (rest >= 2 && (schlaege === 3 || pos % 2 === 0)) moeglich.push(['halbe', 1]);
      const art = gewichtet(moeglich);
      if (art === 'viertel') takt.push({ d: 1, pause: false });
      if (art === 'paar') takt.push({ d: 0.5, pause: false }, { d: 0.5, pause: false });
      if (art === 'punkt-viertel') takt.push({ d: 1.5, pause: false }, { d: 0.5, pause: false });
      if (art === 'punkt-halbe') takt.push({ d: 3, pause: false });
      if (art === 'halbe') takt.push({ d: 2, pause: false });
      if (art.startsWith('punkt')) punktiert = true;
      pos += { viertel: 1, paar: 1, 'punkt-viertel': 2, 'punkt-halbe': 3, halbe: 2 }[art];
    }
    if (!punktiert) continue;
    if (bogen) {
      // Eine Viertel, auf die eine weitere Note folgt, wird gebunden
      const kandidaten = takt.map((n, i) => i).filter((i) => takt[i].d === 1 && i < takt.length - 1);
      if (!kandidaten.length) continue;
      takt[waehle(kandidaten)].bogen = true;
    }
    return takt;
  }
  throw new Error('Kein passender Takt gefunden');
}

// Klingende Noten: gebundene Noten zu einem Ton zusammengefasst. Ergebnis [{ beginn, d, pause }] in Schlägen.
export function klingend(takte, schlaegeProTakt) {
  const liste = [];
  let gebunden = false;
  takte.forEach((takt, ti) => {
    let pos = ti * schlaegeProTakt;
    takt.forEach((n) => {
      if (gebunden && liste.length) liste[liste.length - 1].d += n.d;
      else liste.push({ beginn: pos, d: n.d, pause: n.pause });
      gebunden = !!n.bogen;
      pos += n.d;
    });
  });
  return liste;
}
