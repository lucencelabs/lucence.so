import { Link } from "react-router-dom";

export const Sift = () => {
  return (
    <section id="work" className="px-6 py-section-sm md:py-section scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="space-y-6 opacity-0 animate-fade-in animation-delay-200">
          <div>
            <span className="text-sm text-muted-foreground font-light tracking-wide uppercase">
              Product
            </span>
          </div>
          
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4">
              Sift
            </h2>
            <p className="text-base leading-relaxed text-foreground/75 font-light max-w-2xl">
              Sift is an AI assistant that lives inside your productivity system and can see, plan, and act on your calendar, tasks, and commitments.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="https://usesift.so"
              className="inline-flex items-center justify-center text-sm font-light text-foreground border border-foreground/20 px-6 py-2.5 transition-colors duration-300 hover:border-foreground/40 hover:bg-foreground/5"
            >
              Try Sift
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

