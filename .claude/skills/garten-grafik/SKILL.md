---
name: garten-grafik
description: Stilregeln und Arbeitsweise für die Grafik des Klostergartens (Baustein B). Vor jeder Arbeit an Gartenbildern lesen. Stil gemaltes Bilderbuch, ein KI-Bild je Bereich mit wachsenden Beeten.
---

# Garten-Grafik

**Status (26.11.2026): Stil gewählt, gemaltes Bilderbuch. Ein KI-Bild je Bereich, Beete wachsen Station für Station** (ENTSCHEIDUNGEN.md, „Stilrunde 2“ und „Ein Bild je Bereich“, Daniel: „Richtung passt vorerst“). Stand, Plan und Werkzeuge stehen in `GARTEN-NEU.md`, Abschnitt „Stand 26.11.2026“. Festgelegt ist nur, was in `ENTSCHEIDUNGEN.md` steht.

## So arbeiten

1. `GARTEN-NEU.md` lesen, zuerst den Abschnitt „Stand 26.11.2026“. Weiter unten stehen die Regeln für jede Runde und was sich technisch bewährt hat.
2. In `ENTSCHEIDUNGEN.md`, Abschnitt „Garten neu“, nachsehen, was entschieden ist.
3. Nichts aus den alten Entwürfen übernehmen, ohne Daniel zu fragen.
4. Rendern und **ansehen**, in echter Größe (390 Pixel breit) und einmal ohne Farbe, bevor Daniel es sieht.

## Gewählte Stilregeln

Noch keine eigenen. Gewählt ist der Stil B (ENTSCHEIDUNGEN.md, „Stilrunde 2“, 26.11.2026). Jede Regel hier mit Datum und Verweis auf den Eintrag in `ENTSCHEIDUNGEN.md`.

## Eingabe-Regeln für einen Bereich (Vorschlag von Claude, 26.11.2026, nicht von Daniel entschieden)

Bewährt an Bereich 1 und 2 (`garten/buehne/`, Seiten `geruest/buehne.html` und `geruest/garten-lauf.html`).

**Ablauf je Bereich:** Ausgangsbild voll (Z-Image-Turbo) → Grundbild „frisch“ (eine Bearbeitung des Ausgangsbilds) → je nötige Station ein Beet in „jung“ und „voll“, jedes aus dem Grundbild (Qwen-Image-Edit-2511). Eine Station ohne freiwillige braucht nur „voll“. Zonen in `bereich.json` ausmessen (jede Ebene mit dem Grundbild vergleichen), dann im zusammengesetzten Bild prüfen.

**Werkzeuge:** Hugging-Face-Connector. Ausgangsbild: Space `mcp-tools/Z-Image-Turbo`, 1024x1536, 8 Schritte, Seed 42. Bearbeitung: `dynamic_space`, Space `kulkas2pintu/QWEN_EDIT_IMAGE`, Werkzeug `QWEN_EDIT_IMAGE_api_predict`, `image` = Bild-URL, `seed` 42, `steps` 8, `guidance_scale` 1, `output_size` 1536, übrige Schalter aus. Ergebnisse aus `tool-results` nach `garten/buehne/<bereich>/roh/` kopieren (nicht im Repo), mit `python garten/werkstatt/server.py` (Port 8010) im Browser zu WebP umrechnen und per POST `/buehne` ablegen.

**Vorlage Ausgangsbild** (Platzhalter in spitzen Klammern):

> Opaque gouache storybook illustration, thick matte paint, visible broad brush strokes, rich warm colors, simplified shapes, no outlines. High-angle three-quarter view from above at about 45 degrees, looking down onto one monastery garden terrace on a gentle green slope; the ground fills the whole picture edge to edge, no sky, no horizon. One continuous sandy footpath of even width starts exactly at the center of the bottom edge, winds in wide S-curves upward and leaves at the center of the top edge through a small archway in a low dry-stone wall that runs straight across the top of the picture. Along the bottom edge a wide strip of plain short grass, only the path crosses it in the center. The path is plain sand without any stones. Beside the path: <je Beet Lage und Inhalt, z. B. „at the bottom a bed of … on the right and a bed of … on the left, in the middle …, on the upper left …, on the upper right … and a wooden bench“>. Lush garden in full bloom, calm, uncluttered, no people, no animals, no text.

