import Seitenkopf from "@/components/Seitenkopf";
import { Button } from "@/components/Bausteine";

export default function NichtGefunden() {
  return (
    <>
      <Seitenkopf titel="Seite nicht gefunden" lead="Diese Seite gibt es nicht oder nicht mehr." />
      <section className="abschnitt"><div className="huelle"><Button href="/">Zur Startseite</Button></div></section>
    </>
  );
}
