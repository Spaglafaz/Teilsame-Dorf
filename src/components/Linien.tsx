/** Höhenlinien – das Ornament der Teilsame (aus dem Cover des Designsystems). */
export function Hoehenlinien({ className, anzahl = 6, draw = true, maus }: { className?: string; anzahl?: number; draw?: boolean; maus?: number }) {
  const pfade = Array.from({ length: anzahl }, (_, i) => {
    const r = 60 + i * 34;
    const wobble = 10 + i * 3;
    // weiche, leicht unregelmässige Bögen wie Höhenlinien auf der Landeskarte
    return `M ${520 - r} 0 C ${520 - r + wobble} ${r * 0.45}, ${520 - r * 0.55} ${r * 0.95}, 520 ${r + wobble * 0.6}`;
  });
  return (
    <svg className={className} viewBox="0 0 520 420" preserveAspectRatio="xMaxYMin slice" aria-hidden="true" {...(draw ? { "data-draw": "" } : {})} {...(maus ? { "data-maus": maus } : {})}>
      {pfade.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/** Bergsilhouette als Linien für die Fusszeile */
export function Bergkette({ className }: { className?: string }) {
  const linien = [
    "M0 180 L120 120 L200 150 L300 70 L380 120 L470 60 L560 110 L640 40 L740 115 L860 80 L960 130 L1080 60 L1200 120 L1320 90 L1440 140",
    "M0 200 L140 150 L240 175 L330 110 L430 150 L520 100 L620 140 L720 85 L820 140 L930 110 L1040 155 L1160 100 L1280 150 L1440 170",
    "M0 215 L160 185 L280 200 L380 160 L500 190 L600 150 L720 180 L840 140 L960 175 L1100 150 L1240 185 L1440 195",
  ];
  return (
    <svg className={className} viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" data-draw="">
      {linien.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export function Haken() {
  return (
    <span className="aufgaben__haken" aria-hidden="true">
      <svg viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" /></svg>
    </span>
  );
}
