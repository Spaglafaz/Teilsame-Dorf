import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import Filterliste from "@/components/Filterliste";
import { Leer } from "@/components/Bausteine";
import { news, newsKategorien } from "@/inhalte/daten";
import { pfad } from "@/lib/pfad";

export const metadata: Metadata = { title: "News" };

export default function NewsSeite() {
  return (
    <>
      <Seitenkopf titel="News" ueberzeile="Neuigkeiten" lead="Beschlüsse, Termine und Berichte aus der Teilsame Lungern-Dorf." krumen={[{ titel: "Über uns", href: "/ueber-uns/teilenrat/" }]} />
      <section className="abschnitt">
        <div className="huelle">
          {news.length === 0 ? (
            <Leer titel="Noch keine Beiträge" text="Sobald der Teilenrat die ersten Beiträge freigibt, erscheinen sie hier – nach Kategorie filterbar." />
          ) : (
            <Filterliste kategorien={newsKategorien} label="News nach Kategorie filtern">
              <div className="raster raster--3" data-stagger="">
                {news.map((n) => (
                  <article key={n.titel} className="news" data-kat={n.kategorie} data-tilt="">
                    {n.bild && <div className="news__bild"><img src={pfad(n.bild)} alt="" loading="lazy" /></div>}
                    <div className="news__text">
                      <span className="etikett">{n.kategorie}</span> <time className="klein" dateTime={n.iso}>{n.datum}</time>
                      <h3>{n.titel}</h3>
                      <p className="klein">{n.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Filterliste>
          )}
        </div>
      </section>
      <Teaser />
    </>
  );
}
