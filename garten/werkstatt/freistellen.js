// Teile eines KI-Bogens vom glatten Hintergrund lösen.
// 1. Hintergrundfarbe = Median der Randpixel.
// 2. Flutfüllung vom Rand: alles, was der Hintergrundfarbe nahe ist und mit dem Rand zusammenhängt, ist Hintergrund.
//    So bleiben graue Steine im Inneren eines Teils erhalten, auch wenn sie dem Hintergrund ähneln.
// 3. Löcher (optional): eingeschlossene Flächen, die dem Hintergrund sehr nahe sind, z. B. zwischen Ästen.
// 4. Weiche Kante: Pixel am Übergang bekommen eine Deckkraft nach ihrem Farbabstand, die Farbe wird vom
//    Hintergrund befreit (sonst bleibt ein grauer Saum).
// 5. Teile = zusammenhängende Flächen nach leichtem Aufweiten, damit lose Blätter beim Teil bleiben.
//    Sortiert in Zeilen (größte Abstände der Mitten), in jeder Zeile von links nach rechts.

function median(werte) {
  const s = Float64Array.from(werte).sort();
  return s[s.length >> 1];
}

export function freistellen(bild, { toleranz = 26, kante = 1, zusammenhalt = 12, mindestgroesse = 600, loecher = true, zeilen = 3, schatten = false, gras = false } = {}) {
  const B = bild.naturalWidth || bild.width, H = bild.naturalHeight || bild.height, N = B * H;
  const c = document.createElement('canvas');
  c.width = B; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(bild, 0, 0);
  const d = x.getImageData(0, 0, B, H), p = d.data;

  // 1. Hintergrund
  const rand = [[], [], []];
  for (let i = 0; i < B; i += 2) for (const y of [0, 1, H - 2, H - 1]) { const k = (y * B + i) * 4; rand[0].push(p[k]); rand[1].push(p[k + 1]); rand[2].push(p[k + 2]); }
  for (let j = 0; j < H; j += 2) for (const xx of [0, 1, B - 2, B - 1]) { const k = (j * B + xx) * 4; rand[0].push(p[k]); rand[1].push(p[k + 1]); rand[2].push(p[k + 2]); }
  const hg = rand.map(median);

  // Farbabstand zum Hintergrund. Mit „schatten“ gilt auch als Hintergrund, was gleichmäßig dunkler ist als er
  // (gemalter Schatten: in allen drei Farben um etwa gleich viel abgedunkelt). Gemessen wird dann nur, wie
  // ungleichmäßig die Abdunklung ist. Graue Steine dunkeln ungleichmäßig ab, weil der Hintergrund farbig ist.
  // Mit „gras“ ist der Hintergrund gemaltes Gras: Hintergrund ist, was deutlich grün oder gelbgrün ist
  // (Grün über Blau und nicht unter Rot), egal wie hell. Steine (grau), Holz und Erde (braun), Wasser (blau) nicht.
  const abstand = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const k = i * 4;
    if (gras) {
      const gruen = Math.min(p[k + 1] - p[k + 2] - 35, p[k + 1] - p[k] + 20);
      abstand[i] = toleranz - gruen;
      continue;
    }
    const d0 = hg[0] - p[k], d1 = hg[1] - p[k + 1], d2 = hg[2] - p[k + 2], m = (d0 + d1 + d2) / 3;
    abstand[i] = schatten && m > 6 ? Math.hypot(d0 - m, d1 - m, d2 - m) : Math.hypot(d0, d1, d2);
  }

  // 2. Flutfüllung vom Rand
  const hinten = new Uint8Array(N); // 1 = Hintergrund
  const stapel = new Int32Array(N);
  let sp = 0;
  const saat = (i) => { if (!hinten[i] && abstand[i] < toleranz) { hinten[i] = 1; stapel[sp++] = i; } };
  for (let i = 0; i < B; i++) { saat(i); saat((H - 1) * B + i); }
  for (let j = 0; j < H; j++) { saat(j * B); saat(j * B + B - 1); }
  while (sp) {
    const i = stapel[--sp], xx = i % B;
    if (xx > 0) saat(i - 1);
    if (xx < B - 1) saat(i + 1);
    if (i >= B) saat(i - B);
    if (i < N - B) saat(i + B);
  }

  // 3. Löcher: eingeschlossene Flächen sehr nah am Hintergrund, ab 40 Pixeln
  if (loecher) {
    const streng = toleranz * 0.55, gesehen = new Uint8Array(N), flaeche = [];
    for (let s = 0; s < N; s++) {
      if (hinten[s] || gesehen[s] || abstand[s] >= streng) continue;
      flaeche.length = 0; sp = 0; stapel[sp++] = s; gesehen[s] = 1;
      while (sp) {
        const i = stapel[--sp], xx = i % B;
        flaeche.push(i);
        for (const n of [xx > 0 ? i - 1 : -1, xx < B - 1 ? i + 1 : -1, i - B, i + B]) {
          if (n >= 0 && n < N && !gesehen[n] && !hinten[n] && abstand[n] < streng) { gesehen[n] = 1; stapel[sp++] = n; }
        }
      }
      if (flaeche.length >= 40) for (const i of flaeche) hinten[i] = 1;
    }
  }

  // 4. Deckkraft mit weicher Kante
  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) alpha[i] = hinten[i] ? 0 : 1;
  // Übergangszone: ein Pixel beiderseits der Grenze, Deckkraft nach Farbabstand
  const lo = toleranz * 0.5, hi = toleranz * 1.9, band = new Uint8Array(N);
  for (let j = 1; j < H - 1; j++) {
    for (let i = 1; i < B - 1; i++) {
      const k = j * B + i;
      if (hinten[k] === hinten[k - 1] && hinten[k] === hinten[k + 1] && hinten[k] === hinten[k - B] && hinten[k] === hinten[k + B]) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) band[k + dy * B + dx] = 1;
    }
  }
  for (let i = 0; i < N; i++) {
    if (!band[i]) continue;
    const t = Math.min(1, Math.max(0, (abstand[i] - lo) / (hi - lo))), s = t * t * (3 - 2 * t);
    alpha[i] = hinten[i] ? s * 0.5 : s;
  }
  if (kante > 0) weichzeichnen(alpha, B, H, kante);

  for (let i = 0; i < N; i++) {
    const a = alpha[i], k = i * 4;
    if (a <= 0.004) { p[k + 3] = 0; continue; }
    if (a < 0.999 && !schatten && !gras) { // Saum vom Hintergrund befreien (bei Farbton-Abstand nicht, sonst entstehen helle Flecken)
      const f = 1 / Math.max(a, 0.3);
      for (let c3 = 0; c3 < 3; c3++) p[k + c3] = Math.max(0, Math.min(255, hg[c3] + (p[k + c3] - hg[c3]) * f));
    }
    p[k + 3] = Math.round(a * 255);
  }
  x.putImageData(d, 0, 0);

  // 5. Teile finden
  const vorne = new Uint8Array(N);
  for (let i = 0; i < N; i++) vorne[i] = alpha[i] > 0.5 ? 1 : 0;
  const weit = zusammenhalt > 0 ? aufweiten(vorne, B, H, zusammenhalt) : vorne;
  const marke = new Int32Array(N);
  const kisten = [];
  for (let s = 0; s < N; s++) {
    if (!weit[s] || marke[s]) continue;
    const nr = kisten.length + 1;
    const kiste = { x0: B, y0: H, x1: -1, y1: -1, n: 0 };
    sp = 0; stapel[sp++] = s; marke[s] = nr;
    while (sp) {
      const i = stapel[--sp], xx = i % B, yy = (i - xx) / B;
      if (vorne[i]) {
        kiste.n++;
        if (xx < kiste.x0) kiste.x0 = xx; if (xx > kiste.x1) kiste.x1 = xx;
        if (yy < kiste.y0) kiste.y0 = yy; if (yy > kiste.y1) kiste.y1 = yy;
      }
      for (const n of [xx > 0 ? i - 1 : -1, xx < B - 1 ? i + 1 : -1, i - B, i + B]) {
        if (n >= 0 && n < N && weit[n] && !marke[n]) { marke[n] = nr; stapel[sp++] = n; }
      }
    }
    kiste.nr = nr;
    if (kiste.n >= mindestgroesse) kisten.push(kiste);
  }

  // Zeilen: an den größten Lücken zwischen den Mitten trennen
  kisten.forEach((k) => { k.cx = (k.x0 + k.x1) / 2; k.cy = (k.y0 + k.y1) / 2; });
  const nachY = [...kisten].sort((a, b) => a.cy - b.cy);
  const luecken = nachY.slice(1).map((k, i) => ({ i: i + 1, g: k.cy - nachY[i].cy })).sort((a, b) => b.g - a.g).slice(0, Math.min(zeilen, nachY.length) - 1).map((l) => l.i).sort((a, b) => a - b);
  let zeile = 0;
  nachY.forEach((k, i) => { if (luecken.includes(i)) zeile++; k.zeile = zeile; });
  const sortiert = nachY.sort((a, b) => a.zeile - b.zeile || a.cx - b.cx);

  const teile = sortiert.map((k) => {
    const pad = 3;
    const x0 = Math.max(0, k.x0 - pad), y0 = Math.max(0, k.y0 - pad), x1 = Math.min(B - 1, k.x1 + pad), y1 = Math.min(H - 1, k.y1 + pad);
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    const t = document.createElement('canvas');
    t.width = w; t.height = h;
    const tx = t.getContext('2d');
    tx.drawImage(c, x0, y0, w, h, 0, 0, w, h);
    // nur Pixel dieses Teils behalten (Nachbarn, die in die Kiste ragen, löschen)
    const td = tx.getImageData(0, 0, w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const g = (y0 + j) * B + x0 + i;
      if (marke[g] !== k.nr) td.data[(j * w + i) * 4 + 3] = 0;
    }
    tx.putImageData(td, 0, 0);
    return { canvas: t, ausschnitt: [x0, y0, w, h], anker: anker(td.data, w, h), zeile: k.zeile };
  });
  return { teile, hintergrund: hg.map(Math.round), freigestellt: c };
}

