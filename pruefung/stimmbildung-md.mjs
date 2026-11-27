// Erzeugt inhalt/stimmbildung.md aus js/ueben/stimmbildung.js, damit Daniel die Texte lesen kann.
// Schreiben: node pruefung/stimmbildung-md.mjs   Prüfen: npm test (stimmbildung.test.mjs)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { THEMEN, UEBUNGEN, ERKLAERUNGEN, ABLAEUFE } from '../js/ueben/stimmbildung.js';

const ALLGEMEIN = `## Für alle Übungen

Vorschlag, wie die Angaben gemeint sind:

- **Quelle:** **D** = Familie aus „dirigenten-app-uebungen“, **S** = Eintrag im Steinbruch „chor-uebungen“, **N** = neu. Die Texte sind für eine Person zu Hause neu geschrieben, Noten und Tempi meist übernommen.
- **Noten** in ABC wie in der Dirigenten-App, notiert in C. Die App verschiebt sie in die jeweilige Tonart.
- **Begleitung:**
  - **„Tonarten C bis F“** heißt: Die App beginnt in C und geht nach jedem Durchgang einen Halbton höher, bis F. Frauen singen wie notiert (C = c′), Männer eine Oktave tiefer. Wie weit Sopran und Tenor nach oben und Alt und Bass nach unten dürfen, wird in Phase 2 aus den Tonräumen in \`js/musik.js\` festgelegt.
  - **„Ein Ton zwischen es′ und g′“** heißt dasselbe für Übungen auf einem Ton: Die App beginnt auf es′ und wechselt nach jedem Durchgang um einen Halbton, bis g′.
  - **Übungen mit einem Muster aus mehreren Tönen:** Vor jedem Durchgang klingt kurz der Akkord der Tonart. Der erste Durchgang kommt zweimal, einmal zum Zuhören und einmal zum Mitsingen.
  - **Übungen auf einem Ton:** Die App spielt den Ton kurz vor und zählt vier Klicks vor. Während man singt, klingt der Ton leise weiter, und die Klicks laufen mit. So weiß man, wie lang jeder Teil dauert.
  - **Ende:** Ganz oben kehrt die App um, geht halbtonweise zurück bis zum Anfang und hört dann von selbst auf. „Nicht höher“ lässt sie sofort umkehren, „Stopp“ beendet die Übung.
  - **Knöpfe:** „Start“, „Nicht höher“, „Stopp“, Tempo langsamer und schneller.
  - **„Klicks“** heißt: Die App gibt die Schläge im angegebenen Tempo hörbar vor. In den Texten für die Sänger steht „Klicks“, weil man sie hört. „Schlag“ lernen die Sänger erst in Etappe 2.
- **Für die App:** Zeilen, die so beginnen, sind Angaben für die Umsetzung. Die Sänger sehen sie nicht. Sie sehen den Text und das Notenbild.
- **Wörter**, die in den Texten für die Sänger vermieden werden (Prüfblicke vom 26. und 27.11.2026): „gebunden“, „absetzen“, „staccato“, „Phrase“ und „Stufen“ für Varianten, weil „Stufen“ im Chor die Ziffern meint. „Dreiklang“ kommt erst in Etappe 9 des Lernwegs und steht deshalb hier nicht.
- **Ziffern** stehen in den Angaben für Daniel. Für die Sänger sind sie nur eine Hilfe, keine Bedingung.
- **Prüfblick vom 27.11.2026:** Alle Texte sind aus Sicht eines Sängers ohne Notenkenntnis gelesen und danach überarbeitet worden: Dauer in Klicks, Ende jeder Übung, Widersprüche zwischen Übungen, Fachangaben aus den Texten genommen. Beim Probestück ist dadurch Schritt 4 um das Ende ergänzt.
`;

const titelVon = (id) => UEBUNGEN.find((u) => u.id === id).titel;

function abc(t) {
  return ['```abc', t, '```', ''];
}

