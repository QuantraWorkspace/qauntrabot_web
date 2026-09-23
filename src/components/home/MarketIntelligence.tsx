import Link from "next/link";

import ScrollReveal from "@/components/shared/ScrollReveal";
import MiniChart from "./MiniChart";

type Bias = "bullish" | "bearish" | "neutral";

const MARKETS: { symbol: string; name: string; bias: Bias; points: number[]; note: string }[] = [
  { symbol: "GOLD", name: "XAUUSD", bias: "bullish", note: "Trend continuation, buying dips", points: [30, 33, 32, 36, 35, 39, 41, 40, 44, 46, 45, 49] },
  { symbol: "NASDAQ", name: "NAS100", bias: "neutral", note: "Range-bound ahead of earnings", points: [40, 42, 39, 43, 41, 44, 42, 45, 43, 44, 42, 43] },
  { symbol: "USD", name: "DXY", bias: "bearish", note: "Losing momentum after rate repricing", points: [52, 50, 51, 48, 49, 46, 47, 44, 45, 42, 41, 39] },
  { symbol: "BTC", name: "BTCUSD", bias: "bullish", note: "Higher lows holding on the daily", points: [28, 31, 30, 34, 33, 37, 36, 38, 41, 40, 44, 47] },
];

const CONTEXT = [
  { label: "Fundamental bias", value: "Risk-on", tone: "bullish" as Bias },
  { label: "Technical bias", value: "Bullish structure", tone: "bullish" as Bias },
  { label: "Key event", value: "US CPI, 13:30 UTC", tone: "neutral" as Bias },
  { label: "Market session", value: "London → New York", tone: "neutral" as Bias },
];

type MarketIntelligenceProps = { hideHeader?: boolean };

export default function MarketIntelligence({ hideHeader = false }: MarketIntelligenceProps) {
  return (
    <section id="markets" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        {!hideHeader && (
        <ScrollReveal variant="up" className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">Market intelligence</span>
            <h2 className="section-title mt-5">Know what moves the market.</h2>
            <p className="lead-text mt-6 max-w-xl">
              Daily fundamental and technical context across the markets traders actually watch,
              so entries come from a plan, not a reaction.
            </p>
          </div>
          <Link href="/markets" className="link-arrow shrink-0">
            View market analysis
          </Link>
        </ScrollReveal>
        )}

        <ScrollReveal variant="up" delay={100}>
          <div className="rounded-3xl glass-strong glow-ring overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">Market dashboard</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">Daily bias, updated pre-London</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground">
                UI example — illustrative only
              </span>
            </div>

            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-8 lg:border-r border-border">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border">
                  <span className="col-span-3 panel-label">Market</span>
                  <span className="col-span-2 panel-label">Bias</span>
                  <span className="col-span-4 panel-label">Context</span>
                  <span className="col-span-3 panel-label text-right">Structure</span>
                </div>
                <ul>
                  {MARKETS.map(({ symbol, name, bias, points, note }, i) => (
                    <li
                      key={symbol}
                      className={`grid grid-cols-2 sm:grid-cols-12 gap-x-4 gap-y-3 items-center px-5 sm:px-6 py-4 ${
                        i < MARKETS.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="sm:col-span-3">
                        <p className="text-sm font-bold text-foreground">{symbol}</p>
                        <p className="text-xs text-muted-foreground">{name}</p>
                      </div>
                      <div className="sm:col-span-2 justify-self-end sm:justify-self-start">
                        <span className="bias-pill" data-bias={bias}>
                          {bias}
                        </span>
                      </div>
                      <p className="col-span-2 sm:col-span-4 text-sm text-muted-foreground leading-snug">{note}</p>
                      <div className="col-span-2 sm:col-span-3">
                        <MiniChart
                          id={`mi-${symbol}`}
                          points={points}
                          tone={bias === "bearish" ? "down" : bias === "neutral" ? "flat" : "up"}
                          className="h-10"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 border-t lg:border-t-0 border-border bg-black/20">
                <div className="px-5 sm:px-6 py-4 border-b border-border">
                  <span className="panel-label">Today&apos;s context</span>
                </div>
                <dl className="px-5 sm:px-6 py-2">
                  {CONTEXT.map(({ label, value, tone }, i) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between gap-4 py-4 ${
                        i < CONTEXT.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <dt className="text-sm text-muted-foreground">{label}</dt>
                      <dd>
                        <span className="bias-pill" data-bias={tone}>
                          {value}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="px-5 sm:px-6 pb-6 pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Context is published for education. It is not a recommendation to buy or sell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
