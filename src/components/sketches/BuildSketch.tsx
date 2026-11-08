import { DitherPattern, INK, InkFilter, NAVY, PAPER } from './InkDefs';
import { BAYER, dotsAlong } from './inkMath';
import { EASE_OUT, POP, useInkTimeline, type Key, type Track } from './useInkTimeline';

const LOOP = 5.8;
const TRAIL = dotsAlong([200, 134], [214, 116], [232, 116], [246, 124], 7);
const WIRE_LINES = ['M82 154 h70', 'M82 166 h54', 'M82 178 h62'];
// Pencil tip positions in napkin coordinates: [seconds, x, y], timed to the wireframe draws.
const REST: [number, number] = [116, 178];
const PENCIL: [number, number, number][] = [
  [0, ...REST],
  [0.15, 82, 88], [0.3, 134, 88], [0.33, 134, 98], [0.47, 82, 98],
  [0.5, 82, 108], [0.64, 168, 108], [0.7, 168, 142], [0.84, 82, 142], [0.9, 86, 112],
  [1.1, 164, 138], [1.15, 164, 112], [1.25, 86, 138],
  [1.3, 82, 154], [1.48, 152, 154], [1.52, 82, 166], [1.7, 136, 166], [1.74, 82, 178], [1.92, 144, 178],
  [2.25, ...REST],
];
const SCREEN_LINES = ['M274 152 h50', 'M274 166 h40', 'M274 180 h46'];

const draw = (sel: string, from: number, to: number, ease?: string): Track => ({
  sel,
  prop: 'strokeDashoffset',
  ease,
  keys: [[from, 1], [to, 0]],
});

// Sketch the wireframe, carry it across, then the phone screen comes alive: bar, a block that dithers in palest-first, copy, sparks.
const TRACKS: Track[] = [
  draw('.bd-wire-head', 0.15, 0.5, 'linear'),
  draw('.bd-wire-box', 0.5, 0.9, 'linear'),
  draw('.bd-wire-x0', 0.9, 1.1, 'linear'),
  draw('.bd-wire-x1', 1.15, 1.25, 'linear'),
  ...WIRE_LINES.map((_, j) => draw(`.bd-wire-line-${j}`, 1.3 + j * 0.22, 1.48 + j * 0.22, 'linear')),
  {
    // the pencil tip rides each wireframe stroke as it's drawn, then sets down beside the napkin
    sel: '.bd-pencil',
    prop: 'transform',
    ease: 'linear',
    keys: PENCIL.map(([t, x, y]): Key => [t, `translate(${x}px, ${y}px)`]),
  },
  ...TRAIL.map((_, k): Track => ({
    sel: `.bd-dot-${k}`,
    prop: 'transform',
    keys: [[2.05 + k * 0.06, 'scale(0)', POP], [2.25 + k * 0.06, 'scale(1)']],
  })),
  draw('.bd-arrow', 2.45, 2.6, EASE_OUT),
  { sel: '.bd-header', prop: 'transform', ease: EASE_OUT, keys: [[2.6, 'scaleX(0)'], [3.0, 'scaleX(1)']] },
  { sel: '.bd-header', prop: 'opacity', keys: [[2.6, 0], [2.7, 1]] },
  draw('.bd-block', 2.75, 3.15),
  ...BAYER.map((_, b): Track => {
    const at = 2.95 + (15 - b) * 0.045;
    return { sel: `.bd-b-${b}`, prop: 'opacity', ease: 'linear', keys: [[at, 0], [at + 0.08, 1]] };
  }),
  ...SCREEN_LINES.map((_, j) => draw(`.bd-line-${j}`, 3.55 + j * 0.12, 3.8 + j * 0.12, EASE_OUT)),
  { sel: '.bd-spark', prop: 'opacity', keys: [[3.95, 0], [4.15, 1]] },
  { sel: '.bd-spark', prop: 'transform', ease: POP, keys: [[3.95, 'scale(0.3)'], [4.3, 'scale(1)']] },
  { sel: '.bd-fade', prop: 'opacity', keys: [[4.9, 1], [5.35, 0]] },
];

const centered = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

