import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import ChannelDirectory from "@/components/pages/ChannelDirectory";
import HouseRules from "@/components/pages/HouseRules";
import CommunitySection from "@/components/home/CommunitySection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Community",
  description:
    "Join the Quantra trader community: market discussion, analysis threads, education, free tools and trade reviews.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="Somewhere to be wrong out loud"
          lede="Most of what improves a trader comes from having the reasoning questioned before the position is open. These channels exist for that, which is why signal calls without an argument get removed."
        />
        <ChannelDirectory />
        <HouseRules />
        <div className="section-cream">
          <div className="container-site pt-16 md:pt-24">
            <h2 className="block-title">A sample of the week</h2>
            <p className="block-lede">
              Three posts from the channels, reproduced as they were written.
            </p>
          </div>
          <CommunitySection hideHeader />
        </div>
        <PageClose
          line="The rooms are free to join."
          sub="An account is only needed for the dashboard and the tools that save your work — the channels are open either way."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "See the free tools", href: "/tools" }}
        />
      </main>
      <Footer />
    </>
  );
}
