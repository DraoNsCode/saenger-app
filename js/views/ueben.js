// Übe-Teil: nicht als Spiel gedacht, sondern als Hilfe beim eigenen Üben (ENTSCHEIDUNGEN.md, 15.11.2026).
// Zwei Bereiche: „Besser singen“ (Stimmbildung) und „Chorlieder üben“. Inhalte: js/ueben/stimmbildung.js.
// Aufbau der Seiten: Claudes Wahl (Daniel, 27.11.2026: „Setze jetzt alles so um, wie du es für am sinnvollsten hältst“).
import { h, icon } from '../ui.js';
import { zustand, aendere } from '../speicher.js';
import { zeichne, notenElemente, entmarkiere } from '../noten.js';
import { sichtbarAb, stopAlles } from '../klang.js';
import { THEMEN, UEBUNGEN, ERKLAERUNGEN, ABLAEUFE } from '../ueben/stimmbildung.js';
import { starte, abcFuerStimme, visuelleVerschiebung } from '../ueben/spieler.js';
import { zeigeLieder } from './lieder.js';

const TONARTEN = ['C', 'Des', 'D', 'Es', 'E', 'F', 'Fis', 'G', 'As', 'A', 'B', 'H'];
const uebung = (id) => UEBUNGEN.find((u) => u.id === id);

export function zeigeUeben(wurzel, teil, id) {
  if (teil === 'singen') return zeigeSingen(wurzel);
  if (teil === 'uebung' && uebung(id)) return zeigeUebung(wurzel, uebung(id));
  if (teil === 'erklaerung' && ERKLAERUNGEN.find((e) => e.id === id)) return zeigeErklaerung(wurzel, ERKLAERUNGEN.find((e) => e.id === id));
  if (teil === 'ablauf' && ABLAEUFE.find((a) => a.id === id)) return zeigeAblauf(wurzel, ABLAEUFE.find((a) => a.id === id));
  if (teil === 'lieder') return zeigeLieder(wurzel, id);
  return zeigeUebersicht(wurzel);
}

export function seitenTitel(teil, id) {
  if (teil === 'singen') return 'Besser singen';
  if (teil === 'uebung') return uebung(id)?.titel;
  if (teil === 'erklaerung') return ERKLAERUNGEN.find((e) => e.id === id)?.titel;
  if (teil === 'ablauf') return ABLAEUFE.find((a) => a.id === id)?.titel;
  if (teil === 'lieder') return 'Chorlieder üben';
  return 'Üben';
}

function kopf(titel, unterzeile, zurueck) {
  return [
    zurueck ? h('a', { class: 'zurueck-link', href: zurueck[0] }, icon('zurueck', 20), zurueck[1]) : null,
    h('header', { class: 'seiten-kopf' + (zurueck ? ' mit-zurueck' : '') }, h('div', {}, h('h1', {}, titel), unterzeile ? h('p', { class: 'unterzeile' }, unterzeile) : null)),
  ];
}

function zeigeUebersicht(wurzel) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      ...kopf('Üben', 'Hilfe beim eigenen Üben, ohne Punkte und Runden.'),
      h(
        'ul',
        { class: 'ueben-liste' },
        h(
          'li',
          {},
          h(
            'a',
            { class: 'ueben-karte karte-link', href: '#/ueben/singen' },
            h('h2', {}, 'Besser singen'),
            h('p', {}, 'Übungen zum Mitmachen, mit Begleitung aus der App, und kurze Erklärungen. Sie ersetzen keinen Gesangslehrer, helfen aber beim Üben zu Hause.')
          )
        ),
        h(
          'li',
          {},
          h(
            'a',
            { class: 'ueben-karte karte-link', href: '#/ueben/lieder' },
            h('h2', {}, 'Chorlieder üben'),
            h('p', {}, 'Die Noten der Lieder aus unserem Repertoire ansehen. Dafür brauchst du ein Konto.')
          )
        )
      )
    )
  );
}

