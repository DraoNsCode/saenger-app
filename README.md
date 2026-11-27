# Choristen-App

Eine Lern-App für die Sängerinnen und Sänger des Gemeindechors: Noten lesen, Rhythmus und Gehör spielerisch üben. Ein Leitfaden führt durch die Themen, jedes Thema lässt sich auch gezielt üben, und es gibt Abzeichen.

- [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md): was Daniel festgelegt hat, mit Datum. Diese Datei gilt.
- [FAHRPLAN.md](FAHRPLAN.md): Vorschlag für den Plan bis zum Schluss und die Bausteine
- [LERNWEG.md](LERNWEG.md): Vorschlag für Lernweg, Stationen und Abzeichen
- [GEZIELT-UEBEN.md](GEZIELT-UEBEN.md): Vorschlag für das gezielte Üben und die Verbindung zum Garten (Baustein J)
- [UEBEN.md](UEBEN.md): Vorschlag für den Inhalt des Übe-Teils: Stimmbildung, Chorlieder üben (Baustein D)
- [inhalt/stimmbildung.md](inhalt/stimmbildung.md): Vorschlag für die Texte der Stimmbildung: 18 Übungen, 7 Erklärungen, 2 Abläufe (Baustein D)
- [CLAUDE.md](CLAUDE.md): Hinweise für Arbeitssitzungen
- [Skill `garten-grafik`](.claude/skills/garten-grafik/SKILL.md): Stand, Werkzeuge und Erfahrungen zur Gartengrafik (Baustein B)
- [ARCHIV.md](ARCHIV.md): was am 26.11.2026 beim Aufräumen ins Archiv kam und wie man es zurückholt

## Stand

Der Stand steht nur hier. CLAUDE.md verweist darauf.

**Nächster Schritt:** Daniel legt sein Konto an und testet (27.11.2026): Anmeldung, Fortschritt im Konto, „Besser singen“ mit Klang je Stimme, „Selbst singen“ im Lernweg, die Liederliste. Für die Chorlieder danach das erste Lied übertragen und das Anhören bauen (Stufe 2). Daneben Phase 1 des Plans in FAHRPLAN.md: Etappe 3 testet Daniel, Etappen 4 bis 11 sind als Vorschläge spielbar und warten auf seine Entscheidungen, dazu die Reihenfolge der Etappen, die Merklieder (Etappe 7) und die eigene Stimme im Satz (Etappe 9). Danach Phase 2 (Funktionen).

Umgesetzt:

