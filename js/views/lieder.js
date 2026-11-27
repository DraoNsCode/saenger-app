// Chorlieder üben (Baustein D): Lieder aus dem Repertoire, nur mit Konto, weil die Noten nicht öffentlich sein dürfen
// (ENTSCHEIDUNGEN.md, 26.11.2026). Stufe 1: Liste und PDF ansehen. Anhören und die eigene Stimme kommen Lied für Lied,
// sobald ein Lied übertragen ist (UEBEN.md, „Die Noten: vom PDF zum Klang“). Lieder der Woche: vorerst nicht (27.11.2026).
import { h, icon } from '../ui.js';
import { angemeldetAls, anmelden, kontoAnlegen, abmelden, lieder, filtere, meldung } from '../konto.js';

let suche = '';
let sprache = null;

export function zeigeLieder(wurzel) {
  const kopf = [
    h('a', { class: 'zurueck-link', href: '#/ueben' }, icon('zurueck', 20), 'Üben'),
    h('header', { class: 'seiten-kopf mit-zurueck' }, h('div', {}, h('h1', {}, 'Chorlieder üben'))),
  ];
  if (!angemeldetAls()) return zeigeAnmeldung(wurzel, kopf);
  zeigeListe(wurzel, kopf);
}

function feld(beschriftung, attrs) {
  const eingabe = h('input', { class: 'eingabe', ...attrs });
  return { eingabe, el: h('label', { class: 'feld' }, h('span', {}, beschriftung), eingabe) };
}

function zeigeAnmeldung(wurzel, kopf, modus = 'anmelden') {
  const neu = modus === 'neu';
  const email = feld('E-Mail', { type: 'email', autocomplete: 'email', required: true });
  const passwort = feld(neu ? 'Passwort (mindestens 8 Zeichen)' : 'Passwort', { type: 'password', autocomplete: neu ? 'new-password' : 'current-password', required: true, minlength: neu ? '8' : null });
  const code = neu ? feld('Chor-Code', { type: 'text', autocomplete: 'off', required: true }) : null;
  const fehler = h('p', { class: 'formular-fehler', role: 'alert' });
  const knopf = h('button', { class: 'knopf haupt breit', type: 'submit' }, neu ? 'Konto anlegen' : 'Anmelden');

  const formular = h(
    'form',
    {
      class: 'formular',
      onsubmit: async (ev) => {
        ev.preventDefault();
        fehler.textContent = '';
        knopf.disabled = true;
        try {
          if (neu) await kontoAnlegen(email.eingabe.value, passwort.eingabe.value, code.eingabe.value);
          else await anmelden(email.eingabe.value, passwort.eingabe.value);
          zeigeLieder(wurzel);
        } catch (e) {
          fehler.textContent = meldung(e);
          knopf.disabled = false;
        }
      },
    },
    email.el,
    passwort.el,
    code ? code.el : null,
    fehler,
    knopf
  );

  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      ...kopf,
      h('p', {}, 'Hier siehst du die Noten der Lieder aus unserem Repertoire. Weil die Noten nicht öffentlich sein dürfen, brauchst du dafür ein Konto. Alles andere in der App geht auch ohne.'),
      h(
        'div',
        { class: 'sb-varianten', role: 'tablist' },
        h('button', { type: 'button', role: 'tab', class: 'chip' + (neu ? '' : ' an'), 'aria-selected': neu ? 'false' : 'true', onclick: () => zeigeAnmeldung(wurzel, kopf, 'anmelden') }, 'Anmelden'),
        h('button', { type: 'button', role: 'tab', class: 'chip' + (neu ? ' an' : ''), 'aria-selected': neu ? 'true' : 'false', onclick: () => zeigeAnmeldung(wurzel, kopf, 'neu') }, 'Konto anlegen')
      ),
      neu ? h('p', { class: 'unterzeile' }, 'Den Chor-Code bekommst du von der Chorleitung. Deine E-Mail-Adresse brauchst du nur zum Anmelden, die App schickt dir keine E-Mails.') : null,
      formular,
      h('p', { class: 'unterzeile' }, 'Passwort vergessen? Wende dich an die Chorleitung.')
    )
  );
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
      h(
        'p',
        { class: 'unterzeile konto-zeile' },
        `Angemeldet als ${angemeldetAls()} · `,
        h('button', { type: 'button', class: 'knopf text', onclick: () => { abmelden(); zeigeLieder(wurzel); } }, 'Abmelden')
      ),
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
      if (e.art === 'anmelden') return zeigeLieder(wurzel);
      zustandZeile.textContent = meldung(e);
      liste.replaceChildren(h('li', {}, h('button', { class: 'knopf zweit', type: 'button', onclick: () => zeigeListe(wurzel, kopf) }, 'Noch einmal versuchen')));
    });
}
