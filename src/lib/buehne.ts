"use client";

import type { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Gemeinsamer Zustand der Animationen (ausserhalb von React, damit keine Neu-Renderings nötig sind):
 *  – der aktive ScrollSmoother (weiches Scrollen, nur mit Maus/Trackpad)
 *  – das Signal «Intro fertig», auf das Hero, Kopf und Termine warten
 */
let smoother: ScrollSmoother | null = null;
export const setSmoother = (s: ScrollSmoother | null) => { smoother = s; };
export const getSmoother = () => smoother;

let introAufloesen: () => void = () => {};
let introIstFertig = false;
const introVersprechen: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((r) => { introAufloesen = r; });

export function introFertig() {
  if (introIstFertig) return;
  introIstFertig = true;
  introAufloesen();
}
/** Startet fn nach dem Intro. Gibt eine Abbruch-Funktion zurück (für das Aufräumen von Effekten). */
export const nachIntro = (fn: () => void) => {
  let aktiv = true;
  introVersprechen.then(() => { if (aktiv) fn(); });
  return () => { aktiv = false; };
};
export const introLaeuftNoch = () => !introIstFertig;

/* Seitenwechsel-Vorhang: solange er die Seite bedeckt, warten neue Seiten mit ihren Animationen */
let vorhangBedeckt = false;
let warteliste: (() => void)[] = [];
export function vorhangZu() { vorhangBedeckt = true; }
export function vorhangAuf() {
  vorhangBedeckt = false;
  const l = warteliste;
  warteliste = [];
  l.forEach((fn) => fn());
}
const warteAufVorhang = (fn: () => void) => { if (vorhangBedeckt) warteliste.push(fn); else fn(); };

/** Startet fn, sobald Intro vorbei und Vorhang offen ist – dann sieht man die Animation auch. */
export const bereit = (fn: () => void) => {
  let aktiv = true;
  const abbruch = nachIntro(() => warteAufVorhang(() => { if (aktiv) fn(); }));
  return () => { aktiv = false; abbruch(); };
};

/** Nach oben springen – mit oder ohne Smoother */
export function nachObenScrollen(weich: boolean) {
  if (smoother) smoother.scrollTo(0, weich);
  else window.scrollTo({ top: 0, behavior: weich ? "smooth" : "auto" });
}
