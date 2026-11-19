import { h } from '../ui.js';

// Übe-Teil: nicht als Spiel gedacht, sondern als Hilfe beim eigenen Üben (noch in Vorbereitung)
export function zeigeUeben(wurzel) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('header', { class: 'seiten-kopf' }, h('div', {}, h('h1', {}, 'Üben'), h('p', { class: 'unterzeile' }, 'Hilfe beim eigenen Üben, ohne Punkte und Runden.'))),
      h(
        'ul',
        { class: 'ueben-liste' },
        h(
          'li',
          { class: 'ueben-karte' },
          h('h2', {}, 'Stimme und Atem'),
          h('p', {}, 'Angeleitete Übungen zum Mitmachen, mit Ton und kurzem Text. Sie ersetzen keinen Gesangslehrer, helfen aber beim Üben zu Hause.'),
          h('p', { class: 'etappe-bald' }, 'In Vorbereitung')
        ),
        h(
          'li',
          { class: 'ueben-karte' },
          h('h2', {}, 'Chorlieder üben'),
          h('p', {}, 'Die eigene Stimme der Lieder aus dem Chorliederbuch anhören und mitsingen.'),
          h('p', { class: 'etappe-bald' }, 'In Vorbereitung')
        )
      )
    )
  );
}
