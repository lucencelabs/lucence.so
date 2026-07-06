import LucenceBackground from './LucenceBackground';

interface ServiceCardProps {
  title: string;
  body: string;
  focal: [number, number];
}

/**
 * Each card gets its own small dither swatch tucked into one corner —
 * reuses the exact same Bayer-matrix shader as the Hero and Work cards,
 * just constrained to a small masked container so it reads as a corner
 * accent instead of a full background wash.
 */
const ServiceCard = ({ title, body, focal }: ServiceCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-[#c9d6ec]/50 bg-[#eef2f8] p-6 opacity-0 animate-fade-in animation-delay-300 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#16305b]/10">
      <div
        className="pointer-events-none absolute right-0 top-0 h-24 w-24"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black, transparent 70%)',
          maskImage: 'radial-gradient(circle at 100% 0%, black, transparent 70%)',
        }}
      >
        <LucenceBackground cellSize={3} focal={focal} />
      </div>

      <div className="relative z-10">
        <h3 className="font-serif text-xl font-light text-foreground">{title}</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-foreground/70">{body}</p>
      </div>
    </div>
  );
};

/**
 * Wider banner card below the three service cards — a denser, more
 * saturated navy-to-pale-blue dither fills the whole card (same shader
 * and params as the Footer's "super blue" treatment), with light text
 * on top so it stands out from the flat white cards above it.
 */
const SoloBanner = () => {
  return (
    <div className="relative mt-5 overflow-hidden rounded-[20px] bg-[#0f2547] px-6 py-8 opacity-0 animate-fade-in animation-delay-400 sm:px-10 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <LucenceBackground
          cellSize={3}
          focal={[0.5, 0.65]}
          denseColor={[0.04, 0.1, 0.21]}
          sparseColor={[0.235, 0.4, 0.68]}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="max-w-md text-base font-light leading-relaxed text-white/90">
            Just me. No handoffs, no account managers. Usually shippable in weeks, not quarters.
          </p>
          <p className="mt-3 text-sm font-light text-[#c9d6ec]">
            Currently building on Apple&apos;s Screen Time team. CS @ CU Boulder.
          </p>
        </div>

        <a
          href="#contact"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-[18px] bg-background px-6 py-3 text-sm font-light text-foreground transition-colors duration-300 hover:bg-background/90"
        >
          Let&apos;s talk
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export const Services = () => {
  return (
    <section id="services" className="px-6 py-section-sm md:py-section scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            What I build
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <ServiceCard
            title="Product builds, 0→1"
            body="Idea to shipped product, not just code review."
            focal={[0.82, 0.78]}
          />
          <ServiceCard
            title="AI-native & agent systems"
            body="LLM integration and agent architecture done right."
            focal={[0.8, 0.8]}
          />
          <ServiceCard
            title="Native app work"
            body="SwiftUI and iOS, production-grade."
            focal={[0.85, 0.75]}
          />
        </div>

        <SoloBanner />
      </div>
    </section>
  );
};
