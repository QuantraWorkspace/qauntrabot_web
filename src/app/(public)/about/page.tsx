import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import PageClose from "@/components/shared/PageClose";
import AboutStory from "@/components/pages/AboutStory";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Quantra is a trader ecosystem: algorithmic trading, education, market intelligence, free tools and a community, built around process rather than shortcuts.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Navbar authNav={false} />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="It started as one expert advisor"
          lede="Then the questions arrived, and almost none of them were about the EA."
        />
        <AboutStory />
        <PageClose
          line="Start wherever you actually are."
          sub="The market read and the free tools need nothing from you. The tracks and the dashboard need an account."
          action={{ label: "Create free account", href: "/register" }}
          secondary={{ label: "Read today's market note", href: "/markets" }}
        />
      </main>
      <Footer />
    </>
  );
}
