import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { altpraesidenten } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Altpräsidenten" };

export default function AltpraesidentenSeite() {
  return (
    <>
      <Seitenkopf titel="Altpräsidenten" ueberzeile="Geschichte" lead="Die Präsidenten der Teilsame Lungern-Dorf. Die Liste wird laufend ergänzt." krumen={[{ titel: "Über uns", href: "/ueber-uns/teilenrat/" }]} />
      <section className="abschnitt">
        <div className="huelle textbreite">
          <div className="zeitleiste">
            <span className="zeitleiste__linie" data-zeitleiste="" aria-hidden="true" />
            <ol>
            {altpraesidenten.map((a) => (
              <li key={a.name + a.von} data-reveal="links">
                <span className="zeitleiste__jahr">{a.von}–{a.bis}</span>
                <h3>{a.name}</h3>
              </li>
            ))}
            <li data-reveal="links">
              <span className="zeitleiste__jahr">vor 2017</span>
              <p className="klein" style={{ margin: 0 }}>Frühere Präsidenten werden zurzeit zusammengetragen. Hinweise nimmt der Aktuar gerne entgegen.</p>
            </li>
            </ol>
          </div>
        </div>
      </section>
      <Teaser />
    </>
  );
}
