// Begleitung für die Stimmbildung im Übe-Teil: liest die Noten, plant die Durchgänge je Stimme und spielt sie ab.
// Was die Arten bedeuten, steht oben in js/ueben/stimmbildung.js.
//
// Tonräume je Stimme (Claudes Wahl, Daniel hat am 27.11.2026 die Umsetzung Claude überlassen):
// Frauen singen wie notiert, Männer eine Oktave tiefer. Sopran und Tenor gehen zwei Halbtöne weiter nach oben,
// Alt und Bass liegen insgesamt zwei Halbtöne tiefer. Daniel prüft das mit dem Gehör.

import { audio, ton, akkord, klick } from '../klang.js';

const HALBTOENE = [0, 2, 4, 5, 7, 9, 11];
const VORZEICHEN = { sharp: 1, flat: -1, natural: 0, dblsharp: 2, dblflat: -2 };

let abcjsQuelle = null;
// Für die Prüfung ohne Browser: abcjs von außen setzen
export function setzeAbcjs(a) {
  abcjsQuelle = a;
}
function abcjs() {
  return abcjsQuelle || (typeof window !== 'undefined' ? window.ABCJS : null);
}

// Noten aus ABC: je Stimme eine Liste { midi (null = Pause), schlaege, kurz }, Gesamtlänge in Vierteln,
// Schläge je Takt. Gebundene Töne (Haltebogen) werden zu einem Ton zusammengezogen.
export function notenAus(abc) {
  const tune = abcjs().parseOnly(abc)[0];
  const stimmen = [];
  let takt = 4;
  const m = /^M:\s*(\d+)\/(\d+)/m.exec(abc);
  if (m) takt = (Number(m[1]) * 4) / Number(m[2]);
  for (const zeile of tune.lines || []) {
    if (!zeile.staff) continue;
    let nr = 0;
    zeile.staff.forEach((st) => {
      st.voices.forEach((v) => {
        const liste = stimmen[nr] || (stimmen[nr] = []);
        for (const el of v) {
          if (el.el_type !== 'note') continue;
          const schlaege = (el.duration || 0) * 4;
          if (!schlaege) continue;
          if (el.rest || !el.pitches) {
            liste.push({ midi: null, schlaege, kurz: false });
            continue;
          }
          const p = el.pitches[0];
          const okt = Math.floor(p.pitch / 7);
          const stufe = ((p.pitch % 7) + 7) % 7;
          const midi = 60 + okt * 12 + HALBTOENE[stufe] + (VORZEICHEN[p.accidental] || 0);
          const kurz = (el.decoration || []).includes('staccato');
          const vorher = liste[liste.length - 1];
          if (vorher && vorher.gebunden && vorher.midi === midi) {
            vorher.schlaege += schlaege;
            vorher.gebunden = !!p.startTie;
          } else liste.push({ midi, schlaege, kurz, gebunden: !!p.startTie });
        }
        nr++;
      });
    });
  }
  stimmen.forEach((l) => l.forEach((n) => delete n.gebunden));
  const gesamt = stimmen[0] ? stimmen[0].reduce((s, n) => s + n.schlaege, 0) : 0;
  return { stimmen, gesamt, takt };
}

export const MAENNER = new Set(['T', 'B']);

// Verschiebung je Stimme: Oktave und die zwei Halbtöne nach oben oder unten
export function anpassung(stimme, abwaerts = false) {
  const oktave = MAENNER.has(stimme) ? -12 : 0;
  if (abwaerts) return { oktave, unten: 0, oben: 0 };
  if (stimme === 'S' || stimme === 'T') return { oktave, unten: 0, oben: 2 };
  return { oktave, unten: -2, oben: -2 };
}

