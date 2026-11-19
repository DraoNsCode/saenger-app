// Abzeichen. Vorläufig bestätigt (19.11.2026); das Thema soll später eventuell ganz neu angegangen werden (ENTSCHEIDUNGEN.md).
import { THEMEN, verfuegbar } from './lernweg.js';
import { zustand, aendere, rundenImThema, etappeGeschafft, fortschrittGesamt } from './speicher.js';

// Themen-Abzeichen in Stufen. Eine Runde zählt, wenn sie geschafft ist.
// Bronze zählt Runden ab „leicht“, Silber ab „mittel“, Gold nur „schwer“.
// Nach Gold geht es weiter: je weitere 25 schwere Runden ein weiteres Gold.
export const THEMEN_STUFEN = [
  { id: 'bronze', name: 'Bronze', anzahl: 25, zaehlt: ['leicht', 'mittel', 'schwer'], text: '25 geschaffte Runden, leicht oder schwerer' },
  { id: 'silber', name: 'Silber', anzahl: 25, zaehlt: ['mittel', 'schwer'], text: '25 geschaffte Runden, mittel oder schwer' },
  { id: 'gold', name: 'Gold', anzahl: 25, zaehlt: ['schwer'], text: '25 geschaffte Runden, schwer' },
];

const TAGE = [3, 10, 30, 100];
const FEHLERFREI = [1, 10, 50];

function zaehle(runden, stufen) {
  return stufen.reduce((s, k) => s + (runden[k] || 0), 0);
}

// Alle Abzeichen mit ihrem Stand
export function alleAbzeichen() {
  const z = zustand();
  const liste = [];

  THEMEN.forEach((t, i) => {
    if (!verfuegbar(t)) return;
    const r = rundenImThema(t.id);
    THEMEN_STUFEN.forEach((st) => {
      const ist = zaehle(r, st.zaehlt);
      liste.push({
        id: `thema-${t.id}-${st.id}`,
        gruppe: 'themen',
        themaId: t.id,
        etappe: i + 1,
        metall: st.id,
        titel: `${st.name}: ${t.titel}`,
        text: st.text,
        ist: Math.min(ist, st.anzahl),
        soll: st.anzahl,
        erreicht: ist >= st.anzahl,
        mehr: st.id === 'gold' ? Math.floor(ist / st.anzahl) : 0,
      });
    });
  });

  THEMEN.forEach((t, i) => {
    if (!verfuegbar(t)) return;
    const geschafft = t.stationen.filter((s) => z.stationen[s.id] && z.stationen[s.id].geschafft).length;
    liste.push({
      id: `etappe-${t.id}`,
      gruppe: 'weg',
      etappe: i + 1,
      titel: `Etappe ${i + 1} geschafft`,
      text: t.titel,
      ist: geschafft,
      soll: t.stationen.length,
      erreicht: etappeGeschafft(t.id),
    });
  });
  const f = fortschrittGesamt();
  const allesGebaut = THEMEN.every(verfuegbar);
  liste.push({
    id: 'weg-ziel',
    gruppe: 'weg',
    titel: 'Am Ziel',
    text: 'Den ganzen Leitfaden durchgespielt',
    ist: f.geschafft,
    soll: f.gesamt,
    erreicht: allesGebaut && f.geschafft === f.gesamt,
  });

  TAGE.forEach((n) => {
    liste.push({
      id: `tage-${n}`,
      gruppe: 'dranbleiben',
      zahl: n,
      titel: `An ${n} Tagen geübt`,
      text: 'Die Tage müssen nicht aufeinander folgen.',
      ist: Math.min(z.tage.length, n),
      soll: n,
      erreicht: z.tage.length >= n,
    });
  });

  FEHLERFREI.forEach((n) => {
    liste.push({
      id: `fehlerfrei-${n}`,
      gruppe: 'fehlerfrei',
      zahl: n,
      titel: n === 1 ? 'Eine Runde ohne Fehler' : `${n} Runden ohne Fehler`,
      text: 'Alle Aufgaben einer Runde richtig',
      ist: Math.min(z.fehlerfrei, n),
      soll: n,
      erreicht: z.fehlerfrei >= n,
    });
  });

  return liste;
}

// Neu erreichte Abzeichen eintragen und zurückgeben
export function neueAbzeichen() {
  const z = zustand();
  const neu = alleAbzeichen().filter((a) => a.erreicht && !z.abzeichen[a.id]);
  if (neu.length) {
    const datum = new Date().toISOString().slice(0, 10);
    aendere((s) => neu.forEach((a) => (s.abzeichen[a.id] = datum)));
  }
  return neu;
}

export const GRUPPEN = [
  { id: 'themen', titel: 'Themen', text: 'Für geschaffte Runden in einem Thema. Auch nach Gold zählt jede Runde weiter.' },
  { id: 'weg', titel: 'Leitfaden', text: 'Für jede abgeschlossene Etappe.' },
  { id: 'dranbleiben', titel: 'Dranbleiben', text: 'Für jeden Tag, an dem du übst.' },
  { id: 'fehlerfrei', titel: 'Ohne Fehler', text: 'Für Runden, in denen alles richtig ist.' },
];
