"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Maximize2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { BalanceHistoryPoint, TradingSnapshot } from "@/lib/firestore";
import { formatMoney } from "@/lib/format-money";
import { formatRelativeTime } from "@/lib/dates";

type Range = "1D" | "1W" | "1M" | "ALL";
const RANGES: { id: Range; ms: number | null }[] = [
  { id: "1D", ms: 24 * 3600e3 },
  { id: "1W", ms: 7 * 24 * 3600e3 },
  { id: "1M", ms: 30 * 24 * 3600e3 },
  { id: "ALL", ms: null },
];

const W = 600;
const H = 220;
const PAD_TOP = 16;
const PAD_BOTTOM = 26;
const PAD_RIGHT = 8;

type Props = {
  snapshot: TradingSnapshot | null;
  loading?: boolean;
  /** Hide the "View details" link (when already on the trading account page). */
  compact?: boolean;
};

function pickRange(history: BalanceHistoryPoint[], range: Range): BalanceHistoryPoint[] {
  const def = RANGES.find((r) => r.id === range);
  if (!def?.ms) return history;
  const cutoff = Date.now() - def.ms;
  const inWindow = history.filter((p) => p.at.getTime() >= cutoff);
  return inWindow.length >= 2 ? inWindow : history.slice(-2);
}

function shortDate(d: Date, range: Range): string {
  if (range === "1D") return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export default function BalanceCard({ snapshot, loading = false, compact = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const [range, setRange] = useState<Range>("1W");
  const currency = snapshot?.currency ?? "USD";
  const history = useMemo(() => snapshot?.balanceHistory ?? [], [snapshot]);

  const chart = useMemo(() => {
    if (!snapshot) return null;
    const samples = pickRange(history, range);
    const series =
      samples.length >= 2
        ? samples
        : [{ balance: snapshot.balance, at: snapshot.updatedAt }, { balance: snapshot.balance, at: snapshot.updatedAt }];

    const values = series.map((p) => p.balance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || Math.max(max * 0.02, 1);
    const lo = min - span * 0.15;
    const hi = max + span * 0.15;
    const plotW = W - PAD_RIGHT;
    const plotH = H - PAD_TOP - PAD_BOTTOM;

    const pts = series.map((p, i) => {
      const x = (i / (series.length - 1)) * plotW;
      const y = PAD_TOP + plotH * (1 - (p.balance - lo) / (hi - lo));
      return [x, y] as const;
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H - PAD_BOTTOM} L0 ${H - PAD_BOTTOM} Z`;
    const first = series[0].balance;
    const last = series[series.length - 1].balance;
    const changePct = first > 0 ? ((last - first) / first) * 100 : 0;
    const changeAbs = last - first;
    const yLabels = [hi, (hi + lo) / 2, lo];
    const xIdx = [0, Math.floor((series.length - 1) / 2), series.length - 1];
    const xLabels = xIdx.map((i) => ({ x: pts[i][0], label: shortDate(series[i].at, range) }));

    return { pts, line, area, changePct, changeAbs, yLabels, xLabels, hasTrend: samples.length >= 2, last: pts[pts.length - 1] };
  }, [snapshot, history, range]);

  if (loading) {
    return <div className="dashboard-card min-h-[22rem] animate-pulse" />;
  }

  const up = (chart?.changeAbs ?? 0) >= 0;

  return (
    <div className="dashboard-card dashboard-card--glow !gap-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="dashboard-icon-tile">
            <Wallet size={16} />
          </span>
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="text-sm font-semibold text-foreground">Balance</span>
            <span className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground tabular-nums">
              {snapshot ? formatMoney(snapshot.balance, currency) : "—"}
            </span>
            {snapshot && <span className="text-xs text-muted-foreground font-data">{currency}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chart?.hasTrend && (
            <span className={`bias-pill`} data-bias={up ? "bullish" : "bearish"}>
              {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {up ? "+" : ""}
              {chart.changePct.toFixed(2)}%
            </span>
          )}
          {!compact && (
            <Link href="/dashboard/trading-account" className="dashboard-chip" aria-label="Open trading account">
              <Maximize2 size={13} />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {RANGES.map(({ id }) => (
          <button
            key={id}
            type="button"
            onClick={() => setRange(id)}
            className={`dashboard-chip !px-3 cursor-pointer ${range === id ? "dashboard-chip--active" : ""}`}
          >
            {id}
          </button>
        ))}
        <span className="ml-auto text-[0.6875rem] text-muted-foreground whitespace-nowrap">
          {snapshot ? `Synced ${formatRelativeTime(snapshot.updatedAt)}` : "Not synced"}
        </span>
      </div>

      <div className="relative mt-4 pl-14">
        {chart ? (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full h-44 md:h-52" aria-label="Account balance over time">
              <defs>
                <linearGradient id={`bf-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--profit)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--profit)" stopOpacity="0" />
                </linearGradient>
                <filter id={`bg-${uid}`} x="-10%" y="-40%" width="120%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {[0, 0.5, 1].map((t) => (
                <line
                  key={t}
                  x1="0"
                  x2={W}
                  y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                  y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                  stroke="rgba(255,255,255,0.07)"
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path d={chart.area} fill={`url(#bf-${uid})`} />
              <path
                d={chart.line}
                fill="none"
                stroke="var(--profit)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter={`url(#bg-${uid})`}
              />
              <line
                x1={chart.last[0]}
                x2={chart.last[0]}
                y1={PAD_TOP}
                y2={H - PAD_BOTTOM}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={chart.last[0]} cy={chart.last[1]} r="9" fill="var(--profit)" opacity="0.18" vectorEffect="non-scaling-stroke" />
              <circle cx={chart.last[0]} cy={chart.last[1]} r="3.5" fill="var(--profit)" stroke="#0E1116" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[0.625rem] text-muted-foreground font-data" aria-hidden>
              {chart.yLabels.map((v, i) => (
                <span key={i}>{formatMoney(v, currency).replace(/\.\d+$/, "")}</span>
              ))}
            </div>
            <div className="mt-1.5 relative h-4 text-[0.625rem] text-muted-foreground font-data" aria-hidden>
              {chart.xLabels.map(({ x, label }, i) => (
                <span
                  key={i}
                  className="absolute whitespace-nowrap"
                  style={{
                    left: `${(x / W) * 100}%`,
                    transform: i === 0 ? "none" : i === chart.xLabels.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            {!chart.hasTrend && (
              <p className="mt-3 text-[0.6875rem] text-muted-foreground">
                Balance history builds while the EA stays attached to a chart.
              </p>
            )}
          </>
        ) : (
          <div className="h-44 md:h-52 -ml-14 rounded-xl border border-dashed border-white/12 bg-white/[0.02] flex flex-col items-center justify-center text-center gap-2 px-6">
            <p className="text-sm font-semibold text-foreground">No balance synced yet</p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Attach a Quantra EA to a chart on your linked MT account and balance, equity and history will stream here.
            </p>
            <Link href="/dashboard/setup" className="link-arrow text-xs mt-1">
              Quick setup <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
