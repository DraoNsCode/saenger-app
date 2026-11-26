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
    // Vorläufig angenommen am 26.11.2026 (ENTSCHEIDUNGEN.md, „Etappe 3“; LERNWEG.md, „Stationen der Etappe 3“)
    stationen: [
      { id: 'nn-name', titel: 'Wie heißt die Note?', uebung: 'notenname', stufe: 'leicht' },
      { id: 'nn-name-system', titel: 'Wie heißt die Note?', uebung: 'notenname', stufe: 'mittel', freiwillig: true },
      { id: 'nn-name-woerter', titel: 'Notenwörter', uebung: 'notenname', stufe: 'schwer', freiwillig: true },
      { id: 'nn-finden', titel: 'Finde die Note', uebung: 'finde-note', stufe: 'leicht' },
      { id: 'nn-finden-nah', titel: 'Finde die Note', uebung: 'finde-note', stufe: 'mittel', freiwillig: true },
      { id: 'nn-finden-anderer', titel: 'Finde die Note im anderen Schlüssel', uebung: 'finde-note', stufe: 'schwer', freiwillig: true },
      { id: 'nn-zaehlen', titel: 'Weiterzählen', uebung: 'weiterzaehlen', stufe: 'leicht' },
      { id: 'nn-zaehlen-spruenge', titel: 'Weiterzählen', uebung: 'weiterzaehlen', stufe: 'schwer', freiwillig: true },
      { id: 'nn-klavier', titel: 'Taste am Klavier', uebung: 'klavier', stufe: 'leicht' },
      { id: 'nn-klavier-noten', titel: 'Taste am Klavier', uebung: 'klavier', stufe: 'schwer', freiwillig: true },
      { id: 'nn-abschluss', titel: 'Abschluss: Notennamen', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'achtel',
    titel: 'Achtel und Auftakt',
    kurz: 'Zählen mit „und“, Achtelpausen, der Auftakt.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 4“)
    stationen: [
      { id: 'ac-zaehlen', titel: 'Mitzählen mit „und“', uebung: 'mitzaehlen', stufe: 'leicht' },
      { id: 'ac-zaehlen-pausen', titel: 'Mitzählen mit „und“', uebung: 'mitzaehlen', stufe: 'schwer', freiwillig: true },
      { id: 'ac-auftakt', titel: 'Der Auftakt', uebung: 'auftakt', stufe: 'leicht' },
      { id: 'ac-auftakt-achtel', titel: 'Der Auftakt', uebung: 'auftakt', stufe: 'schwer', freiwillig: true },
      { id: 'ac-hoeren', titel: 'Achtel hören', uebung: 'achtel-hoeren', stufe: 'leicht' },
      { id: 'ac-hoeren-pausen', titel: 'Achtel hören', uebung: 'achtel-hoeren', stufe: 'schwer', freiwillig: true },
      { id: 'ac-klopfen', titel: 'Achtel klopfen', uebung: 'achtel-klopfen', stufe: 'leicht' },
      { id: 'ac-klopfen-ohne-klick', titel: 'Achtel klopfen', uebung: 'achtel-klopfen', stufe: 'schwer', freiwillig: true },
      { id: 'ac-abschluss', titel: 'Abschluss: Achtel und Auftakt', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'ziffern',
    titel: 'Tonleiter und Ziffern',
    kurz: 'Ganz- und Halbton, die Dur-Tonleiter, die Ziffern 1 bis 7, Stufen hören und singen.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 5“)
    stationen: [
      { id: 'zf-halbton', titel: 'Ganzton oder Halbton', uebung: 'ganz-halbton', stufe: 'leicht' },
      { id: 'zf-halbton-noten', titel: 'Ganzton oder Halbton', uebung: 'ganz-halbton', stufe: 'schwer', freiwillig: true },
      { id: 'zf-tonleiter', titel: 'Die Dur-Tonleiter', uebung: 'tonleiter', stufe: 'leicht' },
      { id: 'zf-ziffer', titel: 'Welche Ziffer?', uebung: 'ziffer-lesen', stufe: 'leicht' },
      { id: 'zf-ziffer-ohne', titel: 'Welche Ziffer?', uebung: 'ziffer-lesen', stufe: 'schwer', freiwillig: true },
      { id: 'zf-hoeren', titel: 'Ziffern hören', uebung: 'stufen-hoeren', stufe: 'leicht' },
      { id: 'zf-hoeren-alle', titel: 'Ziffern hören', uebung: 'stufen-hoeren', stufe: 'schwer', freiwillig: true },
      { id: 'zf-abschluss', titel: 'Abschluss: Tonleiter und Ziffern', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'zeichen',
    titel: 'Zeichen im Notenbild',
    kurz: 'Wiederholungen, Strophen, Klammern, laut und leise, Atemzeichen, Fermate, D.C., D.S. und Coda.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 6“)
    stationen: [
      { id: 'zc-zeichen', titel: 'Was bedeutet das Zeichen?', uebung: 'zeichen', stufe: 'leicht' },
      { id: 'zc-zeichen-mehr', titel: 'Was bedeutet das Zeichen?', uebung: 'zeichen', stufe: 'schwer', freiwillig: true },
      { id: 'zc-ablauf', titel: 'Welche Reihenfolge?', uebung: 'ablauf', stufe: 'leicht' },
      { id: 'zc-ablauf-spruenge', titel: 'Welche Reihenfolge?', uebung: 'ablauf', stufe: 'schwer', freiwillig: true },
      { id: 'zc-strophen', titel: 'Welche Strophe?', uebung: 'strophen', stufe: 'leicht' },
      { id: 'zc-strophen-drei', titel: 'Welche Strophe?', uebung: 'strophen', stufe: 'schwer', freiwillig: true },
      { id: 'zc-abschluss', titel: 'Abschluss: Zeichen im Notenbild', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'intervalle',
    titel: 'Intervalle',
    kurz: 'Sekunde bis Oktave lesen, hören und singen.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 7“)
    stationen: [
      { id: 'iv-lesen', titel: 'Intervalle lesen', uebung: 'intervall-lesen', stufe: 'leicht' },
      { id: 'iv-lesen-alle', titel: 'Intervalle lesen', uebung: 'intervall-lesen', stufe: 'schwer', freiwillig: true },
      { id: 'iv-hoeren', titel: 'Intervalle hören', uebung: 'intervall-hoeren', stufe: 'leicht' },
      { id: 'iv-hoeren-alle', titel: 'Intervalle hören', uebung: 'intervall-hoeren', stufe: 'schwer', freiwillig: true },
      { id: 'iv-abschluss', titel: 'Abschluss: Intervalle', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'punktierung',
    titel: 'Punktierung und Haltebogen',
    kurz: 'Punktierte Noten, Haltebogen, 2/2- und 6/8-Takt in zwei Schlägen.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 8“)
    stationen: [
      { id: 'pk-punkt', titel: 'Punkt und Haltebogen', uebung: 'punktierung', stufe: 'leicht' },
      { id: 'pk-punkt-zaehlen', titel: 'Punkt und Haltebogen', uebung: 'punktierung', stufe: 'schwer', freiwillig: true },
      { id: 'pk-schlaege', titel: 'Wie viele Schläge?', uebung: 'zwei-schlaege', stufe: 'leicht' },
      { id: 'pk-schlaege-note', titel: 'Wie viele Schläge?', uebung: 'zwei-schlaege', stufe: 'schwer', freiwillig: true },
      { id: 'pk-hoeren', titel: 'Punktiert hören', uebung: 'punkt-hoeren', stufe: 'leicht' },
      { id: 'pk-hoeren-bogen', titel: 'Punktiert hören', uebung: 'punkt-hoeren', stufe: 'schwer', freiwillig: true },
      { id: 'pk-abschluss', titel: 'Abschluss: Punktierung und Haltebogen', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'zusammenklang',
    titel: 'Zusammenklang',
    kurz: 'Dreiklang, Dur oder Moll, der Einsatzton, die eigene Stimme im Satz hören.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 9“)
    stationen: [
      { id: 'zk-dreiklang', titel: 'Der Dreiklang', uebung: 'dreiklang', stufe: 'leicht' },
      { id: 'zk-dreiklang-toene', titel: 'Der Dreiklang', uebung: 'dreiklang', stufe: 'schwer', freiwillig: true },
      { id: 'zk-durmoll', titel: 'Dur oder Moll?', uebung: 'dur-moll', stufe: 'leicht' },
      { id: 'zk-durmoll-zusammen', titel: 'Dur oder Moll?', uebung: 'dur-moll', stufe: 'schwer', freiwillig: true },
      { id: 'zk-einsatz', titel: 'Der Einsatzton', uebung: 'einsatzton', stufe: 'leicht' },
      { id: 'zk-einsatz-oktave', titel: 'Der Einsatzton', uebung: 'einsatzton', stufe: 'schwer', freiwillig: true },
      { id: 'zk-abschluss', titel: 'Abschluss: Zusammenklang', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'tonarten',
    titel: 'Vorzeichen und Tonarten',
    kurz: 'Kreuz, Be und Auflösungszeichen, die 1 finden, Moll.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 10“)
    stationen: [
      { id: 'tn-vorzeichen', titel: 'Kreuz und Be', uebung: 'vorzeichen', stufe: 'leicht' },
      { id: 'tn-vorzeichen-takt', titel: 'Kreuz und Be', uebung: 'vorzeichen', stufe: 'schwer', freiwillig: true },
      { id: 'tn-tonart', titel: 'Die 1 finden', uebung: 'tonart', stufe: 'leicht' },
      { id: 'tn-tonart-moll', titel: 'Die 1 finden', uebung: 'tonart', stufe: 'schwer', freiwillig: true },
      { id: 'tn-abschluss', titel: 'Abschluss: Vorzeichen und Tonarten', mischung: true, stufe: 'gemischt' },
    ],
  },
  {
    id: 'rhythmus-fein',
    titel: 'Feinheiten im Rhythmus',
    kurz: 'Synkopen, Triolen und Sechzehntel.',
    // Vorschlag von Claude vom 26.11.2026, umgesetzt, von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 11“)
    stationen: [
      { id: 'rf-synkope', titel: 'Synkopen', uebung: 'synkope', stufe: 'leicht' },
      { id: 'rf-synkope-mehr', titel: 'Synkopen', uebung: 'synkope', stufe: 'schwer', freiwillig: true },
      { id: 'rf-gruppen', titel: 'Triolen und Sechzehntel', uebung: 'schlag-gruppen', stufe: 'leicht' },
      { id: 'rf-gruppen-hoeren', titel: 'Triolen und Sechzehntel', uebung: 'schlag-gruppen', stufe: 'schwer', freiwillig: true },
      { id: 'rf-abschluss', titel: 'Abschluss: Feinheiten im Rhythmus', mischung: true, stufe: 'gemischt' },
    ],
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
