"use client";

import { useRef, useState } from "react";
import { gsap, Flip, useGSAP, bewegungReduziert } from "@/lib/gsap";

/**
 * Filterknöpfe + animiertes Umordnen der Einträge (Kategorie im data-kat-Attribut).
 * Eine Pille gleitet zum aktiven Knopf; die Einträge fliessen mit GSAP Flip an ihre neuen Plätze.
 */
export default function Filterliste({ kategorien, children, label }: { kategorien: readonly string[]; children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState<string>("Alle");

  const pilleZu = (knopf: HTMLElement | null, sofort = false) => {
    const pille = ref.current?.querySelector<HTMLElement>(".filter__pille");
    if (!pille || !knopf) return;
    gsap.to(pille, {
      x: knopf.offsetLeft,
      y: knopf.offsetTop,
      width: knopf.offsetWidth,
      height: knopf.offsetHeight,
      autoAlpha: 1,
      duration: sofort || bewegungReduziert() ? 0 : 0.6,
      ease: "elastic.out(1, 0.75)",
    });
  };

  const { contextSafe } = useGSAP(
    () => {
      const erster = ref.current!.querySelector<HTMLElement>(".filter button");
      pilleZu(erster, true);
      const neu = () => pilleZu(ref.current!.querySelector<HTMLElement>('.filter button[aria-pressed="true"]'), true);
      window.addEventListener("resize", neu);
      document.fonts?.ready.then(neu);
      return () => window.removeEventListener("resize", neu);
    },
    { scope: ref }
  );

  const waehlen = contextSafe((k: string, knopf: HTMLElement) => {
    setAktiv(k);
    pilleZu(knopf);
    const eintraege = Array.from(ref.current!.querySelectorAll<HTMLElement>("[data-kat]"));
    const zeigen = (e: HTMLElement) => k === "Alle" || e.dataset.kat === k;

    if (bewegungReduziert()) {
      eintraege.forEach((e) => (e.hidden = !zeigen(e)));
      return;
    }
    const zustand = Flip.getState(eintraege, { props: "opacity" });
    eintraege.forEach((e) => (e.hidden = !zeigen(e)));
    Flip.from(zustand, {
      duration: 0.7,
      ease: "ruhig",
      stagger: 0.03,
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.04, delay: 0.05 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.97, duration: 0.3 }),
    });
  });

  return (
    <div ref={ref}>
      <div className="filter" role="group" aria-label={label} data-reveal="">
        <span className="filter__pille" aria-hidden="true" />
        {["Alle", ...kategorien].map((k) => (
          <button key={k} type="button" aria-pressed={aktiv === k} onClick={(e) => waehlen(k, e.currentTarget)}>{k}</button>
        ))}
      </div>
      {children}
    </div>
  );
}
