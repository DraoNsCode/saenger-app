// Chorlieder üben (Baustein D). Wird im nächsten Schritt mit Konto und Liederliste gefüllt.
import { h, icon } from '../ui.js';

export function zeigeLieder(wurzel) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('a', { class: 'zurueck-link', href: '#/ueben' }, icon('zurueck', 20), 'Üben'),
      h('header', { class: 'seiten-kopf mit-zurueck' }, h('div', {}, h('h1', {}, 'Chorlieder üben'))),
      h('p', {}, 'In Vorbereitung.')
    )
  );
}
