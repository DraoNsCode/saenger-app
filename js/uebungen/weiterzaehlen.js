// Etappe 3, „Weiterzählen“ (LERNWEG.md, „Stationen der Etappe 3“, von Daniel vorläufig angenommen am 26.11.2026).
// Eine Note ist benannt, die zweite liegt in der Nähe: Wie heißt sie?
// leicht: nötige Station, ein Schritt hinauf oder hinunter, auch über h und c hinweg.
// schwer: freiwillig, Sprünge bis zur Quinte (zwei bis vier Stufen).
import { STIMMEN, abcTon, midi, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { spieleFolge } from '../klang.js';
import { notenname, bereichPos, diaAusPosIn, reihe, zufallsPos, namensOptionen } from './namen.js';

let letzteAufgabe = null;

export default {
  id: 'weiterzaehlen',
  titel: 'Weiterzählen',
  themaId: 'notennamen',
  aufgaben: 8,
  stufen: {
    leicht: 'Ein Schritt hinauf oder hinunter',
    schwer: 'Sprünge',
  },
  erklaerung: [
    'Die erste Note ist schon benannt. Von ihr aus findest du den Namen der zweiten.',
    'Geht es **einen Schritt hinauf**, kommt der nächste Name: Nach g kommt a. Geht es **hinunter**, zählst du rückwärts: Vor a kommt g.',
    'Nach dem **h** fängt die Reihe wieder mit **c** an. Rückwärts kommt nach dem c wieder das h.',
    'Bei Sprüngen zählst du Linie und Zwischenraum nacheinander weiter, bis du bei der zweiten Note bist.',
  ],
  beispiel(k) {
    const s = STIMMEN[k.stimme].schluessel;
    const start = s === 'treble' ? 2 : 6;
    return { abc: kopf({ schluessel: s }) + `x "^${notenname(diaAusPosIn(s, start))}"${abcTon(diaAusPosIn(s, start))}2 "^?"${abcTon(diaAusPosIn(s, start + 1))}2 x |]`, breite: 200 };
  },
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const [von, bis] = bereichPos(k.stimme);
    let erste;
    let zweite;
    do {
      const abstand = stufe === 'leicht' ? 1 : waehle([2, 3, 4]);
      const richtung = waehle([1, -1]);
      if (stufe === 'leicht' && Math.random() < 0.3) {
        // Über h und c hinweg: Start auf einem h (hinauf) oder c (hinunter)
        const ziel = richtung > 0 ? 'h' : 'c';
        const kandidaten = [];
        for (let p = von; p <= bis; p++) if (notenname(diaAusPosIn(s, p)) === ziel) kandidaten.push(p);
        erste = kandidaten.length ? waehle(kandidaten) : zufallsPos([von, bis]);
      } else {
        erste = zufallsPos([von, bis]);
      }
      zweite = erste + richtung * abstand;
    } while (zweite < von || zweite > bis || `${erste}/${zweite}` === letzteAufgabe);
    letzteAufgabe = `${erste}/${zweite}`;

    const d1 = diaAusPosIn(s, erste);
    const d2 = diaAusPosIn(s, zweite);
    const n1 = notenname(d1);
    const n2 = notenname(d2);
    const hinauf = zweite > erste;
    let warum;
    if (stufe === 'leicht') {
      warum = `Von ${n1} einen Schritt ${hinauf ? 'hinauf' : 'hinunter'}: ${n2}.`;
      if (n1 === 'h' && hinauf) warum += ' Nach dem h fängt die Reihe wieder mit c an.';
      if (n1 === 'c' && !hinauf) warum += ' Vor dem c kommt das h.';
    } else {
      warum = `Zähl von ${n1} ${hinauf ? 'hinauf' : 'hinunter'}: ${reihe(s, erste, zweite).join(', ')}. Die zweite Note ist ein ${n2}.`;
    }
    return {
      frage: `Die erste Note ist ein ${n1}. Wie heißt die zweite?`,
      bild: { abc: kopf({ schluessel: s }) + `x "^${n1}"${abcTon(d1)}2 ${abcTon(d2)}2 x |]`, breite: 180, scale: 1.8 },
      optionen: namensOptionen(),
      spalten: 4,
      loesung: n2,
      warum,
      pos: [erste, zweite], // für die Prüfung
      nachher: () => spieleFolge([{ midi: midi(d1), schlaege: 1 }, { midi: midi(d2), schlaege: 1.5 }], { tempo: 80 }),
    };
  },
};
