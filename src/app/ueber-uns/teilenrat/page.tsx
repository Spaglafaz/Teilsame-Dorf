import type { Metadata } from "next";
import Seitenkopf from "@/components/Seitenkopf";
import Teaser from "@/components/Teaser";
import { AbschnittKopf } from "@/components/Bausteine";
import { teilenrat, type Person } from "@/inhalte/daten";

export const metadata: Metadata = { title: "Teilenrat" };

function initialen(n: string) {
  return n.split(/[\s-]+/).slice(0, 2).map((s) => s[0]).join("");
}

function Karte({ p, hervor }: { p: Person; hervor?: boolean }) {
  return (
    <article className={`person${hervor ? " person--hervor" : ""}`} data-tilt="">
      <div className="person__foto">
        {p.foto ? <img src={p.foto} alt={`Porträt ${p.name}`} loading="lazy" /> : <span className="person__initialen">{initialen(p.name)}</span>}
      </div>
      <div className="person__text">
        {hervor && <span className="etikett">Vorsitz</span>}
        <h3 style={hervor ? { fontSize: 30, lineHeight: "38px" } : undefined}>{p.name}</h3>
        <p className="person__funktion">{p.funktion}</p>
        {p.email && <p className="person__kontakt"><a className="link" href={`mailto:${p.email}`}>{p.email}</a></p>}
      </div>
    </article>
  );
}

export default function TeilenratSeite() {
  const [praesident, ...rest] = teilenrat;
  return (
    <>
      <Seitenkopf
        titel="Teilenrat"
        ueberzeile="Über uns"
        lead="Der Teilenrat Dorf besteht aus sieben Mitgliedern plus Schreiber."
        krumen={[{ titel: "Über uns", href: "/ueber-uns/teilenrat/" }]}
      />
      <section className="abschnitt">
        <div className="huelle">
          <AbschnittKopf ueberzeile="Mitglieder" titel="Die Teilenräte" />
          <div className="raster raster--4" data-stagger="">
            <Karte p={praesident} hervor />
            {rest.map((p) => <Karte key={p.name} p={p} />)}
          </div>
        </div>
      </section>
      <Teaser />
    </>
  );
}
