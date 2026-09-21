import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Calculator,
  CandlestickChart,
  LayoutDashboard,
  ListChecks,
  NotebookPen,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export const TOOLS = [
  {
    id: "indicators",
    icon: CandlestickChart,
    title: "TradingView Indicators",
    text: "Free scripts for structure, sessions and liquidity, built for clarity on the chart.",
    tag: "Free",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Market Dashboard",
    text: "Bias, session and key events for Gold, Nasdaq, USD and BTC in one view.",
    tag: "Daily",
  },
  {
    id: "calendar",
    icon: CalendarDays,
    title: "Economic Calendar",
    text: "High-impact releases with the context of why they matter for your markets.",
    tag: "Live",
  },
  {
    id: "journal",
    icon: NotebookPen,
    title: "Trading Journal",
    text: "Log setups, execution and review notes to find what actually works for you.",
    tag: "Template",
  },
  {
    id: "risk",
    icon: Calculator,
    title: "Risk Calculator",
    text: "Position size from account, stop distance and risk per trade in seconds.",
    tag: "Free",
  },
  {
    id: "checklists",
    icon: ListChecks,
    title: "Trading Checklists",
    text: "Pre-trade and post-trade checklists that keep discipline in the loop.",
    tag: "Template",
  },
];

type ToolsSectionProps = { hideHeader?: boolean };

export default function ToolsSection({ hideHeader = false }: ToolsSectionProps) {
  return (
    <section id="tools" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        {!hideHeader && (
          <ScrollReveal variant="up" className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="eyebrow">Trading tools</span>
              <h2 className="section-title mt-5">Free tools. Better decisions.</h2>
            </div>
            <Link href="/tools" className="btn-outline-brand shrink-0 self-start md:self-auto group">
              Explore Tools
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </ScrollReveal>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {TOOLS.map(({ id, icon: Icon, title, text, tag }, i) => (
            <ScrollReveal key={id} variant="up" delay={(i % 3) * 80} className="h-full">
              <article id={id} className="card-surface-hover group h-full p-7 flex flex-col gap-6 scroll-mt-28">
                <div className="flex items-center justify-between">
                  <span className="icon-tile !w-11 !h-11">
                    <Icon size={20} className="text-foreground" strokeWidth={1.6} />
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {tag}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-foreground tracking-[-0.015em]">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
