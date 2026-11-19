import { STIMMEN, diaAusPos, abcTon, midi, zufall, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';

const BEREICH = { leicht: [0, 8], mittel: [-1, 9], schwer: [-4, 12] };

export default {
  id: 'schritt-sprung',
  titel: 'Schritt oder Sprung',
  themaId: 'notenbild',
  aufgaben: 8,
  stufen: {
    leicht: 'Schritte und große Sprünge',
    mittel: 'Auch kleine Sprünge und gleiche Töne',
    schwer: 'Mit Hilfslinien',
  },
  erklaerung: [
    'Geht die Melodie von einer Linie in den Zwischenraum direkt daneben, oder umgekehrt, ist das ein **Schritt**: zum nächsten Ton.',
    'Wird dabei mindestens eine Linie oder ein Zwischenraum übersprungen, ist es ein **Sprung**. Schon von einer Linie zur nächsten Linie ist ein Sprung.',
    'Sitzen beide Noten an derselben Stelle, wird derselbe Ton **wiederholt**.',
  ],
  beispiel(k) {
    const d = (p) => abcTon(diaAusPos(k.stimme, p));
    return {
      abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel }) + `"_Schritt"${d(2)} ${d(3)} x "_Sprung"${d(2)} ${d(6)} |]`,
      breite: 230,
    };
  },
  neu(stufe, k) {
    const [min, max] = BEREICH[stufe];
    let art;
    if (stufe === 'leicht') art = waehle(['schritt', 'sprung']);
    else art = Math.random() < 0.14 ? 'gleich' : waehle(['schritt', 'sprung']);
    let a, b, abstand;
    do {
      a = zufall(min, max);
      if (art === 'schritt') abstand = 1;
      else if (art === 'gleich') abstand = 0;
      else abstand = stufe === 'leicht' ? zufall(3, 5) : stufe === 'mittel' ? zufall(2, 4) : zufall(2, 3);
      b = a + waehle([-1, 1]) * abstand;
    } while (b < min || b > max);
    const da = diaAusPos(k.stimme, a);
    const db = diaAusPos(k.stimme, b);
    let warum;
    if (art === 'schritt') warum = 'Die zweite Note sitzt direkt daneben, von Linie zu Zwischenraum oder umgekehrt. Das ist ein Schritt.';
    else if (art === 'gleich') warum = 'Beide Noten sitzen an derselben Stelle. Der Ton wird wiederholt.';
    else if (abstand === 2) warum = 'Beide Noten sitzen auf Linien oder beide in Zwischenräumen. Dazwischen wird etwas übersprungen: ein kleiner Sprung.';
    else warum = 'Zwischen den Noten wird mehr als eine Linie oder ein Zwischenraum übersprungen. Das ist ein Sprung.';
    const optionen = [
      { text: 'Schritt', wert: 'schritt' },
      { text: 'Sprung', wert: 'sprung' },
    ];
    if (stufe !== 'leicht') optionen.push({ text: 'Gleich', wert: 'gleich' });
    return {
      frage: 'Ist das ein Schritt oder ein Sprung?',
      bild: { abc: kopf({ schluessel: STIMMEN[k.stimme].schluessel }) + `x ${abcTon(da)}2 ${abcTon(db)}2 x |]`, breite: 170, scale: 1.8 },
      optionen,
      spalten: optionen.length,
      loesung: art,
      warum,
      nachher: () => spieleFolge([{ midi: midi(da), schlaege: 1 }, { midi: midi(db), schlaege: 1.5 }], { tempo: 90 }),
    };
  },
};
