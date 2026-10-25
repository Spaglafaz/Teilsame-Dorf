import Link from "next/link";
import type { Bereich } from "@/inhalte/daten";

export function BereichKarte({ b }: { b: Bereich }) {
  return (
    <Link href={`/bereiche/${b.slug}/`} className="bkarte" data-tilt="" data-zeiger="Öffnen">
      <div className="bkarte__bild"><img src={b.bild} alt={b.bildAlt} loading="lazy" /></div>
      <div className="bkarte__text">
        <span className="bkarte__nr" aria-hidden="true">{b.nummer}</span>
        <h3>{b.titel}</h3>
        <p>{b.kurz}</p>
        <span className="bkarte__mehr">Mehr erfahren <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
