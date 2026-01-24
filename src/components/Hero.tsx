import LucenceBackground from './LucenceBackground';

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 overflow-hidden">
      <LucenceBackground />
      {/* Content offset slightly upward for visual balance */}
      <div className="mb-24 text-center opacity-0 animate-fade-in relative z-10">
        <h1 className="font-serif text-wordmark-sm md:text-wordmark font-light tracking-tight text-white">
          Lucence
        </h1>
        <p className="mt-6 text-base text-white/70 font-light tracking-wide opacity-0 animate-fade-in animation-delay-300">
          Intelligence, distilled.
        </p>
      </div>
    </section>
  );
};