// Fußpunkt: unterste Zeile mit genug deckenden Pixeln, waagerecht die Mitte der untersten Pixel
function anker(a, w, h) {
  const deckend = (i, j) => a[(j * w + i) * 4 + 3] > 128;
  let unten = h - 1;
  for (; unten > 0; unten--) {
    let n = 0;
    for (let i = 0; i < w; i++) if (deckend(i, unten)) n++;
    if (n >= Math.max(3, w * 0.04)) break;
  }
  const von = Math.max(0, Math.round(unten - h * 0.08));
  let sx = 0, n = 0;
  for (let j = von; j <= unten; j++) for (let i = 0; i < w; i++) if (deckend(i, j)) { sx += i; n++; }
  return [Math.round(n ? sx / n : w / 2), unten];
}

function weichzeichnen(a, B, H, r) {
  // zwei Durchgänge Kastenfilter mit Radius r (≈ Gauß), nur Deckkraft
  const R = Math.max(1, Math.round(r)), tmp = new Float32Array(a.length);
  for (let durchgang = 0; durchgang < 2; durchgang++) {
    for (let j = 0; j < H; j++) {
      let s = 0;
      for (let i = -R; i <= R; i++) s += a[j * B + Math.min(B - 1, Math.max(0, i))];
      for (let i = 0; i < B; i++) {
        tmp[j * B + i] = s / (2 * R + 1);
        s += a[j * B + Math.min(B - 1, i + R + 1)] - a[j * B + Math.max(0, i - R)];
      }
    }
    for (let i = 0; i < B; i++) {
      let s = 0;
      for (let j = -R; j <= R; j++) s += tmp[Math.min(H - 1, Math.max(0, j)) * B + i];
      for (let j = 0; j < H; j++) {
        a[j * B + i] = s / (2 * R + 1);
        s += tmp[Math.min(H - 1, j + R + 1) * B + i] - tmp[Math.max(0, j - R) * B + i];
      }
    }
  }
}

function aufweiten(m, B, H, r) {
  // Quadrat-Dilatation, getrennt nach Zeilen und Spalten
  const zwischen = new Uint8Array(m.length), aus = new Uint8Array(m.length);
  for (let j = 0; j < H; j++) {
    let letzte = -1e9;
    for (let i = 0; i < B; i++) { if (m[j * B + i]) letzte = i; if (i - letzte <= r) zwischen[j * B + i] = 1; }
    letzte = 1e9;
    for (let i = B - 1; i >= 0; i--) { if (m[j * B + i]) letzte = i; if (letzte - i <= r) zwischen[j * B + i] = 1; }
  }
  for (let i = 0; i < B; i++) {
    let letzte = -1e9;
    for (let j = 0; j < H; j++) { if (zwischen[j * B + i]) letzte = j; if (j - letzte <= r) aus[j * B + i] = 1; }
    letzte = 1e9;
    for (let j = H - 1; j >= 0; j--) { if (zwischen[j * B + i]) letzte = j; if (letzte - j <= r) aus[j * B + i] = 1; }
  }
  return aus;
}
