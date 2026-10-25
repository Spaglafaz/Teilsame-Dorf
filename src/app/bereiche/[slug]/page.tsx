import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { BereichKarte } from "@/components/Karten";
import { Button, Ueberzeile } from "@/components/Bausteine";
import { Haken } from "@/components/Linien";
import { bereiche } from "@/inhalte/daten";
import { pfad } from "@/lib/pfad";

export function generateStaticParams() {
  return bereiche.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = bereiche.find((x) => x.slug === slug);
  return { title: b?.titel, description: b?.kurz };
}

export default async function BereichSeite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = bereiche.find((x) => x.slug === slug);
  if (!b) notFound();
  const andere = bereiche.filter((x) => x.slug !== b.slug);

  return (
    <>
      <Seitenkopf titel={b.titel} ueberzeile={`Bereich ${b.nummer}`} lead={b.kurz} bild={b.bild} krumen={[{ titel: "Bereiche", href: "/bereiche/" }]} />

      <section className="abschnitt">
        <div className="huelle zweispaltig zweispaltig--oben">
          <div>
            <Ueberzeile ausrichtung="links">Aufgaben</Ueberzeile>
            <h2 data-split="">Was der Bereich leistet</h2>
            <div style={{ marginTop: 24 }} data-stagger="">
              {b.text.map((t) => <p key={t}>{t}</p>)}
            </div>
            {b.aufgaben && (
              <ul className="aufgaben" data-stagger="">
                {b.aufgaben.map((a) => <li key={a}><Haken /><span>{a}</span></li>)}
              </ul>
            )}
            {b.extern && (
              <div data-reveal="">
                {b.extern.href ? (
                  <Button href={b.extern.href} extern magnet>{b.extern.text}</Button>
                ) : (
                  <p className="klein">Die Website der Forst Lungern AG wird hier verlinkt, sobald die Adresse bestätigt ist.</p>
                )}
              </div>
            )}
          </div>

          <aside data-reveal="rechts">
            <div className="kontaktkarte">
              <Ueberzeile ausrichtung="links">Ansprechperson</Ueberzeile>
              <h3>{b.kontakt.funktion}</h3>
              {b.kontakt.name && <p style={{ margin: "4px 0 0" }}>{b.kontakt.name}</p>}
              {b.kontakt.email && (
                <p style={{ marginTop: 12 }}><a className="link" href={`mailto:${b.kontakt.email}`}>{b.kontakt.email}</a></p>
              )}
              {b.dokumente.length > 0 && (
                <>
                  <hr style={{ border: 0, borderTop: "1px solid var(--linie)", margin: "24px 0" }} />
                  <h3 style={{ fontSize: 18, lineHeight: "26px", marginBottom: 8 }}>Dokumente</h3>
                  <ul className="klein" style={{ paddingLeft: 18, margin: "0 0 16px" }}>
                    {b.dokumente.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                  <Button href="/downloads/" variante="sekundaer">Zu den Downloads</Button>
                </>
              )}
            </div>
            <div className="bereich-bild" style={{ marginTop: 24 }}>
              <img src={pfad(b.bild)} alt={b.bildAlt} loading="lazy" data-parallax="0.12" />
            </div>
          </aside>
        </div>
      </section>

      <section className="abschnitt abschnitt--sand">
        <div className="huelle">
          <div className="abschnitt-kopf zentriert">
            <Ueberzeile>Weitere Bereiche</Ueberzeile>
          </div>
          <div className="raster raster--3" data-stagger="">
            {andere.map((x) => <BereichKarte key={x.slug} b={x} />)}
          </div>
        </div>
      </section>
      <Teaser />
    </>
  );
}
