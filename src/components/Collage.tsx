"use client";

import { useRef } from "react";
import { gsap, useGSAP, BEWEGUNG_ERLAUBT } from "@/lib/gsap";
import { bereit } from "@/lib/buehne";

export default function Collage({
  haupt,
  hauptAlt,
  neben,
  nebenAlt,
  badge,
}: {
  haupt: string;
  hauptAlt: string;
  neben: string;
  nebenAlt: string;
  badge?: { wert: number; suffix?: string; label: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_c, contextSafe) => {
      const mm = gsap.matchMedia();
      const abbruch = bereit(contextSafe!(() => mm.add(BEWEGUNG_ERLAUBT, () => {
        const st = { trigger: ref.current, start: "top 80%", once: true };
        gsap.from(".collage__haupt", { clipPath: "inset(0 0 0 100%)", duration: 1.4, ease: "power3.inOut", scrollTrigger: st });
        gsap.from(".collage__neben", { y: 80, autoAlpha: 0, duration: 1.2, delay: 0.4, scrollTrigger: st });
        gsap.from(".collage__badge", { scale: 0.4, rotate: -40, autoAlpha: 0, duration: 1.2, delay: 0.8, ease: "back.out(1.6)", scrollTrigger: st });
        gsap.fromTo(".collage__badge circle", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, delay: 1, ease: "power2.inOut", scrollTrigger: st });
        // Tiefe beim Scrollen: die Bilder bewegen sich unterschiedlich schnell
        const scrub = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.to(".collage__neben", { yPercent: -14, ease: "none", scrollTrigger: scrub });
        gsap.to(".collage__badge", { yPercent: -40, ease: "none", scrollTrigger: scrub });
      })));
      return () => { abbruch(); mm.revert(); };
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className="collage">
      <div className="collage__haupt" data-tilt=""><img src={haupt} alt={hauptAlt} loading="lazy" data-parallax="0.12" /></div>
      <div className="collage__neben"><img src={neben} alt={nebenAlt} loading="lazy" /></div>
      {badge && (
        <div className="collage__badge">
          <svg viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="60" /></svg>
          <span>
            <span className="collage__badge-wert" data-count={badge.wert} data-suffix={badge.suffix || ""}>{badge.wert}{badge.suffix}</span>
            <span className="collage__badge-label">{badge.label}</span>
          </span>
        </div>
      )}
    </div>
  );
}
