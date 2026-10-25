import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { projekte } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Projekte" };

export default function ProjekteSeite() {
  return (
    <>
      <Seitenkopf titel="Projekte" ueberzeile="Was wir anpacken" lead="Aktuelle und abgeschlossene Projekte der Teilsame – mit Ausgangslage, Ziel und Zeitplan." bild="/bilder/bau-gebaeude-2.jpg" />
      <section className="abschnitt">
        <div className="huelle">
          <div className="raster raster--3" data-stagger="">
            {projekte.map((p, i) => (
              <article key={i} className="bkarte" data-tilt="">
                <div className="bkarte__bild"><img src={p.bild} alt={p.bildAlt} loading="lazy" /></div>
                <div className="bkarte__text">
                  <span className="bkarte__nr" aria-hidden="true">{i + 1}</span>
                  <h3>{p.titel}</h3>
                  <p><span className="chip">{p.status}</span></p>
                  {p.text && <p>{p.text}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Teaser />
    </>
  );
}
