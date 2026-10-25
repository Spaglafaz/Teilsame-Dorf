import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import Filterliste from "@/components/Filterliste";
import { dokumente, dokumentKategorien } from "@/inhalte/daten";
import { pfad } from "@/lib/pfad";

export const metadata: Metadata = { title: "Downloads" };

export default function DownloadsSeite() {
  return (
    <>
      <Seitenkopf titel="Downloads" ueberzeile="Dokumente" lead="Einung, Verordnungen, Unterlagen zur Einungsgemeinde, Pläne und Formulare – jederzeit abrufbar." />
      <section className="abschnitt">
        <div className="huelle">
          <Filterliste kategorien={dokumentKategorien} label="Dokumente nach Kategorie filtern">
            <ul className="doks" data-stagger="">
              {dokumente.map((d) => (
                <li key={d.titel} data-kat={d.kategorie}>
                  <div>
                    <span className="doks__titel">{d.titel}</span>
                    <span className="doks__meta">{d.kategorie} – {[d.datum, d.beschreibung].filter(Boolean).join(" – ")}</span>
                  </div>
                  <span className="doks__rechts">
                    <span className="doks__format">PDF</span>
                    {d.href ? (
                      <a className="link" href={pfad(d.href)} download aria-label={`${d.titel} herunterladen`}>Herunterladen</a>
                    ) : (
                      <span className="doks__folgt">folgt</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Filterliste>
        </div>
      </section>
      <Teaser />
    </>
  );
}
