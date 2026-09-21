import PageWrapper from "@/components/layout/PageWrapper";
import ToolsSection from "@/components/home/ToolsSection";
import EducationSection from "@/components/home/EducationSection";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tools",
  description:
    "Free trading tools from Quantra: TradingView indicators, market dashboard, economic calendar, trading journal, risk calculator and checklists.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Trading tools",
        title: "Free tools.",
        accent: "Better decisions.",
        description:
          "Indicators, calculators, dashboards and templates built to remove friction from analysis, execution and review.",
        cta: { label: "Join Quantra", href: "/register" },
        secondaryCta: { label: "Explore education", href: "/education" },
      }}
    >
      <ToolsSection hideHeader />
      <EducationSection />
      <FinalCTA />
    </PageWrapper>
  );
}
