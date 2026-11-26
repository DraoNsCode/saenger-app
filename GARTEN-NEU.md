# Garten neu: Startseite für Baustein B

Stand 25.11.2026. Vorschlag von Claude. Daniel hat diese Übergabe für eine neue Sitzung vorbereiten lassen. Festgelegt ist nur, was in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md) steht. Den Ebenen und Regeln hat Daniel am 25.11.2026 zugestimmt (Satz 28). Ebene 0 ist geklärt, Ebene 1 ist beantwortet, Ebene 2 ist zurückgestellt (Skizzen in `geruest/`, Ergebnisse in ENTSCHEIDUNGEN.md): Daniel wollte zuerst deutlich verschiedene Stile sehen. Vorschlag für die Reihenfolge ab hier: Stil wählen, prüfen, ob er sich bauen lässt, dann die Teile als Baukasten statt Entweder-oder, danach Ebene 4 bis 8. Das Gerüst aus Ebene 1 gilt in seinen Prinzipien, ausgeführt wird es je Stil passend (ENTSCHEIDUNGEN.md, „Fest und frei“).

## Stand 26.11.2026: Stil B und Bausteine (zuerst lesen)

Ab hier gilt dieser Abschnitt. Die Ebenen-Tabelle weiter unten ist Geschichte: Ebene 0 und 1 gelten als Prinzipien, Ebene 2 und die Beete aus Ebene 3 sind zurückgestellt (ENTSCHEIDUNGEN.md, „Garten neu“).

**Entschieden:** Stil B, das gemalte Bilderbuch (`geruest/stilrunde2.html`, Bild `geruest/stil2/b-geruest.webp`). Jeder Stil bekommt ein passendes Gerüst, fest bleiben nur die Prinzipien („Fest und frei“). Ist das KI-Kontingent leer, wird gewartet statt mit Notbehelfen weitergearbeitet. Daniel hat den Plan unten bestätigt („Passt so“).

**Plan (Vorschlag von Claude, bestätigt): Der Code setzt zusammen, die KI liefert nur Bausteine.**

1. **Bausteine-Probe** (ein Tag Kontingent). Vier Bögen im Stil B, je ein 3×3-Raster auf glattem hellgrauem Hintergrund: Kräuter und Gemüse, Blumen, Bäume und Büsche (je drei Wachstumsstufen), Bauten (Mauer mit Bogen, Trittsteine, Brunnen leer und voll, Bank). Eine Werkstatt-Seite im Browser stellt die Teile frei (Hintergrundfarbe, weiche Kante) und schickt sie an ein kleines Python-Skript nur mit Standardbibliothek, das sie als WebP in `garten/teile/` ablegt, dazu `teile.json` mit Ankerpunkt, Maßstab, Eingabe, Seed und Lizenz. Ein Zeichner setzt einen Bereich aus Daten zusammen (`garten/bereiche/<thema>.json`: Wegkurve, Beete, welches Teil bei welcher Station erscheint). Boden und Weg füllt er nahtlos aus KI-Texturen, wie in `geruest/stilprobe-geruest.html`. Ergebnis für Daniel: Bereich 2 (sieben Stationen) in drei Zuständen, in Handygröße, neben `b-geruest.webp` zum Vergleich. Unsicher: ob einzeln erzeugte Teile in Blickwinkel, Licht und Maßstab zusammenpassen. Rückfallebene: ein KI-Bild je Bereich als Bühne.
2. **Baukasten je Etappe:** Claude schlägt je Etappe Teile vor (Satz 4: passend zum Thema, sofern möglich), Daniel sagt nur, was nicht passt. Danach zwei bis drei Tage Kontingent für die übrigen Bögen.
3. **Kapelle und Übergänge** zwischen den Bereichen.
4. **Einbau in die App** (Ebene 6 und folgende): Der Garten ersetzt die Notenzeile in `js/views/weg.js`. Jeder Zustand wird einmal zu einem Bild zusammengesetzt, Stationen, Namen und Knöpfe sind HTML darüber. Tests, Klicktest, dann Test auf Daniels Handy (dafür muss gepusht werden).
5. **Stilregeln** in den Skill `garten-grafik`.

