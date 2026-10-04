import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import PricingSection from "@/components/sections/PricingSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pricing",
  description:
    "One Zentra membership covering market news, desk analysis, the economic calendar and every course, billed monthly, six-monthly or yearly.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="One plan, everything included"
          lede="The billing period is the only choice. There are no per-course tiers and no upsell once you are in — a longer period is cheaper per month, and that is the whole difference."
        />
        <PricingSection hideHeader />
        <PageClose
          line="See how we teach before you pay."
          sub="The market read, the tools and the full curriculum outline are public, so you can judge the approach before any money is involved."
          action={{ label: "See the curriculum", href: "/education" }}
          secondary={{ label: "Read the FAQs", href: "/faqs" }}
        />
      </main>
      <Footer />
    </>
  );
}
