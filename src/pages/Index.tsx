import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <div className="relative z-10 bg-background">
        <Hero />
        <Work />
        <Services />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
