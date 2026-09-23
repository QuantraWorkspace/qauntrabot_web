import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import ToolInventory from "@/components/pages/ToolInventory";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tools",
  description:
    "Free trading tools from Quantra: TradingView indicators, economic calendar, risk calculator, trading journal, checklists and the market dashboard.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="Tools that take the friction out"
          lede="Indicators, calculators and templates for the parts of the routine that are mechanical. Most work without an account, and none of them decide anything for you."
        >
          <Link href="#risk" className="btn-outline-brand w-fit">
            Jump to the risk calculator
          </Link>
        </PageHead>
        <ToolInventory />
        <PageClose
          line="Take the free ones first."
          sub="The indicators, calendar and calculator need nothing from you. An account adds the market dashboard and saves your journal between sessions."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "Read the education tracks", href: "/education" }}
        />
      </main>
      <Footer />
    </>
  );
}
