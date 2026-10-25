import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import { stammdaten } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumSeite() {
  return (
    <>
      <Seitenkopf titel="Impressum" />
      <section className="abschnitt">
        <div className="huelle textbreite rechtstext" data-reveal="">
          <h2>Verantwortliche Stelle</h2>
          <address style={{ fontStyle: "normal" }}>
            {stammdaten.adresse.map((z) => <span key={z} style={{ display: "block" }}>{z}</span>)}
          </address>
          <p style={{ marginTop: 16 }}>
            E-Mail: <a className="link" href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a><br />
            Telefon: {stammdaten.telefon}
          </p>
          <h2>Verantwortlich für den Inhalt</h2>
          <p>Teilenrat der Teilsame Lungern-Dorf, vertreten durch den Teilenpräsidenten.</p>
          {/* OFFEN: Webdesign und Hosting ergänzen */}
          <h2>Haftungsausschluss</h2>
          <p>Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität übernimmt die Teilsame keine Gewähr. Massgebend sind die offiziellen Dokumente, insbesondere der Einung und die Verordnungen.</p>
          <h2>Bilder</h2>
          <p>Alle Fotos: Teilsame Lungern-Dorf. Verwendung nur mit Einwilligung.</p>
        </div>
      </section>
    </>
  );
}
