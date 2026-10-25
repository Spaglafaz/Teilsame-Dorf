import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { BereichKarte } from "@/components/Karten";
import { bereiche } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Bereiche" };

export default function BereicheSeite() {
  return (
    <>
      <Seitenkopf titel="Bereiche" ueberzeile="Zuständigkeiten" lead="Alpkommission, Gartenverwalter, Rechnungswesen und die Forst Lungern AG – hier finden Sie die richtige Stelle für Ihr Anliegen." />
      <section className="abschnitt">
        <div className="huelle">
          <div className="raster raster--4" data-stagger="">
            {bereiche.map((b) => <BereichKarte key={b.slug} b={b} />)}
          </div>
        </div>
      </section>
      <Teaser />
    </>
  );
}
