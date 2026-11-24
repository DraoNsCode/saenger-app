# Choristen-App

Eine Lern-App für die Sängerinnen und Sänger des Gemeindechors: Noten lesen, Rhythmus und Gehör spielerisch üben. Ein Leitfaden führt durch die Themen, jedes Thema lässt sich auch gezielt üben, und es gibt Abzeichen.

- [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md): was Daniel festgelegt hat, mit Datum. Diese Datei gilt.
- [LERNWEG.md](LERNWEG.md): Vorschlag für Lernweg, Stationen und Abzeichen
- [WEG.md](WEG.md): Vorschlag für den Weg als Klostergarten
- [GEZIELT-UEBEN.md](GEZIELT-UEBEN.md): Vorschlag für das gezielte Üben und die Verbindung zum Garten (Baustein J)
- [GARTEN-BILD.md](GARTEN-BILD.md): Vorschlag für Bild und Optik des Gartens: was der Garten können muss, Wege zur Grafik, Probe (Baustein B)
- [FAHRPLAN.md](FAHRPLAN.md): Vorschlag für Bausteine und Reihenfolge der Entwicklung
- [CLAUDE.md](CLAUDE.md): Hinweise für Arbeitssitzungen

## Stand

Der Stand steht nur hier. CLAUDE.md verweist darauf.

Umgesetzt (19.11.2026):

- Startseite mit Stimmwahl, Leitfaden, Themen, Abzeichen, Übe-Teil (noch leer) und Einstellungen
- Etappen 1 (Das Notenbild) und 2 (Schlag und Takt) mit elf Übungsarten
- Nötige und freiwillige Stationen (Baustein A): je Übung eine nötige Station, dazu freiwillige; ein Abschluss je Etappe, der die nötigen Stationen mischt. Der Mechanismus für Spätblüher ist eingebaut, bei den vorhandenen Übungen gibt es keinen. Die Aufteilung steht in LERNWEG.md und ist vorläufig angenommen; Daniel testet sie in der App.
- Stufen nach Inhalt: Leicht, Mittel und Schwer sind nur grobe Orientierungswerte, nicht jede Übung hat alle drei. „Die Stimmen im Chorsatz“ hat nur eine Stufe.
- Fortschritt im Browser des Geräts
- Prüfung: Tests und Klick-Test in `pruefung/` (siehe unten)

Abgelöst, nicht weiterentwickeln:

- Der Leitfaden als Notenzeile in `js/views/weg.js`. Bis zum Klostergarten zeigt sie nur die nötigen Stationen, die freiwilligen stehen im Blatt ihrer nötigen Station.

In Frage gestellt (nicht weiterentwickeln, bis das neue System steht):

- Der Reiter „Themen“ in `js/views/themen.js` mit der Auswahl nach Leicht, Mittel und Schwer. Daniel will ein besseres System für das gezielte Üben nach dem Weg (ENTSCHEIDUNGEN.md, „Gezielt üben nach dem Weg“). Daniel hat Richtung 3 aus GEZIELT-UEBEN.md gewählt (Ausbau und Pflege nebeneinander). Die Einzelheiten sind noch Vorschlag.

Vorläufig:

- Die Gestaltung in `css/app.css`. Die Optik wird erst nach der Geschichte des Weges gesucht.
- Die Aufteilung der Stationen (LERNWEG.md, „Stationen der Etappen 1 und 2“), bis Daniel sie in der App getestet hat. Bestätigt sind schon „Im Schlag tippen“, „Schritt oder Sprung“, „Höher oder tiefer“ und der Abschluss (ENTSCHEIDUNGEN.md).
- Wann sich freiwillige Stationen öffnen (sobald die nötige Station derselben Übung geschafft ist): Vorschlag von Claude, so umgesetzt.

Entschieden, aber noch nicht umgesetzt:

- Der Leitfaden wird zum Klostergarten mit der Kapelle als Ziel.
- Ein Thema lässt sich erst gezielt üben, wenn es im Weg freigeschaltet ist, also wenn seine nötigen Stationen geschafft sind (Claudes Wahl, ENTSCHEIDUNGEN.md). Der Reiter „Themen“ zeigt alle Themen, gesperrte sichtbar. Heute sind dort alle fertigen Themen sofort frei.
- Üben außerhalb des Weges zählt für den Garten. Heute zählen Runden im Reiter „Themen“ nicht für die Stationen.
- Gezielt üben nach Richtung 3: Ausbau (der Fortschritt eines Themas steigt nur) und Pflege (die App stößt Wiederholungen für lange nicht geübte oder fehleranfällige Übungen an, mit kleinen Zeichen im Garten). Heute gibt es weder Fortschritt je Thema noch Pflege.

Baustein J ist als Konzept abgeschlossen (19.11.2026). Was davon erst in B oder bei der Umsetzung entschieden wird, steht in GEZIELT-UEBEN.md.

