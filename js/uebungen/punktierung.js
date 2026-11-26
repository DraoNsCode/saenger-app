// Etappe 8, „Punkt und Haltebogen“. Vorschlag von Claude vom 26.11.2026, umgesetzt, nicht entschieden (LERNWEG.md).
// leicht: nötige Station, wie lange klingt die farbige Note (punktiert oder gebunden)?
// schwer: freiwillig, auf welche Zählzeit fällt die Note danach?
import { STIMMEN, abcTon, gewichtet, waehle } from '../musik.js';
import { kopf } from '../noten.js';
import { punktTakt, abcAchtel, zaehlSilbe, silbenOptionen, zaehlWeise, melodiePositionen, diasAusPositionen } from './hilfen.js';

export function dauerText(d) {
  const ganz = Math.floor(d);
  const halb = d % 1 ? '½' : '';
  if (d === 0.5) return 'ein halber Schlag';
  if (d === 1) return '1 Schlag';
  return `${ganz}${halb} Schläge`;
}

export default {
  id: 'punktierung',
  titel: 'Punkt und Haltebogen',
  themaId: 'punktierung',
  aufgaben: 8,
  stufen: {
    leicht: 'Wie lange klingt die Note?',
    schwer: 'Auf welche Zählzeit fällt die Note danach?',
  },
  erklaerung: [
    'Ein **Punkt** hinter einer Note macht sie um die Hälfte länger. Im 4/4- und 3/4-Takt dauert eine Viertel 1 Schlag, eine punktierte Viertel 1½ Schläge und eine punktierte Halbe 3 Schläge.',
    'Nach einer punktierten Viertel kommt oft eine Achtel. Sie fällt auf das „und“.',
    'Ein **Haltebogen** verbindet zwei Noten mit demselben Ton. Du singst sie als einen langen Ton, ohne neu anzusetzen. Die Dauern werden zusammengezählt.',
  ],
  neu(stufe, k) {
    const s = STIMMEN[k.stimme].schluessel;
    const schlaege = waehle([4, 3]);
    const bogen = Math.random() < 0.4;
    const takt = punktTakt(schlaege, { bogen });
    // Gebundene Noten bekommen denselben Ton
    const tonAnzahl = takt.length;
    const pos = melodiePositionen(tonAnzahl, { min: 2, max: 6 });
    for (let i = 1; i < takt.length; i++) if (takt[i - 1].bogen) pos[i] = pos[i - 1];
    const dias = diasAusPositionen(k.stimme, pos);
    const abc = kopf({ schluessel: s, takt: `${schlaege}/4` }) + abcAchtel([takt], (i) => abcTon(dias[i]));
    let beginn = 0;
    const info = takt.map((n, i) => {
      const x = { i, beginn, n };
      beginn += n.d;
      return x;
    });
    let ziel;
    let loesung;
    let optionen;
    let warum;
    if (stufe === 'leicht') {
      // Ziel: punktierte Note oder der Anfang eines Haltebogens
      // Keine Note, zu der ein Haltebogen hinführt: Sie klingt nicht neu an
      const kandidaten = info.filter((x) => (x.n.d === 1.5 || x.n.d === 3 || x.n.bogen) && !(x.i > 0 && takt[x.i - 1].bogen)).map((x) => [x, 1]);
      ziel = gewichtet(kandidaten);
      const dauer = ziel.n.bogen ? ziel.n.d + takt[ziel.i + 1].d : ziel.n.d;
      loesung = dauerText(dauer);
      const moeglich = [1, 1.5, 2, 2.5, 3, 3.5].filter((d) => d !== dauer).sort((a, b) => Math.abs(a - dauer) - Math.abs(b - dauer)).slice(0, 3);
      optionen = [dauer, ...moeglich].sort((a, b) => a - b).map((d) => ({ text: dauerText(d), wert: dauerText(d) }));
      warum = ziel.n.bogen
        ? `Der Haltebogen verbindet zwei Noten: ${dauerText(ziel.n.d)} und ${dauerText(takt[ziel.i + 1].d)}. Zusammen klingt der Ton ${dauerText(dauer)} lang.`
        : ziel.n.d === 1.5
          ? 'Eine Viertel dauert hier 1 Schlag, der Punkt fügt die Hälfte dazu: 1½ Schläge.'
          : 'Eine Halbe dauert hier 2 Schläge, der Punkt fügt die Hälfte dazu: 3 Schläge.';
    } else {
      // Ziel: die Note nach einer punktierten oder gebundenen Note
      const kandidaten = info.filter((x) => x.i > 0 && !takt[x.i - 1].bogen && (takt[x.i - 1].d === 1.5 || (x.i > 1 && takt[x.i - 2].bogen))).map((x) => [x, 1]);
      ziel = kandidaten.length ? gewichtet(kandidaten) : info[info.length - 1];
      loesung = zaehlSilbe(ziel.beginn);
      optionen = silbenOptionen(schlaege);
      warum = `Die farbige Note beginnt auf „${loesung}“. So zählst du: ${zaehlWeise(takt)}.`;
    }
    return {
      frage: stufe === 'leicht' ? (ziel.n.bogen ? 'Wie lange klingt der Ton mit dem Haltebogen?' : 'Wie lange klingt die farbige Note?') : 'Auf welche Zählzeit fällt der Anfang der farbigen Note?',
      bild: {
        abc,
        breite: 240,
        scale: 1.6,
        markiere: (el) => {
          const alle = el.querySelectorAll('.abcjs-note');
          const nummern = ziel.n.bogen && stufe === 'leicht' ? [ziel.i, ziel.i + 1] : [ziel.i];
          nummern.forEach((j) => alle[j] && alle[j].classList.add('markiert'));
        },
      },
      optionen,
      spalten: 2,
      loesung,
      warum,
      takt, // für die Prüfung
      ziel,
    };
  },
};
