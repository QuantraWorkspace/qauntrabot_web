import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import PlatformCapabilities from "@/components/pages/PlatformCapabilities";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Features",
  description:
    "What a Quantra subscription includes: account-bound licensing, configurable risk presets, live account data in the dashboard, alerts and any MT5 broker.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="What you actually get"
          lede="The licence, the controls around it and the dashboard that shows what it is doing. The strategy's own rules are on the algo page; this is everything built around them."
        />
        <PlatformCapabilities />
        <PageClose
          line="The rules matter more than the wrapper."
          sub="Read the specification before the feature list — it says what the strategy does, and what it refuses to do."
          action={{ label: "Read the specification", href: "/algo" }}
          secondary={{ label: "View pricing", href: "/pricing" }}
        />
      </main>
      <Footer />
    </>
  );
}
