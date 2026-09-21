import PageWrapper from "@/components/layout/PageWrapper";
import CommunitySection from "@/components/home/CommunitySection";
import CommunityChannels from "@/components/home/CommunityChannels";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Community",
  description:
    "Join the Quantra trader community: market discussion, analysis threads, education, free tools and trade reviews.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Community",
        title: "Don't trade",
        accent: "alone.",
        description:
          "A growing community of traders sharing market ideas, analysis, education and tools. Learn faster by learning together.",
        cta: { label: "Join Quantra", href: "/register" },
        secondaryCta: { label: "Explore free tools", href: "/tools" },
      }}
    >
      <CommunitySection hideHeader />
      <CommunityChannels />
      <FinalCTA />
    </PageWrapper>
  );
}
