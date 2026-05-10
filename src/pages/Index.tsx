import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyFeed from "@/components/PropertyFeed";
import ExploreSection from "@/components/ExploreSection";
import TrendingAreas from "@/components/TrendingAreas";
import AgentCTABanner from "@/components/AgentCTABanner";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || undefined;
  const query = searchParams.get("q") || undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      <Header />
      <HeroSection />
      <PropertyFeed searchType={type} searchQuery={query} />
      <TrendingAreas />
      <AgentCTABanner />
      <ExploreSection />
      <Footer />
    </div>
  );
};

export default Index;
