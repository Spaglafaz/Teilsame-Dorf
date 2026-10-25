/**
 * Alle Inhalte der Website an einem Ort.
 * Grundlage: Strukturvorschlag V2 (25.10.2026), Personalliste nach der Einungsgemeinde vom 27.03.2024,
 * Porträtfotos im Ordner «Fotos-Teilenräte».
 *
 * Regel: Nur gesicherte Angaben publizieren. Alles, was mit «OFFEN» markiert ist, muss die Teilsame
 * bestätigen oder liefern, bevor die Seite live geht. Leere Werte werden auf der Seite nicht angezeigt.
 */

export const stammdaten = {
  name: "Teilsame Lungern-Dorf",
  domain: "www.teilsame-lungern-dorf.ch",
  email: "info@teilsame-lungern-dorf.ch",
  telefon: "079 437 95 87",
  adresse: ["Teilsame Lungern-Dorf", "Hansueli Ming", "Bergstrasse 11", "6078 Lungern"],
  tagline: "Wald, Alpen und Gärten – gemeinsames Grundeigentum der Teiler.",
};

/** Nur bestätigte Termine eintragen. Leere Liste ⇒ «Zurzeit sind keine Termine angekündigt.» */
export const termine: { datum: string; anlass: string; zeit?: string; ort?: string }[] = [
  // OFFEN: nächste Einungsgemeinde, z. B. { datum: "TT.MM.2027", anlass: "Einungsgemeinde", zeit: "19.00 Uhr", ort: "…" }
];

/** Kennzahlen: nur gesicherte Werte. Ohne Wert wird die Kachel nicht angezeigt. */
export const kennzahlen: { wert?: number; suffix?: string; anzeige?: string; label: string; href?: string }[] = [
  { wert: 50, suffix: " %", label: "Beteiligung an der Forst Lungern AG", href: "/bereiche/forst-lungern-ag/" },
  { anzeige: "7 + 1", label: "Teilenrat und Schreiber", href: "/ueber-uns/teilenrat/" },
  { label: "Stimmberechtigte Teiler", href: "/teiler/" }, // OFFEN: Anzahl
  { label: "Entstehungsjahr" }, // OFFEN
  { label: "Alpfläche in ha" }, // OFFEN
];

export type Bereich = {
  slug: string;
  nummer: number;
  titel: string;
  kurz: string;
  text: string[];
  aufgaben?: string[];
  bild: string;
  bildAlt: string;
  kontakt: { funktion: string; name?: string; email?: string };
  dokumente: string[];
  extern?: { text: string; href?: string };
};

export const bereiche: Bereich[] = [
  {
    slug: "alpkommission",
    nummer: 1,
    titel: "Alpkommission",
    kurz: "Zuständig für die Alpen der Teilsame. Die Sitzungen leitet der Einigerpräsident.",
    text: [
      "Die Alpkommission ist für die Alpen der Teilsame Lungern-Dorf zuständig. Ihre Sitzungen werden vom Einigerpräsidenten geleitet.",
    ],
    // OFFEN: Aufgaben bestätigen (Vorschlag aus dem Strukturvorschlag)
    aufgaben: ["Alpvergabe und Bestossung", "Unterhalt der Alpen", "Alp- und Güterstrassen"],
    bild: "/bilder/alpweide.jpg",
    bildAlt: "Alpweide mit Stall und Fahrweg, im Hintergrund bewaldete Kuppen",
    kontakt: { funktion: "Einigerpräsident", email: "info@teilsame-lungern-dorf.ch" }, // OFFEN: Name (Amtsdauer 2024/2025 abgelaufen), eigene Funktionsadresse?
    dokumente: ["Wurf- und Alpverordnung"],
  },
  {
    slug: "gartenverwalter",
    nummer: 2,
    titel: "Gartenverwalter",
    kurz: "Verwaltet die Gartenflächen sowie die Bergheu- und Streueparzellen.",
    text: [
      "Der Gartenverwalter der Teilsame Lungern-Dorf ist für die Verwaltung und Organisation der Gartenflächen sowie der Bergheu- und Streueparzellen zuständig.",
      "Er koordiniert die Verpachtung, überwacht die Nutzung und sorgt für eine nachhaltige Bewirtschaftung im Sinne der Gemeinschaft.",
    ],
    bild: "/bilder/alphang.jpg",
    bildAlt: "Steiler Alphang mit Viehgangeln und Waldrand",
    kontakt: { funktion: "Gartenverwalter", email: "gartenverwalter@teilsame-lungern-dorf.ch" }, // OFFEN: Name (Amtsdauer 2024/2025 abgelaufen)
    dokumente: ["Kulturland- und Gartenverordnung", "Gartenparzellenplan"],
  },
  {
    slug: "rechnungswesen",
    nummer: 3,
    titel: "Rechnungswesen",
    kurz: "Die Buchführungsstelle führt das gesamte Rechnungswesen der Teilsame.",
    text: [
      "Die Buchführungsstelle ist verantwortlich für das gesamte Rechnungswesen der Teilsame.",
      "Die Jahresrechnung wird von der Rechnungsprüfungskommission geprüft.",
    ],
    bild: "/bilder/dorf-see-luftbild.jpg",
    bildAlt: "Luftbild von Lungern-Dorf mit Kirche und Lungernsee",
    kontakt: { funktion: "Buchführungsstelle", name: "Serafina Ming-Gasser", email: "info@teilsame-lungern-dorf.ch" },
    dokumente: ["Jahresrechnung", "Budget"],
  },
  {
    slug: "forst-lungern-ag",
    nummer: 4,
    titel: "Forst Lungern AG",
    kurz: "Die Bewirtschaftung des Waldes erfolgt durch die Forst Lungern AG. Die Teilsame ist mit 50 % beteiligt.",
    text: [
      "Die Bewirtschaftung des Waldes erfolgt durch die Forst Lungern AG. Die Teilsame Lungern-Dorf ist mit 50 % an der Gesellschaft beteiligt.",
      "Die Forst Lungern AG kümmert sich neben der Waldpflege auch um Hang- und Bachverbauungen, Steinschlagnetze und Wasserfassungen.",
      "Anfragen zu Brennholz, Holzschnitzeln und Forstdienstleistungen richten Sie bitte direkt an die Forst Lungern AG.",
    ],
    bild: "/bilder/felsweg.jpg",
    bildAlt: "Bagger räumt Felsbrocken auf einem schmalen Weg",
    kontakt: { funktion: "Forst Lungern AG", email: "info@forst-lungern.ch" }, // OFFEN: bei der AG bestätigen
    dokumente: [],
    extern: { text: "Zur Forst Lungern AG" }, // OFFEN: Website-Adresse der AG
  },
];

