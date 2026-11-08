import { DitherPattern, INK, NAVY, PAPER, InkFilter } from './InkDefs';
import { dotsAlong } from './inkMath';
import { EASE_IN, EASE_OUT, POP, useInkTimeline, type Key, type Track } from './useInkTimeline';

const LOOP = 5.6;
const BARS = [10, 22, 34, 18, 40, 26, 14];
const ROWS = [96, 128, 160];
const TRAIL = dotsAlong([174, 131], [205, 112], [218, 150], [246, 128], 9);

// Repeatable 0.35..1 levels so each bar speaks its own rhythm.
const level = (bar: number, beat: number) => {
  const n = Math.abs(Math.sin((bar * 7 + beat * 13 + 1) * 12.9898) * 43758.5453);
  return 0.35 + 0.65 * (n - Math.floor(n));
};

const barKeys = (bar: number): Key[] => {
  const lag = bar * 0.04;
  const beats: Key[] = Array.from({ length: 8 }, (_, beat) => [1.4 + beat * 0.27 + lag, `scaleY(${level(bar, beat).toFixed(2)})`]);
  return [
    [0.8 + lag, 'scaleY(0.15)', EASE_OUT],
    [1.1 + lag, 'scaleY(1)'],
    ...beats,
    [3.55 + lag, `scaleY(${level(bar, 7).toFixed(2)})`],
    [3.9 + lag, 'scaleY(0.15)'],
  ];
};

const trailKeys = (k: number): Key[] => {
  const waves: Key[] = [0, 1, 2].flatMap((wave): Key[] => {
    const peak = 1.75 + wave * 0.6 + k * 0.05;
    return [
      [peak - 0.1, 'scale(1)'],
      [peak, 'scale(1.7)'],
      [peak + 0.2, 'scale(1)'],
    ];
  });
  return [
    [1.0 + k * 0.07, 'scale(0)', POP],
    [1.25 + k * 0.07, 'scale(1)'],
    ...waves,
    [4.5 + k * 0.04, 'scale(1)', EASE_IN],
    [4.8 + k * 0.04, 'scale(0)'],
  ];
};

// Ring, speak, carry the voice across, check off the tasks it asked for, hold, clear.
const TRACKS: Track[] = [
  {
    sel: '.vo-phone',
    prop: 'transform',
    keys: [
      [0.05, 'rotate(0deg)'],
      [0.15, 'rotate(-3deg)'],
      [0.27, 'rotate(2.5deg)'],
      [0.39, 'rotate(-2deg)'],
      [0.51, 'rotate(1.2deg)'],
      [0.7, 'rotate(0deg)'],
    ],
  },
  ...[0, 1].map((arc): Track => ({
    sel: `.vo-ring-${arc}`,
    prop: 'opacity',
    keys: [
      [0.05 + arc * 0.1, 0],
      [0.2 + arc * 0.1, 1],
      [0.45 + arc * 0.1, 0],
      [0.55 + arc * 0.1, 1],
      [0.85 + arc * 0.1, 0],
    ],
  })),
  ...BARS.map((_, bar): Track => ({ sel: `.vo-bar-${bar}`, prop: 'transform', keys: barKeys(bar) })),
  ...TRAIL.map((_, k): Track => ({ sel: `.vo-dot-${k}`, prop: 'transform', keys: trailKeys(k) })),
  ...ROWS.flatMap((_, row): Track[] => {
    const at = 1.7 + row * 0.55;
    return [
      { sel: `.vo-line-${row}`, prop: 'strokeDashoffset', ease: EASE_OUT, keys: [[at, 1], [at + 0.35, 0]] },
      { sel: `.vo-box-${row}`, prop: 'opacity', keys: [[at + 0.3, 0], [at + 0.55, 1]] },
      { sel: `.vo-check-${row}`, prop: 'strokeDashoffset', ease: EASE_OUT, keys: [[at + 0.35, 1], [at + 0.7, 0]] },
    ];
  }),
  { sel: '.vo-fade', prop: 'opacity', keys: [[4.5, 1], [5.0, 0]] },
];

