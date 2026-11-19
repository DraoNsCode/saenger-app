// Der Lernweg. Grundidee und Reihenfolge der Etappen sind vorläufig bestätigt (ENTSCHEIDUNGEN.md, 19.11.2026).
// Jedes Thema ist eine Etappe im Leitfaden. Dieselben Themen kann man gezielt üben.
//
// Stationen (ENTSCHEIDUNGEN.md, „Der Weg als Klostergarten“ und „Stationen nach Inhalt“, 19.11.2026):
// - Jede Übung hat eine nötige Station mit dem Kern ihrer Etappe. Das Ziel erreicht man über die nötigen Stationen.
// - freiwillig: true – geht über den Kern hinaus, ist zum Freischalten nicht nötig.
// - abThema: '<id>' – Spätblüher: braucht Wissen aus einer späteren Etappe und erscheint erst, wenn diese erreicht ist.
// - mischung: true – Abschluss der Etappe, nötig, mischt Aufgaben aus den nötigen Stationen.
// Welche Station nötig und welche freiwillig ist, steht als vorläufig angenommener Vorschlag in LERNWEG.md.
// Leicht, Mittel und Schwer sind nur grobe Orientierungswerte; nicht jede Übung hat alle drei.

export const THEMEN = [
  {
    id: 'notenbild',
    titel: 'Das Notenbild',
    kurz: 'Linien und Zwischenräume, höher und tiefer, Schritt und Sprung, die vier Stimmen im Chorsatz.',
    stationen: [
      { id: 'nb-linie', titel: 'Linie oder Zwischenraum', uebung: 'linie-zwischenraum', stufe: 'leicht' },
      { id: 'nb-linie-aussen', titel: 'Linie oder Zwischenraum', uebung: 'linie-zwischenraum', stufe: 'mittel', freiwillig: true },
      { id: 'nb-linie-hilfslinien', titel: 'Linie oder Zwischenraum', uebung: 'linie-zwischenraum', stufe: 'schwer', freiwillig: true },
      { id: 'nb-hoeher', titel: 'Höher oder tiefer', uebung: 'hoeher-tiefer', stufe: 'leicht' },
      { id: 'nb-hoeher-hilfslinien', titel: 'Höher oder tiefer', uebung: 'hoeher-tiefer', stufe: 'schwer', freiwillig: true },
      { id: 'nb-schritt', titel: 'Schritt oder Sprung', uebung: 'schritt-sprung', stufe: 'leicht' },
      { id: 'nb-schritt-hilfslinien', titel: 'Schritt oder Sprung', uebung: 'schritt-sprung', stufe: 'schwer', freiwillig: true },
      { id: 'nb-hoeren', titel: 'Hören und sehen', uebung: 'hoeren-sehen', stufe: 'leicht' },
      { id: 'nb-hoeren-drei', titel: 'Hören und sehen', uebung: 'hoeren-sehen', stufe: 'mittel', freiwillig: true },
      { id: 'nb-hoeren-vier', titel: 'Hören und sehen', uebung: 'hoeren-sehen', stufe: 'schwer', freiwillig: true },
      { id: 'nb-chorsatz', titel: 'Die Stimmen im Chorsatz', uebung: 'chorsatz', stufe: 'leicht' },
      { id: 'nb-abschluss', titel: 'Abschluss: Das Notenbild', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'schlag-takt',
    titel: 'Schlag und Takt',
    kurz: 'Grundschlag, Ganze, Halbe und Viertel, Pausen, 4/4- und 3/4-Takt.',
    stationen: [
      { id: 'st-schlag', titel: 'Im Schlag tippen', uebung: 'grundschlag', stufe: 'leicht' },
      { id: 'st-schlag-ohne-klick', titel: 'Im Schlag tippen', uebung: 'grundschlag', stufe: 'schwer', freiwillig: true },
      { id: 'st-werte', titel: 'Notenwerte', uebung: 'notenwerte', stufe: 'leicht' },
      { id: 'st-werte-namen', titel: 'Notenwerte', uebung: 'notenwerte', stufe: 'schwer', freiwillig: true },
      { id: 'st-welcher', titel: 'Auf welchem Schlag?', uebung: 'welcher-schlag', stufe: 'leicht' },
      { id: 'st-welcher-zwei-takte', titel: 'Auf welchem Schlag?', uebung: 'welcher-schlag', stufe: 'schwer', freiwillig: true },
      { id: 'st-ergaenzen', titel: 'Takt ergänzen', uebung: 'takt-ergaenzen', stufe: 'leicht' },
      { id: 'st-ergaenzen-finden', titel: 'Takt ergänzen', uebung: 'takt-ergaenzen', stufe: 'schwer', freiwillig: true },
      { id: 'st-erkennen', titel: 'Rhythmus erkennen', uebung: 'rhythmus-erkennen', stufe: 'leicht' },
      { id: 'st-erkennen-pausen', titel: 'Rhythmus erkennen', uebung: 'rhythmus-erkennen', stufe: 'mittel', freiwillig: true },
      { id: 'st-erkennen-zwei-takte', titel: 'Rhythmus erkennen', uebung: 'rhythmus-erkennen', stufe: 'schwer', freiwillig: true },
      { id: 'st-klopfen', titel: 'Rhythmus klopfen', uebung: 'rhythmus-klopfen', stufe: 'leicht' },
      { id: 'st-klopfen-zwei-takte', titel: 'Rhythmus klopfen', uebung: 'rhythmus-klopfen', stufe: 'mittel', freiwillig: true },
      { id: 'st-klopfen-ohne-klick', titel: 'Rhythmus klopfen', uebung: 'rhythmus-klopfen', stufe: 'schwer', freiwillig: true },
      { id: 'st-abschluss', titel: 'Abschluss: Schlag und Takt', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'notennamen',
    titel: 'Notennamen',
    kurz: 'c d e f g a h im eigenen Schlüssel, Hilfslinien, die Tasten am Klavier.',
  },
  {
    id: 'achtel',
    titel: 'Achtel und Auftakt',
    kurz: 'Zählen mit „und“, Achtelpausen, der Auftakt.',
  },
  {
    id: 'ziffern',
    titel: 'Tonleiter und Ziffern',
    kurz: 'Ganz- und Halbton, die Dur-Tonleiter, die Ziffern 1 bis 7, Stufen hören und singen.',
  },
  {
    id: 'zeichen',
    titel: 'Zeichen im Notenbild',
    kurz: 'Wiederholungen, Strophen, Klammern, laut und leise, Atemzeichen, Fermate, D.C., D.S. und Coda.',
  },
  {
    id: 'intervalle',
    titel: 'Intervalle',
    kurz: 'Sekunde bis Oktave lesen, hören und singen.',
  },
  {
    id: 'punktierung',
    titel: 'Punktierung und Haltebogen',
    kurz: 'Punktierte Noten, Haltebogen, 2/2- und 6/8-Takt in zwei Schlägen.',
  },
  {
    id: 'zusammenklang',
    titel: 'Zusammenklang',
    kurz: 'Dreiklang, Dur oder Moll, der Einsatzton, die eigene Stimme im Satz hören.',
  },
  {
    id: 'tonarten',
    titel: 'Vorzeichen und Tonarten',
    kurz: 'Kreuz, Be und Auflösungszeichen, die 1 finden, Moll.',
  },
  {
    id: 'rhythmus-fein',
    titel: 'Feinheiten im Rhythmus',
    kurz: 'Synkopen, Triolen und Sechzehntel.',
  },
];

export const STUFEN = ['leicht', 'mittel', 'schwer'];
export const STUFEN_NAME = { leicht: 'Leicht', mittel: 'Mittel', schwer: 'Schwer', gemischt: 'Gemischt' };

// Wie viele richtige Aufgaben eine Runde braucht (ENTSCHEIDUNGEN.md, 19.11.2026):
// 6 von 8; bei Runden mit 4 Aufgaben (Tipp-Übungen) alle 4.
// Andere Rundenlängen gibt es nicht. Für sie ist nichts entschieden, deshalb hier ein Fehler statt einer Annahme.
const NOETIG = { 8: 6, 4: 4 };

export function noetigeRichtige(gesamt) {
  if (!(gesamt in NOETIG)) throw new Error(`Für Runden mit ${gesamt} Aufgaben ist nicht festgelegt, wie viele richtig sein müssen.`);
  return NOETIG[gesamt];
}

export function thema(id) {
  return THEMEN.find((t) => t.id === id);
}

export function verfuegbar(t) {
  return Array.isArray(t.stationen) && t.stationen.length > 0;
}

export function alleStationen() {
  const liste = [];
  THEMEN.forEach((t, ti) => {
    (t.stationen || []).forEach((s) => liste.push({ ...s, themaId: t.id, etappe: ti + 1 }));
  });
  return liste;
}

export function station(id) {
  return alleStationen().find((s) => s.id === id);
}

// Nötige Stationen (mit Abschluss), in der Reihenfolge des Leitfadens
export function noetigeStationen(t) {
  const liste = t ? alleStationen().filter((s) => s.themaId === t.id) : alleStationen();
  return liste.filter((s) => !s.freiwillig);
}

// Die nötige Station derselben Übung in derselben Etappe
export function noetigeStationVon(s) {
  return alleStationen().find((n) => !n.freiwillig && !n.mischung && n.themaId === s.themaId && n.uebung === s.uebung) || null;
}

// Freiwillige Stationen zu einer nötigen Station (gleiche Übung, gleiche Etappe)
export function freiwilligeZu(s) {
  return alleStationen().filter((f) => f.freiwillig && f.themaId === s.themaId && f.uebung === s.uebung);
}

// Aufgaben für eine gemischte Runde: die nötigen Stationen der Etappe (ENTSCHEIDUNGEN.md, 19.11.2026)
export function mischungsPaare(t) {
  return noetigeStationen(t)
    .filter((s) => !s.mischung)
    .map((s) => ({ uebung: s.uebung, stufe: s.stufe }));
}

// Übungsarten eines Themas (ohne Mischung), in der Reihenfolge der Stationen
export function uebungenImThema(t) {
  const ids = [];
  (t.stationen || []).forEach((s) => {
    if (s.uebung && !ids.includes(s.uebung)) ids.push(s.uebung);
  });
  return ids;
}
