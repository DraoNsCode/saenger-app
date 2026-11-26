# Fahrplan (Vorschlag)

Vorschlag von Claude, am 26.11.2026 abends neu gefasst nach Daniels Reihenfolge: „Erst Übungsinhalte festlegen, dann Optik des Gartens, der Abzeichen und der ganzen App in Worten möglichst genau festlegen, sodass möglichst nichts schief gehen kann, dann Optik entwickeln.“ Die Testphase mit einigen Sängern ist gestrichen. Daniel testet parallel zur Entwicklung (ENTSCHEIDUNGEN.md, „Plan und Aufräumen“).

**Von Daniel am 26.11.2026 bestätigt („Passt so“).** Die Einzelheiten der Schritte bleiben Vorschlag, festgelegt ist nur, was in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md) steht. Den früheren Plan vom 26.11.2026 (mit Testphase) ersetzt dieser Plan.

Der Fahrplan soll jeder Sitzung zeigen, wo ihr Auftrag im Ganzen steht. Details entstehen erst, wenn ein Schritt drankommt.

## Plan

| Phase | Inhalt | Ergebnis |
| --- | --- | --- |
| 1. Inhalte | Etappen 3 bis 11 nacheinander (C), Merklieder für Intervalle in Etappe 7 (H), danach Reihenfolge der Etappen prüfen. Inhalt des Übe-Teils festlegen (D). | alle Übungen spielbar, noch in der heutigen Optik |
| 2. Funktionen | gezielt üben, Freischalten und Pflege (J), Abzeichen neu fassen (F), Konten (E), Übe-Teil umsetzen (D) | die App kann alles, was sie können soll, noch in der heutigen Optik |
| 3. Optik in Worten | Garten, Abzeichen und ganze App so genau beschreiben, dass beim Malen und Bauen möglichst nichts schiefgeht | eine Beschreibung, die Daniel Punkt für Punkt bestätigt hat |
| 4. Optik entwickeln | zuerst eine Stichprobe, dann alle Bereiche, Kapelle, Abzeichen und die Ansichten der App, Einbau (B) | die fertige App |
| 5. Abschluss | Mikrofon als Zusatz (G), Lieder im Übe-Teil vervollständigen, Feinschliff | Einführung im Chor (I) |

Daniel testet die ganze Zeit mit. Was fertig und geprüft ist, geht mit Daniels Wort nach `main` und ist damit über GitHub Pages auf seinem Handy.

### Phase 1: Inhalte

1. **Je Etappe (3 bis 11, Themen in LERNWEG.md):** Claude schlägt Übungsarten und Stationen vor (nötig, freiwillig, Spätblüher, Abschluss), mit kurzen Erklärungstexten. Daniel entscheidet. Claude setzt die Etappe spielbar um, mit Tests und dem Prüfblick eines Sängers ohne Notenkenntnis. Während Daniel testet, bereitet Claude die nächste Etappe vor. Muster sind die Etappen 1 und 2.
2. **Etappe 7 mit Merkliedern (H):** Welche Liedanfänge aus dem Chorliederbuch zu welchem Intervall gehören, entscheidet Daniel. Die Noten kommen mit seinem Skill „noten-uebertragen“ aus den PDFs.
3. **Reihenfolge prüfen:** Wenn alle Etappen stehen, prüft Daniel die Reihenfolge (ENTSCHEIDUNGEN.md, 19.11.2026). Danach Spätblüher nachziehen.
4. **Übe-Teil (D), nur Inhalt:** was zur Stimmbildung gehört und was „ein Lied aus dem Repertoire üben“ in der App heißt. Welche Lieder hinein und wie sie übertragen werden.
5. **Nebenher:** Daniel testet die übrigen Stationen der Etappen 1 und 2.

Die Notenzeile bleibt bis Phase 4 die Ansicht, in der neue Etappen getestet werden. Sie wird nicht weiterentwickelt.

### Phase 2: Funktionen

