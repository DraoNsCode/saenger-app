// Probe zu Baustein B, Teil 2: setzt den Garten aus Kacheln zusammen und zeigt seine Zustände.
// Stationen, Titel und Reihenfolge kommen aus js/lernweg.js. Gespeichert wird nichts.
import { h, blatt } from '../js/ui.js';
import { THEMEN, noetigeStationen, noetigeStationVon, station } from '../js/lernweg.js';
import { UEBUNGEN } from '../js/uebungen/index.js';
import { JAHRESZEITEN } from './jahreszeiten.js';
import { standbild } from './standbild.js';

const THEMA = THEMEN[0];
const NOETIG = noetigeStationen(THEMA);

// Vorschlag nur für die Probe: drei offene Stellen mit je zwei freiwilligen Stationen
const STELLEN = [
  { id: 'a', titel: 'Das Gemüsebeet', stationen: ['nb-linie-aussen', 'nb-linie-hilfslinien'] },
  { id: 'b', titel: 'Die Bohnenstangen', stationen: ['nb-hoeher-hilfslinien', 'nb-schritt-hilfslinien'] },
  { id: 'c', titel: 'Die Vogeltränke', stationen: ['nb-hoeren-drei', 'nb-hoeren-vier'] },
];
const FREIWILLIG = STELLEN.flatMap((s) => s.stationen);
const ALLE = [...NOETIG.map((s) => s.id), ...FREIWILLIG];

const STUFEN = {
  verborgen: { name: 'Noch nicht erreicht', geschafft: [] },
  neu: { name: 'Gerade erreicht', geschafft: [] },
  arbeit: { name: 'In Arbeit', geschafft: NOETIG.slice(0, 3).map((s) => s.id) },
  angelegt: { name: 'Angelegt', geschafft: NOETIG.map((s) => s.id) },
  ausgebaut: { name: 'Weiter ausgebaut', geschafft: [...NOETIG.map((s) => s.id), ...STELLEN[0].stationen, STELLEN[1].stationen[0]] },
  fertig: { name: 'Fertig ausgebaut', geschafft: ALLE },
};

// Brainstorming: wie sich unbearbeitet und bearbeitet stärker unterscheiden (probe/werkzeug/wandel.py).
// Jede Variante ist ein eigenes Bild des ersten Bereichs, bedient wird sie gleich.
const WANDEL = {
  bisher: { name: 'Bisher', bereich: 'bereich-1', platzhalter: 'platzhalter' },
  kraeftig: { name: 'Kräftiger', bereich: 'bereich-1-kraeftig', platzhalter: 'platzhalter' },
  flaechen: { name: 'Flächen', bereich: 'bereich-1-flaechen', platzhalter: 'platzhalter', titel: { a: 'Das Gemüsefeld', b: 'Der Obstgarten', c: 'Der Kreuzgarten' } },
  boden: { name: 'Boden', bereich: 'bereich-1-boden', platzhalter: 'platzhalter-boden' },
  zusammen: { name: 'Zusammen', bereich: 'bereich-1-zusammen', platzhalter: 'platzhalter-boden', titel: { a: 'Das Gemüsefeld', b: 'Der Obstgarten', c: 'Der Kreuzgarten' } },
};

// Welche Stile schon gerechnet sind: alle für „Bisher“, Aquarell auch für „Zusammen“
const stilGeht = (stil, wandel) => stil === 'original' || wandel === 'bisher' || (wandel === 'zusammen' && stil === 'aquarell');

// Stile: Das Original ist SVG, die anderen sind daraus gerechnet (probe/werkzeug/stilbilder.mjs)
const stand = { wandel: 'zusammen', stil: 'original', zeit: 'sommer', licht: 'tag', ueppig: true, stufe: 'arbeit', geschafft: new Set(STUFEN.arbeit.geschafft), verborgen: false, pflege: false, gepflegt: false, spaet: 'aus', tausch: false, raender: false };

const garten = document.querySelector('.garten');
const tafel = document.querySelector('.tafel');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)');
const kacheln = {};

// ---------- Laden ----------

const speicher = new Map();