const centered = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

// A phone mid-call, its voice turning into checked-off actions on a clipboard.
export const VoiceSketch = () => {
  const ref = useInkTimeline(LOOP, TRACKS);
  return (
    <svg ref={ref} viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="A phone call turning into completed tasks">
      <InkFilter id="ink-voice" seed={7} />
      <defs>
        <DitherPattern id="vo-dither" level={6} />
      </defs>

      <g className="vo-phone" style={centered}>
        <g filter="url(#ink-voice)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="78" y="46" width="92" height="170" rx="16" />
          <rect x="88" y="60" width="72" height="140" rx="6" strokeWidth="1.6" />
          <rect x="111" y="52" width="26" height="5" rx="2.5" fill={INK} />
          {/* caller dot */}
          <circle cx="124" cy="86" r="9" fill={INK} />
          <path d="M108 104 h32" strokeWidth="1.6" />
          {/* hang-up button */}
          <rect x="110" y="178" width="28" height="9" rx="4.5" fill={INK} />
        </g>

        {/* live waveform on the phone screen */}
        <g fill={NAVY}>
          {BARS.map((h, i) => (
            <rect key={i} className={`vo-bar-${i}`} style={centered} x={98 + i * 8.4} y={150 - h / 2} width="4.6" height={h} rx="2.3" />
          ))}
        </g>
      </g>

      <g filter="url(#ink-voice)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* ringing */}
        <path className="vo-ring-0" opacity="0" d="M177 45 q7 7 3 17" strokeWidth="2" />
        <path className="vo-ring-1" opacity="0" d="M185 37 q12 11 5 28" strokeWidth="2" />

        {/* clipboard */}
        <rect x="252" y="62" width="96" height="140" rx="6" />
        <rect x="280" y="54" width="40" height="16" rx="4" fill={INK} />
        {ROWS.map((y) => (
          <rect key={y} x="266" y={y - 9} width="16" height="16" rx="2" strokeWidth="2" />
        ))}
        <g className="vo-fade">
          {ROWS.map((y, i) => (
            <path key={y} className={`vo-line-${i}`} d={`M292 ${y} h42`} strokeWidth="1.8" pathLength={1} strokeDasharray="1 2" />
          ))}
        </g>

        {/* scratchy ground shadows */}
        <path d="M72 226 l12 -3 M92 228 l16 -2 M150 227 l18 -3" strokeWidth="1.4" />
        <path d="M250 212 l14 -2 M300 213 l18 -3 M330 212 l10 -2" strokeWidth="1.4" />
      </g>

      {/* the voice, carried across as a trail of dither dots */}
      <g fill={NAVY}>
        {TRAIL.map(([x, y], k) => (
          <rect key={k} className={`vo-dot-${k}`} style={centered} x={x - 1.6} y={y - 1.6} width="3.2" height="3.2" shapeRendering="crispEdges" />
        ))}
      </g>

      {/* each task's box fills in dither as it lands */}
      <g className="vo-fade">
        {ROWS.map((y, i) => (
          <rect key={y} className={`vo-box-${i}`} x="267" y={y - 8} width="14" height="14" fill="url(#vo-dither)" />
        ))}
      </g>

      {/* checks, drawn in one after another */}
      <g className="vo-fade" filter="url(#ink-voice)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {ROWS.map((y, i) => (
          <g key={y} className={`vo-check-${i}`} strokeDasharray="1 2">
            <path d={`M268 ${y - 1} l5 6 l12 -15`} pathLength={1} stroke={PAPER} strokeWidth="6.5" />
            <path d={`M268 ${y - 1} l5 6 l12 -15`} pathLength={1} stroke={INK} strokeWidth="3" />
          </g>
        ))}
      </g>
    </svg>
  );
};
