// Zeichner für den Klostergarten als Bühne je Bereich (Baustein B, Stil B). Vorschlag von Claude, 26.11.2026,
// von Daniel Claude überlassen („Bewerte und entscheide selbst“).
//
// Ein Bereich ist ein KI-Grundbild („frisch“) und je Station ein Beet mit den Ebenen „jung“ und „voll“, jeweils
// das ganze Bild, in dem die KI nur dieses Beet verändert hat. Der Zeichner blendet jede Ebene nur in ihrer Zone
// weich ein. Den Weg findet er an der Sandfarbe im Grundbild und setzt die Stationen darauf; Steine kommen aus
// garten/teile/. Stationen, Namen und Knöpfe gehören als HTML darüber (stationsOrte liefert die Lage).

const lade = (src) => new Promise((ok, nein) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => nein(new Error(src)); i.src = src; });

// Lädt Daten und alle Bilder eines Bereichs. ordner endet mit „/“, teile ist der Ordner garten/teile/.
export async function ladeBuehne(ordner, teile) {
  const b = await (await fetch(ordner + 'bereich.json')).json();
  const namen = new Set([b.grund]);
  for (const beet of b.beete) { if (beet.jung) namen.add(beet.jung); namen.add(beet.voll); }
  const bilder = {};
  await Promise.all([...namen].map(async (n) => { bilder[n] = await lade(ordner + n); }));
  const steine = await Promise.all(b.steine.map((n) => lade(teile + n + '.webp')));
  const weg = wegFinden(bilder[b.grund], b);
  return { daten: b, bilder, steine, weg, orte: stationsOrte(weg, b) };
}

// Weg im Grundbild finden: je Bildzeile die Sandfläche, die an die vorige anschließt, dann geglättet.
export function wegFinden(img, b) {
  const [B, H] = b.groesse;
  const c = document.createElement('canvas'); c.width = B; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, B, H);
  const d = x.getImageData(0, 0, B, H).data;
  const sand = (i, j) => { const k = (j * B + i) * 4, r = d[k], g = d[k + 1], bl = d[k + 2]; return r > 195 && g > 160 && bl > 105 && bl < 190 && r - bl > 40 && Math.abs(r - g) < 48; };
  const roh = [];
  let mitte = B / 2;
  for (let j = H - 6; j > (b.weg.suchenAb || 0); j -= 4) {
    let beste = null;
    for (let i = 0; i < B; ) {
      if (!sand(i, j)) { i++; continue; }
      let e = i; while (e < B && sand(e, j)) e++;
      if (e - i > 30) { const m = (i + e) / 2; if (!beste || Math.abs(m - mitte) < Math.abs(beste.m - mitte)) beste = { m, w: e - i }; }
      i = e;
    }
    if (beste && Math.abs(beste.m - mitte) < 90) { mitte = beste.m; roh.push({ x: beste.m, y: j, w: beste.w }); }
  }
  // glätten: Lage als Mittelwert, Breite als Median (Abzweige und Bildränder verfälschen einzelne Zeilen)
  return roh.map((p, i) => {
    const n = roh.slice(Math.max(0, i - 8), i + 9);
    const w = n.map((q) => q.w).sort((a, z) => a - z);
    return { x: n.reduce((s, q) => s + q.x, 0) / n.length, y: p.y, w: w[w.length >> 1] };
  });
}

// Stationen in gleichen Abständen nach Weglänge, von unten nach oben
export function stationsOrte(weg, b) {
  const [vonY, bisY] = b.weg.stationenZwischen;
  const teil = weg.filter((p) => p.y <= vonY && p.y >= bisY);
  const l = [0];
  for (let i = 1; i < teil.length; i++) l.push(l[i - 1] + Math.hypot(teil[i].x - teil[i - 1].x, teil[i].y - teil[i - 1].y));
  const orte = b.stationen.map((id, n) => {
    const ziel = (l.at(-1) * n) / (b.stationen.length - 1);
    const i = l.findIndex((v) => v >= ziel - 0.001); // Rundung: die letzte Station liegt am Ende
    const p = teil[i < 0 ? teil.length - 1 : i];
    return { id, x: p.x, y: p.y, w: p.w };
  });
  // Wegbreite über benachbarte Stationen ausgleichen (Abzweige machen einzelne Stellen breit)
  return orte.map((o, i) => {
    const w = [orte[i - 1], o, orte[i + 1]].filter(Boolean).map((q) => q.w).sort((a, z) => a - z);
    return { ...o, w: w[w.length >> 1] };
  });
}

