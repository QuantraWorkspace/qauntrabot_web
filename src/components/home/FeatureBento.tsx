import Link from "next/link";
import { Bot, LayoutDashboard, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import MiniChart from "./MiniChart";

const BOT_CURVE = [30, 32, 31, 35, 34, 38, 37, 41, 40, 44, 43, 47, 46, 50, 49, 54];
const TABS = ["Rule-based", "Session filter", "Risk controls", "News filter"];

export default function FeatureBento() {
  return (
    <section id="ecosystem" className="py-16 md:py-24 scroll-mt-24">
      <div className="container-site">
        <ScrollReveal variant="up" className="flex flex-col items-center text-center gap-5 mb-12 md:mb-16">
          <h2 className="section-title">One ecosystem. Everything a trader needs.</h2>
          <p className="lead-text max-w-2xl">
            Quantra brings education, market intelligence, trading tools, automation and
            community into one place, helping traders make better-informed decisions.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
          <ScrollReveal variant="up" className="lg:col-span-2">
            <div className="glass-strong glow-ring rounded-[1.75rem] overflow-hidden grid md:grid-cols-[1fr_1.4fr]">
              <div className="p-8 md:p-10 flex flex-col gap-6 justify-center">
                <span className="icon-tile !w-11 !h-11">
                  <Bot size={20} className="text-primary" strokeWidth={1.8} />
                </span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-foreground leading-[1.05]">
                  Quantra
                  <br />
                  Automated
                  <br />
                  EA &amp; Algo
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Rule-based MT5 expert advisors with transparent logic and risk controls you set
                  yourself. Test on demo, then run from your dashboard.
                </p>
                <Link href="/algo" className="btn-primary-brand w-fit group">
                  Explore Algo
                </Link>
              </div>
              <div className="p-4 md:p-6 md:pl-0">
                <div className="mock-card h-full p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Strategy profile</p>
                    <span className="mock-pill">See all</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TABS.map((t, i) => (
                      <span key={t} className={`mock-pill ${i === 0 ? "mock-pill--accent" : ""}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="relative mt-2 pl-7">
                    <MiniChart id="bento-bot" points={BOT_CURVE} className="h-36 md:h-44" />
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[0.6875rem] text-muted-foreground" aria-hidden>
                      <span>Hi</span>
                      <span>Lo</span>
                    </div>
                  </div>
                  <p className="text-[0.6875rem] text-muted-foreground">
                    Illustrative demo curve. Automation reduces manual execution; it does not remove risk.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={80}>
            <div className="card-surface-hover h-full p-7 md:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Market Dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Bias, session and key events for Gold, Nasdaq, USD and BTC in one daily view.
                </p>
              </div>
              <div className="mock-card p-4 mt-auto">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/6 border border-white/8">
                    <LayoutDashboard size={15} className="text-primary" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">GOLD, Daily bias</p>
                    <p className="text-[0.6875rem] text-muted-foreground">London → New York</p>
                  </div>
                  <span className="bias-pill" data-bias="bullish">
                    Bullish
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[["Fundamental", "Risk-on"], ["Technical", "HH / HL"], ["Event", "US CPI"]].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-white/4 border border-white/6 px-2 py-2">
                      <p className="text-[0.6875rem] text-muted-foreground">{k}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={160}>
            <div className="card-surface-hover h-full p-7 md:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Risk controls</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Every EA ships with a daily loss limit, max positions and a news filter you set yourself.
                </p>
              </div>
              <div className="mock-card p-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-primary" />
                    <p className="text-xs font-semibold text-foreground">Quantra Gold v2, live</p>
                  </div>
                  <span className="bias-pill" data-bias="bullish">
                    Within limits
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-2 text-xs">
                  {[
                    ["Risk per trade", "0.5%"],
                    ["Daily loss limit", "2.0%"],
                    ["Max open positions", "2"],
                    ["News filter", "On"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-semibold text-foreground tabular-nums">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade" className="flex justify-center mt-10">
          <Link href="/tools" className="btn-primary-brand group">
            View all tools
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
