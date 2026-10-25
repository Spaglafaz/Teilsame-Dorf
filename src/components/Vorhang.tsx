"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, bewegungReduziert } from "@/lib/gsap";
import { getSmoother, vorhangAuf, vorhangZu } from "@/lib/buehne";
import { bereiche, navigation } from "@/inhalte/daten";
import { ohneBasis } from "@/lib/pfad";

const ohneSchraegstrich = (p: string) => p.replace(/\/+$/, "") || "/";

// Seitentitel für den Vorhang (aus der Navigation)
const TITEL: Record<string, string> = (() => {
  const t: Record<string, string> = { "/impressum": "Impressum", "/datenschutz": "Datenschutz" };
  navigation.forEach((n) => {
    t[ohneSchraegstrich(n.href)] = n.titel;
    n.kinder?.forEach((k) => { t[ohneSchraegstrich(k.href)] = k.titel; });
  });
  bereiche.forEach((b) => { t[`/bereiche/${b.slug}`] = b.titel; });
  return t;
})();

/**
 * Seitenwechsel: Ein tannengrüner Vorhang fährt von unten hoch, zeigt den Namen der Zielseite,
 * die Seite wechselt darunter, dann hebt sich der Vorhang und die neue Seite baut sich auf.
 */
export default function Vorhang() {
  const router = useRouter();
  const pfad = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const unterwegs = useRef<{ ziel: string; hash: string; notfall?: number } | null>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const aufdecken = contextSafe(() => {
    const el = ref.current!;
    const u = unterwegs.current;
    if (u?.notfall) window.clearTimeout(u.notfall);
    unterwegs.current = null;

    const s = getSmoother();
    if (s) s.scrollTop(0);
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    if (u?.hash) {
      const ziel = document.querySelector(u.hash);
      if (ziel) (s ? s.scrollTo(ziel, false, "top 100px") : ziel.scrollIntoView());
    }
    vorhangAuf();

    gsap.timeline()
      .to(".vorhang__inhalt", { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "vorhang" }, 0.15)
      .set(el, { visibility: "hidden" });
  });

  const zudecken = contextSafe((ziel: string, hash: string) => {
    const el = ref.current!;
    unterwegs.current = { ziel, hash };
    vorhangZu();
    router.prefetch(ziel);
    const titel = el.querySelector(".vorhang__titel")!;
    titel.textContent = TITEL[ohneSchraegstrich(ziel)] ?? "";

    gsap.timeline()
      .set(el, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
      .set(".vorhang__inhalt", { yPercent: 0, autoAlpha: 1 })
      .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "vorhang" })
      .fromTo(".vorhang__linien path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.1, ease: "power2.out" }, 0.2)
      .fromTo(".vorhang__klein", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.35)
      .fromTo(titel, { yPercent: 110 }, { yPercent: 0, duration: 0.7 }, 0.4)
      .call(() => {
        router.push(ziel + hash);
        // Falls die Seite nicht wechselt (z. B. Fehler): Vorhang trotzdem wieder öffnen
        if (unterwegs.current) unterwegs.current.notfall = window.setTimeout(aufdecken, 4000);
      }, [], 0.8);
  });

  // Klicks auf interne Links abfangen
  useEffect(() => {
    const klick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (/\.[a-z0-9]{2,4}$/i.test(url.pathname)) return; // Dateien (PDF, PHP …)
      if (ohneSchraegstrich(url.pathname) === ohneSchraegstrich(location.pathname)) return; // gleiche Seite / Anker
      if (bewegungReduziert() || unterwegs.current) return;
      e.preventDefault();
      e.stopPropagation();
      zudecken(ohneBasis(url.pathname) + url.search, url.hash);
    };
    window.addEventListener("click", klick, true);
    return () => window.removeEventListener("click", klick, true);
  }, [zudecken]);

  // Neue Seite ist da → Vorhang heben
  useEffect(() => {
    const u = unterwegs.current;
    if (!u || ohneSchraegstrich(u.ziel.split("?")[0]) !== ohneSchraegstrich(pfad)) return;
    requestAnimationFrame(() => requestAnimationFrame(aufdecken));
  }, [pfad, aufdecken]);

  return (
    <div ref={ref} className="vorhang" aria-hidden="true">
      <svg className="vorhang__linien" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice">
        <path d="M0 180 L120 120 L200 150 L300 70 L380 120 L470 60 L560 110 L640 40 L740 115 L860 80 L960 130 L1080 60 L1200 120 L1320 90 L1440 140" />
        <path d="M0 200 L140 150 L240 175 L330 110 L430 150 L520 100 L620 140 L720 85 L820 140 L930 110 L1040 155 L1160 100 L1280 150 L1440 170" />
        <path d="M0 215 L160 185 L280 200 L380 160 L500 190 L600 150 L720 180 L840 140 L960 175 L1100 150 L1240 185 L1440 195" />
      </svg>
      <div className="vorhang__inhalt">
        <span className="vorhang__klein">Teilsame Lungern-Dorf</span>
        <span className="vorhang__maske"><span className="vorhang__titel" /></span>
      </div>
    </div>
  );
}
