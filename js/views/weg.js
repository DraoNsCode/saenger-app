// Der Leitfaden als geschwungene Notenzeile. Stationen sind Notenköpfe.
// ABGELÖST: Diese Darstellung wird durch den Klostergarten ersetzt (ENTSCHEIDUNGEN.md). Nicht weiterentwickeln.
// Bis der Garten eingebaut ist, bleibt sie die Ansicht, in der Daniel neue Etappen testet (README.md, „Stand“).
// Bis dahin zeigt die Notenzeile nur die nötigen Stationen; die freiwilligen stehen im Blatt ihrer nötigen Station.
import { h, icon, blatt } from '../ui.js';
import { THEMEN, noetigeRichtige, verfuegbar, noetigeStationen, freiwilligeZu } from '../lernweg.js';
import { stationGeschafft, naechsteStation, fortschrittGesamt, zustand, stationSichtbar, stationOffen } from '../speicher.js';
import { UEBUNGEN } from '../uebungen/index.js';
import { zeigeErklaerung } from '../runde.js';

const NS = 'http://www.w3.org/2000/svg';
const B = 380; // Breite in SVG-Einheiten
const MITTE = B / 2;
const AUSSCHLAG = 84;
const ABSTAND = 104; // senkrechter Abstand der Stationen
const S = 6; // Linienabstand der Notenzeile
const LS = 1.3; // Linienstärke

function el(tag, attrs = {}) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

// x-Lage des Weges in Abhängigkeit von y: beginnt und endet in der Mitte
function xBei(y) {
  return MITTE + AUSSCHLAG * Math.sin((Math.PI * y) / ABSTAND);
}

function notenzeile(svg, hoehe, blass) {
  const punkte = [];
  for (let y = 0; y <= hoehe; y += 3) punkte.push(`${xBei(y).toFixed(1)},${y}`);
  const d = 'M' + punkte.join(' L');
  const g = el('g', { class: 'notenzeile' + (blass ? ' blass' : ''), fill: 'none', 'stroke-linejoin': 'round' });
  // Fünf parallele Linien aus übereinandergelegten Strichen
  [
    [4 * S + LS, 'linie'],
    [4 * S - LS, 'grund'],
    [2 * S + LS, 'linie'],
    [2 * S - LS, 'grund'],
    [LS, 'linie'],
  ].forEach(([breite, art]) => g.appendChild(el('path', { d, 'stroke-width': breite, class: art })));
  svg.appendChild(g);
}

function abschnitt(t, ti, naechste) {
  const stationen = noetigeStationen(t);
  const n = stationen.length;
  const hoehe = n * ABSTAND;
  const svg = el('svg', { viewBox: `0 0 ${B} ${hoehe}`, class: 'weg-svg', role: 'list' });
  notenzeile(svg, hoehe, false);
  stationen.forEach((s, k) => {
    const y = ABSTAND / 2 + k * ABSTAND;
    const x = xBei(y);
    const geschafft = stationGeschafft(s.id);
    const istNaechste = naechste && naechste.id === s.id;
    const zustandName = geschafft ? 'geschafft' : istNaechste ? 'naechste' : 'gesperrt';
    const g = el('g', {
      class: `station ${zustandName}${s.mischung ? ' abschluss' : ''}`,
      role: 'listitem',
    });
    const knopf = el('g', {
      role: 'button',
      tabindex: '0',
      'aria-label': `${s.titel}, ${geschafft ? 'geschafft' : istNaechste ? 'als Nächstes' : 'noch nicht offen'}`,
    });
    if (istNaechste) knopf.appendChild(el('circle', { cx: x, cy: y, r: 27, class: 'halo' }));
    knopf.appendChild(el('circle', { cx: x, cy: y, r: 30, class: 'tippziel' }));
    const rx = s.mischung ? 20 : 17;
    const ry = s.mischung ? 14 : 12.5;
    knopf.appendChild(el('ellipse', { cx: x, cy: y, rx, ry, transform: `rotate(-24 ${x} ${y})`, class: 'kopf' }));
    if (s.mischung && geschafft) {
      knopf.appendChild(el('ellipse', { cx: x, cy: y, rx: 7.5, ry: 4.6, transform: `rotate(-24 ${x} ${y})`, class: 'loch' }));
    }
    const rechts = x < MITTE;
    const tx = rechts ? x + 32 : x - 32;
    const anker = rechts ? 'start' : 'end';
    const titel = el('text', { x: tx, y: y + 1, 'text-anchor': anker, class: 'station-titel' });
    titel.textContent = s.titel;
    knopf.appendChild(titel);
    const unter = el('text', { x: tx, y: y + 21, 'text-anchor': anker, class: 'station-zustand' });
    unter.textContent = geschafft ? 'geschafft' : istNaechste ? 'als Nächstes' : '';
    knopf.appendChild(unter);
    const oeffnen = () => stationBlatt(s, t, ti, zustandName);
    knopf.addEventListener('click', oeffnen);
    knopf.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        oeffnen();
      }
    });
    g.appendChild(knopf);
    svg.appendChild(g);
  });
  return svg;
}

function leererAbschnitt() {
  const hoehe = ABSTAND;
  const svg = el('svg', { viewBox: `0 0 ${B} ${hoehe}`, class: 'weg-svg', 'aria-hidden': 'true' });
  notenzeile(svg, hoehe, true);
  return svg;
}

