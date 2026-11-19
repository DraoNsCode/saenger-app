// Klick-Test: startet die App in einem echten Browser (ohne Fenster), klickt sie durch,
// macht Screenshots in Handy- und PC-Größe und sammelt Fehler aus der Konsole.
//
// Start: npm install (einmal), dann npm run klicktest (voll, etwa 4 Minuten)
// oder npm run klicktest:schnell (nur Handy, je Übung und Stufe nur die erste Aufgabe, unter einer Minute)
// Ergebnis: pruefung/ausgabe/ (Screenshots und bericht.txt, nicht im Repository)
// Braucht Chrome, Chromium oder Edge. Anderer Pfad: Umgebungsvariable CHROME_PATH setzen.
//
// Was der Test nicht prüft: Klang, musikalischen Inhalt und wie sich das Üben anfühlt.

import { createServer } from 'node:http';
import { readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { UEBUNGEN } from '../js/uebungen/index.js';
import { THEMEN, alleStationen } from '../js/lernweg.js';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(WURZEL, 'pruefung', 'ausgabe');

const SCHNELL = process.argv.includes('--schnell');
const HANDY = { name: 'handy', viewport: { width: 390, height: 844 }, stimme: 'Sopran', ganzeRunden: true };
const PC = { name: 'pc', viewport: { width: 1280, height: 800 }, stimme: 'Tenor', ganzeRunden: false };
// Voll: auf dem Handy werden die Runden ganz durchgespielt, am PC nur die erste Aufgabe gezeigt.
// Schnell: nur das Handy und nur die erste Aufgabe, keine ganzen und keine gemischten Runden.
const GERAETE = SCHNELL ? [{ ...HANDY, ganzeRunden: false }] : [HANDY, PC];
const ANSICHTEN = ['weg', 'themen', ...THEMEN.filter((t) => t.stationen).map((t) => `thema/${t.id}`), 'abzeichen', 'ueben', 'einstellungen'];

// ---------- kleiner Server für die App ----------

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

function starteServer() {
  const server = createServer(async (req, res) => {
    const pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let datei = path.join(WURZEL, pfad.endsWith('/') ? pfad + 'index.html' : pfad);
    if (!datei.startsWith(WURZEL)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const inhalt = await readFile(datei);
      res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream' });
      res.end(inhalt);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

function findeBrowser() {
  const kandidaten = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/google/chrome/chrome',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return kandidaten.find((p) => p && existsSync(p));
}

// ---------- Test ----------

const probleme = [];
const hinweise = [];
let bilder = 0;

async function pruefeGeraet(browser, basis, geraet) {
  const ordner = path.join(AUSGABE, geraet.name);
  await mkdir(ordner, { recursive: true });
  const kontext = await browser.newContext({ viewport: geraet.viewport, deviceScaleFactor: 2, hasTouch: geraet.name === 'handy' });
  const seite = await kontext.newPage();
  let wo = 'Start';
  let nr = 0;

  seite.on('console', (m) => {
    if (m.type() === 'error') probleme.push(`${geraet.name}, ${wo}: Konsole: ${m.text()}`);
    else if (m.type() === 'warning') hinweise.push(`${geraet.name}, ${wo}: Konsole: ${m.text()}`);
  });
  seite.on('pageerror', (e) => probleme.push(`${geraet.name}, ${wo}: Fehler im Skript: ${e.message}`));
  seite.on('response', (r) => {
    if (r.status() >= 400) probleme.push(`${geraet.name}, ${wo}: Datei fehlt (${r.status()}): ${r.url()}`);
  });

  async function bild(name) {
    await seite.waitForTimeout(350); // Notenbild und Schriften fertig zeichnen lassen
    nr++;
    await seite.screenshot({ path: path.join(ordner, `${String(nr).padStart(3, '0')}-${name}.png`), fullPage: true });
    bilder++;
    const zuBreit = await seite.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (zuBreit) probleme.push(`${geraet.name}, ${wo}: Seite ist breiter als der Bildschirm (seitlich verschiebbar)`);
  }

  async function geheZu(hash) {
    await seite.evaluate((h) => (location.hash = h), hash);
    await seite.waitForTimeout(150);
  }

  // Eine Runde spielen: Antworten werden der Reihe nach mit der ersten Möglichkeit gegeben,
  // Tipp-Aufgaben laufen ohne Tippen durch.
  async function spieleRunde(name, ganz) {
    const los = seite.locator('.runde-body .knopf.haupt', { hasText: 'Los geht' });
    if (await los.count()) {
      await bild(`${name}-erklaerung`);
      await los.click();
    }
    for (let aufgabe = 1; ; aufgabe++) {
      await seite.waitForSelector('.runde-body .optionen, .runde-body .tipp-flaeche, .ergebnis', { timeout: 10000 });
      if (await seite.locator('.ergebnis').count()) {
        await bild(`${name}-ergebnis`);
        return;
      }
      const tipp = (await seite.locator('.runde-body .tipp-flaeche').count()) > 0;
      if (aufgabe === 1) await bild(`${name}-aufgabe`);
      if (!ganz) return;
      if (tipp) await seite.locator('.runde-body .knopf.haupt', { hasText: 'Start' }).click();
      else await seite.locator('.runde-body .optionen button').first().click();
      await seite.waitForSelector('.runde-fuss:not([hidden]) .knopf.haupt', { timeout: tipp ? 60000 : 5000 });
      if (aufgabe === 1) await bild(`${name}-rueckmeldung`);
      // Tipp-Übungen dauern lange: dort reicht die erste Aufgabe, außer in gemischten Runden.
      if (tipp && !name.startsWith('mix')) return;
      await seite.locator('.runde-fuss .knopf.haupt').click();
    }
  }

  async function schritt(name, fn) {
    wo = name;
    try {
      await fn();
    } catch (e) {
      probleme.push(`${geraet.name}, ${name}: Ablauf hängt: ${e.message.split('\n')[0]}`);
      await bild(`${name}-haengt`).catch(() => {});
    }
  }

  await schritt('start', async () => {
    await seite.goto(basis, { waitUntil: 'networkidle' });
    await bild('start');
    await seite.locator('.stimm-knopf', { hasText: geraet.stimme }).click();
    await seite.waitForTimeout(200);
  });

  for (const ansicht of ANSICHTEN) {
    await schritt(ansicht.replace('/', '-'), async () => {
      await geheZu(`#/${ansicht}`);
      await bild(ansicht.replace('/', '-'));
    });
  }

  const erste = alleStationen()[0];
  await schritt(`station-${erste.id}`, async () => {
    await geheZu(`#/station/${erste.id}`);
    await spieleRunde(`station-${erste.id}`, geraet.ganzeRunden);
  });

  // Nötige und freiwillige Stationen (ENTSCHEIDUNGEN.md, 19.11.2026): Fortschritt bis vor den Abschluss
  // der ersten Etappe setzen, dann das Blatt mit den freiwilligen Stationen, eine freiwillige Station und den Abschluss.
  const [etappe1, etappe2] = THEMEN.filter((t) => t.stationen);
  const noetig1 = etappe1.stationen.filter((s) => !s.freiwillig);
  const abschluss1 = noetig1[noetig1.length - 1];
  const erstesFreiwillig = etappe1.stationen.find((s) => s.freiwillig);
  await schritt('leitfaden', async () => {
    await seite.evaluate((ids) => {
      const z = JSON.parse(localStorage.getItem('choristen-app/v1'));
      z.stationen = {};
      ids.forEach((id) => (z.stationen[id] = { geschafft: true, beste: 8, gesamt: 8, versuche: 1 }));
      localStorage.setItem('choristen-app/v1', JSON.stringify(z));
    }, noetig1.slice(0, -1).map((s) => s.id));
    await seite.reload({ waitUntil: 'networkidle' });
    await geheZu('#/weg');
    await bild('leitfaden-weg');
    await seite.getByRole('button', { name: new RegExp(`^${noetig1[0].titel}, geschafft`) }).click();
    await seite.waitForSelector('.freiwillig-liste');
    await bild('leitfaden-blatt-freiwillig');
    await seite.keyboard.press('Escape');
    await seite.waitForTimeout(200);
  });
  await schritt(`station-${erstesFreiwillig.id}`, async () => {
    await geheZu(`#/station/${erstesFreiwillig.id}`);
    await spieleRunde(`station-${erstesFreiwillig.id}`, geraet.ganzeRunden);
  });
  await schritt(`station-${abschluss1.id}`, async () => {
    await geheZu(`#/station/${abschluss1.id}`);
    await spieleRunde(`station-${abschluss1.id}`, geraet.ganzeRunden);
  });
  await schritt('leitfaden-blatt-offen', async () => {
    // Blatt einer offenen nötigen Station, die noch nicht geschafft ist: Hinweis auf die freiwilligen Stationen
    await seite.evaluate((ids) => {
      const z = JSON.parse(localStorage.getItem('choristen-app/v1'));
      ids.forEach((id) => (z.stationen[id] = { geschafft: true, beste: 8, gesamt: 8, versuche: 1 }));
      localStorage.setItem('choristen-app/v1', JSON.stringify(z));
    }, noetig1.map((s) => s.id));
    await seite.reload({ waitUntil: 'networkidle' });
    const s = etappe2.stationen[0];
    await geheZu('#/weg');
    await seite.getByRole('button', { name: new RegExp(`^${s.titel},`) }).first().click();
    await seite.waitForSelector('.blatt-inhalt');
    await bild('leitfaden-blatt-offen');
    await seite.keyboard.press('Escape');
    await seite.waitForTimeout(200);
  });

  for (const [id, u] of Object.entries(UEBUNGEN)) {
    for (const stufe of Object.keys(u.stufen)) {
      await schritt(`frei-${id}-${stufe}`, async () => {
        await geheZu(`#/frei/${id}/${stufe}`);
        await spieleRunde(`frei-${id}-${stufe}`, geraet.ganzeRunden);
      });
    }
  }

  if (geraet.ganzeRunden) {
    for (const t of THEMEN.filter((t) => t.stationen)) {
      await schritt(`mix-${t.id}`, async () => {
        await geheZu(`#/mix/${t.id}`);
        await spieleRunde(`mix-${t.id}`, true);
      });
    }
  }

  await kontext.close();
}

const browserPfad = findeBrowser();
if (!browserPfad) {
  console.error('Kein Chrome, Chromium oder Edge gefunden. Pfad mit CHROME_PATH angeben.');
  process.exit(2);
}

const beginn = Date.now();
await rm(AUSGABE, { recursive: true, force: true });
await mkdir(AUSGABE, { recursive: true });
const server = await starteServer();
const basis = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({
  executablePath: browserPfad,
  args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'],
});

try {
  for (const geraet of GERAETE) await pruefeGeraet(browser, basis, geraet);
} finally {
  await browser.close();
  server.close();
}

const dauer = Math.round((Date.now() - beginn) / 1000);
const zeilen = [
  `Klick-Test (${SCHNELL ? 'schnell' : 'voll'}) vom ${new Date().toLocaleString('de-DE')}, Dauer ${dauer} s`,
  `Screenshots: ${bilder} in pruefung/ausgabe/ (${GERAETE.map((g) => `${g.name}: ${g.stimme}`).join(', ')})`,
  '',
  probleme.length ? `Probleme (${probleme.length}):` : 'Probleme: keine',
  ...probleme.map((p) => `- ${p}`),
  '',
  hinweise.length ? `Hinweise (${hinweise.length}):` : 'Hinweise: keine',
  ...hinweise.map((p) => `- ${p}`),
  '',
  'Nicht geprüft: Klang, musikalischer Inhalt, wie sich das Üben anfühlt.',
];
await writeFile(path.join(AUSGABE, 'bericht.txt'), zeilen.join('\n') + '\n');
console.log(zeilen.join('\n'));
process.exit(probleme.length ? 1 : 0);
