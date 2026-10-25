import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import { stammdaten } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzSeite() {
  return (
    <>
      <Seitenkopf titel="Datenschutzerklärung" lead="Gemäss dem Bundesgesetz über den Datenschutz (DSG), in Kraft seit 1. September 2023." />
      <section className="abschnitt">
        <div className="huelle textbreite rechtstext" data-reveal="">
          <h2>Verantwortliche Stelle</h2>
          <p>{stammdaten.adresse.join(", ")} · <a className="link" href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a></p>
          <h2>Kontaktformular und Teilenregister</h2>
          <p>Wenn Sie ein Formular absenden, bearbeiten wir die angegebenen Daten und beigefügten Unterlagen ausschliesslich zur Behandlung Ihres Anliegens bzw. zur Führung des Teilenregisters. Die Daten werden per E-Mail an die zuständige Stelle der Teilsame übermittelt und nicht an Dritte weitergegeben, ausser eine gesetzliche Pflicht verlangt es.</p>
          <h2>Server-Protokolle</h2>
          <p>Beim Aufruf der Website speichert der Webserver technisch notwendige Angaben (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite). Diese Daten dienen dem sicheren Betrieb und werden nicht mit anderen Daten zusammengeführt.</p>
          <h2>Cookies, Statistik und Schriften</h2>
          <p>Diese Website verwendet keine Cookies zu Werbe- oder Analysezwecken und kein Tracking. Die Schriften werden von unserem eigenen Server geladen, nicht von Drittanbietern.</p>
          <h2>Ihre Rechte</h2>
          <ul>
            <li>Auskunft über die zu Ihrer Person bearbeiteten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung, soweit keine Aufbewahrungspflicht besteht</li>
          </ul>
          <p>Wenden Sie sich dazu an <a className="link" href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a>.</p>
          <p className="klein">Stand: Oktober 2026</p>
        </div>
      </section>
    </>
  );
}
