import Link from "next/link";
import { ArrowRight, Link2, ShieldCheck, Timer, Waypoints } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const RISK_CONTROLS = [
  ["Risk per trade", "0.5%"],
  ["Daily loss limit", "2.0%"],
  ["Max open positions", "2"],
  ["News filter", "On"],
];

const EXECUTION = [
  ["Platform", "MetaTrader 5"],
  ["Symbol", "XAUUSD"],
  ["Timeframe", "M15"],
  ["Mode", "Rule-based"],
];

type AlgoSectionProps = { hideHeader?: boolean };

export default function AlgoSection({ hideHeader = false }: AlgoSectionProps) {
  return (
    <section id="algo" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {!hideHeader && (
            <ScrollReveal variant="up" className="lg:col-span-5 flex flex-col gap-6">
              <span className="eyebrow">Algo &amp; EA</span>
              <h2 className="section-title">Automate your strategy.</h2>
              <p className="lead-text max-w-md">
                Explore Quantra&apos;s algorithmic trading tools and EAs designed to automate rule-based
                strategies and reduce manual execution.
              </p>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                {[
                  "Transparent rules, configurable risk controls",
                  "Runs on MT5 with account-bound licensing",
                  "Managed from your Quantra dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(91,108,255,0.9)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/algo" className="btn-primary-brand justify-center group">
                  Explore Algo
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link href="/bots" className="btn-outline-brand justify-center">
                  View EA catalogue
                </Link>
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal variant="up" delay={120} className={hideHeader ? "lg:col-span-12" : "lg:col-span-7"}>
            <div className="rounded-3xl glass-strong glow-ring overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-semibold text-foreground">EA dashboard</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground">Quantra Gold · v2</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-profit" />
                  Strategy active
                </span>
              </div>

              <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
                <Panel icon={Waypoints} title="Strategy status">
                  <dl className="grid grid-cols-2 gap-3">
                    {[
                      ["State", "Waiting for setup"],
                      ["Last check", "12s ago"],
                      ["Session filter", "London, NY"],
                      ["Trades today", "1"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>

                <Panel icon={ShieldCheck} title="Risk controls">
                  <ul className="flex flex-col gap-2.5">
                    {RISK_CONTROLS.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold text-foreground tabular-nums">{v}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel icon={Timer} title="Execution">
                  <ul className="flex flex-col gap-2.5">
                    {EXECUTION.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold text-foreground">{v}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel icon={Link2} title="Account connection">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <span className="h-8 w-8 rounded-lg bg-primary/25 border border-primary/40 flex items-center justify-center text-[0.625rem] font-bold text-foreground">
                        MT5
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Account ••••••42</p>
                        <p className="text-xs text-muted-foreground">License bound · verified</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      One license per trading account. Manage keys and downloads from the dashboard.
                    </p>
                  </div>
                </Panel>
              </div>

              <div className="px-5 sm:px-6 pb-5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  UI example. Automation reduces manual execution; it does not remove risk or guarantee
                  results. Always test on demo before running live.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Waypoints;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl glass-inset p-4 sm:p-5 flex flex-col gap-4">
      <span className="panel-label inline-flex items-center gap-1.5">
        <Icon size={12} className="text-foreground" />
        {title}
      </span>
      {children}
    </div>
  );
}
