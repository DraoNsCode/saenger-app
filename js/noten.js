// Notenbild mit abcjs (liegt in vendor/, global als ABCJS).

export const TINTE = '#15233F';

// Zeichnet ABC-Noten in ein Element. breite = Breite des Systems in abcjs-Einheiten.
// Auf großen Bildschirmen bleibt die natürliche Größe, auf kleinen wird verkleinert.
// rechts: Platz rechts vom System, etwa für „D.C. al Fine“ über der letzten Note
// transponieren: Halbtöne für das Bild (abcjs visualTranspose), etwa im Übe-Teil
export function zeichne(el, abc, { breite = 260, scale = 1.6, oben = 4, unten = 4, rechts = 8, transponieren = 0 } = {}) {
  el.innerHTML = '';
  const huelle = document.createElement('div');
  huelle.className = 'noten-huelle';
  huelle.style.maxWidth = Math.round((breite + 32 + rechts) * scale) + 'px';
  el.appendChild(huelle);
  const ziel = document.createElement('div');
  huelle.appendChild(ziel);
  const ergebnis = window.ABCJS.renderAbc(ziel, abc, {
    add_classes: true,
    selectTypes: false, // angeklickte Noten nicht einfärben
    responsive: 'resize',
    foregroundColor: TINTE,
    staffwidth: breite,
    scale,
    paddingtop: oben,
    paddingbottom: unten,
    paddingleft: 4,
    paddingright: rechts,
    visualTranspose: transponieren,
  });
  const svg = ziel.querySelector('svg');
  if (svg) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Notenbild');
  }
  return ergebnis[0];
}

export function kopf({ schluessel = 'treble', takt = null, laenge = '1/4', stimmen = null } = {}) {
  let k = 'X:1\n';
  k += takt ? `M:${takt}\n` : 'M:none\n';
  k += `L:${laenge}\n`;
  if (stimmen) k += stimmen;
  k += `K:C clef=${schluessel}\n`;
  return k;
}

// Noten im gezeichneten Bild finden (in Zeitfolge für eine Stimme)
export function notenElemente(el, stimme = 0) {
  return [...el.querySelectorAll(`.abcjs-note.abcjs-v${stimme}, .abcjs-rest.abcjs-v${stimme}`)];
}

export function markiere(elemente, klasse = 'markiert') {
  elemente.forEach((e) => e && e.classList.add(klasse));
}

export function entmarkiere(el, klasse) {
  el.querySelectorAll('.' + klasse).forEach((e) => e.classList.remove(klasse));
}

// Notenwerte in Vierteln -> ABC-Länge bei L:1/4
export function laenge(viertel) {
  if (viertel === 1) return '';
  if (viertel === 0.5) return '/';
  if (viertel === 0.25) return '//';
  if (viertel === 1.5) return '3/2';
  return String(viertel);
}
