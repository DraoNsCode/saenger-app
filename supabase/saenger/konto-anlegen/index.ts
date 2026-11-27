// Edge Function „konto-anlegen“ im Supabase-Projekt der Sänger-App (riykqydzhrdgkweesrze).
// Legt ein Konto mit E-Mail und Passwort an, wenn der Chor-Code stimmt. Das Konto ist sofort bestätigt,
// es wird keine Mail verschickt (der eingebaute Mailversand von Supabase schickt nur ans eigene Team).
// Den Chor-Code ändert Daniel im SQL-Editor: update public.zugang set code = '…' where id = 1;
// Bereitgestellt mit verify_jwt = false: Wer noch kein Konto hat, hat kein Token.
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function antwort(daten: unknown, status = 200) {
  return new Response(JSON.stringify(daten), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function geheimerSchluessel(): string {
  const neu = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (neu) {
    try {
      const k = JSON.parse(neu).default;
      if (k) return k;
    } catch (_) {
      /* weiter mit dem alten Schlüssel */
    }
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
}

// Vergleich ohne Abkürzung, damit die Laufzeit nichts verrät
function gleich(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return antwort({ fehler: 'methode' }, 405);

  let daten: Record<string, unknown>;
  try {
    daten = await req.json();
  } catch (_) {
    return antwort({ fehler: 'ungueltig' }, 400);
  }
  const email = String(daten.email ?? '').trim().toLowerCase();
  const passwort = String(daten.passwort ?? '');
  const code = String(daten.code ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return antwort({ fehler: 'email' }, 400);
  if (passwort.length < 8) return antwort({ fehler: 'passwort' }, 400);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, geheimerSchluessel(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: zugang, error: fehlerZugang } = await admin.from('zugang').select('code').eq('id', 1).single();
  if (fehlerZugang || !zugang) return antwort({ fehler: 'intern' }, 500);

  if (!gleich(code.toLowerCase(), String(zugang.code).trim().toLowerCase())) {
    await new Promise((r) => setTimeout(r, 800)); // Raten bremsen
    return antwort({ fehler: 'code' }, 403);
  }

  const { error } = await admin.auth.admin.createUser({ email, password: passwort, email_confirm: true });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) return antwort({ fehler: 'vorhanden' }, 409);
    if (/password/i.test(error.message)) return antwort({ fehler: 'passwort' }, 400);
    return antwort({ fehler: 'intern' }, 500);
  }
  return antwort({ ok: true });
});
