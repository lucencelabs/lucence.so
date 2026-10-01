export const Contact = () => {
  return (
    <section id="contact" className="px-6 pb-24 pt-4 md:pb-32 md:pt-8 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="rounded-[1.75rem] bg-[#16305b] px-8 py-12 sm:px-12 sm:py-14">
          <h2 className="font-serif text-4xl font-normal tracking-tight text-[#fbf6ee] md:text-5xl">
            Let&apos;s talk
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] font-light leading-relaxed text-[#fbf6ee]/75">
            Tell me what you&apos;re trying to build and where it&apos;s stuck.
          </p>
          <a
            href="mailto:hello@lucence.so"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fbf6ee] px-6 py-3 text-sm font-normal text-[#16305b] transition-colors duration-300 hover:bg-white"
          >
            hello@lucence.so <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