// Stufe eines Beets: 0 = frisch, 1 = jung (nötige Station geschafft), 2 = voll (auch alle freiwilligen)
export function stufe(beet, geschafft) {
  if (!geschafft.has(beet.station)) return 0;
  if (!beet.jung || beet.freiwillig.every((id) => geschafft.has(id))) return 2;
  return 1;
}

const masken = new WeakMap();
function maske(beet, B, H) {
  if (!masken.has(beet)) {
    const m = document.createElement('canvas'); m.width = B; m.height = H;
    const x = m.getContext('2d');
    x.filter = 'blur(22px)'; x.fillStyle = '#000'; x.beginPath();
    beet.zone.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
    x.closePath(); x.fill();
    masken.set(beet, m);
  }
  return masken.get(beet);
}

// Mittlere Grasfarbe in einem Streifen des Bildes (nur deutlich grüne Bildpunkte)
function grasFarbe(img, y0, y1, B, H) {
  const c = document.createElement('canvas'); c.width = B; c.height = y1 - y0;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, y0, B, y1 - y0, 0, 0, B, y1 - y0);
  const d = x.getImageData(0, 0, B, y1 - y0).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let k = 0; k < d.length; k += 12) if (d[k + 1] > 110 && d[k + 1] > d[k] * 1.02 && d[k + 1] > d[k + 2] * 1.5) { r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; }
  return n ? [r / n, g / n, b / n] : [160, 182, 70];
}

// Linker und rechter Rand des Wegs in Zeile y (Sandfläche, die der Mitte am nächsten liegt), über neun Zeilen gemittelt
function wegRand(img, y, mitte, B) {
  const c = document.createElement('canvas'); c.width = B; c.height = 9;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, y - 4, B, 9, 0, 0, B, 9);
  const d = x.getImageData(0, 0, B, 9).data;
  const sand = (i, j) => { const k = (j * B + i) * 4, r = d[k], g = d[k + 1], bl = d[k + 2]; return r > 195 && g > 160 && bl > 105 && bl < 190 && r - bl > 40 && Math.abs(r - g) < 48; };
  const l = [], r = [];
  for (let j = 0; j < 9; j++) {
    let beste = null;
    for (let i = 0; i < B; ) { if (!sand(i, j)) { i++; continue; } let e = i; while (e < B && sand(e, j)) e++; if (e - i > 30 && (!beste || Math.abs((i + e) / 2 - mitte) < Math.abs((beste[0] + beste[1]) / 2 - mitte))) beste = [i, e]; i = e; }
    if (beste) { l.push(beste[0]); r.push(beste[1]); }
  }
  const med = (v) => v.sort((p, q) => p - q)[v.length >> 1];
  return l.length ? [med(l), med(r)] : [mitte - 80, mitte + 80];
}

