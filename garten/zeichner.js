// Zeichner für den Klostergarten (Baustein B, Stil B „gemaltes Bilderbuch“). Vorschlag von Claude, 26.11.2026.
//
// Setzt einen Bereich aus Daten (garten/bereiche/<thema>.json) und freigestellten KI-Teilen (garten/teile/)
// zu einem Bild zusammen. Der Code bestimmt, wo Weg, Stationen und Pflanzen liegen; die KI liefert nur die Teile.
// Stationen, Namen und Knöpfe gehören nicht ins Bild, sondern als HTML darüber (stationsOrte liefert die Lage).
//
// Maße in Gartenpixeln: Ein Bereich ist 390 breit. Gezeichnet wird mit dpr-facher Auflösung.

const NS = 'http://www.w3.org/2000/svg';

// ---------- Laden ----------

export async function ladeJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

const bildCache = new Map();
export function ladeBild(url) {
  if (!bildCache.has(url)) {
    bildCache.set(url, new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => ok(null);
      img.src = url;
    }));
  }
  return bildCache.get(url);
}

// Lädt alle Teile, die der Bereich braucht. Fehlende Teile werden ausgelassen und gemeldet.
export async function ladeTeile(basis, bereich) {
  const liste = await ladeJson(basis + 'teile/teile.json').catch(() => ({}));
  const namen = new Set(benoetigteTeile(bereich));
  const teile = {};
  const fehlt = [];
  await Promise.all([...namen].map(async (n) => {
    const m = liste[n];
    const img = m ? await ladeBild(basis + 'teile/' + m.datei) : null;
    if (img) teile[n] = { ...m, img };
    else fehlt.push(n);
  }));
  return { teile, fehlt: fehlt.sort() };
}

// Name des Teils für eine Art und Stufe. Eine Art ist ein Name („lavendel“ → lavendel-1 bis -3)
// oder { stufen: [Teil für Stufe 1, 2, 3] }, wenn eine Stufe aus einer anderen Reihe kommt.
export function stufenTeil(art, stufe) {
  return typeof art === 'string' ? `${art}-${stufe}` : art.stufen[stufe - 1];
}

function benoetigteTeile(b) {
  const n = [...(b.steine || [])];
  if (b.mauer) n.push(b.mauer.teil);
  for (const g of b.gruppen) {
    if (g.beet && g.beet.teil) n.push(g.beet.teil);
    for (const p of g.pflanzen || []) for (const a of p.arten) n.push(...[1, 2, 3].map((s) => stufenTeil(a, s)));
    for (const e of g.einzeln || []) {
      if (e.art) n.push(...[1, 2, 3].map((s) => stufenTeil(e.art, s)));
      if (e.vorher) n.push(e.vorher, e.nachher);
    }
  }
  for (const s of b.schmuck || []) n.push(s.teil);
  return n;
}

export function benoetigteVorlagen(b) {
  return [...new Set(Object.values(b.belaege).map((x) => x.quelle))];
}

// ---------- Weg ----------

// Catmull-Rom durch die Punkte, gleichmäßig nach Länge abgetastet (1 Gartenpixel)
export function wegLinie(punkte) {
  const roh = [];
  for (let i = 0; i < punkte.length - 1; i++) {
    const p0 = punkte[Math.max(0, i - 1)], p1 = punkte[i], p2 = punkte[i + 1], p3 = punkte[Math.min(punkte.length - 1, i + 2)];
    for (let s = 0; s < 40; s++) {
      const t = s / 40, t2 = t * t, t3 = t2 * t;
      roh.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  roh.push(punkte.at(-1));
  const aus = [{ x: roh[0][0], y: roh[0][1], l: 0 }];
  let l = 0, rest = 0;
  for (let i = 1; i < roh.length; i++) {
    const [ax, ay] = roh[i - 1], [bx, by] = roh[i];
    const d = Math.hypot(bx - ax, by - ay);
    let pos = 1 - rest;
    while (pos <= d) {
      const t = pos / d;
      aus.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, l: l + pos });
      pos += 1;
    }
    rest = d - (pos - 1);
    l += d;
  }
  // Richtung (Normale) je Punkt
  aus.forEach((p, i) => {
    const a = aus[Math.max(0, i - 3)], b = aus[Math.min(aus.length - 1, i + 3)];
    const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1;
    p.nx = -dy / n; p.ny = dx / n;
  });
  return aus;
}