**Stand Schritt 1 (26.11.2026, nachmittags):** Die Bausteine-Probe steht in `geruest/bausteine.html`: Bereich 2 in drei Zuständen (frisch, unterwegs, voll) neben Bild B. Daniel: „Das KI-Bild sieht natürlich viel besser.“
- Werkzeuge: `garten/werkstatt/` (Seite zum Freistellen, `server.py` legt Teile ab, Start: `python garten/werkstatt/server.py`, dann `http://127.0.0.1:8010/garten/werkstatt/werkstatt.html`), `garten/zeichner.js` (setzt einen Bereich aus Daten zusammen, für die App weiterverwendbar), `garten/bereiche/schlag-takt.json`, Bögen mit Eingaben in `garten/boegen/boegen.json`, Teile mit Herkunft in `garten/teile/teile.json`.
- **Daniels Frage danach (26.11.2026):** „Ist es vielleicht möglich, für jede Gartenabteilung das perfekte Bild zu erstellen und dann daraus den Baukasten?“ Probe dazu in `geruest/buehne.html` (Vorschlag, nicht entschieden): Z-Image malt den Bereich voll, Qwen-Image-Edit-2511 (Apache 2.0, Space `kulkas2pintu/QWEN_EDIT_IMAGE`, nimmt Bild-Adressen) macht daraus „frisch“. Weg, Mauer, Bank und Brunnen bleiben dabei gleich. Dann bearbeitet es je Station nur ein Beet, und der Code blendet es weich ein. Den Weg findet der Code an der Sandfarbe im Bild und setzt die Stationen darauf. Ergebnis: „unterwegs“ wirkt wie ein Bild. Haken: Wird das ganze Bild bearbeitet („jung“), wandern die Beete, deshalb Beet für Beet. Eine Beet-Bearbeitung (Mohn) wurde unruhig und muss wiederholt werden. Bilder in `garten/buehne/schlag-takt/`, Rohdateien nicht im Repository.
- **Weiter ab 26.11.2026, nachmittags (von Daniel Claude überlassen, ENTSCHEIDUNGEN.md, „Ein Bild je Bereich“):** Bereich 2 ist als Bühne fertig: Grundbild und sieben Beete in je zwei Stufen, Daten in `garten/buehne/schlag-takt/bereich.json`, Zeichner `garten/buehne.js`, Seite `geruest/buehne.html` mit Schieberegler. Vorschlag für die nächsten Schritte: (1) erledigt, siehe „Anschluss geprüft“; (2) Bereich 1 vollständig im Blickwinkel von Bereich 2 und beide als echter Bildlauf, dann die übrigen Bereiche, sobald ihre Stationen feststehen, und die Kapelle; (3) Einbau in die App. Dabei Ebenen auf ihre Zone zuschneiden, damit nicht je Beet ein ganzes Bild geladen wird. (4) Eingaben und Regeln in den Skill `garten-grafik`. Bewährte Eingaben: Beete positiv und eindeutig benennen („Es gibt drei Beete links vom Weg. Ändere nur das mittlere …“), junge Stufen positiv beschreiben („dichte Reihen kleiner grüner Pflanzen, kniehoch, ohne Blüten“). Grundbild nicht mehrfach bearbeiten, jede weitere Bearbeitung macht den Pinselstrich härter.
- **Anschluss geprüft (26.11.2026, `geruest/anschluss.html`):** Mit Bereich 1 („Das Notenbild“, nur das Ausgangsbild, `garten/buehne/notenbild/voll.webp`) und Bereich 2. Hart an der Mauer übereinandergesetzt sieht man die Naht: Direkt über der fernen, kleinen Mauer beginnt der nächste Bereich mit großen, nahen Beeten. Weich überblenden hilft kaum. Besser trägt ein Wiesenstreifen: Der obere Bereich blendet unten in Wiese aus, der Code führt den Weg durch den Streifen bis in den Bogen des unteren Bereichs, dessen Öffnung ausgeschnitten ist. Das geht in beiden Reihenfolgen, Bereiche lassen sich also tauschen. Ränder und Farbangleich sind noch roh (Schritt 3). „Isometric“ in der Eingabe führt zu einem Diorama auf leerem Grund, nicht nutzen. „From high above“ gibt mildere Perspektive als „three-quarter view at 45 degrees“. Vorschlag für alle Bereiche: unten ein Streifen nur Wiese mit dem Weg in der Mitte, oben die Mauer mit dem Bogen in der Mitte.
- **Vergleich der Wege (26.11.2026, Vorschlag von Claude, auf Daniels Wunsch kritisch):** (1) Bühne je Bereich mit Beet-Ebenen, (2) Baukasten aus Einzelteilen, (3) drei ganze Bilder je Bereich, (4) KI-Grundbild mit Pflanzen als Einzelteilen. (3) fällt aus, weil die Beete zwischen den Bildern wandern. (1) gewinnt klar bei der Qualität, (2) bei Flexibilität, Pflege, Unabhängigkeit, Dateigröße und Tablet/PC. (4) ist ungeprüft und hat das Aufkleber-Problem genau bei dem, was wächst. Ergebnis: (1), weil Qualität Daniels wichtigstes Kriterium ist und die Schwächen von (1) behebbar sind, die von (2) kaum. Bedingungen: Bereiche erst bauen, wenn ihre Stationen feststehen (Etappen 3 bis 11 hängen an C), Teilfortschritt über geteilte Beet-Zonen, feste Eingabe-Vorlage gegen Stilabweichung (Bereich 1 und 2 weichen schon ab), Ebenen auf Zonen zuschneiden (heute etwa 4,4 MB je Bereich), Ausgangsbilder und Ebenen im Repository, damit die App die KI nie braucht.
- **Bereich 1 und Bildlauf (26.11.2026, Vorschlag von Claude):** Bereich 1 neu gemalt mit der Vorlage von Bereich 2, dazu ein Wiesenstreifen unten (`garten/buehne/notenbild/`), Beete: Kräuterreihen, Stockrosen, Kamille, Glockenblumen, Brunnenbeet in vier Farben, Birnbaum. `zeichneGarten` in `garten/buehne.js` setzt Bereiche mit Wiesenstreifen zu einem Bildlauf zusammen (Wiese farblich angeglichen, Weg in den Bogen, Stationen über der Blende). Seite wie die App: `geruest/garten-lauf.html` (390 Pixel, Stationen, „Zu mir“, „Weiter“, „Plan“ als Attrappe). Eingabe-Regeln als Vorschlag im Skill `garten-grafik`. Roh: Bereich 2 hat unten keinen Wiesenstreifen, dort blenden Beete aus und die unteren Stationen rücken zusammen. Daniel: „Optik passt grundsätzlich“, Bereich 1 und 2 aber zu ähnlich in Ambiente, Farben und Details (ENTSCHEIDUNGEN.md).
- Erfahrungen mit Z-Image: Auf glattem hellgrauem Grund malt es Pflanzen sauber, aber eher als klare Illustration. Auf Gras-Grund malt es deutlich mehr wie Gouache, näher an Bild B. Junge Stufen malt es fast so groß wie ausgewachsene und lässt Blüten trotz „no flowers“ stehen (Lavendel, Ringelblume). Deshalb setzt der Code die Größe der Stufen (45, 72 und 100 Prozent). Gemalte Schatten auf hellblauem Grund ließen sich nicht von grauen Steinen trennen, deshalb stehen die Bauten auf Gras-Grund und werden nach Farbart freigestellt. Eine flache Sandfläche sperrt der Schutzfilter des Space („maybe not safe“), der Sand für den Weg kommt aus Bild B. Der Space zum Hintergrund-Entfernen (`not-lain/background-removal`) antwortete „Not Found“.

