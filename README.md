# Website Teilsame Lungern-Dorf

Next.js-Projekt (App Router, TypeScript) mit GSAP-Animationen. Gestaltung nach dem Designsystem «Teilsame Lungern-Dorf» (Tannengrün, Oliv, Lungernsee, Kalk; Source Serif 4 / Source Sans 3).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # erzeugt den Ordner «out/» (statische Website)
```

Für die Aufschaltung ohne Entwurfsband:

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_ENTWURF="false"; npm run build
```

## Veröffentlichen (z. B. hosttech / Plesk)

1. `npm run build` ausführen.
2. Den **Inhalt** des Ordners `out/` per Dateimanager oder FTP in das Webverzeichnis (`httpdocs`) laden.
3. `formular.php` liegt bereits in `out/`. Es versendet Kontakt- und Teilenregister-Formulare per PHP `mail()` an die Funktionsadressen. **Vor der Aufschaltung einen Testversand machen** und die Adressen oben in der Datei prüfen. Die Postfächer (info@, praesident@, gartenverwalter@, aktuar@) müssen existieren.

## Vorschau auf GitHub Pages

Bei jedem Push auf `main` baut GitHub die Seite automatisch und veröffentlicht sie unter
**https://spaglafaz.github.io/Teilsame-Dorf/** (Ablauf: `.github/workflows/pages.yml`).

- Einmalig nötig: auf GitHub unter **Settings → Pages → Source** «GitHub Actions» wählen.
- Die Vorschau läuft im Unterordner `/Teilsame-Dorf`; dafür setzt der Ablauf `NEXT_PUBLIC_BASIS=/Teilsame-Dorf`.
  Bilder und Dateien deshalb im Code immer mit `pfad("/bilder/…")` aus `src/lib/pfad.ts` einbinden.
- GitHub Pages kann kein PHP: Die Formulare senden in der Vorschau nicht. Für die echte Aufschaltung gilt weiterhin der Abschnitt oben.

## Inhalte ändern

Alle Texte, Personen, Termine, Kennzahlen, News, Projekte und Dokumente stehen in **`src/inhalte/daten.ts`**. Stellen mit `OFFEN` müssen noch bestätigt werden.

- Termine: Liste `termine` – nur bestätigte Termine eintragen.
- Kennzahlen: ohne Wert wird die Kachel automatisch ausgeblendet.
- Dokumente: PDF nach `public/dokumente/` legen und bei `href` eintragen (z. B. `"/dokumente/einung.pdf"`).
- Bilder: `public/bilder/`.

## Animationen (GSAP)

Alle GSAP-Plugins (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, Flip, CustomEase) sind seit GSAP 3.13 kostenlos.

**Seitenweit**
- `src/lib/gsap.ts` – Plugins und die Hausbewegungen «ruhig» und «vorhang».
- `src/lib/buehne.ts` – gemeinsamer Zustand: Intro fertig?, Vorhang offen?, ScrollSmoother.
- `src/components/Intro.tsx` – Intro beim ersten Besuch pro Sitzung (Höhenlinien, Wortmarke, Zähler).
- `src/components/Vorhang.tsx` – Seitenwechsel: tannengrüner Vorhang mit dem Namen der Zielseite.
- `src/components/Buehne.tsx` – weiches Scrollen (nur mit Maus/Trackpad) und Lesefortschritt oben.
- `src/components/Zeiger.tsx` – eigener Mauszeiger (Ring wird über Links zur Linse, über Karten «Öffnen»).
- `src/components/Mikro.tsx` – Karten neigen sich mit Lichtfleck (`data-tilt`), magnetische Buttons (`data-magnet`),
  Ornamente mit Tiefe (`data-maus`), Klick-Welle auf Buttons.

**Pro Seite** – `src/components/Animationen.tsx` über `data-`-Attribute:
`data-reveal`, `data-stagger` (Bilder öffnen sich, Haken zeichnen sich), `data-split`, `data-parallax`, `data-count`,
`data-draw`, `data-zeitleiste` (Punkte leuchten auf).

**Einzelne Bausteine**
- `Hero.tsx` – Titel wortweise mit Unschärfe, Bild-Zoom, Maus-Tiefe, Parallax.
- `Kopf.tsx` – gleitender Navigations-Marker, Buchstabenwelle in der Wortmarke, blendet beim Runterscrollen aus.
- `Filterliste.tsx` – gleitende Auswahl-Pille, Einträge fliessen mit GSAP Flip an ihren Platz.
- `Formular.tsx` – fehlerhafte Felder schütteln nacheinander, Sende-Punkte, gezeichneter Erfolgs-Haken.
- Buttons: rollender Text, durchschiessender Pfeil (CSS in `globals.css`, Abschnitt «Bewegung & Mikroanimationen»).

Wer im Betriebssystem «Bewegung reduzieren» eingestellt hat, sieht alle Inhalte sofort ohne Animation,
ohne Intro und ohne Vorhang. Auf Touch-Geräten bleibt das Scrollen nativ und der eigene Zeiger aus.
