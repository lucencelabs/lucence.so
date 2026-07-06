import { SocialLinks } from "./SocialLinks";

export const Footer = () => {
  return (
    <footer id="contact" className="px-6 pb-12 pt-section-sm md:pt-section scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-8" />
        <div className="flex flex-col gap-4 text-sm text-muted-foreground font-light md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row flex-wrap items-center gap-4">
            <span>© Lucence Labs</span>
            <a href="mailto:hello@lucence.so" className="link-subtle">
              hello@lucence.so
            </a>
          </div>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};
