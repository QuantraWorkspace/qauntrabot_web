import PageWrapper from "@/components/layout/PageWrapper";
import SignalsShowcase from "@/components/home/SignalsShowcase";
import MarketIntelligence from "@/components/home/MarketIntelligence";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Signals",
  description:
    "Structured trade ideas with clear context, levels and risk. Educational signals reviewed in the open by the Quantra community.",
  path: "/signals",
});

export default function SignalsPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Signals",
        title: "Trade ideas with",
        accent: "context, levels and risk.",
        description:
          "Every signal explains the why, defines invalidation up front and is reviewed after the close. Ideas, not instructions.",
        cta: { label: "Join Quantra", href: "/register" },
        secondaryCta: { label: "View market analysis", href: "/markets" },
      }}
    >
      <SignalsShowcase />
      <MarketIntelligence />
      <FinalCTA />
    </PageWrapper>
  );
}