1. **J ohne Gartenbild:** Ein Thema wird frei, sobald seine nötigen Stationen geschafft sind. Üben im Reiter „Themen“ zählt für die Stationen. Fortschritt je Thema. Je Übung „zuletzt geübt“ und Fehlerquote. Pflege: ab wann eine Übung wiederholt werden soll und in welcher Reihenfolge die App auswählt. Eine Runde mit Daniel: wonach man im Reiter statt Leicht, Mittel und Schwer wählt.
2. **F, Abzeichen:** Bedingungen neu fassen, ohne Leicht, Mittel und Schwer. Wo die Abzeichen in der App liegen, gehört schon zur Optik (Phase 3).
3. **E, Konten:** Daniel beantwortet zwei Fragen: welche Anmeldeart und ob die App ohne Konto nutzbar bleibt. Dann ein eigenes Supabase-Projekt mit Daniels Ja, Fortschritt auf dem Gerät mit Abgleich (siehe unten).
4. **D, Übe-Teil:** umsetzen, was in Phase 1 festgelegt wurde.

Die Ansichten dieser Phase sind schlicht. Ihr endgültiges Aussehen kommt aus Phase 3.

### Phase 3: Optik in Worten

Ergebnis ist eine Beschreibung in einer eigenen Datei, als Vorschlag gekennzeichnet, bis Daniel sie bestätigt. Was er bestätigt, kommt in ENTSCHEIDUNGEN.md.

1. **Die ganze App:** Liste aller Ansichten und Zustände (aus Phase 1 und 2). Wie stark der Garten die Optik der App prägt. Farben, Schrift, Knöpfe, Rückmeldungen.
2. **Der Garten als Ganzes:** wie sich der Weg von unten bis zur Kapelle entwickelt, damit sich die Bereiche deutlich unterscheiden (Daniels Rückmeldung vom 26.11.2026). Kapelle, Übergänge, Gartenplan, gesperrte Bereiche, Ansicht nach dem Antippen, Pflege-Zeichen.
3. **Je Bereich ein Steckbrief:** Ambiente, Farben, Anordnung, je nötige Station ein Beet mit „frisch“, „jung“ und „voll“, worin er sich von seinen Nachbarn unterscheidet.
4. **Abzeichen:** wo sie liegen, wie sie aussehen, wie man Stufen erkennt.
5. **Prüfpunkte:** Zu jedem Teil steht, woran man in echter Größe (390 Pixel breit) erkennt, dass es gelungen ist. Claude prüft jede Beschreibung darauf, ob die KI sie verlässlich malen kann (Erfahrungen im Skill `garten-grafik`) und ob die Dateigröße auf dem Handy tragbar bleibt.

Grenze: Worte schließen nicht alles aus. KI-Bilder weichen ab, und manches sieht man erst im Bild. Deshalb beginnt Phase 4 mit einer Stichprobe.

### Phase 4: Optik entwickeln

1. **Stichprobe:** ein Gartenbereich, ein Abzeichen und eine Ansicht der App nach der Beschreibung. Daniel vergleicht mit den Worten. Weicht etwas ab, wird zuerst die Beschreibung angepasst, dann weitergemacht.
2. **Alles Weitere:** übrige Bereiche, Kapelle, Übergänge, Abzeichen, Optik aller Ansichten. Ob Bereich 1 und 2 neu gemalt werden, ergibt sich aus Phase 3.
3. **Einbau:** Der Garten ersetzt die Notenzeile in `js/views/weg.js`. Bilder auf ihre Zonen zuschneiden (heute etwa 4 bis 5 MB je Bereich). Tests, Klicktest, Test auf Daniels Handy und auf einem iPhone.

Das KI-Kontingent (Hugging Face PRO) braucht es erst hier.

### Phase 5: Abschluss

Mikrofon als Zusatz (G), wenn Daniel es dann noch will. Lieder im Übe-Teil vervollständigen. Feinschliff nach Daniels Tests. Einführung im Chor (I).

## Bausteine

