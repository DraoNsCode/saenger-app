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
    const p = teil[Math.max(0, l.findIndex((v) => v >= ziel))];
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
