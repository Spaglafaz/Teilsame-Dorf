import Link from "next/link";
import { Hoehenlinien } from "./Linien";
import { pfad } from "@/lib/pfad";

export default function Seitenkopf({
  titel,
  ueberzeile,
  lead,
  bild,
  krumen = [],
}: {
  titel: string;
  ueberzeile?: string;
  lead?: string;
  bild?: string;
  krumen?: { titel: string; href: string }[];
}) {
  return (
    <section className={`seitenkopf${bild ? " seitenkopf--bild" : ""}`}>
      {bild && <img className="seitenkopf__bild" src={pfad(bild)} alt="" data-parallax="0.18" />}
      {!bild && <Hoehenlinien className="seitenkopf__linien" maus={24} />}
      <div className="huelle seitenkopf__inhalt">
        <nav aria-label="Brotkrumen">
          <ol className="brotkrumen" data-reveal="">
            <li><Link href="/">Willkommen</Link></li>
            {krumen.map((k) => <li key={k.href}><Link href={k.href}>{k.titel}</Link></li>)}
            <li aria-current="page">{titel}</li>
          </ol>
        </nav>
        {ueberzeile && <p className="ueberzeile ueberzeile--links" data-reveal=""><span className="ueberzeile__linie" />{ueberzeile}<span className="ueberzeile__linie" /></p>}
        <h1 data-split="">{titel}</h1>
        {lead && <p className="lead" data-reveal="" data-verzoegerung="0.2">{lead}</p>}
      </div>
    </section>
  );
}
