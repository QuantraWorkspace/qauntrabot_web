import Image from "next/image";
import { BarChart3, Bell, BookOpen, Bot, FlaskConical, LayoutDashboard, LineChart, Moon, NotebookPen, Plus, Search, SlidersHorizontal, Sun, Wrench, X } from "lucide-react";
import MiniChart from "./MiniChart";

const EQUITY = [42, 44, 41, 46, 45, 49, 47, 52, 50, 48, 53, 55, 52, 57, 56, 60, 58, 63, 61, 66];

const NAV_MAIN = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: LineChart, label: "Markets" },
  { icon: FlaskConical, label: "Backtests" },
  { icon: Wrench, label: "Tools" },
];
const NAV_TRADING = [
  { icon: Bot, label: "Algo & EA" },
  { icon: NotebookPen, label: "Journal" },
  { icon: BookOpen, label: "Education" },
];

const POSITIONS = [
  { pair: "XAUUSD", side: "Buy 0.10", state: "+$132.40", tone: "bullish", when: "EMA trend, London" },
  { pair: "XAUUSD", side: "Buy 0.10", state: "+$16.20", tone: "bullish", when: "Grid level 2" },
  { pair: "NAS100", side: "Sell 0.20", state: "-$41.80", tone: "bearish", when: "Range break, NY" },
  { pair: "EURUSD", side: "Flat", state: "Filtered", tone: "neutral", when: "News window" },
];

const BIAS = [
  { m: "GOLD", b: "bullish" },
  { m: "NASDAQ", b: "neutral" },
  { m: "USD", b: "bearish" },
  { m: "BTC", b: "bullish" },
] as const;

/** Illustrative product mock — a demo account, not real trading data. */
export default function HeroDashboardMock() {
  return (
    <div className="product-frame mx-auto max-w-6xl">
      <div className="product-screen grid md:grid-cols-[13.5rem_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r border-white/8 p-4 gap-6">
          <div className="flex items-center gap-2.5 px-1">
            <span className="brand-tile !w-8 !h-8">
              <Image src="/logo/logo.png" alt="" width={16} height={16} className="object-contain" />
            </span>
            <span className="text-sm font-bold text-foreground">Quantra</span>
          </div>
          <MockNav items={NAV_MAIN} />
          <div>
            <p className="px-3 mb-2 text-[0.6875rem] font-semibold text-muted-foreground">
              Trading
            </p>
            <MockNav items={NAV_TRADING} />
          </div>
          <div className="mt-auto mock-card p-3">
            <p className="text-[0.6875rem] text-muted-foreground">Account</p>
            <p className="mt-1 text-xs font-semibold text-foreground">Demo, MT5</p>
            <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/8">
            <div className="flex items-center gap-2 min-w-0">
              <span className="mock-pill">
                <span className="h-4 w-4 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500" />
                <span className="font-semibold text-foreground">XAUUSD</span>
                <span className="text-muted-foreground">· H4, MT5</span>
                <X size={11} className="text-muted-foreground" />
              </span>
              <span className="mock-pill !px-2" aria-hidden>
                <Plus size={12} />
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="mock-pill w-44 justify-start text-muted-foreground">
                <Search size={12} />
                Search markets
              </span>
              <span className="mock-pill !gap-2" aria-hidden>
                <Moon size={12} className="text-foreground" />
                <Sun size={12} className="text-muted-foreground" />
              </span>
              <span className="mock-pill !px-2" aria-hidden>
                <Bell size={12} />
              </span>
              <span className="mock-pill !pl-1">
                <span className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-blue-400" />
                <span className="hidden lg:flex flex-col leading-none">
                  <span className="text-[0.6875rem] font-semibold text-foreground">Quantra member</span>
                  <span className="text-[0.6875rem] text-muted-foreground mt-0.5">Pro plan</span>
                </span>
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 grid lg:grid-cols-[1.6fr_1fr] gap-4">
            <div className="mock-card p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <BarChart3 size={12} />
                Demo account
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">Equity curve</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground tabular-nums">
                  $25,000
                </span>
                <span className="mock-pill mock-pill--accent">Starting balance</span>
                <span className="mock-pill">30D</span>
                <span className="ml-auto mock-pill !gap-1.5" aria-hidden>
                  <SlidersHorizontal size={11} />
                  1M
                </span>
              </div>
              <div className="relative mt-4 pr-8">
                <MiniChart id="hero-equity" points={EQUITY} className="h-32 sm:h-40" />
                <div className="absolute inset-y-0 left-[58%] border-l border-dashed border-white/20" aria-hidden />
                <span className="absolute left-[58%] top-[30%] -translate-x-1/2 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/25" aria-hidden />
                <div className="absolute right-0 top-2 flex flex-col gap-6 text-[0.6875rem] text-muted-foreground tabular-nums">
                  <span>Hi</span>
                  <span>Mid</span>
                  <span>Lo</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground tabular-nums">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>

            <div className="mock-card p-4 sm:p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                    <Bot size={12} />
                    EA activity
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">Open positions</p>
                </div>
                <span className="mock-pill !px-2" aria-hidden>
                  <SlidersHorizontal size={12} />
                </span>
              </div>
              <ul className="mt-4 flex flex-col divide-y divide-white/6">
                {POSITIONS.map(({ pair, side, state, tone, when }, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-2.5">
                    <span className="h-8 w-8 rounded-full bg-white/6 border border-white/8 flex items-center justify-center text-[0.6875rem] font-bold text-foreground">
                      {pair.slice(0, 3)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">
                        {pair} <span className="text-muted-foreground font-normal">{side}</span>
                      </p>
                      <p className="text-[0.6875rem] text-muted-foreground">{when}</p>
                    </div>
                    <span className="bias-pill" data-bias={tone}>
                      {state}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-3 grid grid-cols-4 gap-1.5">
                {BIAS.map(({ m, b }) => (
                  <div key={m} className="rounded-lg bg-white/4 border border-white/6 px-1.5 py-1.5 text-center">
                    <p className="text-[0.6875rem] font-bold tracking-[0.08em] text-foreground">{m}</p>
                    <p
                      className="text-[0.6875rem] capitalize"
                      style={{ color: b === "bullish" ? "var(--profit)" : b === "bearish" ? "#FF7A80" : "#C5CBDA" }}
                    >
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockNav({ items }: { items: { icon: typeof LayoutDashboard; label: string; active?: boolean }[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ icon: Icon, label, active }) => (
        <li
          key={label}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium ${
            active
              ? "bg-white/8 border border-white/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              : "text-muted-foreground"
          }`}
        >
          <Icon size={14} />
          {label}
        </li>
      ))}
    </ul>
  );
}
