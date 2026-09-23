import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import BotsSection from "@/components/sections/BotsSection";
import { getCachedBots } from "@/lib/cached-bots";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Trading Bots",
  description:
    "Every Quantra expert advisor, with its instrument, risk profile and current state. Anything still in testing says so.",
  path: "/bots",
});

export default async function BotsPage() {
  const initialBots = await getCachedBots();

  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="The strategies, and what state they are in"
          lede="Each one is a separate expert advisor with its own instrument, timeframe and risk settings. A strategy only moves out of testing once it has run a full month on demo."
        />
        <BotsSection hideHeader initialBots={initialBots} />
        <PageClose
          line="A licence covers one MT5 account."
          sub="Pricing is the same whichever strategy you run, and includes build updates for as long as the licence is active."
          action={{ label: "View pricing", href: "/pricing" }}
          secondary={{ label: "Read the specification", href: "/algo" }}
        />
      </main>
      <Footer />
    </>
  );
}
