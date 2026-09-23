import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import SessionClock from "@/components/home/SessionClock";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import MarketMethod from "@/components/pages/MarketMethod";
import MarketLimits from "@/components/pages/MarketLimits";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Markets",
  description:
    "Daily fundamental and technical context for Gold, Nasdaq, USD and BTC. Bias, key events and session notes from the Quantra market desk.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="What's moving, and why"
          lede="A written read on Gold, Nasdaq, the dollar and Bitcoin, published before London opens. Context first, so the entry comes from a plan instead of a reaction."
          aside={
            <div className="rounded-2xl border border-border bg-white/[0.025] p-5 sm:p-6">
              <SessionClock />
            </div>
          }
        />
        <MarketIntelligence hideHeader />
        <MarketMethod />
        <MarketLimits />
        <PageClose
          line="The note goes out before London opens."
          sub="Create a free account to read it each morning, along with the levels the desk is watching."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "See the free tools", href: "/tools" }}
        />
      </main>
      <Footer />
    </>
  );
}
