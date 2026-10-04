import DashboardGate from "@/components/dashboard/DashboardGate";
import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description: "Market news, the economic calendar and trading lessons in one place.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="dashboard-root">
      <DashboardGate>
        <DashboardProvider>
          <DashboardShell>{children}</DashboardShell>
        </DashboardProvider>
      </DashboardGate>
    </main>
  );
}
