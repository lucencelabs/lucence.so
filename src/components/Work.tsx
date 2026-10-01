interface WorkEntry {
  title: string;
  meta: string;
  body: string;
  tags: string[];
  image: { src: string; alt: string };
  link?: { href: string; label: string };
}

const entries: WorkEntry[] = [
  {
    title: 'Voice companion for older adults',
    meta: 'Founding engineer · Oct 2025 - Mar 2026',
    body: "Built a realtime voice agent older adults talk to, directly on ElevenLabs realtime, with hand-written memory and steering layers: RAG over each user's own memories so the agent knows their life mid-call, dynamic instruction injection to guide long conversations through a narrative arc, and generated shareable life stories for family. Sub-second voice loop across 5,000+ sessions.",
    tags: ['Voice AI', 'RAG', 'ElevenLabs realtime'],
    image: { src: '/work/im.webp', alt: "A printed life-story page titled The Summer of '68, generated from conversations with the voice companion" },
  },
  {
    title: 'Soaper, AI for physician EMR',
    meta: 'Software engineer · Jul - Sep 2025',
    body: 'Built the voice agent layer for an EMR platform: a HIPAA-compliant agent handling emergency calls around the clock and taking real actions in the chart. Wired 12 EMR actions to voice at 95% reliability, and built a secure S3 pre-signed URL flow for physician signatures and media uploads.',
    tags: ['Voice AI', 'Agentic workflows', 'AWS S3', 'HIPAA'],
    image: { src: '/work/soaper.webp', alt: 'A tablet showing an after-hours call chart note with a physician signature' },
    link: { href: 'https://soaper.ai', label: 'soaper.ai' },
  },
  {
    title: 'Sift, an AI assistant for students',
    meta: 'Founder · Jul 2025 - May 2026',
    body: 'An AI assistant students text over iMessage. It can see, plan, and act on their calendar, tasks, and commitments, and connects to Canvas so it knows their assignments and deadlines. Used by 100+ students.',
    tags: ['iMessage', 'AI assistant', 'Canvas'],
    image: { src: '/work/sift.webp', alt: "An iPhone showing a Sift iMessage thread laying out a student's week" },
    link: { href: 'https://usesift.app', label: 'usesift.app' },
  },
];

const WorkCard = ({ title, meta, body, tags, link, image }: WorkEntry) => {
  return (
    <article className="rounded-2xl border border-[#16305b]/10 bg-white/60 p-7 sm:p-9 md:flex md:items-center md:gap-9">
      <div className="mx-auto mb-6 w-full max-w-xs shrink-0 rounded-[1.25rem] bg-[#fbfaf6] md:mx-0 md:mb-0 md:w-60">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          width={640}
          height={640}
          className="aspect-square w-full rounded-[1.25rem] object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-xs font-normal tracking-wide text-[#16305b]/50">{meta}</p>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-normal text-[#16305b]/50 transition-colors duration-300 hover:text-[#16305b]"
          >
            {link.label} <span aria-hidden="true">&#8599;</span>
          </a>
        )}
      </div>

      <h3 className="mt-3 font-serif text-2xl font-normal leading-snug text-[#16305b] sm:text-3xl">
        {title}
      </h3>

      <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[#16305b]/70">{body}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-[#16305b]/10 px-3 py-1 text-xs font-normal text-[#16305b]/60"
          >
            {tag}
          </li>
        ))}
      </ul>
      </div>
    </article>
  );
};

export const Work = () => {
  return (
    <section id="work" className="px-6 pt-4 pb-12 md:pt-8 md:pb-16 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Work
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-5 opacity-0 animate-fade-in animation-delay-300">
          {entries.map((entry) => (
            <WorkCard key={entry.title} {...entry} />
          ))}
        </div>
      </div>
    </section>
  );
};
