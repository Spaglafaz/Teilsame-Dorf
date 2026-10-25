"use client";

import { useGSAP, gsap, BEWEGUNG_ERLAUBT, MIT_MAUS } from "@/lib/gsap";

type Neiger = { rx: gsap.QuickToFunc; ry: gsap.QuickToFunc; y: gsap.QuickToFunc };
type Magnet = { x: gsap.QuickToFunc; y: gsap.QuickToFunc };

/**
 * Seitenweite Mikroanimationen über Event-Delegation – funktionieren auch nach jedem Seitenwechsel,
 * ohne dass Komponenten etwas registrieren müssen:
 *  data-tilt        Karte neigt sich zum Mauszeiger, ein Lichtfleck folgt (CSS-Variablen --mx/--my)
 *  data-magnet      Button wird leicht vom Zeiger angezogen
 *  data-maus="20"   Ornament verschiebt sich mit der Mausposition (Tiefe, Wert = max. Pixel)
 *  .btn             Klick erzeugt eine Welle ab dem Klickpunkt (auch auf Touch)
 */
export default function Mikro() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(BEWEGUNG_ERLAUBT, () => {
      // Welle bei Klick auf Buttons
      const welle = (e: PointerEvent) => {
        const btn = (e.target as Element | null)?.closest?.(".btn:not(.btn--text)") as HTMLElement | null;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const groesse = Math.max(r.width, r.height) * 2.4;
        const w = document.createElement("span");
        w.className = "btn__welle";
        w.setAttribute("aria-hidden", "true");
        Object.assign(w.style, { width: `${groesse}px`, height: `${groesse}px`, left: `${e.clientX - r.left - groesse / 2}px`, top: `${e.clientY - r.top - groesse / 2}px` });
        btn.appendChild(w);
        gsap.fromTo(w, { scale: 0, opacity: 0.35 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => w.remove() });
      };
      window.addEventListener("pointerdown", welle);
      return () => window.removeEventListener("pointerdown", welle);
    });

    mm.add(`${BEWEGUNG_ERLAUBT} and ${MIT_MAUS}`, () => {
      const neiger = new WeakMap<HTMLElement, Neiger>();
      const magnete = new WeakMap<HTMLElement, Magnet>();
      let aktiveKarte: HTMLElement | null = null;
      let aktiverMagnet: HTMLElement | null = null;
      const tiefe = new WeakMap<HTMLElement, Magnet>();

      const holeNeiger = (el: HTMLElement) => {
        let n = neiger.get(el);
        if (!n) {
          gsap.set(el, { transformPerspective: 1000 });
          n = {
            rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" }),
            ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
          };
          neiger.set(el, n);
        }
        return n;
      };
      const holeMagnet = (el: HTMLElement) => {
        let m = magnete.get(el);
        if (!m) {
          m = {
            x: gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" }),
            y: gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" }),
          };
          magnete.set(el, m);
        }
        return m;
      };
      const loslassenKarte = (el: HTMLElement) => {
        const n = holeNeiger(el);
        n.rx(0); n.ry(0); n.y(0);
        el.classList.remove("ist-geneigt");
      };
      const loslassenMagnet = (el: HTMLElement) => { const m = holeMagnet(el); m.x(0); m.y(0); };

      const bewegen = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const t = e.target as Element;

        // Karten neigen
        const karte = t.closest?.("[data-tilt]") as HTMLElement | null;
        if (karte !== aktiveKarte) {
          if (aktiveKarte) loslassenKarte(aktiveKarte);
          aktiveKarte = karte;
          karte?.classList.add("ist-geneigt");
        }
        if (karte) {
          const r = karte.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          const n = holeNeiger(karte);
          n.rx(-ny * 7); n.ry(nx * 9); n.y(-6);
          karte.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
          karte.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
        }

        // Magnetische Buttons
        const magnet = t.closest?.("[data-magnet]") as HTMLElement | null;
        if (magnet !== aktiverMagnet) {
          if (aktiverMagnet) loslassenMagnet(aktiverMagnet);
          aktiverMagnet = magnet;
        }
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const m = holeMagnet(magnet);
          m.x((e.clientX - (r.left + r.width / 2)) * 0.3);
          m.y((e.clientY - (r.top + r.height / 2)) * 0.4);
        }

        // Ornamente mit Tiefe
        const vx = e.clientX / window.innerWidth - 0.5;
        const vy = e.clientY / window.innerHeight - 0.5;
        document.querySelectorAll<HTMLElement>("[data-maus]").forEach((el) => {
          let m = tiefe.get(el);
          if (!m) {
            m = { x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" }) };
            tiefe.set(el, m);
          }
          const f = Number(el.dataset.maus || 20);
          m.x(vx * f * 2);
          m.y(vy * f * 2);
        });
      };
      const weg = () => {
        if (aktiveKarte) loslassenKarte(aktiveKarte);
        if (aktiverMagnet) loslassenMagnet(aktiverMagnet);
        aktiveKarte = aktiverMagnet = null;
      };

      window.addEventListener("pointermove", bewegen, { passive: true });
      document.documentElement.addEventListener("pointerleave", weg);
      return () => {
        window.removeEventListener("pointermove", bewegen);
        document.documentElement.removeEventListener("pointerleave", weg);
      };
    });
  });

  return null;
}
