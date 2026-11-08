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
        <path d="M4 38 l17 -15 l17 15" />
        <path d="M8 35 v22 h26 v-22" />
        <path d="M17 57 v-11 h8 v11" fill={fill} />
        <g transform="translate(33 3) scale(1.05)" strokeWidth="2.1">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill={fill} />
          <path d="M15.05 5A5 5 0 0 1 19 8.95 M15.05 1A9 9 0 0 1 23 8.94" />
        </g>
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
