import PageWrapper from "@/components/layout/PageWrapper";
import EducationSection from "@/components/home/EducationSection";
import CommunitySection from "@/components/home/CommunitySection";
import FinalCTA from "@/components/home/FinalCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Education",
  description:
    "Structured trading education: fundamentals, technical analysis, ICT concepts, risk management, psychology and algorithmic trading.",
  path: "/education",
});

export default function EducationPage() {
  return (
    <PageWrapper
      authNav={false}
      hero={{
        eyebrow: "Education",
        title: "Learn the framework.",
        accent: "Build your process.",
        description:
          "Six tracks that take you from concept to execution, focused on a repeatable process rather than one-off setups.",
        cta: { label: "Start Learning", href: "/register" },
        secondaryCta: { label: "Browse free tools", href: "/tools" },
      }}
    >
      <EducationSection hideHeader />
      <CommunitySection />
      <FinalCTA />
    </PageWrapper>
  );
}