export type Person = {
  name: string;
  funktion: string;
  foto?: string;
  email?: string;
};

/**
 * Teilenrat gemäss Porträtfotos (7 Personen).
 * OFFEN: Funktionen bestätigen. Die Personalliste 2024 nennt teilweise andere Personen
 * (z. B. Dominik Gasser-Imfeld, Josef Imfeld-Ettlin, Niklaus Gasser-Fryand).
 * Vollständige Doppelnamen, Wahljahr und Einverständnis zur Publikation fehlen.
 */
export const teilenrat: Person[] = [
  { name: "Hansueli Ming", funktion: "Teilenpräsident", foto: "/bilder/teilenrat/hansueli-ming.jpg", email: "praesident@teilsame-lungern-dorf.ch" },
  { name: "Christian Ming", funktion: "Mitglied", foto: "/bilder/teilenrat/christian-ming.jpg" },
  { name: "Christof Gasser", funktion: "Mitglied", foto: "/bilder/teilenrat/christof-gasser.jpg" },
  { name: "Franz Gasser", funktion: "Mitglied", foto: "/bilder/teilenrat/franz-gasser.jpg" },
  { name: "Martin Vogler", funktion: "Mitglied", foto: "/bilder/teilenrat/martin-vogler.jpg" },
  { name: "Roger Vogler", funktion: "Mitglied", foto: "/bilder/teilenrat/roger-vogler.jpg" },
  { name: "Sepp Ming", funktion: "Mitglied", foto: "/bilder/teilenrat/sepp-ming.jpg" },
];

/** Kommissionen & Verwaltung (Stand Personalliste 27.03.2024). Keine Privatadressen publizieren. */
export const verwaltung: { amt: string; personen: string[]; email?: string; hinweis?: string }[] = [
  { amt: "Aktuar/Archivar (Schreiber)", personen: ["Willi Imfeld-Thalmann"], email: "aktuar@teilsame-lungern-dorf.ch" },
  { amt: "Buchführungsstelle", personen: ["Serafina Ming-Gasser"] },
  { amt: "Rechnungsprüfungskommission", personen: ["Beat Gasser-Buchli", "Jasmin Vogler", "Cornelia Weissmüller-Caluori"] },
  { amt: "Einigerpräsident (Leitung Alpkommission)", personen: [], hinweis: "Besetzung wird bestätigt" },
  { amt: "Gartenverwalter", personen: [], email: "gartenverwalter@teilsame-lungern-dorf.ch", hinweis: "Besetzung wird bestätigt" },
  { amt: "Alpkommission", personen: [], hinweis: "Mitglieder werden bestätigt" },
];

/** OFFEN: Liste muss zusammengetragen werden. */
export const altpraesidenten: { von: string; bis: string; name: string }[] = [
  { von: "2017", bis: "heute", name: "Hansueli Ming" },
];

export const newsKategorien = ["Teilenrat", "Alpkommission", "Garten", "Forst Lungern AG", "Projekte", "Einungsgemeinde"] as const;