- Startseite mit Stimmwahl, Leitfaden, Themen, Abzeichen, Übe-Teil und Einstellungen
- Konten (27.11.2026): Die App beginnt mit Anmelden oder Konto anlegen (mit Chor-Code), ohne Anmeldung keine App (Daniel, 27.11.2026). Eigenes Supabase-Projekt, FAHRPLAN.md „Konten: Umsetzung“. Code: `js/konto.js`, `js/views/anmeldung.js`.
- Fortschritt im Konto (27.11.2026): Der Browser bleibt der erste Speicher. Nach dem Anmelden, beim Start und kurz nach jeder Änderung gleicht die App mit dem Konto ab, zusammengeführt ohne Verlust (`js/abgleich.js`, Tabelle `fortschritt`). Abmelden in den Einstellungen löscht den Stand auf dem Gerät, im Konto bleibt er.
- Übe-Teil „Chorlieder üben“, Stufe 1 (27.11.2026): Liste aller Lieder mit Suche und Link auf das PDF (`js/views/lieder.js`), ohne eigene Anmeldung. Die Liste kommt von der Funktion `saenger-lieder` im Projekt der Dirigenten-App (bereitgestellt am 27.11.2026). Anhören (Stufe 2) noch nicht. Lieder der Woche vorerst nicht (Daniel, 27.11.2026).
- „Selbst singen“ im Lernweg (27.11.2026): freiwillige Stationen „Ziffern singen“, „Intervalle singen“ und „Einsatzton singen“ als Stufe „mittel“ der Hör-Übungen, mit Selbsteinschätzung (LERNWEG.md, `js/uebungen/singen.js`).
- Übe-Teil „Besser singen“ (27.11.2026): 18 Übungen mit Varianten, 7 Erklärungen, die Abläufe „Einsingen zu Hause“ und „Nach dem Singen“, Begleitung je Stimme, Einstellung „Ich habe einen Strohhalm“. Daten in `js/ueben/stimmbildung.js` (daraus wird `inhalt/stimmbildung.md` erzeugt), Begleitung in `js/ueben/spieler.js`, Ansichten in `js/views/ueben.js`. Die Texte sind Vorschlag, Daniel prüft sie und den Klang.
- Etappen 1 (Das Notenbild) und 2 (Schlag und Takt) mit elf Übungsarten
- Etappe 11 (Feinheiten im Rhythmus, 26.11.2026) als **Vorschlag, nicht entschieden**, mit „Synkopen“ und „Triolen und Sechzehntel“ (`js/uebungen/rhythmus-fein.js`).
- Etappe 10 (Vorzeichen und Tonarten, 26.11.2026) als **Vorschlag, nicht entschieden**, mit „Kreuz und Be“ und „Die 1 finden“ (`js/uebungen/vorzeichen.js`).
- Etappe 9 (Zusammenklang, 26.11.2026) als **Vorschlag, nicht entschieden**, mit „Der Dreiklang“, „Dur oder Moll?“ und „Der Einsatzton“ (`js/uebungen/zusammenklang.js`). Die eigene Stimme im Satz hören fehlt noch.
- Etappe 8 (Punktierung und Haltebogen, 26.11.2026) als **Vorschlag, nicht entschieden**, mit „Punkt und Haltebogen“, „Wie viele Schläge?“ (2/2 und 6/8 in zwei) und „Punktiert hören“. Takte mit Punkt und Bogen baut `punktTakt` in `js/uebungen/hilfen.js`.
- Etappe 7 (Intervalle, 26.11.2026) als **Vorschlag, nicht entschieden**, mit „Intervalle lesen“ und „Intervalle hören“ (`js/uebungen/intervalle.js`). Merklieder und Singen fehlen noch (LERNWEG.md).
- Etappe 6 (Zeichen im Notenbild, 26.11.2026) als **Vorschlag, nicht entschieden**, mit drei Übungsarten: „Was bedeutet das Zeichen?“, „Welche Reihenfolge?“ (Wiederholungen, Klammern, D.C., D.S.) und „Welche Strophe?“.
- Etappe 5 (Tonleiter und Ziffern, 26.11.2026) als **Vorschlag, nicht entschieden**, mit vier Übungsarten: „Ganzton oder Halbton“ (mit Klaviatur als Bild, `klaviaturBild` in `js/uebungen/klavier.js`), „Die Dur-Tonleiter“, „Welche Ziffer?“ und „Ziffern hören“. Hilfen in `js/uebungen/ziffern.js`. Stufen singen fehlt noch (LERNWEG.md).
- Etappe 4 (Achtel und Auftakt, 26.11.2026) als **Vorschlag, nicht entschieden**, mit vier Übungsarten: „Mitzählen mit „und““, „Der Auftakt“, „Achtel hören“ und „Achtel klopfen“. Takte mit Achteln baut `achtelTakt` in `js/uebungen/hilfen.js`. Daniel testet und entscheidet (LERNWEG.md, „Stationen der Etappe 4“).
- Etappe 3 (Notennamen, 26.11.2026) mit vier Übungsarten: „Wie heißt die Note?“ (mit Notenwörtern), „Finde die Note“ (auch im anderen Schlüssel), „Weiterzählen“ und „Taste am Klavier“ mit einer Klaviatur aus weißen Tasten. Tonraum je Stimme in `js/musik.js` (`STIMMEN.bereich`), gemeinsame Hilfen in `js/uebungen/namen.js`. Die Stationen sind vorläufig angenommen (LERNWEG.md), Daniel testet sie.
- Nötige und freiwillige Stationen (Baustein A): je Übung eine nötige Station, dazu freiwillige; ein Abschluss je Etappe, der die nötigen Stationen mischt. Der Mechanismus für Spätblüher ist eingebaut, bei den vorhandenen Übungen gibt es keinen.
- Stufen nach Inhalt: Leicht, Mittel und Schwer sind nur grobe Orientierungswerte, nicht jede Übung hat alle drei. „Die Stimmen im Chorsatz“ hat nur eine Stufe.
- Fortschritt im Browser des Geräts und im Konto
- Prüfung: Tests und Klick-Test in `pruefung/` (siehe unten)

Abgelöst, nicht weiterentwickeln:

- Der Leitfaden als Notenzeile in `js/views/weg.js`. Er zeigt nur die nötigen Stationen, die freiwilligen stehen im Blatt ihrer nötigen Station. Bis der Garten eingebaut ist (Phase 4), bleibt er die Ansicht, in der Daniel neue Etappen testet.

