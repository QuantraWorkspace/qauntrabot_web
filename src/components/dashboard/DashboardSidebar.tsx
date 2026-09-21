"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut, X, Menu } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { signOut } from "@/lib/auth";
import { DASHBOARD_NAV, DASHBOARD_NAV_GROUPS, isDashboardNavActive } from "@/lib/dashboard-nav";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardMobileToggle({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-foreground cursor-pointer"
      aria-label="Open dashboard menu"
    >
      <Menu size={18} />
    </button>
  );
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { active } = useDashboard();

  const navItems = DASHBOARD_NAV.filter((item) => !item.requiresActive || active);

  const handleSignOut = async () => {
    onMobileClose();
    await signOut();
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      <div className="dashboard-sidebar-brand">
        <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer" onClick={onMobileClose}>
          <span className="brand-tile !w-8 !h-8">
            <Image src="/logo/logo.png" alt="" width={16} height={16} className="object-contain" />
          </span>
          <span className="text-sm font-bold tracking-[0.16em] uppercase text-foreground">Quantra</span>
        </Link>
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/8 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="dashboard-sidebar-nav" aria-label="Dashboard">
        {DASHBOARD_NAV_GROUPS.map(({ id, label }) => {
          const items = navItems.filter((item) => item.group === id);
          if (items.length === 0) return null;
          return (
            <div key={id}>
              <p className="dashboard-sidebar-group-label">{label}</p>
              <ul className="flex flex-col gap-1">
                {items.map(({ id: itemId, label: itemLabel, href, icon: Icon }) => {
                  const isActive = isDashboardNavActive(pathname, href);
                  return (
                    <li key={itemId}>
                      <Link
                        href={href}
                        onClick={onMobileClose}
                        className={`dashboard-sidebar-link ${isActive ? "dashboard-sidebar-link--active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon size={16} className="shrink-0" />
                        {itemLabel}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="dashboard-sidebar-footer flex flex-col gap-1">
        <Link href="/" className="dashboard-sidebar-link" onClick={onMobileClose}>
          <ArrowUpRight size={16} className="shrink-0" />
          Back to website
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="dashboard-sidebar-link w-full text-left text-loss hover:bg-loss/10 hover:text-loss cursor-pointer"
        >
          <LogOut size={16} className="shrink-0" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop lg:hidden"
          aria-label="Close menu"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`dashboard-sidebar ${mobileOpen ? "dashboard-sidebar--open" : ""}`}
        aria-label="Dashboard navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
