"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { anliegen, stammdaten } from "@/inhalte/daten";

type Feld = {
  name: string;
  label: string;
  typ?: "text" | "email" | "tel" | "date" | "auswahl" | "mehrzeilig" | "datei";
  pflicht?: boolean;
  optionen?: { wert: string; text: string }[];
  hilfe?: string;
  autocomplete?: string;
  breit?: boolean;
};

const FEHLER: Record<string, string> = {
  valueMissing: "Bitte dieses Feld ausfüllen.",
  typeMismatch: "Bitte eine gültige Angabe eingeben.",
};

function Eingabe({ f, fehler }: { f: Feld; fehler?: string }) {
  const id = `f-${f.name}`;
  const beschr = [f.hilfe && `${id}-hilfe`, fehler && `${id}-fehler`].filter(Boolean).join(" ") || undefined;
  const common = { id, name: f.typ === "datei" ? `${f.name}[]` : f.name, required: f.pflicht, "aria-invalid": fehler ? true : undefined, "aria-describedby": beschr };
  let control: React.ReactNode;
  if (f.typ === "auswahl") {
    control = (
      <select {...common} defaultValue="">
        <option value="" disabled>Bitte wählen</option>
        {f.optionen?.map((o) => <option key={o.wert} value={o.wert}>{o.text}</option>)}
      </select>
    );
  } else if (f.typ === "mehrzeilig") {
    control = <textarea {...common} />;
  } else if (f.typ === "datei") {
    control = <input {...common} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />;
  } else {
    control = <input {...common} type={f.typ || "text"} autoComplete={f.autocomplete} />;
  }
  return (
    <div className={`feld${fehler ? " feld--fehler" : ""}`} style={f.breit ? { gridColumn: "1 / -1" } : undefined}>
      <label htmlFor={id}>
        {f.label}
        {f.pflicht && <span className="feld__pflicht" aria-hidden="true"> *</span>}
      </label>
      <div className="feld__rahmen">
        {control}
        {f.typ !== "datei" && <span className="feld__strich" aria-hidden="true" />}
      </div>
      {f.hilfe && <span id={`${id}-hilfe`} className="feld__hilfe">{f.hilfe}</span>}
      {fehler && <span id={`${id}-fehler`} className="feld__fehler" role="alert">{fehler}</span>}
    </div>
  );
}

