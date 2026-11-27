// Edge Function „saenger-lieder“ im Supabase-Projekt der Dirigenten-App (ogajbvuvehudedkdhadx).
// Gibt angemeldeten Sängern der Sänger-App die Liedliste und befristete Links auf die Noten-PDFs, nur lesend.
// Angemeldet heißt: ein gültiges Zugangstoken aus dem Projekt der Sänger-App (riykqydzhrdgkweesrze),
// geprüft mit dessen öffentlichen Schlüsseln (JWKS). Konten und Regeln der Dirigenten-App bleiben unberührt.
// Bereitgestellt mit verify_jwt = false, weil das Token aus einem anderen Projekt stammt und hier selbst geprüft wird.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5';

const SAENGER = 'https://riykqydzhrdgkweesrze.supabase.co';
const SCHLUESSEL = createRemoteJWKSet(new URL(`${SAENGER}/auth/v1/.well-known/jwks.json`));
const GUELTIG = 60 * 60 * 3; // Links auf die PDFs: drei Stunden

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'GET') return antwort({ fehler: 'methode' }, 405);

  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return antwort({ fehler: 'anmelden' }, 401);
  try {
    await jwtVerify(token, SCHLUESSEL, { issuer: `${SAENGER}/auth/v1`, audience: 'authenticated' });
  } catch (_) {
    return antwort({ fehler: 'anmelden' }, 401);
  }

  const db = createClient(Deno.env.get('SUPABASE_URL')!, geheimerSchluessel(), { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: lieder, error } = await db
    .from('lieder')
    .select('id, sprache, kuerzel, nummer, titel, noten_pfad, kategorien(name)')
    .order('sprache')
    .order('kuerzel')
    .order('nummer');
  if (error) return antwort({ fehler: 'intern' }, 500);

  const pfade = lieder.map((l) => l.noten_pfad).filter(Boolean) as string[];
  const links = new Map<string, string>();
  if (pfade.length) {
    const { data: signiert } = await db.storage.from('noten').createSignedUrls(pfade, GUELTIG);
    for (const s of signiert ?? []) if (s.signedUrl && s.path) links.set(s.path, s.signedUrl);
  }

  return antwort({
    gueltigBis: Date.now() + GUELTIG * 1000,
    lieder: lieder.map((l) => ({
      id: l.id,
      sprache: l.sprache,
      kennung: `${l.kuerzel} ${l.nummer}`,
      nummer: l.nummer,
      titel: l.titel,
      // deno-lint-ignore no-explicit-any
      kategorie: (l as any).kategorien?.name ?? null,
      noten: l.noten_pfad ? links.get(l.noten_pfad) ?? null : null,
    })),
  });
});