| Baustein | Stand | Phase |
| --- | --- | --- |
| A. Stationen: nötig, freiwillig, Spätblüher | umgesetzt am 19.11.2026; Aufteilung vorläufig angenommen, Daniel testet sie | – |
| B. Weg als Klostergarten: Bild und Optik | Klostergarten mit Kapelle als Ziel entschieden. Stil gewählt: gemaltes Bilderbuch. Technik „ein KI-Bild je Bereich“ als Vorarbeit, Bereich 1 und 2 als Bildlauf (`geruest/garten-lauf.html`), „Optik passt grundsätzlich“, aber zu ähnlich. Noch nicht in der App | 3, 4 |
| C. Etappen 3 bis 11 | Themen vorläufig bestätigt. Etappe 3 spielbar (26.11.2026), Daniel testet; Etappen 4 bis 11 offen | 1 |
| D. Übe-Teil: Stimmbildung, Lieder aus dem Repertoire | dass es ihn gibt, ist entschieden; Inhalt offen; die Lieder liegen nur als PDF vor | 1, 2, 5 |
| E. Konten | Konten ja (26.11.2026); offen: Anmeldeart, ohne Konto nutzbar? | 2 |
| F. Abzeichen | vorläufig; Bronze, Silber und Gold hängen an Leicht, Mittel und Schwer und werden neu gefasst | 2, 3 |
| G. Mikrofon | nur als Zusatz | 5 |
| H. Merklieder für Intervalle aus dem Chorliederbuch | Idee bestätigt | 1 |
| I. Einführung im Chor | Testphase mit einigen Sängern gestrichen (26.11.2026) | 5 |
| J. Gezielt üben nach dem Weg | Konzept abgeschlossen am 19.11.2026: Richtung 3, Ausbau und Pflege; Einzelheiten Vorschlag in GEZIELT-UEBEN.md; Umsetzung offen | 2, Zeichen im Garten in 3 und 4 |

## Konten: Prüfung vom 19.11.2026

Ergebnis: kostenlos umsetzbar, mit diesen Bedingungen. Daniel hat am 26.11.2026 „Konten ja“ gesagt.

- **Ort:** Supabase erlaubt im kostenlosen Tarif zwei aktive Projekte. Eines nutzt die Dirigenten-App, eines ist frei. Vorschlag: ein eigenes Projekt für die Sänger-App. Im Projekt der Dirigenten-App wären Sänger im selben Anmeldesystem wie die Dirigenten, und jede Freigabe dort müsste das sauber unterscheiden.
- **Pause:** Kostenlose Projekte pausieren nach einer Woche ohne Nutzung und müssen dann im Supabase-Dashboard wieder gestartet werden. Vorschlag: Der Fortschritt bleibt zuerst auf dem Gerät und wird mit dem Konto abgeglichen. Ist das Projekt pausiert, funktioniert die App weiter, nur der Abgleich wartet.
- **E-Mails:** Der eingebaute E-Mail-Versand von Supabase schickt nur an Mitglieder des eigenen Teams und höchstens zwei Mails pro Stunde. Für Sänger kommen deshalb nur diese Anmeldearten ohne Kosten in Frage:
  - E-Mail und Passwort ohne Bestätigungsmail. Es werden keine Mails verschickt, ein vergessenes Passwort setzt Daniel im Dashboard zurück.
  - Mit Google anmelden. Es werden keine Mails verschickt, aber nicht jeder hat oder will ein Google-Konto.
  - Code oder Link per E-Mail. Das braucht einen externen E-Mail-Dienst mit kostenlosem Kontingent, mehr Einrichtung, und Mails können im Spam landen.
- **Offen:** welche Anmeldeart, und ob die App ohne Konto weiter nutzbar bleibt. Vor dem Einbau die Bedingungen von Supabase noch einmal prüfen, sie können sich seit dem 19.11.2026 geändert haben.

## Strukturen

Welche Strukturen sinnvoll sind, überlässt Daniel Claude (ENTSCHEIDUNGEN.md, 19.11.2026). Gewählt:

- dieser Fahrplan, grob gehalten. Ist ein Schritt fertig oder ändert sich etwas, ihn hier anpassen.
- ein Prüf-Blickwinkel für Texte aus Sicht eines Sängers ohne Notenkenntnis (CLAUDE.md, „Prüfen“).

Bewusst nicht gewählt: feste Rollen wie in einem Unternehmen und simulierte Sänger. Daniel testet selbst, parallel zur Entwicklung. Neue Strukturen erst, wenn ein Problem wiederkehrt.