// A napkin sketch of an app, and the shipped app it became.
export const BuildSketch = () => {
  const ref = useInkTimeline(LOOP, TRACKS);
  return (
    <svg ref={ref} viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="A napkin sketch becoming a shipped app">
      <InkFilter id="ink-build" seed={12} />
      <defs>
        {BAYER.map((_, b) => (
          <DitherPattern key={b} id={`bd-b${b}`} level={9} only={b} />
        ))}
      </defs>

      {/* the one finished thing on screen, dithering in a Bayer level at a time */}
      <g className="bd-fade">
        {BAYER.map((_, b) => (
          <rect key={b} className={`bd-b-${b}`} x="276" y="93" width="60" height="42" fill={`url(#bd-b${b})`} />
        ))}
      </g>

      <g filter="url(#ink-build)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* napkin, tilted */}
        <g transform="rotate(-7 125 135)">
          <rect x="62" y="70" width="126" height="126" rx="3" />
          {/* rough wireframe on it */}
          <g className="bd-fade" strokeDasharray="1 2">
            <path className="bd-wire-head" d="M82 88 h52 v10 h-52 z" strokeWidth="1.6" pathLength={1} />
            <path className="bd-wire-box" d="M82 108 h86 v34 h-86 z" strokeWidth="1.6" pathLength={1} />
            <path className="bd-wire-x0" d="M86 112 l78 26" strokeWidth="1.2" pathLength={1} />
            <path className="bd-wire-x1" d="M164 112 l-78 26" strokeWidth="1.2" pathLength={1} />
            {WIRE_LINES.map((d, j) => (
              <path key={d} className={`bd-wire-line-${j}`} d={d} strokeWidth="1.6" pathLength={1} />
            ))}
          </g>
          {/* pencil, tip at its own origin so the timeline can steer the point */}
          <g className="bd-pencil" style={{ transform: `translate(${REST[0]}px, ${REST[1]}px)` }}>
            <g transform="rotate(38)">
              <path d="M0 0 L15 -5 L15 5 Z" fill={INK} />
              <rect x="15" y="-5" width="78" height="10" rx="2" fill={PAPER} />
              <rect x="93" y="-5" width="8" height="10" fill={INK} />
            </g>
          </g>
        </g>

        {/* the hop from idea to product */}
        <path className="bd-arrow bd-fade" d="M245 118 L253 125 L244 131" stroke={NAVY} strokeWidth="2.2" pathLength={1} strokeDasharray="1 2" />

        {/* shipped phone */}
        <rect x="262" y="44" width="88" height="168" rx="16" />
        <rect x="290" y="50" width="32" height="5" rx="2.5" fill={INK} />
        <g className="bd-fade">
          <rect className="bd-header" style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} x="272" y="66" width="68" height="14" rx="3" fill={INK} />
          <path
            className="bd-block"
            d="M279 90 h54 a6 6 0 0 1 6 6 v36 a6 6 0 0 1 -6 6 h-54 a6 6 0 0 1 -6 -6 v-36 a6 6 0 0 1 6 -6 z"
            strokeWidth="2.2"
            pathLength={1}
            strokeDasharray="1 2"
          />
          {SCREEN_LINES.map((d, j) => (
            <path key={d} className={`bd-line-${j}`} d={d} strokeWidth="1.8" pathLength={1} strokeDasharray="1 2" />
          ))}
          {/* sparks */}
          <g className="bd-spark" style={{ transformBox: 'fill-box', transformOrigin: 'left bottom' }}>
            <path d="M362 58 l10 -8 M366 76 l13 -1 M358 42 l3 -12" strokeWidth="2" />
          </g>
        </g>

        <path d="M256 222 l14 -2 M300 223 l18 -3 M334 222 l10 -2" strokeWidth="1.4" />
      </g>

      {/* the idea, carried across as a trail of dither dots */}
      <g className="bd-fade" fill={NAVY}>
        {TRAIL.map(([x, y], k) => (
          <rect key={k} className={`bd-dot-${k}`} style={centered} x={x - 1.6} y={y - 1.6} width="3.2" height="3.2" shapeRendering="crispEdges" />
        ))}
      </g>
    </svg>
  );
};
