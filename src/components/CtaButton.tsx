import type { ReactNode } from 'react';

// Square-cornered navy block; the arrow nudges on hover.
export const CtaButton = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-2 rounded-[3px] bg-[#16305b] px-6 py-3 text-sm font-light text-[#fbf6ee] transition-colors duration-300 hover:bg-[#16305b]/90"
  >
    {children}
    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
      &rarr;
    </span>
  </a>
);