function zeigeSingen(wurzel) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      ...kopf('Besser singen', 'Übungen zum Mitmachen und kurze Erklärungen.', ['#/ueben', 'Üben']),
      h(
        'div',
        { class: 'ablauf-knoepfe' },
        ...ABLAEUFE.map((a) =>
          h('a', { class: 'ablauf-karte', href: `#/ueben/ablauf/${a.id}` }, h('strong', {}, a.titel), h('span', {}, a.kurz.split('.')[0] + '.'))
        )
      ),
      ...THEMEN.map((t) =>
        h(
          'div',
          { class: 'sb-thema' },
          h('h2', { class: 'abschnitt-titel' }, t.titel),
          h(
            'ul',
            { class: 'sb-liste' },
            ...UEBUNGEN.filter((u) => u.thema === t.id).map((u) =>
              h('li', {}, h('a', { class: 'sb-eintrag', href: `#/ueben/uebung/${u.id}` }, h('span', { class: 'sb-titel' }, u.titel), h('span', { class: 'sb-wozu' }, u.wozu)))
            )
          )
        )
      ),
      h('h2', { class: 'abschnitt-titel' }, 'Erklärungen'),
      h(
        'ul',
        { class: 'sb-liste' },
        ...ERKLAERUNGEN.map((e) =>
          h('li', {}, h('a', { class: 'sb-eintrag', href: `#/ueben/erklaerung/${e.id}` }, h('span', { class: 'sb-titel' }, e.titel), h('span', { class: 'sb-wozu' }, e.kurz)))
        )
      )
    )
  );
}