// Die gerechneten Stile haben dieselben vier Dateien wie das Original. Die Jahreszeit tauscht Farben, das geht nur im Original.
async function ladeText(name) {
  const pfad = stand.stil === 'original' ? `bilder/garten/${name}.svg` : `bilder/stile/${stand.stil}/${name}.svg`;
  if (!speicher.has(pfad)) {
    const antwort = await fetch(pfad);
    if (!antwort.ok) throw new Error(`${pfad}: ${antwort.status}`);
    speicher.set(pfad, await antwort.text());
  }
  const text = speicher.get(pfad);
  const tausch = stand.stil === 'original' ? JAHRESZEITEN[stand.zeit] : null;
  return tausch ? text.replace(/#[0-9a-f]{6}/g, (f) => tausch[f] || f) : text;
}

async function ladeSvg(name) {
  const text = await ladeText(name);
  const svg = document.importNode(new DOMParser().parseFromString(text, 'image/svg+xml').documentElement, true);
  if (svg.nodeName !== 'svg') throw new Error(`${name}.svg ist kein gültiges SVG`);
  return { svg };
}

// Die Wasserlinien bewegen sich dauernd. In einer eigenen schmalen Ebene zeichnet der Browser nur sie neu,
// nicht die ganze Kachel. Sie beginnen unter der Mauer, damit sie nicht über dem Durchlass liegen.
function wasserEbene(svg, hoehe) {
  const linien = [...svg.querySelectorAll('.g-fliesst')];
  if (!linien.length) return null;
  const NS = 'http://www.w3.org/2000/svg';
  const VON = 64;
  const ebene = document.createElementNS(NS, 'svg');
  ebene.setAttribute('viewBox', `310 ${VON} 90 ${hoehe - VON}`);
  ebene.setAttribute('class', 'wasser');
  ebene.setAttribute('aria-hidden', 'true');
  ebene.style.top = `${(VON / hoehe) * 100}%`;
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', linien[0].closest('[transform]').getAttribute('transform'));
  g.append(...linien);
  ebene.append(g);
  return ebene;
}

let beobachter = null;
let laeuft = 0;
let musterbogen = null;
let bilderFertig = Promise.resolve();

// Das Original wird als fertiges Bild eingesetzt (standbild.js). Das SVG mit allen Zuständen bleibt unsichtbar die Vorlage.
// Die gerechneten Stile bestehen schon aus Bildern und bleiben, wie sie sind.
async function male(n, sanft) {
  const k = kacheln[n];
  const { text, ebene, oben, hoch } = standbild(k.svg, musterbogen, k.el.classList.contains('verborgen'));
  k.el.querySelector('.bewegt')?.remove();
  (k.el.querySelector('.wasser') || k.svg).after(ebene);
  if (text === k.text) return;
  k.text = text;
  const nr = (k.nr = (k.nr || 0) + 1);
  const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
  const bild = new Image();
  bild.alt = '';
  bild.className = 'standbild';
  Object.assign(bild.style, { top: oben, height: hoch });
  bild.src = url;
  try {
    await bild.decode();
  } catch {
    // Kann der Browser das Bild nicht zeigen, bleibt das SVG sichtbar
    k.svg.classList.remove('vorlage');
    return URL.revokeObjectURL(url);
  }
  if (nr !== k.nr) return URL.revokeObjectURL(url);
  const alte = [...k.el.querySelectorAll('.standbild')];
  const fort = () => alte.forEach((a) => (URL.revokeObjectURL(a.src), a.remove()));
  if (alte.length) alte.at(-1).after(bild);
  else k.svg.after(bild);
  k.svg.classList.add('vorlage');
  if (sanft && alte.length && !ruhig.matches) {
    bild.classList.add('erscheint');
    bild.addEventListener('animationend', fort, { once: true });
  } else fort();
}

async function lade() {
  const nr = ++laeuft;
  const namen = ['teile', 'anfang', 'bereich-1', 'platzhalter'];
  const datei = { 'bereich-1': WANDEL[stand.wandel].bereich, platzhalter: WANDEL[stand.wandel].platzhalter };
  const geladen = Object.fromEntries(await Promise.all(namen.map(async (n) => [n, await ladeSvg(datei[n] || n)])));
  if (nr !== laeuft) return false;
  document.querySelector('.musterbogen')?.remove();
  beobachter?.disconnect();
  // Musterbogen: unsichtbar, aber nicht display:none, sonst fehlen Verläufe
  const bogen = geladen.teile.svg;
  bogen.setAttribute('class', 'musterbogen');
  bogen.setAttribute('aria-hidden', 'true');
  bogen.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  document.body.prepend(bogen);
  musterbogen = bogen;
  for (const n of namen.slice(1)) {
    const { svg } = geladen[n];
    const hoehe = svg.viewBox.baseVal.height;
    const el = h('section', { class: 'kachel', style: `--h:${hoehe}` });
    el.append(svg);
    if (stand.stil === 'original') svg.classList.add('vorlage');
    el.dataset.kachel = n;
    const wasser = wasserEbene(svg, hoehe);
    if (wasser) el.append(wasser);
    kacheln[n] = { el, svg, hoehe, knoepfe: h('div') };
    if (n !== 'anfang') {
      kacheln[n].schild = h('p', { class: 'etappen-schild' });
      el.append(kacheln[n].schild);
    }
    el.append(kacheln[n].knoepfe);
  }
  beobachter = new IntersectionObserver((e) => e.forEach((x) => x.target.classList.toggle('im-bild', x.isIntersecting)));
  namen.slice(1).forEach((n) => beobachter.observe(kacheln[n].el));
  garten.replaceChildren();
  return true;
}

// Die Mitte des Bildschirms als Stelle im ersten Bereich: Die Varianten sind verschieden hoch
function stelleImBild() {
  const r = kacheln['bereich-1'].el.getBoundingClientRect();
  return (window.innerHeight / 2 - r.top) / r.height;
}

// Bild wechseln (Variante, Stil, Jahreszeit), ohne die Stelle im Garten zu verlieren
async function wechsle() {
  const stelle = stelleImBild();
  try {
    if (!(await lade())) return;
  } catch (fehler) {
    garten.replaceChildren(h('p', { class: 'garten-laedt' }, `Der Garten lässt sich nicht laden (${fehler.message}).`));
    return;
  }
  zeichne();
  const r = kacheln['bereich-1'].el.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + r.top + r.height * stelle - window.innerHeight / 2, behavior: 'instant' });
}

