interface WorkEntry {
  title: string;
  body: string;
  link?: { href: string; label: string };
}

const entries: WorkEntry[] = [
  {
    title: 'After-hours voice agent for physicians',
    body: "Answers a practice's emergency line around the clock and takes real actions in the patient chart, with 12 EMR actions wired to voice.",
    link: { href: 'https://soaper.ai', label: 'soaper.ai' },
  },
  {
    title: 'Voice companion for older adults',
    body: "A realtime voice agent that remembers each person's life story mid-conversation and turns it into something they can share with family. 5,000+ sessions.",
  },
  {
    title: 'Sift, an AI assistant for students',
    body: 'An assistant students text over iMessage, connected to their calendar and Canvas. Used by 100+ students.',
    link: { href: 'https://usesift.app', label: 'usesift.app' },
  },
];

export const Work = () => {
  return (
    <section id="work" className="px-6 pt-4 pb-12 md:pt-8 md:pb-16 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Selected work
          </h2>
        </div>

        <ul className="mt-10 opacity-0 animate-fade-in animation-delay-300">
          {entries.map(({ title, body, link }) => (
            <li
              key={title}
              className="grid gap-2 border-t border-[#16305b]/10 py-7 last:border-b md:grid-cols-[1fr_1.4fr] md:gap-10"
            >
              <h3 className="font-serif text-2xl font-normal leading-snug text-[#16305b]">{title}</h3>
              <div>
                <p className="text-sm font-light leading-relaxed text-[#16305b]/70">{body}</p>
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-normal text-[#16305b]/50 transition-colors duration-300 hover:text-[#16305b]"
                  >
                    {link.label} <span aria-hidden="true">&#8599;</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
