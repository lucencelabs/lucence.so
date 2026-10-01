import { SocialLinks } from "./SocialLinks";

export const Footer = () => {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-[#16305b]/10 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex flex-col gap-4 text-sm font-light text-[#16305b]/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row flex-wrap items-center gap-4">
            <span className="text-[#16305b]/80">© Lucence Labs</span>
            <a
              href="mailto:hello@lucence.so"
              className="underline decoration-[#16305b]/20 underline-offset-4 transition-colors hover:text-[#16305b]"
            >
              hello@lucence.so
            </a>
          </div>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};