In Frage gestellt (nicht weiterentwickeln, bis das neue System steht):

- Der Reiter „Themen“ in `js/views/themen.js` mit der Auswahl nach Leicht, Mittel und Schwer. Daniel hat für das gezielte Üben Richtung 3 aus GEZIELT-UEBEN.md gewählt (Ausbau und Pflege nebeneinander). Die Einzelheiten sind noch Vorschlag.

Annahmen bei der Umsetzung des Übe-Teils (Daniel, 27.11.2026: „Setze jetzt alles so um, wie du es für am sinnvollsten hältst“). Claudes Wahl, keine Entscheidungen, Daniel korrigiert, falls nötig:

- Tonräume der Begleitung: Frauen singen wie notiert, Männer eine Oktave tiefer. Sopran und Tenor gehen zwei Halbtöne weiter nach oben, Alt und Bass liegen zwei Halbtöne tiefer (`js/ueben/spieler.js`).
- Bei Übungen auf einem Ton klingt der Ton leise als Orgelton weiter, die Klicks laufen mit. Bei „Gegen einen langen Ton“ liegt der lange Ton für Frauen eine Oktave unter ihrer 1, für Männer auf ihrer 1.
- Das Tempo lässt sich vor dem Start in Zehnerschritten zwischen 60 und 150 Prozent ändern.
- In den Abläufen erscheint „Weiter“ nach zwei mitgesungenen Durchgängen, bei Übungen ohne Begleitung gleich.
- Keine Anzeige „zuletzt gemacht“ und kein Fortschritt im Übe-Teil.
- Konten: E-Mail und Passwort ohne Bestätigungsmail, ein Konto nur mit Chor-Code. Passwort vergessen: Daniel setzt es im Dashboard zurück.
- Fortschritt: zuerst im Browser, dann mit dem Konto abgleichen. Beim Zusammenführen gilt das Bessere aus beiden Ständen (geschafft bleibt geschafft), die Einstellungen kommen vom Gerät, auf einem neuen Gerät aus dem Konto.
- Lieder: Statt einer Kopie liest eine Funktion im Projekt der Dirigenten-App die Liste nur für angemeldete Sänger (UEBEN.md, „Privat“). Zuerst sind alle PDFs zum Ansehen da, Anhören kommt Lied für Lied.
- Selbst singen: freiwillige Stufe „mittel“ der Hör-Übungen, Selbsteinschätzung, 6 von 8 (LERNWEG.md).

Vorläufig:

- Die Gestaltung in `css/app.css`. Die Optik wird in Phase 3 in Worten festgelegt.
- Die Aufteilung der Stationen (LERNWEG.md, „Stationen der Etappen 1 und 2“), bis Daniel sie getestet hat. Bestätigt sind schon „Im Schlag tippen“, „Schritt oder Sprung“, „Höher oder tiefer“ und der Abschluss (ENTSCHEIDUNGEN.md).
- Wann sich freiwillige Stationen öffnen (sobald die nötige Station derselben Übung geschafft ist): Vorschlag von Claude, so umgesetzt.

Entschieden, aber noch nicht umgesetzt:

- Der Leitfaden wird zum Klostergarten mit der Kapelle als Ziel.
- Ein Thema lässt sich erst gezielt üben, wenn seine nötigen Stationen geschafft sind (Claudes Wahl, ENTSCHEIDUNGEN.md). Der Reiter „Themen“ zeigt alle Themen, gesperrte sichtbar. Heute sind dort alle fertigen Themen sofort frei.
- Üben außerhalb des Weges zählt für den Garten. Heute zählen Runden im Reiter „Themen“ nicht für die Stationen.
- Gezielt üben nach Richtung 3: Ausbau (der Fortschritt eines Themas steigt nur) und Pflege (die App stößt Wiederholungen an, mit kleinen Zeichen im Garten). Heute gibt es weder Fortschritt je Thema noch Pflege.
- Übe-Teil (Baustein D): Anhören der Chorlieder und die eigene Stimme (Stufe 2), sobald das erste Lied übertragen ist. Übertragen wird zuerst, was „in Arbeit“ ist und bald dran ist (27.11.2026). Lieder der Woche vorerst nicht (27.11.2026).

Vorarbeit für die Optik (Baustein B, nicht in der App):

