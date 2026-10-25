import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Formular, { kontaktFelder } from "@/components/Formular";
import { Ueberzeile } from "@/components/Bausteine";
import { stammdaten } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Kontakt" };

export default function KontaktSeite() {
  return (
    <>
      <Seitenkopf titel="Kontakt" ueberzeile="Wir sind für Sie da" lead="Ihr Anliegen erreicht über das Formular direkt die zuständige Stelle." />
      <section className="abschnitt">
        <div className="huelle zweispaltig zweispaltig--oben zweispaltig--kontakt">
          <div className="kontaktkarte" data-reveal="">
            <Formular art="kontakt" felder={kontaktFelder} knopf="Nachricht senden" />
          </div>
          <aside data-stagger="">
            <div className="kontaktkarte">
              <Ueberzeile ausrichtung="links">Direkt</Ueberzeile>
              <dl>
                <div><dt>E-Mail</dt><dd><a className="link" href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a></dd></div>
                <div><dt>Telefon</dt><dd><a className="link" href={`tel:${stammdaten.telefon.replace(/\s/g, "")}`}>{stammdaten.telefon}</a></dd></div>
                <div><dt>Post</dt><dd>{stammdaten.adresse.map((z) => <span key={z} style={{ display: "block" }}>{z}</span>)}</dd></div>
              </dl>
            </div>
            <div className="hinweis" style={{ marginTop: 24 }}>
              <strong>Holz und Forstarbeiten?</strong><br />
              Anfragen zu Brennholz, Schnitzeln und Forstdienstleistungen gehen direkt an die Forst Lungern AG:{" "}
              <a className="link" href="mailto:info@forst-lungern.ch">info@forst-lungern.ch</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
