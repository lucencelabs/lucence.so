import { BAYER } from './inkMath';

// Shared SVG filter that roughens clean vector strokes into wobbly hand-inked lines.
export const InkFilter = ({ id, seed = 3 }: { id: string; seed?: number }) => (
  <defs>
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

export const INK = '#151515';
export const NAVY = '#16305b';
export const SLATE = '#98aed3';
export const PAPER = '#fbfaf6';

const CELL = 4;
const DOT = 2.6;

/**
 * Ordered-dither fill: a square dot per cell, navy where the Bayer threshold
 * is under `level` and pale slate elsewhere. Tiles in user space so every
 * fill in a sketch sits on one shared screen. `only` keeps a single
 * threshold, for fills that dissolve in one Bayer level at a time.
 */
export const DitherPattern = ({ id, level = 8, only }: { id: string; level?: number; only?: number }) => (
  <pattern id={id} width={CELL * 4} height={CELL * 4} patternUnits="userSpaceOnUse">
    {BAYER.map((threshold, k) =>
      only === undefined || threshold === only ? (
        <rect
          key={k}
          x={(k % 4) * CELL}
          y={Math.floor(k / 4) * CELL}
          width={DOT}
          height={DOT}
          fill={threshold < level ? NAVY : SLATE}
          shapeRendering="crispEdges"
        />
      ) : null,
    )}
  </pattern>
);
