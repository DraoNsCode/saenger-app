// Gemeinsamer Ablauf für Übungen, bei denen man im Takt tippt.
import { h } from '../ui.js';
import { zeichne } from '../noten.js';
import { audio, klicks, stopAlles, zeitAusEreignis, sichtbarAb } from '../klang.js';

// Vergleicht getippte Zeiten mit den Zielzeiten.
// Ein gleichbleibender Versatz (z. B. durch Kopfhörer) wird herausgerechnet.
export function vergleiche(ziele, taps, toleranz) {
  const erstes = ziele[0];
  const letztes = ziele[ziele.length - 1];
  const relevant = taps.filter((t) => t >= erstes - 0.35 && t <= letztes + 0.6);
  const abw = relevant
    .map((t) => {
      let beste = Infinity;
      ziele.forEach((z) => {
        if (Math.abs(t - z) < Math.abs(beste)) beste = t - z;
      });
      return beste;
    })
    .filter((d) => Math.abs(d) < 0.3)
    .sort((a, b) => a - b);
  let versatz = abw.length >= 3 ? abw[Math.floor(abw.length / 2)] : 0;
  versatz = Math.max(-0.2, Math.min(0.2, versatz));
  const benutzt = new Set();
  const treffer = ziele.map((z) => {
    let bi = -1;
    let bd = Infinity;
    relevant.forEach((t, i) => {
      if (benutzt.has(i)) return;
      const d = Math.abs(t - versatz - z);
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    if (bi >= 0 && bd <= toleranz) {
      benutzt.add(bi);
      return true;
    }
    return false;
  });
  return { treffer, anzahl: treffer.filter(Boolean).length, extra: relevant.length - benutzt.size, versatz };
}

// cfg: { frage, hinweis, abc, breite, scale, tempo, takt, punkte (Anzahl Schlag-Punkte oder 0),
//        spiele(start) -> { ende, mitlesen: [{ zeit, index }] }, ziele(start) -> [Zeiten],
//        toleranz, bewerte(ergebnis) -> { richtig, text }, zeige(ergebnis, el), anhoeren() }
export function tippAufgabe(el, cfg, fertig) {
  const timer = [];
  let taps = [];
  let aktiv = false;

  const frage = h('h2', { class: 'frage' }, cfg.frage);
  const hinweis = cfg.hinweis ? h('p', { class: 'frage-hinweis' }, cfg.hinweis) : null;
  const karte = h('div', { class: 'noten-karte' });
  const punkte = cfg.punkte
    ? h('div', { class: 'schlag-punkte', 'aria-hidden': 'true' }, ...Array.from({ length: cfg.punkte }, () => h('span', { class: 'schlag-punkt' })))
    : null;
  const status = h('p', { class: 'tipp-status', 'aria-live': 'polite' }, 'Drück auf Start. Nach dem Einzählen tippst du mit.');
  const startKnopf = h('button', { class: 'knopf haupt breit' }, 'Start');
  const flaeche = h('button', { class: 'tipp-flaeche', disabled: true, 'aria-label': 'Tippen' }, h('span', {}, 'Hier tippen'), h('small', {}, 'oder Leertaste'));
  const nachherReihe = h('div', { class: 'knopfreihe nachher' });

  el.append(frage);
  if (hinweis) el.append(hinweis);
  el.append(karte);
  if (punkte) karte.after(punkte);
  el.append(status, startKnopf, flaeche, nachherReihe);
  zeichne(karte, cfg.abc, { breite: cfg.breite || 260, scale: cfg.scale || 1.5 });
  const notenEls = [...karte.querySelectorAll('.abcjs-note, .abcjs-rest')];

  const tippen = (ev) => {
    if (!aktiv) return;
    taps.push(zeitAusEreignis(ev));
    flaeche.classList.add('gedrueckt');
    timer.push(setTimeout(() => flaeche.classList.remove('gedrueckt'), 90));
  };
  flaeche.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    tippen(e);
  });
  const taste = (e) => {
    if ((e.code === 'Space' || e.key === ' ') && !e.repeat) {
      if (aktiv) {
        e.preventDefault();
        tippen(e);
      }
    }
  };
  document.addEventListener('keydown', taste);

  const um = (audioZeit, fn) => {
    const ms = Math.max(0, sichtbarAb(audioZeit) - performance.now());
    timer.push(setTimeout(fn, ms));
  };

  startKnopf.addEventListener('click', () => {
    const c = audio();
    startKnopf.hidden = true;
    flaeche.disabled = false;
    taps = [];
    aktiv = true;
    flaeche.focus({ preventScroll: true });
    const sps = 60 / cfg.tempo;
    const t0 = c.currentTime + 0.3;
    const ein = klicks(t0, cfg.tempo, cfg.takt, cfg.takt);
    ein.forEach((t, i) => um(t, () => (status.innerHTML = `<span class="zaehlen">${i + 1}</span>`)));
    const beginn = t0 + cfg.takt * sps;
    const { ende, mitlesen = [] } = cfg.spiele(beginn);
    const ziele = cfg.ziele(beginn);
    um(beginn, () => (status.textContent = 'Jetzt mittippen'));
    mitlesen.forEach(({ zeit, index, punkt }) =>
      um(zeit, () => {
        if (index != null) {
          karte.querySelectorAll('.klingt').forEach((x) => x.classList.remove('klingt'));
          if (notenEls[index]) notenEls[index].classList.add('klingt');
        }
        if (punkte && punkt != null) {
          punkte.querySelectorAll('.an').forEach((x) => x.classList.remove('an'));
          const p = punkte.children[punkt];
          if (p) p.classList.add('an');
        }
      })
    );
    um(ende + 0.35, () => {
      aktiv = false;
      flaeche.disabled = true;
      karte.querySelectorAll('.klingt').forEach((x) => x.classList.remove('klingt'));
      if (punkte) punkte.querySelectorAll('.an').forEach((x) => x.classList.remove('an'));
      const ergebnis = vergleiche(ziele, taps, cfg.toleranz);
      cfg.zeige(ergebnis, { karte, punkte, notenEls });
      const { richtig, text } = cfg.bewerte(ergebnis);
      status.textContent = '';
      if (cfg.anhoeren) {
        nachherReihe.append(
          h('button', { class: 'knopf zweit', onclick: () => cfg.anhoeren() }, 'Richtig anhören')
        );
      }
      fertig({ richtig, text });
    });
  });

  return () => {
    aktiv = false;
    timer.forEach(clearTimeout);
    document.removeEventListener('keydown', taste);
    stopAlles();
  };
}

// Zählt Treffer als Text
export function trefferText(e, wort) {
  const gesamt = e.treffer.length;
  let t = `${e.anzahl} von ${gesamt} ${wort} getroffen.`;
  if (e.extra > 0) t += e.extra === 1 ? ' Einmal zu viel getippt.' : ` ${e.extra}-mal zu viel getippt.`;
  return t;
}
