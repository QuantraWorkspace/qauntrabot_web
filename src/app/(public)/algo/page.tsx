import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import BlockHead from "@/components/shared/BlockHead";
import AlgoSection from "@/components/home/AlgoSection";
import AlgoSpec from "@/components/pages/AlgoSpec";
import AlgoLimits from "@/components/pages/AlgoLimits";
import AlgoSetup from "@/components/pages/AlgoSetup";
import HomeBotsSection from "@/components/home/HomeBotsSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Algo & EA",
  description:
    "Quantra's algorithmic trading tools and MT5 expert advisors: published rules, risk controls you set, and account-bound licensing.",
  path: "/algo",
});

export default function AlgoPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="A rule set that runs without you"
          lede="Expert advisors for MetaTrader 5 with the logic written down, risk limits you set yourself, and one license bound to one account. Automation removes the hesitation, not the risk."
        />
        <AlgoLimits />
        <AlgoSpec />
        <AlgoSection hideHeader />
        <AlgoSetup />
        <section className="section-cream">
          <div className="container-site pt-16 md:pt-20">
            <BlockHead
              title="The catalogue"
              lede="Each strategy lists its instrument, risk profile and current state. Anything still in testing says so."
            />
          </div>
          <HomeBotsSection hideHeader />
        </section>
        <PageClose
          line="Test it on demo before it sees real money."
          sub="A license covers one MT5 account and includes build updates. Downloads and keys are managed from your dashboard."
          action={{ label: "View pricing", href: "/pricing" }}
          secondary={{ label: "Read the FAQs", href: "/faqs" }}
        />
      </main>
      <Footer />
    </>
  );
}
