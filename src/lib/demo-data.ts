import type { BotDoc, Subscription, TradingSnapshot } from "@/lib/firestore";

/**
 * Demo mode fills the member dashboard with sample data so the UI can be
 * reviewed without a linked MT account. Enable with NEXT_PUBLIC_DASHBOARD_DEMO=true.
 *
 * Demo mode also bypasses the auth gate (see DashboardGate), so it must never
 * reach production. NEXT_PUBLIC_* values are inlined at build time, which means
 * a production build made with the flag set would bake the bypass into the
 * client bundle permanently — unsetting the variable afterwards would not undo
 * it. Gating on NODE_ENV makes that impossible to build rather than something
 * to remember: `next build` folds this to `false`, `next dev` keeps it working.
 */
export const DASHBOARD_DEMO =
  process.env.NEXT_PUBLIC_DASHBOARD_DEMO === "true" && process.env.NODE_ENV !== "production";

export const DEMO_UID = "demo-user";
export const DEMO_EMAIL = "demo@quantra.app";
export const DEMO_PLATFORM = "MT5";
export const DEMO_MT_ACCOUNT = "10000001";

const DAY = 24 * 3600e3;

/** Deterministic pseudo-random so the curve is stable between renders. */
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildDemoSnapshot(now = Date.now()): TradingSnapshot {
  const points = 45 * 4; // 45 days, 6-hour samples
  let balance = 25000;
  const history = Array.from({ length: points }, (_, i) => {
    const drift = 14;
    const noise = (seeded(i) - 0.42) * 260;
    const dip = i % 23 === 0 ? -380 : 0;
    balance = Math.max(20000, balance + drift + noise + dip);
    return { at: new Date(now - (points - 1 - i) * (DAY / 4)), balance: Math.round(balance * 100) / 100 };
  });
  const last = history[history.length - 1].balance;
  const floating = 148.6;

  return {
    balance: last,
    equity: Math.round((last + floating) * 100) / 100,
    profit: floating,
    currency: "USD",
    server: "Quantra-Demo",
    maxFloatingLoss: -463.2,
    balanceHistory: history,
    updatedAt: new Date(now - 42e3),
    botStatus: {
      botName: "Quantra Gold v2",
      symbol: "XAUUSD",
      timeframe: "M15",
      serverTime: new Date(now).toISOString(),
      todayPnl: 92.4,
      dayTarget: 150,
      floatingPnl: floating,
      marketOpen: true,
      emaPeriod: 200,
      emaValue: 2412.6,
      emaDistancePips: 38.2,
      emaSlopePips: 1.4,
      emaTrend: "up",
      buyFilter: "trend + session",
      sellFilter: "blocked: above EMA",
      buyPositions: 2,
      sellPositions: 0,
      buyLots: 0.2,
      sellLots: 0,
      buyAvgEntry: 2398.4,
      sellAvgEntry: null,
      buyPnl: floating,
      sellPnl: 0,
      buySlArmed: true,
      sellSlArmed: false,
      buyHedgeOverride: false,
      sellHedgeOverride: false,
      syncTs: Math.floor(now / 1000),
    },
  };
}

export function buildDemoSubscription(now = Date.now()): Subscription {
  return {
    uid: DEMO_UID,
    billingPeriod: "yearly",
    status: "active",
    mtAccountNumber: DEMO_MT_ACCOUNT,
    licenseKey: "QNTR-DEMO-7F3A-91C2",
    validUntil: new Date(now + 212 * DAY),
    createdAt: new Date(now - 153 * DAY),
  };
}

export function buildDemoBots(now = Date.now()): BotDoc[] {
  const base = {
    imageKey: "",
    createdAt: new Date(now - 200 * DAY),
    updatedAt: new Date(now - 3 * DAY),
    proof: { backtest: null, live: null },
  };
  return [
    {
      ...base,
      id: "demo-gold-v2",
      fileKey: "bots/demo-gold-v2/QuantraGoldV2.ex5",
      name: "Quantra Gold v2",
      subtitle: "Session-filtered trend grid for XAUUSD",
      asset: "Gold",
      assetTag: "XAUUSD",
      status: "live",
      risk: "Medium",
      gain: "—",
      drawdown: "—",
      winRate: "—",
      trades: "—",
      description: "Rule-based gold strategy trading London and New York with EMA trend filter and hard daily loss limit.",
      pairs: ["XAUUSD"],
      minDeposit: "$500",
    },
    {
      ...base,
      id: "demo-nas-breakout",
      fileKey: "bots/demo-nas-breakout/QuantraNasBreakout.ex5",
      name: "Quantra NAS100 Breakout",
      subtitle: "Opening-range breakout on Nasdaq",
      asset: "Indices",
      assetTag: "NAS100",
      status: "beta",
      risk: "High",
      gain: "—",
      drawdown: "—",
      winRate: "—",
      trades: "—",
      description: "Trades the first-hour range break on NAS100 with fixed fractional risk and news filter.",
      pairs: ["NAS100", "US30"],
      minDeposit: "$1,000",
    },
    {
      ...base,
      id: "demo-btc-swing",
      fileKey: "",
      name: "Quantra BTC Swing",
      subtitle: "Daily-structure swing model for Bitcoin",
      asset: "Crypto",
      assetTag: "BTCUSD",
      status: "soon",
      risk: "Medium",
      gain: "—",
      drawdown: "—",
      winRate: "—",
      trades: "—",
      description: "Higher-timeframe structure model; in final testing.",
      pairs: ["BTCUSD"],
      minDeposit: "$1,000",
    },
  ];
}
