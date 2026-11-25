// Probe zu Baustein B: Galerie der Stilvarianten. Die Auswahl bleibt nur in diesem Browser.
import { h } from '../js/ui.js';

const STILE = [
  ['01', 'aquarell', 'Aquarell und Tusche', 'Brunnen, Bienenkörbe, Kräuterbeet, Rotkehlchen', 'Farbe läuft mit dem Fortschritt ein', 'Skizze ohne Farbe', 'Filter sind live zu langsam, Bilder vorab rechnen'],
  ['02', 'buchmalerei', 'Buchmalerei', 'Zinnenmauer, Sternenhimmel, Blumenwiese, Stieglitz, Rankenrahmen', 'schimmerndes Gold', 'graue Scheibe mit Knospe', 'sehr viele Einzelteile, der Rahmen kostet Breite'],
  ['03', 'linolschnitt', 'Linolschnitt in drei Farben', 'Weinterrassen, Kapelle vor der Sonne, Schwan, Wanderer', 'Druckkörnung', 'nur Schraffur', 'wenige Farben für viele Zustände'],
  ['04', 'papierschnitt', 'Papierschnitt in Lagen', 'Hügel, Zypressen, Bogengang, Seerosen, Papiervogel', 'Lagen verschieben sich beim Bewegen', 'blassere Lagen weiter hinten', 'Schatten kosten Leistung, Lagen statt Kacheln planen'],
  ['05', 'kirchenfenster', 'Kirchenfenster', 'Glasscheiben, Bleiruten, Rosetten, Taube', 'Licht wandert und leuchtet auf', 'dunkles Glas', 'kleine Dinge sind schwer zu erkennen'],
  ['06', 'nachtgarten', 'Nachtgarten mit Laternen', 'Laternen, Teich mit Mond, erleuchteter Kreuzgang, Handlaterne', 'Flackern, Glühwürmchen, Mondspiegel', 'Laternen noch aus', 'in der Sonne auf dem Handy schlechter lesbar'],
  ['07', 'gouache', 'Gemalt, im Morgenlicht', 'Rosenbogen, blühender Baum, Bach, Katze', 'Lichtstrahlen, fallende Blüten', 'im Morgendunst', 'Teile vorab als Bild rechnen, mehr Daten'],
  ['08', 'kraeuterbuch', 'Kräuterbuch, handkolorierter Stich', 'große Heilpflanzen am Rand, Sonnenuhr, Münzen mit Zahlen', 'Schmetterling', 'schraffierte Münze', 'feine Linien, der Rand kostet Breite'],
  ['09', 'stickerei', 'Stickerei', 'Kreuzstiche auf Leinen, Nadel mit Faden als Position', 'Stiche kommen mit dem Fortschritt dazu', 'noch nicht gestickt, nur vorgezeichnet', 'grobes Raster, kleine Zeichen schwierig'],
  ['10', 'miniatur', 'Miniatur in 3D', 'Modell aus weichen Formen, Laterne, Strohhut', 'echte Schatten, Unschärfe wie im Modellfoto', 'im Dunst', 'Bilder vorab rechnen, Änderungen nur mit Claude'],
  ['11', 'marine-gold', 'Marineblau und Gold', 'Kreuzgang, Springbrunnen, Zypressen, Schwalbe', 'Linien färben sich golden', 'cremefarbene Linien', 'kühl, weniger Garten; passt zu den Farben der App'],
  ['12', 'kacheln', 'Blau-weiße Kacheln', 'gemalte Fliesen, Schwan, Gold nur für Wichtiges', 'Glanz der Glasur', 'Fliese noch unbemalt', 'Fugen zerschneiden kleine Dinge'],
  ['13', 'fresko', 'Fresko', 'Granatapfel- und Quittenbäume, Schale, Flechtzaun, Vogel', 'Risse und Putz', 'nur Vorzeichnung auf dem Putz', 'Teile vorab als Bild rechnen, gedämpfte Farben'],
  ['14', 'mosaik', 'Mosaik', 'Steinchen, Gold für Stationen, Pfau', 'Steinchen kommen mit dem Fortschritt dazu', 'noch nicht gelegt', 'vorab rechnen, kleine Dinge sind grob'],
  ['15', 'scherenschnitt', 'Scherenschnitt', 'Kapelle vor der Sonne, Blattwerk, Bäume als Ornament', 'Station leuchtet', 'nur Umriss', 'kaum Abstufungen, hart im Kontrast'],
];
const STIMMUNGEN = [
  ['16', 'fruehling', 'Frühling', 'blühende Bäume, Tulpen', 'fallende Blüten'],
  ['17', 'herbst', 'Herbst', 'bunte Kronen, Laub, Kürbisfarben', 'fallende Blätter'],
  ['18', 'winter', 'Winter', 'Schnee auf Dach und Bäumen, Fußspuren', 'Schneefall'],
  ['19', 'abend', 'Abendlicht', 'lange Schatten, farbiger Bach', 'Lichtstrahlen, Glühwürmchen'],
  ['20', 'regen', 'Regen', 'Pfützen, Schirm', 'Regen und Wasserringe'],
];
const ALLE = [...STILE, ...STIMMUNGEN];
const URTEILE = { ja: 'gefällt', vielleicht: 'vielleicht', nein: 'eher nicht' };
const SCHLUESSEL = 'probe-varianten';

