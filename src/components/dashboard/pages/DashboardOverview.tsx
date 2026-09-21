"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import DashboardSectionHead from "@/components/dashboard/DashboardSectionHead";
import DashboardSubscriptionAlerts from "@/components/dashboard/DashboardSubscriptionAlerts";
import DashboardOverviewStats from "@/components/dashboard/DashboardOverviewStats";
import DashboardBlock from "@/components/dashboard/DashboardBlock";
import BalanceCard from "@/components/dashboard/BalanceCard";
import AccountHealthCard from "@/components/dashboard/AccountHealthCard";
import OverviewGoalCards from "@/components/dashboard/OverviewGoalCards";

export default function DashboardOverview() {
  const { loading, email, tradingSnapshot } = useDashboard();

  return (
    <div className="dashboard-page">
      <DashboardSectionHead
        eyebrow="Overview"
        title="Welcome back"
        description={<p className="font-data truncate max-w-lg">{email}</p>}
      />

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4">
        <BalanceCard snapshot={tradingSnapshot} loading={loading} />
        <AccountHealthCard snapshot={tradingSnapshot} loading={loading} />
      </div>

      <DashboardBlock title="At a glance">
        <DashboardOverviewStats compact />
      </DashboardBlock>

      <DashboardSubscriptionAlerts />

      <DashboardBlock title="Account overview">
        <OverviewGoalCards />
      </DashboardBlock>
    </div>
  );
}
