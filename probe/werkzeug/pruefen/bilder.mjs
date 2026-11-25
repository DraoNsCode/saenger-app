// Screenshots mit Chrome ohne Fenster, ohne zusätzliche Pakete (DevTools-Protokoll).
//
//   node bilder.mjs <url> <breite> <hoehe> <schaerfe> <liste.json>
//
// liste.json: [{ "datei": "a.png", "js": "k('#knopf'); await w(300)", "clip": ".szene" }, …]
//   js    läuft vor dem Bild in der Seite. k(auswahl) klickt, w(ms) wartet. „erg = …“ gibt einen Wert aus.
//   clip  nur diesen Ausschnitt aufnehmen: eine CSS-Auswahl oder { x, y, width, height }. Ohne clip: der Bildschirm.
//   datei weglassen, wenn nur js laufen soll.
// Umgebung: GRAU=1 zeigt die Seite ohne Farbe, RUHE=1 stellt „Bewegung reduzieren“ ein, CHROME_PATH nennt einen anderen Chrome.
// Ohne Node auf Daniels PC: ELECTRON_RUN_AS_NODE=1 "/c/Program Files/Microsoft VS Code/Code.exe" bilder.mjs …
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const [url, breite, hoehe, schaerfe, liste] = process.argv.slice(2);
if (!liste) {
  console.error('Aufruf: node bilder.mjs <url> <breite> <hoehe> <schaerfe> <liste.json>');
  process.exit(1);
}
const browser = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!browser) throw new Error('Kein Chrome gefunden. Pfad mit CHROME_PATH angeben.');
const profil = await mkdtemp(path.join(os.tmpdir(), 'bilder-'));
const chrome = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profil}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const ws = await new Promise((ok, nein) => {
  let t = '';
  chrome.stderr.on('data', (d) => {
    t += d;
    const m = t.match(/ws:\/\/[^\s]+/);
    if (m) ok(m[0]);
  });
  setTimeout(() => nein(new Error('Chrome startet nicht')), 20000);
});
const ziele = await (await fetch(`http://127.0.0.1:${new URL(ws).port}/json`)).json();
const sock = new WebSocket(ziele.find((z) => z.type === 'page').webSocketDebuggerUrl);
await new Promise((ok) => (sock.onopen = ok));
let nr = 0;
const offen = new Map();
const meldungen = [];
let geladen;
const laden = new Promise((ok) => (geladen = ok));
sock.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id) {
    offen.get(m.id)?.(m);
    offen.delete(m.id);
  } else if (m.method === 'Page.loadEventFired') geladen();
  else if (m.method === 'Runtime.exceptionThrown') meldungen.push('FEHLER ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) meldungen.push(m.params.type + ' ' + m.params.args.map((a) => a.value).join(' '));
  else if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) meldungen.push('HTTP ' + m.params.response.status + ' ' + m.params.response.url);
};
const ruf = (method, params = {}) =>
  new Promise((ok) => {
    const id = ++nr;
    offen.set(id, ok);
    sock.send(JSON.stringify({ id, method, params }));
  });
const aus = async (js) => {
  const r = await ruf('Runtime.evaluate', { expression: js, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) meldungen.push('JS ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text));
  return r.result?.result?.value;
};

await ruf('Page.enable');
await ruf('Runtime.enable');
await ruf('Network.enable');
await ruf('Network.setCacheDisabled', { cacheDisabled: true });
await ruf('Emulation.setDeviceMetricsOverride', { width: +breite, height: +hoehe, deviceScaleFactor: +schaerfe, mobile: false });
if (process.env.RUHE) await ruf('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (process.env.GRAU) await ruf('Emulation.setEmulatedVisionDeficiency', { type: 'achromatopsia' });
await ruf('Page.navigate', { url });
await laden;
await aus('(async()=>{window.k=(q)=>document.querySelector(q).click();window.w=(ms)=>new Promise((r)=>setTimeout(r,ms));await document.fonts.ready;await w(700)})()');
for (const { datei, js = '', clip } of JSON.parse(await readFile(liste, 'utf8'))) {
  const wert = await aus(`(async()=>{let erg;${js};await w(350);return erg})()`);
  if (wert !== undefined && wert !== null) console.log('erg:', JSON.stringify(wert));
  if (!datei) continue;
  const opt = { format: 'png' };
  if (clip) {
    const c = typeof clip === 'string' ? await aus(`(()=>{const r=document.querySelector(${JSON.stringify(clip)}).getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height}})()`) : clip;
    Object.assign(opt, { captureBeyondViewport: true, clip: { ...c, scale: 1 } });
  }
  const b = await ruf('Page.captureScreenshot', opt);
  await writeFile(datei, Buffer.from(b.result.data, 'base64'));
  console.log('Bild:', datei);
}
console.log(meldungen.length ? meldungen.join('\n') : 'keine Meldungen');
sock.close();
chrome.kill();
setTimeout(async () => {
  await rm(profil, { recursive: true, force: true, maxRetries: 5 }).catch(() => {});
  process.exit(0);
}, 600);
