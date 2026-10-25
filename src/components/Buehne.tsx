"use client";

import { useRef } from "react";
import { gsap, ScrollSmoother, useGSAP, BEWEGUNG_ERLAUBT, MIT_MAUS } from "@/lib/gsap";
import { setSmoother } from "@/lib/buehne";

/**
 * Bühne: weiches Scrollen (ScrollSmoother, nur mit Maus/Trackpad – Touch bleibt nativ)
 * und der feine Lesefortschritt am oberen Rand.
 * Feste Elemente (Kopf, Menü, Nach-oben, Zeiger, Vorhang) liegen ausserhalb.
 */
export default function Buehne({ children }: { children: React.ReactNode }) {
  const balken = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(`${BEWEGUNG_ERLAUBT} and ${MIT_MAUS}`, () => {
      const s = ScrollSmoother.create({
        wrapper: "#glatt-huelle",
        content: "#glatt-inhalt",
        smooth: 1.1,
        effects: false,
        smoothTouch: false,
      });
      setSmoother(s);
      return () => { setSmoother(null); s.kill(); };
    });

    mm.add(BEWEGUNG_ERLAUBT, () => {
      gsap.fromTo(balken.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } });
    });
  });

  return (
    <>
      <div ref={balken} className="lesefortschritt" aria-hidden="true" />
      <div id="glatt-huelle">
        <div id="glatt-inhalt">{children}</div>
      </div>
    </>
  );
}
