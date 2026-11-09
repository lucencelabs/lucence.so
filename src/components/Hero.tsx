import { CtaButton } from './CtaButton';
import { useRef } from 'react';
import CloudfieldBackground from './CloudfieldBackground';
import { FloatingNav } from './FloatingNav';

export const Hero = () => {
  const copyRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-background"
    >
      <CloudfieldBackground clearingRef={copyRef} fadeBottom={0.14} />

      <FloatingNav />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div ref={copyRef} className="max-w-2xl opacity-0 animate-fade-in animation-delay-200">
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Custom AI software,
              <br />
              built end to end.
            </h1>

            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground">
              Voice agents, AI pipelines, and new products,
              <br />
              from first call to launch.
            </p>

            <div className="mt-9">
              <CtaButton href="#contact" tone="ink">Let&apos;s build together</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
