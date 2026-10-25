/**
 * Grundpfad der Website. Leer für die eigene Domain (hosttech) und lokal,
 * «/Teilsame-Dorf» für die Vorschau auf GitHub Pages (wird beim Build über NEXT_PUBLIC_BASIS gesetzt).
 * Next.js-Links (<Link>) ergänzen ihn selbst – nötig ist das nur für Bilder, Dateien und fetch().
 */
export const BASIS = (process.env.NEXT_PUBLIC_BASIS || "").replace(/\/+$/, "");

/** Pfad aus /public mit Grundpfad versehen, z. B. pfad("/bilder/alpweide.jpg") */
export const pfad = (p: string) => (p.startsWith("/") ? `${BASIS}${p}` : p);

/** Grundpfad aus einer Browser-Adresse entfernen (für den Vergleich mit Next.js-Routen) */
export const ohneBasis = (p: string) => (BASIS && p.startsWith(BASIS) ? p.slice(BASIS.length) || "/" : p);
