import type { ComponentType } from 'react';
import { BuildSketch } from './sketches/BuildSketch';
import { PipelineSketch } from './sketches/PipelineSketch';
import { VoiceSketch } from './sketches/VoiceSketch';

interface ServiceEntry {
  title: string;
  body: string;
  color: string;
  Sketch: ComponentType;
}

const services: ServiceEntry[] = [
  {
    title: 'Voice agents',
    body: 'Realtime voice agents that hold a real conversation, remember context, and take actions in the systems a business already runs.',
    color: '#16305b',
    Sketch: VoiceSketch,
  },
  {
    title: 'AI pipelines at scale',
    body: 'Ingestion, fine-tuning, and evaluation pipelines built to hold up at millions of records.',
    color: '#16305b',
    Sketch: PipelineSketch,
  },
  {
    title: '0 to 1 product builds',
    body: 'From a rough idea to something real users touch, scoped to ship in weeks.',
    color: '#16305b',
    Sketch: BuildSketch,
  },
];

const ServiceCard = ({ title, body, color, Sketch }: ServiceEntry) => (
  <article className="flex h-full flex-col rounded-[1.75rem] p-2.5 sm:p-3" style={{ backgroundColor: color }}>
    <div className="aspect-[400/260] overflow-hidden rounded-[1.25rem] bg-[#fbfaf6]">
      <Sketch />
    </div>
    <div className="px-3 pb-4 pt-5 sm:px-4">
      <h3 className="font-serif text-2xl font-normal leading-tight text-[#fbf6ee]">{title}</h3>
      <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-[#fbf6ee]/75">{body}</p>
    </div>
  </article>
);

export const Services = () => {
  return (
    <section id="services" className="px-6 pb-20 pt-4 md:pb-28 md:pt-8 scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-12 md:mb-16" />

        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Services
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 opacity-0 animate-fade-in animation-delay-300 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm font-light text-[#16305b]/50 opacity-0 animate-fade-in animation-delay-400">
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
