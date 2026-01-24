export const SocialLinks = () => {
  return (
    <div className="flex gap-5 items-center justify-center md:justify-end">
      {/* X (Twitter) */}
      <a
        href="https://x.com/lucencelabs"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lucence Labs on X"
        className="w-4 h-4 flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href="https://linkedin.com/company/lucencelabs"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lucence Labs LinkedIn"
        className="w-6 h-6 flex items-center justify-center"
      >
        <img
          src="/assets/linkedin.png"
          alt="LinkedIn"
          className="w-6 h-6 max-w-6 max-h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/lucencelabs"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lucence Labs GitHub"
        className="w-4 h-4 flex items-center justify-center"
      >
        <img
          src="/assets/github.png"
          alt="GitHub"
          className="w-4 h-4 max-w-4 max-h-4 object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>
    </div>
  );
};


