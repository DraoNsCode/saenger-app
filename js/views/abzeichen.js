import { h } from '../ui.js';
import { alleAbzeichen, GRUPPEN } from '../abzeichen.js';
import { zustand } from '../speicher.js';
import { medaille } from '../medaille.js';

function datum(iso) {
  const [j, m, t] = iso.split('-');
  return `${Number(t)}.${Number(m)}.${j}`;
}

function standText(a, am) {
  if (!a.erreicht) return `${a.ist} von ${a.soll}`;
  const wann = am ? `am ${datum(am)}` : 'erreicht';
  return a.mehr > 1 ? `${a.mehr}-mal, zuerst ${wann}` : wann;
}

export function zeigeAbzeichen(wurzel) {
  const alle = alleAbzeichen();
  const z = zustand();
  const erreicht = alle.filter((a) => a.erreicht).length;
  const abschnitte = GRUPPEN.map((g) => {
    const liste = alle.filter((a) => a.gruppe === g.id);
    return h(
      'section',
      { class: 'abzeichen-gruppe' },
      h('h2', {}, g.titel),
      h('p', { class: 'gruppe-text' }, g.text),
      h(
        'ul',
        { class: 'abzeichen-raster' },
        ...liste.map((a) =>
          h(
            'li',
            { class: 'abzeichen' + (a.erreicht ? ' an' : '') },
            medaille(a, 60),
            h('strong', {}, a.titel),
            h('span', { class: 'abzeichen-stand' }, standText(a, z.abzeichen[a.id])),
            a.erreicht ? null : h('span', { class: 'balken', 'aria-hidden': 'true' }, h('span', { style: { width: `${Math.round((a.ist / a.soll) * 100)}%` } }))
          )
        )
      )
    );
  });
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('header', { class: 'seiten-kopf' }, h('div', {}, h('h1', {}, 'Abzeichen'), h('p', { class: 'unterzeile' }, `${erreicht} von ${alle.length} erreicht`))),
      ...abschnitte
    )
  );
}
