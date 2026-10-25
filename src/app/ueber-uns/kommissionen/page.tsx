import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { verwaltung } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Kommissionen & Verwaltung" };

export default function KommissionenSeite() {
  return (
    <>
      <Seitenkopf titel="Kommissionen & Verwaltung" ueberzeile="Über uns" lead="Ämter und Kommissionen, die den Teilenrat unterstützen." krumen={[{ titel: "Über uns", href: "/ueber-uns/teilenrat/" }]} />
      <section className="abschnitt">
        <div className="huelle">
          <ul className="amtliste" data-stagger="">
            {verwaltung.map((v) => (
              <li key={v.amt}>
                <h3>{v.amt}</h3>
                <div>
                  {v.personen.length > 0 ? <p style={{ margin: 0 }}>{v.personen.join(", ")}</p> : <p className="klein" style={{ margin: 0 }}>{v.hinweis}</p>}
                  {v.email && <p style={{ margin: "4px 0 0" }}><a className="link" href={`mailto:${v.email}`}>{v.email}</a></p>}
                </div>
              </li>
            ))}
          </ul>
          <p className="klein" style={{ marginTop: 24 }} data-reveal="">Förster und Sekretariat gehören zur Forst Lungern AG.</p>
        </div>
      </section>
      <Teaser />
    </>
  );
}