function stationBlatt(s, t, ti, zustandName) {
  const u = s.uebung ? UEBUNGEN[s.uebung] : null;
  const st = zustand().stationen[s.id];
  const aufgaben = u ? u.aufgaben : 8;
  const noetig = noetigeRichtige(aufgaben);
  const teile = [
    h('p', { class: 'blatt-ueber' }, `Etappe ${ti + 1}: ${t.titel}`),
    h('h2', { class: 'blatt-titel' }, s.titel),
    h('p', {}, s.mischung ? 'Gemischte Aufgaben aus dieser Etappe.' : `${u.stufen[s.stufe]}. ${aufgaben} Aufgaben.`),
  ];
  let zu;
  if (zustandName === 'gesperrt') {
    teile.push(h('p', { class: 'blatt-hinweis' }, 'Diese Station öffnet sich, wenn du die Stationen davor geschafft hast.'));
    const n = naechsteStation();
    if (n) teile.push(h('div', { class: 'knopfreihe' }, h('a', { class: 'knopf haupt', href: `#/station/${n.id}`, onclick: () => zu() }, 'Zur nächsten offenen Station')));
  } else {
    if (st && st.geschafft) teile.push(h('p', { class: 'blatt-hinweis' }, `Geschafft. Bestes Ergebnis: ${st.beste} von ${st.gesamt}.`));
    else teile.push(h('p', { class: 'blatt-hinweis' }, `Ab ${noetig} richtigen von ${aufgaben} ist die Station geschafft.`));
    const reihe = h('div', { class: 'knopfreihe' });
    if (u) reihe.append(h('button', { class: 'knopf zweit', type: 'button', onclick: () => zeigeErklaerung(u) }, 'Kurz erklärt'));
    reihe.append(h('a', { class: 'knopf haupt', href: `#/station/${s.id}`, onclick: () => zu() }, st && st.geschafft ? 'Nochmal üben' : 'Los geht’s'));
    teile.push(reihe);
    const freiwillige = s.mischung ? [] : freiwilligeZu(s).filter((f) => stationSichtbar(f.id));
    if (freiwillige.length) teile.push(freiwilligAbschnitt(freiwillige, u, () => zu()));
  }
  zu = blatt(h('div', { class: 'blatt-inhalt' }, ...teile));
}

// Freiwillige Stationen einer Übung: offen, sobald ihre nötige Station geschafft ist
function freiwilligAbschnitt(freiwillige, u, schliessen) {
  const offen = freiwillige.some((f) => stationOffen(f.id));
  if (!offen) {
    return h(
      'div',
      { class: 'freiwillig' },
      h('h3', {}, 'Freiwillige Stationen'),
      h('p', { class: 'blatt-hinweis' }, 'Wenn du diese Station geschafft hast, kannst du die Übung hier auch schwerer üben.')
    );
  }
  return h(
    'div',
    { class: 'freiwillig' },
    h('h3', {}, 'Freiwillige Stationen'),
    h('p', { class: 'blatt-hinweis' }, 'Dieselbe Übung, etwas schwerer. Um auf dem Weg weiterzukommen, brauchst du sie nicht.'),
    h(
      'ul',
      { class: 'freiwillig-liste' },
      ...freiwillige.map((f) =>
        h(
          'li',
          {},
          h(
            'a',
            { class: 'freiwillig-eintrag', href: `#/station/${f.id}`, onclick: schliessen },
            h('span', { class: 'stufe-text' }, u.stufen[f.stufe]),
            h('span', { class: 'stufe-zahl' }, stationGeschafft(f.id) ? 'geschafft' : '')
          )
        )
      )
    )
  );
}

export function zeigeWeg(wurzel) {
  const naechste = naechsteStation();
  const f = fortschrittGesamt();
  const kopf = h(
    'header',
    { class: 'seiten-kopf' },
    h('div', {}, h('h1', {}, 'Dein Weg'), h('p', { class: 'unterzeile' }, `${f.geschafft} von ${f.gesamt} Stationen geschafft`)),
    h('a', { class: 'icon-knopf', href: '#/einstellungen', 'aria-label': 'Einstellungen' }, icon('einstellungen'))
  );
  const weg = h('div', { class: 'weg' });
  THEMEN.forEach((t, ti) => {
    const gebaut = verfuegbar(t);
    const fertig = gebaut && noetigeStationen(t).every((s) => stationGeschafft(s.id));
    weg.append(
      h(
        'div',
        { class: 'etappe-karte' + (gebaut ? '' : ' kommt') + (fertig ? ' fertig' : '') },
        h('p', { class: 'etappe-nr' }, `Etappe ${ti + 1}`),
        h('h2', { class: 'etappe-titel' }, t.titel),
        gebaut ? null : h('p', { class: 'etappe-kurz' }, t.kurz),
        gebaut ? null : h('p', { class: 'etappe-bald' }, 'In Vorbereitung')
      )
    );
    weg.append(gebaut ? abschnitt(t, ti, naechste) : leererAbschnitt());
  });
  weg.append(
    h(
      'div',
      { class: 'etappe-karte ziel' },
      h('h2', { class: 'etappe-titel' }, 'Am Ziel'),
      h('p', { class: 'etappe-kurz' }, 'Nach dem Leitfaden geht das Üben weiter: In den Themen kannst du jede Übung gezielt üben, die meisten auch schwerer.')
    )
  );

  const knopfLeiste = naechste
    ? h('div', { class: 'weiter-leiste' }, h('a', { class: 'knopf haupt breit', href: `#/station/${naechste.id}` }, `Weiter: ${naechste.titel}`))
    : h('div', { class: 'weiter-leiste' }, h('a', { class: 'knopf haupt breit', href: '#/themen' }, 'In den Themen weiterüben'));

  wurzel.replaceChildren(h('section', { class: 'seite seite-weg' }, kopf, weg), knopfLeiste);

  // Zur nächsten Station scrollen
  const ziel = wurzel.querySelector('.station.naechste');
  if (ziel && f.geschafft > 0) {
    setTimeout(() => {
      const r = ziel.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - window.innerHeight / 2.4) });
    }, 30);
  }
}