**KI-Bilder:**
- Werkzeug: Hugging-Face-Connector, Space `mcp-tools/Z-Image-Turbo`, Modell Z-Image-Turbo (Lizenz Apache 2.0), Seed 42, 8 Schritte. Eingabe und Einstellungen jedes Bildes auf der Seite festhalten, auf der es gezeigt wird.
- Blickwinkel, der funktioniert: „High-angle three-quarter view from above at about 45 degrees, looking down …; the ground fills the whole picture edge to edge, no sky, no horizon.“ „like a map“ wird zu flach von oben, „vignettes“ und „plates“ führen zu Augenhöhe mit Himmel.
- Bildbearbeitung über Spaces braucht das Bild als Base64 im Aufruf, für große Bilder nicht praktikabel. Lizenzen geprüft: Qwen-Image-Edit Apache 2.0, BiRefNet (Hintergrund entfernen, nimmt URLs) MIT. FLUX.1-Kontext-dev hat eine nicht freie Lizenz, nicht nutzen.
- Kontingent: kostenloses Konto 5 Minuten am Tag, etwa acht Bilder. Es wird 24 Stunden nach der ersten Nutzung im Fenster zurückgesetzt, laut Doku nicht nach und nach. Erste Nutzung am 26.11. um 10:50 Uhr. Ein Versuch mit leerem Kontingent kostet nichts. Hugging Face PRO kostet 9 $ im Monat und bringt das Achtfache an Kontingent. Daniel hat PRO seit dem 26.11.2026. Die Bausteine-Probe mit 13 Bildaufrufen lief damit ohne Wartezeit.
- Auf Daniels PC (GTX 1050, 2 GB) ist lokale KI nicht praktikabel.

