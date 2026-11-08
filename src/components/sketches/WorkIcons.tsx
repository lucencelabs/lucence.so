import type { ReactNode } from 'react';
import { DitherPattern, INK, InkFilter } from './InkDefs';

// Tiny static ink marks for the Work list: same hand-inked stroke and navy dither as the Services sketches.
const Icon = ({ id, label, children }: { id: string; label: string; children: (fill: string) => ReactNode }) => (
  <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" role="img" aria-label={label}>
    <InkFilter id={`ink-${id}`} seed={id.length * 7} />
    <defs>
      <DitherPattern id={`dither-${id}`} level={8} />
    </defs>
    <g filter={`url(#ink-${id})`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {children(`url(#dither-${id})`)}
    </g>
  </svg>
);

// A phone answering at night.
export const NightLineIcon = () => (
  <Icon id="night" label="Phone with a moon">
    {(fill) => (
      <>
        <path d="M44 8 a10 10 0 1 0 10 13 a8 8 0 0 1 -10 -13 z" fill={fill} />
        <rect x="10" y="18" width="24" height="40" rx="5" />
        <path d="M18 23 h8" />
        <path d="M22 34 v10 M17 39 h10" />
      </>
    )}
  </Icon>
);

// A shopping bag, for phone orders.
export const OrdersIcon = () => (
  <Icon id="orders" label="Shopping bag">
    {(fill) => (
      <>
        <path d="M14 22 h36 l-3 34 h-30 z" />
        <path d="M17 44 h30 l-1 10 h-28 z" fill={fill} stroke="none" />
        <path d="M24 26 v-6 a8 8 0 0 1 16 0 v6" />
      </>
    )}
  </Icon>
);

// A house with a call going out to it.
export const FollowUpIcon = () => (
  <Icon id="followup" label="House with an outgoing call">
    {(fill) => (
      <>
        <path d="M8 34 l18 -16 l18 16" />
        <path d="M13 30 v26 h26 v-26" />
        <path d="M21 56 v-12 h10 v12" fill={fill} />
        <path d="M44 16 l12 -8 M49 8 h7 v7" />
        <path d="M47 22 a8 8 0 0 0 0 -8" strokeWidth="1.8" />
      </>
    )}
  </Icon>
);

// A speech bubble with a voice in it.
export const CompanionIcon = () => (
  <Icon id="companion" label="Speech bubble with a voice wave">
    {(fill) => (
      <>
        <path d="M10 14 h44 a4 4 0 0 1 4 4 v24 a4 4 0 0 1 -4 4 h-26 l-10 9 v-9 h-8 a4 4 0 0 1 -4 -4 v-24 a4 4 0 0 1 4 -4 z" />
        <path d="M22 26 v8 M28 22 v16 M34 25 v10 M40 28 v4" strokeWidth="2.4" />
      </>
    )}
  </Icon>
);