// Inhalt einer Übung mit Begleitung. variante: Index oder null. Gibt { el, aufraeumen } zurück.
// beiDurchgang(anzahlGesungen, fertig) meldet, wie viele Durchgänge mitgesungen wurden (für die Abläufe).
function uebungsInhalt(u, { variante = null, mitVarianten = true, beiDurchgang = () => {}, beiWahl = () => {} } = {}) {
  const stimme = zustand().stimme;
  const v = variante != null ? u.varianten[variante] : null;
  const b = v?.begleitung || u.begleitung;
  const abc = v?.abc || (v?.begleitung && !v.abc ? null : u.abc);
  let spieler = null;
  let tempoFaktor = 1;
  let gesungen = 0;
  const merker = [];

  const notenFeld = h('div', { class: 'sb-noten' });
  const status = h('p', { class: 'sb-status', 'aria-live': 'polite' });
  const startKnopf = h('button', { class: 'knopf haupt', type: 'button' }, 'Start');
  const umkehrKnopf = h('button', { class: 'knopf zweit', type: 'button', hidden: true }, 'Nicht höher');
  const tempoAnzeige = h('span', { class: 'sb-tempo-wert' });
  const langsamer = h('button', { class: 'knopf zweit klein', type: 'button', 'aria-label': 'Langsamer' }, '−');
  const schneller = h('button', { class: 'knopf zweit klein', type: 'button', 'aria-label': 'Schneller' }, '+');

  const zeigeNoten = (verschiebung = 0) => {
    if (!abc) return [];
    zeichne(notenFeld, abcFuerStimme(abc, stimme, b.art), { breite: 300, scale: 1.4, transponieren: visuelleVerschiebung(stimme, b.art, verschiebung) });
    return notenElemente(notenFeld, 0);
  };
  let elemente = zeigeNoten(0);

  const tempo = () => Math.round((b.tempo || 72) * tempoFaktor);
  const zeigeTempo = () => (tempoAnzeige.textContent = `Tempo ${tempo()}`);
  zeigeTempo();
  langsamer.onclick = () => {
    tempoFaktor = Math.max(0.6, +(tempoFaktor - 0.1).toFixed(2));
    zeigeTempo();
  };
  schneller.onclick = () => {
    tempoFaktor = Math.min(1.5, +(tempoFaktor + 0.1).toFixed(2));
    zeigeTempo();
  };

  const aufhoeren = (text = '') => {
    if (spieler) spieler.stopp();
    spieler = null;
    stopAlles();
    merker.forEach(clearTimeout);
    merker.length = 0;
    entmarkiere(notenFeld, 'markiert');
    startKnopf.textContent = 'Start';
    startKnopf.classList.replace('zweit', 'haupt');
    umkehrKnopf.hidden = true;
    langsamer.disabled = schneller.disabled = false;
    status.textContent = text;
  };

  startKnopf.onclick = () => {
    if (spieler) return aufhoeren('Gestoppt.');
    gesungen = 0;
    startKnopf.textContent = 'Stopp';
    startKnopf.classList.replace('haupt', 'zweit');
    langsamer.disabled = schneller.disabled = true;
    spieler = starte(b, {
      abc,
      stimme,
      tempoFaktor,
      melde: (e) => {
        if (e.art === 'durchgang') {
          if (b.art === 'klicks') status.textContent = 'Läuft. Mit „Stopp“ hörst du auf.';
          else if (b.art === 'anfangston') status.textContent = e.gesamt > 1 ? `Anfangston ${e.nr + 1} von ${e.gesamt}` : 'Hör den Ton und beginne.';
          else if (e.zuhoeren) status.textContent = 'Zuhören';
          else if (b.art === 'ton') status.textContent = `Mitsingen · Ton ${TONARTEN[(((e.verschiebung + 5) % 12) + 12) % 12].toLowerCase()}`;
          else status.textContent = `Mitsingen · Tonart ${TONARTEN[((e.verschiebung % 12) + 12) % 12]}`;
          if (!e.zuhoeren) gesungen++;
          if (abc && b.art !== 'klicks') elemente = zeigeNoten(e.verschiebung);
          umkehrKnopf.hidden = !(spieler && spieler.kannUmkehren);
          beiDurchgang(gesungen, false);
        } else if (e.art === 'note') {
          const el = elemente[e.index];
          if (!el) return;
          const ab = Math.max(0, sichtbarAb(e.zeit) - performance.now());
          merker.push(
            setTimeout(() => {
              entmarkiere(notenFeld, 'markiert');
              el.classList.add('markiert');
            }, ab)
          );
        } else if (e.art === 'ende') {
          aufhoeren('Fertig.');
          beiDurchgang(gesungen, true);
        }
      },
    });
    umkehrKnopf.hidden = !spieler.kannUmkehren;
  };
  umkehrKnopf.onclick = () => {
    if (spieler) spieler.nichtHoeher();
    umkehrKnopf.hidden = true;
  };

  const teile = [];
  teile.push(h('p', { class: 'sb-wozu-gross' }, u.wozu));
  if (mitVarianten && u.varianten?.length) {
    teile.push(
      h(
        'div',
        { class: 'sb-varianten', role: 'tablist', 'aria-label': 'Varianten' },
        h('button', { type: 'button', role: 'tab', class: 'chip' + (variante == null ? ' an' : ''), 'aria-selected': variante == null ? 'true' : 'false', onclick: () => beiWahl(null) }, 'Grundübung'),
        ...u.varianten.map((x, i) =>
          h('button', { type: 'button', role: 'tab', class: 'chip' + (variante === i ? ' an' : ''), 'aria-selected': variante === i ? 'true' : 'false', onclick: () => beiWahl(i) }, x.name)
        )
      )
    );
  }
  if (v) teile.push(h('div', { class: 'sb-variante-text' }, h('strong', {}, v.name + ': '), v.text));
  if (u.schritte?.length) teile.push(h('h2', { class: 'sb-abschnitt' }, 'So geht’s'), h('ol', { class: 'sb-schritte' }, ...u.schritte.map((s) => h('li', {}, s))));
  if (abc) teile.push(notenFeld);
  if (b.art !== 'keine') {
    teile.push(
      h(
        'div',
        { class: 'sb-steuerung' },
        h('div', { class: 'sb-knoepfe' }, startKnopf, umkehrKnopf),
        b.art === 'anfangston' ? null : h('div', { class: 'sb-tempo' }, langsamer, tempoAnzeige, schneller),
        status
      )
    );
  }
  const box = (klasse, titel, inhalt) => h('div', { class: 'sb-box ' + klasse }, h('strong', {}, titel), ' ', inhalt);
  if (u.gelingt) teile.push(box('gelingt', 'Gelingt, wenn', u.gelingt));
  if (u.fehler) teile.push(h('div', { class: 'sb-box fehler' }, h('strong', {}, 'Typischer Fehler: '), u.fehler, h('br'), h('strong', {}, 'Was hilft: '), u.hilft));
  if (u.achtung) teile.push(box('achtung', 'Achtung:', u.achtung));
  if (u.tipp) teile.push(box('tipp', 'Tipp:', u.tipp));

  return { el: h('div', { class: 'sb-uebung' }, ...teile), aufraeumen: () => aufhoeren() };
}

function zeigeUebung(wurzel, u) {
  let aufraeumen = null;
  const zeichneSeite = (variante) => {
    if (aufraeumen) aufraeumen();
    const inhalt = uebungsInhalt(u, { variante, beiWahl: (i) => zeichneSeite(i) });
    aufraeumen = inhalt.aufraeumen;
    const erkl = ERKLAERUNGEN.filter((e) => e.passtZu?.includes(u.id));
    wurzel.replaceChildren(
      h(
        'section',
        { class: 'seite' },
        ...kopf(u.titel, null, ['#/ueben/singen', 'Besser singen']),
        inhalt.el,
        erkl.length
          ? h('div', { class: 'sb-mehr' }, h('h2', { class: 'sb-abschnitt' }, 'Zum Lesen'), ...erkl.map((e) => h('a', { class: 'sb-link', href: `#/ueben/erklaerung/${e.id}` }, e.titel)))
          : null
      )
    );
  };
  zeichneSeite(null);
  return () => aufraeumen && aufraeumen();
}

