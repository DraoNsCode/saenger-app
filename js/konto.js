// Konto für „Chorlieder üben“ (Baustein D und E). Eigenes Supabase-Projekt der Sänger-App (ENTSCHEIDUNGEN.md, 27.11.2026: Weg A).
// Anmeldung mit E-Mail und Passwort, ohne Bestätigungsmail. Ein neues Konto legt die Funktion „konto-anlegen“ an,
// wenn der Chor-Code stimmt (Quelle: supabase/saenger/konto-anlegen). Die übrige App bleibt ohne Konto nutzbar.
// Beides ist Claudes Wahl (Daniel, 27.11.2026: „Setze jetzt alles so um, wie du es für am sinnvollsten hältst“).
// Ohne Bibliothek, nur mit fetch gegen die Auth-Schnittstelle von Supabase.

export const SAENGER_URL = 'https://riykqydzhrdgkweesrze.supabase.co';
// Öffentlicher Schlüssel, für den Browser gedacht (gibt ohne Anmeldung keinen Zugriff auf Daten)
export const SAENGER_SCHLUESSEL = 'sb_publishable_10P0x9VvImgLCQgUmhaQAQ_JGJUQcHa';
// Liest Liedliste und Noten nur lesend (Quelle: supabase/dirigenten/saenger-lieder)
export const LIEDER_URL = 'https://ogajbvuvehudedkdhadx.supabase.co/functions/v1/saenger-lieder';

const SPEICHER = 'choristen-app/konto';

export class KontoFehler extends Error {
  constructor(art, status = 0) {
    super(art);
    this.art = art;
    this.status = status;
  }
}

export const MELDUNGEN = {
  invalid_credentials: 'E-Mail oder Passwort stimmen nicht.',
  code: 'Der Chor-Code stimmt nicht. Frag die Chorleitung danach.',
  vorhanden: 'Für diese E-Mail gibt es schon ein Konto. Melde dich damit an.',
  passwort: 'Das Passwort braucht mindestens 8 Zeichen.',
  email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
  anmelden: 'Bitte melde dich an.',
  'nicht-erreichbar': 'Die Lieder sind gerade nicht erreichbar. Versuch es später noch einmal.',
  netz: 'Keine Verbindung. Bist du online?',
  fehler: 'Das hat nicht geklappt. Versuch es noch einmal.',
};

export function meldung(e) {
  return MELDUNGEN[e?.art] || MELDUNGEN.fehler;
}

function lese() {
  try {
    return JSON.parse(localStorage.getItem(SPEICHER));
  } catch (e) {
    return null;
  }
}
function schreibe(s) {
  try {
    if (s) localStorage.setItem(SPEICHER, JSON.stringify(s));
    else localStorage.removeItem(SPEICHER);
  } catch (e) {
    /* Speicher gesperrt */
  }
}

export function angemeldetAls() {
  return lese()?.email || null;
}

async function anfrage(url, optionen) {
  let r;
  try {
    r = await fetch(url, optionen);
  } catch (e) {
    throw new KontoFehler('netz');
  }
  const daten = await r.json().catch(() => ({}));
  return { r, daten };
}

async function auth(pfad, body) {
  const { r, daten } = await anfrage(`${SAENGER_URL}/auth/v1/${pfad}`, {
    method: 'POST',
    headers: { apikey: SAENGER_SCHLUESSEL, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new KontoFehler(daten.error_code || 'fehler', r.status);
  return daten;
}

function merke(d) {
  const s = { token: d.access_token, erneuern: d.refresh_token, bis: Date.now() + (d.expires_in || 3600) * 1000, email: d.user?.email };
  schreibe(s);
  return s;
}

export async function anmelden(email, passwort) {
  return merke(await auth('token?grant_type=password', { email: email.trim().toLowerCase(), password: passwort }));
}

export async function kontoAnlegen(email, passwort, code) {
  const { r, daten } = await anfrage(`${SAENGER_URL}/functions/v1/konto-anlegen`, {
    method: 'POST',
    headers: { apikey: SAENGER_SCHLUESSEL, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwort, code }),
  });
  if (!r.ok) throw new KontoFehler(daten.fehler || 'fehler', r.status);
  return anmelden(email, passwort);
}

// Gültiges Zugangstoken, wenn nötig erneuert
export async function token() {
  const s = lese();
  if (!s) throw new KontoFehler('anmelden');
  if (Date.now() < s.bis - 60000) return s.token;
  try {
    return merke(await auth('token?grant_type=refresh_token', { refresh_token: s.erneuern })).token;
  } catch (e) {
    if (e.status >= 400 && e.status < 500) {
      schreibe(null);
      throw new KontoFehler('anmelden');
    }
    throw e;
  }
}

export function abmelden() {
  const s = lese();
  schreibe(null);
  liederZwischenspeicher = null;
  if (s) {
    fetch(`${SAENGER_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: SAENGER_SCHLUESSEL, Authorization: `Bearer ${s.token}` } }).catch(() => {});
  }
}

let liederZwischenspeicher = null;

// Liedliste mit befristeten Links auf die Noten. Bleibt bis kurz vor Ablauf der Links im Speicher.
export async function lieder({ neu = false } = {}) {
  if (!neu && liederZwischenspeicher && Date.now() < liederZwischenspeicher.gueltigBis - 5 * 60000) return liederZwischenspeicher;
  const t = await token();
  const { r, daten } = await anfrage(LIEDER_URL, { headers: { Authorization: `Bearer ${t}` } });
  if (r.status === 401) {
    schreibe(null);
    throw new KontoFehler('anmelden', 401);
  }
  if (!r.ok || !Array.isArray(daten.lieder)) throw new KontoFehler('nicht-erreichbar', r.status);
  liederZwischenspeicher = daten;
  return daten;
}

// Suche in der Liste: Nummer („47“, „D 47“) oder Teile des Titels; sprache: 'D', 'R' oder null
export function filtere(liste, suche = '', sprache = null) {
  const s = suche.trim().toLowerCase().replace(/\s+/g, ' ');
  return liste.filter((l) => {
    if (sprache && l.sprache !== sprache) return false;
    if (!s) return true;
    if (/^\d+$/.test(s)) return String(l.nummer) === s;
    return l.titel.toLowerCase().includes(s) || l.kennung.toLowerCase() === s;
  });
}
