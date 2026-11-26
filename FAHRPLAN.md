# Fahrplan (Vorschlag)

Vorschlag von Claude vom 19.11.2026, am 26.11.2026 neu gefasst. Den Plan unten hat Daniel am 26.11.2026 bestätigt („Plan passt“). Das ist keine Vorgabe: Festgelegt ist nur, was in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md) steht. Auch die Reihenfolge ist nur ein Vorschlag.

Der Fahrplan soll jeder Sitzung zeigen, wo ihr Auftrag im Ganzen steht. Er bleibt bewusst grob. Details entstehen erst, wenn ein Baustein drankommt.

## Bausteine

| Baustein | Stand | Hängt ab von |
| --- | --- | --- |
| A. Stationen: nötig, freiwillig, Spätblüher | umgesetzt am 19.11.2026; Aufteilung vorläufig angenommen, Daniel testet sie in der App | – |
| B. Weg als Klostergarten: Bild und Optik | Klostergarten mit Kapelle als Ziel entschieden. Erster Anlauf (24. und 25.11.2026) ist Archiv. Neuanfang Schritt für Schritt (GARTEN-NEU.md), Ebene 0 am 25.11.2026 geklärt. Ebene 1 (graues Gerüst) am 25.11.2026 beantwortet, Ebene 2 (Aussehen) zurückgestellt. Stil am 26.11.2026 gewählt: gemaltes Bilderbuch. Am 26.11.2026 von Einzelteilen auf ein KI-Bild je Bereich umgestellt (Claudes Wahl, Daniel: „Richtung passt vorerst“). Bereich 1 und 2 fertig, beide als Bildlauf wie in der App (`geruest/garten-lauf.html`, 26.11.2026). Daniel: „Optik passt grundsätzlich“, Bereich 1 und 2 aber zu ähnlich; vor allen Etappen zuerst das Aussehen je Etappe überlegen. Dann Einbau (Plan unten). Bereiche 3 bis 11 je Etappe mit C | A, J; Bereiche 3 bis 11: C |
| C. Etappen 3 bis 11 | Themen vorläufig bestätigt; Übungen offen | – |
| D. Übe-Teil: Stimmbildung, Lieder aus dem Repertoire | dass es ihn gibt, ist entschieden; Inhalt offen; die Lieder liegen nur als PDF vor | – |
| E. Konten | Konten, wenn kostenlos umsetzbar (siehe unten); nach J, Schritt 5 im Plan | J |
| F. Abzeichen | vorläufig, eventuell später neu; Bronze, Silber und Gold hängen an Leicht, Mittel und Schwer und werden hier neu gefasst (ENTSCHEIDUNGEN.md, 19.11.2026) | B, J |
| G. Mikrofon | nur als Zusatz | – |
| H. Merklieder für Intervalle aus dem Chorliederbuch | Idee bestätigt | C, Noten aus den PDFs |
| I. Testphase mit einigen Sängern, danach Einführung im Chor | offen | – |
| J. Gezielt üben nach dem Weg; nicht bearbeitete Übungen und Fortschritt im Garten verbinden | Konzept abgeschlossen am 19.11.2026: Richtung 3, Ausbau und Pflege (ENTSCHEIDUNGEN.md); Einzelheiten Vorschlag in GEZIELT-UEBEN.md; Umsetzung offen; die Teile ohne Gartenbild kommen vor E (Daniels Wahl vom 26.11.2026), Schritt 3 im Plan | A |

## Plan bis zum Schluss (26.11.2026, von Daniel bestätigt)

Befund vom 26.11.2026: Ein Gartenbereich lässt sich erst malen, wenn die Stationen seiner Etappe feststehen. Ab Etappe 3 gehören Inhalt (C) und Garten (B) deshalb zusammen, als ein Paket je Etappe.

| Phase | Inhalt | Ergebnis |
| --- | --- | --- |
| 1. Testversion | Garten mit Bereich 1 und 2 in der App (B), gezielt üben ohne Gartenbild (J), Konten (E), Daniels Test auf dem Handy | Etappen 1 und 2 vollständig, so wie sie bleiben sollen |
| 2. Testphase | zwei oder drei Sänger üben ein bis zwei Wochen (I) | echte Rückmeldung, bevor neun Etappen entstehen |
| 3. Etappen-Pakete | vorher für alle Etappen überlegen, wie jede aussieht (Daniel, 26.11.2026); dann je Etappe 3 bis 11: Übungen und Stationen (C), dann ihr Gartenbereich (B), Test, Freigabe | die App wächst Etappe für Etappe; danach Reihenfolge der Etappen prüfen (Bereiche lassen sich tauschen) |
| 4. Abschluss | Kapelle, Abzeichen neu (F), Pflege-Zeichen im Garten (J), Übe-Teil (D), Merklieder (H), Mikrofon als Zusatz (G) | Einführung im ganzen Chor (I) |

