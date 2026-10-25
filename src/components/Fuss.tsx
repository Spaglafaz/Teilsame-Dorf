import Link from "next/link";
import { Wortmarke } from "./Kopf";
import { Bergkette } from "./Linien";
import { bereiche, stammdaten } from "@/inhalte/daten";

export default function Fuss() {
  return (
    <footer className="fuss">
      <div className="huelle">
        <div className="fuss__raster" data-stagger="">
          <div>
            <Wortmarke />
            <p>{stammdaten.tagline}</p>
          </div>
          <div>
            <h3>Kontakt</h3>
            <address style={{ fontStyle: "normal" }}>
              {stammdaten.adresse.map((z) => <span key={z} style={{ display: "block" }}>{z}</span>)}
            </address>
            <p style={{ marginTop: 12 }}>
              <a href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a><br />
              <a href={`tel:${stammdaten.telefon.replace(/\s/g, "")}`}>{stammdaten.telefon}</a>
            </p>
          </div>
          <div>
            <h3>Bereiche</h3>
            <ul>{bereiche.map((b) => <li key={b.slug}><Link href={`/bereiche/${b.slug}/`}>{b.titel}</Link></li>)}</ul>
          </div>
          <div>
            <h3>Schnellzugriff</h3>
            <ul>
              <li><Link href="/ueber-uns/teilenrat/">Teilenrat</Link></li>
              <li><Link href="/teiler/">Teilenregister</Link></li>
              <li><Link href="/downloads/">Dokumente</Link></li>
              <li><Link href="/kontakt/">Kontakt</Link></li>
            </ul>
          </div>
        </div>
        <div className="fuss__unten">
          <span>© {new Date().getFullYear()} {stammdaten.name}</span>
          <span>
            <Link href="/impressum/">Impressum</Link> · <Link href="/datenschutz/">Datenschutzerklärung</Link>
          </span>
        </div>
      </div>
      <Bergkette className="fuss__landschaft" />
    </footer>
  );
}
