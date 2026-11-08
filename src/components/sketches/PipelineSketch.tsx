import { DitherPattern, INK, InkFilter, PAPER } from './InkDefs';
import { EASE, EASE_IN, EASE_OUT, useInkTimeline, type Key, type Track } from './useInkTimeline';

const LOOP = 6;
const RECORDS = [0, 1, 2];
const BELT_Y = 165;
// Each record's resting spot on the belt, which is also the still frame.
const restX = (i: number) => 135 + i * 52;

const recordKeys = (i: number): Key[] => {
  const start = 0.2 + i * 0.7;
  const to = (x: number, y: number, extra = '') => `translate(${x - restX(i)}px, ${y - BELT_Y}px)${extra}`;
  return [
    [start, to(82, 128, ' rotate(-14deg) scale(0.9)'), EASE_OUT],
    [start + 0.3, to(108, 116, ' rotate(-6deg)'), EASE_IN],
    [start + 0.6, to(135, BELT_Y, ' rotate(0deg)')],
    [start + 1.7, to(258, BELT_Y, ' rotate(0deg)'), EASE_OUT],
    [start + 2.05, to(306, 54, ' rotate(10deg)'), EASE_IN],
    [start + 2.4, to(330, 104, ' rotate(0deg) scale(0.5)')],
  ];
};

// Records lift off the pile, ride the belt, drop into the database one band at a time, then it drains for the next batch.
const TRACKS: Track[] = [
  ...RECORDS.flatMap((i): Track[] => {
    const start = 0.2 + i * 0.7;
    return [
      { sel: `.pp-record-${i}`, prop: 'transform', keys: recordKeys(i) },
      { sel: `.pp-record-${i}`, prop: 'opacity', keys: [[start, 0], [start + 0.2, 1], [start + 2.2, 1], [start + 2.4, 0]] },
    ];
  }),
  { sel: '.pp-belt', prop: 'strokeDashoffset', keys: [[0.7, 0], [3.6, -168]] },
  {
    sel: '.pp-fill',
    prop: 'transform',
    ease: EASE_OUT,
    keys: [
      [2.55, 'translateY(110px)'],
      [3.0, 'translateY(64px)'],
      [3.25, 'translateY(64px)'],
      [3.7, 'translateY(32px)'],
      [3.95, 'translateY(32px)'],
      [4.4, 'translateY(0px)'],
      [5.2, 'translateY(0px)', EASE],
      [5.85, 'translateY(110px)'],
    ],
  },
];

// A messy pile of raw records riding a conveyor into a clean datastore.
export const PipelineSketch = () => {
  const ref = useInkTimeline(LOOP, TRACKS);
  return (
    <svg ref={ref} viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="Raw data moving down a pipeline into a database">
      <InkFilter id="ink-pipe" seed={21} />
      <defs>
        <DitherPattern id="pp-dither" level={7} />
        <DitherPattern id="pp-record" level={4} />
        <clipPath id="pp-tank">
          <path d="M291 98 v92 c 0 7 18 13 39 13 s 39 -6 39 -13 v-92 c 0 7 -18 13 -39 13 s -39 -6 -39 -13 z" />
        </clipPath>
      </defs>

      {/* the database's contents, filling a band per record */}
      <g clipPath="url(#pp-tank)">
        <path className="pp-fill" style={{ transform: 'translateY(32px)' }} d="M290 98 c 0 7 18 13 40 13 s 40 -6 40 -13 V 230 H 290 z" fill="url(#pp-dither)" />
      </g>

      <g filter="url(#ink-pipe)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* pile of raw records */}
        <rect x="40" y="96" width="54" height="40" rx="2" transform="rotate(-12 67 116)" />
        <rect x="50" y="116" width="54" height="40" rx="2" transform="rotate(8 77 136)" />
        <rect x="36" y="140" width="54" height="40" rx="2" transform="rotate(-4 63 160)" fill={PAPER} />
        <path d="M46 152 h32 M46 162 h24" strokeWidth="1.5" />

        {/* conveyor */}
        <rect x="104" y="176" width="176" height="22" rx="11" />
        <path className="pp-belt" d="M128 187 H256" strokeWidth="1.6" strokeDasharray="4 8" />
        <circle cx="116" cy="187" r="6" fill={INK} />
        <circle cx="268" cy="187" r="6" fill={INK} />
        <path d="M140 210 l-6 20 M250 210 l6 20" />

        {/* database */}
        <ellipse cx="330" cy="98" rx="40" ry="13" />
        <path d="M290 98 v92 c 0 7 18 13 40 13 s 40 -6 40 -13 v-92" />
        <path d="M290 130 c 0 7 18 13 40 13 s 40 -6 40 -13 M290 162 c 0 7 18 13 40 13 s 40 -6 40 -13" strokeWidth="1.8" />

        <path d="M30 232 l14 -2 M70 233 l18 -3 M300 222 l14 -2 M340 223 l14 -3" strokeWidth="1.4" />
      </g>

      {/* records in flight; the markup holds them on the belt for the still frame */}
      {RECORDS.map((i) => (
        <g key={i} className={`pp-record-${i}`} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={restX(i) - 11} y={BELT_Y - 11} width="22" height="22" rx="3" fill={PAPER} />
          <rect x={restX(i) - 9} y={BELT_Y - 9} width="18" height="18" fill="url(#pp-record)" />
          <rect
            x={restX(i) - 11}
            y={BELT_Y - 11}
            width="22"
            height="22"
            rx="3"
            fill="none"
            stroke={INK}
            strokeWidth="2.4"
            filter="url(#ink-pipe)"
          />
        </g>
      ))}
    </svg>
  );
};
