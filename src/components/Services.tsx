import type { ComponentType } from 'react';
import { BuildSketch } from './sketches/BuildSketch';
import { PipelineSketch } from './sketches/PipelineSketch';
import { VoiceSketch } from './sketches/VoiceSketch';

interface ServiceEntry {
  title: string;
  body: string;
  Sketch: ComponentType;
}

const services: ServiceEntry[] = [
  {
    title: 'Voice agents',
    body: 'Realtime voice agents that hold a real conversation, remember context, and take actions in the systems a business already runs.',
    Sketch: VoiceSketch,
  },
  {
    title: 'AI pipelines at scale',
    body: 'Ingestion, fine-tuning, and evaluation pipelines built to hold up at millions of records.',
    Sketch: PipelineSketch,
  },
  {
    title: '0 to 1 product builds',
    body: 'From a rough idea to something real users touch, scoped to ship in weeks.',
    Sketch: BuildSketch,
  },
];

const ServiceCard = ({ title, body, Sketch }: ServiceEntry) => (
  <li className="flex flex-col border-t border-[#16305b]/10 py-8 first:border-t-0 md:border-t-0 md:px-6 md:py-6">
    <div className="dot-field aspect-[400/260]">
      <Sketch />
    </div>
    <h3 className="mt-6 font-serif text-2xl font-normal leading-tight text-[#16305b]">{title}</h3>
    <p className="mt-3 text-[0.95rem] font-light leading-relaxed text-[#16305b]/70">{body}</p>
  </li>
);

export const Services = () => {
  return (
    <section id="services" className="px-6 pt-16 pb-4 md:pt-24 md:pb-8 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div className="opacity-0 animate-fade-in animation-delay-200">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Services
          </h2>
        </div>

        <div className="mt-10 border-y border-[#16305b]/10 opacity-0 animate-fade-in animation-delay-300">
          <ul className="grid grid-cols-1 md:-mx-6 md:grid-cols-3 md:divide-x md:divide-[#16305b]/10">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};
