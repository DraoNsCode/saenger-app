import linieZwischenraum from './linie-zwischenraum.js';
import hoeherTiefer from './hoeher-tiefer.js';
import schrittSprung from './schritt-sprung.js';
import hoerenSehen from './hoeren-sehen.js';
import chorsatz from './chorsatz.js';
import grundschlag from './grundschlag.js';
import notenwerte from './notenwerte.js';
import welcherSchlag from './welcher-schlag.js';
import taktErgaenzen from './takt-ergaenzen.js';
import rhythmusErkennen from './rhythmus-erkennen.js';
import rhythmusKlopfen from './rhythmus-klopfen.js';

export const UEBUNGEN = Object.fromEntries(
  [
    linieZwischenraum,
    hoeherTiefer,
    schrittSprung,
    hoerenSehen,
    chorsatz,
    grundschlag,
    notenwerte,
    welcherSchlag,
    taktErgaenzen,
    rhythmusErkennen,
    rhythmusKlopfen,
  ].map((u) => [u.id, u])
);
