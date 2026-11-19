// Themen: gezielt üben
// IN FRAGE GESTELLT: Daniel will ein besseres System für das gezielte Üben nach dem Weg, ohne Auswahl nach
// Leicht, Mittel und Schwer (ENTSCHEIDUNGEN.md, „Gezielt üben nach dem Weg“, 19.11.2026). Nicht weiterentwickeln.
import { h, icon } from '../ui.js';
import { THEMEN, STUFEN, STUFEN_NAME, thema, verfuegbar, uebungenImThema } from '../lernweg.js';
import { zustand } from '../speicher.js';
import { alleAbzeichen } from '../abzeichen.js';
import { UEBUNGEN } from '../uebungen/index.js';
import { zeigeErklaerung } from '../runde.js';
import { medaille } from '../medaille.js';

function hoechstesMetall(themaId) {
  const liste = alleAbzeichen().filter((a) => a.gruppe === 'themen' && a.themaId === themaId && a.erreicht);
  return liste.length ? liste[liste.length - 1] : null;
}

export function zeigeThemen(wurzel) {
  const liste = h('ol', { class: 'themen-liste' });
  THEMEN.forEach((t, ti) => {
    const gebaut = verfuegbar(t);
    const metall = gebaut ? hoechstesMetall(t.id) : null;
    const inhalt = [
      h('span', { class: 'themen-nr', 'aria-hidden': 'true' }, String(ti + 1)),
      h('span', { class: 'themen-text' }, h('strong', {}, t.titel), h('span', {}, gebaut ? t.kurz : 'In Vorbereitung')),
    ];
    if (metall) inhalt.push(h('span', { class: 'themen-metall' }, medaille(metall, 34)));
    liste.append(
      h(
        'li',
        {},
        gebaut
          ? h('a', { class: 'themen-eintrag', href: `#/thema/${t.id}` }, ...inhalt)
          : h('div', { class: 'themen-eintrag kommt', 'aria-disabled': 'true' }, ...inhalt)
      )
    );
  });
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('header', { class: 'seiten-kopf' }, h('div', {}, h('h1', {}, 'Themen'), h('p', { class: 'unterzeile' }, 'Gezielt üben, die meisten Übungen auch schwerer.'))),
      liste
    )
  );
}

export function zeigeThema(wurzel, id) {
  const t = thema(id);
  if (!t || !verfuegbar(t)) {
    location.hash = '#/themen';
    return;
  }
  const z = zustand();
  const abz = alleAbzeichen().filter((a) => a.gruppe === 'themen' && a.themaId === id);
  const medaillen = h(
    'div',
    { class: 'thema-medaillen' },
    ...abz.map((a) =>
      h(
        'div',
        { class: 'thema-medaille' + (a.erreicht ? ' an' : '') },
        medaille(a, 48),
        h('strong', {}, a.titel.split(':')[0]),
        h('span', {}, a.erreicht ? (a.mehr > 1 ? `${a.mehr}-mal erreicht` : 'erreicht') : `${a.ist} von ${a.soll}`)
      )
    )
  );
  const uebungen = uebungenImThema(t).map((uid) => {
    const u = UEBUNGEN[uid];
    const stats = z.uebungen[uid] || {};
    return h(
      'li',
      { class: 'uebung-karte' },
      h(
        'div',
        { class: 'uebung-kopf' },
        h('h3', {}, u.titel),
        h('button', { class: 'text-knopf', type: 'button', onclick: () => zeigeErklaerung(u) }, 'Kurz erklärt')
      ),
      h(
        'div',
        { class: 'stufen' },
        // Nicht jede Übung hat alle drei Stufen (ENTSCHEIDUNGEN.md, 19.11.2026)
        ...STUFEN.filter((s) => u.stufen[s]).map((s, _, alle) => {
          const r = stats[s] ? stats[s].runden : 0;
          return h(
            'a',
            { class: 'stufe-knopf', href: `#/frei/${uid}/${s}` },
            // Hat eine Übung nur eine Stufe, heißt der Knopf einfach „Üben“
            h('strong', {}, alle.length === 1 ? 'Üben' : STUFEN_NAME[s]),
            h('span', { class: 'stufe-text' }, u.stufen[s]),
            h('span', { class: 'stufe-zahl' }, r ? (r === 1 ? '1 Runde' : `${r} Runden`) : '')
          );
        })
      )
    );
  });
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('a', { class: 'zurueck-link', href: '#/themen' }, icon('zurueck', 20), 'Themen'),
      h('header', { class: 'seiten-kopf' }, h('div', {}, h('h1', {}, t.titel), h('p', { class: 'unterzeile' }, t.kurz))),
      medaillen,
      h(
        'div',
        { class: 'thema-gemischt' },
        h('a', { class: 'knopf zweit breit', href: `#/mix/${t.id}` }, 'Gemischte Runde aus allen Übungen')
      ),
      h('ul', { class: 'uebungen-liste' }, ...uebungen)
    )
  );
}
