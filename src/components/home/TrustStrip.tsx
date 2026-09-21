import { BarChart3, BookOpen, Users, Wrench } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const ITEMS = [
  { n: "01", icon: BarChart3, title: "Market Intelligence", text: "Fundamental + technical analysis" },
  { n: "02", icon: Wrench, title: "Trading Tools", text: "Indicators, calculators & resources" },
  { n: "03", icon: BookOpen, title: "Education", text: "Learn systems, not random setups" },
  { n: "04", icon: Users, title: "Community", text: "Learn and grow with other traders" },
];

export default function TrustStrip() {
  return (
    <section className="section-cream pb-16 md:pb-24 pt-6 lg:pt-0">
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map(({ n, icon: Icon, title, text }, i) => (
            <ScrollReveal key={n} variant="up" delay={i * 70} className="h-full">
              <div className="card-surface-hover h-full p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="card-number">{n}</span>
                  <Icon size={18} className="text-foreground" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-[-0.01em]">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
