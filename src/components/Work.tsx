import LucenceBackground from './LucenceBackground';

interface WorkCardProps {
  name: string;
  tagline: string;
  description: string;
  focal: [number, number];
}

const WorkCard = ({ name, tagline, description, focal }: WorkCardProps) => {
  return (
    <div className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl border border-[#c9d6ec]/50 bg-[#eef2f8] p-8 opacity-0 animate-fade-in animation-delay-300 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#16305b]/10">
      <div className="pointer-events-none absolute inset-0">
        <LucenceBackground cellSize={3} focal={focal} />
      </div>

      <div className="relative z-10">
        <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">
          {tagline}
        </span>
        <h3 className="mt-3 font-serif text-4xl italic font-light text-foreground">
          {name}
        </h3>
        <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-foreground/70">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <span className="inline-flex items-center rounded-full bg-foreground/5 px-4 py-2 text-xs font-light text-foreground/50">
          Coming soon
        </span>
      </div>
    </div>
  );
};

export const Work = () => {
  return (
    <section id="work" className="px-6 py-section-sm md:py-section scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="space-y-6 opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            For work
          </h2>

          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
            <WorkCard
              name="fly"
              tagline="Meeting notes, reimagined"
              description="A live meeting copilot that listens, structures, and turns conversation into notes and follow-ups automatically."
              focal={[0.85, 0.15]}
            />
            <WorkCard
              name="spot"
              tagline="Your gym accountability coach"
              description="An AI coach that texts you like a real trainer — tracking food and workouts, keeping you honest over iMessage."
              focal={[0.85, 0.15]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