// Setzt mehrere Bereiche zu einem Bildlauf zusammen (Vorschlag von Claude, 26.11.2026; die Probe dazu liegt im Archiv, ARCHIV.md).
// buehnen von unten nach oben. Zwischen zwei Bereichen liegt ein Wiesenstreifen: Der obere blendet unten in Wiese aus,
// der Code führt den Weg durch den Streifen in den Bogen des unteren, dessen Öffnung ausgeschnitten ist. Die Wiese wird
// oben an das Gras des oberen, unten an das des unteren Bereichs angeglichen, der Sand im Streifen stammt aus dem Weg des
// oberen Grundbilds. Die Stationen eines oberen Bereichs rücken über die Blende.
// Braucht je Bereich daten.mauer (Oberkante der Mauer über dem Bogen) und daten.tor (Öffnung: Mitte x, halbe Breite r,
// Scheitel oben, Boden unten); daten.wieseUnten, wenn das Bild unten schon einen Streifen Wiese hat (dann kürzere Blende).
// Liefert das Bild und je Bereich seine Lage im Bild (CSS-Pixel): oben, unten und die Stationen.
export function zeichneGarten(buehnen, geschafft, { breite = 390, dpr = 2, wiese, streifen = 150 } = {}) {
  const [B, H] = buehnen[0].daten.groesse;
  const F = breite / B;
  const oben = [...buehnen].reverse();
  const blende = (k) => (k === oben.length - 1 ? 0 : oben[k].daten.wieseUnten ? 110 : 260);
  // Stationen über der Blende
  const teile = oben.map((bu, k) => {
    const [von, bis] = bu.daten.weg.stationenZwischen;
    if (!blende(k) || von <= H - blende(k) - 40) return bu;
    const daten = { ...bu.daten, weg: { ...bu.daten.weg, stationenZwischen: [H - blende(k) - 40, bis] } };
    return { ...bu, orte: stationsOrte(bu.weg, daten) };
  });
  // Lage jedes Bildes (Zeile 0) im Gesamtbild, oberster Bereich bei 0
  const y0 = [0];
  for (let k = 1; k < oben.length; k++) y0.push(y0[k - 1] + H + streifen - oben[k].daten.mauer);
  const gesamt = y0.at(-1) + H;
  const c = document.createElement('canvas');
  c.width = Math.round(breite * dpr); c.height = Math.round(gesamt * F * dpr);
  const x = c.getContext('2d');
  x.scale(F * dpr, F * dpr);
  const ebene = (h) => { const e = document.createElement('canvas'); e.width = B; e.height = h; return [e, e.getContext('2d')]; };

  // 1. Wiese und Weg in jedem Streifen
  for (let k = 0; k < oben.length - 1; k++) {
    const u = oben[k], l = oben[k + 1], t = l.daten.tor, aus = blende(k), grund = u.bilder[u.daten.grund];
    const yA = y0[k] + H - aus, yS = y0[k] + H, yM = yS + streifen, yTor = y0[k + 1] + t.unten;
    const von = yA - 40, bis = yTor + 20;
    // Wiese, zeilenweise auf die Grasfarbe oben und unten verschoben
    const [w, wx] = ebene(bis - von);
    if (wiese) { const wh = (B * wiese.naturalHeight) / wiese.naturalWidth; for (let y = 0; y < bis - von; y += wh) wx.drawImage(wiese, 0, y, B, wh); }
    const d = wx.getImageData(0, 0, B, bis - von), p = d.data;
    let m = [0, 0, 0], n = 0;
    for (let i = 0; i < p.length; i += 16) { m[0] += p[i]; m[1] += p[i + 1]; m[2] += p[i + 2]; n++; }
    m = m.map((v) => v / n);
    const fo = grasFarbe(grund, H - aus - 200, H, B, H);
    const fu = grasFarbe(l.bilder[l.daten.grund], 30, l.daten.mauer, B, H);
    for (let y = 0; y < bis - von; y++) {
      const s = Math.min(1, Math.max(0, (y + von - yA) / (yM - yA)));
      const v = [0, 1, 2].map((i) => fo[i] + (fu[i] - fo[i]) * s - m[i]);
      for (let i = y * B * 4, e = i + B * 4; i < e; i += 4) { p[i] += v[0]; p[i + 1] += v[1]; p[i + 2] += v[2]; }
    }
    wx.putImageData(d, 0, 0);
    x.drawImage(w, 0, von);
    // Weg: vom Beginn der Blende im oberen Bereich bis in den Bogen des unteren
    const mitte = (u.weg.find((q) => q.y <= H - aus) || { x: B / 2 }).x;
    const [uL, uR] = wegRand(grund, H - aus, mitte, B);
    const [aL, aR] = [t.x - t.r - 4, t.x + t.r + 4];
    const pfad = new Path2D();
    pfad.moveTo(uL, yA);
    const [c1, c2] = [yA + (yM - yA) * 0.4, yA + (yM - yA) * 0.6];
    pfad.bezierCurveTo(uL, c1, aL, c2, aL, yM);
    pfad.lineTo(aL, yTor); pfad.lineTo(aR, yTor); pfad.lineTo(aR, yM);
    pfad.bezierCurveTo(aR, c2, uR, c1, uR, yA);
    pfad.closePath();
    x.save(); x.filter = 'blur(6px)'; x.strokeStyle = 'rgba(70,95,30,0.35)'; x.lineWidth = 12; x.stroke(pfad); x.restore();
    // Belag: ein Stück Sand aus dem Weg des oberen Grundbilds, ohne Steine, als Muster
    const [pL, pR] = wegRand(grund, H - aus - 120, mitte, B);
    const pw = Math.max(40, Math.round((pR - pL) * 0.5));
    const [s, sx] = ebene(140); s.width = pw;
    sx.drawImage(grund, (pL + pR) / 2 - pw / 2, H - aus - 190, pw, 140, 0, 0, pw, 140);
    x.save(); x.clip(pfad); x.fillStyle = x.createPattern(s, 'repeat');
    x.fillRect(Math.min(uL, aL) - 10, yA - 4, Math.max(uR, aR) - Math.min(uL, aL) + 20, yTor - yA + 8); x.restore();
  }

  // 2. Bereiche: oberer Rand weich (außer ganz oben), unterer Rand blendet in den Streifen aus (außer ganz unten)
  teile.forEach((bu, k) => {
    const b = bu.daten, bild = zeichneBuehne(bu, geschafft, { breite: B, dpr: 1, steine: true });
    const ab = k === 0 ? 0 : b.mauer - 30, h = H - ab, aus = blende(k);
    const [e, ex] = ebene(h);
    ex.drawImage(bild, 0, ab, B, h, 0, 0, B, h);
    const g = ex.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, k === 0 ? '#000' : 'rgba(0,0,0,0)');
    if (k) g.addColorStop(30 / h, '#000');
    g.addColorStop((h - aus) / h, '#000');
    g.addColorStop(1, aus ? 'rgba(0,0,0,0)' : '#000');
    ex.globalCompositeOperation = 'destination-in'; ex.fillStyle = g; ex.fillRect(0, 0, B, h);
    // Bogenöffnung ausschneiden, damit der Weg aus dem Streifen durchgeht
    if (k > 0 && b.tor) {
      const t = b.tor;
      ex.globalCompositeOperation = 'destination-out'; ex.beginPath();
      ex.moveTo(t.x - t.r, t.unten - ab); ex.lineTo(t.x - t.r, t.oben + t.r - ab); ex.arc(t.x, t.oben + t.r - ab, t.r, Math.PI, 0); ex.lineTo(t.x + t.r, t.unten - ab);
      ex.closePath(); ex.fill();
    }
    x.drawImage(e, 0, y0[k] + ab);
  });

  const lagen = teile.map((bu, k) => ({
    id: bu.daten.id,
    oben: (y0[k] + (k === 0 ? 0 : bu.daten.mauer)) * F,
    mauer: (y0[k] + bu.daten.mauer) * F,
    unten: (y0[k] + H) * F,
    orte: bu.orte.map((o) => ({ ...o, x: o.x * F, y: (y0[k] + o.y) * F })),
  })).reverse();
  return { bild: c, lagen, hoehe: gesamt * F };
}