/** OFFEN: noch keine Beiträge. Format: { datum: "12. Oktober 2026", iso: "2026-10-12", kategorie, titel, bild, text } */
export const news: { datum: string; iso: string; kategorie: (typeof newsKategorien)[number]; titel: string; bild?: string; text: string }[] = [];

/** OFFEN: Projekttitel, Beschriebe und Status durch den Teilenrat. Bilder aus dem Ordner. */
export const projekte: { titel: string; status: string; bild: string; bildAlt: string; text?: string }[] = [
  { titel: "Projekt – Titel folgt", status: "Entwurf", bild: "/bilder/felsweg.jpg", bildAlt: "Bagger räumt Felsbrocken auf einem schmalen Weg" },
  { titel: "Projekt – Titel folgt", status: "Entwurf", bild: "/bilder/bau-gebaeude-1.jpg", bildAlt: "Gebäude im Bau unter einer Felswand" },
  { titel: "Projekt – Titel folgt", status: "Entwurf", bild: "/bilder/bau-gebaeude-2.jpg", bildAlt: "Baustelle mit neuer Betonplatte vor einem Stall" },
];

export const dokumentKategorien = ["Grundlagen", "Verordnungen", "Einungsgemeinde", "Pläne & Parzellen", "Korporationen OW", "Formulare"] as const;

/** href leer ⇒ «folgt». PDF-Dateien in public/dokumente/ ablegen und hier verlinken. */
export const dokumente: { titel: string; kategorie: (typeof dokumentKategorien)[number]; beschreibung: string; datum?: string; href?: string }[] = [
  { titel: "Einung der Teilsame Lungern-Dorf", kategorie: "Grundlagen", beschreibung: "Grundgesetz der Teilsame (aktuelle Fassung)." },
  { titel: "Waldverordnung", kategorie: "Verordnungen", beschreibung: "Regelt die Nutzung und Pflege des Waldes." },
  { titel: "Kulturland- und Gartenverordnung", kategorie: "Verordnungen", beschreibung: "Regelt Verpachtung und Nutzung von Kulturland und Gärten." },
  { titel: "Wurf- und Alpverordnung", kategorie: "Verordnungen", beschreibung: "Regelt die Nutzung der Alpen." },
  { titel: "Einladung und Traktanden Einungsgemeinde", kategorie: "Einungsgemeinde", beschreibung: "Unterlagen zur nächsten Einungsgemeinde." },
  { titel: "Korporationsparzellen Teilsamen Obsee und Dorf", kategorie: "Pläne & Parzellen", beschreibung: "Gemeinsamer Parzellenplan der beiden Teilsamen." },
  { titel: "Korporationsbuch Obwalden", kategorie: "Korporationen OW", beschreibung: "Übersicht der Korporationen im Kanton Obwalden.", href: "/dokumente/korporationsbuch-obwalden.pdf" },
  { titel: "Anmeldung Teilenregister (PDF)", kategorie: "Formulare", beschreibung: "Papierversion des Online-Formulars." },
  { titel: "Pachtgesuch Garten", kategorie: "Formulare", beschreibung: "Gesuch um Pacht einer Gartenparzelle." },
];

export const anliegen = [
  { wert: "allgemein", text: "Allgemeine Anfrage", an: "praesident@teilsame-lungern-dorf.ch" },
  { wert: "garten", text: "Garten / Pacht", an: "gartenverwalter@teilsame-lungern-dorf.ch" },
  { wert: "alpen", text: "Alpen", an: "info@teilsame-lungern-dorf.ch" },
  { wert: "teilenregister", text: "Teilenregister", an: "aktuar@teilsame-lungern-dorf.ch" },
  { wert: "finanzen", text: "Finanzen", an: "info@teilsame-lungern-dorf.ch" },
];

export type NavPunkt = { titel: string; href: string; kinder?: { titel: string; href: string }[] };

export const navigation: NavPunkt[] = [
  { titel: "Willkommen", href: "/" },
  {
    titel: "Bereiche",
    href: "/bereiche/",
    kinder: bereiche.map((b) => ({ titel: b.titel, href: `/bereiche/${b.slug}/` })),
  },
  {
    titel: "Über uns",
    href: "/ueber-uns/teilenrat/",
    kinder: [
      { titel: "Teilenrat", href: "/ueber-uns/teilenrat/" },
      { titel: "Kommissionen & Verwaltung", href: "/ueber-uns/kommissionen/" },
      { titel: "Altpräsidenten", href: "/ueber-uns/altpraesidenten/" },
      { titel: "News", href: "/news/" },
    ],
  },
  { titel: "Teiler", href: "/teiler/" },
  { titel: "Projekte", href: "/projekte/" },
  { titel: "Downloads", href: "/downloads/" },
  { titel: "Kontakt", href: "/kontakt/" },
];
