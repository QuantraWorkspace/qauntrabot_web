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
import PageClose from "@/components/shared/PageClose";

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
        <PageClose
          line="Start with the parts that cost nothing."
          sub="The market read, the indicators and the calculators need no account. The tracks, the dashboard and the algo are there when you want them."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "Read today's market note", href: "/markets" }}
        />
      </main>
      <Footer />
    </>
  );
}
