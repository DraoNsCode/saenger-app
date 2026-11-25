// Rechnet aus den Kacheln in probe/bilder/garten/ einen ganzen Stil: node probe/werkzeug/stilbilder.mjs [aquarell weich buntstift feder]
//
// Ergebnis in probe/bilder/stile/<stil>/: dieselben SVG-Dateien (NAMEN) mit denselben Ebenen und Zuständen,
// aber Boden und Bauteile sind vorab gerechnete Bilder (WebP). So bleiben Schalter, Zustände und Tausch unverändert,
// und das Handy muss keine Filter rechnen. Bewegtes (Wasserlinien, Ring, Nebel) bleibt Vektor.
// Braucht Chrome, Chromium oder Edge, keine Pakete. Anderer Pfad: Umgebungsvariable CHROME_PATH.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const QUELLE = path.join(HIER, '..', 'bilder', 'garten');
const ZIEL = path.join(HIER, '..', 'bilder', 'stile');
const NAMEN = ['teile', 'anfang', 'bereich-1', 'platzhalter', 'bereich-1-zusammen', 'platzhalter-boden'];
const ALLE_STILE = ['aquarell', 'weich', 'buntstift', 'feder'];
const stile = process.argv.slice(2).length ? process.argv.slice(2) : ALLE_STILE;

// ---------- Code, der in der Seite läuft ----------

