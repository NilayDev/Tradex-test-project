import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StrategyGrid from "@/components/StrategyGrid";
import Features from "@/components/Features";
import SubmitStrategy from "@/components/SubmitStrategy";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <StrategyGrid />
      <Features />
      <SubmitStrategy />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
