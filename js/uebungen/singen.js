// „Selbst singen, dann vergleichen“: freiwillige Stationen im Lernweg (Daniel, 27.11.2026: „Lernweg, nicht verpflichtend“).
// Die App kann ohne Mikrofon nicht prüfen, ob der Ton getroffen ist. Deshalb schätzt man sich nach dem Vergleich selbst ein,
// und die Runde zählt wie sonst ab 6 von 8. Claudes Wahl (Daniel, 27.11.2026: „Setze jetzt alles so um, wie du es für am
// sinnvollsten hältst“), Daniel korrigiert, falls nötig. Mit dem Mikrofon (Baustein G) könnte die App später selbst prüfen.
import { h } from '../ui.js';

// vorspiel(): spielt, was man vor dem Singen hört. loesung(): spielt den richtigen Ton zum Vergleich.
export function singAufgabe({ frage, hinweis, vorspiel, loesung, nachherText, trefferFrage = 'Hast du den Ton getroffen?' }) {
  return {
    eigene(el, fertig) {
      let beantwortet = false;
      const zeitgeber = setTimeout(vorspiel, 300);
      el.append(
        h('h2', { class: 'frage' }, frage),
        h('p', { class: 'frage-hinweis' }, hinweis),
        h(
          'div',
          { class: 'singen-knoepfe' },
          h('button', { class: 'knopf zweit', type: 'button', onclick: () => vorspiel() }, 'Noch einmal hören'),
          h('button', { class: 'knopf zweit', type: 'button', onclick: () => loesung() }, 'Lösung hören')
        ),
        h('p', { class: 'frage-hinweis' }, `${trefferFrage} Schätz dich ehrlich ein.`)
      );
      // Klasse „optionen“ wie bei den anderen Aufgaben, damit der Klick-Test die Antworten findet
      const antworten = h('div', { class: 'optionen spalten-2', role: 'group', 'aria-label': 'Selbsteinschätzung' });
      const antwort = (getroffen) => {
        if (beantwortet) return;
        beantwortet = true;
        antworten.querySelectorAll('button').forEach((b) => (b.disabled = true));
        fertig({ richtig: getroffen, text: getroffen ? nachherText : `${nachherText} Hör dir die Lösung noch einmal an und sing leise mit.` });
      };
      antworten.append(
        h('button', { class: 'option', type: 'button', onclick: () => antwort(true) }, h('span', { class: 'option-text' }, 'Getroffen')),
        h('button', { class: 'option', type: 'button', onclick: () => antwort(false) }, h('span', { class: 'option-text' }, 'Daneben'))
      );
      el.append(antworten);
      return () => clearTimeout(zeitgeber);
    },
    selbstSingen: true, // für die Prüfung
  };
}