let auswahl = {};
try {
  auswahl = JSON.parse(localStorage.getItem(SCHLUESSEL)) || {};
} catch {
  auswahl = {};
}

function merke() {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(auswahl));
  } catch {
    // ohne Speicher gilt die Auswahl, bis die Seite geschlossen wird
  }
}

function karte([nr, name, titel, elemente, effekt, nichtErreicht, haken]) {
  const zeilen = [['Elemente', elemente], ['Effekt', effekt], ['Noch nicht erreicht', nichtErreicht], ['Haken', haken]].filter(([, t]) => t);
  const el = h(
    'article',
    { class: 'karte', 'data-nr': nr },
    h('button', { class: 'bild', type: 'button', 'aria-label': `${Number(nr)} ${titel}, groß zeigen`, onclick: () => zeigeGross(nr) }, h('img', { src: `varianten/bilder/${nr}-${name}.webp`, alt: '', width: 640, height: 960, loading: 'lazy' }), h('span', { class: 'nr' }, String(Number(nr)))),
    h('h3', {}, titel),
    h('button', { class: 'mehr-knopf', type: 'button', onclick: (e) => { const auf = el.classList.toggle('zeigt'); e.currentTarget.textContent = auf ? 'Weniger' : 'Mehr dazu'; } }, 'Mehr dazu'),
    h('dl', {}, ...zeilen.flatMap(([a, b]) => [h('dt', {}, a), h('dd', {}, b)])),
    h(
      'fieldset',
      { class: 'urteil' },
      h('legend', {}, `Urteil zu Bild ${Number(nr)}`),
      ...Object.entries(URTEILE).map(([wert, text]) => h('label', {}, h('input', { type: 'radio', name: `u${nr}`, value: wert, checked: auswahl[nr] === wert, onclick: () => urteile(nr, wert) }), h('span', {}, text)))
    )
  );
  return el;
}

// Nochmal auf dasselbe Urteil tippen nimmt es zurück
function urteile(nr, wert) {
  if (auswahl[nr] === wert) delete auswahl[nr];
  else auswahl[nr] = wert;
  merke();
  zeichne();
}

function zeichne() {
  document.querySelectorAll('.karte').forEach((k) => {
    const w = auswahl[k.dataset.nr];
    k.classList.toggle('ja', w === 'ja');
    k.classList.toggle('nein', w === 'nein');
    k.querySelectorAll('input').forEach((i) => (i.checked = i.value === w));
  });
  const liste = (w) => ALLE.filter(([nr]) => auswahl[nr] === w).map(([nr, , titel]) => `${Number(nr)} ${titel}`).join(', ');
  const zeilen = Object.entries(URTEILE).map(([w, t]) => [t, liste(w)]).filter(([, l]) => l).map(([t, l]) => `${t[0].toUpperCase()}${t.slice(1)}: ${l}`);
  document.querySelector('.auswahl-text').textContent = zeilen.length ? zeilen.join('\n') : 'Noch nichts ausgewählt.';
}

// ---------- groß zeigen ----------

const dialog = document.querySelector('.gross');
let jetzt = 0;

function lade() {
  const [nr, name, titel] = ALLE[jetzt];
  dialog.querySelector('iframe').src = `varianten/${nr}-${name}.html`;
  dialog.querySelector('p').textContent = `${Number(nr)} ${titel}`;
}
function zeigeGross(nr) {
  jetzt = ALLE.findIndex(([n]) => n === nr);
  lade();
  dialog.showModal();
}
dialog.querySelectorAll('[data-weiter]').forEach((b) =>
  b.addEventListener('click', () => {
    jetzt = (jetzt + Number(b.dataset.weiter) + ALLE.length) % ALLE.length;
    lade();
  })
);
dialog.addEventListener('keydown', (e) => {
  const schritt = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
  if (!schritt) return;
  jetzt = (jetzt + schritt + ALLE.length) % ALLE.length;
  lade();
});
dialog.querySelector('[data-zu]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialog.querySelector('iframe').removeAttribute('src'));

// ---------- Aufbau ----------

document.querySelector('[data-gruppe="stil"]').append(...STILE.map(karte));
document.querySelector('[data-gruppe="stimmung"]').append(...STIMMUNGEN.map(karte));
zeichne();

fetch('varianten/elemente.html')
  .then((a) => (a.ok ? a.text() : Promise.reject(new Error(String(a.status)))))
  .then((t) => (document.querySelector('[data-bogen]').innerHTML = t))
  .catch((f) => (document.querySelector('[data-bogen]').textContent = `Der Bogen lässt sich nicht laden (${f.message}).`));

document.querySelector('[data-kopieren]').addEventListener('click', async (e) => {
  const knopf = e.currentTarget;
  const text = document.querySelector('.auswahl-text').textContent;
  try {
    await navigator.clipboard.writeText(text);
    knopf.textContent = 'Kopiert';
  } catch {
    const bereich = document.createRange();
    bereich.selectNodeContents(document.querySelector('.auswahl-text'));
    getSelection().removeAllRanges();
    getSelection().addRange(bereich);
    knopf.textContent = 'Markiert, bitte kopieren';
  }
  setTimeout(() => (knopf.textContent = 'Auswahl kopieren'), 2500);
});
document.querySelector('[data-leeren]').addEventListener('click', () => {
  auswahl = {};
  merke();
  zeichne();
});
