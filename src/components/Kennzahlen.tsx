import Link from "next/link";
import { kennzahlen } from "@/inhalte/daten";

export default function Kennzahlen() {
  // Nur Kacheln mit gesichertem Wert anzeigen
  const sichtbar = kennzahlen.filter((k) => k.wert !== undefined || k.anzeige);
  if (sichtbar.length === 0) return null;
  return (
    <div className="kennzahlen" data-stagger="">
      {sichtbar.map((k) => {
        const inhalt = (
          <>
            <span className="kennzahl__wert" {...(k.wert !== undefined ? { "data-count": k.wert, "data-suffix": k.suffix || "" } : {})}>
              {k.wert !== undefined ? `${k.wert}${k.suffix || ""}` : k.anzeige}
            </span>
            <span className="kennzahl__label">
              {k.label}
              {k.href && <span className="kennzahl__pfeil" aria-hidden="true">↗</span>}
            </span>
          </>
        );
        return k.href ? (
          <Link key={k.label} href={k.href} className="kennzahl" data-tilt="">{inhalt}</Link>
        ) : (
          <div key={k.label} className="kennzahl" data-tilt="">{inhalt}</div>
        );
      })}
    </div>
  );
}
