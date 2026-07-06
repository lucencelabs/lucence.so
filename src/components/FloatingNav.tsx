import { useEffect, useRef, useState } from 'react';
import { Menu, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Click outside collapses the card
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  // Esc collapses the card
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleLinkClick = () => setOpen(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <div
        ref={rootRef}
        className={cn(
          'pointer-events-auto overflow-hidden border border-foreground/10 bg-background/70 shadow-[0_8px_30px_rgba(20,25,40,0.08)] backdrop-blur-xl transition-all duration-500 ease-spring',
          open ? 'w-[340px] rounded-[22px] sm:w-[380px]' : 'w-[320px] rounded-[18px] sm:w-[350px]',
        )}
      >
        {/* Always-visible header row */}
        <div className="flex h-14 shrink-0 items-center justify-between px-5">
          <a
            href="#top"
            onClick={handleLinkClick}
            className="font-serif text-lg font-light tracking-tight text-foreground"
          >
            Lucence
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="floating-nav-panel"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors duration-300 hover:text-foreground"
          >
            {open ? <Minus className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Expandable content — CSS grid trick gives a smooth auto-height transition */}
        <div
          id="floating-nav-panel"
          className={cn(
            'grid transition-[grid-template-rows] duration-500 ease-spring',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col gap-1 px-5 pb-5 pt-1">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleLinkClick}
                  style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
                  className={cn(
                    'py-2 text-lg font-medium tracking-tight text-foreground transition-all duration-300 ease-out hover:text-primary',
                    open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div
              style={{ transitionDelay: open ? `${80 + NAV_LINKS.length * 60}ms` : '0ms' }}
              className={cn(
                'px-5 pb-6 transition-all duration-300 ease-out',
                open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
              )}
            >
              <div className="mb-4 h-px w-full bg-foreground/10" />
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Contact
              </p>
              <a
                href="mailto:hello@lucence.so"
                onClick={handleLinkClick}
                className="block text-sm font-light text-foreground/80 transition-colors duration-300 hover:text-foreground"
              >
                hello@lucence.so
              </a>
              <a
                href="https://x.com/lucencelabs"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="block text-sm font-light text-foreground/80 transition-colors duration-300 hover:text-foreground"
              >
                @lucencelabs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
