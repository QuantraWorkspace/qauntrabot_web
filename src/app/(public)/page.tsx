import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import MarketStrip from "@/components/home/MarketStrip";
import TrustGrid from "@/components/home/TrustGrid";
import FeatureBento from "@/components/home/FeatureBento";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import EducationSection from "@/components/home/EducationSection";
import AlgoSection from "@/components/home/AlgoSection";
import CommunitySection from "@/components/home/CommunitySection";
import StatsRow from "@/components/home/StatsRow";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pb-28 lg:pb-0">
        <Hero />
        <MarketStrip />
        <TrustGrid />
        <FeatureBento />
        <MarketIntelligence />
        <EducationSection />
        <AlgoSection />
        <CommunitySection />
        <StatsRow />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
