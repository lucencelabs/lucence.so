import { SocialLinks } from "./SocialLinks";
import LucenceBackground from "./LucenceBackground";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="sticky bottom-0 z-0 scroll-mt-24 overflow-hidden bg-[#0f2547]"
    >
      <div className="pointer-events-none absolute inset-0">
        <LucenceBackground
          cellSize={4}
          focal={[0.5, 0.65]}
          // Saturated, dense monochrome blue - richer/darker than the hero's
          // airy clearing, so the whole footer reads as "super blue" rather
          // than a light source breaking through.
          denseColor={[0.04, 0.1, 0.21]}
          sparseColor={[0.235, 0.4, 0.68]}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-8">
        <div className="flex flex-col gap-4 text-sm font-light text-[#c9d6ec] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row flex-wrap items-center gap-4">
            <span className="text-white/90">© Lucence Labs</span>
            <a
              href="mailto:hello@lucence.so"
              className="text-[#c9d6ec] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              hello@lucence.so
            </a>
          </div>
          <SocialLinks variant="light" />
        </div>
      </div>
    </footer>
  );
};