// Setzt den Zustand zu einem Bild zusammen. breite in CSS-Pixeln, dpr für scharfe Darstellung.
export function zeichneBuehne(buehne, geschafft, { breite = 390, dpr = 2, steine = true } = {}) {
  const { daten: b, bilder, orte } = buehne;
  const [B, H] = b.groesse;
  const c = document.createElement('canvas');
  c.width = Math.round(breite * dpr); c.height = Math.round((breite * H / B) * dpr);
  const x = c.getContext('2d');
  x.scale(c.width / B, c.height / H);
  x.drawImage(bilder[b.grund], 0, 0, B, H);
  const ebene = document.createElement('canvas'); ebene.width = B; ebene.height = H;
  const e = ebene.getContext('2d');
  for (const beet of b.beete) {
    const s = stufe(beet, geschafft);
    if (!s) continue;
    const bild = bilder[s === 1 ? beet.jung : beet.voll];
    e.globalCompositeOperation = 'copy'; e.drawImage(maske(beet, B, H), 0, 0);
    e.globalCompositeOperation = 'source-in'; e.drawImage(bild, 0, 0, B, H);
    x.drawImage(ebene, 0, 0);
  }
  if (steine) {
    orte.forEach((o, i) => {
      const st = buehne.steine[i % buehne.steine.length], w = o.w * 0.4, h = (w * st.naturalHeight) / st.naturalWidth;
      x.save(); x.filter = 'blur(4px)'; x.fillStyle = 'rgba(70,55,20,0.28)';
      x.beginPath(); x.ellipse(o.x + 2, o.y + h * 0.3, w * 0.5, h * 0.25, 0, 0, 7); x.fill(); x.restore();
      x.drawImage(st, o.x - w / 2, o.y - h / 2, w, h);
    });
  }
  return c;
}
