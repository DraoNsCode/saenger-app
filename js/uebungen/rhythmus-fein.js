// Etappe 11, „Feinheiten im Rhythmus“: Synkopen, Triolen und Sechzehntel. Vorschlag von Claude vom 26.11.2026,
// umgesetzt, nicht entschieden (LERNWEG.md, „Stationen der Etappe 11“).
// Gezählt wird nur mit Schlägen und „und“; Triolen und Sechzehntel bekommen keine eigene Zählung
// (ENTSCHEIDUNGEN.md, „Sprache des Chors“).
import { STIMMEN, abcTon, waehle, gewichtet, mische } from '../musik.js';
import { kopf } from '../noten.js';
import { audio, spieleFolge, klicks } from '../klang.js';
import { abcAchtel, zaehlSilbe, silbenOptionen, zaehlWeise, melodiePositionen, diasAusPositionen } from './hilfen.js';

// Ein Takt mit Synkopen: Achtel – Viertel – Achtel über zwei Schläge, sonst Viertel und Achtelpaare
export function synkopenTakt(schlaege, anzahl = 1) {
  for (let versuch = 0; versuch < 200; versuch++) {
    const takt = [];
    let pos = 0;
    let synkopen = 0;
    while (pos < schlaege) {
      const rest = schlaege - pos;
      const moeglich = [['viertel', 2], ['paar', 2]];
      if (rest >= 2 && synkopen < anzahl) moeglich.push(['synkope', 5]);
      const art = gewichtet(moeglich);
      if (art === 'viertel') takt.push({ d: 1, pause: false });
      if (art === 'paar') takt.push({ d: 0.5, pause: false }, { d: 0.5, pause: false });
      if (art === 'synkope') {
        takt.push({ d: 0.5, pause: false }, { d: 1, pause: false, synkope: true }, { d: 0.5, pause: false });
        synkopen++;
      }
      pos += art === 'synkope' ? 2 : 1;
    }
    if (synkopen === anzahl) return takt;
  }
  throw new Error('Kein passender Takt gefunden');
}

let letzteSynkope = null;

export const synkope = {
  id: 'synkope',
  titel: 'Synkopen',
  themaId: 'rhythmus-fein',
  aufgaben: 8,
  stufen: {
    leicht: 'Eine Synkope im 4/4-Takt',
    schwer: 'Zwei Synkopen oder 3/4-Takt',
  },
  erklaerung: [
    'Bei einer **Synkope** beginnt ein längerer Ton nicht auf einem Schlag, sondern auf einem „und“ zwischen zwei Schlägen. Er klingt dann über den nächsten Schlag hinweg.',
    'Das häufigste Muster ist **Achtel – Viertel – Achtel**: Die Viertel beginnt auf dem „und“ und hält über den Schlag.',
    'Zähl gleichmäßig weiter „1 und 2 und …“, auch wenn auf dem Schlag kein neuer Ton kommt.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const schlaege = stufe === 'leicht' ? 4 : waehle([4, 3]);
    const takt = synkopenTakt(schlaege, stufe === 'schwer' && schlaege === 4 ? 2 : 1);
    let pos = 0;
    const info = takt.map((n, i) => {
      const x = { i, beginn: pos, n };
      pos += n.d;
      return x;
    });
    let ziel;
    do ziel = waehle(info.filter((x) => x.n.synkope));
    while (info.filter((x) => x.n.synkope).length > 1 && ziel.i === letzteSynkope);
    letzteSynkope = ziel.i;
    const dias = diasAusPositionen(k.stimme, melodiePositionen(takt.length, { min: 2, max: 6 }));
    const loesung = zaehlSilbe(ziel.beginn);
    return {
      frage: 'Auf welche Zählzeit fällt der Anfang der farbigen Note?',
      bild: {
        abc: kopf({ schluessel: s, takt: `${schlaege}/4` }) + abcAchtel([takt], (i) => abcTon(dias[i])),
        breite: 230,
        scale: 1.6,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note');
          if (alle[ziel.i]) alle[ziel.i].classList.add('markiert');
        },
      },
      optionen: silbenOptionen(schlaege),
      spalten: 2,
      loesung,
      warum: `Die farbige Note beginnt auf „${loesung}“ und klingt über den nächsten Schlag. So zählst du: ${zaehlWeise(takt)}.`,
      takt, // für die Prüfung
      ziel,
    };
  },
};