Baustein B (Bild und Optik des Gartens) läuft. Schritt 1 (was der Garten können muss) und Schritt 2 (Wege zur Grafik) stehen als Vorschlag in GARTEN-BILD.md (24.11.2026). Schritt 2 wurde am selben Tag um Skills, Plugins und MCP-Server über die aktivierten hinaus erweitert (Abschnitt H). Ebenfalls am 24.11.2026 hat Daniel die Fragen dazu beantwortet: Die Probe nutzt Weg 1 und Weg 3 und probiert zuerst verschiedene Ansichten aus. Drei Punkte hat er Claude überlassen (ENTSCHEIDUNGEN.md). Den Hugging-Face-Connector für Weg 3 hat Daniel am selben Tag eingerichtet, er funktioniert. Danach hat Claude die Werkzeuge für Schritt 3 in einer Cloud-Sitzung geprüft: Screenshots mit dem Browser des Klick-Tests gehen, und Bilder aus dem Connector kommen als Datei an (Einzelheiten in GARTEN-BILD.md, „Einrichtung für Weg 3“). Es gibt noch keine Grafik und keinen Code für den Garten.

Nächster Schritt: Schritt 3, die Probe am ersten Bereich nach dem Plan in GARTEN-BILD.md. Zuerst zeigt ein kleiner Ausschnitt drei Ansichten, danach folgt der ganze Bereich in der gewählten Ansicht. Vorschlag: Die Teile von J, die kein Gartenbild brauchen, lassen sich vor oder mit B umsetzen (GEZIELT-UEBEN.md). Die übrigen Stationen testet Daniel nebenher.

## Technik

- Reine statische Web-App: HTML, CSS und JavaScript-Module, ohne Build-Schritt.
- Notenbild mit [abcjs](https://github.com/paulrosen/abcjs) (MIT-Lizenz, liegt in `vendor/`).
- Klang wird im Browser erzeugt (Web Audio), ohne Klangdateien.
- Schriften liegen im Repository: Atkinson Hyperlegible, EB Garamond und die Ziffern aus Figtree (alle SIL Open Font License, siehe `fonts/`). Es werden keine Daten an fremde Server geschickt.
- Adressen mit `#/…`, damit GitHub Pages ohne Server-Regeln reicht.
- `package.json` und `pruefung/` dienen nur der Prüfung während der Entwicklung. Die App selbst braucht weder npm noch einen Build-Schritt.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Gerüst der Seite |
| `css/app.css` | Gestaltung |
| `js/app.js` | Einstieg und Navigation |
| `js/lernweg.js` | Themen, Etappen und Stationen |
| `js/uebungen/` | eine Datei je Übungsart, `index.js` meldet sie an |
| `js/runde.js` | Ablauf einer Runde, Rückmeldung, Ergebnis |
| `js/abzeichen.js` | Abzeichen und ihre Bedingungen |
| `js/speicher.js` | Fortschritt im Browser |
| `js/klang.js`, `js/noten.js`, `js/musik.js` | Klang, Notenbild, Tonhöhen |
| `js/views/` | die Ansichten (Weg, Themen, Abzeichen, Üben, Einstellungen) |
| `pruefung/` | Tests und Klick-Test |

### Eine neue Übungsart

Eine Datei in `js/uebungen/` anlegen und in `js/uebungen/index.js` eintragen. Eine Übung hat `id`, `titel`, `themaId`, `aufgaben`, `stufen` (eine oder mehrere von `leicht`, `mittel`, `schwer`, je nach Inhalt), `erklaerung` und eine Funktion `neu(stufe, { stimme })`, die eine Aufgabe zurückgibt: entweder eine Auswahl (`frage`, `bild`, `optionen`, `loesung`, `warum`) oder eine eigene Ansicht über `eigene(el, fertig)`. Danach die Stationen in `js/lernweg.js` eintragen: eine nötige und für jede weitere Stufe eine freiwillige (`freiwillig: true`, bei Spätblühern zusätzlich `abThema`). Die Tests prüfen jede eingetragene Übungsart automatisch mit.

## Lokal ansehen

```sh
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Wegen der JavaScript-Module funktioniert das Öffnen der Datei direkt im Browser nicht.

## Prüfen

Braucht Node.js (ab Version 20).

```sh
npm test                    # Übungen, Lernweg und Speichern prüfen, ohne Browser, ohne Installation
npm install                 # einmal, für den Klick-Test
npm run klicktest:schnell   # kurzer Klick-Test, unter einer Minute
npm run klicktest           # voller Klick-Test, etwa vier Minuten
```

- **`npm test`** erzeugt für jede Übung, Stufe und Stimme viele Zufallsaufgaben und prüft, ob die richtige Lösung unter den Antworten steht, ob keine Antwort doppelt ist und ob jede Stimme ihren Schlüssel bekommt. Außerdem prüft er die Stationen im Lernweg (nötig, freiwillig, Abschluss, Spätblüher, Freischalten) und die Grenze von 6 aus 8.
- **`npm run klicktest`** öffnet die App in Chrome, Chromium oder Edge ohne Fenster, in Handy-Größe mit Sopran und in PC-Größe mit Tenor. Er besucht alle Ansichten, spielt Runden durch und legt Screenshots und `bericht.txt` in `pruefung/ausgabe/` ab. Probleme sind Fehler in der Konsole, fehlende Dateien, hängende Abläufe und Seiten, die breiter sind als der Bildschirm. Dauer etwa vier Minuten. `npm run klicktest:schnell` prüft nur die Handy-Größe und zeigt je Übung und Stufe nur die erste Aufgabe. Ein anderer Browser lässt sich mit der Umgebungsvariable `CHROME_PATH` angeben.
- Nicht geprüft werden Klang, musikalischer Inhalt und wie sich das Üben anfühlt.

## Veröffentlichen

Auf GitHub unter **Settings → Pages** als Quelle „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`. Die App ist danach unter `https://<benutzer>.github.io/<repository>/` erreichbar.
