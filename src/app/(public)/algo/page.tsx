import PageWrapper from "@/components/layout/PageWrapper";
import AlgoSection from "@/components/home/AlgoSection";
import HomeBotsSection from "@/components/home/HomeBotsSection";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Algo & EA",
  description:
    "Quantra's algorithmic trading tools and MT5 expert advisors: rule-based strategies, configurable risk controls and account-bound licensing.",
  path: "/algo",
});

export default function AlgoPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Algo & EA",
        title: "Automate",
        accent: "your strategy.",
        description:
          "Rule-based expert advisors for MetaTrader 5 with transparent logic and risk controls you set yourself. Test on demo first, then run from your dashboard.",
        cta: { label: "View pricing", href: "/pricing" },
        secondaryCta: { label: "Read the FAQs", href: "/faqs" },
      }}
    >
      <AlgoSection hideHeader />
      <HomeBotsSection />
      <FinalCTA />
    </PageWrapper>
  );
}