**Seiten dieses Anlaufs:** `geruest/stilrunde1.html` (fünf Stile, sortiert), `geruest/stilprobe-geruest.html` (A, B, D aus Ausschnitten im Gerüst), `geruest/stilrunde2.html` (Gerüst je Stil, B mit „frisch angelegt“). Die Seiten zu Ebene 1 und 2 sind Geschichte.

**Mit Daniel arbeiten:** Vorschläge nie als Entscheidung formulieren, Sätze vor dem Eintragen zeigen. Varianten deutlich verschieden, in echter Größe und im Zusammenhang zeigen. Sagt Daniel mehrmals „kann ich nicht entscheiden“, den Ansatz prüfen statt mit Annahmen weiterzumachen. Nach abgeschlossenen Runden committen (als Claude, noreply@anthropic.com), pushen nur auf Daniels Wort.

**Zuerst rauszoomen:** Daniel möchte den großen Plan im Blick behalten. Vor Schritt 1 FAHRPLAN.md mit ihm durchgehen. Wartezeit auf das Kontingent lässt sich für andere Bausteine nutzen, etwa die Teile von J ohne Gartenbild, E (Konten) oder C (Inhalte der Etappen).

**Erste Nachricht für die nächste Sitzung:**

> Wir arbeiten an der Sänger-App (Repo DraoNsCode/saenger-app, Branch baustein-b/probe-ansichten). Lies CLAUDE.md, README.md (Stand), ENTSCHEIDUNGEN.md (Abschnitt „Garten neu“) und in GARTEN-NEU.md den Abschnitt „Stand 26.11.2026“, die Archivdateien nicht. Zuerst zoomen wir raus: Geh mit mir FAHRPLAN.md durch und schlag vor, wie es mit der ganzen App weitergeht. Danach Baustein B, Schritt 1 (Bausteine-Probe), sobald das KI-Kontingent da ist.

## Worum es geht

Das Design des Gartens soll von vorne beginnen, Schritt für Schritt. Claude zeigt Varianten, Daniel wählt, dann geht es eine Ebene höher. Die Idee stammt von Daniel, die Ebenen und Regeln unten stammen von Claude, Daniel hat sie bestätigt (Satz 28). Beim ersten Anlauf steckten in jedem Bild viele Entscheidungen auf einmal. Daniel konnte nur auf das Ganze reagieren, und manches von Claude galt still als gesetzt.

**Lesen:** CLAUDE.md, ENTSCHEIDUNGEN.md, diese Seite. Für die Inhalte der Etappen `js/lernweg.js` und LERNWEG.md.

**Nicht lesen, außer Daniel fragt danach (Archiv):** GARTEN-BILD.md, GARTEN-WORTE.md, GARTEN-VERGLEICH.md, WEG.md (Zuordnung der Bereiche), `probe/archiv-stilregeln.md` und die Seiten in `probe/`. Sie lenken sonst in die alte Richtung. Ausnahme: das Vergleichsbild für Ebene 2 (unten).

## Die Ebenen

| Ebene | Daniel wählt | Daniel sieht |
| --- | --- | --- |
| 0 | was wirklich feststeht | die Sätze unten: stimmt, stimmt nicht, offen |
| 1 | Gerüst: Größe eines Bereichs, Weg, Stationen, Überblick, Knöpfe | graue Skizzen in Handygröße, zum Scrollen, ohne Stil |
| 2 | Aussehen: Farben, Kanten, Schatten, Detailgrad | immer dasselbe kleine Motiv |
| 3 | Einzelteile: Beet, Weg, Mauer, Tor, Baum, Wasser … | je Teil drei Varianten |
| 4 | Zustände eines Teils | ein Beet und ein Baum von unbearbeitet bis ausgebaut |
| 5 | kleine Szene | Beet, Weg, eigene Position zusammen |
| 6 | ein ganzer Bereich | alle Zustände |
| 7 | zweiter Bereich und Übergang | ob es auch dort trägt, auch getauscht |
| 8 | Einbau in die App | Versuch auf Daniels Handy, danach Einbau mit Daniels Zustimmung |

Geschätzt sind das 12 bis 17 kurze Runden.

