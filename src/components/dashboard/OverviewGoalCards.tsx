"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, KeyRound, Monitor } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { BILLING_PERIOD_LABEL } from "@/lib/subscription-plans";
import { daysUntil, formatDisplayDate } from "@/lib/dates";

export default function OverviewGoalCards() {
  const { subscription, active, platform, mtAccountNumber, accessibleBots, bots, loading } = useDashboard();
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dashboard-card h-40 animate-pulse" />
        ))}
      </div>
    );
  }
  const days = daysUntil(subscription?.validUntil);

  const cards = [
    {
      icon: CreditCard,
      title: "Subscription",
      state: active ? "Active" : subscription ? subscription.status : "None",
      tone: active ? "bullish" : "neutral",
      tint: "teal",
      rows: [
        ["Plan", subscription ? BILLING_PERIOD_LABEL[subscription.billingPeriod] : "—"],
        ["Valid until", subscription ? formatDisplayDate(subscription.validUntil) : "—"],
      ],
      foot: active && days != null && days >= 0 ? (days === 0 ? "Expires today" : `${days} days left`) : "Unlock every EA and license",
      href: active ? "/dashboard/license" : "/pricing",
      cta: active ? "License key" : "View pricing",
    },
    {
      icon: KeyRound,
      title: "Bots & licenses",
      state: active ? `${accessibleBots.length} ready` : `${bots.length} in catalogue`,
      tone: active ? "bullish" : "neutral",
      tint: "violet",
      rows: [
        ["Accessible", active ? String(accessibleBots.length) : "0"],
        ["Catalogue", String(bots.length)],
      ],
      foot: active ? "Download builds tied to your MT account" : "Subscribe to unlock downloads",
      href: "/dashboard/bots",
      cta: "My bots",
    },
    {
      icon: Monitor,
      title: "Trading account",
      state: mtAccountNumber ? "Linked" : "Not linked",
      tone: mtAccountNumber ? "bullish" : "bearish",
      tint: "slate",
      rows: [
        ["Platform", platform && platform !== "—" ? platform : "—"],
        ["Login", mtAccountNumber || "—"],
      ],
      foot: mtAccountNumber ? "Balance syncs while the EA is on a chart" : "Link your MT login to sync balance",
      href: "/dashboard/trading-account",
      cta: "Account details",
    },
  ] as const;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map(({ icon: Icon, title, state, tone, tint, rows, foot, href, cta }) => (
        <div key={title} className={`dashboard-card dashboard-card--tint-${tint} !gap-4`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="dashboard-icon-tile">
                <Icon size={15} />
              </span>
              <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            </div>
            <span className="bias-pill" data-bias={tone}>
              {state}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="dashboard-stat-label">{k}</dt>
                <dd className="text-base font-bold tracking-[-0.01em] text-foreground font-data break-all">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-white/8">
            <p className="text-[0.6875rem] text-muted-foreground">{foot}</p>
            <Link href={href} className="link-arrow !text-xs shrink-0">
              {cta} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
