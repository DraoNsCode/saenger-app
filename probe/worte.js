// Vergleich zu Baustein B: der beschriebene Moment aus GARTEN-WORTE.md mit umschaltbarem Zustand von „Intervalle“.
import { h } from '../js/ui.js';

const STAENDE = {
  verborgen: { name: 'Noch nicht erreicht', text: '', punkt: 4, knopf: ['Weiter: Notennamen', 'Übung 4 von 4'] },
  aktuell: { name: 'Aktuell, 2 von 4', text: '2 von 4 geschafft', punkt: 5, knopf: ['Weiter: Intervalle', 'Übung 3 von 4'] },
  angelegt: { name: 'Pflicht erfüllt', text: 'angelegt', punkt: 6, knopf: ['Weiter: Rhythmus', 'Übung 1 von 4'] },
  ausbau1: { name: 'Ausbau 1', text: 'ausgebaut', blatt: 1, punkt: 6, knopf: ['Weiter: Rhythmus', 'Übung 1 von 4'] },
  ausbau2: { name: 'Ausbau 2', text: 'ausgebaut', blatt: 2, punkt: 6, knopf: ['Weiter: Rhythmus', 'Übung 1 von 4'] },
  ausbau3: { name: 'Ausbau 3', text: 'in voller Fülle', blatt: 3, punkt: 6, knopf: ['Weiter: Rhythmus', 'Übung 1 von 4'] },
};
const q = (s) => document.querySelector(s);

// Leiste: gefüllt = erfüllt, Ring mit Punkt = aktuell, leerer Ring = noch nicht erreicht, Tropfen = Pflege
function spur(punkt) {
  const B = 30, H = 600, oben = 62, unten = H - 22;
  const y = (i) => unten - ((i - 1) * (unten - oben)) / 10;
  let s = `<line x1="15" y1="${y(1)}" x2="15" y2="${y(punkt)}" stroke="#6b5d4f" stroke-width="2"/><line x1="15" y1="${y(punkt)}" x2="15" y2="40" stroke="#6b5d4f" stroke-width="2" stroke-dasharray="1.5 5" stroke-linecap="round"/>`;
  for (let i = 1; i <= 11; i++) {
    if (i < punkt) s += `<circle cx="15" cy="${y(i)}" r="5.2" fill="#4d4238"/>`;
    else if (i === punkt) s += `<circle cx="15" cy="${y(i)}" r="8.6" fill="#f7f3ea" stroke="#4d4238" stroke-width="2.6"/><circle cx="15" cy="${y(i)}" r="3.6" fill="#4d4238"/>`;
    else s += `<circle cx="15" cy="${y(i)}" r="4.8" fill="#f7f3ea" stroke="#4d4238" stroke-width="1.8"/>`;
  }
  s += `<path d="M6 ${y(4) - 1}c-3 4-2 7 0 7s3-3 0-7z" transform="translate(0 -3)" fill="#6f9aa8"/>`;
  s += '<path d="M6 34V22l9-7 9 7v12zM15 15V6M12.4 8.6h5.2M12.5 34v-6a2.5 2.5 0 0 1 5 0v6" fill="none" stroke="#4d4238" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 ${B} ${H}" preserveAspectRatio="none">${s}</svg>`;
}

const speicher = {};
let gewaehlt = null;
async function zeige(stand) {
  const z = STAENDE[stand];
  gewaehlt = stand;
  speicher[stand] ||= await (await fetch(`bilder/worte/moment-${stand}.svg`)).text();
  if (gewaehlt !== stand) return; // inzwischen etwas anderes angetippt
  q('.szene').innerHTML = speicher[stand];
  q('.szene').setAttribute('aria-label', `Garten. Intervalle: ${z.name}${z.text ? ', ' + z.text : ''}. Notennamen: ausgebaut, Wiederholung empfohlen. Rhythmus: ${z.punkt === 6 ? 'als Nächstes' : 'noch nicht erreicht'}.`);
  q('.schild-5 .zeichen').className = `zeichen ${z.punkt === 4 ? 'leer' : z.punkt === 5 ? 'aktuell' : 'voll'}`;
  q('.schild-6 .zeichen').className = `zeichen ${z.punkt === 6 ? 'aktuell' : 'leer'}`;
  const blaetter = z.blatt ? h('span', { class: 'blaetter', 'aria-hidden': 'true' }, ...Array.from({ length: z.blatt }, () => h('i'))) : null;
  q('.schild-text').replaceChildren(h('strong', {}, 'Intervalle', blaetter), z.text ? h('small', {}, z.text) : '');
  q('.spur').innerHTML = spur(z.punkt);
  q('.weiter span').replaceChildren(z.knopf[0], h('small', {}, z.knopf[1]));
  document.querySelectorAll('.staende button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stand === stand)));
  document.documentElement.dataset.bereit = stand;
}

q('.staende').append(...Object.entries(STAENDE).map(([id, z]) => h('button', { type: 'button', 'data-stand': id, onclick: () => zeige(id) }, z.name)));
q('.weiter').addEventListener('click', (e) => e.preventDefault());
q('.wahl').addEventListener('submit', (e) => e.preventDefault());
zeige('aktuell');
