> **Archiv (25.11.2026).** Stilregeln des ersten Anlaufs, bis dahin im Skill `garten-grafik`. Ein Neuanfang ist vorbereitet (GARTEN-NEU.md).

# Garten-Grafik

**Status: Vorschlag von Claude (24.11.2026), noch nicht von Daniel bestätigt.** Festgelegt ist nur, was in `ENTSCHEIDUNGEN.md` steht. Daniel hat für Teil 2 der Probe die Ansicht „schräg von oben“ gewählt (24.11.2026). Alles andere hier beschreibt, wie Teil 2 der Probe gezeichnet ist. **Stil:** vorerst das Original mit üppiger Bepflanzung, eventuell später Aquarell (Daniel, 25.11.2026). **Vorläufig:** Unbearbeitet und bearbeitet unterscheiden sich nach der Fassung „Zusammen“ (Claudes Wahl, von Daniel überlassen, 25.11.2026). Daniel legt das später fest (Abschnitt „Unterschied“). **Vor neuen Bereichen:** Größe der Bereiche, Stationen und Überblick sind durch einen zweiten Entwurf in Worten wieder offen (`GARTEN-VERGLEICH.md`, 25.11.2026). Ansicht, Maße, Anschlüsse, Zustände und Bedienung sind vom Stil unabhängig gedacht. Vor neuer Arbeit in `ENTSCHEIDUNGEN.md` nachsehen, welcher Stil gewählt ist. Was der Garten können muss, steht in `GARTEN-BILD.md`, Schritt 1.

## Ansicht

- Schräg von oben: den Boden sieht man von oben, gestaucht auf das 0,74-Fache. Alles Stehende (Pflanzen, Mauern, Gebäude, Figur) sieht man von vorn.
- Nichts ist gedreht, nichts hat eine Fluchtlinie. Mauern laufen waagerecht, Beete sind Rechtecke.
- Jedes stehende Ding hat einen Fußpunkt. Im Bauteil liegt er bei 0,0, nach oben geht es ins Negative.
- **Tiefe:** Was weiter unten steht, liegt vorn. Stehende Dinge deshalb nach ihrer Fußlinie sortiert zeichnen.
- **Verdeckung:** Hinter einem Gebäude oder Baum bleibt ein Streifen in dessen Höhe frei von Stationen und offenen Stellen.

## Kacheln und Anschlüsse

| Maß | Wert |
| --- | --- |
| Breite jeder Kachel | 400 Einheiten, Höhe je nach Inhalt |
| Weg | tritt unten und oben bei x = 200 senkrecht ein und aus, 50 breit |
| Bach | tritt unten und oben bei x = 350 senkrecht ein und aus, 36 breit plus Ufer |
| Obere Mauer | Oberkante genau bei 0, Fußlinie bei 62, Gartentor bei x = 172 bis 228, Durchlass bei x = 350 |
| Unten frei | 110 Einheiten ohne Stationen, weil Tor und Pfeiler der unteren Kachel hineinragen |
| Abstand der Stationen | etwa 145 |

- Jede Kachel bringt ihre obere Mauer mit Tor mit. Der Anfang (Torhaus) und später die Kapelle sind eigene Stücke, so lassen sich die Bereiche tauschen.
- Boden, Bach, Weg und Schatten sind auf die Kachel beschnitten. Stehendes darf nach oben hinausragen. Die untere Kachel liegt deshalb vor der oberen.
- Der Weg ist eine Schlangenlinie, die an jeder Station senkrecht läuft. Dadurch passen die Anschlüsse immer.
- Keine Flecken oder Schatten über die Kachelgrenze ziehen.

## Licht, Linien, Farben

- Licht von links oben, Schatten nach rechts unten: Nachtblau `#26305a` mit 18 bis 28 % Deckkraft, nie Schwarz.
- Jede Form hat eine Fläche, einen dunkleren Rand derselben Farbe (1 bis 1,6 breit, runde Ecken) und höchstens zwei hellere oder dunklere Flächen. Keine schwarzen Umrisse, keine Verläufe, kein Weichzeichner. Ausnahmen: der Schein der Laterne und der Nebel (Verlauf nach außen durchsichtig).
- Natürliche Ränder (Kronen, Büsche, Salat) aus aneinandergesetzten Bögen.
- Zufall immer mit festem Startwert.

