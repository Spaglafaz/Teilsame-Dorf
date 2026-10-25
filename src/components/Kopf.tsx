"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, BEWEGUNG_ERLAUBT } from "@/lib/gsap";
import { getSmoother, introLaeuftNoch, nachIntro } from "@/lib/buehne";
import { navigation, stammdaten } from "@/inhalte/daten";

function Pfeil() {
  return (
    <svg className="nav__pfeil" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wortmarke() {
  return (
    <Link href="/" className="wortmarke" aria-label={`${stammdaten.name} – Startseite`}>
      <span className="wortmarke__klein" aria-hidden="true">Teilsame</span>
      <span className="wortmarke__gross" aria-hidden="true">
        {Array.from("Lungern-Dorf").map((z, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{z}</span>)}
      </span>
    </Link>
  );
}

export default function Kopf() {
  const pfad = usePathname();
  const kopf = useRef<HTMLElement>(null);
  const mobil = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [offen, setOffen] = useState<string | null>(null);
  const [menue, setMenue] = useState(false);
  const [gescrollt, setGescrollt] = useState(false);
  const gescrolltRef = useRef(false);

  // Kopf: über dem Foto transparent, beim Scrollen fest; beim Runterscrollen ausblenden, beim Hochscrollen zeigen
  useGSAP(
    () => {
      const el = kopf.current!;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const g = y > 40;
          if (g !== gescrolltRef.current) { gescrolltRef.current = g; setGescrollt(g); }
          if (y > 400 && self.direction === 1 && !document.body.classList.contains("menue-ist-offen")) {
            gsap.to(el, { yPercent: -110, duration: 0.45, ease: "power2.in", overwrite: true });
          } else if (self.direction === -1 || y <= 400) {
            gsap.to(el, { yPercent: 0, duration: 0.6, overwrite: true });
          }
        },
      });
      // Erstes Einblenden – nach dem Intro
      const mm = gsap.matchMedia();
      mm.add(BEWEGUNG_ERLAUBT, () => {
        const teile = el.querySelectorAll(".wortmarke, .nav__punkt, .nav__cta, .menue-knopf");
        if (introLaeuftNoch()) gsap.set(teile, { y: -16, autoAlpha: 0 });
        return nachIntro(() => gsap.to(teile, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, delay: 0.35 }));
      });

      // Navigations-Marker: eine weiche Fläche gleitet zum Punkt unter der Maus
      const nav = el.querySelector<HTMLElement>(".nav");
      const marker = el.querySelector<HTMLElement>(".nav__marker");
      const aufraeumen: (() => void)[] = [];
      if (nav && marker) {
        gsap.set(marker, { autoAlpha: 0 });
        const hin = (link: HTMLElement) => {
          const n = nav.getBoundingClientRect();
          const r = link.getBoundingClientRect();
          const sichtbar = gsap.getProperty(marker, "autoAlpha") as number > 0.01;
          gsap.to(marker, { x: r.left - n.left, width: r.width, autoAlpha: 1, duration: sichtbar ? 0.5 : 0, overwrite: "auto" });
          if (!sichtbar) gsap.fromTo(marker, { scale: 0.85 }, { scale: 1, duration: 0.4 });
        };
        const ueber = (e: Event) => { const l = (e.target as Element).closest?.(".nav__link") as HTMLElement | null; if (l) hin(l); };
        const raus = () => gsap.to(marker, { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
        nav.addEventListener("pointerover", ueber);
        nav.addEventListener("focusin", ueber);
        nav.addEventListener("pointerleave", raus);
        nav.addEventListener("focusout", raus);
        aufraeumen.push(() => {
          nav.removeEventListener("pointerover", ueber);
          nav.removeEventListener("focusin", ueber);
          nav.removeEventListener("pointerleave", raus);
          nav.removeEventListener("focusout", raus);
        });
      }
      return () => { st.kill(); mm.revert(); aufraeumen.forEach((f) => f()); };
    },
    { scope: kopf }
  );

  // Mobile Menü-Timeline
  useGSAP(
    () => {
      const m = mobil.current!;
      const striche = kopf.current!.querySelectorAll(".menue-knopf span");
      tl.current = gsap
        .timeline({ paused: true, defaults: { duration: 0.6 } })
        .set(m, { visibility: "visible" })
        .to(m, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.inOut" })
        .to(striche[0], { y: 6, rotate: 45 }, 0)
        .to(striche[1], { scaleX: 0, autoAlpha: 0, duration: 0.3 }, 0)
        .to(striche[2], { y: -6, rotate: -45 }, 0)
        .from(m.querySelectorAll(".mobil-menue__haupt > li"), { y: 32, autoAlpha: 0, stagger: 0.05 }, 0.3)
        .from(m.querySelector(".mobil-menue__kontakt"), { autoAlpha: 0, y: 16 }, 0.6);
    },
    { scope: kopf }
  );

  useEffect(() => {
    document.body.classList.toggle("menue-ist-offen", menue);
    document.body.style.overflow = menue ? "hidden" : "";
    getSmoother()?.paused(menue);
    if (menue) tl.current?.timeScale(1).play();
    else tl.current?.timeScale(1.6).reverse();
  }, [menue]);

  // Bei Seitenwechsel schliessen
  useEffect(() => {
    setMenue(false);
    setOffen(null);
  }, [pfad]);

  // Dropdowns animieren
  useEffect(() => {
    kopf.current?.querySelectorAll<HTMLElement>(".nav__menue").forEach((ul) => {
      const sichtbar = ul.dataset.id === offen;
      if (sichtbar) {
        gsap.fromTo(ul, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35, overwrite: true });
        gsap.fromTo(ul.querySelectorAll("li"), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.035, overwrite: true });
      } else {
        gsap.to(ul, { autoAlpha: 0, y: -4, duration: 0.2, overwrite: true });
      }
    });
  }, [offen]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOffen(null); setMenue(false); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const aktiv = (p: (typeof navigation)[number]) => pfad.startsWith(p.href) || !!p.kinder?.some((k) => pfad.startsWith(k.href));

  return (
    <>
    <header ref={kopf} className={`kopf${gescrollt ? " ist-gescrollt" : " ist-ueber-foto"}${menue ? " menue-offen" : ""}`}>
      <div className="huelle kopf__innen">
        <Wortmarke />
        <nav className="nav" aria-label="Hauptnavigation">
          <span className="nav__marker" aria-hidden="true" />
          {navigation.slice(1, -1).map((p) =>
            p.kinder ? (
              <div
                key={p.titel}
                className={`nav__punkt${offen === p.titel ? " ist-offen" : ""}${aktiv(p) ? " ist-aktiv" : ""}`}
                onMouseEnter={() => setOffen(p.titel)}
                onMouseLeave={() => setOffen(null)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOffen(null); }}
              >
                <button className="nav__link" aria-expanded={offen === p.titel} onClick={() => setOffen(offen === p.titel ? null : p.titel)}>
                  {p.titel} <Pfeil />
                </button>
                <ul className="nav__menue" data-id={p.titel}>
                  {p.kinder.map((k) => (
                    <li key={k.href}>
                      <Link href={k.href} aria-current={pfad === k.href ? "page" : undefined}>{k.titel}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div key={p.titel} className="nav__punkt">
                <Link className="nav__link" href={p.href} aria-current={pfad.startsWith(p.href) ? "page" : undefined}>{p.titel}</Link>
              </div>
            )
          )}
          <Link href="/kontakt/" className="btn btn--primaer btn--auf-foto nav__cta" data-magnet>
            <span className="btn__rolle"><span>Kontakt</span><span aria-hidden="true">Kontakt</span></span>
          </Link>
        </nav>
        <button className="menue-knopf" aria-expanded={menue} aria-controls="mobil-menue" aria-label={menue ? "Menü schliessen" : "Menü öffnen"} onClick={() => setMenue(!menue)}>
          <span /><span /><span />
        </button>
      </div>
    </header>

      <div id="mobil-menue" ref={mobil} className="mobil-menue" aria-hidden={!menue}>
        <ul className="mobil-menue__haupt">
          {navigation.map((p) => (
            <li key={p.titel}>
              <Link href={p.href} tabIndex={menue ? 0 : -1}>{p.titel}<span className="mobil-menue__pfeil" aria-hidden="true">→</span></Link>
              {p.kinder && (
                <ul className="mobil-menue__unter">
                  {p.kinder.map((k) => (
                    <li key={k.href}><Link href={k.href} tabIndex={menue ? 0 : -1}>{k.titel}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="mobil-menue__kontakt">
          <a href={`mailto:${stammdaten.email}`} tabIndex={menue ? 0 : -1}>{stammdaten.email}</a><br />
          {stammdaten.telefon}
        </p>
      </div>
    </>
  );
}
