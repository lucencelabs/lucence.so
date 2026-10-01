import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <div className="relative z-10 bg-background">
        <Hero />
        <Services />
        <Work />
        <Contact />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
