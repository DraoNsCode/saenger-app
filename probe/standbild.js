// Macht aus einer Kachel des Originals ein fertiges Bild im Browser. Eine üppig bepflanzte Kachel hat viele tausend Formen;
// stehen sie alle in der Seite, ruckelt das Scrollen auf schwachen Geräten (Messung in GARTEN-BILD.md).
// Als Bild eingesetzt, fasst der Browser sie nur noch an, wenn sich der Fortschritt ändert. Es wird nichts zusätzlich geladen.
// Was sich bewegt, kommt in eine kleine eigene Ebene darüber.

const NS = 'http://www.w3.org/2000/svg';
const OBEN = 120; // so weit darf Stehendes nach oben aus der Kachel ragen
const BEWEGT = new Set(['t-ring', 't-giesskanne', 't-rosen-knospe', 't-falter-1', 't-falter-2']);

const neu = (tag, werte = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(werte)) e.setAttribute(k, v);
  return e;
};
const ziel = (use) => use.getAttribute('href').slice(1);

// Nur die Varianten behalten, die zum Zustand passen
function nurSichtbares(svg) {
  svg.querySelectorAll('[data-teil]').forEach((g) => {
    [...g.children].forEach((c) => {
      if (!c.dataset.bei) return;
      if (c.dataset.bei.split(' ').includes(g.dataset.zustand)) c.removeAttribute('display');
      else c.remove();
    });
  });
  svg.querySelectorAll('.g-figur').forEach((f) => (f.classList.contains('hier') ? f.removeAttribute('display') : f.remove()));
}

// Ein Verweis samt den Verschiebungen seiner Eltern
function herausgehoben(use) {
  let g = use.cloneNode(true);
  for (let e = use.parentElement; e && e.nodeName !== 'svg'; e = e.parentElement) {
    if (!e.getAttribute('transform')) continue;
    const huelle = neu('g', { transform: e.getAttribute('transform') });
    huelle.append(g);
    g = huelle;
  }
  return g;
}

// svg: die Kachel mit allen Zuständen · bogen: der Musterbogen · Ergebnis: Text des Bildes und die bewegte Ebene
export function standbild(svg, bogen, verborgen) {
  const hoehe = svg.viewBox.baseVal.height;
  const k = svg.cloneNode(true);
  nurSichtbares(k);

  const ebene = neu('svg', { viewBox: `0 0 400 ${hoehe}`, class: 'bewegt', 'aria-hidden': 'true', overflow: 'visible' });
  k.querySelectorAll('use').forEach((u) => {
    if (!BEWEGT.has(ziel(u))) return;
    ebene.append(herausgehoben(u));
    u.remove();
  });
  const nebel = k.querySelector('.g-nebel');
  if (nebel) {
    nebel.remove();
    if (verborgen) {
      nebel.removeAttribute('display');
      nebel.querySelectorAll('[clip-path]').forEach((e) => e.removeAttribute('clip-path'));
      ebene.append(nebel);
    }
  }
  if (verborgen) k.querySelectorAll('.g-tor,.g-mauer').forEach((g) => g.setAttribute('style', 'filter:saturate(.4) contrast(.42) brightness(1.4)'));

  // Bauteile, auf die verwiesen wird, kommen mit ins Bild
  const teile = new Map();
  const hole = (wurzel) =>
    wurzel.querySelectorAll('use').forEach((u) => {
      if (teile.has(ziel(u))) return;
      const t = bogen.querySelector(`#${CSS.escape(ziel(u))}`);
      teile.set(ziel(u), t.cloneNode(true));
      hole(t);
    });
  hole(k);
  const defs = neu('defs');
  defs.append(...[...bogen.querySelectorAll(':scope > defs > *')].map((e) => e.cloneNode(true)), ...teile.values());
  k.prepend(defs);
  k.setAttribute('viewBox', `0 ${-OBEN} 400 ${hoehe + OBEN}`);
  k.setAttribute('width', 400);
  k.setAttribute('height', hoehe + OBEN);
  ['overflow', 'class', 'style'].forEach((a) => k.removeAttribute(a));
  return { text: new XMLSerializer().serializeToString(k), ebene, oben: `${(-OBEN / hoehe) * 100}%`, hoch: `${((hoehe + OBEN) / hoehe) * 100}%` };
}
