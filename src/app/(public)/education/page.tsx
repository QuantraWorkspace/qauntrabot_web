import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import EducationLadder from "@/components/pages/EducationLadder";
import EducationLimits from "@/components/pages/EducationLimits";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Education",
  description:
    "Structured trading education: fundamentals, technical analysis, liquidity and order flow, risk management, psychology and algorithmic trading.",
  path: "/education",
});

export default function EducationPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="Learn the framework, not the shortcut"
          lede="Six tracks that build on each other, from what moves a market down to running a rule set automatically. Each one ends with something you can do, not something you have watched."
        />
        <EducationLadder />
        <EducationLimits />
        <PageClose
          line="Start at the track that matches what you already know."
          sub="An account keeps your place across tracks and unlocks the worksheets and checklists that go with them."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "See the free tools", href: "/tools" }}
        />
      </main>
      <Footer />
    </>
  );
}
