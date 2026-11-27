// Fortschritt im Konto (Baustein E; Daniel, 27.11.2026: „Die App an sich soll ja über Konten laufen“).
// Der Browser bleibt der erste Speicher, damit die App auch ohne Netz und bei pausiertem Supabase-Projekt läuft.
// Nach dem Anmelden, beim Start und kurz nach jeder Änderung gleicht die App mit ihrer Zeile in „fortschritt“ ab.
// Zusammengeführt wird so, dass nichts verloren geht, was auf einem der Geräte geschafft wurde (mische).
// Aufbau: Claudes Wahl (Daniel, 27.11.2026: „Baue es so, wie es am sinnvollsten ist“).
import { SAENGER_URL, SAENGER_SCHLUESSEL, token } from './konto.js';
import { zustand, ersetzeZustand, setzeBeiAenderung } from './speicher.js';

const max = (x, y) => Math.max(x || 0, y || 0);

// Zwei Stände zusammenführen. a ist der Stand auf diesem Gerät, b der im Konto.
export function mische(a, b) {
  if (!b) return a;
  if (!a) return b;
  const neuesGeraet = !a.stimme && !Object.keys(a.stationen || {}).length;
  const ergebnis = { ...b, ...a };
  ergebnis.stimme = a.stimme || b.stimme || null;

  const stationen = {};
  for (const id of new Set([...Object.keys(a.stationen || {}), ...Object.keys(b.stationen || {})])) {
    const x = a.stationen?.[id];
    const y = b.stationen?.[id];
    if (!x || !y) {
      stationen[id] = { ...(x || y) };
      continue;
    }
    const besser = (y.beste || 0) > (x.beste || 0) ? y : x;
    stationen[id] = { geschafft: !!(x.geschafft || y.geschafft), beste: besser.beste, gesamt: besser.gesamt, versuche: max(x.versuche, y.versuche) };
  }
  ergebnis.stationen = stationen;

  const runden = {};
  for (const id of new Set([...Object.keys(a.runden || {}), ...Object.keys(b.runden || {})])) {
    const x = a.runden?.[id] || {};
    const y = b.runden?.[id] || {};
    runden[id] = {};
    for (const s of new Set([...Object.keys(x), ...Object.keys(y)])) runden[id][s] = max(x[s], y[s]);
  }
  ergebnis.runden = runden;

  const uebungen = {};
  for (const id of new Set([...Object.keys(a.uebungen || {}), ...Object.keys(b.uebungen || {})])) {
    const x = a.uebungen?.[id] || {};
    const y = b.uebungen?.[id] || {};
    uebungen[id] = {};
    for (const s of new Set([...Object.keys(x), ...Object.keys(y)])) {
      uebungen[id][s] = (y[s]?.runden || 0) > (x[s]?.runden || 0) ? { ...y[s] } : { ...(x[s] || y[s]) };
    }
  }
  ergebnis.uebungen = uebungen;

  ergebnis.tage = [...new Set([...(a.tage || []), ...(b.tage || [])])].sort();
  ergebnis.fehlerfrei = max(a.fehlerfrei, b.fehlerfrei);

  const abzeichen = { ...(b.abzeichen || {}) };
  for (const [id, datum] of Object.entries(a.abzeichen || {})) abzeichen[id] = abzeichen[id] && abzeichen[id] < datum ? abzeichen[id] : datum;
  ergebnis.abzeichen = abzeichen;
  ergebnis.gesehen = { ...(b.gesehen || {}), ...(a.gesehen || {}) };

  // Einstellungen: auf einem neuen Gerät die aus dem Konto, sonst die dieses Geräts
  ergebnis.einstellungen = neuesGeraet ? { ...(a.einstellungen || {}), ...(b.einstellungen || {}) } : { ...(b.einstellungen || {}), ...(a.einstellungen || {}) };

  const ablauf = { ...(b.ueben?.ablauf || {}) };
  for (const [id, n] of Object.entries(a.ueben?.ablauf || {})) ablauf[id] = max(ablauf[id], n);
  ergebnis.ueben = { ...(b.ueben || {}), ...(a.ueben || {}), ablauf };
  return ergebnis;
}

function nutzerId(t) {
  try {
    const teil = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(teil)).sub || null;
  } catch (e) {
    return null;
  }
}

async function kopf() {
  const t = await token();
  return { t, kopf: { apikey: SAENGER_SCHLUESSEL, Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } };
}

async function laden() {
  const { kopf: k } = await kopf();
  const r = await fetch(`${SAENGER_URL}/rest/v1/fortschritt?select=daten`, { headers: k });
  if (!r.ok) throw new Error(`laden ${r.status}`);
  const zeilen = await r.json();
  return zeilen[0]?.daten || null;
}

async function senden(daten) {
  const { t, kopf: k } = await kopf();
  const zeile = { daten };
  const id = nutzerId(t);
  if (id) zeile.user_id = id;
  const r = await fetch(`${SAENGER_URL}/rest/v1/fortschritt?on_conflict=user_id`, {
    method: 'POST',
    headers: { ...k, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(zeile),
  });
  if (!r.ok) throw new Error(`senden ${r.status}`);
}

// Holen, zusammenführen, zurückschreiben. Gibt zurück, ob sich auf diesem Gerät etwas geändert hat.
export async function abgleichen() {
  const vorher = JSON.stringify(zustand());
  const imKonto = await laden();
  const neu = mische(zustand(), imKonto);
  ersetzeZustand(neu);
  await senden(neu);
  return JSON.stringify(neu) !== vorher;
}

// Den Stand dieses Geräts ins Konto schreiben, ohne zusammenzuführen (nach „Fortschritt zurücksetzen“ und vor dem Abmelden)
export async function sichern() {
  await senden(zustand());
}

let zeitgeber = null;
let ungesichert = false;
// Sichern und merken, ob es geklappt hat; ohne Netz später noch einmal versuchen
function sichernMitMerken() {
  return sichern()
    .then(() => (ungesichert = false))
    .catch(() => (ungesichert = true));
}
function spaeterSichern() {
  ungesichert = true;
  clearTimeout(zeitgeber);
  zeitgeber = setTimeout(sichernMitMerken, 3000);
}

let gestartet = false;
export function starteAbgleich(beiNeuemStand) {
  setzeBeiAenderung(spaeterSichern);
  if (!gestartet) {
    gestartet = true;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && ungesichert) {
        clearTimeout(zeitgeber);
        zeitgeber = null;
        sichernMitMerken();
      } else if (!document.hidden && ungesichert) sichernMitMerken();
    });
    window.addEventListener('online', () => ungesichert && sichernMitMerken());
  }
  return abgleichen()
    .then((geaendert) => geaendert && beiNeuemStand && beiNeuemStand())
    .catch(() => {});
}

export function stoppeAbgleich() {
  clearTimeout(zeitgeber);
  zeitgeber = null;
  ungesichert = false;
  setzeBeiAenderung(null);
}