| Wofür | Fläche | Rand | hell |
| --- | --- | --- | --- |
| Wiese | `#a9bf79` | `#8fa75f` | `#bccf8d` |
| Wiese draußen | `#c4c58e` | `#aaab70` | |
| Weg | `#e9d8b2` | `#c9b182` | `#f4ead0` |
| Stein | `#d2c8b5` | `#a89b83`, Fuge `#8b7f69` | `#e6dfcf` |
| Dach | `#c06c47` | `#95492d` | `#d4885f` |
| Holz | `#93643e` | `#5f3c22` | `#b3835a` |
| Erde | `#7d583c` | `#5c3e28` | `#94704f` |
| Wasser | `#84b8c8` | `#4f8ba1` | `#c4e1e6` |
| Laub | `#6f9d57` | `#456f3d` | `#93bb6e`, `#b1d188` |
| Gold (nur Stationen, Kreuz, Zeichen) | `#d4af37` | `#9c7a12` | `#f3dd8c` |
| Tinte (Figur, Schrift) | `#15233f` | | `#2c4272` |

Alle Farben stehen in `probe/werkzeug/garten_teile.py` (`F`) und `garten.py` (Ergänzungen).

## Zeichen und Zustände

Ein Zustand unterscheidet sich immer auch in der Form, nie nur in der Farbe.

| Ding | Zustände |
| --- | --- |
| Station | `zu` Gras auf der Platte · `naechste` goldener Ring, Laterne, Namensschild · `geschafft` Blüte im Stein, Blumen daneben |
| Tor am Ende | `zu` geschlossen, kahler Bogen · `offen` Flügel auf, Rosenbogen |
| Offene Stelle | `zu` mit Schnur abgesteckt · `offen` angelegt und leer, Spaten · `halb` zum Teil bepflanzt, Spaten · `fertig` |
| Spätblüher | `aus` unsichtbar · `knospe` Knospen mit Funkeln · `fertig` blüht |
| Pflege | Gießkanne neben einer geschafften Station |
| Bereich | `verborgen` Nebel · in Arbeit · angelegt (Stockrosen, Äpfel, Blumen) · weiter ausgebaut · fertig (Vögel, Falter, Schubkarre, mehr Blumen) |

Im SVG trägt jedes veränderliche Ding `data-teil` und `data-zustand`, seine Varianten nennen in `data-bei`, bei welchen Zuständen sie zu sehen sind. `data-ort` ist der Mittelpunkt des Knopfes, `data-platz` ein Platz der Figur. Nicht passende Varianten haben im Rohbild `display="none"`, damit Inkscape ein sauberes Bild zeigt.

Ebenen von hinten nach vorn: `g-grund`, `g-bach`, `g-weg`, `g-schatten`, `g-stehend`, `g-vorn`, `g-nebel`. Klassen im SVG beginnen mit `g-`, weil `.weg` und `.station` in `css/app.css` schon vergeben sind.

## Unterschied zwischen unbearbeitet und bearbeitet

Brainstorming (25.11.2026). Daniel ist aufgefallen, dass sich beides zu wenig unterscheidet. Gearbeitet wird vorläufig mit „Zusammen“, die Wahl bleibt offen. Nichts bauen, was sie festschreibt: Der Code fragt das Bild, was es kann, statt eine Fassung vorauszusetzen. Fassungen: Bisher, Kräftiger, Flächen, Boden, Zusammen (`probe/werkzeug/wandel.py`, `GARTEN-BILD.md`).

- Üppiges darf nicht von Anfang an da sein, sonst wirkt der frische Bereich fertig.
- **Boden:** Jede nötige Station hat eine Zone (`data-teil="zone-1"` …, Zustände `brach` und `gruen`). Die obere Kante liegt 66 Einheiten unter der nächsten Station, dort steht die Figur. Trockenes und Grünes steht an denselben Plätzen.
- **Flächen:** eine große Fläche je offener Stelle, neben der Station, deren Übung sie vertieft, links oder rechts, 140 bis 170 breit. `data-mass` nennt Breite und Höhe für die Tippfläche. Jede Fläche hat eine eigene Form (Reihen, Viereck mit Bäumen, Kreis mit Vierteln).
- **Dinge:** drei klar verschiedene Bilder statt kleiner Zutaten: kahl, blühend, volle Ernte (`data-zone` sagt, mit welcher Station ein Baum aufblüht). Früchte mindestens 3,5 Einheiten Halbmesser im fertigen Bild.
- Nichts auf dem Weg: `neben_weg()` rückt Plätze zur Seite, der Abstand zählt quer zum Weg.

## Bauteile

