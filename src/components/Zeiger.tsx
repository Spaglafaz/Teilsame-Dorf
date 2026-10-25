"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, BEWEGUNG_ERLAUBT, MIT_MAUS } from "@/lib/gsap";

/**
 * Eigener Mauszeiger (nur mit Maus): ein Punkt, der genau folgt, und ein Ring, der weich nachzieht.
 * Über Links wird der Ring zur invertierenden Linse, über Karten erscheint ein Hinweis («Öffnen»),
 * in Eingabefeldern weicht er dem normalen Textcursor.
 */
export default function Zeiger() {
  const punkt = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const zuruecksetzen = useRef<() => void>(() => {});
  const pfad = usePathname();

  // Nach einem Seitenwechsel liegt etwas anderes unter dem Zeiger – Zustand zurücksetzen
  useEffect(() => { zuruecksetzen.current(); }, [pfad]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MIT_MAUS} and ${BEWEGUNG_ERLAUBT}`, () => {
      const p = punkt.current!;
      const r = ring.current!;
      const html = document.documentElement;
      html.classList.add("mit-zeiger");
      gsap.set([p, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const px = gsap.quickTo(p, "x", { duration: 0.12, ease: "power3" });
      const py = gsap.quickTo(p, "y", { duration: 0.12, ease: "power3" });
      const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
      const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });

      let sichtbar = false;
      let modus = "";

      const setzeModus = (neu: string, text = "") => {
        if (neu === modus && neu !== "label") return;
        modus = neu;
        r.classList.toggle("ist-link", neu === "link");
        r.classList.toggle("ist-label", neu === "label");
        p.classList.toggle("ist-weg", neu !== "");
        if (neu === "label") label.current!.textContent = text;
        gsap.to([p, r], { autoAlpha: neu === "text" ? 0 : 1, duration: 0.25, overwrite: "auto" });
      };

      zuruecksetzen.current = () => setzeModus("");

      const bewegen = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!sichtbar) {
          sichtbar = true;
          gsap.set([p, r], { x: e.clientX, y: e.clientY });
          gsap.to([p, r], { autoAlpha: 1, duration: 0.3 });
        }
        px(e.clientX); py(e.clientY); rx(e.clientX); ry(e.clientY);

        const t = e.target as Element;
        if (t.closest?.("input:not([type=checkbox]), textarea, select, [contenteditable]")) return setzeModus("text");
        const mitLabel = t.closest?.("[data-zeiger]") as HTMLElement | null;
        if (mitLabel) return setzeModus("label", mitLabel.dataset.zeiger);
        if (t.closest?.("a, button, label, [role=button], summary")) return setzeModus("link");
        setzeModus("");
      };
      const weg = () => { sichtbar = false; gsap.to([p, r], { autoAlpha: 0, duration: 0.25 }); };
      const runter = () => gsap.to(r, { scale: 0.8, duration: 0.2, overwrite: "auto" });
      const hoch = () => gsap.to(r, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)", overwrite: "auto" });

      window.addEventListener("pointermove", bewegen, { passive: true });
      document.documentElement.addEventListener("pointerleave", weg);
      window.addEventListener("pointerdown", runter);
      window.addEventListener("pointerup", hoch);
      return () => {
        html.classList.remove("mit-zeiger");
        window.removeEventListener("pointermove", bewegen);
        document.documentElement.removeEventListener("pointerleave", weg);
        window.removeEventListener("pointerdown", runter);
        window.removeEventListener("pointerup", hoch);
      };
    });
  });

  return (
    <>
      <div ref={ring} className="zeiger-ring" aria-hidden="true"><span ref={label} className="zeiger-label" /></div>
      <div ref={punkt} className="zeiger-punkt" aria-hidden="true" />
    </>
  );
}
