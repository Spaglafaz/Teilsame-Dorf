import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Formular, { registerFelder } from "@/components/Formular";
import { AbschnittKopf, Ueberzeile } from "@/components/Bausteine";
import { Haken } from "@/components/Linien";

export const metadata: Metadata = { title: "Teiler" };

export default function TeilerSeite() {
  return (
    <>
      <Seitenkopf titel="Teiler" ueberzeile="Mitglied der Teilsame" lead="Wer Teiler ist, welche Rechte damit verbunden sind und wie die Aufnahme ins Teilenregister funktioniert." bild="/bilder/alpweide.jpg" />

      <section className="abschnitt">
        <div className="huelle zweispaltig zweispaltig--oben">
          <div>
            <Ueberzeile ausrichtung="links">Was ist ein Teiler?</Ueberzeile>
            <h2 data-split="">Teil einer Gemeinschaft</h2>
            <p className="lead" style={{ marginTop: 16 }} data-reveal="">
              Ein Teiler ist eine natürliche Person, die Mitglied der öffentlich-rechtlichen Körperschaft Teilsame Lungern-Dorf ist und das Recht hat, an deren Ressourcen, Rechten und Nutzungsformen teilzuhaben.
            </p>
            <h3 style={{ marginTop: 32 }} data-reveal="">Rechte</h3>
            <ul className="aufgaben" data-stagger="">
              <li><Haken /><span>Stimm- und Wahlrecht an der Einungsgemeinde</span></li>
              <li><Haken /><span>Zugang zu landwirtschaftlichen Nutzflächen</span></li>
              <li><Haken /><span>Beteiligung an gemeinschaftlichen Ressourcen</span></li>
            </ul>
          </div>
          <div className="kontaktkarte" data-reveal="rechts">
            <Ueberzeile ausrichtung="links">Voraussetzungen</Ueberzeile>
            <h3>Wer ist Teiler der Teilsame Dorf?</h3>
            <p className="klein" style={{ marginTop: 8 }}>Massgebend ist der Einung der Teilsame Lungern-Dorf. Grundsätzlich müssen alle Voraussetzungen erfüllt sein:</p>
            <ul className="aufgaben" data-stagger="">
              <li><Haken /><span>Abstammung von einem Teiler bis und mit 3. Generation, Adoption oder Ehe mit einem Teiler</span></li>
              <li><Haken /><span>Mindestalter 18 Jahre</span></li>
              <li><Haken /><span>Wohnsitz im Gebiet der Teilsame Dorf</span></li>
              <li><Haken /><span>Schweizer Bürgerrecht</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="abschnitt abschnitt--sand" id="anmeldung">
        <div className="huelle" style={{ maxWidth: 880 }}>
          <AbschnittKopf ueberzeile="Teilenregister" titel="Aufnahme ins Teilenregister" text="Füllen Sie das Formular aus und legen Sie die nötigen Unterlagen bei. Der Aktuar prüft Ihr Gesuch." />
          <div className="kontaktkarte" data-reveal="">
            <Formular art="teilenregister" felder={registerFelder} knopf="Gesuch einreichen" />
          </div>
        </div>
      </section>
    </>
  );
}
