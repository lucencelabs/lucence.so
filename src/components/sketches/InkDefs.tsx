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
export const ACCENT = '#3f7a3a';
