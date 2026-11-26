// Etappe 6, „Welche Strophe?“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// Unter den Noten stehen mehrere Strophen. Welche Silbe singst du in Strophe n auf der farbigen Note?
// leicht: nötige Station, zwei Strophen. schwer: freiwillig, drei Strophen.
// Die Texte hat Claude für die Übung geschrieben.
import { STIMMEN, abcTon, waehle, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { melodiePositionen, diasAusPositionen } from './hilfen.js';

// Silben je Strophe; ein Bindestrich am Ende heißt: das Wort geht weiter
export const TEXTE = [
  [
    ['Lobt', 'den', 'Herrn', 'mit', 'Freu-', 'den'],
    ['Singt', 'ihm', 'al-', 'le', 'Lie-', 'der'],
    ['Dankt', 'ihm', 'für', 'den', 'Mor-', 'gen'],
  ],
  [
    ['Hell', 'er-', 'klingt', 'das', 'Lied'],
    ['Froh', 'ist', 'un-', 'ser', 'Herz'],
    ['Gott', 'ist', 'treu', 'und', 'gut'],
  ],
  [
    ['Mor-', 'gen-', 'licht', 'er-', 'wa-', 'chet'],
    ['Vö-', 'gel', 'sin-', 'gen', 'lei-', 'se'],
    ['Blu-', 'men', 'öff-', 'nen', 'Blü-', 'ten'],
  ],
  [
    ['Lie-', 'be,', 'die', 'uns', 'trägt'],
    ['Hoff-', 'nung,', 'die', 'uns', 'hält'],
    ['Frie-', 'de,', 'der', 'uns', 'schützt'],
  ],
];

const ORDNUNG = ['erste', 'zweite', 'dritte'];

// Eine Strophe als ABC-Textzeile: Silben eines Worts mit Bindestrich, Wörter mit Leerzeichen
function zeile(nummer, silben) {
  return 'w: ' + silben.map((x, i) => (i === 0 ? `${nummer}.~${x}` : x)).join(' ').replace(/- /g, '-');
}

export default {
  id: 'strophen',
  titel: 'Welche Strophe?',
  themaId: 'zeichen',
  aufgaben: 8,
  stufen: {
    leicht: 'Zwei Strophen',
    schwer: 'Drei Strophen',
  },
  erklaerung: [
    'Hat ein Lied mehrere **Strophen**, stehen ihre Texte untereinander unter denselben Noten. Vorn steht die Nummer der Strophe.',
    'In Strophe 2 liest du die zweite Textzeile, in Strophe 3 die dritte. Die Noten bleiben dieselben.',
    'In dieser Übung steht unter jeder Note in jeder Zeile genau eine Silbe. Geht ein Wort über mehrere Noten, verbindet ein Bindestrich die Silben. In echten Liedern singt man manchmal eine Silbe auf mehreren Noten.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const anzahl = stufe === 'schwer' ? 3 : 2;
    const text = waehle(TEXTE).slice(0, anzahl);
    const laenge = text[0].length;
    // Nur Noten, unter denen in allen gezeigten Strophen verschiedene Silben stehen
    const moeglich = Array.from({ length: laenge }, (_, i) => i).filter((i) => new Set(text.map((v) => v[i])).size === anzahl);
    const note = waehle(moeglich);
    const strophe = Math.floor(Math.random() * anzahl);
    const richtig = text[strophe][note];
    const andere = text.filter((_, v) => v !== strophe).map((v) => v[note]);
    // Typischer Fehler: dieselbe Strophe, aber die Nachbarnote
    const nachbar = text[strophe][note + 1 < laenge ? note + 1 : note - 1];
    const antworten = [...new Set([richtig, ...andere, nachbar])].slice(0, 4);
    const dias = diasAusPositionen(k.stimme, melodiePositionen(laenge, { min: 1, max: 7 }));
    const abc = kopf({ schluessel: s }) + dias.map((d) => abcTon(d)).join(' ') + ' |]\n' + text.map((v, i) => zeile(i + 1, v)).join('\n');
    return {
      frage: `Strophe ${strophe + 1}: Welche Silbe singst du auf der farbigen Note?`,
      bild: {
        abc,
        breite: 300,
        scale: 1.35,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note');
          if (alle[note]) alle[note].classList.add('markiert');
        },
      },
      optionen: mische(antworten).map((t) => ({ text: t, wert: t })),
      spalten: 2,
      loesung: richtig,
      warum: `In Strophe ${strophe + 1} liest du die ${ORDNUNG[strophe]} Textzeile. Unter der farbigen Note steht dort „${richtig}“.`,
      note, // für die Prüfung
      strophe,
      text,
    };
  },
};