function zeigeErklaerung(wurzel, e) {
  wurzel.replaceChildren(
    h(
      'section',
      { class: 'seite' },
      ...kopf(e.titel, null, ['#/ueben/singen', 'Besser singen']),
      h('p', { class: 'sb-kurz' }, e.kurz),
      ...e.absaetze.map((a) => h('p', { class: 'sb-absatz' }, a)),
      e.passtZu?.length
        ? h('div', { class: 'sb-mehr' }, h('h2', { class: 'sb-abschnitt' }, 'Dazu üben'), ...e.passtZu.map((id) => h('a', { class: 'sb-link', href: `#/ueben/uebung/${id}` }, uebung(id).titel)))
        : null
    )
  );
}

// Welche Übung ein Ablauf in diesem Durchgang wählt: reihum, ohne Strohhalm, wenn keiner da ist
export function ablaufAuswahl(a, nummer, strohhalm) {
  return a.schritte
    .map((s) => {
      const moegliche = s.wahl.filter((w) => !w.strohhalm || strohhalm);
      if (!moegliche.length) return null;
      return { name: s.name, ...moegliche[nummer % moegliche.length] };
    })
    .filter(Boolean);
}

function zeigeAblauf(wurzel, a) {
  const z = zustand();
  const nummer = z.ueben?.ablauf?.[a.id] || 0;
  aendere((s) => {
    s.ueben = s.ueben || { ablauf: {} };
    s.ueben.ablauf[a.id] = nummer + 1;
  });
  const schritte = ablaufAuswahl(a, nummer, !!z.einstellungen.strohhalm);
  let aufraeumen = null;

  const zeigeSchritt = (i) => {
    if (aufraeumen) aufraeumen();
    if (i >= schritte.length) {
      wurzel.replaceChildren(
        h(
          'section',
          { class: 'seite' },
          ...kopf(a.titel, 'Geschafft.', ['#/ueben/singen', 'Besser singen']),
          a.schluss ? h('p', { class: 'sb-kurz' }, a.schluss) : null,
          h('a', { class: 'knopf haupt', href: '#/ueben/singen' }, 'Zurück zu „Besser singen“')
        )
      );
      window.scrollTo({ top: 0 });
      return;
    }
    const s = schritte[i];
    const u = uebung(s.uebung);
    const v = s.variante != null ? u.varianten[s.variante] : null;
    const b = v?.begleitung || u.begleitung;
    const ohneDurchgaenge = b.art === 'keine' || b.art === 'klicks' || b.art === 'anfangston';
    const weiterKnopf = h('button', { class: 'knopf haupt breit', type: 'button', disabled: !ohneDurchgaenge }, i === schritte.length - 1 ? 'Fertig' : 'Weiter');
    const hinweis = h('p', { class: 'sb-status' }, ohneDurchgaenge ? '' : '„Weiter“ geht nach zwei Durchgängen.');
    const inhalt = uebungsInhalt(u, {
      variante: s.variante ?? null,
      mitVarianten: false,
      beiDurchgang: (n, fertig) => {
        if (n >= 2 || fertig) {
          weiterKnopf.disabled = false;
          hinweis.textContent = '';
        }
      },
    });
    aufraeumen = inhalt.aufraeumen;
    weiterKnopf.onclick = () => zeigeSchritt(i + 1);
    wurzel.replaceChildren(
      h(
        'section',
        { class: 'seite' },
        h('a', { class: 'zurueck-link', href: '#/ueben/singen' }, icon('zurueck', 20), 'Abbrechen'),
        h('p', { class: 'ablauf-schritt' }, `${a.titel} · Schritt ${i + 1} von ${schritte.length}: ${s.name}`),
        h('header', { class: 'seiten-kopf mit-zurueck' }, h('div', {}, h('h1', {}, v ? `${u.titel}: ${v.name}` : u.titel))),
        inhalt.el,
        h('div', { class: 'ablauf-weiter' }, hinweis, weiterKnopf)
      )
    );
    window.scrollTo({ top: 0 });
  };
  zeigeSchritt(0);
  return () => aufraeumen && aufraeumen();
}
