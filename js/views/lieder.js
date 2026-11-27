// Chorlieder üben (Baustein D): Lieder aus dem Repertoire. Die Noten sind nicht öffentlich (ENTSCHEIDUNGEN.md, 26.11.2026),
// man sieht sie nur angemeldet. Eine eigene Anmeldung gibt es hier nicht, die App läuft als Ganzes über Konten (27.11.2026). Stufe 1: Liste und PDF ansehen. Anhören und die eigene Stimme kommen Lied für Lied,
// sobald ein Lied übertragen ist (UEBEN.md, „Die Noten: vom PDF zum Klang“). Lieder der Woche: vorerst nicht (27.11.2026).
import { h, icon } from '../ui.js';
import { abmelden, lieder, filtere, meldung } from '../konto.js';

let suche = '';
let sprache = null;

export function zeigeLieder(wurzel) {
  const kopf = [
    h('a', { class: 'zurueck-link', href: '#/ueben' }, icon('zurueck', 20), 'Üben'),
    h('header', { class: 'seiten-kopf mit-zurueck' }, h('div', {}, h('h1', {}, 'Chorlieder üben'))),
  ];
  zeigeListe(wurzel, kopf);
}

function zeigeListe(wurzel, kopf) {
  const liste = h('ul', { class: 'lieder-liste', 'aria-live': 'polite' });
  const zustandZeile = h('p', { class: 'sb-status' }, 'Lieder werden geladen …');
  const eingabe = h('input', { class: 'eingabe', type: 'search', placeholder: 'Nummer (z. B. 47) oder Titel', value: suche, 'aria-label': 'Lied suchen' });
  let alle = [];

  const sprachKnopf = (wert, text) =>
    h('button', { type: 'button', class: 'chip' + (sprache === wert ? ' an' : ''), 'aria-pressed': sprache === wert ? 'true' : 'false', onclick: () => { sprache = wert; zeigeListe(wurzel, kopf); } }, text);

  const fuelle = () => {
    const treffer = filtere(alle, suche, sprache);
    liste.replaceChildren(
      ...treffer.map((l) =>
        h(
          'li',
          { class: 'lied' },
          h('div', { class: 'lied-text' }, h('span', { class: 'lied-kennung' }, l.kennung), h('span', { class: 'lied-titel' }, l.titel), l.kategorie ? h('span', { class: 'lied-kategorie' }, l.kategorie) : null),
          l.noten
            ? h('a', { class: 'knopf zweit klein', href: l.noten, target: '_blank', rel: 'noopener' }, 'Noten')
            : h('span', { class: 'lied-ohne' }, 'keine Noten')
        )
      )
    );
    zustandZeile.textContent = !alle.length ? '' : treffer.length === alle.length ? `${alle.length} Lieder` : `${treffer.length} ${treffer.length === 1 ? 'Lied' : 'Lieder'} gefunden`;
  };
  eingabe.addEventListener('input', () => {
    suche = eingabe.value;
    fuelle();
  });

  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      ...kopf,
      h('div', { class: 'sb-box' }, 'Tippe auf „Noten“, dann öffnet sich das Lied. D steht für deutsche, R für russische Lieder. Zum Anhören muss jedes Lied erst in die App eingegeben werden. Das kommt nach und nach dazu.'),
      h('div', { class: 'lieder-filter' }, eingabe, h('div', { class: 'sb-varianten' }, sprachKnopf(null, 'Alle'), sprachKnopf('D', 'Deutsch'), sprachKnopf('R', 'Russisch'))),
      zustandZeile,
      liste
    )
  );

  lieder()
    .then((d) => {
      alle = d.lieder;
      fuelle();
    })
    .catch((e) => {
      // Anmeldung abgelaufen: zurück zur Anmeldung der App
      if (e.art === 'anmelden') {
        abmelden();
        location.hash = '#/weg';
        return;
      }
      zustandZeile.textContent = meldung(e);
      liste.replaceChildren(h('li', {}, h('button', { class: 'knopf zweit', type: 'button', onclick: () => zeigeListe(wurzel, kopf) }, 'Noch einmal versuchen')));
    });
}
