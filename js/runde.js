// Eine Runde: mehrere Aufgaben hintereinander, Rückmeldung, Ergebnis.
import { h, icon, text, blatt, bestaetigen } from './ui.js';
import { zeichne } from './noten.js';
import { audio, stopAlles } from './klang.js';
import { UEBUNGEN } from './uebungen/index.js';
import { zustand, aendere, ergebnisErfassen, naechsteStation, stationSichtbar } from './speicher.js';
import { neueAbzeichen } from './abzeichen.js';
import { noetigeRichtige, STUFEN_NAME, thema, station, freiwilligeZu } from './lernweg.js';
import { medaille } from './medaille.js';

const LOB = ['Richtig.', 'Genau.', 'Stimmt.', 'Gut gemacht.'];

function waehleAus(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

// Erklärung einer Übung (für das Blatt und vor der ersten Runde)
export function erklaerungInhalt(u) {
  const k = { stimme: zustand().stimme || 'S' };
  const teile = [h('h2', { class: 'blatt-titel' }, u.titel)];
  u.erklaerung.forEach((absatz) => teile.push(h('p', { class: 'erklaerung' }, text(absatz))));
  const box = h('div', { class: 'erklaerung-beispiele' });
  teile.push(box);
  const inhalt = h('div', { class: 'erklaerung-inhalt' }, ...teile);
  const beispiele = u.beispiel ? [].concat(u.beispiel(k)) : [];
  // Erst zeichnen, wenn das Element im Dokument ist
  requestAnimationFrame(() =>
    beispiele.forEach((b) => {
      const karte = h('div', { class: 'noten-karte klein' });
      box.appendChild(karte);
      zeichne(karte, b.abc, { breite: b.breite || 220, scale: b.scale || 1.4, unten: 18 });
    })
  );
  return inhalt;
}

export function zeigeErklaerung(u) {
  blatt(h('div', { class: 'blatt-inhalt' }, erklaerungInhalt(u)));
}

// Auswahl-Aufgabe zeichnen
function auswahl(body, a, fertig) {
  let beantwortet = false;
  body.append(h('h2', { class: 'frage' }, a.frage));
  if (a.hinweis) body.append(h('p', { class: 'frage-hinweis' }, a.hinweis));
  if (a.bild) {
    const karte = h('div', { class: 'noten-karte' });
    body.append(karte);
    zeichne(karte, a.bild.abc, { breite: a.bild.breite, scale: a.bild.scale });
    if (a.bild.markiere) a.bild.markiere(karte);
  }
  // Ein Bild, das kein Notenbild ist, etwa eine Klaviatur (Etappe 5)
  if (a.bildEl) body.append(a.bildEl());
  let klangTimer = null;
  if (a.klang) {
    const knopf = h('button', { class: 'knopf zweit anhoeren', type: 'button' }, icon('anhoeren', 22), 'Anhören');
    knopf.addEventListener('click', () => {
      stopAlles();
      a.klang();
    });
    body.append(knopf);
    if (a.klangAuto) klangTimer = setTimeout(() => a.klang(), 350);
  }
  const raster = h('div', { class: `optionen spalten-${a.spalten || 2}` });
  body.append(raster);
  const knoepfe = a.optionen.map((o, i) => {
    const b = h('button', { class: o.abc ? 'option mit-bild' : 'option', type: 'button', 'aria-keyshortcuts': String(i + 1) });
    raster.append(b);
    if (o.abc) {
      const n = h('div', { class: 'option-noten' });
      b.append(n);
      zeichne(n, o.abc, { breite: o.breite || 120, scale: o.scale || 1.2 });
      b.setAttribute('aria-label', o.label || `Notenbild ${i + 1}`);
      if (o.label) b.append(h('span', { class: 'option-text' }, o.label));
    } else {
      b.append(h('span', { class: 'option-text' }, o.text));
    }
    b.addEventListener('click', () => waehle(b, o));
    return b;
  });

  function waehle(b, o) {
    if (beantwortet) return;
    beantwortet = true;
    const ok = o.wert === a.loesung;
    knoepfe.forEach((x) => x.setAttribute('aria-disabled', 'true'));
    raster.classList.add('beantwortet');
    b.classList.add(ok ? 'richtig' : 'falsch');
    if (!ok) {
      const i = a.optionen.findIndex((x) => x.wert === a.loesung);
      if (knoepfe[i]) knoepfe[i].classList.add('loesung');
    }
    if (a.nachher) {
      stopAlles();
      a.nachher();
    }
    fertig({ richtig: ok, text: ok ? a.nachherText || null : a.warum });
  }

  const taste = (e) => {
    if (beantwortet || e.altKey || e.ctrlKey || e.metaKey) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= knoepfe.length) {
      e.preventDefault();
      knoepfe[n - 1].click();
    }
  };
  document.addEventListener('keydown', taste);
  return () => {
    clearTimeout(klangTimer);
    document.removeEventListener('keydown', taste);
  };
}

