"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, bewegungReduziert } from "@/lib/gsap";
import { introFertig } from "@/lib/buehne";

/**
 * Intro beim ersten Besuch pro Sitzung: Höhenlinien zeichnen sich, die Wortmarke hebt sich aus der Maske,
 * dann zieht sich die tannengrüne Fläche nach oben weg und gibt die Seite frei.
 * Ob es schon gelaufen ist, merkt sich ein Skript im <head> (Klasse «intro-gesehen») – so blitzt nichts auf.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const html = document.documentElement;
      if (html.classList.contains("intro-gesehen") || bewegungReduziert()) {
        html.classList.remove("intro-laeuft");
        html.classList.add("intro-gesehen");
        introFertig();
        return;
      }
      try { sessionStorage.setItem("tl-intro", "1"); } catch {}

      const gross = SplitText.create(el.querySelector(".intro__gross"), { type: "chars", mask: "chars" });
      const zahl = el.querySelector(".intro__zahl")!;
      const z = { n: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "ruhig" },
        onComplete: () => {
          html.classList.remove("intro-laeuft");
          html.classList.add("intro-gesehen");
          gross.revert();
        },
      });
      tl.fromTo(el.querySelectorAll(".intro__linien path"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.8, stagger: 0.08, ease: "power2.inOut" }, 0)
        .from(".intro__klein", { autoAlpha: 0, y: 14, letterSpacing: "0.6em", duration: 1 }, 0.2)
        .from(gross.chars, { yPercent: 110, duration: 1, stagger: 0.035 }, 0.35)
        .fromTo(".intro__strich", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.3)
        .to(z, { n: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { zahl.textContent = String(Math.round(z.n)).padStart(3, "0"); } }, 0.3)
        .to(".intro__marke, .intro__fuss", { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, 1.85)
        .to(".intro__linien", { scale: 1.15, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, 1.85)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "vorhang" }, 2.1)
        // Die Seite darf schon loslegen, während sich der Vorhang hebt
        .call(introFertig, [], 2.35)
        .set(el, { display: "none" });
    },
    { scope: ref }
  );

  // Höhenlinien als konzentrische, leicht unregelmässige Ringe – wie auf der Landeskarte
  const ringe = Array.from({ length: 7 }, (_, i) => {
    const r = 70 + i * 46;
    const w = 8 + i * 5;
    return `M ${500 - r} 300 C ${500 - r} ${300 - r * 0.62 - w}, ${500 + r * 0.7} ${300 - r * 0.7}, ${500 + r} ${300 - w * 0.4} S ${500 + r * 0.4} ${300 + r * 0.72 + w}, ${500 - r * 0.2} ${300 + r * 0.6} S ${500 - r} ${300 + w}, ${500 - r} 300`;
  });

  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <svg className="intro__linien" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {ringe.map((d, i) => <path key={i} d={d} />)}
      </svg>
      <div className="intro__marke">
        <span className="intro__klein">Teilsame</span>
        <span className="intro__gross">Lungern-Dorf</span>
      </div>
      <div className="intro__fuss">
        <span>Lungern · Obwalden</span>
        <span className="intro__strich" />
        <span className="intro__zahl">000</span>
      </div>
    </div>
  );
}
