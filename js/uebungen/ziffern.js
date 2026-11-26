// Gemeinsame Hilfen für Etappe 5 „Tonleiter und Ziffern“. Vorschlag von Claude vom 26.11.2026, umgesetzt,
// von Daniel noch nicht entschieden (LERNWEG.md, „Stationen der Etappe 5“).
// Ziffern wie im Chor (ENTSCHEIDUNGEN.md, „Sprache des Chors“): Die 1 ist der Grundton, die obere 1 bleibt die 1.
// Gelesen wird in C-Dur (die 1 ist das c), weil Vorzeichen erst in Etappe 10 kommen. Gehört wird in wechselnden Tonarten.

// Halbtonschritte der Dur-Tonleiter von Stufe zu Stufe (1→2 … 7→1)
export const DUR = [2, 2, 1, 2, 2, 2, 1];

// Halbton zwischen zwei benachbarten weißen Tasten? (e–f und h–c)
export function istHalbton(name1, name2) {
  const paar = [name1, name2].sort().join('');
  return paar === 'ef' || paar === 'ch';
}

// Ziffer einer Stufe 0 … 6 (die obere 1 bleibt die 1)
export function ziffer(stufe) {
  return String((((stufe % 7) + 7) % 7) + 1);
}

// MIDI-Abstand des Grundtons zur Stufe (0 … 6)
export function halbtoeneBis(stufe) {
  return DUR.slice(0, stufe).reduce((s, x) => s + x, 0);
}

// Grundton zum Hören je Stimme, damit die Töne bequem in der eigenen Lage klingen
export const GRUNDTON = { S: [60, 65], A: [57, 62], T: [50, 55], B: [43, 48] };
