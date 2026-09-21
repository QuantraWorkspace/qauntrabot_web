import { CheckCircle2, Clock3, ShieldAlert, Target } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import MiniChart from "./MiniChart";

const PRINCIPLES = [
  {
    icon: Target,
    title: "Context first",
    text: "Every idea starts with the higher-timeframe bias and the reason the market is there.",
  },
  {
    icon: ShieldAlert,
    title: "Defined risk",
    text: "Entry zone, invalidation and target are set before the trade, never after.",
  },
  {
    icon: Clock3,
    title: "Session aware",
    text: "Ideas are framed around London and New York, when the markets we cover actually move.",
  },
  {
    icon: CheckCircle2,
    title: "Reviewed, not hyped",
    text: "Wins and losses are logged and reviewed in the open so the process keeps improving.",
  },
];

export default function SignalsShowcase() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <ScrollReveal variant="up" className="lg:col-span-5">
            <div className="rounded-3xl glass-strong glow-ring overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-black/20">
                <span className="text-sm font-semibold text-foreground">Signal format</span>
                <span className="text-[0.6875rem] font-medium text-muted-foreground">UI example</span>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold tracking-[-0.01em] text-foreground">XAUUSD · Long idea</p>
                    <p className="text-sm text-muted-foreground mt-1">H4 continuation into London open</p>
                  </div>
                  <span className="bias-pill" data-bias="bullish">
                    Active
                  </span>
                </div>
                <MiniChart id="signal-showcase" points={[40, 43, 42, 46, 45, 49, 47, 51, 50, 54, 53, 57]} className="h-20" />
                <dl className="grid grid-cols-3 gap-2">
                  {[
                    ["Entry", "Demand zone"],
                    ["Invalidation", "Below swing low"],
                    ["Target", "Prior high"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl glass-inset px-3 py-2.5">
                      <dt className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5 text-xs font-semibold text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="rounded-xl glass-inset px-4 py-3">
                  <p className="panel-label mb-1">Why</p>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    Bullish structure on the daily, USD softening into CPI, price returning to a
                    clean H4 demand with liquidity taken below.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk: 0.5% · R:R 1 : 2.5</span>
                  <span>Reviewed after close</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 md:gap-5">
            {PRINCIPLES.map(({ icon: Icon, title, text }, i) => (
              <ScrollReveal key={title} variant="up" delay={i * 70} className="h-full">
                <div className="card-surface-hover h-full p-7 flex flex-col gap-5">
                  <span className="icon-tile !w-10 !h-10">
                    <Icon size={18} className="text-foreground" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground tracking-[-0.015em]">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal variant="up" delay={300} className="sm:col-span-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Signals are educational trade ideas, not financial advice. They can and do lose.
                Manage your own risk and never trade money you cannot afford to lose.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
