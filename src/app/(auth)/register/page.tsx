import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import RegistrationSection from "@/components/sections/RegistrationSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create account",
  description:
    "Create a free Quantra account for the market dashboard, the education tracks and your trading journal. A licence is only needed to run an expert advisor.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title="Create your account"
          lede="A free account gets you the market dashboard, your place in the education tracks and a journal that persists between sessions. Licences and EA downloads live in the same dashboard once you buy one."
        />
        <RegistrationSection hideHeader />
      </main>
      <Footer />
    </>
  );
}
