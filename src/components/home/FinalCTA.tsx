import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="planet-arc" aria-hidden />
      <div className="container-site relative">
        <ScrollReveal variant="up" className="flex flex-col items-center text-center gap-7 max-w-3xl mx-auto pt-16">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0E1116] border border-white/12 shadow-[0_0_60px_-10px_rgba(62,207,142,0.7)]">
            <span className="brand-tile !h-9 !w-9 !rounded-full">
              <Image src="/logo/logo.png" alt="Quantra" width={18} height={18} className="object-contain" />
            </span>
          </span>
          <h2 className="section-title">
            Build your trading edge with Quantra.
          </h2>
          <p className="lead-text">Learn. Analyze. Trade. Improve.</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/register" className="btn-primary-brand group justify-center">
              Join Quantra
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/tools" className="btn-outline-brand justify-center">
              Explore Free Tools
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
