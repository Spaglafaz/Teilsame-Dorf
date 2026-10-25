"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, CustomEase, Flip, useGSAP);
  // Ruhige, «landende» Bewegung – passt zur Marke: nichts springt, alles setzt sanft auf.
  CustomEase.create("ruhig", "0.22, 1, 0.36, 1");
  // Für Vorhang und grosse Flächen: kräftig anfahren, weich abbremsen
  CustomEase.create("vorhang", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "ruhig", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const BEWEGUNG_ERLAUBT = "(prefers-reduced-motion: no-preference)";
export const MIT_MAUS = "(hover: hover) and (pointer: fine)";

export const bewegungReduziert = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, Flip, useGSAP };