function uebung(u) {
  const z = [`### ${u.titel}`, ''];
  const meta = [`Quelle ${u.quelle}`, `Begleitung: ${u.begleitungText}`];
  if (u.hinweis) meta.push(u.hinweis);
  z.push(`*Für die App: ${meta.join(' · ')}*`, '');
  z.push(`**Wozu:** ${u.wozu}`, '');
  if (u.schritte?.length) {
    z.push("**So geht's:**");
    u.schritte.forEach((s, i) => z.push(`${i + 1}. ${s}`));
    z.push('');
  }
  if (u.gelingt) z.push(`**Gelingt, wenn** ${u.gelingt}`, '');
  if (u.fehler) z.push(`**Typischer Fehler:** ${u.fehler} **Was hilft:** ${u.hilft}`, '');
  if (u.achtung) z.push(`**Achtung:** ${u.achtung}`, '');
  if (u.tipp) z.push(`**Tipp:** ${u.tipp}`, '');
  if (u.notenText) z.push(`*Für die App, Noten:* ${u.notenText}`, '');
  if (u.abc) z.push(...abc(u.abc));
  if (u.varianten?.length) {
    z.push('**Varianten:**');
    for (const v of u.varianten) z.push(`- **${v.name}:** ${v.text}`);
    z.push('');
    if (u.variantenHinweis) z.push(`*Für die App, Varianten:* ${u.variantenHinweis}`, '');
    for (const v of u.varianten) if (v.abc) z.push(`*Noten zu „${v.name}“:*`, '', ...abc(v.abc));
  }
  return z;
}

export function stimmbildungMarkdown() {
  const z = [
    '# Stimmbildung: Texte für den Übe-Teil (Vorschlag)',
    '',
    'Stand 27.11.2026, Baustein D. Vorschlag von Claude. Festgelegt sind nur die Übungsliste (UEBEN.md, Bereich 1), die Form des Probestücks „Vom Summen ins a“ und die beiden Abläufe, siehe [ENTSCHEIDUNGEN.md](../ENTSCHEIDUNGEN.md), Abschnitt „Übe-Teil“. Die Texte unten prüft Daniel.',
    '',
    '**Diese Datei wird erzeugt** aus `js/ueben/stimmbildung.js` (`node pruefung/stimmbildung-md.mjs`). Änderungen dort vornehmen, nicht hier. In der App stehen die Übungen unter „Üben“, „Besser singen“.',
    '',
    ALLGEMEIN.trim(),
    '',
  ];
  for (const t of THEMEN) {
    z.push('---', '', `## ${t.titel}`, '');
    for (const u of UEBUNGEN.filter((u) => u.thema === t.id)) z.push(...uebung(u));
  }
  z.push('---', '', '## Erklärungen', '', 'Kurze Texte zum Lesen. Grafiken gibt es im Steinbruch zu „Atem“, „Brust- und Kopfstimme“ und „Aufrecht“. Sie sind noch nicht übernommen.', '');
  for (const e of ERKLAERUNGEN) {
    const meta = [`Quelle ${e.quelle}`];
    if (e.quellen) meta.push(e.quellen);
    if (e.passtZu) meta.push('passt zu: ' + e.passtZu.map(titelVon).join(', '));
    z.push(`### ${e.titel}`, '', `*Für die App: ${meta.join(' · ')}*`, '', `**Kurz:** ${e.kurz}`, '');
    for (const a of e.absaetze) z.push(a, '');
  }
  z.push('---', '', '## Abläufe', '', 'Daniel: Beide Abläufe soll es geben (27.11.2026). Wie sie aufgebaut sind, ist Vorschlag. Je Schritt wählt die App von Mal zu Mal die nächste Möglichkeit. Bei Übungen mit Begleitung erscheint „Weiter“ nach zwei Durchgängen, bei Übungen ohne Begleitung gleich. Den Strohhalm wählt die App nur, wenn in den Einstellungen „Ich habe einen Strohhalm“ an ist.', '');
  for (const a of ABLAEUFE) {
    z.push(`### ${a.titel}`, '', `**Kurz:** ${a.kurz}`, '', '| Schritt | Möglichkeiten, von Mal zu Mal die nächste |', '| --- | --- |');
    for (const s of a.schritte) {
      const w = s.wahl.map((x) => {
        const u = UEBUNGEN.find((u) => u.id === x.uebung);
        let n = x.variante != null ? `${u.titel}: ${u.varianten[x.variante].name}` : u.titel;
        if (x.strohhalm) n += ' (nur mit Strohhalm)';
        return n;
      });
      z.push(`| ${s.name} | ${w.join(' · ')} |`);
    }
    z.push('');
    if (a.schluss) z.push(`Zum Schluss: „${a.schluss}“`, '');
  }
  return z.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../inhalt/stimmbildung.md', import.meta.url), stimmbildungMarkdown());
  console.log('inhalt/stimmbildung.md geschrieben');
}
