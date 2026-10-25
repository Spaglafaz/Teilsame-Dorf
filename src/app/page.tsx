import Link from "next/link";
import Hero from "@/components/Hero";
import Termine from "@/components/Termine";
import Kennzahlen from "@/components/Kennzahlen";
import Collage from "@/components/Collage";
import Teaser from "@/components/Teaser";
import { BereichKarte } from "@/components/Karten";
import { AbschnittKopf, Button, Leer, Ueberzeile } from "@/components/Bausteine";
import { Haken } from "@/components/Linien";
import { bereiche, news, projekte } from "@/inhalte/daten";

export default function Startseite() {
  return (
    <>
      <Hero
        bild="/bilder/dorf-see-luftbild.jpg"
        bildAlt="Luftbild von Lungern-Dorf mit Kirche, Eibach-Halbinsel und Lungernsee"
        ueberzeile="Lungern · Obwalden"
        titel="Willkommen bei der Teilsame Lungern-Dorf"
        lead="Wald, Alpen und Gärten – gemeinsames Grundeigentum der Teiler."
        fakten={["Teilenrat: 7 Mitglieder plus Schreiber", "50 % an der Forst Lungern AG", "Oberstes Organ: Einungsgemeinde"]}
      />

      <div className="huelle termine-lage">
        <Termine />
      </div>

      {/* Über uns */}
      <section className="abschnitt">
        <div className="huelle zweispaltig">
          <div>
            <Ueberzeile ausrichtung="links">Über uns</Ueberzeile>
            <h2 data-split="">Zweck und Aufgaben der Teilsame</h2>
            <p className="lead" data-reveal="" style={{ marginTop: 16 }}>
              Die Teilsame übernimmt im Interesse der Allgemeinheit auf ihrem Grundeigentum folgende Aufgaben:
            </p>
            <ul className="aufgaben" data-stagger="">
              <li><Haken /><span>Pflege und Bewirtschaftung des Waldes durch die Forst Lungern AG, an der die Teilsame mit 50&nbsp;% beteiligt ist</span></li>
              <li><Haken /><span>Unterhalt und Erneuerung der Alp- und Güterstrassen</span></li>
              <li><Haken /><span>Zurverfügungstellung der Alpen an Landwirte gemäss Güterrecht</span></li>
              <li><Haken /><span>Verwaltung der Gärten sowie der Bergheu- und Streueparzellen</span></li>
            </ul>
            <p data-reveal="">Der Einung ist das Grundgesetz der Teilsame.</p>
            <div className="knopfreihe" data-reveal="">
              <Button href="/downloads/" magnet>Zum Einung</Button>
              <Button href="/ueber-uns/teilenrat/" variante="sekundaer">Teilenrat</Button>
            </div>
          </div>
          <Collage
            haupt="/bilder/alpweide.jpg"
            hauptAlt="Alpweide mit Stall und Fahrweg, im Hintergrund bewaldete Kuppen"
            neben="/bilder/felsweg.jpg"
            nebenAlt="Bagger räumt Felsbrocken auf einem schmalen Weg"
            badge={{ wert: 50, suffix: " %", label: "Forst Lungern AG" }}
          />
        </div>
      </section>

      {/* Kennzahlen */}
      <section className="abschnitt abschnitt--eng" aria-label="Kennzahlen">
        <div className="huelle">
          <Kennzahlen />
        </div>
      </section>

      {/* Bereiche */}
      <section className="abschnitt abschnitt--sand">
        <div className="huelle">
          <AbschnittKopf ueberzeile="Unsere Bereiche" titel="Wer wofür zuständig ist" text="Für jedes Anliegen die richtige Stelle – von der Alp bis zum Garten." />
          <div className="raster raster--4" data-stagger="">
            {bereiche.map((b) => <BereichKarte key={b.slug} b={b} />)}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="abschnitt">
        <div className="huelle">
          <AbschnittKopf ueberzeile="Neuigkeiten" titel="Aus der Teilsame Dorf" />
          {news.length === 0 ? (
            <Leer titel="Die ersten Beiträge folgen" text="Hier informiert der Teilenrat über Beschlüsse, die Einungsgemeinde, die Alpen und laufende Projekte." />
          ) : (
            <div className="raster raster--3" data-stagger="">
              {news.slice(0, 3).map((n) => (
                <article key={n.titel} className="news" data-tilt="">
                  {n.bild && <div className="news__bild"><img src={n.bild} alt="" loading="lazy" /></div>}
                  <div className="news__text">
                    <span className="etikett">{n.kategorie}</span> <time className="klein" dateTime={n.iso}>{n.datum}</time>
                    <h3>{n.titel}</h3>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="zentriert" style={{ marginTop: 32 }} data-reveal="">
            <Button href="/news/" variante="text">Alle News</Button>
          </div>
        </div>
      </section>

      {/* Projekte */}
      <section className="abschnitt abschnitt--sand">
        <div className="huelle">
          <AbschnittKopf ueberzeile="Projekte" titel="Was wir anpacken" />
          <div className="raster raster--3" data-stagger="">
            {projekte.map((p, i) => (
              <Link key={i} href="/projekte/" className="bkarte" data-tilt="" data-zeiger="Ansehen">
                <div className="bkarte__bild"><img src={p.bild} alt={p.bildAlt} loading="lazy" /></div>
                <div className="bkarte__text">
                  <span className="bkarte__nr" aria-hidden="true">{i + 1}</span>
                  <h3>{p.titel}</h3>
                  <p><span className="chip">{p.status}</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Korporationsbuch */}
      <section className="abschnitt abschnitt--eng">
        <div className="huelle zweispaltig">
          <div>
            <Ueberzeile ausrichtung="links">Korporationen Obwalden</Ueberzeile>
            <h2 data-split="">Korporationsbuch</h2>
          </div>
          <div data-reveal="rechts">
            <p>Das Korporationsbuch gibt eine Übersicht über die Korporationen im Kanton Obwalden.</p>
            <Button href="/downloads/" variante="sekundaer">Zum Download</Button>
          </div>
        </div>
      </section>

      <Teaser />
    </>
  );
}
