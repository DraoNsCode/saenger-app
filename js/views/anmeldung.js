// Anmeldung am Anfang der App (Daniel, 27.11.2026: „Die App an sich soll ja über Konten laufen, auf denen man sich anmelden muss“).
// Ein Konto legt man mit dem Chor-Code an (js/konto.js). Danach holt die App den Fortschritt aus dem Konto (js/abgleich.js).
import { h } from '../ui.js';
import { anmelden, kontoAnlegen, meldung } from '../konto.js';

function feld(beschriftung, attrs) {
  const eingabe = h('input', { class: 'eingabe', ...attrs });
  return { eingabe, el: h('label', { class: 'feld' }, h('span', {}, beschriftung), eingabe) };
}

// angemeldet(): wird nach erfolgreicher Anmeldung aufgerufen (darf ein Promise liefern)
export function zeigeAnmeldung(wurzel, angemeldet, modus = 'anmelden') {
  const neu = modus === 'neu';
  const email = feld('E-Mail', { type: 'email', autocomplete: 'email', required: true });
  const passwort = feld(neu ? 'Neues Passwort für die App (mindestens 8 Zeichen)' : 'Passwort', {
    type: 'password',
    autocomplete: neu ? 'new-password' : 'current-password',
    required: true,
    minlength: neu ? '8' : null,
  });
  const code = neu ? feld('Chor-Code', { type: 'text', autocomplete: 'off', autocapitalize: 'off', required: true }) : null;
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
        knopf.textContent = 'Einen Moment …';
        try {
          if (neu) await kontoAnlegen(email.eingabe.value, passwort.eingabe.value, code.eingabe.value);
          else await anmelden(email.eingabe.value, passwort.eingabe.value);
          await angemeldet();
        } catch (e) {
          fehler.textContent = meldung(e);
          knopf.disabled = false;
          knopf.textContent = neu ? 'Konto anlegen' : 'Anmelden';
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
      { class: 'seite seite-start' },
      h('h1', { class: 'start-titel' }, 'Choristen-App'),
      h('p', { class: 'start-text' }, 'Noten lesen, Rhythmus und Gehör üben: ein paar Minuten, wann du willst. Ein Leitfaden zeigt dir, was als Nächstes kommt.'),
      h('p', {}, 'Melde dich mit deinem Konto an. Neu hier? Dann tippe auf „Konto anlegen“. Dein Fortschritt wird im Konto gespeichert, so geht er nicht verloren und ist auf jedem Gerät da.'),
      h(
        'div',
        { class: 'sb-varianten', role: 'tablist' },
        h('button', { type: 'button', role: 'tab', class: 'chip' + (neu ? '' : ' an'), 'aria-selected': neu ? 'false' : 'true', onclick: () => zeigeAnmeldung(wurzel, angemeldet, 'anmelden') }, 'Anmelden'),
        h('button', { type: 'button', role: 'tab', class: 'chip' + (neu ? ' an' : ''), 'aria-selected': neu ? 'true' : 'false', onclick: () => zeigeAnmeldung(wurzel, angemeldet, 'neu') }, 'Konto anlegen')
      ),
      neu ? h('p', { class: 'unterzeile' }, 'Den Chor-Code bekommst du von der Chorleitung. Deine E-Mail-Adresse brauchst du nur zum Anmelden, die App schickt dir keine E-Mails. Denk dir ein eigenes Passwort aus, nicht das Passwort deiner E-Mail.') : null,
      formular,
      h('p', { class: 'unterzeile' }, 'Passwort vergessen? Wende dich an die Chorleitung.')
    )
  );
}
