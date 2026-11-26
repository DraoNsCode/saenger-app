// Etappe 3, „Taste am Klavier“ (LERNWEG.md, „Stationen der Etappe 3“, von Daniel vorläufig angenommen am 26.11.2026).
// Nur weiße Tasten; die schwarzen bekommen ihre Namen mit den Vorzeichen in Etappe 10 (Claudes Wahl, von Daniel überlassen,
// ENTSCHEIDUNGEN.md, „Etappe 3“). Jede Taste mit dem richtigen Namen zählt, egal in welcher Oktave („Der Buchstabe reicht“).
// leicht: nötige Station, vom Namen zur Taste. schwer: freiwillig, von der Note im Notenbild zur Taste.
import { h } from '../ui.js';
import { STIMMEN, abcTon, midi, waehle } from '../musik.js';
import { kopf, zeichne } from '../noten.js';
import { ton, jetzt, stopAlles } from '../klang.js';
import { NAMEN, notenname, bereichPos, diaAusPosIn, zufallsPos, einzelnote, zaehlText } from './namen.js';

export const WEISSE = 10; // Tasten auf der Klaviatur

// Wo eine weiße Taste liegt, an den Gruppen der schwarzen Tasten erklärt
export const TASTEN_ORT = {
  c: 'Das c liegt links neben den zwei schwarzen Tasten.',
  d: 'Das d liegt zwischen den zwei schwarzen Tasten.',
  e: 'Das e liegt rechts neben den zwei schwarzen Tasten.',
  f: 'Das f liegt links neben den drei schwarzen Tasten.',
  g: 'Das g liegt zwischen der ersten und der zweiten der drei schwarzen Tasten, von links gezählt.',
  a: 'Das a liegt zwischen der zweiten und der dritten der drei schwarzen Tasten, von links gezählt.',
  h: 'Das h liegt rechts neben den drei schwarzen Tasten.',
};

// Weiße Tasten ab einer diatonischen Zahl. Nach c, d, f, g und a folgt eine schwarze Taste.
export function tasten(startDia, anzahl = WEISSE) {
  return Array.from({ length: anzahl }, (_, i) => {
    const dia = startDia + i;
    const name = notenname(dia);
    return { dia, name, midi: midi(dia), schwarzDanach: i < anzahl - 1 && ['c', 'd', 'f', 'g', 'a'].includes(name) };
  });
}

let letzte = null;

export default {
  id: 'klavier',
  titel: 'Taste am Klavier',
  themaId: 'notennamen',
  aufgaben: 8,
  stufen: {
    leicht: 'Vom Namen zur Taste',
    schwer: 'Von der Note zur Taste',
  },
  erklaerung: [
    'Die weißen Tasten heißen wie die Noten: **c d e f g a h**, dann wieder c. Die schwarzen Tasten bekommen ihre Namen später.',
    'Die schwarzen Tasten helfen beim Finden. Sie liegen in Gruppen zu **zwei** und zu **drei**.',
    'Das **c** liegt links neben den zwei schwarzen Tasten, das **f** links neben den drei.',
    'Jede Taste mit dem richtigen Namen zählt, egal wie hoch oder tief sie liegt. Tippst du eine Taste an, hörst du ihren Ton.',
  ],
  neu(stufe, k) {
    const st = STIMMEN[k.stimme];
    // Klaviatur in der Lage der eigenen Stimme, Beginn auf einem zufälligen Namen
    const mitte = Math.round((st.bereich[0] + st.bereich[1]) / 2);
    const startDia = mitte - 4 - Math.floor(Math.random() * 3);
    let ziel;
    let notenBild = null;
    let notenText = null;
    if (stufe === 'schwer') {
      let pos;
      do pos = zufallsPos(bereichPos(k.stimme));
      while (notenname(diaAusPosIn(st.schluessel, pos)) === letzte);
      const dia = diaAusPosIn(st.schluessel, pos);
      ziel = notenname(dia);
      notenBild = einzelnote(kopf({ schluessel: st.schluessel }), abcTon(dia));
      notenText = zaehlText(st.schluessel, pos);
    } else {
      ziel = waehle(NAMEN.filter((n) => n !== letzte));
    }
    letzte = ziel;
    const reihe = tasten(startDia);
    return {
      eigene: (el, fertig) => klaviatur(el, { ziel, notenBild, notenText, reihe }, fertig),
      ziel,
      reihe,
      notenText, // für die Prüfung
    };
  },
};

function klaviatur(el, { ziel, notenBild, notenText, reihe }, fertig) {
  let beantwortet = false;
  el.append(h('h2', { class: 'frage' }, notenBild ? 'Tippe auf eine Taste mit dem Namen dieser Note.' : `Tippe auf ein ${ziel}.`));
  el.append(h('p', { class: 'frage-hinweis' }, 'Jede Taste mit diesem Namen zählt.'));
  if (notenBild) {
    const karte = h('div', { class: 'noten-karte' });
    el.append(karte);
    zeichne(karte, notenBild, { breite: 150, scale: 1.9 });
  }
  // Klasse „optionen“, damit der Klick-Test die Tasten wie Antworten findet; weiße Tasten zuerst
  const brett = h('div', { class: 'optionen klaviatur', role: 'group', 'aria-label': 'Klaviatur' });
  el.append(brett);
  const weisse = reihe.map((t, i) => {
    const b = h('button', { class: 'taste weiss', type: 'button', 'aria-label': `Weiße Taste ${i + 1}` }, h('span', { class: 'tasten-name' }, t.name));
    b.addEventListener('click', () => {
      ton(t.midi, jetzt() + 0.02, 0.8);
      antwort(b, t);
    });
    brett.append(b);
    return b;
  });
  reihe.forEach((t, i) => {
    if (!t.schwarzDanach) return;
    const b = h('button', { class: 'taste schwarz', type: 'button', tabindex: '-1', 'aria-hidden': 'true' });
    b.style.left = `${((i + 1) / reihe.length) * 100}%`;
    // Schwarze Tasten klingen nur, sie sind keine Antwort
    b.addEventListener('click', () => ton(t.midi + 1, jetzt() + 0.02, 0.8));
    brett.append(b);
  });

  function antwort(b, t) {
    if (beantwortet) return;
    beantwortet = true;
    const ok = t.name === ziel;
    brett.classList.add('beantwortet');
    b.classList.add(ok ? 'richtig' : 'falsch');
    reihe.forEach((x, i) => {
      if (x.name === ziel && weisse[i] !== b) weisse[i].classList.add('loesung');
      weisse[i].setAttribute('aria-disabled', 'true');
    });
    // Mit Notenbild liegt der Fehler meist beim Lesen: zuerst die Note erklären, dann die Taste
    const text = ok ? null : notenText ? `${notenText} ${TASTEN_ORT[ziel]}` : `Du hast ein ${t.name} getippt. ${TASTEN_ORT[ziel]}`;
    fertig({ richtig: ok, text });
  }

  return () => stopAlles();
}
