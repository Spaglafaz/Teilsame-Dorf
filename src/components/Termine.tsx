"use client";

import { useRef } from "react";
import { gsap, useGSAP, BEWEGUNG_ERLAUBT } from "@/lib/gsap";
import { bereit } from "@/lib/buehne";
import { termine } from "@/inhalte/daten";

export default function Termine() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (_c, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(BEWEGUNG_ERLAUBT, () => {
        // Pulsierender Hahnenfuss-Punkt: «hier passiert etwas»
        gsap.to(".termine__puls", { boxShadow: "0 0 0 10px rgba(226, 181, 43, 0)", repeat: -1, duration: 1.8, ease: "power2.out" });
        gsap.set(ref.current, { y: 60, autoAlpha: 0 });
        return bereit(contextSafe!(() => {
          gsap.timeline({ delay: 1.5 })
            .to(ref.current, { y: 0, autoAlpha: 1, duration: 1.2 })
            .from(".termine h2, .termine p, .termine li", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.25);
        }));
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="termine" aria-labelledby="termine-titel">
      <h2 id="termine-titel"><span className="termine__puls" aria-hidden="true" />Termine</h2>
      {termine.length === 0 ? (
        <p className="termine__leer">Zurzeit sind keine Termine angekündigt. Die Einladung zur nächsten Einungsgemeinde folgt rechtzeitig.</p>
      ) : (
        <ul>
          {termine.slice(0, 3).map((t) => (
            <li key={t.datum + t.anlass}>
              <strong>{t.datum}</strong>
              <span><strong>{t.anlass}</strong>{(t.zeit || t.ort) && <><br />{[t.zeit, t.ort].filter(Boolean).join(" · ")}</>}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