Nächste Schritte in Phase 1:

1. Daniel sieht den Garten an (`geruest/buehne.html`, `geruest/anschluss.html`). Erledigt am 26.11.2026: „Richtung passt vorerst.“
2. B: Bereich 1 vollständig im Blickwinkel von Bereich 2, beide als Bildlauf wie in der App (390 Pixel, Wiesenstreifen sauber, Stationen, „Zu mir“, „Weiter“, „Plan“ als Attrappe). Eingabe-Regeln in den Skill `garten-grafik`. Daniel entscheidet über das Aussehen. Erledigt am 26.11.2026 (`geruest/garten-lauf.html`): „Optik passt grundsätzlich“, aber Bereich 1 und 2 zu ähnlich (ENTSCHEIDUNGEN.md).
3. J ohne Gartenbild: Freischalten nach den nötigen Stationen, Üben im Reiter „Themen“ zählt für die Stationen, Fortschritt je Thema, je Übung „zuletzt geübt“ und Fehlerquote speichern. Kleine Runde mit Daniel: wonach man im Reiter statt Leicht, Mittel und Schwer wählt. Kann parallel zu Schritt 2 laufen (andere Dateien).
4. B in die App: Garten ersetzt die Notenzeile in `js/views/weg.js`, Ebenen auf Zonen zugeschnitten, Stationen und Knöpfe nach Ebene 1, Runde mit Daniel zu gesperrten Bereichen, Optik der App leicht angleichen, Tests und Klicktest, dann mit Daniels Ja nach `main` für den Handytest.
5. E: Daniels zwei Antworten (Anmeldeart, ohne Konto nutzbar?), eigenes Supabase-Projekt mit Daniels Ja, Fortschritt auf dem Gerät mit Abgleich.

## Konten: Prüfung vom 19.11.2026

Ergebnis: kostenlos umsetzbar, mit diesen Bedingungen.

- **Ort:** Supabase erlaubt im kostenlosen Tarif zwei aktive Projekte. Eines nutzt die Dirigenten-App, eines ist frei. Vorschlag: ein eigenes Projekt für die Sänger-App. Im Projekt der Dirigenten-App wären Sänger im selben Anmeldesystem wie die Dirigenten, und jede Freigabe dort müsste das sauber unterscheiden.
- **Pause:** Kostenlose Projekte pausieren nach einer Woche ohne Nutzung und müssen dann im Supabase-Dashboard wieder gestartet werden. Vorschlag: Der Fortschritt bleibt zuerst auf dem Gerät und wird mit dem Konto abgeglichen. Ist das Projekt pausiert, funktioniert die App weiter, nur der Abgleich wartet.
- **E-Mails:** Der eingebaute E-Mail-Versand von Supabase schickt nur an Mitglieder des eigenen Teams und höchstens zwei Mails pro Stunde. Für Sänger kommen deshalb nur diese Anmeldearten ohne Kosten in Frage:
  - E-Mail und Passwort ohne Bestätigungsmail. Es werden keine Mails verschickt, ein vergessenes Passwort setzt Daniel im Dashboard zurück.
  - Mit Google anmelden. Es werden keine Mails verschickt, aber nicht jeder hat oder will ein Google-Konto.
  - Code oder Link per E-Mail. Das braucht einen externen E-Mail-Dienst mit kostenlosem Kontingent, mehr Einrichtung, und Mails können im Spam landen.
- **Offen:** welche Anmeldeart, und ob die App ohne Konto weiter nutzbar bleibt.

## Strukturen

Welche Strukturen sinnvoll sind, überlässt Daniel Claude (ENTSCHEIDUNGEN.md, 19.11.2026). Gewählt:

- dieser Fahrplan, grob gehalten. Ist ein Baustein fertig oder ändert sich etwas, die Tabelle anpassen.
- ein Prüf-Blickwinkel für Texte aus Sicht eines Sängers ohne Notenkenntnis (CLAUDE.md, „Prüfen“).

Bewusst nicht gewählt: feste Rollen wie in einem Unternehmen und simulierte Sänger. Die Testphase (I) mit echten Sängern ersetzt die Simulation. Neue Strukturen erst, wenn ein Problem wiederkehrt.