function seitenCode() {
  const NS = 'http://www.w3.org/2000/svg';
  const neu = (tag, a = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(a)) e.setAttribute(k, v);
    return e;
  };
  const lies = (t) => document.importNode(new DOMParser().parseFromString(t, 'image/svg+xml').documentElement, true);
  const SCHATTEN = 'rgb(38, 48, 90)';
  const S = {};
  window.S = S;
  const BLATT = 'path,rect,ellipse,circle,polygon,line';

  // ---- Filter und Muster der Stile ----
  const DEFS = `
<filter id="f-verzug" filterUnits="userSpaceOnUse" x="-130" y="-200" width="710" height="1600"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.6"/></filter>
<filter id="f-lasur" filterUnits="userSpaceOnUse" x="-130" y="-200" width="710" height="1600" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.6" result="d"/>
 <feMorphology in="d" operator="erode" radius=".7" result="i"/><feGaussianBlur in="i" stdDeviation="1.2" result="ib"/><feComposite in="d" in2="ib" operator="out" result="rand"/>
 <feTurbulence type="fractalNoise" baseFrequency=".03 .04" numOctaves="3" seed="21" result="w"/><feColorMatrix in="w" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.9 1.95" result="wa"/><feComposite in="d" in2="wa" operator="in" result="f1"/>
 <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="k"/><feColorMatrix in="k" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.3 1.5" result="ka"/><feComposite in="f1" in2="ka" operator="in" result="f2"/>
 <feComponentTransfer in="d" result="zart"><feFuncA type="linear" slope=".78"/></feComponentTransfer><feComponentTransfer in="rand" result="rz"><feFuncA type="linear" slope=".7"/></feComponentTransfer>
 <feMerge><feMergeNode in="zart"/><feMergeNode in="f2"/><feMergeNode in="rz"/></feMerge></filter>
<filter id="f-lasurgross" filterUnits="userSpaceOnUse" x="-60" y="-60" width="520" height="1500" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="4" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16" result="d"/>
 <feMorphology in="d" operator="erode" radius="1.6" result="i"/><feGaussianBlur in="i" stdDeviation="2.2" result="ib"/><feComposite in="d" in2="ib" operator="out" result="rand"/>
 <feTurbulence type="fractalNoise" baseFrequency=".012 .016" numOctaves="4" seed="31" result="w"/><feColorMatrix in="w" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.6 1.9" result="wa"/><feComposite in="d" in2="wa" operator="in" result="f1"/>
 <feComponentTransfer in="d" result="zart"><feFuncA type="linear" slope=".62"/></feComponentTransfer><feComponentTransfer in="rand" result="rz"><feFuncA type="linear" slope=".4"/></feComponentTransfer>
 <feMerge><feMergeNode in="zart"/><feMergeNode in="f1"/><feMergeNode in="rz"/></feMerge></filter>
<filter id="f-tusche" filterUnits="userSpaceOnUse" x="-130" y="-200" width="710" height="1600" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -.4 -.4 -.4 1.16 0" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="12" result="n"/><feDisplacementMap in="a" in2="n" scale="2.6"/></filter>
<filter id="f-kreide" filterUnits="userSpaceOnUse" x="-130" y="-200" width="710" height="1600" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -.45 -.45 -.45 1.25 0" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="a" in2="n" scale="2.4" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="9" result="k"/><feColorMatrix in="k" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -3 2.5" result="ka"/><feComposite in="d" in2="ka" operator="in"/></filter>
<filter id="f-stift" filterUnits="userSpaceOnUse" x="-1600" y="-1600" width="3600" height="3600" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".5 .03" numOctaves="3" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 2.5 -.6" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<filter id="f-papier" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".045 .05" numOctaves="5" seed="3" result="t"/><feDiffuseLighting in="t" surfaceScale=".95" lighting-color="#fffaf0"><feDistantLight azimuth="235" elevation="63"/></feDiffuseLighting></filter>
<filter id="f-korn" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .42 0 0 0 0 .36 0 0 0 0 .28 0 0 0 .5 -.18"/></filter>
<filter id="f-relief" x="-.35" y="-.35" width="1.7" height="1.7" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b"/><feDiffuseLighting in="b" surfaceScale="2" diffuseConstant="1.2" lighting-color="#fff" result="l"><feDistantLight azimuth="232" elevation="56"/></feDiffuseLighting><feComponentTransfer in="l" result="h"><feFuncR type="linear" slope=".62" intercept=".4"/><feFuncG type="linear" slope=".6" intercept=".42"/><feFuncB type="linear" slope=".52" intercept=".5"/></feComponentTransfer><feComposite in="h" in2="SourceAlpha" operator="in" result="li"/><feBlend in="SourceGraphic" in2="li" mode="multiply" result="m"/><feSpecularLighting in="b" surfaceScale="2" specularConstant=".34" specularExponent="14" lighting-color="#fffbe8" result="s"><feDistantLight azimuth="232" elevation="46"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="si"/><feComposite in="m" in2="si" operator="arithmetic" k2="1" k3=".4"/><feComposite in2="SourceAlpha" operator="in"/></filter>
<filter id="f-relief-klein" x="-.35" y="-.35" width="1.7" height="1.7" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="b"/><feDiffuseLighting in="b" surfaceScale="0.95" diffuseConstant="1.2" lighting-color="#fff" result="l"><feDistantLight azimuth="232" elevation="56"/></feDiffuseLighting><feComponentTransfer in="l" result="h"><feFuncR type="linear" slope=".62" intercept=".4"/><feFuncG type="linear" slope=".6" intercept=".42"/><feFuncB type="linear" slope=".52" intercept=".5"/></feComponentTransfer><feComposite in="h" in2="SourceAlpha" operator="in" result="li"/><feBlend in="SourceGraphic" in2="li" mode="multiply" result="m"/><feSpecularLighting in="b" surfaceScale="0.95" specularConstant=".34" specularExponent="14" lighting-color="#fffbe8" result="s"><feDistantLight azimuth="232" elevation="46"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="si"/><feComposite in="m" in2="si" operator="arithmetic" k2="1" k3=".4"/><feComposite in2="SourceAlpha" operator="in"/></filter>
<filter id="f-innen" filterUnits="userSpaceOnUse" x="-60" y="-100" width="520" height="1800" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="inv"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer><feGaussianBlur in="inv" stdDeviation="4" result="ib"/><feOffset in="ib" dx="5" dy="7" result="o"/><feFlood flood-color="#16324a" flood-opacity=".55"/><feComposite in2="o" operator="in" result="f"/><feComposite in="f" in2="SourceAlpha" operator="in" result="fi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="fi"/></feMerge></filter>
<filter id="f-weg" filterUnits="userSpaceOnUse" x="-60" y="-100" width="520" height="1800" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/><feDiffuseLighting in="b" surfaceScale="3.4" diffuseConstant="1.2" lighting-color="#fff" result="l"><feDistantLight azimuth="232" elevation="56"/></feDiffuseLighting><feComponentTransfer in="l" result="h"><feFuncR type="linear" slope=".5" intercept=".5"/><feFuncG type="linear" slope=".5" intercept=".5"/><feFuncB type="linear" slope=".44" intercept=".56"/></feComponentTransfer><feComposite in="h" in2="SourceAlpha" operator="in" result="li"/><feBlend in="SourceGraphic" in2="li" mode="multiply"/><feComposite in2="SourceAlpha" operator="in"/></filter>
<filter id="f-boden" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".035 .05" numOctaves="4" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .20 0 0 0 0 .27 0 0 0 0 .10 .9 0 0 0 -.34"/></filter>
<filter id="f-schatten" x="-.5" y="-.5" width="2" height="2"><feGaussianBlur stdDeviation="2.6"/></filter>
<pattern id="m-schraff" width="2.7" height="2.7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><path d="M0,0L0,2.7" stroke="#2b2119" stroke-width=".75"/></pattern>`;

  const TINTE = { aquarell: '#4a3a30', feder: '#2b2119' };
  const PAPIER = { aquarell: '#fbf4e3', feder: '#f6ecd4', buntstift: '#fbf6ea' };
  // Palette je Stil: nur wo der Ton zum Stil passen muss
  const FARBEN = {
    aquarell: { '#a9bf79': '#b4c684', '#8fa75f': '#8ea666', '#bccf8d': '#cdd79b', '#e9d8b2': '#f0dcae', '#c9b182': '#d6b67c', '#84b8c8': '#8fbccb', '#c06c47': '#c9754f' },
    weich: { '#a9bf79': '#a6c26c', '#8fa75f': '#86a552', '#bccf8d': '#bdd488', '#e9d8b2': '#edd9ad', '#84b8c8': '#79b9d0' },
    buntstift: { '#a9bf79': '#9cbb62', '#8fa75f': '#7f9f4e', '#bccf8d': '#b6cd7d', '#e9d8b2': '#ecd29c', '#84b8c8': '#6fb0c8' },
    feder: { '#a9bf79': '#d6d9a8', '#8fa75f': '#a9b377', '#bccf8d': '#e3e2b9', '#c4c58e': '#e0dcb2', '#e9d8b2': '#f1e1b8', '#c9b182': '#d3ba86', '#84b8c8': '#a9ccd2' },
  };

  S.laden = (texte, stil) => {
    const um = (t) => t.replace(/#[0-9a-f]{6}/g, (f) => FARBEN[stil][f] || f);
    document.body.style.margin = '0';
    document.body.replaceChildren();
    S.teile = lies(um(texte.teile));
    S.teile.setAttribute('style', 'position:absolute;left:-9999px;width:960px');
    document.body.append(S.teile);
    S.kacheln = {};
    for (const n of Object.keys(texte).filter((x) => x !== 'teile')) {
      S.kacheln[n] = lies(um(texte[n]));
      S.kacheln[n].setAttribute('style', 'position:absolute;left:-9999px;width:400px');
      document.body.append(S.kacheln[n]);
    }
    S.buehne = neu('svg', { id: 'buehne', style: 'position:absolute;left:0;top:0;overflow:hidden' });
    document.body.append(S.buehne);
    S.stil = stil;
  };

  // Verweise auf Bauteile durch ihren Inhalt ersetzen
  function loese(el) {
    for (const u of [...el.querySelectorAll('use')]) {
      const quelle = S.teile.querySelector('#' + CSS.escape(u.getAttribute('href').slice(1)));
      const g = neu('g');
      if (u.getAttribute('transform')) g.setAttribute('transform', u.getAttribute('transform'));
      g.append(...[...quelle.cloneNode(true).childNodes]);
      loese(g);
      u.replaceWith(g);
    }
    return el;
  }

  const bild = (e) => {
    const c = getComputedStyle(e);
    const fuell = c.fill !== 'none' && !(e.tagName === 'line');
    return { fuell, strich: c.stroke !== 'none', w: parseFloat(c.strokeWidth) || 0, verlauf: c.fill.startsWith('url'), schatten: c.fill === SCHATTEN && parseFloat(c.fillOpacity) < 0.6, boden: e.tagName === 'ellipse', farbe: c.fill, strichFarbe: c.stroke };
  };
  const hex = (rgb) => {
    const m = rgb.match(/[\d.]+/g);
    return m ? '#' + m.slice(0, 3).map((v) => (+v | 0).toString(16).padStart(2, '0')).join('') : '#000000';
  };

  // Kopie einer Gruppe, Blatt für Blatt bearbeitet; mess = Original in der Seite (für berechnete Werte)
  function kopie(orig, fn) {
    const k = orig.cloneNode(true);
    const a = [...orig.querySelectorAll(BLATT)], b = [...k.querySelectorAll(BLATT)];
    a.forEach((o, i) => {
      if (o.closest('clipPath')) return;
      fn(b[i], bild(o), o);
    });
    k.querySelectorAll('[filter]').forEach((e) => e.removeAttribute('filter'));
    return k;
  }
  const weg = (e) => e.remove();
  const setze = (e, a) => Object.entries(a).forEach(([x, v]) => e.setAttribute(x, v));
  let maske = 0;

  const bodenSchatten = (orig, filter) => {
    const k = kopie(orig, (e, b) => { if (!(b.schatten && b.boden)) weg(e); });
    if (filter) k.setAttribute('filter', 'url(#f-schatten)');
    return k;
  };
  const grundierung = (orig, papier) =>
    kopie(orig, (e, b) => {
      if (b.schatten || b.verlauf) return weg(e);
      if (b.fuell) setze(e, { fill: papier, 'fill-opacity': 1, ...(b.strich ? { stroke: papier, 'stroke-opacity': 1 } : {}) });
      else if (b.strich && b.w > 2.6) setze(e, { stroke: papier, 'stroke-opacity': 1, 'stroke-dasharray': 'none' });
      else weg(e);
    });
  const farbe = (orig, zart = 1) =>
    kopie(orig, (e, b) => {
      if (b.schatten && b.boden) return weg(e);
      if (b.fuell) {
        e.setAttribute('stroke', 'none');
        if (zart < 1 && !b.schatten) e.setAttribute('fill-opacity', String(zart));
      } else if (b.strich && b.w <= 2 && b.w > 0 && !hellerStrich(b)) weg(e);
    });
  // Farbige dünne Linien (Gräser, Adern, Glanz) bleiben Farbe, nur dunkle werden Tusche
  const hellerStrich = (b) => {
    const m = b.strichFarbe.match(/[\d.]+/g);
    return m && +m[0] + +m[1] + +m[2] > 228;
  };
  const tusche = (orig, tinte, schraffur, faktor = 0.85) =>
    kopie(orig, (e, b, o) => {
      if (b.schatten || b.verlauf) return weg(e);
      if (b.fuell) {
        const stein = !b.strich && o.tagName === 'rect' && o.getAttribute('rx');
        if (!b.strich && !stein) {
          const box = o.getBBox();
          return Math.min(box.width, box.height) > 14 ? setze(e, { fill: '#fff', 'fill-opacity': 1 }) : weg(e);
        }
        const winzig = !stein && Math.min(o.getBBox().width, o.getBBox().height) < 5.2;
        setze(e, { fill: '#fff', 'fill-opacity': 1, stroke: tinte, 'stroke-opacity': stein ? 0.55 : winzig ? 0.4 : 1, 'stroke-width': stein ? 0.7 : winzig ? 0.5 : Math.max(0.75, Math.min(1.35, b.w * faktor)) });
        if (schraffur) {
          const box = o.getBBox();
          const kurz = Math.min(box.width, box.height);
          if (kurz > 7) {
            const k = Math.max(1.8, Math.min(9, kurz * 0.27));
            const id = 'mk' + maske++;
            const m = neu('mask', { id, maskUnits: 'userSpaceOnUse', x: box.x - 9, y: box.y - 9, width: box.width + 18, height: box.height + 18 });
            const a = o.cloneNode(false), z = o.cloneNode(false);
            setze(a, { fill: '#fff', stroke: 'none', 'fill-opacity': 1 });
            setze(z, { fill: '#000', stroke: 'none', 'fill-opacity': 1 });
            const v = neu('g', { transform: `translate(${-k} ${-k * 0.85})` });
            v.append(z);
            m.append(a, v);
            // die Maske liegt im selben Koordinatensystem wie das Blatt
            const flaeche = neu('rect', { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8, fill: 'url(#m-schraff)', mask: `url(#${id})` });
            if (o.getAttribute('transform')) {
              a.removeAttribute('transform');
              z.removeAttribute('transform');
              const t = neu('g', { transform: o.getAttribute('transform') });
              t.append(m, flaeche);
              e.after(t);
            } else e.after(m, flaeche);
          }
        }
        return;
      }
      if (b.w > 20) {
        const haupt = /rgb\((240, 220, 174|241, 225, 184|143, 188, 203|79, 139, 161)\)/.test(b.strichFarbe);
        const innen = e.cloneNode(true);
        setze(e, { stroke: haupt ? tinte : '#fff', 'stroke-opacity': 1 });
        setze(innen, { stroke: '#fff', 'stroke-width': Math.max(1, b.w - 2.4), 'stroke-opacity': 1 });
        e.after(innen);
      } else if (b.w > 2.6) {
        const innen = e.cloneNode(true);
        setze(e, { stroke: tinte, 'stroke-opacity': 1 });
        setze(innen, { stroke: '#fff', 'stroke-width': Math.max(0.6, b.w - 1.5), 'stroke-opacity': 1 });
        e.after(innen);
      } else if (hellerStrich(b)) weg(e);
      else setze(e, { stroke: tinte, 'stroke-opacity': 0.8, 'stroke-width': Math.max(0.6, Math.min(1.1, b.w * 0.8)) });
    });

  const filtern = (el, id) => {
    const g = neu('g', { filter: `url(#${id})` });
    g.append(el);
    return g;
  };
  // Stiftstriche laufen schräg: Filter in gedrehtem System
  const strichelung = (el, w, deck) => {
    const a = neu('g', { transform: `rotate(${w})`, opacity: deck }), f = neu('g', { filter: 'url(#f-stift)' }), z = neu('g', { transform: `rotate(${-w})` });
    z.append(el);
    f.append(z);
    a.append(f);
    return a;
  };

  function stilTeil(orig) {
    const g = neu('g');
    if (S.stil === 'aquarell') g.append(bodenSchatten(orig, true), filtern(grundierung(orig, PAPIER.aquarell), 'f-verzug'), filtern(farbe(orig), 'f-lasur'), filtern(tusche(orig, TINTE.aquarell, false), 'f-tusche'));
    if (S.stil === 'feder') {
      const f = filtern(farbe(orig, 0.62), 'f-lasur');
      f.setAttribute('transform', 'translate(.9 .7)');
      g.append(bodenSchatten(orig, false), filtern(grundierung(orig, PAPIER.feder), 'f-verzug'), f, filtern(tusche(orig, TINTE.feder, true, 0.8), 'f-tusche'));
    }
    if (S.stil === 'buntstift') {
      const kontur = kopie(orig, (e, b) => {
        if (b.schatten) return weg(e);
        if (b.fuell) return b.strich ? setze(e, { fill: '#fff', 'fill-opacity': 1, 'stroke-width': Math.max(1, b.w * 1.15) }) : weg(e);
      });
      g.append(bodenSchatten(orig, true), filtern(grundierung(orig, PAPIER.buntstift), 'f-verzug'), farbeMit(orig, 0.66), strichelung(farbe(orig), -36, 0.9), strichelung(farbe(orig), 28, 0.5), filtern(kontur, 'f-kreide'));
    }
    if (S.stil === 'weich') {
      g.append(bodenSchatten(orig, true), flach(orig, weichRegel));
    }
    return g;
  }
  function farbeMit(orig, deck) {
    const k = farbe(orig);
    k.setAttribute('opacity', deck);
    return k;
  }
  // Formen einzeln und ohne gedrehte Gruppen nebeneinander legen: Der Lichtfilter rechnet sonst im gedrehten System,
  // und jedes Blütenblatt hätte seine eigene Lichtrichtung. Beschnittenes (Torbogen) bleibt, wie es ist.
  function flach(orig, regel) {
    const g = neu('g');
    const zurueck = orig.getCTM().inverse();
    for (const o of orig.querySelectorAll(BLATT)) {
      if (o.closest('clipPath,mask')) continue;
      const b = bild(o);
      const r = regel(b, o);
      if (r === false) continue;
      const e = o.cloneNode(false);
      const c = getComputedStyle(o);
      setze(e, { fill: c.fill, stroke: c.stroke, 'fill-opacity': c.fillOpacity, 'stroke-opacity': c.strokeOpacity, 'stroke-width': c.strokeWidth });
      if (r.attribute) setze(e, r.attribute);
      const m = zurueck.multiply(o.getCTM());
      e.setAttribute('transform', `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`);
      const schnitt = o.parentElement.closest('g[clip-path]');
      const halter = neu('g');
      halter.append(e);
      if (r.filter) halter.setAttribute('filter', `url(#${r.filter})`);
      if (schnitt && orig.contains(schnitt)) {
        const sm = zurueck.multiply(schnitt.getCTM());
        const inv = sm.inverse();
        const aussen = neu('g', { transform: `matrix(${sm.a} ${sm.b} ${sm.c} ${sm.d} ${sm.e} ${sm.f})`, 'clip-path': schnitt.getAttribute('clip-path') });
        const innen = neu('g', { transform: `matrix(${inv.a} ${inv.b} ${inv.c} ${inv.d} ${inv.e} ${inv.f})` });
        innen.append(halter);
        aussen.append(innen);
        g.append(aussen);
      } else g.append(halter);
    }
    for (const c of orig.querySelectorAll('clipPath')) g.prepend(c.cloneNode(true));
    return g;
  }
  const weichRegel = (b, o) => {
    if (b.schatten && b.boden) return false;
    if (b.verlauf) return {};
    if (b.fuell && !b.schatten) {
      const r = o.getBoundingClientRect();
      const kurz = Math.min(r.width, r.height);
      return { filter: kurz > 10 ? 'f-relief' : kurz > 3.4 ? 'f-relief-klein' : null, attribute: b.strich ? { 'stroke-opacity': 0.3, 'stroke-width': Math.min(1, b.w) } : null };
    }
    return { attribute: !b.fuell && b.w <= 3 ? { 'stroke-opacity': 0.6 } : null };
  };

  function stilBoden(orig, h) {
    const g = neu('g');
    const teil = (k) => orig.querySelector('.' + k);
    const grund = teil('g-grund'), bach = teil('g-bach'), wegE = teil('g-weg'), sch = teil('g-schatten');
    const flaeche = (f, a = {}) => neu('rect', { x: -20, y: -20, width: 440, height: h + 40, fill: f, ...a });
    const schatten = sch.cloneNode(true);
    schatten.setAttribute('filter', 'url(#f-schatten)');
    if (S.stil === 'weich') {
      const gr = grund.cloneNode(true);
      // Wasser eingesunken, Weg leicht gewölbt, Steine rund
      const b = flach(bach, (x, o) => (x.fuell && x.strich ? weichRegel(x, o) : x.schatten ? {} : { filter: !x.fuell && x.w > 20 && /rgb\(121/.test(x.strichFarbe) ? 'f-innen' : null }));
      const w = flach(wegE, (x, o) => (x.fuell && x.strich ? weichRegel(x, o) : { filter: !x.fuell && x.w > 45 && x.w < 60 ? 'f-weg' : null }));
      g.append(gr, flaeche('#000', { filter: 'url(#f-boden)', opacity: 0.5 }), b, w, schatten);
      return g;
    }
    const papier = PAPIER[S.stil];
    g.append(flaeche(papier));
    if (S.stil === 'aquarell' || S.stil === 'feder') {
      const zart = S.stil === 'feder' ? 0.8 : 1;
      const flecken = kopie(grund, (e, b) => { if (!b.fuell || b.w > 0.5 && b.strich) weg(e); else if (e.getAttribute('fill-opacity') === '.2') e.setAttribute('fill-opacity', '.5'); });
      const wash = filtern(flecken, 'f-lasurgross');
      wash.setAttribute('opacity', zart);
      g.append(wash);
      const halme = kopie(grund, (e, b) => { if (b.fuell) weg(e); });
      g.append(filtern(halme, 'f-verzug'));
      for (const t of [bach, wegE]) {
        const f = filtern(farbe(t), 'f-lasur');
        if (S.stil === 'feder') f.setAttribute('opacity', '.8');
        g.append(filtern(grundierung(t, papier), 'f-verzug'), f, filtern(tusche(t, TINTE[S.stil], S.stil === 'feder', 0.8), 'f-tusche'));
      }
      const s2 = filtern(sch.cloneNode(true), 'f-lasur');
      s2.setAttribute('opacity', '.8');
      g.append(s2, flaeche('#fff', { filter: 'url(#f-papier)', style: 'mix-blend-mode:multiply', opacity: 0.75 }));
      return g;
    }
    // Buntstift
    const halme = kopie(grund, (e, b) => { if (b.fuell) weg(e); });
    const flecken = () => kopie(grund, (e, b) => { if (!b.fuell) weg(e); });
    const fl = flecken();
    fl.setAttribute('opacity', '.66');
    g.append(fl, strichelung(flecken(), -36, 0.8), strichelung(flecken(), 34, 0.45), filtern(halme, 'f-kreide'));
    for (const t of [bach, wegE]) {
      const kontur = kopie(t, (e, b) => { if (b.schatten) return weg(e); if (b.fuell) return b.strich ? setze(e, { fill: '#fff' }) : weg(e); if (b.w > 20) setze(e, { stroke: '#fff' }); });
      g.append(filtern(grundierung(t, papier), 'f-verzug'), farbeMit(t, 0.66), strichelung(farbe(t), -36, 0.85), strichelung(farbe(t), 30, 0.45), filtern(kontur, 'f-kreide'));
    }
    g.append(strichelung(sch.cloneNode(true), -36, 0.95), flaeche('#fff', { filter: 'url(#f-korn)', opacity: 0.4 }));
    return g;
  }

  // Kacheln mit aufblühendem Boden (wandel.py): der Boden wird einmal ganz trocken und einmal ganz grün gerechnet
  function landWahl(orig, land) {
    const zonen = orig.querySelector('.g-zonen'), wegbrach = orig.querySelector('.g-wegbrach');
    if (!zonen) return;
    zonen.querySelectorAll('defs,.g-saum').forEach((e) => e.remove());
    const [von, nach, bei] = land === 'gruen' ? [zonen, orig.querySelector('.g-grund'), 'gruen'] : [wegbrach, orig.querySelector('.g-weg'), 'brach'];
    // das Grün deckt alles, die dürren Halme darunter sollen nicht durchscheinen
    if (land === 'gruen') nach.replaceChildren();
    von.querySelectorAll(`[data-bei="${bei}"]`).forEach((e) => {
      const g = neu('g');
      g.append(...e.childNodes);
      nach.append(g);
    });
    zonen.remove();
    wegbrach.remove();
  }

  // ---- Aufträge: jeder liefert einen Bildausschnitt ----
  S.auftraege = () => {
    const liste = [];
    for (const g of S.teile.querySelectorAll('[id^="t-"]')) if (g.tagName === 'g') liste.push({ art: 'teil', id: g.id });
    for (const n of Object.keys(S.kacheln)) {
      if (S.kacheln[n].querySelector('.g-zonen')) liste.push({ art: 'boden', kachel: n, land: 'brach' }, { art: 'boden', kachel: n, land: 'gruen' });
      else liste.push({ art: 'boden', kachel: n });
      // Laufende Stücke ohne Verweise (Mauer, Tor, Pflöcke ...) bekommen eigene Bilder
      let nr = 0;
      const nurVerweise = (el) => el.tagName === 'use' || (el.tagName === 'g' && !el.matches('[data-teil],[data-bei]') && el.children.length && [...el.children].every(nurVerweise));
      const enthaeltDaten = (el) => el.matches?.('[data-teil],[data-bei],.g-figur') || !!el.querySelector?.('[data-teil],[data-bei],.g-figur');
      const gehe = (eltern) => {
        let lauf = [];
        const abschliessen = () => {
          if (!lauf.length) return;
          const id = `${n}-s${++nr}`;
          lauf.forEach((e) => e.setAttribute('data-lauf', id));
          liste.push({ art: 'lauf', kachel: n, id });
          lauf = [];
        };
        for (const k of [...eltern.children]) {
          if (nurVerweise(k)) abschliessen();
          else if (enthaeltDaten(k) || (k.tagName === 'g' && k.querySelector('use') && !k.querySelector(BLATT))) {
            abschliessen();
            gehe(k);
          } else lauf.push(k);
        }
        abschliessen();
      };
      for (const e of S.kacheln[n].querySelectorAll('.g-stehend,.g-vorn')) gehe(e);
    }
    return liste;
  };

  S.zeige = (a, mass) => {
    const b = S.buehne;
    b.replaceChildren();
    const defs = neu('defs');
    defs.innerHTML = DEFS;
    b.append(defs);
    const mess = neu('g', { opacity: 0 });
    b.append(mess);
    b.setAttribute('viewBox', '0 0 400 400');
    b.setAttribute('width', 400);
    b.setAttribute('height', 400);
    let box, inhalt;
    if (a.art === 'boden') {
      const svg = S.kacheln[a.kachel];
      const h = svg.viewBox.baseVal.height;
      const orig = loese(svg.querySelector('g[clip-path]').cloneNode(true));
      orig.removeAttribute('clip-path');
      orig.querySelectorAll('.g-fliesst').forEach((e) => e.remove());
      landWahl(orig, a.land);
      mess.append(orig);
      box = { x: 0, y: -0.5, w: 400, h: h + 1 };
      inhalt = stilBoden(orig, h);
    } else {
      const orig = neu('g');
      if (a.art === 'teil') orig.append(...[...S.teile.querySelector('#' + CSS.escape(a.id)).cloneNode(true).childNodes]);
      else S.kacheln[a.kachel].querySelectorAll(`[data-lauf="${a.id}"]`).forEach((e) => orig.append(e.cloneNode(true)));
      loese(orig);
      orig.querySelectorAll('.g-halo,.g-tropfen,.g-funkeln').forEach((e) => e.remove());
      orig.querySelectorAll('[display="none"]').forEach((e) => e.removeAttribute('display'));
      mess.append(orig);
      const r = orig.getBBox();
      const rand = 9;
      box = { x: Math.floor(r.x - rand), y: Math.floor(r.y - rand), w: Math.ceil(r.width + 2 * rand), h: Math.ceil(r.height + 2 * rand) };
      // Mauern reichen über den Kachelrand hinaus, dort wird nichts gebraucht
      if (a.art === 'lauf' && box.w > 300) { const x0 = Math.max(box.x, -4); box.w = Math.min(box.x + box.w, 404) - x0; box.x = x0; }
      inhalt = stilTeil(orig);
    }
    mess.remove();
    b.append(inhalt);
    b.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    const pw = Math.round(box.w * mass), ph = Math.round(box.h * mass);
    b.setAttribute('width', pw);
    b.setAttribute('height', ph);
    return { box, pw, ph };
  };

  // ---- Fertige Dateien ----
  S.ersetze = (ergebnisse, ordner) => {
    const img = (e) => neu('image', { href: `${ordner}/${e.datei}`, x: e.box.x, y: e.box.y, width: e.box.w, height: e.box.h });
    const ausgabe = {};
    // Musterbogen: bewegte Bauteile bleiben Vektor
    for (const e of ergebnisse.filter((x) => x.art === 'teil')) {
      const g = S.teile.querySelector('#' + CSS.escape(e.id));
      const klasse = e.id.startsWith('t-falter') ? 'g-flattern' : null;
      const i = img(e);
      if (klasse) i.setAttribute('class', klasse);
      const bewegt = [...g.querySelectorAll('.g-halo,.g-tropfen,.g-funkeln')];
      g.replaceChildren(i, ...bewegt);
    }
    const ohneStil = (svg) => {
      svg.removeAttribute('style');
      return svg.outerHTML;
    };
    ausgabe.teile = ohneStil(S.teile);
    for (const [n, svg] of Object.entries(S.kacheln)) {
      const boden = svg.querySelector('g[clip-path]');
      const fl = [...boden.querySelectorAll('.g-fliesst')];
      const tr = fl[0]?.closest('[transform]')?.getAttribute('transform') || '';
      const g = neu('g', { class: 'g-bach', transform: tr });
      g.append(...fl);
      const boeden = ergebnisse.filter((x) => x.art === 'boden' && x.kachel === n);
      const umrisse = boden.querySelector('.g-zonen > defs');
      if (umrisse) {
        // trocken ganz, darüber das grüne Bild je Zone ausgeschnitten
        const zonen = [...umrisse.children].map((c) => {
          const bild = img(boeden.find((x) => x.land === 'gruen'));
          bild.setAttribute('clip-path', `url(#${c.id})`);
          const bei = neu('g', { 'data-bei': 'gruen' });
          bei.append(bild);
          const z = neu('g', { 'data-teil': c.id.replace(/^.*?(zone-\d+)$/, '$1'), 'data-zustand': 'gruen' });
          z.append(bei);
          return z;
        });
        boden.replaceChildren(umrisse, img(boeden.find((x) => x.land === 'brach')), ...zonen, g);
      } else boden.replaceChildren(img(boeden[0]), g);
      for (const e of ergebnisse.filter((x) => x.art === 'lauf' && x.kachel === n)) {
        const stuecke = [...svg.querySelectorAll(`[data-lauf="${e.id}"]`)];
        stuecke[0].before(img(e));
        stuecke.forEach((s) => s.remove());
      }
      ausgabe[n] = ohneStil(svg);
    }
    return ausgabe;
  };
}

// ---------- Chrome steuern ----------

const browser = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/google/chrome/chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!browser) throw new Error('Kein Chrome, Chromium oder Edge gefunden. Pfad mit CHROME_PATH angeben.');
const profil = await mkdtemp(path.join(os.tmpdir(), 'stil-'));
const prozess = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profil}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const ws = await new Promise((ok, nein) => {
  let t = '';
  prozess.stderr.on('data', (d) => { t += d; const m = t.match(/ws:\/\/[^\s]+/); if (m) ok(m[0]); });
  setTimeout(() => nein(new Error('Chrome startet nicht')), 20000);
});
const ziele = await (await fetch(`http://127.0.0.1:${new URL(ws).port}/json`)).json();
const sock = new WebSocket(ziele.find((z) => z.type === 'page').webSocketDebuggerUrl);
await new Promise((ok) => (sock.onopen = ok));
let nr = 0;
const offen = new Map();
sock.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id) { offen.get(m.id)?.(m); offen.delete(m.id); }
};
const ruf = (method, params = {}) => new Promise((ok, nein) => { const id = ++nr; offen.set(id, (m) => (m.error ? nein(new Error(`${method}: ${m.error.message}`)) : ok(m.result))); sock.send(JSON.stringify({ id, method, params })); });
const rechne = async (ausdruck) => {
  const r = await ruf('Runtime.evaluate', { expression: ausdruck, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

await ruf('Page.enable');
await ruf('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
const texte = Object.fromEntries(await Promise.all(NAMEN.map(async (n) => [n, await readFile(path.join(QUELLE, `${n}.svg`), 'utf8')])));

for (const stil of stile) {
  const ordner = path.join(ZIEL, stil);
  await rm(ordner, { recursive: true, force: true });
  await mkdir(ordner, { recursive: true });
  await rechne(`(${seitenCode.toString()})()`);
  await rechne(`S.laden(${JSON.stringify(texte)}, ${JSON.stringify(stil)})`);
  const auftraege = await rechne('S.auftraege()');
  const ergebnisse = [];
  let bytes = 0;
  for (const a of auftraege) {
    const mass = a.art === 'boden' ? 2.25 : 3;
    const { box, pw, ph } = await rechne(`S.zeige(${JSON.stringify(a)}, ${mass})`);
    await ruf('Emulation.setDeviceMetricsOverride', { width: Math.max(pw, 10), height: Math.max(ph, 10), deviceScaleFactor: 1, mobile: false });
    await rechne('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(1))))');
    const { data } = await ruf('Page.captureScreenshot', { format: 'webp', quality: a.art === 'boden' ? 78 : 84, clip: { x: 0, y: 0, width: pw, height: ph, scale: 1 }, captureBeyondViewport: true });
    const datei = `${(a.art === 'boden' ? `boden-${a.kachel}${a.land ? `-${a.land}` : ''}` : a.id).replace(/^t-/, '')}.webp`;
    const inhalt = Buffer.from(data, 'base64');
    bytes += inhalt.length;
    await writeFile(path.join(ordner, datei), inhalt);
    ergebnisse.push({ ...a, box, datei });
  }
  const fertig = await rechne(`S.ersetze(${JSON.stringify(ergebnisse)}, ${JSON.stringify(`bilder/stile/${stil}`)})`);
  for (const [n, t] of Object.entries(fertig)) await writeFile(path.join(ordner, `${n}.svg`), t);
  console.log(`${stil}: ${ergebnisse.length} Bilder, ${Math.round(bytes / 1024)} KB`);
}
sock.close();
prozess.kill();
setTimeout(async () => {
  await rm(profil, { recursive: true, force: true, maxRetries: 5 }).catch(() => {});
  process.exit(0);
}, 800);