function wegBreite(b, y) {
  const [unten, oben] = b.weg.breite;
  return unten + (oben - unten) * (1 - y / b.hoehe);
}

// Lage der Stationen auf dem Weg, gleiche Abstände nach Länge, von unten nach oben
export function stationsOrte(b) {
  const linie = wegLinie(b.weg.punkte);
  const [vonY, bisY] = b.weg.stationenZwischen;
  const von = linie.find((p) => p.y <= vonY).l, bis = [...linie].reverse().find((p) => p.y >= bisY).l;
  return b.stationen.map((id, i) => {
    const l = von + ((bis - von) * i) / (b.stationen.length - 1);
    const p = linie[Math.min(linie.length - 1, Math.round(l))];
    return { id, x: p.x, y: p.y };
  });
}

// kürzester Abstand eines Punktes zur Wegmitte (zum Prüfen, ob etwas auf den Weg ragt)
export function abstandZumWeg(b, x, y) {
  const linie = wegLinie(b.weg.punkte);
  let min = Infinity;
  for (const p of linie) min = Math.min(min, Math.hypot(p.x - x, p.y - y));
  return min;
}

// ---------- Zufall und Flächen ----------

function zufallVon(saat) {
  let s = saat % 2147483647 || 1;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function leinwand(b, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(b)); c.height = Math.max(1, Math.round(h));
  return c;
}

// Fläche aus vielen weichen Flicken einer Vorlage, damit sich nichts sichtbar wiederholt.
// felder: [x, y, b, h] in Pixeln der Vorlage. g: Flickengröße in Pixeln der Vorlage, f: Maßstab.
const flaechenCache = new Map();
function flaeche(img, belag, b, h, f) {
  const key = `${belag.quelle}|${b}|${h}|${f}`;
  if (flaechenCache.has(key)) return flaechenCache.get(key);
  const zufall = zufallVon(belag.saat || 7);
  const c = leinwand(b, h), x = c.getContext('2d');
  x.fillStyle = belag.grund; x.fillRect(0, 0, b, h);
  const g = belag.flicken, gz = g * f; // Flicken in Zielpixeln
  for (let runde = 0; runde < 2; runde++) {
    for (let py = -gz; py < h + gz; py += gz * 0.45) {
      for (let px = -gz; px < b + gz; px += gz * 0.45) {
        const fe = belag.felder[Math.floor(zufall() * belag.felder.length * 0.9999)];
        const gg = Math.min(g, fe[2], fe[3]);
        const sx = fe[0] + zufall() * (fe[2] - gg), sy = fe[1] + zufall() * (fe[3] - gg);
        const p = leinwand(gg * f, gg * f), q = p.getContext('2d');
        q.drawImage(img, sx, sy, gg, gg, 0, 0, p.width, p.height);
        const r = p.width / 2, v = q.createRadialGradient(r, r, r * 0.2, r, r, r);
        v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
        q.globalCompositeOperation = 'destination-in'; q.fillStyle = v; q.fillRect(0, 0, p.width, p.height);
        x.drawImage(p, px + (zufall() - 0.5) * gz * 0.35, py + (zufall() - 0.5) * gz * 0.35);
      }
    }
  }
  flaechenCache.set(key, c);
  return c;
}

// ---------- Zustand ----------