- Ohne „exactly at the center of the bottom edge“ tritt der Weg oft unten rechts ein. Mit Wiesenstreifen unten lässt sich ein Bereich ohne Ausblenden über einen anderen setzen.
- Sechs bis sieben deutlich getrennte Beete, je eins pro nötige Station, abwechselnd links und rechts vom Weg. Seeds ausprobieren ist billig, nur die Wahl festhalten.
- Nicht nutzen: „isometric“ (Diorama auf leerem Grund), „like a map“ (zu flach), „vignettes“ oder „plates“ (Augenhöhe mit Himmel). Flache Sandflächen ohne alles sperrt der Schutzfilter.

**Grundbild „frisch“:**

> Turn this garden into a freshly laid out garden that is not yet planted: all beds show bare brown soil with only a few tiny green seedlings, no flowers, no <Pflanzen aufzählen>. Replace the <Baum> with a thin young sapling tied to a wooden stake. Keep everything else exactly the same: the same path, the same wall and archway, the same <Brunnen, Bank>, the same bed shapes and positions, the same camera angle and the same gouache painting style.

**Ein Beet:**

> There are <zwei/drei> soil beds on the <left/right> side of the path. Only change the <lower/middle/upper> one of these, <Lagehinweis>: fill it with <Inhalt>. The <übrigen Beete einzeln nennen> keep their bare brown soil with tiny seedlings. Keep everything else in the picture exactly the same: the path, the grass, the wall, the bench, the sapling, the camera angle and the gouache painting style.

- Junge Stufe positiv beschreiben: „dense neat rows of bushy bright green young <Pflanze> plants, knee high, covering most of the soil, no flowers“. Mit „no flowers“ allein ändert die KI oft nichts.
- Volle Stufe: „a lush dense bed of blooming <Pflanze>“, bei Reihen „the plants so full that they almost touch“.
- Die KI verwechselt gleich aussehende Beete. Hilft: Nachbarbeete ausdrücklich unverändert nennen und das Beet über seine Nachbarn beschreiben („the long narrow soil bed at the left edge … between the square bed with the well above it and the large square bed below it“). Ein Beet mit Brunnen zählt sie nicht als „soil bed“.
- Farben je Teilstück über Pflanzenarten angeben („white daisies, golden yellow buttercups, pink carnations and blue cornflowers, one kind in each quarter“). Ortsangaben wie „lower left quarter“ landen in anderen Beeten.
- Baum neben Bank: „its trunk standing right of the bench and a little behind it. The bench stays fully visible“, sonst verdeckt der Baum die Bank.
- Nur aus dem Grundbild bearbeiten. Eine zweite Bearbeitung (voll aus jung) traf das falsche Beet und machte den Pinselstrich härter.
- Was trotzdem ins Nachbarbeet geht, schneidet die Zone ab. Hohe Pflanzen werfen Schatten auf den Weg: Zone an der Wegkante enden lassen.

**Zusammensetzen:** `garten/buehne.js`. `zeichneBuehne` blendet die Beete eines Bereichs ein, `zeichneGarten` setzt Bereiche mit Wiesenstreifen zu einem Bildlauf zusammen. Je Bereich in `bereich.json`: `mauer` (Oberkante der Mauer über dem Bogen), `tor` (Bogenöffnung), `wieseUnten`.

## Archiv

Die Regeln des ersten Anlaufs stehen unverändert in `probe/archiv-stilregeln.md`. Nur lesen, wenn Daniel danach fragt.