// ---------- Ableiten: was der Fortschritt im Bild bedeutet ----------

const geschafft = (id) => stand.geschafft.has(id);
const naechste = () => NOETIG.find((s) => !geschafft(s.id)) || null;
const alleNoetigen = () => !naechste();
const allesFertig = () => ALLE.every(geschafft);
const offenFreiwillig = (id) => geschafft(noetigeStationVon(station(id)).id);

function stellenZustand(s) {
  const fertig = s.stationen.filter(geschafft).length;
  if (fertig === s.stationen.length) return 'fertig';
  if (fertig > 0) return 'halb';
  return s.stationen.some(offenFreiwillig) ? 'offen' : 'zu';
}

// Pflege: an der ersten geschafften Station, solange dort nicht geübt wurde
function pflegeStation() {
  if (!stand.pflege || stand.gepflegt || stand.verborgen) return -1;
  return NOETIG.findIndex((s) => geschafft(s.id));
}

function figurPlatz() {
  if (stand.verborgen) return stand.tausch ? ['platzhalter', 2] : ['anfang', 1];
  if (!alleNoetigen()) return ['bereich-1', NOETIG.indexOf(naechste()) + 1];
  return stand.tausch ? ['bereich-1', NOETIG.length] : ['platzhalter', 1];
}

// ---------- Zeichnen ----------

function setze(kachel, teil, zustand) {
  kacheln[kachel].svg.querySelectorAll(`[data-teil="${teil}"]`).forEach((g) => (g.dataset.zustand = zustand));
}

function ortVon(kachel, teil) {
  return kacheln[kachel].svg.querySelector(`[data-teil="${teil}"]`).dataset.ort.split(' ').map(Number);
}

// Größe der Tippfläche, wenn das Bild eine nennt (große Flächen)
function massVon(kachel, teil) {
  const mass = kacheln[kachel].svg.querySelector(`[data-teil="${teil}"]`).dataset.mass;
  return mass ? mass.split(' ').map(Number) : null;
}