// Stufe 1 = frisch angelegt, 2 = nötige Station geschafft, 3 = durch freiwillige Stationen voll.
function stufenDerGruppe(g, geschafft, anzahl, saat) {
  if (!geschafft.has(g.station)) return Array(anzahl).fill(1);
  const frei = g.freiwillig || [];
  const anteil = frei.length ? frei.filter((id) => geschafft.has(id)).length / frei.length : 1;
  const voll = Math.round(anteil * anzahl);
  // verstreut statt der Reihe nach
  const zufall = zufallVon(saat);
  const reihenfolge = [...Array(anzahl).keys()].map((i) => [zufall(), i]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const stufen = Array(anzahl).fill(2);
  reihenfolge.slice(0, voll).forEach((i) => (stufen[i] = 3));
  return stufen;
}

// ---------- Zeichnen ----------

// zustand: { geschafft: Set von Stations-IDs }
// optionen: { dpr, vorlagen: { name: Image }, oben: zusätzliche Höhe über dem Bereich (Blick auf den nächsten) }
export function zeichneBereich(b, teile, zustand, { dpr = 2, vorlagen, oben = 0 } = {}) {
  const B = b.breite, H = b.hoehe + oben;
  const c = leinwand(B * dpr, H * dpr), x = c.getContext('2d');
  const geschafft = zustand.geschafft;
  x.scale(dpr, dpr);
  x.translate(0, oben);
  const linie = wegLinie(b.weg.punkte);

  // 1. Wiese: eine ganze KI-Fläche über die Breite, oder aus Flicken einer Vorlage
  const wiese = b.belaege.wiese, wImg = vorlagen[wiese.quelle];
  if (wiese.ganz) x.drawImage(wImg, 0, -oben, B, (B * wImg.naturalHeight) / wImg.naturalWidth);
  else x.drawImage(flaeche(wImg, wiese, B * dpr, H * dpr, wiese.massstab * dpr), 0, -oben, B, H);

  // 2. Beete (leer): KI-Teil, gestreckt auf die Fläche des Beets
  const liste = []; // alles, was steht, wird später von hinten nach vorne gezeichnet
  b.gruppen.forEach((g, gi) => {
    if (g.beet) {
      const [bx, by, bw, bh] = g.beet.ort;
      const t = teile[g.beet.teil];
      if (t) x.drawImage(t.img, bx, by, bw, bh);
      else { x.fillStyle = '#6b4a2c'; x.fillRect(bx, by, bw, bh); }
    }
    for (const p of g.pflanzen || []) {
      const orte = pflanzOrte(p);
      const stufen = stufenDerGruppe(g, geschafft, orte.length, 31 + gi * 7);
      orte.forEach((o, i) => liste.push({ teil: stufenTeil(p.arten[o.reihe % p.arten.length], stufen[i]), x: o.x, y: o.y, faktor: p.faktor || 1, schatten: 0.6 }));
    }
    for (const e of g.einzeln || []) {
      let name;
      if (e.art) name = stufenTeil(e.art, stufenDerGruppe(g, geschafft, 1, 5)[0]);
      else name = geschafft.has(g.station) ? e.nachher : e.vorher;
      liste.push({ teil: name, x: e.ort[0], y: e.ort[1], faktor: e.faktor || 1, schatten: 1, spiegel: e.spiegel });
    }
  });
  for (const s of b.schmuck || []) liste.push({ teil: s.teil, x: s.ort[0], y: s.ort[1], faktor: s.faktor || 1, schatten: 1, spiegel: s.spiegel });

  // 3. Weg: Rand, Belag, Gras über dem Rand
  wegZeichnen(x, b, linie, vorlagen, dpr, oben);

  // 4. Steine an den Stationen (liegen flach im Weg)
  stationsOrte(b).forEach((s, i) => {
    const t = teile[b.steine[i % b.steine.length]];
    if (!t) return;
    const w = t.breite, h = (w * t.groesse[1]) / t.groesse[0];
    schatten(x, s.x + 1, s.y + h * 0.32, w * 0.5, h * 0.22, 0.35);
    x.drawImage(t.img, s.x - w / 2, s.y - h / 2, w, h);
  });

  // 5. Mauer mit Bogen am oberen Rand (Übergang zum nächsten Bereich)
  if (b.mauer && teile[b.mauer.teil]) {
    // gestaucht, weil die KI die Mauer von vorn gemalt hat, der Garten aber schräg von oben gesehen wird
    const t = teile[b.mauer.teil], w = B, h = ((w * t.groesse[1]) / t.groesse[0]) * (b.mauer.stauchen || 1);
    x.drawImage(t.img, 0, b.mauer.unten - h, w, h);
  }

  // 6. Pflanzen und Dinge von hinten nach vorne, jeweils mit weichem Schatten
  liste.sort((p, q) => p.y - q.y).forEach((p) => {
    const t = teile[p.teil];
    if (!t) return;
    const f = (t.breite * p.faktor) / t.groesse[0];
    const w = t.groesse[0] * f, h = t.groesse[1] * f;
    const ax = t.anker[0] * f, ay = t.anker[1] * f;
    schatten(x, p.x + w * 0.1, p.y - h * 0.015, w * 0.42, Math.max(2, w * 0.13), 0.32 * p.schatten);
    x.save();
    if (p.spiegel) { x.translate(p.x, 0); x.scale(-1, 1); x.translate(-p.x, 0); }
    x.drawImage(t.img, p.x - ax, p.y - ay, w, h);
    x.restore();
  });
  return c;
}

function schatten(x, cx, cy, rx, ry, staerke) {
  x.save();
  x.filter = `blur(${Math.max(1.5, ry * 0.5)}px)`;
  x.fillStyle = `rgba(32, 52, 12, ${staerke})`;
  x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill();
  x.restore();
}

function pflanzOrte(p) {
  const [bx, by, bw, bh] = p.ort, aus = [];
  const zufall = zufallVon(p.saat || 3);
  for (let r = 0; r < p.reihen; r++) {
    for (let s = 0; s < p.spalten; s++) {
      const versatz = r % 2 ? 0.5 : 0;
      const fx = (s + 0.5 + versatz * 0.6) / p.spalten, fy = (r + 0.8) / p.reihen;
      aus.push({ reihe: r, x: bx + bw * fx + (zufall() - 0.5) * 4, y: by + bh * fy + (zufall() - 0.5) * 3 });
    }
  }
  return aus;
}

function wegZeichnen(x, b, linie, vorlagen, dpr, oben) {
  // Umriss als Fläche aus beiden Rändern
  const links = linie.map((p) => [p.x + (p.nx * wegBreite(b, p.y)) / 2, p.y + (p.ny * wegBreite(b, p.y)) / 2]);
  const rechts = linie.map((p) => [p.x - (p.nx * wegBreite(b, p.y)) / 2, p.y - (p.ny * wegBreite(b, p.y)) / 2]);
  const umriss = new Path2D();
  [...links, ...rechts.reverse()].forEach(([px, py], i) => (i ? umriss.lineTo(px, py) : umriss.moveTo(px, py)));
  umriss.closePath();
  // oben bis zum Rand weiterführen (Blick auf den nächsten Bereich)
  const ende = linie.at(-1), wo = wegBreite(b, 0);
  umriss.rect(ende.x - wo / 2, -oben - 2, wo, oben + 4);

  const stil = b.weg;
  // weicher, dunklerer Grasrand unter dem Weg
  x.save();
  x.filter = 'blur(3px)';
  x.strokeStyle = stil.rand; x.lineWidth = 9; x.lineJoin = 'round';
  x.stroke(umriss);
  x.restore();
  // Belag
  const sand = b.belaege.weg, B = b.breite, H = b.hoehe + oben;
  const belag = flaeche(vorlagen[sand.quelle], sand, B * dpr, H * dpr, sand.massstab * dpr);
  x.save();
  x.clip(umriss);
  x.drawImage(belag, 0, -oben, B, H);
  // leichte Schattierung zur Mitte hin heller
  x.restore();
  // Halme, die über den Wegrand wachsen (nur wenn der Bereich welche nennt)
  if (!stil.halme || !stil.halme.length) return;
  const zufall = zufallVon(11);
  x.save();
  x.lineCap = 'round';
  for (const seite of [links, rechts]) {
    for (let i = 2; i < seite.length - 2; i += 3) {
      if (zufall() < 0.45) continue;
      const [px, py] = seite[i];
      const p = linie[seite === links ? i : linie.length - 1 - i] || linie[i];
      const innen = seite === links ? -1 : 1; // Richtung zur Wegmitte
      const lang = 3 + zufall() * 5;
      const ix = p.nx * innen, iy = p.ny * innen;
      x.strokeStyle = stil.halme[Math.floor(zufall() * stil.halme.length)];
      x.lineWidth = 1.1 + zufall() * 0.9;
      x.beginPath();
      x.moveTo(px - ix * 2, py - iy * 2);
      x.quadraticCurveTo(px + ix * lang * 0.5, py + iy * lang * 0.5 - 2, px + ix * lang + (zufall() - 0.5) * 2, py + iy * lang - lang * 0.6);
      x.stroke();
    }
  }
  x.restore();
}
