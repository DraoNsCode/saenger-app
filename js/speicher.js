// Fortschritt pro Gerät im Browser (localStorage).
import { thema, verfuegbar, THEMEN, noetigeRichtige, noetigeStationen, noetigeStationVon, station } from './lernweg.js';

const SCHLUESSEL = 'choristen-app/v1';

function leer() {
  return {
    version: 1,
    stimme: null,
    stationen: {}, // id -> { geschafft, beste, gesamt, versuche }
    runden: {}, // themaId -> { leicht, mittel, schwer } geschaffte Runden
    uebungen: {}, // uebungId -> { stufe -> { runden, richtig, aufgaben } }
    tage: [], // Tage, an denen geübt wurde (JJJJ-MM-TT)
    fehlerfrei: 0,
    abzeichen: {}, // id -> Datum
    gesehen: {}, // Erklärungen, die schon gezeigt wurden
    einstellungen: { lautstaerke: 0.8 },
  };
}

let z = lade();

function lade() {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (roh) return { ...leer(), ...JSON.parse(roh) };
  } catch (e) {
    /* Speicher nicht verfügbar */
  }
  return leer();
}

export function speichere() {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(z));
  } catch (e) {
    /* Speicher voll oder gesperrt */
  }
}

export function zustand() {
  return z;
}

export function aendere(fn) {
  fn(z);
  speichere();
}

export function zuruecksetzen() {
  const stimme = z.stimme;
  const einstellungen = z.einstellungen;
  z = leer();
  z.stimme = stimme;
  z.einstellungen = einstellungen;
  speichere();
}

function heute() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Ergebnis einer Runde eintragen
export function ergebnisErfassen({ themaId, uebungId, stufe, stationId, richtig, gesamt }) {
  const geschafft = richtig >= noetigeRichtige(gesamt);
  let stationNeu = false;
  aendere((s) => {
    const tag = heute();
    if (!s.tage.includes(tag)) s.tage.push(tag);

    const zaehlStufe = stufe === 'gemischt' ? 'leicht' : stufe;
    if (geschafft) {
      s.runden[themaId] = s.runden[themaId] || { leicht: 0, mittel: 0, schwer: 0 };
      s.runden[themaId][zaehlStufe] += 1;
    }
    if (richtig === gesamt) s.fehlerfrei += 1;

    if (uebungId) {
      s.uebungen[uebungId] = s.uebungen[uebungId] || {};
      const u = (s.uebungen[uebungId][zaehlStufe] = s.uebungen[uebungId][zaehlStufe] || { runden: 0, richtig: 0, aufgaben: 0 });
      u.runden += 1;
      u.richtig += richtig;
      u.aufgaben += gesamt;
    }

    if (stationId) {
      const st = (s.stationen[stationId] = s.stationen[stationId] || { geschafft: false, beste: 0, gesamt, versuche: 0 });
      st.versuche += 1;
      st.gesamt = gesamt;
      st.beste = Math.max(st.beste, richtig);
      if (geschafft && !st.geschafft) {
        st.geschafft = true;
        stationNeu = true;
      }
    }
  });
  return { geschafft, stationNeu };
}

export function stationGeschafft(id) {
  return !!(z.stationen[id] && z.stationen[id].geschafft);
}

// Die nächste offene nötige Station im Leitfaden (nur gebaute Etappen). Freiwillige Stationen zählen nicht.
export function naechsteStation() {
  return noetigeStationen().find((s) => !stationGeschafft(s.id)) || null;
}

// Eine Etappe ist erreicht, wenn alle nötigen Stationen der Etappen davor geschafft sind.
export function etappeErreicht(themaId) {
  const index = THEMEN.findIndex((t) => t.id === themaId);
  if (index < 0) return false;
  return THEMEN.slice(0, index).every((t) => noetigeStationen(t).every((s) => stationGeschafft(s.id)));
}

// Spätblüher erscheinen erst, wenn die Etappe erreicht ist, deren Wissen sie brauchen (ENTSCHEIDUNGEN.md, 19.11.2026).
export function stationSichtbar(id) {
  const s = station(id);
  if (!s) return false;
  return !s.abThema || etappeErreicht(s.abThema);
}

// Nötige Stationen öffnen sich nacheinander. Freiwillige öffnen sich, sobald die nötige Station
// derselben Übung geschafft ist (Vorschlag in LERNWEG.md); Spätblüher zusätzlich erst, wenn sie sichtbar sind.
export function stationOffen(id) {
  const s = station(id);
  if (!s) return false;
  if (stationGeschafft(id)) return true;
  if (s.freiwillig) {
    const n = noetigeStationVon(s);
    return !!n && stationGeschafft(n.id) && stationSichtbar(id);
  }
  const n = naechsteStation();
  return !!n && n.id === id;
}

// Eine Etappe ist geschafft, wenn ihre nötigen Stationen geschafft sind.
export function etappeGeschafft(themaId) {
  const t = thema(themaId);
  return verfuegbar(t) && noetigeStationen(t).every((s) => stationGeschafft(s.id));
}

// Fortschritt im Leitfaden: nur nötige Stationen
export function fortschrittGesamt() {
  const alle = noetigeStationen();
  return { geschafft: alle.filter((s) => stationGeschafft(s.id)).length, gesamt: alle.length };
}

export function rundenImThema(themaId) {
  return z.runden[themaId] || { leicht: 0, mittel: 0, schwer: 0 };
}

export function gebauteThemen() {
  return THEMEN.filter(verfuegbar);
}
