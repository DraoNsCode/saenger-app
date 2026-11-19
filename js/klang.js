// Klang im Browser: einfache Klavier- und Orgeltöne, Klicks zum Einzählen, Zeitmessung beim Tippen.
// Alles wird mit der Web-Audio-Schnittstelle erzeugt, ohne Klangdateien.

let ctx = null;
let ausgang = null;
let lautstaerke = 0.8;
const laufend = new Set();

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: 'interactive' });
    const komp = ctx.createDynamicsCompressor();
    komp.threshold.value = -16;
    komp.ratio.value = 3;
    ausgang = ctx.createGain();
    ausgang.gain.value = lautstaerke;
    ausgang.connect(komp);
    komp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setzeLautstaerke(wert) {
  lautstaerke = wert;
  if (ausgang) ausgang.gain.value = wert;
}

export function jetzt() {
  return audio().currentTime;
}

function merke(quelle) {
  laufend.add(quelle);
  quelle.onended = () => laufend.delete(quelle);
}

export function stopAlles() {
  for (const q of laufend) {
    try {
      q.stop(0);
    } catch (e) {
      /* schon beendet */
    }
  }
  laufend.clear();
}

const TEILTOENE = {
  klavier: [1, 0.42, 0.24, 0.13, 0.07, 0.04],
  orgel: [1, 0.32, 0.16, 0.07],
};

// Ein Ton. m = MIDI-Nummer, start in Sekunden (Audio-Zeit), dauer in Sekunden.
export function ton(m, start, dauer, { art = 'klavier', staerke = 0.55 } = {}) {
  const c = audio();
  const f = 440 * 2 ** ((m - 69) / 12);
  const huelle = c.createGain();
  huelle.connect(ausgang);
  const spitze = staerke * 0.3;
  const anschlag = art === 'orgel' ? 0.012 : 0.004;
  huelle.gain.setValueAtTime(0, start);
  huelle.gain.linearRampToValueAtTime(spitze, start + anschlag);
  huelle.gain.setValueAtTime(spitze, Math.max(start + anschlag, start + dauer - 0.005));
  huelle.gain.setTargetAtTime(0, start + dauer, art === 'orgel' ? 0.02 : 0.07);

  const abkling = Math.max(0.35, 1.5 - (m - 48) * 0.022);
  TEILTOENE[art].forEach((a, i) => {
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.value = f * (i + 1) * (1 + 0.0003 * i * i);
    const g = c.createGain();
    if (art === 'klavier') {
      g.gain.setValueAtTime(a, start);
      g.gain.setTargetAtTime(a * 0.08, start + 0.01, abkling / (1 + i * 0.8));
    } else {
      g.gain.value = a;
    }
    o.connect(g);
    g.connect(huelle);
    o.start(start);
    o.stop(start + dauer + 0.4);
    merke(o);
  });
}

// Mehrere Töne zugleich
export function akkord(liste, start, dauer, optionen) {
  liste.forEach((m) => ton(m, start, dauer, { staerke: 0.4, ...optionen }));
}

export function klick(t, betont = false) {
  const c = audio();
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.value = betont ? 1760 : 1320;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(betont ? 0.45 : 0.28, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g);
  g.connect(ausgang);
  o.start(t);
  o.stop(t + 0.07);
  merke(o);
}

// Folge von Tönen: [{ midi, schlaege }] (midi null = Pause). Liefert die Startzeiten.
export function spieleFolge(folge, { tempo = 80, start = null, art = 'klavier', staerke } = {}) {
  const c = audio();
  const sps = 60 / tempo;
  let t = start ?? c.currentTime + 0.12;
  const zeiten = [];
  for (const n of folge) {
    zeiten.push(t);
    const dauer = n.schlaege * sps;
    if (n.midi != null) {
      const klingt = art === 'orgel' ? dauer * 0.92 : dauer * 0.95;
      if (Array.isArray(n.midi)) akkord(n.midi, t, klingt, { art });
      else ton(n.midi, t, klingt, { art, staerke });
    }
    t += dauer;
  }
  return { zeiten, ende: t, sps };
}

// Klicks im Takt. Liefert die Zeiten der Klicks.
export function klicks(start, tempo, anzahl, schlaegeProTakt = 4, leise = false) {
  const sps = 60 / tempo;
  const zeiten = [];
  for (let i = 0; i < anzahl; i++) {
    const t = start + i * sps;
    zeiten.push(t);
    if (!leise) klick(t, i % schlaegeProTakt === 0);
    else leiserKlick(t);
  }
  return zeiten;
}

function leiserKlick(t) {
  const c = audio();
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.value = 1100;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  o.connect(g);
  g.connect(ausgang);
  o.start(t);
  o.stop(t + 0.05);
  merke(o);
}

// Zu welchem Zeitpunkt (Audio-Zeit) hat die Person getippt – so, wie sie den Klang gehört hat?
export function zeitAusEreignis(ev) {
  const c = audio();
  const wann = ev && typeof ev.timeStamp === 'number' && ev.timeStamp > 0 ? ev.timeStamp : performance.now();
  if (c.getOutputTimestamp) {
    const ts = c.getOutputTimestamp();
    if (ts && ts.performanceTime > 0) {
      return ts.contextTime + (wann - ts.performanceTime) / 1000;
    }
  }
  const verzug = c.outputLatency || c.baseLatency || 0;
  return c.currentTime - (performance.now() - wann) / 1000 - verzug;
}

// Wann (performance.now) ist eine Audio-Zeit zu hören? Für Markierungen im Notenbild.
export function sichtbarAb(audioZeit) {
  const c = audio();
  if (c.getOutputTimestamp) {
    const ts = c.getOutputTimestamp();
    if (ts && ts.performanceTime > 0) return ts.performanceTime + (audioZeit - ts.contextTime) * 1000;
  }
  const verzug = c.outputLatency || c.baseLatency || 0;
  return performance.now() + (audioZeit - c.currentTime + verzug) * 1000;
}