// Durchgänge: [{ verschiebung (Halbtöne gegenüber den Noten, ohne Oktave), zuhoeren }]
// Aufwärts bis oben und zurück bis zum Anfang; abwärts nur hinunter.
export function plane(b, stimme, notierterTon = 65) {
  let von;
  let bis;
  if (b.art === 'ton') {
    von = b.ton[0] - notierterTon;
    bis = b.ton[1] - notierterTon;
  } else if (b.tonarten) {
    [von, bis] = b.tonarten;
  } else return [{ verschiebung: 0, zuhoeren: false }];
  const abwaerts = bis < von;
  const a = anpassung(stimme, abwaerts);
  const liste = [];
  if (abwaerts) {
    for (let k = von; k >= bis; k--) liste.push(k);
  } else {
    const lo = von + a.unten;
    const hi = bis + a.oben;
    for (let k = lo; k <= hi; k++) liste.push(k);
    for (let k = hi - 1; k >= lo; k--) liste.push(k);
  }
  const plan = liste.map((k) => ({ verschiebung: k, zuhoeren: false }));
  if (b.art === 'muster' && plan.length) plan.unshift({ verschiebung: plan[0].verschiebung, zuhoeren: true });
  return plan;
}

// Tiefster und höchster Ton, den eine Übung für eine Stimme verlangt (für die Prüfung)
export function tonumfang(b, abc, stimme) {
  const plan = plane(b, stimme, notierterTon(abc));
  const okt = anpassung(stimme).oktave;
  let tief = Infinity;
  let hoch = -Infinity;
  const linie = abc ? notenAus(abc).stimmen[0].filter((n) => n.midi != null).map((n) => n.midi) : [b.ton?.[0] ?? b.ton ?? 60];
  for (const d of plan) {
    for (const m of linie) {
      const t = m + d.verschiebung + okt;
      tief = Math.min(tief, t);
      hoch = Math.max(hoch, t);
    }
  }
  return { tief, hoch };
}

export function notierterTon(abc) {
  if (!abc) return 65;
  const n = notenAus(abc).stimmen[0]?.find((x) => x.midi != null);
  return n ? n.midi : 65;
}

// ---------- Abspielen ----------

