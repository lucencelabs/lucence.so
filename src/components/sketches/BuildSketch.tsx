import { ACCENT, INK, InkFilter } from './InkDefs';

// A napkin sketch of an app, and the shipped app it became.
export const BuildSketch = () => (
  <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="A napkin sketch becoming a shipped app">
    <InkFilter id="ink-build" seed={12} />
    <g filter="url(#ink-build)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      {/* napkin, tilted */}
      <g transform="rotate(-7 125 135)">
        <rect x="62" y="70" width="126" height="126" rx="3" />
        {/* rough wireframe on it */}
        <rect x="82" y="88" width="52" height="10" strokeWidth="1.6" />
        <rect x="82" y="108" width="86" height="34" strokeWidth="1.6" />
        <path d="M86 112 l78 26 M164 112 l-78 26" strokeWidth="1.2" />
        <path d="M82 154 h70 M82 166 h54 M82 178 h62" strokeWidth="1.6" />
      </g>
      {/* pencil */}
      <g transform="rotate(18 120 222)">
        <rect x="70" y="216" width="92" height="10" rx="2" />
        <path d="M162 216 l16 5 l-16 5 z" fill={INK} />
        <rect x="64" y="216" width="8" height="10" fill={INK} />
      </g>

      {/* the hop from idea to product */}
      <path className="ink-flow" d="M200 112 C 220 80, 248 84, 258 108" strokeDasharray="3 7" strokeWidth="2" />
      <path d="M250 100 l8 9 l3 -12" strokeWidth="2" />

      {/* shipped phone */}
      <rect x="262" y="44" width="88" height="168" rx="16" />
      <rect x="290" y="50" width="32" height="5" rx="2.5" fill={INK} />
      <rect x="272" y="66" width="68" height="14" rx="3" fill={INK} />
      <path d="M274 152 h50 M274 166 h40 M274 180 h46" strokeWidth="1.8" />

      {/* sparks */}
      <g className="ink-spark">
        <path d="M362 58 l10 -8 M366 76 l13 -1 M358 42 l3 -12" strokeWidth="2" />
      </g>

      <path d="M256 222 l14 -2 M300 223 l18 -3 M334 222 l10 -2" strokeWidth="1.4" />
    </g>
    {/* the one finished thing on screen */}
    <rect x="273" y="90" width="66" height="48" rx="6" fill={ACCENT} filter="url(#ink-build)" />
  </svg>
);