// Plan der Aufgaben. Eine gemischte Runde nimmt ihre Aufgaben aus den nötigen Stationen der Etappe
// (paare: [{ uebung, stufe }], siehe mischungsPaare in lernweg.js), höchstens eine davon zum Tippen.
function plane(uebungIds, stufe, paare) {
  if (stufe !== 'gemischt') {
    const u = UEBUNGEN[uebungIds[0]];
    return Array.from({ length: u.aufgaben }, () => ({ u, stufe }));
  }
  const plan = [];
  let tippAufgaben = 0;
  while (plan.length < 8) {
    const p = waehleAus(paare);
    const u = UEBUNGEN[p.uebung];
    if (u.tippen && tippAufgaben >= 1) continue;
    if (u.tippen) tippAufgaben++;
    plan.push({ u, stufe: p.stufe });
  }
  return plan;
}

export function starteRunde(wurzel, opt) {
  const { titel, themaId, stationId = null, uebungen, paare = null, stufe, zurueck, weiter } = opt;
  const k = { stimme: zustand().stimme || 'S' };
  audio();
  const plan = plane(uebungen, stufe, paare);
  const anzahl = plan.length;
  let i = 0;
  let richtig = 0;
  let aufraeumen = null;
  let fussTaste = null;
  const ergebnisse = [];

  const punkte = h('div', { class: 'fortschritt', 'aria-label': `Aufgabe 1 von ${anzahl}` }, ...plan.map(() => h('span', { class: 'fp' })));
  const schliessen = h('button', { class: 'icon-knopf', type: 'button', 'aria-label': 'Runde beenden' }, icon('schliessen'));
  const hilfe = h('button', { class: 'icon-knopf', type: 'button', 'aria-label': 'Kurz erklärt' }, icon('hilfe'));
  const kopf = h('header', { class: 'runde-kopf' }, schliessen, punkte, hilfe);
  const ueber = h('p', { class: 'runde-titel' }, titel, h('span', { class: 'runde-stufe' }, STUFEN_NAME[stufe] || ''));
  const body = h('div', { class: 'runde-body' });
  const fuss = h('footer', { class: 'runde-fuss', hidden: true, 'aria-live': 'polite' });
  const seite = h('section', { class: 'runde' }, kopf, ueber, body, fuss);
  wurzel.replaceChildren(seite);

  schliessen.addEventListener('click', async () => {
    if (i > 0 && i < anzahl) {
      const ja = await bestaetigen('Runde beenden? Diese Runde wird nicht gezählt.', 'Beenden', 'Weiter üben');
      if (!ja) return;
    }
    aufraeumenAlles();
    zurueck();
  });
  hilfe.addEventListener('click', () => {
    const u = plan[Math.min(i, anzahl - 1)].u;
    zeigeErklaerung(u);
  });

  function aufraeumenAlles() {
    if (aufraeumen) aufraeumen();
    aufraeumen = null;
    if (fussTaste) document.removeEventListener('keydown', fussTaste);
    fussTaste = null;
    stopAlles();
  }

  function zeigeAufgabe() {
    aufraeumenAlles();
    body.replaceChildren();
    fuss.hidden = true;
    fuss.className = 'runde-fuss';
    punkte.setAttribute('aria-label', `Aufgabe ${i + 1} von ${anzahl}`);
    [...punkte.children].forEach((p, j) => p.classList.toggle('jetzt', j === i));
    const { u, stufe: s } = plan[i];
    if (stufe === 'gemischt') body.append(h('p', { class: 'aufgabe-art' }, u.titel));
    const a = u.neu(s, k);
    aufraeumen = a.eigene ? a.eigene(body, fertig) : auswahl(body, a, fertig);
    window.scrollTo({ top: 0 });
  }

  function fertig({ richtig: ok, text: t }) {
    ergebnisse.push(ok);
    if (ok) richtig++;
    punkte.children[i].classList.remove('jetzt');
    punkte.children[i].classList.add(ok ? 'gut' : 'schlecht');
    const knopf = h('button', { class: 'knopf haupt', type: 'button' }, i + 1 < anzahl ? 'Weiter' : 'Ergebnis');
    fuss.className = 'runde-fuss ' + (ok ? 'ist-richtig' : 'ist-falsch');
    fuss.replaceChildren(
      h('div', { class: 'fuss-text' }, h('strong', {}, ok ? waehleAus(LOB) : 'Nicht ganz.'), t ? h('span', {}, ' ', text(t)) : null),
      knopf
    );
    fuss.hidden = false;
    knopf.addEventListener('click', weiterZurNaechsten);
    fussTaste = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        weiterZurNaechsten();
      }
    };
    setTimeout(() => {
      if (fussTaste) document.addEventListener('keydown', fussTaste);
    }, 150);
    knopf.focus({ preventScroll: true });
    fuss.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function weiterZurNaechsten() {
    if (fussTaste) document.removeEventListener('keydown', fussTaste);
    fussTaste = null;
    i++;
    if (i < anzahl) zeigeAufgabe();
    else ende();
  }

  function ende() {
    aufraeumenAlles();
    const uebungId = stufe === 'gemischt' ? null : uebungen[0];
    const { geschafft, stationNeu } = ergebnisErfassen({ themaId, uebungId, stufe, stationId, richtig, gesamt: anzahl });
    const neu = neueAbzeichen();
    const naechste = naechsteStation();
    const noetig = noetigeRichtige(anzahl);
    const st = stationId ? station(stationId) : null;
    const freiwillig = !!(st && st.freiwillig);
    const neueFreiwillige = st && !freiwillig ? freiwilligeZu(st).filter((f) => stationSichtbar(f.id)) : [];
    let satz;
    if (stationNeu && freiwillig) satz = 'Die freiwillige Station ist geschafft.';
    else if (stationNeu) {
      satz = naechste ? 'Die Station ist geschafft. Die nächste ist jetzt offen.' : 'Die Station ist geschafft.';
      if (neueFreiwillige.length) satz += ' Wenn du magst, kannst du diese Übung jetzt auch schwerer üben: Tippe dazu auf dem Weg auf die Station.';
    } else if (geschafft) satz = richtig === anzahl ? 'Alles richtig.' : 'Die Runde ist geschafft.';
    else satz = `Ab ${noetig} richtigen ist die Runde geschafft. Versuch es gleich noch einmal.`;

    const knoepfe = [];
    if (stationId && stationNeu && !freiwillig && naechste && weiter) {
      knoepfe.push(h('button', { class: 'knopf haupt', type: 'button', onclick: () => weiter(naechste) }, 'Nächste Station'));
      knoepfe.push(h('button', { class: 'knopf zweit', type: 'button', onclick: () => starteRunde(wurzel, opt) }, 'Nochmal'));
    } else {
      knoepfe.push(h('button', { class: 'knopf haupt', type: 'button', onclick: () => starteRunde(wurzel, opt) }, 'Nochmal'));
    }
    knoepfe.push(h('button', { class: 'knopf text', type: 'button', onclick: zurueck }, stationId ? 'Zum Weg' : 'Zum Thema'));

    const abz = neu.length
      ? h(
          'div',
          { class: 'neue-abzeichen' },
          h('h3', {}, neu.length === 1 ? 'Neues Abzeichen' : 'Neue Abzeichen'),
          ...neu.map((a) => h('div', { class: 'abzeichen-neu' }, medaille(a, 52), h('div', {}, h('strong', {}, a.titel), h('span', {}, a.text))))
        )
      : null;

    seite.replaceChildren(
      h(
        'div',
        { class: 'ergebnis' + (geschafft ? ' geschafft' : '') },
        h('p', { class: 'runde-titel' }, titel),
        h('h1', { class: 'ergebnis-zahl' }, `${richtig} von ${anzahl}`),
        h('div', { class: 'ergebnis-punkte', 'aria-hidden': 'true' }, ...ergebnisse.map((ok) => h('span', { class: 'fp ' + (ok ? 'gut' : 'schlecht') }))),
        h('p', { class: 'ergebnis-satz' }, satz),
        abz,
        h('div', { class: 'knopfspalte' }, ...knoepfe)
      )
    );
    window.scrollTo({ top: 0 });
    seite.querySelector('.knopf.haupt').focus({ preventScroll: true });
  }

  // Vor der ersten Runde einer Übung: kurz erklären
  const erste = plan[0].u;
  if (stufe !== 'gemischt' && !zustand().gesehen[erste.id]) {
    aendere((s) => (s.gesehen[erste.id] = true));
    body.replaceChildren(
      erklaerungInhalt(erste),
      h('button', { class: 'knopf haupt breit', type: 'button', onclick: zeigeAufgabe }, 'Los geht’s')
    );
    body.querySelector('.knopf.haupt').focus({ preventScroll: true });
  } else {
    zeigeAufgabe();
  }

  return aufraeumenAlles;
}