- Gemeinsame Bauteile stehen genau einmal im Musterbogen `probe/bilder/garten/teile.svg` (Kennung `t-…`). Kacheln verweisen mit `<use href="#t-…">` darauf. Einzeln in Inkscape geöffnet, zeigt eine Kachel diese Teile deshalb nicht.
- Vor einem neuen Bauteil nachsehen, ob es schon eines gibt. Neue Bauteile kommen in den Musterbogen, wenn sie ein zweites Mal gebraucht werden könnten.
- Zeichnen mit `python probe/werkzeug/garten.py` (ohne Zusatzpakete). Ein Lauf überschreibt Änderungen von Hand.
- Baumkronen haben eigene Farben (`krone…`), damit Jahreszeiten sie getrennt vom übrigen Grün tauschen können.
- Die üppige Bepflanzung ist ein eigenes Ding (`data-teil="ueppig"`), das sich ein- und ausschalten lässt.

## Andere Malweisen (Stile)

- Gezeichnet und geändert wird nur das Original. `node probe/werkzeug/stilbilder.mjs [aquarell weich buntstift feder]` rechnet daraus einen Stil nach `probe/bilder/stile/<stil>/`: dieselben vier Dateien, Boden und Bauteile als WebP. Nach jeder Änderung am Original neu laufen lassen. Aquarell gibt es für „Bisher“ und „Zusammen“, die anderen Stile nur für „Bisher“.
- Kacheln mit Boden-Zonen werden zweimal gerechnet, ganz trocken und ganz grün. Das grüne Bild wird je Zone ausgeschnitten.
- Damit das klappt: Formen mit Fläche **und** Rand zeichnen (der Rand wird zur Tuschelinie), Bodenschatten als Ellipse in der Schattenfarbe, Bewegtes mit den Klassen `g-halo`, `g-tropfen`, `g-funkeln`, `g-fliesst` (bleibt Vektor).
- Nach einem Lauf auf kleine Formen (Blüten), gedrehte und gespiegelte Formen und Verläufe (Laternenschein) achten.

## Bedienung und Text

- Das Bild ist Schmuck (`aria-hidden`). Antippen lassen sich HTML-Knöpfe darüber, mindestens 44 Pixel groß, mit Namen und Zustand.
- Die Reihenfolge im Dokument ist die Reihenfolge des Weges (Etappe 1 zuerst), die Anzeige läuft von unten nach oben.
- Schrift nie ins SVG: Titel kommen aus `js/lernweg.js` und stehen als HTML darüber.

## Bewegung und Leistung

- Nur kleine Bewegungen. Alles steht still bei `prefers-reduced-motion`.
- Was sich dauernd bewegt, bekommt eine eigene kleine Ebene (so die Wasserlinien), sonst zeichnet der Browser jedes Mal die ganze Kachel neu. Nur Kacheln im Bild bewegen sich.
- Das Original nicht als SVG in der Seite stehen lassen, sondern als fertiges Bild einsetzen (`probe/standbild.js`). Sonst bremsen die vielen Formen das Scrollen.
- Nicht `content-visibility` verwenden: Es schneidet ab, was nach oben aus der Kachel ragt. Für den ganzen Garten die Kacheln erst beim Näherkommen einsetzen.

## Weg 3 (KI-Grundbilder)

Nur Modelle mit geprüfter Lizenz (Apache 2.0 bevorzugt). Je Bild festhalten: Modell, Beschreibung, Einstellungen, Seed, Datum. Stationen, offene Stellen, Zeichen und Figur bleiben SVG-Ebenen. Bildbeschreibungen für den ersten Versuch stehen in `GARTEN-BILD.md`.

## Arbeitsablauf

1. Diese Regeln und `GARTEN-BILD.md` lesen, dann zeichnen.
2. Rendern und **ansehen**: `python -m http.server 8000`, dann `http://localhost:8000/probe/garten.html`. Screenshots in 360, 390, 820 und 1280 Pixel Breite, in allen Zuständen.
3. Verbessern und wieder ansehen, bis nichts mehr auffällt. Worauf achten: Verdeckung, Anschlüsse auch getauscht („Kachelgrenzen zeigen“), Schilder am Bildrand, Dinge, die sich berühren.
4. Prüfen: keine Konsolenfehler, keine doppelten Kennungen, keine toten Verweise, nichts breiter als der Bildschirm, Bewegung reduziert.
5. Daniel Screenshots zeigen. Wirkung und Stil beurteilt Daniel.
