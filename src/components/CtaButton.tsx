import type { ReactNode } from 'react';
import { NAVY } from './sketches/InkDefs';

type Variant = 'pill' | 'ink' | 'print' | 'line';

// Preview-only switch: ?cta=ink|print|line picks a mockup, default is the live pill.
const pick = (): Variant => {
  if (typeof window === 'undefined') return 'pill';
  const v = new URLSearchParams(window.location.search).get('cta');
  return v === 'ink' || v === 'print' || v === 'line' ? v : 'pill';
};

// Checker of crisp navy squares on the same 4px grid as the sketch dither.
const DITHER = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' shape-rendering='crispEdges'><rect width='2.6' height='2.6' fill='${NAVY}'/><rect x='4' y='4' width='2.6' height='2.6' fill='${NAVY}'/></svg>`,
)}")`;

const Arrow = () => <span aria-hidden="true">&rarr;</span>;

export const CtaButton = ({ href, children, tone = 'ink' }: { href: string; children: ReactNode; tone?: 'ink' | 'navy' }) => {
  const variant = pick();

  if (variant === 'ink') {
    // Hand-inked outline, same wobble as the sketches; navy dither floods in on hover.
    return (
      <a href={href} className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-normal text-[#16305b]">
        <span
          aria-hidden="true"
          className="absolute inset-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-25"
          style={{ backgroundImage: DITHER }}
        />
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <filter id="cta-ink" x="-10%" y="-30%" width="120%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={5} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect x="1.5" y="1.5" width="100%" height="100%" rx="4" fill="none" stroke={NAVY} strokeWidth="2" filter="url(#cta-ink)" style={{ width: 'calc(100% - 3px)', height: 'calc(100% - 3px)' }} />
        </svg>
        <span className="relative">{children}</span>
        <span className="relative transition-transform duration-300 group-hover:translate-x-1"><Arrow /></span>
      </a>
    );
  }

  if (variant === 'print') {
    // Solid navy block with a dither shadow, like a print offset; presses into it on hover.
    return (
      <a href={href} className="group relative inline-flex">
        <span aria-hidden="true" className="absolute inset-0 translate-x-[5px] translate-y-[5px]" style={{ backgroundImage: DITHER }} />
        <span className="relative inline-flex items-center gap-2 rounded-[3px] bg-[#16305b] px-6 py-3 text-sm font-light text-[#fbf6ee] transition-transform duration-200 group-hover:translate-x-[3px] group-hover:translate-y-[3px]">
          {children} <Arrow />
        </span>
      </a>
    );
  }

  if (variant === 'line') {
    // No box: serif label over an inked underline that fills with dither on hover.
    return (
      <a href={href} className="group relative inline-flex items-baseline gap-2 pb-2 font-serif text-2xl text-[#16305b]">
        {children}
        <span className="text-xl transition-transform duration-300 group-hover:translate-x-1"><Arrow /></span>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-[#16305b] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundImage: DITHER }} />
      </a>
    );
  }

  const fill = tone === 'navy' ? 'bg-[#16305b] text-[#fbf6ee] hover:bg-[#16305b]/85' : 'bg-foreground text-background hover:bg-foreground/85';
  return (
    <a href={href} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-light transition-colors duration-300 ${fill}`}>
      {children} <Arrow />
    </a>
  );
};
