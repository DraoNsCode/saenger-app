// Einstieg und Navigation (Hash-Adressen, damit GitHub Pages ohne Server-Regeln reicht)
import { zustand, stationOffen } from './speicher.js';
import { station, thema, mischungsPaare } from './lernweg.js';
import { UEBUNGEN } from './uebungen/index.js';
import { setzeLautstaerke, stopAlles, klangFreischalten } from './klang.js';
import { icon } from './ui.js';
import { starteRunde } from './runde.js';
import { zeigeWeg } from './views/weg.js';
import { zeigeThemen, zeigeThema } from './views/themen.js';
import { zeigeAbzeichen } from './views/abzeichen.js';
import { zeigeUeben, seitenTitel } from './views/ueben.js';
import { zeigeEinstellungen, zeigeStart } from './views/einstellungen.js';

const inhalt = document.getElementById('inhalt');
let aufraeumen = null;

document.querySelectorAll('.reiter a').forEach((a) => a.prepend(icon(a.dataset.reiter, 26)));

setzeLautstaerke(zustand().einstellungen.lautstaerke);
klangFreischalten();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function reiterMarkieren(name) {
  document.querySelectorAll('.reiter a').forEach((a) => {
    if (a.dataset.reiter === name) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function seite(titel, reiter, inRunde = false) {
  document.title = titel ? `${titel} – Choristen-App` : 'Choristen-App';
  document.body.classList.toggle('in-runde', inRunde);
  reiterMarkieren(reiter);
}

function zeige() {
  if (aufraeumen) aufraeumen();
  aufraeumen = null;
  stopAlles();
  document.querySelectorAll('.blatt-huelle').forEach((b) => b.remove());

  const teile = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [name, a, b] = teile;

  if (!zustand().stimme) {
    seite('', '', true);
    zeigeStart(inhalt);
    return;
  }

  switch (name) {
    case undefined:
    case 'weg':
      seite('Weg', 'weg');
      zeigeWeg(inhalt);
      break;
    case 'themen':
      seite('Themen', 'themen');
      zeigeThemen(inhalt);
      break;
    case 'thema':
      seite(thema(a)?.titel || 'Thema', 'themen');
      zeigeThema(inhalt, a);
      break;
    case 'abzeichen':
      seite('Abzeichen', 'abzeichen');
      zeigeAbzeichen(inhalt);
      break;
    case 'ueben':
      seite(seitenTitel(a, b) || 'Üben', 'ueben');
      aufraeumen = zeigeUeben(inhalt, a, b) || null;
      break;
    case 'einstellungen':
      seite('Einstellungen', 'weg');
      zeigeEinstellungen(inhalt);
      break;
    case 'station': {
      const s = station(a);
      if (!s || !stationOffen(s.id)) {
        location.replace('#/weg');
        return;
      }
      seite(s.titel, 'weg', true);
      aufraeumen = starteRunde(inhalt, {
        titel: s.titel,
        themaId: s.themaId,
        stationId: s.id,
        uebungen: s.mischung ? [] : [s.uebung],
        paare: s.mischung ? mischungsPaare(thema(s.themaId)) : null,
        stufe: s.stufe,
        zurueck: () => (location.hash = '#/weg'),
        weiter: (n) => (location.hash = `#/station/${n.id}`),
      });
      break;
    }
    case 'frei': {
      const u = UEBUNGEN[a];
      if (!u || !u.stufen[b]) {
        location.replace('#/themen');
        return;
      }
      seite(u.titel, 'themen', true);
      aufraeumen = starteRunde(inhalt, {
        titel: u.titel,
        themaId: u.themaId,
        uebungen: [u.id],
        stufe: b,
        zurueck: () => (location.hash = `#/thema/${u.themaId}`),
      });
      break;
    }
    case 'mix': {
      const t = thema(a);
      if (!t || !t.stationen) {
        location.replace('#/themen');
        return;
      }
      seite(t.titel, 'themen', true);
      aufraeumen = starteRunde(inhalt, {
        titel: `Gemischt: ${t.titel}`,
        themaId: t.id,
        uebungen: [],
        paare: mischungsPaare(t),
        stufe: 'gemischt',
        zurueck: () => (location.hash = `#/thema/${t.id}`),
      });
      break;
    }
    default:
      location.replace('#/weg');
      return;
  }
  if (!document.body.classList.contains('in-runde')) window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', zeige);
zeige();
