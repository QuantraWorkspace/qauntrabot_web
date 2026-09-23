import Image from "next/image";
import { BarChart3, BookOpen, Users, Wrench } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * Deliberately untinted. These four had an accent each (mint, blue, red, amber),
 * which spent the live-state colour as decoration and used the loss and warning
 * colours as branding. The icons carry the distinction on their own.
 */
const ITEMS = [
  { icon: BarChart3, title: "Market intelligence", text: "Fundamental and technical context published before the session, so decisions start from a plan." },
  { icon: Wrench, title: "Trading tools", text: "Indicators, calculators and journals that take the friction out of analysis and review." },
  { icon: BookOpen, title: "Education", text: "Six tracks from what moves a market through to running a rule set automatically." },
  { icon: Users, title: "Community", text: "Channels where the reasoning gets questioned before the position is open." },
];

export default function TrustGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-site">
        <div className="relative grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {ITEMS.map(({ icon: Icon, title, text }, i) => (
            <ScrollReveal key={title} variant="up" delay={i * 80} className="h-full">
              <div className="card-surface-hover h-full p-8 md:p-10 flex flex-col items-center text-center gap-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05]">
                  <Icon size={20} className="text-foreground/75" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground tracking-[-0.015em]">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-16 w-16 items-center justify-center rounded-full bg-[#0E1116] border border-white/12 shadow-[0_0_0_10px_#0A0C10,0_0_60px_-10px_rgba(62,207,142,0.7)]">
            <span className="brand-tile !h-9 !w-9 !rounded-full">
              <Image src="/logo/logo.png" alt="Quantra" width={18} height={18} className="object-contain" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