// Land und Bäume einer Kachel: was zu einer Station gehört, lebt mit ihr auf
function zeichneLand(kachel, istGeschafft, alles) {
  const bereit = document.documentElement.dataset.bereit === 'ja' && Boolean(kacheln[kachel].gezeichnet);
  kacheln[kachel].svg.querySelectorAll('[data-teil^="zone-"]').forEach((g) => {
    const neu = istGeschafft(Number(g.dataset.teil.slice(5))) ? 'gruen' : 'brach';
    // Was gerade aufgelebt ist, blendet sich ein (nicht beim Laden)
    g.classList.toggle('lebt-auf', bereit && neu === 'gruen' && g.dataset.zustand === 'brach');
    g.dataset.zustand = neu;
  });
  kacheln[kachel].gezeichnet = true;
  kacheln[kachel].svg.querySelectorAll('[data-teil^="baum-"]').forEach((g) => {
    g.dataset.zustand = alles ? 'voll' : g.dataset.zone && !istGeschafft(Number(g.dataset.zone)) ? 'duerr' : 'kahl';
  });
}

function knopf(kachel, ort, klasse, name, oeffnen, ...kinder) {
  const [x, y] = ort;
  return h(
    'button',
    { class: `ort ${klasse}`, type: 'button', 'aria-label': name, style: `--x:${x / 4}%;--y:${(y / kacheln[kachel].hoehe) * 100}%`, onclick: oeffnen },
    ...kinder
  );
}

// Warmer Schein bei Nacht: an geschafften Stationen und an der nächsten
function glutAn(kachel, [x, y], gross) {
  return h('span', { class: 'glut' + (gross ? ' gross' : ''), 'aria-hidden': 'true', style: `--x:${x / 4}%;--y:${(y / kacheln[kachel].hoehe) * 100}%` });
}

function zeichneBereich() {
  const k = 'bereich-1';
  const n = naechste();
  const pflege = pflegeStation();
  const orte = [];
  NOETIG.forEach((s, i) => {
    const z = geschafft(s.id) ? 'geschafft' : s === n && !stand.verborgen ? 'naechste' : 'zu';
    setze(k, `station-${i + 1}`, z);
    setze(k, `blumen-${i + 1}`, z);
    setze(k, `laterne-${i + 1}`, z === 'naechste' ? 'an' : 'aus');
    setze(k, `pflege-${i + 1}`, i === pflege ? 'an' : 'aus');
    const text = { geschafft: 'geschafft', naechste: 'als Nächstes', zu: 'noch nicht offen' }[z];
    orte.push(knopf(k, ortVon(k, `station-${i + 1}`), 'station-ort', `${s.titel}, ${text}`, () => stationBlatt(s, z), z === 'naechste' ? h('span', { class: 'namensschild' }, s.titel) : null));
    if (i === pflege) orte.push(knopf(k, ortVon(k, `pflege-${i + 1}`), 'klein', `Pflege: ${s.titel}`, () => pflegeBlatt(s)));
  });
  STELLEN.forEach((s) => {
    const z = stellenZustand(s);
    const titel = WANDEL[stand.wandel].titel?.[s.id] || s.titel;
    setze(k, `stelle-${s.id}`, z);
    const text = { zu: 'noch nicht offen', offen: 'offen', halb: 'zur Hälfte fertig', fertig: 'fertig' }[z];
    const b = knopf(k, ortVon(k, `stelle-${s.id}`), 'stelle', `${titel}, ${text}`, () => stellenBlatt({ ...s, titel }));
    const mass = massVon(k, `stelle-${s.id}`);
    if (mass) Object.assign(b.style, { width: `${mass[0] / 4}%`, height: `${(mass[1] / kacheln[k].hoehe) * 100}%` });
    orte.push(b);
  });
  setze(k, 'stelle-d', stand.spaet);
  if (stand.spaet !== 'aus') orte.push(knopf(k, ortVon(k, 'stelle-d'), 'stelle', `Spätblüher, ${stand.spaet === 'fertig' ? 'fertig' : 'neu'}`, spaetBlatt));
  const tor = geschafft(NOETIG.at(-1).id) ? 'offen' : 'zu';
  setze(k, 'tor', tor);
  setze(k, 'rosenbogen', tor);
  zeichneLand(k, (i) => !stand.verborgen && geschafft(NOETIG[i - 1].id), alleNoetigen());
  setze(k, 'schmuck-angelegt', alleNoetigen() ? 'an' : 'aus');
  setze(k, 'schmuck-fertig', allesFertig() ? 'an' : 'aus');
  kacheln[k].el.classList.toggle('verborgen', stand.verborgen);
  const glut = NOETIG.map((s, i) => (geschafft(s.id) || s === n ? glutAn(k, ortVon(k, `station-${i + 1}`), s === n) : null)).filter(Boolean);
  kacheln[k].knoepfe.replaceChildren(...(stand.verborgen ? [] : [...glut, ...orte]));
}

