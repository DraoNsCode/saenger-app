---
name: garten-grafik
description: Stand, Werkzeuge und Erfahrungen für die Grafik des Klostergartens (Baustein B). Vor jeder Arbeit an Gartenbildern oder an der Beschreibung des Gartens in Worten lesen. Stil gemaltes Bilderbuch, ein KI-Bild je Bereich mit wachsenden Beeten.
---

# Garten-Grafik

**Stand (26.11.2026):** Stil gewählt: gemaltes Bilderbuch (ENTSCHEIDUNGEN.md, „Stilrunde 2“, Bild `geruest/stil2/b-geruest.webp`). Technik als Vorarbeit: ein KI-Bild je Bereich, die Beete wachsen Station für Station (ENTSCHEIDUNGEN.md, „Ein Bild je Bereich“, Daniel: „Richtung passt vorerst“). Bereich 1 und 2 liegen als Bildlauf vor (`geruest/garten-lauf.html`), Daniel: „Optik passt grundsätzlich“, aber zu ähnlich. Laut Plan (FAHRPLAN.md, Vorschlag) wird das Aussehen in Phase 3 zuerst in Worten festgelegt, gemalt wird in Phase 4. Festgelegt ist nur, was in `ENTSCHEIDUNGEN.md` steht. Alles andere auf dieser Seite ist Vorschlag und Erfahrung von Claude.

## So arbeiten

1. In `ENTSCHEIDUNGEN.md` die Abschnitte „Der Weg als Klostergarten“, „Garten neu“ und „Plan und Aufräumen“ lesen.
2. Nichts aus dem Archiv (ARCHIV.md) oder aus der Liste „Nie gewählt“ unten übernehmen, ohne Daniel zu fragen.
3. Rendern und **ansehen**, in echter Größe (390 Pixel breit) und einmal ohne Farbe, bevor Daniel es sieht.

## Fest und frei

Fest (ENTSCHEIDUNGEN.md, „Fest und frei“, 25.11.2026): Der Garten ist lang, man beginnt unten und scrollt nach oben zur Kapelle. Schräg von oben. Man sieht nur die nötigen Stationen, und sie liegen auf dem Weg. Man sieht einen Bereich und ein Stück vom nächsten. Plan auf Knopfdruck, „Zu mir“ und „Weiter“ nach Daniels Regeln. Unbearbeitet und bearbeitet unterscheiden sich deutlich, Freiwilliges sieht man am Bewuchs.

Frei, je Stil passend: Verlauf und Breite des Weges, Form der Bereiche, Lage von Beeten, Bäumen und Wasser. Wie eine Station aussieht. Wie Bereiche aneinandergrenzen und wo ihr Name steht. Woran man Fortschritt erkennt.

## Gewählte Stilregeln

Noch keine eigenen. Gewählt ist der Stil B (ENTSCHEIDUNGEN.md, „Stilrunde 2“, 26.11.2026). Jede Regel hier mit Datum und Verweis auf den Eintrag in `ENTSCHEIDUNGEN.md`.

- **Bereiche deutlich unterscheiden (26.11.2026, ENTSCHEIDUNGEN.md, „Bildlauf Bereich 1 und 2“):** Daniel fand Bereich 1 und 2 zu ähnlich, „gar nicht im Ambiente und den Farben und zu wenig in den Details“. Bevor alle Etappen ausgearbeitet werden, zuerst überlegen, wie jede Etappe aussehen soll.

Beobachtung von Claude dazu: Beide Bereiche entstanden aus derselben Eingabe-Vorlage (unten). Sie legt nicht nur den Stil fest, sondern auch den Aufbau: Weg in der Mitte, Mauer mit Bogen oben, Obstbaum mit Bank oben rechts, Wasser oben links. Für den Anschluss zwischen zwei Bereichen nötig sind nur der Wiesenstreifen unten und der Weg, der unten in der Mitte ein- und oben durch den Bogen austritt. Alles andere kann je Bereich anders sein.

## Eingabe-Regeln für einen Bereich (Vorschlag von Claude, 26.11.2026, nicht von Daniel entschieden)

Bewährt an Bereich 1 und 2 (`garten/buehne/`, Seite `geruest/garten-lauf.html`).

**Ablauf je Bereich:** Ausgangsbild voll (Z-Image-Turbo) → Grundbild „frisch“ (eine Bearbeitung des Ausgangsbilds) → je nötige Station ein Beet in „jung“ und „voll“, jedes aus dem Grundbild (Qwen-Image-Edit-2511). Eine Station ohne freiwillige braucht nur „voll“. Zonen in `bereich.json` ausmessen (jede Ebene mit dem Grundbild vergleichen), dann im zusammengesetzten Bild prüfen.

