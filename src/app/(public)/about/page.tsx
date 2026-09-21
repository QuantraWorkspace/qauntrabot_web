import PageWrapper from "@/components/layout/PageWrapper";
import EcosystemSection from "@/components/home/EcosystemSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Quantra is a community-driven trading ecosystem: education, market intelligence, signals, free tools, automation and a community of traders in one place.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "About Quantra",
        title: "Everything traders need",
        accent: "to learn, analyze and improve.",
        description:
          "Quantra started as an expert advisor and grew into a full ecosystem for traders who want a process, not a shortcut.",
        cta: { label: "Join Quantra", href: "/register" },
        secondaryCta: { label: "Join the community", href: "/community" },
      }}
    >
      <EcosystemSection />
      <FeatureGrid />
      <FinalCTA />
    </PageWrapper>
  );
}
