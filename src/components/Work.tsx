interface WorkEntry {
  title: string;
  body: string;
  link?: { href: string; label: string };
}

const entries: WorkEntry[] = [
  {
    title: 'After-hours line for a physician practice',
    body: "An AI agent that answers the practice's phone after hours and updates the patient's chart from the call.",
    link: { href: 'https://soaper.ai', label: 'soaper.ai' },
  },
  {
    title: 'Phone orders for a retailer',
    body: 'An AI agent that takes orders and quote requests over the phone, and sets up a callback when someone needs to talk to a person.',
  },
  {
    title: 'Follow-up calls for a home-services company',
    body: "AI agents that call customers who got a quote but didn't book, and past customers about the company's maintenance plan.",
  },
  {
    title: 'Voice companion for older adults',
    body: 'A voice agent older adults talk to about their lives, which turns their stories into something they can share with family. Used in over 5,000 conversations.',
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
