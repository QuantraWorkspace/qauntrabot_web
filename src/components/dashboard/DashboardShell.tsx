"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useMenu } from "@/lib/zentra/useMenu";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import DashboardSidebar, { DashboardMobileToggle } from "@/components/dashboard/DashboardSidebar";
import HeaderSearch from "@/components/dashboard/HeaderSearch";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";
import MobileTabBar from "@/components/dashboard/MobileTabBar";
import { MembershipBadge } from "@/components/dashboard/pages/AccountViews";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { signOut } from "@/lib/auth";
import { DASHBOARD_DEMO } from "@/lib/demo-data";

function userInitials(email: string): string {
  const part = email.split("@")[0] ?? "U";
  return part.slice(0, 2).toUpperCase();
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  // Dismissing the drawer (Escape, ✕, backdrop) returns focus to the menu
  // button; following a link inside it leaves focus to the new page.
  const closeDrawer = useCallback((returnFocus?: boolean) => {
    setMobileOpen(false);
    // The button is inside the inert page until the next render, so wait a frame.
    if (returnFocus) requestAnimationFrame(() => drawerTriggerRef.current?.focus());
  }, []);
  const { profile } = useAuth();
  const { email } = useDashboard();
  const name = profile?.displayName || email.split("@")[0] || "Member";

  useMenu(menuOpen, closeMenu, menuPanelRef, menuRef, menuTriggerRef);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={closeDrawer} />
      {/* While the phone drawer is open, the page behind it can't be focused or scrolled. */}
      <div className="dashboard-main" inert={mobileOpen || undefined}>
        <header className="dashboard-main-header z-topbar">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <DashboardMobileToggle ref={drawerTriggerRef} onOpen={() => setMobileOpen(true)} />
            <HeaderSearch />
            {DASHBOARD_DEMO && (
              <span className="hidden md:inline-flex">
                <span className="bias-pill" data-bias="neutral" title="NEXT_PUBLIC_DASHBOARD_DEMO is on — sample data, not your account">
                  Demo data
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex">
              <MembershipBadge />
            </span>
            <NotificationsMenu />

            <div ref={menuRef} className="relative">
              <button
                ref={menuTriggerRef}
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="dashboard-chip !py-1 !pl-1 !pr-2.5 cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <span className="z-avatar !w-8 !h-8 !text-[0.6875rem]">{userInitials(email || name)}</span>
                <span className="hidden md:flex flex-col items-start leading-none min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[9rem]">{name}</span>
                  <span className="text-[0.6875rem] text-muted-foreground truncate max-w-[9rem] mt-0.5">{email}</span>
                </span>
                <ChevronDown size={13} className={`text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div ref={menuPanelRef} role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[12rem] nav-sheet !rounded-2xl !p-1.5 z-50">
                  <Link href="/dashboard/account" role="menuitem" onClick={() => setMenuOpen(false)} className="nav-sheet-item !py-2.5 !text-sm">
                    <User size={15} /> Profile
                  </Link>
                  <Link href="/dashboard/account/settings" role="menuitem" onClick={() => setMenuOpen(false)} className="nav-sheet-item !py-2.5 !text-sm">
                    <Settings size={15} /> Settings
                  </Link>
                  <Link href="/" role="menuitem" onClick={() => setMenuOpen(false)} className="nav-sheet-item !py-2.5 !text-sm"> Back to website
                  </Link>
                  <button type="button" role="menuitem" onClick={handleSignOut} className="nav-sheet-item !py-2.5 !text-sm w-full text-left !text-loss cursor-pointer">
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="dashboard-main-inner">{children}</div>
        <MobileTabBar />
      </div>
    </div>
  );
}
