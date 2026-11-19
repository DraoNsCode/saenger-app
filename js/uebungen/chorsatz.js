import { abcTon, midi, waehle } from '../musik.js';
import { laenge } from '../noten.js';
import { spieleFolge } from '../klang.js';

// Vierstimmige Akkorde in C-Dur: [Sopran, Alt, Tenor, Bass] als diatonische Zahlen (c' = 28)
const A = {
  I_a: [32, 30, 28, 21], // g' e' c' c
  IV_a: [33, 31, 28, 17], // a' f' c' F
  V_a: [32, 29, 27, 18], // g' d' h G
  I_b: [37, 32, 28, 21], // e'' g' c' c
  V_b: [36, 32, 27, 18], // d'' g' h G
  vi_b: [35, 30, 28, 19], // c'' e' c' A
  IV_b: [35, 31, 26, 17], // c'' f' a F
  I_c: [35, 30, 25, 21], // c'' e' g c
  IV_c: [35, 31, 26, 17], // c'' f' a F
  V_c: [34, 29, 25, 18], // h' d' g G
};

// Wendungen: Akkorde und Dauern in Vierteln (Takt = 4)
// Nur eine Stufe (ENTSCHEIDUNGEN.md, 19.11.2026): Die Regel wird nicht schwerer, andere Stufen änderten nur das Bild.
const WENDUNGEN = {
  leicht: [
    [[['I_a', 1], ['IV_a', 1], ['V_a', 1], ['I_a', 1]]],
    [[['I_b', 1], ['V_b', 1], ['vi_b', 1], ['IV_b', 1]]],
    [[['I_c', 1], ['IV_c', 1], ['I_c', 1], ['V_c', 1]]],
  ],
};

const NAMEN = ['Sopran', 'Alt', 'Tenor', 'Bass'];
const WERTE = ['S', 'A', 'T', 'B'];
const WARUM = [
  'Oberes System, Notenhals nach oben: Das ist der Sopran.',
  'Oberes System, Notenhals nach unten: Das ist der Alt.',
  'Unteres System, Notenhals nach oben: Das ist der Tenor.',
  'Unteres System, Notenhals nach unten: Das ist der Bass.',
];

// Jeder Takt steht in einem eigenen System, wie in einem Chorbuch mit mehreren Zeilen
function satzAbc(takte) {
  const zeilen = [];
  takte.forEach((takt, ti) => {
    const ende = ti === takte.length - 1 ? ' |]' : ' |';
    ['S', 'A', 'T', 'B'].forEach((name, v) => {
      zeilen.push(`[V:${name}] ${takt.map(([akk, d]) => abcTon(A[akk][v]) + laenge(d)).join(' ')}${ende}`);
    });
  });
  return ['X:1', 'M:4/4', 'L:1/4', '%%score {(S A) | (T B)}', 'V:S clef=treble', 'V:A clef=treble', 'V:T clef=bass', 'V:B clef=bass', 'K:C', ...zeilen].join('\n');
}

export default {
  id: 'chorsatz',
  titel: 'Die Stimmen im Chorsatz',
  themaId: 'notenbild',
  aufgaben: 8,
  stufen: {
    leicht: 'Eine farbige Note der richtigen Stimme zuordnen',
  },
  erklaerung: [
    'Im Chorbuch stehen die vier Stimmen meist auf **zwei Systemen**, die eine Klammer verbindet.',
    'Oben im Violinschlüssel: **Sopran** mit dem Notenhals nach oben, **Alt** mit dem Notenhals nach unten.',
    'Unten im Bassschlüssel: **Tenor** mit dem Notenhals nach oben, **Bass** mit dem Notenhals nach unten.',
  ],
  beispiel() {
    return { abc: satzAbc([[['I_a', 1], ['IV_a', 1], ['V_a', 1], ['I_a', 1]]]), breite: 220 };
  },
  neu(stufe) {
    const takte = waehle(WENDUNGEN[stufe]);
    const stimme = Math.floor(Math.random() * 4);
    const anzahl = takte.reduce((s, t) => s + t.length, 0);
    const index = Math.floor(Math.random() * anzahl);
    const folge = takte.flat().map(([akk, d]) => ({ midi: midi(A[akk][stimme]), schlaege: d }));
    return {
      frage: 'Zu welcher Stimme gehört die farbige Note?',
      bild: {
        abc: satzAbc(takte),
        breite: 200,
        scale: 1.5,
        markiere: (el) => {
          const noten = el.querySelectorAll(`.abcjs-note.abcjs-v${stimme}`);
          if (noten[index]) noten[index].classList.add('markiert');
        },
      },
      optionen: NAMEN.map((n, i) => ({ text: n, wert: WERTE[i] })),
      spalten: 2,
      loesung: WERTE[stimme],
      warum: WARUM[stimme],
      nachher: () => spieleFolge(folge, { tempo: 88 }),
      nachherText: `Du hörst jetzt den ${NAMEN[stimme]}.`,
    };
  },
};
