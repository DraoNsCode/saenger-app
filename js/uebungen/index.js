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
import notenname from './notenname.js';
import findeNote from './finde-note.js';
import weiterzaehlen from './weiterzaehlen.js';
import klavier from './klavier.js';
import mitzaehlen from './mitzaehlen.js';
import auftakt from './auftakt.js';
import achtelHoeren from './achtel-hoeren.js';
import achtelKlopfen from './achtel-klopfen.js';
import ganzHalbton from './ganz-halbton.js';
import tonleiter from './tonleiter.js';
import zifferLesen from './ziffer-lesen.js';
import stufenHoeren from './stufen-hoeren.js';
import zeichen from './zeichen.js';
import ablauf from './ablauf.js';
import strophen from './strophen.js';
import { intervallLesen, intervallHoeren } from './intervalle.js';
import punktierung from './punktierung.js';
import zweiSchlaege from './zwei-schlaege.js';
import punktHoeren from './punkt-hoeren.js';
import { durMoll, dreiklang, einsatzton } from './zusammenklang.js';
import { vorzeichen, tonart } from './vorzeichen.js';
import { synkope, schlagGruppen } from './rhythmus-fein.js';

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
    notenname,
    findeNote,
    weiterzaehlen,
    klavier,
    mitzaehlen,
    auftakt,
    achtelHoeren,
    achtelKlopfen,
    ganzHalbton,
    tonleiter,
    zifferLesen,
    stufenHoeren,
    zeichen,
    ablauf,
    strophen,
    intervallLesen,
    intervallHoeren,
    punktierung,
    zweiSchlaege,
    punktHoeren,
    dreiklang,
    durMoll,
    einsatzton,
    vorzeichen,
    tonart,
    synkope,
    schlagGruppen,
  ].map((u) => [u.id, u])
);
