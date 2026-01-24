import { Link } from "react-router-dom";

interface ProductItemProps {
  name: string;
  description: string;
  href?: string;
  comingSoon?: boolean;
}

const ProductItem = ({ name, description, href, comingSoon }: ProductItemProps) => {
  const content = (
    <div className="group py-4 opacity-0 animate-fade-in animation-delay-300">
      <div className="flex items-baseline gap-3">
        <span className={`font-serif text-xl font-light transition-colors duration-300 ${
          comingSoon ? 'text-foreground/40' : 'text-foreground group-hover:text-primary'
        }`}>
          {name}
        </span>
        <span className="text-sm text-muted-foreground font-light">
          — {description}
        </span>
      </div>
    </div>
  );

  if (comingSoon || !href) {
    return content;
  }

  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
};

export const Products = () => {
  return (
    <section className="px-6 py-section-sm md:py-section">
      {/* Subtle divider */}
      <div className="mx-auto max-w-3xl">
        <div className="divider-faint mb-16 md:mb-24" />
      </div>

      <div className="mx-auto max-w-3xl">
        <ProductItem 
          name="Sift" 
          description="Academic planning, rethought"
          href="/sift"
        />
        <ProductItem 
          name="Memory" 
          description="Private memory systems"
          comingSoon
        />
      </div>
    </section>
  );
};