export default function Formular({ art, felder, knopf }: { art: "kontakt" | "teilenregister"; felder: Feld[][]; knopf: string }) {
  const form = useRef<HTMLFormElement>(null);
  const erfolgRef = useRef<HTMLDivElement>(null);
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"bereit" | "sendet" | "ok" | "problem">("bereit");

  const pruefen = () => {
    const f = form.current!;
    const neu: Record<string, string> = {};
    Array.from(f.elements).forEach((el) => {
      const e = el as HTMLInputElement;
      if (!e.name || e.willValidate === false) return;
      if (!e.checkValidity()) {
        const art = (Object.keys(FEHLER) as (keyof ValidityState)[]).find((k) => e.validity[k]);
        neu[e.name] = (art && FEHLER[art as string]) || "Bitte Angabe prüfen.";
      }
    });
    setFehler(neu);
    const erstes = Object.keys(neu)[0];
    if (erstes) {
      const el = f.querySelector<HTMLElement>(`[name="${erstes}"]`);
      el?.focus();
      // Kurzes Schütteln aller fehlerhaften Felder – nacheinander, wie eine Welle
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const felder = Object.keys(neu)
          .map((n) => f.querySelector(`[name="${n}"], [name="${n}[]"]`)?.closest(".feld"))
          .filter(Boolean) as Element[];
        gsap.fromTo(felder, { x: -8 }, { x: 0, duration: 0.7, ease: "elastic.out(1.2, 0.25)", stagger: 0.06 });
      }
    }
    return !erstes;
  };

  const senden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pruefen()) return;
    setStatus("sendet");
    try {
      const daten = new FormData(form.current!);
      daten.set("formular", art);
      const r = await fetch("/formular.php", { method: "POST", body: daten });
      const j = await r.json().catch(() => ({ ok: false }));
      if (!r.ok || !j.ok) throw new Error();
      setStatus("ok");
      requestAnimationFrame(() => {
        if (erfolgRef.current) {
          gsap.from(erfolgRef.current, { autoAlpha: 0, y: 20, scale: 0.98, duration: 0.8 });
          gsap.fromTo(erfolgRef.current.querySelector("circle"), { drawSVG: "0%", rotate: -90, transformOrigin: "50% 50%" }, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" });
          gsap.fromTo(erfolgRef.current.querySelector("path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, delay: 0.7, ease: "back.out(2)" });
          gsap.from(erfolgRef.current.querySelectorAll("strong, p"), { autoAlpha: 0, x: 12, duration: 0.7, stagger: 0.08, delay: 0.4 });
          erfolgRef.current.focus();
        }
      });
    } catch {
      setStatus("problem");
    }
  };

  if (status === "ok") {
    return (
      <div ref={erfolgRef} className="hinweis hinweis--erfolg" tabIndex={-1} role="status" style={{ display: "flex", gap: 16, alignItems: "center", padding: 32 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style={{ flex: "none" }}>
          <circle cx="20" cy="20" r="19" fill="none" stroke="var(--see)" strokeWidth="1.5" />
          <path d="M12 21 18 27 29 14" fill="none" stroke="var(--see)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <strong>Vielen Dank.</strong>
          <p style={{ margin: 0 }}>Ihre Angaben sind bei uns eingegangen. Wir melden uns so bald wie möglich.</p>
        </div>
      </div>
    );
  }

  return (
    <form ref={form} className="formular" onSubmit={senden} noValidate>
      <p className="klein" style={{ margin: 0 }}>* Pflichtfeld</p>
      {felder.map((zeile, i) => (
        <div key={i} className={zeile.length > 1 ? "formular__zeile" : undefined}>
          {zeile.map((f) => <Eingabe key={f.name} f={f} fehler={fehler[f.name]} />)}
        </div>
      ))}
      {/* Schutz vor Spam: Menschen sehen dieses Feld nicht */}
      <div className="honig" aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className={`feld${fehler.datenschutz ? " feld--fehler" : ""}`}>
        <label className="check">
          <input type="checkbox" name="datenschutz" required aria-invalid={fehler.datenschutz ? true : undefined} />
          <span>
            Ich bin einverstanden, dass meine Angaben zur Bearbeitung meines Anliegens verwendet werden (siehe{" "}
            <Link className="link" href="/datenschutz/">Datenschutzerklärung</Link>). <span className="feld__pflicht" aria-hidden="true">*</span>
          </span>
        </label>
        {fehler.datenschutz && <span className="feld__fehler" role="alert">Bitte bestätigen Sie die Einwilligung.</span>}
      </div>
      {status === "problem" && (
        <div className="hinweis" role="alert">
          Das Formular konnte nicht gesendet werden. Bitte schreiben Sie uns direkt an{" "}
          <a className="link" href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a>.
        </div>
      )}
      <div>
        <button type="submit" className={`btn btn--primaer${status === "sendet" ? " ist-sendend" : ""}`} disabled={status === "sendet"} aria-busy={status === "sendet"} data-magnet="">
          <span className="btn__rolle">
            <span>{status === "sendet" ? "Wird gesendet …" : knopf}</span>
            <span aria-hidden="true">{status === "sendet" ? "Wird gesendet …" : knopf}</span>
          </span>
          {status === "sendet" ? (
            <span className="btn__punkte" aria-hidden="true"><span /><span /><span /></span>
          ) : (
            <span className="btn__pfeil" aria-hidden="true"><span>→</span></span>
          )}
        </button>
      </div>
    </form>
  );
}

export const kontaktFelder: Feld[][] = [
  [
    { name: "name", label: "Vorname und Name", pflicht: true, autocomplete: "name" },
    { name: "email", label: "E-Mail", typ: "email", pflicht: true, autocomplete: "email" },
  ],
  [
    { name: "telefon", label: "Telefon", typ: "tel", autocomplete: "tel" },
    { name: "anliegen", label: "Anliegen", typ: "auswahl", pflicht: true, optionen: anliegen.map((a) => ({ wert: a.wert, text: a.text })), hilfe: "Wir leiten Ihre Nachricht an die zuständige Stelle weiter." },
  ],
  [{ name: "nachricht", label: "Nachricht", typ: "mehrzeilig", pflicht: true, breit: true }],
];

export const registerFelder: Feld[][] = [
  [
    { name: "vorname", label: "Vorname", pflicht: true, autocomplete: "given-name" },
    { name: "nachname", label: "Nachname", pflicht: true, autocomplete: "family-name" },
  ],
  [
    { name: "ledigname", label: "Familienname (ledig)" },
    { name: "geburtsdatum", label: "Geburtsdatum", typ: "date", pflicht: true, autocomplete: "bday" },
  ],
  [{ name: "adresse", label: "Adresse (Strasse, PLZ, Ort)", pflicht: true, autocomplete: "street-address", breit: true }],
  [
    { name: "vater", label: "Vater (Vorname, Name)", pflicht: true },
    { name: "mutter", label: "Mutter (Vorname, Name)", pflicht: true },
  ],
  [
    { name: "email", label: "E-Mail", typ: "email", autocomplete: "email" },
    { name: "telefon", label: "Telefon", typ: "tel", autocomplete: "tel" },
  ],
  [
    { name: "partner", label: "Ehepartner/in" },
    {
      name: "gesuch",
      label: "Ich ersuche um",
      typ: "auswahl",
      pflicht: true,
      optionen: [
        { wert: "aufnahme", text: "Aufnahme ins Teilenregister" },
        { wert: "mutation", text: "Mutation (Adresse/Zivilstand)" },
        { wert: "austritt", text: "Austritt/Abmeldung" },
      ],
    },
  ],
  [{ name: "unterlagen", label: "Unterlagen", typ: "datei", hilfe: "ID, Familienbüchlein, Wohnsitzbestätigung der Gemeinde Lungern (PDF/JPG, max. 8 MB total).", breit: true }],
  [{ name: "bemerkungen", label: "Bemerkungen", typ: "mehrzeilig", breit: true }],
];
