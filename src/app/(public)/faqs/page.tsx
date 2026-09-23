import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import FaqGroups from "@/components/pages/FaqGroups";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQs",
  description:
    "Answers on brokers, licensing, running an expert advisor, and what Quantra will and will not claim about performance.",
  path: "/faqs",
});

export default function FAQsPage() {
  return (
    <>
      <FaqPageJsonLd />
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="The questions that come up first"
          lede="Grouped by where you are: starting out, buying a licence, running it day to day, or trying to work out what it will and won't do to an account."
        />
        <FaqGroups />
        <PageClose
          line="Still stuck on something?"
          sub="Ask in the community channels, where the answer stays visible for whoever hits the same thing next."
          action={{ label: "Go to the channels", href: "/community" }}
          secondary={{ label: "Read the specification", href: "/algo" }}
        />
      </main>
      <Footer />
    </>
  );
}
