interface ServiceEntry {
  title: string;
  body: string;
}

const services: ServiceEntry[] = [
  {
    title: 'Voice and agent systems',
    body: 'Realtime voice agents, RAG, and agents that take real actions inside the systems a business already runs.',
  },
  {
    title: '0 to 1 product builds',
    body: 'From a rough idea to something real users touch, scoped to ship in weeks.',
  },
  {
    title: 'iOS and SwiftUI',
    body: "Native apps built on Apple's own patterns.",
  },
];

const ServiceCard = ({ title, body }: ServiceEntry) => {
  return (
    <article className="h-full rounded-2xl border border-[#16305b]/10 bg-white/60 p-7 transition-[border-color,box-shadow,transform] duration-300 ease-spring hover:-translate-y-0.5 hover:border-[#16305b]/20 hover:shadow-[0_1px_2px_rgba(22,48,91,0.04),0_8px_24px_-12px_rgba(22,48,91,0.12)]">
      <h3 className="font-serif text-2xl font-normal leading-snug text-[#16305b]">{title}</h3>
      <p className="mt-4 text-sm font-light leading-relaxed text-[#16305b]/70">{body}</p>
    </article>
  );
};

export const Services = () => {
  return (
    <section id="services" className="px-6 py-section-sm md:py-section scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Services
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 opacity-0 animate-fade-in animation-delay-300 sm:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm font-light text-[#16305b]/50 opacity-0 animate-fade-in animation-delay-400">
          <p>CS @ CU Boulder.</p>
          <a
            href="#contact"
            className="text-[#16305b]/70 transition-colors duration-300 hover:text-[#16305b]"
          >
            Let&apos;s talk <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