// Spielt eine Begleitung ab. Rückgabe: { stopp, nichtHoeher }.
// melde({ art: 'durchgang', nr, gesamt, zuhoeren, verschiebung }) und melde({ art: 'note', index, zeit }) und melde({ art: 'ende' })
export function starte(b, { abc = null, stimme = 'S', tempoFaktor = 1, melde = () => {} } = {}) {
  const c = audio();
  const tempo = (b.tempo || 72) * tempoFaktor;
  const sps = 60 / tempo;
  const okt = anpassung(stimme).oktave;
  const noten = abc && b.art !== 'klicks' ? notenAus(abc) : null;
  let plan = b.art === 'klicks' ? null : plane(b, stimme, notierterTon(abc));
  let nr = 0;
  let aus = false;
  let zeitgeber = null;
  let naechsterStart = c.currentTime + 0.15;

  const weiter = (ende) => {
    if (aus) return;
    const warten = Math.max(0, (ende - c.currentTime - 0.25) * 1000);
    zeitgeber = setTimeout(schritt, warten);
  };

  function klickreihe(start, anzahl, takt = 4, leise = false) {
    for (let i = 0; i < anzahl; i++) {
      const t = start + i * sps;
      if (leise) klick(t, false);
      else klick(t, i % takt === 0);
    }
    return start + anzahl * sps;
  }

  function linie(liste, start, verschiebung, { art = 'klavier', meldeNoten = true } = {}) {
    let t = start;
    liste.forEach((n, i) => {
      const dauer = n.schlaege * sps;
      if (n.midi != null) {
        const m = n.midi + verschiebung;
        ton(m, t, n.kurz ? Math.min(dauer, 0.18) : dauer * 0.96, { art });
      }
      if (meldeNoten) melde({ art: 'note', index: i, zeit: t });
      t += dauer;
    });
    return t;
  }

  function schritt() {
    if (aus) return;
    if (b.art === 'klicks') {
      // vier Takte auf einmal, dann weiter
      const takt = b.takt || 4;
      const ende = klickreihe(Math.max(naechsterStart, c.currentTime + 0.05), takt * 4, takt);
      naechsterStart = ende;
      if (nr === 0) melde({ art: 'durchgang', nr: 0, gesamt: 0 });
      nr++;
      weiter(ende);
      return;
    }
    if (nr >= plan.length) {
      zeitgeber = setTimeout(() => !aus && melde({ art: 'ende' }), Math.max(0, (naechsterStart - c.currentTime) * 1000));
      return;
    }
    const d = plan[nr];
    melde({ art: 'durchgang', nr, gesamt: plan.length, zuhoeren: d.zuhoeren, verschiebung: d.verschiebung });
    let t = Math.max(naechsterStart, c.currentTime + 0.08);

    if (b.art === 'anfangston') {
      const m = (b.ton || 60) + d.verschiebung + okt + anpassung(stimme).unten;
      ton(m, t, 2.5, { art: 'klavier' });
      naechsterStart = t + (b.abstand || 3);
    } else if (b.art === 'muster') {
      const wurzel = 60 + d.verschiebung + okt;
      akkord([wurzel, wurzel + 4, wurzel + 7], t, sps * 1.5);
      t += sps * 2;
      naechsterStart = linie(noten.stimmen[0], t, d.verschiebung + okt) + sps;
    } else if (b.art === 'ton') {
      const grund = notierterTon(abc);
      const m = grund + d.verschiebung + okt;
      ton(m, t, sps * 1.2, { art: 'klavier' });
      t += sps * 2;
      t = klickreihe(t, 4, 4);
      const laenge = noten ? noten.gesamt : b.schlaege || 8;
      const klingt = noten ? laenge - schlussPause(noten.stimmen[0]) : laenge;
      ton(m, t, klingt * sps, { art: 'orgel', staerke: 0.22 });
      if (noten) linie(noten.stimmen[0].map((n) => ({ ...n, midi: null })), t, 0);
      klickreihe(t, laenge, noten ? noten.takt : 4, true);
      naechsterStart = t + laenge * sps + sps;
    } else if (b.art === 'halteton') {
      const [oben, unten] = noten.stimmen;
      const laenge = noten.gesamt;
      const v = d.verschiebung;
      if (b.ersteEins) {
        ton(60 + v + okt, t, sps * 1.5);
        t += sps * 2;
      }
      // Der lange Ton liegt für Frauen eine Oktave unter ihrer 1, für Männer auf ihrer 1 (Handylautsprecher)
      const dron = unten[0].midi + v;
      const gesamtDauer = (4 + laenge * 2) * sps;
      ton(dron, t, gesamtDauer, { art: 'orgel', staerke: 0.3 });
      t = klickreihe(t, 4, 4);
      linie(oben, t, v + okt);
      klickreihe(t, laenge, noten.takt, true);
      t += laenge * sps;
      linie(oben.map((n) => ({ ...n, midi: null })), t, 0);
      klickreihe(t, laenge, noten.takt, true);
      naechsterStart = t + laenge * sps + sps;
    }
    nr++;
    weiter(naechsterStart);
  }

  schritt();

  return {
    stopp() {
      aus = true;
      clearTimeout(zeitgeber);
    },
    // Ab hier wieder abwärts: den Rest des Plans durch den Rückweg ab der aktuellen Tonart ersetzen
    nichtHoeher() {
      if (!plan || nr === 0) return;
      const jetzt = plan[nr - 1].verschiebung;
      const start = plan.find((p) => !p.zuhoeren)?.verschiebung ?? jetzt;
      const rest = [];
      for (let k = jetzt - 1; k >= start; k--) rest.push({ verschiebung: k, zuhoeren: false });
      plan = plan.slice(0, nr).concat(rest);
    },
    get kannUmkehren() {
      return !!plan && plan.length > 1 && b.art !== 'anfangston';
    },
  };
}

function schlussPause(liste) {
  let s = 0;
  for (let i = liste.length - 1; i >= 0 && liste[i].midi == null; i--) s += liste[i].schlaege;
  return s;
}

// Für das Notenbild: ABC so umschreiben, dass es zur Stimme passt (Bassschlüssel für Männer)
export function abcFuerStimme(abc, stimme, art) {
  if (!abc || !MAENNER.has(stimme) || art === 'halteton' || /clef=perc/.test(abc)) return abc;
  return abc.replace(/^K:([^\n]*)$/m, (z, rest) => (/clef=/.test(rest) ? z : `K:${rest} clef=bass`));
}

export function visuelleVerschiebung(stimme, art, verschiebung) {
  if (art === 'halteton') return verschiebung;
  return verschiebung + (MAENNER.has(stimme) ? -12 : 0);
}