**Werkzeuge:** Hugging-Face-Connector. Ausgangsbild: Space `mcp-tools/Z-Image-Turbo`, 1024x1536, 8 Schritte, Seed 42. Bearbeitung: `dynamic_space`, Space `kulkas2pintu/QWEN_EDIT_IMAGE`, Werkzeug `QWEN_EDIT_IMAGE_api_predict`, `image` = Bild-URL, `seed` 42, `steps` 8, `guidance_scale` 1, `output_size` 1536, übrige Schalter aus. Ergebnisse aus `tool-results` nach `garten/buehne/<bereich>/roh/` kopieren (nicht im Repo), im Browser zu WebP umrechnen (Canvas, `toBlob('image/webp')`) und per POST `/buehne` an `python garten/werkstatt/server.py` (Port 8010) schicken, der sie ablegt.

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

## Erfahrungen (Stand 26.11.2026)

**KI-Bilder:**
- Hugging-Face-Connector, Space `mcp-tools/Z-Image-Turbo`, Modell Z-Image-Turbo (Apache 2.0), Seed 42, 8 Schritte. Eingabe und Einstellungen jedes Bildes festhalten (`bereich.json`, `flaechen.json`, `teile.json`).
- Lizenzen geprüft: Qwen-Image-Edit Apache 2.0, BiRefNet (Hintergrund entfernen) MIT. FLUX.1-Kontext-dev hat eine nicht freie Lizenz, nicht nutzen.
- Bildbearbeitung über Spaces braucht meist das Bild als Base64, für große Bilder nicht praktikabel. `kulkas2pintu/QWEN_EDIT_IMAGE` nimmt Bild-Adressen. Der Space ist fremd und kann verschwinden: Ausgangsbilder und Ebenen liegen deshalb im Repository, die App braucht die KI nie.
- Kontingent: Das kostenlose Konto hat etwa 5 Minuten am Tag (etwa acht Bilder), zurückgesetzt 24 Stunden nach der ersten Nutzung. Daniel hat Hugging Face PRO seit dem 26.11.2026 (9 $ im Monat, achtfaches Kontingent). Daniel: Ist das Kontingent aufgebraucht, aber für Qualität nötig, lieber warten (ENTSCHEIDUNGEN.md, 25.11.2026).
- Auf Daniels PC (GTX 1050, 2 GB) ist lokale KI nicht praktikabel.
- Z-Image malt auf Gras-Grund mehr wie Gouache, auf glattem Grund eher als klare Illustration. Junge Stufen malt es fast so groß wie ausgewachsene und lässt Blüten trotz „no flowers“ stehen.

**Dateigröße:** Ein Bereich hat heute etwa 4 bis 5 MB. Vor dem Einbau die Ebenen auf ihre Zonen zuschneiden, damit nicht je Beet ein ganzes Bild geladen wird.

**Fallen:** Kleine Früchte und junge Pflanzen sieht man auf dem Handy nicht. Eine Leiste am Rand und Namensschilder verdecken Beete. Üppiges von Anfang an macht einen frischen Bereich fertig. Viele Formen in der Seite bremsen, ein zusammengesetztes Bild läuft flüssig. Das Bild ist Schmuck: Namen und Tippflächen (mindestens 44 Pixel) sind HTML darüber.

**Nicht geprüft:** echte Handys, Safari, Firefox.

**Auf Daniels PC:** Node ist nicht installiert, die Laufzeit aus VS Code geht: `ELECTRON_RUN_AS_NODE=1 "/c/Program Files/Microsoft VS Code/Code.exe" <datei>`. Vorschau: `python -m http.server 8000`.

## Nie gewählt, nur von Claude gesetzt

Aus den ersten Anläufen. Nicht übernehmen, ohne zu fragen: Figur mit Strohhut, Laterne, goldener Ring und Steinplatten als Stationen · Torhaus unten, Bach am rechten Rand · Bereiche dreimal so hoch wie breit · drei Stellen je Bereich mit je zwei freiwilligen Stationen · Nebel oder trockenes Land für noch nicht Geschafftes · Spaten, Gießkanne, Rosenbusch als Zeichen · welcher Gartenbereich zu welcher Etappe gehört (WEG.md, Archiv) · Farben und Linien. Auch die Einzelheiten im Bild von Stil B (Hügel, Mauer mit Bogen, flache Steine als Stationen) sind Vorschlag, gewählt ist nur der Stil.

## Archiv

Erster Anlauf, Neuanfang mit Ebenen, Stilrunden, Baukasten und alte Stilregeln: ARCHIV.md. Nur lesen, wenn Daniel danach fragt.