function zeichnePlatzhalter() {
  const k = 'platzhalter';
  const erreicht = stand.tausch || alleNoetigen();
  // getauscht liegt der Platzhalter vor dem Bereich: geschafft, sobald der Bereich erreicht ist
  const fertig = stand.tausch ? (stand.verborgen ? 1 : 3) : 0;
  for (let i = 1; i <= 3; i++) {
    const z = i <= fertig ? 'geschafft' : erreicht && i === fertig + 1 ? 'naechste' : 'zu';
    setze(k, `station-${i}`, z);
    setze(k, `blumen-${i}`, z);
    setze(k, `laterne-${i}`, z === 'naechste' ? 'an' : 'aus');
    setze(k, `pflege-${i}`, 'aus');
  }
  zeichneLand(k, (i) => i <= fertig, fertig === 3);
  setze(k, 'tor', fertig === 3 ? 'offen' : 'zu');
  setze(k, 'rosenbogen', fertig === 3 ? 'offen' : 'zu');
  kacheln[k].el.classList.toggle('verborgen', !erreicht);
  const glut = [];
  for (let i = 1; i <= 3; i++) if (erreicht && i <= fertig + 1 && i <= 3) glut.push(glutAn(k, ortVon(k, `station-${i}`), i === fertig + 1));
  kacheln[k].knoepfe.replaceChildren(...glut);
}

function zeichne(sanft = false) {
  const folge = stand.tausch ? ['anfang', 'platzhalter', 'bereich-1'] : ['anfang', 'bereich-1', 'platzhalter'];
  const jetzt = [...garten.querySelectorAll('.kachel')].map((el) => el.dataset.kachel);
  if (jetzt.join() !== folge.join()) {
    garten.replaceChildren(...folge.map((n) => kacheln[n].el), h('p', { class: 'himmel' }, 'Weiter oben folgen die nächsten Bereiche, am Ende steht die Kapelle.'), h('div', { class: 'wetter', 'aria-hidden': 'true' }));
    folge.forEach((n, i) => kacheln[n].el.style.setProperty('--ebene', 10 - i));
  }
  const themen = { 'bereich-1': THEMEN[0], platzhalter: THEMEN[1] };
  folge.slice(1).forEach((n, i) => kacheln[n].schild.replaceChildren(h('small', {}, `Etappe ${i + 1}`), themen[n].titel));
  zeichneBereich();
  zeichnePlatzhalter();
  const [kachel, platz] = figurPlatz();
  document.querySelectorAll('.g-figur').forEach((f) => f.classList.toggle('hier', kacheln[kachel].svg.contains(f) && f.dataset.platz === String(platz)));
  garten.classList.toggle('raender', stand.raender);
  garten.dataset.licht = stand.licht;
  garten.dataset.zeit = stand.stil === 'original' ? stand.zeit : 'sommer';
  garten.dataset.stil = stand.stil;
  ['bereich-1', 'platzhalter'].forEach((k) => setze(k, 'ueppig', stand.ueppig ? 'an' : 'aus'));
  if (stand.stil === 'original') bilderFertig = Promise.all(folge.map((n) => male(n, sanft)));
  document.querySelectorAll('[data-stil-knopf]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.stilKnopf === stand.stil));
    b.disabled = !stilGeht(b.dataset.stilKnopf, stand.wandel);
  });
  document.querySelectorAll('[data-wandel-knopf]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.wandelKnopf === stand.wandel)));
  tafel.querySelector('[data-jahreszeit]').disabled = stand.stil !== 'original';

  const name = stand.stufe ? STUFEN[stand.stufe].name : 'Eigener Stand';
  const n = NOETIG.filter((s) => geschafft(s.id)).length;
  const f = FREIWILLIG.filter(geschafft).length;
  document.querySelector('.leiste-text').replaceChildren(h('strong', {}, name), `nötig ${n}/${NOETIG.length}, frei ${f}/${FREIWILLIG.length}`);
  const mass = tafel.querySelector('.tafel-mass');
  mass.textContent = `Nötige Stationen: ${n} von ${NOETIG.length}. Freiwillige: ${f} von ${FREIWILLIG.length}.`;
  tafel.querySelectorAll('[name="stufe"]').forEach((r) => (r.checked = r.value === stand.stufe));
  tafel.elements.spaet.checked = stand.spaet !== 'aus';
  tafel.elements.pflege.checked = stand.pflege && !stand.gepflegt;
  tafel.elements.ueppig.checked = stand.ueppig;
  const reihe = Object.keys(STUFEN);
  const i = reihe.indexOf(stand.stufe);
  document.querySelector('[data-schritt="-1"]').disabled = i === 0;
  document.querySelector('[data-schritt="1"]').disabled = i === reihe.length - 1;
}