- Stil gewählt: gemaltes Bilderbuch (26.11.2026, Bild `geruest/stil2/b-geruest.webp`).
- Technik „ein KI-Bild je Bereich, die Beete wachsen Station für Station“: Claudes Wahl, Daniel: „Richtung passt vorerst.“ Zeichner `garten/buehne.js`, Bilder in `garten/buehne/`.
- Bereich 1 und 2 als Bildlauf wie in der App: `geruest/garten-lauf.html`. Daniel: „Optik passt grundsätzlich“, die beiden Bereiche sind ihm aber zu ähnlich. Die Bilder sind nicht endgültig. Ob sie bleiben, ergibt sich aus Phase 3.
- Werkzeuge, bewährte Eingaben und Fallen stehen im Skill `garten-grafik`.

## Technik

- Reine statische Web-App: HTML, CSS und JavaScript-Module, ohne Build-Schritt. Konten, Fortschritt und Zugang zu den Liedern über ein eigenes Supabase-Projekt (siehe FAHRPLAN.md, „Konten: Umsetzung“).
- Notenbild mit [abcjs](https://github.com/paulrosen/abcjs) (MIT-Lizenz, liegt in `vendor/`).
- Klang wird im Browser erzeugt (Web Audio), ohne Klangdateien.
- Schriften liegen im Repository: Atkinson Hyperlegible, EB Garamond und die Ziffern aus Figtree (alle SIL Open Font License, siehe `fonts/`). Daten gehen nur an Supabase: Anmeldung, Fortschritt und die Chorlieder.
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
| `js/ueben/` | Übe-Teil: Inhalte der Stimmbildung (`stimmbildung.js`) und Begleitung (`spieler.js`) |
| `js/konto.js` | Anmeldung, Konto anlegen, Liedliste |
| `js/abgleich.js` | Fortschritt mit dem Konto abgleichen und zusammenführen |
| `inhalt/stimmbildung.md` | Texte der Stimmbildung zum Lesen, erzeugt aus `js/ueben/stimmbildung.js` |
| `supabase/` | Quelltexte der Supabase-Funktionen (`saenger/` im Projekt der Sänger-App, `dirigenten/` im Projekt der Dirigenten-App) |
| `geruest/garten-lauf.html` | Vorarbeit zu Baustein B: Bereich 1 und 2 als Bildlauf wie in der App, nicht Teil der App |
| `garten/` | Vorarbeit zu Baustein B: Zeichner `buehne.js`, Bereiche mit Grundbild und Beet-Ebenen (`buehne/`), Wiese (`flaechen/`), Trittsteine (`teile/`), kleiner Server zum Ablegen von Bildern (`werkstatt/server.py`). Noch nicht Teil der App |
| `.claude/skills/garten-grafik/` | Stand, Werkzeuge und Erfahrungen zur Gartengrafik, später die gewählten Stilregeln |

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
npm run klicktest           # voller Klick-Test, etwa elf Minuten
```

- **`npm test`** erzeugt für jede Übung, Stufe und Stimme viele Zufallsaufgaben und prüft, ob die richtige Lösung unter den Antworten steht, ob keine Antwort doppelt ist und ob jede Stimme ihren Schlüssel bekommt. Außerdem prüft er die Stationen im Lernweg (nötig, freiwillig, Abschluss, Spätblüher, Freischalten) und die Grenze von 6 aus 8.
- **`npm run klicktest`** öffnet die App in Chrome, Chromium oder Edge ohne Fenster, in Handy-Größe mit Sopran und in PC-Größe mit Tenor. Er besucht alle Ansichten, spielt Runden durch und legt Screenshots und `bericht.txt` in `pruefung/ausgabe/` ab. Probleme sind Fehler in der Konsole, fehlende Dateien, hängende Abläufe und Seiten, die breiter sind als der Bildschirm. Dauer etwa elf Minuten (Stand 27.11.2026, mit dem Übe-Teil). `npm run klicktest:schnell` prüft nur die Handy-Größe und zeigt je Übung und Stufe nur die erste Aufgabe. Ein anderer Browser lässt sich mit der Umgebungsvariable `CHROME_PATH` angeben.
- Nicht geprüft werden Klang, musikalischer Inhalt und wie sich das Üben anfühlt.

## Veröffentlichen

Auf GitHub unter **Settings → Pages** als Quelle „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`. Die App ist danach unter `https://<benutzer>.github.io/<repository>/` erreichbar.
