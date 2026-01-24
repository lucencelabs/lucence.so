import { Hero } from "@/components/Hero";
import { Sift } from "@/components/Sift";
import { Philosophy } from "@/components/Philosophy";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Sift />
      <Philosophy />
      <Footer />
    </main>
  );
};

export default Index;