// ---------- Blätter ----------

const ueber = `Etappe 1: ${THEMA.titel}`;

function zeigeBlatt(...teile) {
  const zu = blatt(h('div', { class: 'blatt-inhalt' }, ...teile));
  return zu;
}

// Nach einer Änderung im Blatt: neu zeichnen und die Figur zeigen, wenn sie weitergegangen ist
function aendere(fn) {
  const vorher = figurPlatz().join();
  fn();
  zeichne(true);
  if (figurPlatz().join() !== vorher) zurFigur();
}

function schaffe(id) {
  stand.geschafft.add(id);
  stand.stufe = Object.keys(STUFEN).find((s) => s !== 'verborgen' && STUFEN[s].geschafft.length === stand.geschafft.size && STUFEN[s].geschafft.every(geschafft)) || null;
}

function stationBlatt(s, z) {
  const u = s.uebung ? UEBUNGEN[s.uebung] : null;
  const teile = [h('p', { class: 'blatt-ueber' }, ueber), h('h2', { class: 'blatt-titel' }, s.titel), h('p', {}, s.mischung ? 'Gemischte Aufgaben aus dieser Etappe.' : `${u.stufen[s.stufe]}. ${u.aufgaben} Aufgaben.`)];
  let zu;
  if (z === 'zu') teile.push(h('p', { class: 'blatt-hinweis' }, 'Diese Station öffnet sich, wenn du die Stationen davor geschafft hast.'));
  else if (z === 'geschafft') teile.push(h('p', { class: 'blatt-hinweis' }, 'Geschafft.'));
  else teile.push(h('div', { class: 'knopfreihe' }, h('button', { class: 'knopf haupt', type: 'button', onclick: () => { zu(); aendere(() => schaffe(s.id)); } }, 'Als geschafft zeigen')));
  if (z === 'naechste') teile.push(h('p', { class: 'probe-hinweis' }, 'In der App startet hier die Übung. Die Probe zeigt nur, was danach im Garten passiert.'));
  zu = zeigeBlatt(...teile);
}

function stellenBlatt(s) {
  let zu;
  const eintraege = s.stationen.map((id) => {
    const st = station(id);
    const fertig = geschafft(id);
    const frei = offenFreiwillig(id);
    return h('li', {}, h('button', { type: 'button', disabled: fertig || !frei, onclick: () => { zu(); aendere(() => schaffe(id)); } }, h('span', {}, `${st.titel}: ${UEBUNGEN[st.uebung].stufen[st.stufe]}`), h('span', { class: 'stand' }, fertig ? 'geschafft' : frei ? 'offen' : 'noch nicht offen')));
  });
  zu = zeigeBlatt(
    h('p', { class: 'blatt-ueber' }, ueber),
    h('h2', { class: 'blatt-titel' }, s.titel),
    h('p', {}, 'Freiwillige Stationen. Um auf dem Weg weiterzukommen, brauchst du sie nicht.'),
    h('ul', { class: 'probe-liste' }, ...eintraege),
    h('p', { class: 'probe-hinweis' }, 'In der Probe gilt eine offene Station mit einem Tipp als geschafft.')
  );
}

function pflegeBlatt(s) {
  let zu;
  zu = zeigeBlatt(
    h('p', { class: 'blatt-ueber' }, ueber),
    h('h2', { class: 'blatt-titel' }, s.titel),
    h('p', {}, 'Das hast du länger nicht geübt. Eine Runde, und die Gießkanne verschwindet. Verloren geht nichts.'),
    h('div', { class: 'knopfreihe' }, h('button', { class: 'knopf haupt', type: 'button', onclick: () => { zu(); aendere(() => (stand.gepflegt = true)); } }, 'Als geübt zeigen'))
  );
}

