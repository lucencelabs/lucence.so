import LucenceBackground from './LucenceBackground';

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-background"
    >
      <LucenceBackground />

      {/* Nav */}
      <div className="relative z-10 border-b border-foreground/[0.06] opacity-0 animate-fade-in">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
          <a href="#top" className="font-serif text-lg font-light tracking-tight text-foreground">
            Lucence
          </a>
          <nav className="flex items-center gap-6 md:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-light tracking-wide text-foreground/70 transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl opacity-0 animate-fade-in animation-delay-200">
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              We build software
              <br />
              that brings clarity.
            </h1>

            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground">
              Contract engineering and AI-native products,
              <br />
              built end-to-end by people who ship.
            </p>

            <div className="mt-9">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-light text-background transition-colors duration-300 hover:bg-foreground/85"
              >
                Let&apos;s build together
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
