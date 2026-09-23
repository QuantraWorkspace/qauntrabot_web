import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";

export default function BotNotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="That strategy isn't here"
          lede="The link may be out of date, or the strategy was withdrawn. The catalogue below lists everything that currently exists, including what is still in testing."
        >
          <Link href="/bots" className="btn-primary-brand w-fit">
            Browse the catalogue
          </Link>
        </PageHead>
      </main>
      <Footer />
    </>
  );
}