// Gruppen auf einem Schlag: Zahl der Töne → ABC (Grundeinheit Viertel)
export const GRUPPEN = {
  1: { abc: 'B', name: 'eine Viertel' },
  2: { abc: 'B/B/', name: 'zwei Achtel' },
  3: { abc: '(3B/B/B/', name: 'eine Triole' },
  4: { abc: 'B//B//B//B//', name: 'vier Sechzehntel' },
};

let letzteGruppe = null;

export const schlagGruppen = {
  id: 'schlag-gruppen',
  titel: 'Triolen und Sechzehntel',
  themaId: 'rhythmus-fein',
  aufgaben: 8,
  stufen: {
    leicht: 'Wie viele Töne kommen auf einen Schlag?',
    schwer: 'Wie viele Töne hörst du auf jedem Schlag?',
  },
  erklaerung: [
    'Ein Schlag kann in gleich lange Teile geteilt sein: **zwei Achtel**, **drei Töne einer Triole** oder **vier Sechzehntel**.',
    'Eine **Triole** erkennst du an der kleinen **3** über oder unter den Noten. Die drei Töne verteilen sich gleichmäßig auf einen Schlag.',
    '**Sechzehntel** haben zwei Balken. Vier davon dauern einen Schlag.',
    'Gezählt wird im Chor nur der Schlag und „und“. Triolen und Sechzehntel zählst du nicht einzeln, du spürst sie im Schlag.',
    'Bei einer Triole trifft das „und“ keinen Ton. Halte dich nur an den Schlag und verteile die drei Töne gleichmäßig.',
    'Beim Hören zeigen dir leise Klicks die Schläge. Zähl die Töne von einem Klick bis zum nächsten.',
  ],
  neu(stufe) {
    let zahl;
    do zahl = waehle(stufe === 'leicht' ? [1, 2, 3, 4, 3, 4] : [2, 3, 4]);
    while (zahl === letzteGruppe);
    letzteGruppe = zahl;
    if (stufe === 'leicht') {
      // Ein 4/4-Takt ohne Färbung: Die Gruppen selbst zu erkennen ist der Kern der Übung
      const schlag = waehle([0, 1, 2, 3]);
      const andere = () => waehle([1, 2, 3, 4].filter((x) => x !== zahl));
      const gruppen = [0, 1, 2, 3].map((b) => (b === schlag ? zahl : andere()));
      return {
        frage: `Wie viele Töne kommen auf Schlag ${schlag + 1}?`,
        hinweis: 'Jede Gruppe unter einem Balken ist ein Schlag, eine einzelne Viertel auch.',
        bild: {
          abc: kopf({ schluessel: 'perc', takt: '4/4' }) + gruppen.map((g) => GRUPPEN[g].abc).join(' ') + ' |]',
          breite: 260,
          scale: 1.5,
        },
        optionen: ['1', '2', '3', '4'].map((x) => ({ text: x, wert: x })),
        spalten: 4,
        loesung: String(zahl),
        warum: `Schlag ${schlag + 1} ist die ${['erste', 'zweite', 'dritte', 'vierte'][schlag]} Gruppe im Takt. Dort ${GRUPPEN[zahl].name.startsWith('ein') ? 'steht' : 'stehen'} ${GRUPPEN[zahl].name}: ${zahl === 1 ? 'ein Ton' : zahl + ' Töne'}.`,
        gruppen, // für die Prüfung
        schlag,
      };
    }
    // schwer: hören, mit Klick auf jedem Schlag
    const tempo = 66;
    const spiele = () => {
      const c = audio();
      const t0 = c.currentTime + 0.2;
      const sps = 60 / tempo;
      klicks(t0, tempo, 4, 4);
      klicks(t0 + 4 * sps, tempo, 4, 4, true);
      spieleFolge(Array.from({ length: 4 * zahl }, () => ({ midi: 67, schlaege: 1 / zahl })), { tempo, start: t0 + 4 * sps, art: 'orgel' });
    };
    return {
      frage: 'Wie viele Töne hörst du auf jedem Schlag?',
      hinweis: 'Die leisen Klicks sind die Schläge. Zähl die Töne von einem Klick bis zum nächsten.',
      klang: spiele,
      klangAuto: true,
      optionen: [
        { text: '2 (Achtel)', wert: '2' },
        { text: '3 (Triole)', wert: '3' },
        { text: '4 (Sechzehntel)', wert: '4' },
      ],
      spalten: 1,
      loesung: String(zahl),
      warum: `Auf jedem Schlag kamen ${zahl} Töne: ${GRUPPEN[zahl].name}.`,
    };
  },
};