function spaetBlatt() {
  let zu;
  const fertig = stand.spaet === 'fertig';
  const teile = [
    h('p', { class: 'blatt-ueber' }, ueber),
    h('h2', { class: 'blatt-titel' }, 'Spätblüher'),
    h('p', {}, fertig ? 'Geschafft.' : 'Hier ist etwas Neues gewachsen: eine freiwillige Station, die erst mit einer späteren Etappe möglich wurde.'),
  ];
  if (!fertig) teile.push(h('div', { class: 'knopfreihe' }, h('button', { class: 'knopf haupt', type: 'button', onclick: () => { zu(); aendere(() => (stand.spaet = 'fertig')); } }, 'Als geschafft zeigen')));
  teile.push(h('p', { class: 'probe-hinweis' }, 'Nur zur Probe: Bei den vorhandenen Übungen gibt es keinen Spätblüher.'));
  zu = zeigeBlatt(...teile);
}

// ---------- Bedienung ----------

function zurFigur(sanft = true) {
  const f = document.querySelector('.g-figur.hier');
  if (!f) return;
  const { el, hoehe } = kacheln[figurPlatz()[0]];
  const r = el.getBoundingClientRect();
  const y = r.top + (Number(f.dataset.ort.split(' ')[1]) / hoehe) * r.height - 20;
  window.scrollTo({ top: window.scrollY + y - window.innerHeight * 0.55, behavior: sanft && !ruhig.matches ? 'smooth' : 'auto' });
}

function waehleStufe(id) {
  stand.stufe = id;
  stand.geschafft = new Set(STUFEN[id].geschafft);
  stand.verborgen = id === 'verborgen';
  stand.gepflegt = false;
  zeichne();
}

tafel.addEventListener('submit', (e) => e.preventDefault());
tafel.addEventListener('change', (e) => {
  const { name, value, checked } = e.target;
  if (name === 'stufe') return waehleStufe(value);
  if (name === 'licht') {
    stand.licht = value;
    return zeichne();
  }
  if (name === 'zeit') {
    stand.zeit = value;
    return wechsle();
  }
  if (name === 'pflege') {
    stand.pflege = checked;
    stand.gepflegt = false;
  } else if (name === 'spaet') stand.spaet = checked ? 'knospe' : 'aus';
  else stand[name] = checked;
  zeichne();
  if (name === 'tausch') zurFigur(false);
});
tafel.querySelector('[data-zur-figur]').addEventListener('click', () => {
  klappe(false);
  zurFigur();
});
document.querySelectorAll('[data-schritt]').forEach((b) =>
  b.addEventListener('click', () => {
    const reihe = Object.keys(STUFEN);
    const i = reihe.indexOf(stand.stufe);
    // ohne feste Stufe (eigener Stand) geht es von „In Arbeit“ aus weiter
    const von = i < 0 ? reihe.indexOf('arbeit') : i;
    waehleStufe(reihe[Math.max(0, Math.min(reihe.length - 1, von + Number(b.dataset.schritt)))]);
  })
);
document.querySelectorAll('[data-stil-knopf]').forEach((b) =>
  b.addEventListener('click', () => {
    if (stand.stil === b.dataset.stilKnopf) return;
    stand.stil = b.dataset.stilKnopf;
    wechsle();
  })
);
document.querySelectorAll('[data-wandel-knopf]').forEach((b) =>
  b.addEventListener('click', () => {
    if (stand.wandel === b.dataset.wandelKnopf) return;
    stand.wandel = b.dataset.wandelKnopf;
    if (!stilGeht(stand.stil, stand.wandel)) stand.stil = 'original';
    wechsle();
  })
);
const mehr = document.querySelector('.mehr');
function klappe(auf) {
  tafel.classList.toggle('auf', auf);
  mehr.setAttribute('aria-expanded', String(auf));
  mehr.textContent = auf ? 'Schließen' : 'Schalter';
}
mehr.addEventListener('click', () => klappe(!tafel.classList.contains('auf')));

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
tafel.reset();
lade()
  .then(async () => {
    zeichne();
    await bilderFertig;
    document.documentElement.dataset.bereit = 'ja';
    requestAnimationFrame(() => zurFigur(false));
  })
  .catch((fehler) => {
    garten.replaceChildren(h('p', { class: 'garten-laedt' }, `Der Garten lässt sich nicht laden (${fehler.message}). Die Seite braucht einen lokalen Server, siehe README.md.`));
  });
