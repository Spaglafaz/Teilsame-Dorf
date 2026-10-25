"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, BEWEGUNG_ERLAUBT, MIT_MAUS } from "@/lib/gsap";
import { bereit } from "@/lib/buehne";
import { Button } from "./Bausteine";

export default function Hero({
  bild,
  bildAlt,
  ueberzeile,
  titel,
  lead,
  fakten,
}: {
  bild: string;
  bildAlt: string;
  ueberzeile: string;
  titel: string;
  lead: string;
  fakten: string[];
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_c, contextSafe) => {
      const el = ref.current!;
      const mm = gsap.matchMedia();

      mm.add(BEWEGUNG_ERLAUBT, () => {
        const titelEl = el.querySelector("h1")!;
        gsap.set(titelEl, { autoAlpha: 0 });
        let split: SplitText | null = null;
        const aufraeumen: (() => void)[] = [];

        const abbruch = bereit(contextSafe!(() => {
          split = SplitText.create(titelEl, { type: "words,lines", mask: "lines", linesClass: "split-zeile" });
          gsap.set(titelEl, { autoAlpha: 1 });

          const tl = gsap.timeline({ defaults: { ease: "ruhig" } });
          tl.fromTo(".hero__bild", { scale: 1.22, autoAlpha: 0 }, { scale: 1.04, autoAlpha: 1, duration: 2.6, ease: "power2.out" }, 0)
            .fromTo(".hero__schleier", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0)
            .fromTo(".hero .ueberzeile", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.4)
            .fromTo(".hero .ueberzeile__linie", { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, 0.5)
            .from(split.words, { yPercent: 115, rotate: 3, filter: "blur(6px)", duration: 1.3, stagger: 0.07, clearProps: "filter" }, 0.55)
            .fromTo(".hero__lead", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.1)
            .fromTo(".hero .btn-huelle", { autoAlpha: 0, y: 24, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 0.1 }, 1.25)
            .fromTo(".hero__fakten", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.45)
            .fromTo(".hero__fakten", { "--strich": 0 }, { "--strich": 1, duration: 1.4, ease: "power2.inOut" }, 1.45)
            .from(".hero__fakten li", { autoAlpha: 0, y: 12, stagger: 0.12, duration: 0.8 }, 1.6)
            .fromTo(".hero__scroll", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 2);

          // Scroll-Hinweis: kleiner Punkt wandert
          gsap.to(".hero__scroll span", { y: 14, autoAlpha: 0, duration: 1.4, repeat: -1, ease: "power1.in", delay: 2.4 });

          // Beim Wegscrollen: Bild langsamer (Parallax), Inhalt hebt sich und blendet aus
          gsap.to(".hero__bild-rahmen", { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
          gsap.to(".hero__inhalt", { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

          // Mit der Maus: Bild und Inhalt verschieben sich leicht gegeneinander (Tiefe)
          if (window.matchMedia(MIT_MAUS).matches) {
            const bx = gsap.quickTo(".hero__bild", "x", { duration: 1.6, ease: "power3" });
            const by = gsap.quickTo(".hero__bild", "y", { duration: 1.6, ease: "power3" });
            const ix = gsap.quickTo(".hero__inhalt", "x", { duration: 1.6, ease: "power3" });
            const bewegen = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              bx(nx * -26); by(ny * -16); ix(nx * 10);
            };
            el.addEventListener("pointermove", bewegen);
            aufraeumen.push(() => el.removeEventListener("pointermove", bewegen));
          }
        }));

        return () => { abbruch(); split?.revert(); aufraeumen.forEach((f) => f()); };
      });

      // Ohne Bewegung: alles sofort sichtbar
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll("[data-hero-teil]"), { autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-titel">
      <div className="hero__bild-rahmen">
        <img className="hero__bild" src={bild} alt={bildAlt} fetchPriority="high" data-hero-teil="" />
      </div>
      <div className="hero__schleier" data-hero-teil="" />
      <div className="hero__inhalt">
        <p className="ueberzeile ueberzeile--mitte ueberzeile--hell" data-hero-teil="">
          <span className="ueberzeile__linie" aria-hidden="true" />
          {ueberzeile}
          <span className="ueberzeile__linie" aria-hidden="true" />
        </p>
        <h1 id="hero-titel">{titel}</h1>
        <p className="hero__lead" data-hero-teil="">{lead}</p>
        <div className="knopfreihe">
          <span data-hero-teil="" className="btn-huelle"><Button href="/ueber-uns/teilenrat/" aufFoto magnet>Über uns</Button></span>
          <span data-hero-teil="" className="btn-huelle"><Button href="/kontakt/" variante="hell" magnet>Kontakt</Button></span>
        </div>
        <ul className="hero__fakten" data-hero-teil="">
          {fakten.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <div className="hero__scroll" aria-hidden="true" data-hero-teil=""><span /></div>
    </section>
  );
}
