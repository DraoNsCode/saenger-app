import { h, icon, bestaetigen } from '../ui.js';
import { STIMMEN, SCHLUESSEL_NAME } from '../musik.js';
import { zustand, aendere, zuruecksetzen, leeren } from '../speicher.js';
import { setzeLautstaerke, spieleFolge, audio } from '../klang.js';
import { angemeldetAls, abmelden } from '../konto.js';
import { sichern, stoppeAbgleich } from '../abgleich.js';

export function stimmWahl(beiWahl) {
  const aktuell = zustand().stimme;
  return h(
    'div',
    { class: 'stimm-wahl', role: 'radiogroup', 'aria-label': 'Deine Stimme' },
    ...Object.entries(STIMMEN).map(([kurz, s]) =>
      h(
        'button',
        {
          class: 'stimm-knopf' + (aktuell === kurz ? ' gewaehlt' : ''),
          type: 'button',
          role: 'radio',
          'aria-checked': aktuell === kurz ? 'true' : 'false',
          onclick: () => beiWahl(kurz),
        },
        h('strong', {}, s.name),
        h('span', {}, SCHLUESSEL_NAME[s.schluessel])
      )
    )
  );
}

export function zeigeStart(wurzel) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite seite-start' },
      h('h1', { class: 'start-titel' }, 'Choristen-App'),
      h('p', { class: 'start-text' }, 'Noten lesen, Rhythmus und Gehör üben: ein paar Minuten, wann du willst. Ein Leitfaden zeigt dir, was als Nächstes kommt.'),
      h('h2', {}, 'Welche Stimme singst du?'),
      h('p', { class: 'unterzeile' }, 'Die Übungen zeigen dir die Noten in deinem Schlüssel. Du kannst das später ändern.'),
      stimmWahl((kurz) => {
        aendere((s) => (s.stimme = kurz));
        location.hash = '#/weg';
      })
    )
  );
}

export function zeigeEinstellungen(wurzel) {
  const z = zustand();
  const regler = h('input', {
    type: 'range',
    min: '0',
    max: '1',
    step: '0.05',
    value: String(z.einstellungen.lautstaerke),
    id: 'lautstaerke',
  });
  regler.addEventListener('input', () => {
    const v = parseFloat(regler.value);
    setzeLautstaerke(v);
    aendere((s) => (s.einstellungen.lautstaerke = v));
  });
  const neuZeichnen = () => zeigeEinstellungen(wurzel);
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      h('a', { class: 'zurueck-link', href: '#/weg' }, icon('zurueck', 20), 'Weg'),
      h('header', { class: 'seiten-kopf' }, h('div', {}, h('h1', {}, 'Einstellungen'))),
      h('h2', { class: 'abschnitt-titel' }, 'Deine Stimme'),
      stimmWahl((kurz) => {
        aendere((s) => (s.stimme = kurz));
        neuZeichnen();
      }),
      h('h2', { class: 'abschnitt-titel' }, 'Lautstärke'),
      h(
        'div',
        { class: 'lautstaerke' },
        h('label', { for: 'lautstaerke', class: 'sr' }, 'Lautstärke'),
        regler,
        h(
          'button',
          {
            class: 'knopf zweit',
            type: 'button',
            onclick: () => {
              audio();
              spieleFolge(
                [60, 64, 67, 72].map((m) => ({ midi: m, schlaege: 0.6 })),
                { tempo: 100 }
              );
            },
          },
          'Klang testen'
        )
      ),
      h('h2', { class: 'abschnitt-titel' }, 'Üben'),
      h(
        'label',
        { class: 'schalter-zeile' },
        (() => {
          const box = h('input', { type: 'checkbox', checked: !!z.einstellungen.strohhalm });
          box.addEventListener('change', () => aendere((s) => (s.einstellungen.strohhalm = box.checked)));
          return box;
        })(),
        h('span', {}, 'Ich habe einen dünnen Trinkhalm zum Üben (Übung „Singen durch den Strohhalm“). Dann kommt er im Ablauf „Einsingen zu Hause“ vor.')
      ),
      h('h2', { class: 'abschnitt-titel' }, 'Konto'),
      h('p', { class: 'unterzeile' }, `Angemeldet als ${angemeldetAls()}. Dein Fortschritt wird in deinem Konto gespeichert.`),
      h(
        'button',
        {
          class: 'knopf zweit',
          type: 'button',
          onclick: async () => {
            let gesichert = true;
            try {
              await Promise.race([sichern(), new Promise((_, nein) => setTimeout(() => nein(new Error('Zeit')), 5000))]);
            } catch (e) {
              gesichert = false;
            }
            const frage = gesichert
              ? 'Abmelden? Dein Fortschritt ist in deinem Konto gespeichert und kommt beim nächsten Anmelden zurück.'
              : 'Dein Fortschritt konnte gerade nicht ins Konto gespeichert werden, etwa weil keine Internetverbindung besteht. Die App speichert von selbst, sobald das Internet wieder da ist. Tipp deshalb lieber auf „Abbrechen“ und versuch es später noch einmal. Wenn du dich jetzt trotzdem abmeldest, geht verloren, was du zuletzt geübt hast.';
            if (!(await bestaetigen(frage, 'Abmelden'))) return;
            stoppeAbgleich();
            abmelden();
            leeren();
            location.hash = '#/weg';
          },
        },
        'Abmelden'
      ),
      h('h2', { class: 'abschnitt-titel' }, 'Fortschritt'),
      h('p', { class: 'unterzeile' }, 'Dein Fortschritt wird auf diesem Gerät und in deinem Konto gespeichert.'),
      h(
        'button',
        {
          class: 'knopf warnung-text',
          type: 'button',
          onclick: async () => {
            const ja = await bestaetigen('Fortschritt und Abzeichen löschen, auf diesem Gerät und im Konto? Das lässt sich nicht rückgängig machen.', 'Löschen');
            if (ja) {
              zuruecksetzen();
              sichern().catch(() => {});
              location.hash = '#/weg';
            }
          },
        },
        'Fortschritt zurücksetzen'
      )
    )
  );
}