## Regeln für jede Runde

1. **Eine Frage.** 3 bis 5 Varianten unterscheiden sich nur darin. Sie sind deutlich verschieden, nicht nur in Nuancen. Nuancen kommen erst in einer zweiten Runde.
2. **Echte Größe.** Alles so groß wie auf dem Handy (390 Pixel breit), daneben die bisher gewählte Variante.
3. **Alle Antworten sind möglich:** „keine davon“, „A mit den Farben von C“, „später“. Bei „später“ oder „nimm, was du für gut hältst“ trägt Claude eine **Annahme** ein, keine Entscheidung.
4. **Fest ist nur, was Daniel wählt**, in Daniels Worten und mit Datum in ENTSCHEIDUNGEN.md, Abschnitt „Garten neu“. Vor dem Eintragen den Satz Daniel zeigen.
5. **Ohne Wahl geht es nicht weiter.** Zeigt eine höhere Ebene einen Fehler, gehen Daniel und Claude bewusst zurück.
6. **Passprobe:** Jede Wahl kommt ins graue Gerüst, damit die Teile auch zusammenpassen.
7. **Vorher selbst prüfen:** Claude zeigt nichts, was in echter Größe nicht lesbar ist oder was man ohne Farbe nicht unterscheiden kann.
8. **Kurz bleiben.** Ist ein Teil gut, wird nicht weiter daran gefeilt. Vor Ebene 6 kein App-Code und keine weiteren Dokumente.

## Ebene 0: Was steht wirklich fest?

**Geklärt am 25.11.2026.** Daniels Antworten stehen in ENTSCHEIDUNGEN.md unter „Garten neu“ und gehen den Sätzen hier vor.

Die Sätze stehen so in ENTSCHEIDUNGEN.md, gekürzt. Die Formulierungen stammen meist von Claude. Daniel nennt nur die Nummern, die nicht stimmen oder offen sind.

**Grundidee**
1. Der Weg zeigt den Fortschritt und führt durch die Themen. (19.11.)
2. Das Bild ist ein Klostergarten, jede Etappe ist ein Gartenbereich. (19.11.)
3. Das Ziel ist die Kapelle. Man erreicht sie mit allen nötigen Stationen. (19.11.)
4. Jeder Bereich passt zum Thema seiner Etappe. (19.11.)
5. Der Garten zieht sich in die Länge. Man beginnt unten und scrollt nach oben. (19.11.)
6. Elf Etappen. Die Reihenfolge ist noch nicht endgültig, die Bereiche sollen sich tauschen lassen. (19.11., 24.11.)
7. Die Optik passt zur Geschichte, eventuell bekommt die ganze App diese Optik. (19.11.)

**Fortschritt**

8. Nötige Stationen schalten den nächsten Bereich frei, freiwillige entwickeln den Bereich weiter. (19.11.)
9. Die Abschluss-Station am Ende jeder Etappe ist nötig. (19.11.)
10. Was geschafft ist, bleibt geschafft. Nichts geht verloren. (19.11.)
11. Wer weitergeht, kann im alten Bereich noch etwas offen haben, auch an der Kapelle. (19.11.)
12. Wie viele offene Stellen ein Bereich hat, wird je Bereich entschieden. (19.11.) Offen dabei: ob „offen“ sichtbar leer heißt oder ob Nötiges schon fertig aussieht.
13. Die Übersicht zeigt nicht alle Stationen einzeln. (19.11., „Daniel geht davon aus“)
14. Die Stationen liegen am Weg. (Von Claude am 19.11. so eingetragen. Daniel erinnert sich nicht, seit 25.11. offen.)
15. Die App stößt Wiederholungen an, kleine Zeichen im Garten zeigen das. (19.11.)
16. Spätblüher erscheinen erst, wenn die spätere Etappe erreicht ist. (19.11.)
17. Üben außerhalb des Weges zählt für den Garten. (19.11.)
18. Es gibt zwei Zugänge, den Garten und den Reiter „Themen“. (19.11.)

**Aussehen**

19. Schräg von oben. (24.11., für Teil 2 der Probe gewählt)
20. Vorerst Original, üppig bepflanzt. (25.11.) Danach: Der gezeichnete Entwurf in Worten gefällt Daniel optisch viel besser. (25.11.)
21. Unbearbeitet und bearbeitet sollen sich deutlich unterscheiden. (25.11., aus Daniels Rückmeldung)
22. Eventuell später Aquarell. Licht und Jahreszeiten eventuell später als Patch. (25.11.)

