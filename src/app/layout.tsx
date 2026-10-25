import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Kopf from "@/components/Kopf";
import Fuss from "@/components/Fuss";
import NachOben from "@/components/NachOben";
import Animationen from "@/components/Animationen";
import Buehne from "@/components/Buehne";
import Intro from "@/components/Intro";
import Vorhang from "@/components/Vorhang";
import Zeiger from "@/components/Zeiger";
import Mikro from "@/components/Mikro";
import { stammdaten } from "@/inhalte/daten";

// Schriften lokal eingebunden (SIL Open Font License) – keine Anfragen an Google
const sans = localFont({
  src: [
    { path: "../fonts/source-sans-3-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/source-sans-3-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/source-sans-3-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: [{ path: "../fonts/source-serif-4-latin-600-normal.woff2", weight: "600", style: "normal" }],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teilsame-lungern-dorf.ch"),
  title: { default: stammdaten.name, template: `%s · ${stammdaten.name}` },
  description: "Die Teilsame Lungern-Dorf: Wald, Alpen und Gärten – gemeinsames Grundeigentum der Teiler in Lungern, Obwalden.",
  openGraph: { locale: "de_CH", type: "website", siteName: stammdaten.name, images: ["/bilder/dorf-see-luftbild.jpg"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#121814" },
  ],
};

// Entwurfsband: vor der Aufschaltung mit NEXT_PUBLIC_ENTWURF=false bauen.
const ENTWURF = process.env.NEXT_PUBLIC_ENTWURF !== "false";

// Läuft vor dem ersten Bild: JS-Klasse, Intro nur einmal pro Sitzung, Maus-Erkennung
const VORAB = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(sessionStorage.getItem('tl-intro'))d.classList.add('intro-gesehen');else d.classList.add('intro-laeuft')}catch(e){d.classList.add('intro-gesehen')}
if(matchMedia('(hover: hover) and (pointer: fine)').matches)d.classList.add('mit-maus')})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${sans.variable} ${serif.variable}${ENTWURF ? " mit-entwurf" : ""}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: VORAB }} />
        <Intro />
        <a className="springe-zum-inhalt" href="#inhalt">Zum Inhalt springen</a>
        {ENTWURF && (
          <div className="entwurf-band" role="note">
            <span className="entwurf-band__lang">Entwurf – Inhalte und Personendaten werden vom Teilenrat noch geprüft.</span>
            <span className="entwurf-band__kurz">Entwurf – Inhalte in Prüfung</span>
          </div>
        )}
        <Kopf />
        <Buehne>
          <main id="inhalt">{children}</main>
          <Animationen eintritt={false} mitVorhang={false}>
            <Fuss />
          </Animationen>
        </Buehne>
        <NachOben />
        <Vorhang />
        <Zeiger />
        <Mikro />
      </body>
    </html>
  );
}
