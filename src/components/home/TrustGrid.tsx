import Image from "next/image";
import { BarChart3, BookOpen, Users, Wrench } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const ITEMS = [
  { icon: BarChart3, tint: "#3ECF8E", title: "Market Intelligence", text: "Fundamental and technical context published before the session, so decisions start from a plan." },
  { icon: Wrench, tint: "#6EA8FF", title: "Trading Tools", text: "Indicators, calculators, dashboards and journals that take friction out of analysis and review." },
  { icon: BookOpen, tint: "#FF7A80", title: "Education", text: "Structured tracks from fundamentals to algorithmic trading. Learn systems, not random setups." },
  { icon: Users, tint: "#F5B942", title: "Community", text: "Share ideas, review trades and grow with traders who take the process seriously." },
];

export default function TrustGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-site">
        <div className="relative grid sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {ITEMS.map(({ icon: Icon, tint, title, text }, i) => (
            <ScrollReveal key={title} variant="up" delay={i * 80} className="h-full">
              <div className="card-surface-hover h-full p-8 md:p-10 flex flex-col items-center text-center gap-5">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${tint}22`, border: `1px solid ${tint}55`, boxShadow: `0 0 24px -8px ${tint}` }}
                >
                  <Icon size={20} style={{ color: tint }} strokeWidth={1.8} />
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
