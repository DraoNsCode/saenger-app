// Der Lernweg (Vorschlag von Claude, zur Prüfung durch Daniel).
// Jedes Thema ist eine Etappe im Leitfaden. Dieselben Themen kann man gezielt üben.
// Eine Station ist eine Übungsart in einer Schwierigkeit; die letzte Station einer Etappe mischt.

export const THEMEN = [
  {
    id: 'notenbild',
    titel: 'Das Notenbild',
    kurz: 'Linien und Zwischenräume, höher und tiefer, Schritt und Sprung, die vier Stimmen im Chorsatz.',
    stationen: [
      { id: 'nb-linie', titel: 'Linie oder Zwischenraum', uebung: 'linie-zwischenraum', stufe: 'leicht' },
      { id: 'nb-hoeher', titel: 'Höher oder tiefer', uebung: 'hoeher-tiefer', stufe: 'leicht' },
      { id: 'nb-schritt', titel: 'Schritt oder Sprung', uebung: 'schritt-sprung', stufe: 'leicht' },
      { id: 'nb-hoeren', titel: 'Hören und sehen', uebung: 'hoeren-sehen', stufe: 'leicht' },
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
      { id: 'st-werte', titel: 'Notenwerte', uebung: 'notenwerte', stufe: 'leicht' },
      { id: 'st-pausen', titel: 'Pausen', uebung: 'notenwerte', stufe: 'mittel' },
      { id: 'st-welcher', titel: 'Auf welchem Schlag?', uebung: 'welcher-schlag', stufe: 'leicht' },
      { id: 'st-ergaenzen', titel: 'Takt ergänzen', uebung: 'takt-ergaenzen', stufe: 'leicht' },
      { id: 'st-erkennen', titel: 'Rhythmus erkennen', uebung: 'rhythmus-erkennen', stufe: 'leicht' },
      { id: 'st-klopfen', titel: 'Rhythmus klopfen', uebung: 'rhythmus-klopfen', stufe: 'leicht' },
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

// Eine Runde gilt als geschafft ab diesem Anteil richtiger Aufgaben (Vorschlag).
export const SCHAFFT_AB = 0.75;

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

// Übungsarten eines Themas (ohne Mischung), in der Reihenfolge der Stationen
export function uebungenImThema(t) {
  const ids = [];
  (t.stationen || []).forEach((s) => {
    if (s.uebung && !ids.includes(s.uebung)) ids.push(s.uebung);
  });
  return ids;
}
