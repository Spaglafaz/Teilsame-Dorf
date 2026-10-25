"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, bewegungReduziert } from "@/lib/gsap";
import { nachObenScrollen } from "@/lib/buehne";

export default function NachOben() {
  const ref = useRef<HTMLButtonElement>(null);
  const UMFANG = 2 * Math.PI * 24;

  useGSAP(() => {
    const knopf = ref.current!;
    const ring = knopf.querySelector(".fortschritt") as SVGCircleElement;
    gsap.set(ring, { strokeDasharray: UMFANG, strokeDashoffset: UMFANG });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(ring, { strokeDashoffset: UMFANG * (1 - self.progress) });
        const zeigen = self.scroll() > 700;
        gsap.to(knopf, { autoAlpha: zeigen ? 1 : 0, y: zeigen ? 0 : 12, duration: 0.4, overwrite: "auto" });
      },
    });
    return () => st.kill();
  });

  const hoch = () => {
    nachObenScrollen(!bewegungReduziert());
    document.getElementById("inhalt")?.focus({ preventScroll: true });
  };

  return (
    <button ref={ref} className="nach-oben" onClick={hoch} aria-label="Nach oben" data-magnet="">
      <svg className="ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="spur" cx="26" cy="26" r="24" />
        <circle className="fortschritt" cx="26" cy="26" r="24" />
      </svg>
      <span className="nach-oben__fenster" aria-hidden="true">
        <svg className="nach-oben__pfeil" viewBox="0 0 16 16"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
      </span>
    </button>
  );
}
