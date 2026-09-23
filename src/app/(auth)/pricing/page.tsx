import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import PricingSection from "@/components/sections/PricingSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "One plan covering every Quantra expert advisor, billed monthly, six-monthly or yearly. One licence per MT5 account, with build updates included.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="One plan, every strategy"
          lede="The billing period is the only choice. There are no per-strategy tiers, no performance fees and no upsell once you are in — a longer period is cheaper per month, and that is the whole difference."
        />
        <PricingSection hideHeader />
        <PageClose
          line="Run it on demo before you pay for it."
          sub="The strategy specification and its limits are published in full, so you can decide whether it suits you before any money is involved."
          action={{ label: "Read the specification", href: "/algo" }}
          secondary={{ label: "Read the FAQs", href: "/faqs" }}
        />
      </main>
      <Footer />
    </>
  );
}
