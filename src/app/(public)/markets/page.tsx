import PageWrapper from "@/components/layout/PageWrapper";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Markets",
  description:
    "Daily fundamental and technical context for Gold, Nasdaq, USD and BTC. Bias, key events and session notes from the Quantra market desk.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Market intelligence",
        title: "Know what moves",
        accent: "the market.",
        description:
          "Fundamental bias, technical structure and the events that matter, published before the session so you trade with context.",
        cta: { label: "Join Quantra", href: "/register" },
        secondaryCta: { label: "Explore algo", href: "/algo" },
      }}
    >
      <MarketIntelligence hideHeader />
      <FinalCTA />
    </PageWrapper>
  );
}
