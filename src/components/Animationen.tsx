"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, BEWEGUNG_ERLAUBT, bewegungReduziert } from "@/lib/gsap";
import { bereit, nachIntro } from "@/lib/buehne";

/**
 * Zentrale Scroll-Animationen für jede Seite. Komponenten markieren Elemente nur mit data-Attributen:
 *  data-reveal            sanft einblenden (von unten)
 *  data-reveal="links|rechts|skala"  Richtung/Art
 *  data-stagger           Kinder nacheinander einblenden (Bilder öffnen sich, Haken zeichnen sich)
 *  data-split             Titel zeilenweise aus einer Maske heben
 *  data-parallax="0.15"   Bild verschiebt sich beim Scrollen (Faktor)
 *  data-count="50"        Zahl hochzählen
 *  data-draw              SVG-Pfade zeichnen, wenn sichtbar
 *  data-zeitleiste        Linie wächst mit dem Scrollen, Punkte leuchten auf
 *
 * Hover-Effekte (Neigen, Magnet, Welle, Zeiger) laufen global in Mikro.tsx / Zeiger.tsx.
 * Die Animationen starten erst, wenn Intro und Seitenwechsel-Vorhang weg sind.
 */
export default function Animationen({
  children,
  eintritt = true,
  mitVorhang = true,
}: {
  children: React.ReactNode;
  eintritt?: boolean;
  mitVorhang?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const root = ref.current;
      if (!root) return;
      const q = <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T & Element>(s)) as T[];
      let mm: gsap.MatchMedia | null = null;
      let beendet = false;

      const start = contextSafe!(() => {
        if (beendet) return;
        mm = gsap.matchMedia();

        mm.add(BEWEGUNG_ERLAUBT, () => {
          // Seiteneintritt: Inhalt setzt ruhig auf
          if (eintritt) gsap.from(root, { autoAlpha: 0, y: 30, duration: 1, clearProps: "transform,opacity,visibility" });

          // Titel zeilenweise, mit leichter Neigung
          q<HTMLElement>("[data-split]").forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-zeile",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 110,
                  rotate: 1.5,
                  transformOrigin: "0% 100%",
                  duration: 1.2,
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 88%", once: true },
                });
              },
            });
          });

          // Einfache Einblendungen
          q<HTMLElement>("[data-reveal]").forEach((el) => {
            const art = el.dataset.reveal;
            const von: gsap.TweenVars =
              art === "links" ? { x: -40 } : art === "rechts" ? { x: 40 } : art === "skala" ? { scale: 0.94, y: 30 } : { y: 40 };
            const st = { trigger: el, start: "top 90%", once: true };
            gsap.fromTo(
              el,
              { autoAlpha: 0, ...von },
              { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1.1, delay: Number(el.dataset.verzoegerung || 0), scrollTrigger: st }
            );
            // Überzeilen: die feinen Linien wachsen aus der Mitte
            const linien = el.querySelectorAll(".ueberzeile__linie");
            if (linien.length) gsap.fromTo(linien, { scaleX: 0 }, { scaleX: 1, duration: 1.2, delay: 0.25, stagger: 0.1, scrollTrigger: st });
          });

          // Gruppen nacheinander – Bilder öffnen sich wie ein Fenster, Haken zeichnen sich
          q<HTMLElement>("[data-stagger]").forEach((gruppe) => {
            const kinder = Array.from(gruppe.children) as HTMLElement[];
            if (!kinder.length) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: gruppe, start: "top 88%", once: true } });
            tl.fromTo(kinder, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0);

            const bilder = kinder.map((k) => k.querySelector<HTMLElement>(".bkarte__bild, .person__foto, .news__bild")).filter(Boolean) as HTMLElement[];
            if (bilder.length) {
              tl.fromTo(bilder, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.1, ease: "power3.inOut", clearProps: "clipPath" }, 0.05);
            }
            const nummern = kinder.map((k) => k.querySelector(".bkarte__nr")).filter(Boolean) as Element[];
            if (nummern.length) tl.from(nummern, { scale: 0, rotate: -90, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, 0.5);

            const haken = kinder.flatMap((k) => Array.from(k.querySelectorAll(".aufgaben__haken")));
            if (haken.length) {
              tl.from(haken, { scale: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2.2)" }, 0.15);
              tl.fromTo(haken.map((h) => h.querySelector("path")), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.4);
            }
          });

          // Parallax in Bildrahmen
          q<HTMLElement>("[data-parallax]").forEach((el) => {
            const f = Number(el.dataset.parallax || 0.12);
            gsap.fromTo(
              el,
              { yPercent: -f * 50 },
              { yPercent: f * 50, ease: "none", scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true } }
            );
          });

          // SVG-Linien zeichnen
          q<HTMLElement>("[data-draw]").forEach((svg) => {
            const pfade = svg.querySelectorAll("path, circle, line, polyline");
            gsap.fromTo(
              pfade,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 2.2, stagger: 0.12, ease: "power2.inOut", scrollTrigger: { trigger: svg, start: "top 92%", once: true } }
            );
          });

          // Zeitleiste: Linie wächst, Punkte leuchten auf, sobald die Linie sie erreicht
          q<HTMLElement>("[data-zeitleiste]").forEach((linie) => {
            const huelle = linie.parentElement!;
            gsap.fromTo(linie, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: huelle, start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
            huelle.querySelectorAll("li").forEach((li) =>
              ScrollTrigger.create({ trigger: li, start: "top 70%", toggleClass: "ist-erreicht" })
            );
          });

          // Fusszeile: Bergketten schieben sich in Ebenen nach oben (Tiefe)
          q<SVGPathElement>(".fuss__landschaft path").forEach((p, i, alle) => {
            gsap.fromTo(p, { y: 30 * (alle.length - i) }, { y: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true } });
          });
        });

        // Zähler laufen auch ohne Bewegung – dann aber sofort auf dem Endwert
        q<HTMLElement>("[data-count]").forEach((el) => {
          const ziel = Number(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          if (bewegungReduziert()) { el.textContent = `${ziel}${suffix}`; return; }
          const obj = { n: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(obj, {
            n: ziel,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => { el.textContent = `${Math.round(obj.n)}${suffix}`; },
          });
        });

        ScrollTrigger.refresh();
      });

      const abbruch = mitVorhang ? bereit(start) : nachIntro(start);

      // Bilder laden nach – Positionen neu berechnen
      const neu = () => ScrollTrigger.refresh();
      window.addEventListener("load", neu);
      document.fonts?.ready.then(neu);
      return () => {
        beendet = true;
        abbruch();
        window.removeEventListener("load", neu);
        mm?.revert();
      };
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
