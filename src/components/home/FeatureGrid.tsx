import Link from "next/link";
import { BookOpen, Bot, FlaskConical, LineChart, Users, Wrench } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const FEATURES = [
  {
    n: "01",
    label: "Education",
    icon: BookOpen,
    href: "/education",
    text: "Learn trading concepts, frameworks and strategies with practical lessons.",
  },
  {
    n: "02",
    label: "Market analysis",
    icon: LineChart,
    href: "/markets",
    text: "Understand what is moving Gold, Nasdaq, Forex and crypto before looking for entries.",
  },
  {
    n: "03",
    label: "Backtesting",
    icon: FlaskConical,
    href: "/algo",
    text: "Test rule-based strategies on years of tick data before a single live trade.",
  },
  {
    n: "04",
    label: "Free tools",
    icon: Wrench,
    href: "/tools",
    text: "TradingView indicators, calculators, dashboards, journals and other useful tools.",
  },
  {
    n: "05",
    label: "Algo & EA",
    icon: Bot,
    href: "/algo",
    text: "Explore algorithmic trading systems, expert advisors and automation.",
  },
  {
    n: "06",
    label: "Community",
    icon: Users,
    href: "/community",
    text: "Connect with traders, share ideas, discuss markets and learn together.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="section-cream">
      <div className="container-site py-20 md:py-28">
        <ScrollReveal variant="up" className="max-w-3xl mb-12 md:mb-16">
          <span className="eyebrow">Core features</span>
          <h2 className="section-title mt-5">Built around the way traders actually work.</h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map(({ n, label, icon: Icon, href, text }, i) => (
            <ScrollReveal key={n} variant="up" delay={(i % 3) * 80} className="h-full">
              <Link
                href={href}
                className="card-surface-hover group h-full p-7 flex flex-col gap-8 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="icon-tile !w-10 !h-10">
                    <Icon size={18} className="text-foreground" strokeWidth={1.75} />
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  <h3 className="text-[0.6875rem] font-semibold text-muted-foreground">
                    {label}
                  </h3>
                  <p className="text-lg font-semibold text-foreground leading-snug tracking-[-0.015em]">
                    {text}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  Explore
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
