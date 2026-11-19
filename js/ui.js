// Kleine Hilfen für die Oberfläche.

export function h(tag, attrs = {}, ...kinder) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kind of kinder.flat()) {
    if (kind == null || kind === false) continue;
    el.appendChild(typeof kind === 'string' || typeof kind === 'number' ? document.createTextNode(String(kind)) : kind);
  }
  return el;
}

// **fett** in Texten
export function text(t) {
  const span = document.createElement('span');
  const teile = String(t).split(/(\*\*[^*]+\*\*)/);
  teile.forEach((teil) => {
    if (teil.startsWith('**') && teil.endsWith('**')) span.appendChild(h('strong', {}, teil.slice(2, -2)));
    else if (teil) span.appendChild(document.createTextNode(teil));
  });
  return span;
}

const SVG = {
  weg: '<path d="M6 20c0-4 4-4 6-8s6-4 6-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><ellipse cx="6" cy="20" rx="2.6" ry="1.9" transform="rotate(-20 6 20)" fill="currentColor"/><ellipse cx="18" cy="4" rx="2.6" ry="1.9" transform="rotate(-20 18 4)" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  themen: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  abzeichen: '<circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 14l-2 7 5.5-2.5L17.5 21l-2-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  ueben: '<path d="M9 3v11.5a3 3 0 1 1-2-2.8V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 3h9v9.5a3 3 0 1 1-2-2.8V6H9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  einstellungen: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  schliessen: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  hilfe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/>',
  anhoeren: '<path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  zurueck: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  haken: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  schloss: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
};

export function icon(name, groesse = 24) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', groesse);
  s.setAttribute('height', groesse);
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = SVG[name] || '';
  return s;
}

// Blatt von unten (Bottom Sheet)
export function blatt(inhalt, { beiSchliessen } = {}) {
  const huelle = h('div', { class: 'blatt-huelle' });
  const flaeche = h('div', { class: 'blatt', role: 'dialog', 'aria-modal': 'true' });
  const schliessen = () => {
    huelle.classList.add('zu');
    setTimeout(() => huelle.remove(), 180);
    document.removeEventListener('keydown', taste);
    if (beiSchliessen) beiSchliessen();
  };
  const taste = (e) => {
    if (e.key === 'Escape') schliessen();
  };
  huelle.addEventListener('click', (e) => {
    if (e.target === huelle) schliessen();
  });
  document.addEventListener('keydown', taste);
  flaeche.append(h('div', { class: 'blatt-griff', 'aria-hidden': 'true' }), inhalt);
  huelle.appendChild(flaeche);
  document.body.appendChild(huelle);
  requestAnimationFrame(() => huelle.classList.add('auf'));
  const erstes = flaeche.querySelector('button');
  if (erstes) setTimeout(() => erstes.focus({ preventScroll: true }), 50);
  return schliessen;
}

export function bestaetigen(frage, jaText, neinText = 'Abbrechen') {
  return new Promise((ok) => {
    let entschieden = false;
    const zu = blatt(
      h(
        'div',
        { class: 'blatt-inhalt' },
        h('p', { class: 'blatt-frage' }, frage),
        h(
          'div',
          { class: 'knopfreihe' },
          h('button', { class: 'knopf zweit', onclick: () => { entschieden = true; zu(); ok(false); } }, neinText),
          h('button', { class: 'knopf warnung', onclick: () => { entschieden = true; zu(); ok(true); } }, jaText)
        )
      ),
      { beiSchliessen: () => !entschieden && ok(false) }
    );
  });
}
