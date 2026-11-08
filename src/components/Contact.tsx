import { useRef } from 'react';
import CloudfieldBackground from './CloudfieldBackground';

export const Contact = () => {
  const copyRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="contact"
      className="relative flex min-h-[36rem] scroll-mt-24 items-center overflow-hidden px-6 py-28 md:min-h-[46rem] md:py-36"
    >
      <CloudfieldBackground clearingRef={copyRef} fadeTop={0.7} fadeBottom={0.1} />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div ref={copyRef} className="max-w-xl">
          <h2 className="font-serif text-6xl font-normal leading-none tracking-tight text-foreground md:text-8xl">
            Let&apos;s talk
          </h2>
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground">
            Tell us what you&apos;re trying to build and where it&apos;s stuck.
          </p>
          <a
            href="mailto:hello@lucence.so"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#16305b] px-6 py-3 text-sm font-light text-[#fbf6ee] transition-colors duration-300 hover:bg-[#16305b]/85"
          >
            hello@lucence.so <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
