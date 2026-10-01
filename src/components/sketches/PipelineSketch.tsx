import { ACCENT, INK, InkFilter } from './InkDefs';

// A messy pile of raw records riding a conveyor into a clean datastore.
export const PipelineSketch = () => (
  <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="Raw data moving down a pipeline into a database">
    <InkFilter id="ink-pipe" seed={21} />
    <g filter="url(#ink-pipe)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      {/* pile of raw records */}
      <rect x="40" y="96" width="54" height="40" rx="2" transform="rotate(-12 67 116)" />
      <rect x="50" y="116" width="54" height="40" rx="2" transform="rotate(8 77 136)" />
      <rect x="36" y="140" width="54" height="40" rx="2" transform="rotate(-4 63 160)" fill="#fbfaf6" />
      <path d="M46 152 h32 M46 162 h24" strokeWidth="1.5" />

      {/* conveyor */}
      <rect x="104" y="176" width="176" height="22" rx="11" />
      <circle cx="116" cy="187" r="6" fill={INK} />
      <circle cx="268" cy="187" r="6" fill={INK} />
      <path d="M140 210 l-6 20 M250 210 l6 20" />

      {/* database */}
      <ellipse cx="330" cy="98" rx="40" ry="13" />
      <path d="M290 98 v92 c 0 7 18 13 40 13 s 40 -6 40 -13 v-92" />
      <path d="M290 130 c 0 7 18 13 40 13 s 40 -6 40 -13 M290 162 c 0 7 18 13 40 13 s 40 -6 40 -13" strokeWidth="1.8" />

      <path d="M30 232 l14 -2 M70 233 l18 -3 M300 222 l14 -2 M340 223 l14 -3" strokeWidth="1.4" />
    </g>

    {/* sorted records riding the belt */}
    <g className="ink-belt" filter="url(#ink-pipe)">
      {[0, 1, 2].map((i) => (
        <rect key={i} x={124 + i * 52} y="154" width="22" height="22" rx="3" fill={i === 1 ? ACCENT : INK} />
      ))}
    </g>
  </svg>
);
