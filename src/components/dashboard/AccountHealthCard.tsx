"use client";

import { Activity, ShieldAlert } from "lucide-react";
import type { TradingSnapshot } from "@/lib/firestore";
import { formatMoney } from "@/lib/format-money";
import { formatRelativeTime } from "@/lib/dates";

type Props = { snapshot: TradingSnapshot | null; loading?: boolean };

function pct(n: number, d: number): number {
  if (!d || !Number.isFinite(n / d)) return 0;
  return Math.max(0, Math.min(100, (Math.abs(n) / Math.abs(d)) * 100));
}

export default function AccountHealthCard({ snapshot, loading = false }: Props) {
  if (loading) return <div className="dashboard-card min-h-[22rem] animate-pulse" />;

  const currency = snapshot?.currency ?? "USD";
  const bot = snapshot?.botStatus ?? null;
  const floating = snapshot?.profit ?? 0;
  const maxLoss = snapshot?.maxFloatingLoss ?? 0;
  const lossPct = snapshot ? pct(maxLoss, snapshot.balance) : 0;
  const targetPct = bot ? pct(bot.todayPnl, bot.dayTarget) : 0;

  return (
    <div className="dashboard-card !gap-5">
      <div className="flex items-center gap-3">
        <span className="dashboard-icon-tile">
          <ShieldAlert size={16} />
        </span>
        <p className="text-sm font-semibold text-foreground">Account health</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="dashboard-inset">
          <p className="dashboard-stat-label">Equity</p>
          <p className="text-lg font-bold tracking-[-0.02em] text-foreground tabular-nums">
            {snapshot ? formatMoney(snapshot.equity, currency) : "—"}
          </p>
        </div>
        <div className="dashboard-inset">
          <p className="dashboard-stat-label">Floating P/L</p>
          <p
            className={`text-lg font-bold tracking-[-0.02em] tabular-nums ${
              !snapshot ? "text-foreground" : floating >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {snapshot ? `${floating >= 0 ? "+" : ""}${formatMoney(floating, currency)}` : "—"}
          </p>
        </div>
      </div>

      <div className="dashboard-inset flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-foreground">Max floating loss</p>
          <span className="text-[0.6875rem] text-muted-foreground">this EA session</span>
        </div>
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(lossPct, snapshot && maxLoss < 0 ? 3 : 0)}%`,
              background: "linear-gradient(90deg, #FF7A80, #B91C1C)",
              boxShadow: "0 0 14px rgba(240,82,90,0.6)",
            }}
          />
        </div>
        <div className="flex items-center justify-between text-[0.6875rem] font-data">
          <span className="text-muted-foreground">
            Worst: <span className={maxLoss < 0 ? "text-loss" : "text-foreground"}>{snapshot && maxLoss < 0 ? formatMoney(maxLoss, currency) : "—"}</span>
          </span>
          <span className="text-muted-foreground">{snapshot ? `${lossPct.toFixed(1)}% of balance` : "No data"}</span>
        </div>
      </div>

      <div className="dashboard-inset flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-foreground">Today vs day target</p>
          <span className="text-[0.6875rem] text-muted-foreground">
            {bot ? `${bot.symbol}${bot.timeframe ? `, ${bot.timeframe}` : ""}` : "EA not attached"}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${bot ? Math.max(targetPct, bot.todayPnl > 0 ? 3 : 0) : 0}%`, boxShadow: "0 0 14px rgba(62,207,142,0.6)" }}
          />
        </div>
        <div className="flex items-center justify-between text-[0.6875rem] font-data">
          <span className="text-muted-foreground">
            Today:{" "}
            <span className={bot ? (bot.todayPnl >= 0 ? "text-profit" : "text-loss") : "text-foreground"}>
              {bot ? formatMoney(bot.todayPnl, currency) : "—"}
            </span>
          </span>
          <span className="text-muted-foreground">Target: {bot ? formatMoney(bot.dayTarget, currency) : "—"}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-[0.6875rem] font-data text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Activity size={12} className={bot?.marketOpen ? "text-profit" : "text-muted-foreground"} />
          {bot ? (bot.marketOpen ? "Market open" : bot.marketBlockReason || "Market closed") : "Waiting for EA"}
        </span>
        <span>{snapshot ? `Synced ${formatRelativeTime(snapshot.updatedAt)}` : "—"}</span>
      </div>
    </div>
  );
}