**Rahmen**

23. Handy, Tablet und PC. Keine Kosten. Daniel betreut die App über Jahre. (11.11.)
24. Daniels Bewertungspunkte: Kosten und Lizenz, Zustände als Bausteine, einheitlicher Stil auch für spätere Bereiche, tauschbare Bereiche, Darstellung auf allen Geräten, Aufwand und Pflege, Qualität. (24.11.)
25. Für die Probe Weg 1 (selbst gezeichnetes SVG) und Weg 3 (KI-Bilder mit Ebenen darüber). (24.11.) Weg 3 ist bisher nicht ausprobiert.
26. Nichts wird ohne Daniels Zustimmung installiert oder eingebaut. (24.11.)
27. Die App sagt „du“. (19.11.)

**Dieser Neuanfang**

28. Das Design beginnt von vorne, nach den Ebenen und Regeln auf dieser Seite. (Daniels Überlegung vom 25.11., noch nicht entschieden. Gerne ändern.)

## Nie gewählt, nur von Claude gesetzt

Nicht übernehmen, ohne zu fragen: Figur mit Strohhut, Laterne, goldener Ring und Steinplatten als Stationen · Torhaus unten, Mauer und Tor zwischen den Bereichen, Bach am rechten Rand · Bereiche dreimal so hoch wie breit · drei Stellen je Bereich mit je zwei freiwilligen Stationen · Nebel oder trockenes Land für noch nicht Geschafftes · Spaten, Gießkanne, Rosenbusch als Zeichen · welcher Gartenbereich zu welcher Etappe gehört (WEG.md) · Farben und Linien.

## Was sich bewährt hat (Technik, kein Design)

- **Anschlüsse:** Weg tritt in jeder Kachel unten und oben an derselben Stelle senkrecht ein und aus, die untere Kachel liegt vor der oberen. Dann lassen sich Bereiche tauschen.
- **Zustände:** Jedes veränderliche Ding nennt im SVG seinen Zustand (`data-teil`, `data-zustand`, `data-bei`), CSS schaltet. Teile einmal im Musterbogen, Kacheln verweisen mit `<use>`.
- **Flüssig:** Viele Formen in der Seite bremsen (28 Bilder pro Sekunde bei vierfach gebremstem Prozessor). Im Browser zu einem Bild zusammengesetzt sind es 75 (`probe/standbild.js`).
- **Weg als Form, Belag als Füllung:** dieselbe Kurve, verschiedene Beläge (`probe/werkzeug/worte.py`).
- **Bedienung:** Das Bild ist Schmuck. Namen und Tippflächen (mindestens 44 Pixel) sind HTML darüber.
- **Fallen:** Kleine Früchte und junge Pflanzen sieht man auf dem Handy nicht. Eine Leiste am Rand und Namensschilder verdecken Beete. Pflanzen rücken auf den Weg, wenn man den Abstand waagerecht statt quer misst. Üppiges von Anfang an macht einen frischen Bereich fertig.
- **Werkzeuge:** `probe/werkzeug/pruefen/` (Aufruf steht in den Dateien). Auf Daniels PC ist Node nicht installiert, die Laufzeit aus VS Code geht: `ELECTRON_RUN_AS_NODE=1 "/c/Program Files/Microsoft VS Code/Code.exe" <datei>`. Vorschau: `python -m http.server 8000`.
- **Nicht geprüft:** echte Handys, Safari, Firefox.

## Vergleichsbild für Ebene 2

`probe/worte.html`: der gezeichnete Entwurf in Worten. Optisch gefällt er Daniel viel besser als die Probe. Ob das an Farben, weichen Kanten, mehr Ruhe oder den Terrassen liegt, ist nicht geklärt. Ebene 2 trennt das. Als Aufbau ist er nicht gewählt.

## Erste Nachricht vom 25.11.2026 (verwendet, siehe oben für die nächste)

> Wir arbeiten an der Sänger-App (Repo DraoNsCode/saenger-app, Branch baustein-b/probe-ansichten). Das Design von Baustein B beginnt von vorne. Lies CLAUDE.md, ENTSCHEIDUNGEN.md und GARTEN-NEU.md, die Archivdateien nicht. Arbeite nach dem Prozess in GARTEN-NEU.md. Beginne mit Ebene 0: Zeig mir die Sätze, ich sage, was nicht stimmt oder offen ist. Zeichne noch nichts.
