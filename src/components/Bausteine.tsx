import Link from "next/link";

export function Ueberzeile({ children, ausrichtung = "mitte", hell = false }: { children: React.ReactNode; ausrichtung?: "mitte" | "links"; hell?: boolean }) {
  return (
    <p className={`ueberzeile ueberzeile--${ausrichtung}${hell ? " ueberzeile--hell" : ""}`} data-reveal="">
      <span className="ueberzeile__linie" aria-hidden="true" />
      {children}
      <span className="ueberzeile__linie" aria-hidden="true" />
    </p>
  );
}

type BtnProps = {
  href: string;
  variante?: "primaer" | "sekundaer" | "hell" | "text";
  aufFoto?: boolean;
  pfeil?: boolean;
  magnet?: boolean;
  extern?: boolean;
  children: React.ReactNode;
};

export function Button({ href, variante = "primaer", aufFoto, pfeil = true, magnet, extern, children }: BtnProps) {
  const cls = `btn btn--${variante}${aufFoto ? " btn--auf-foto" : ""}`;
  const inhalt = (
    <>
      <span className="btn__rolle">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {pfeil && <span className="btn__pfeil" aria-hidden="true"><span>→</span></span>}
    </>
  );
  const extra = magnet ? { "data-magnet": "" } : {};
  if (extern || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a className={cls} href={href} {...extra} {...(extern ? { target: "_blank", rel: "noopener" } : {})}>{inhalt}</a>;
  }
  return <Link className={cls} href={href} {...extra}>{inhalt}</Link>;
}

export function AbschnittKopf({ ueberzeile, titel, text, ausrichtung = "mitte" }: { ueberzeile?: string; titel: string; text?: string; ausrichtung?: "mitte" | "links" }) {
  return (
    <div className={`abschnitt-kopf${ausrichtung === "mitte" ? " zentriert" : ""}`}>
      {ueberzeile && <Ueberzeile ausrichtung={ausrichtung}>{ueberzeile}</Ueberzeile>}
      <h2 data-split="">{titel}</h2>
      {text && <p className="lead textbreite" data-reveal="">{text}</p>}
    </div>
  );
}

export function Leer({ titel, text }: { titel: string; text: string }) {
  return (
    <div className="leer" data-reveal="skala">
      <svg viewBox="0 0 120 48" aria-hidden="true" data-draw="">
        <path d="M2 44 L30 18 L46 30 L70 6 L92 28 L118 12" />
      </svg>
      <h3>{titel}</h3>
      <p>{text}</p>
    </div>
  );
}
