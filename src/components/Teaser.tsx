import { Button } from "./Bausteine";
import { Hoehenlinien } from "./Linien";
import { stammdaten } from "@/inhalte/daten";

export default function Teaser() {
  return (
    <section className="abschnitt abschnitt--eng">
      <div className="huelle">
        <div className="teaser" data-reveal="skala">
          <Hoehenlinien className="teaser__linien" anzahl={7} maus={18} />
          <div>
            <h2 data-split="">Noch mehr erfahren?</h2>
            <p>Schreiben Sie uns an <a className="link" style={{ color: "inherit" }} href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a> – wir leiten Ihr Anliegen an die zuständige Stelle weiter.</p>
          </div>
          <div className="knopfreihe">
            <Button href="/kontakt/" magnet>Kontaktieren</Button>
            <Button href="/downloads/" variante="sekundaer" pfeil={false}>Dokumente</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
