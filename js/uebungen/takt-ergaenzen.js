import { STIMMEN, diaAusPos, abcTon, waehle, mische } from '../musik.js';
import { kopf, laenge } from '../noten.js';
import { zufallsTakt, abcMelodie, melodiePositionen, diasAusPositionen, schlaegeText, gleicherTakt } from './hilfen.js';

const NAME = { 1: 'eine Viertel', 2: 'eine Halbe', 4: 'eine Ganze' };

function summe(takt) {
  return takt.reduce((s, n) => s + n.d, 0);
}

export default {
  id: 'takt-ergaenzen',
  titel: 'Takt ergänzen',
  themaId: 'schlag-takt',
  aufgaben: 8,
  stufen: {
    leicht: 'Die letzte Note fehlt, im 4/4- und 3/4-Takt, auch mit Pausen',
    schwer: 'Den richtig gefüllten Takt finden',
  },
  erklaerung: [
    'In jeden Takt gehören **genau so viele Schläge**, wie die Taktangabe sagt.',
    'Zähle, wie viele Schläge schon da sind. Der Rest fehlt noch.',
  ],
  neu(stufe, k) {
    const schluessel = STIMMEN[k.stimme].schluessel;
    // Stufen nach Inhalt (ENTSCHEIDUNGEN.md, 19.11.2026): Pausen und der 3/4-Takt gehören schon zur nötigen Station.
    const takt = waehle([4, 3]);

    if (stufe === 'schwer') {
      const richtig = zufallsTakt(takt, { pausen: Math.random() < 0.5 ? 1 : 0 });
      const falsche = [];
      let schutz = 0;
      while (falsche.length < 2 && schutz++ < 50) {
        const ziel = takt + waehle([-1, 1]);
        const f = zufallsTakt(ziel, { pausen: Math.random() < 0.4 ? 1 : 0 });
        if (!falsche.some((x) => gleicherTakt(x, f))) falsche.push(f);
      }
      const abcAus = (t) => {
        const dias = diasAusPositionen(k.stimme, melodiePositionen(t.filter((n) => !n.pause).length, { min: 2, max: 6 }));
        return kopf({ schluessel, takt: `${takt}/4` }) + abcMelodie([t], dias);
      };
      const optionen = mische([{ t: richtig, wert: 'r' }, ...falsche.map((t, i) => ({ t, wert: 'f' + i }))]).map((o) => ({
        abc: abcAus(o.t),
        wert: o.wert,
        breite: 190,
        scale: 1.25,
      }));
      return {
        frage: `Welcher Takt ist richtig gefüllt?`,
        optionen,
        spalten: 1,
        loesung: 'r',
        warum: `Im ${takt}/4-Takt gehören genau ${takt} Schläge in den Takt. Die anderen haben einen Schlag zu viel oder zu wenig.`,
      };
    }

    // Selten ist der ganze 4/4-Takt leer: Dann passt die Ganze.
    const fehlt = takt === 4 && Math.random() < 0.12 ? 4 : waehle([1, 2]);
    const vorhanden = fehlt === 4 ? [] : zufallsTakt(takt - fehlt, { pausen: Math.random() < 0.5 ? 1 : 0, halbeVersetzt: true });
    const tonAnzahl = vorhanden.filter((n) => !n.pause).length;
    const dias = tonAnzahl ? diasAusPositionen(k.stimme, melodiePositionen(tonAnzahl, { min: 2, max: 6 })) : [];
    const noten = vorhanden.length ? abcMelodie([vorhanden], dias).replace(/ \|\]$/, '') : '';
    const abc = kopf({ schluessel, takt: `${takt}/4` }) + `${noten} "^?"x${laenge(fehlt)} |]`;
    const mitte = abcTon(diaAusPos(k.stimme, 4));
    const optionen = [1, 2, 4].map((w) => ({
      abc: kopf({ schluessel }) + `x ${mitte}${laenge(w)} x |]`,
      wert: w,
      breite: 90,
      scale: 1.4,
      label: NAME[w].replace('eine ', ''),
    }));
    const schon = summe(vorhanden);
    return {
      frage: 'Welche Note macht den Takt voll?',
      bild: {
        abc,
        breite: 200,
        scale: 1.6,
        markiere: (el) => {
          const t = [...el.querySelectorAll('text')].find((x) => x.textContent === '?');
          if (t) t.classList.add('luecke');
        },
      },
      optionen,
      spalten: 3,
      loesung: fehlt,
      warum:
        `Im ${takt}/4-Takt gehören ${takt} Schläge in den Takt. ` +
        (schon === 0 ? 'Der Takt ist noch leer' : `Da ${schon === 1 ? 'ist' : 'sind'} schon ${schlaegeText(schon)}`) +
        `, es ${fehlt === 1 ? 'fehlt' : 'fehlen'} ${schlaegeText(fehlt)}: ${NAME[fehlt]}.`,
    };
  },
};
