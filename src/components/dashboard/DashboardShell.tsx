"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Monitor, User } from "lucide-react";
import DashboardSidebar, { DashboardMobileToggle } from "@/components/dashboard/DashboardSidebar";
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
  const { profile } = useAuth();
  const { active, platform, mtAccountNumber } = useDashboard();
  const { email } = useDashboard();
  const name = profile?.displayName || email.split("@")[0] || "Member";

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-main-header justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <DashboardMobileToggle onOpen={() => setMobileOpen(true)} />
            <span className={`bias-pill hidden sm:inline-flex`} data-bias={active ? "bullish" : "neutral"}>
              {active ? "Active plan" : "Free"}
            </span>
            {DASHBOARD_DEMO && (
              <span className="bias-pill" data-bias="neutral" title="NEXT_PUBLIC_DASHBOARD_DEMO is on — sample data, not your account">
                Demo data
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden md:block">
            <Link href="/dashboard/trading-account" className="dashboard-chip !gap-2 !px-3.5">
              <Monitor size={13} className="text-primary" />
              <span className="font-semibold text-foreground">{platform && platform !== "—" ? platform : "MT5"}</span>
              <span className="text-muted-foreground">{mtAccountNumber ? `account ${mtAccountNumber}` : "no account linked"}</span>
              <ChevronDown size={13} className="text-muted-foreground" />
            </Link>
            </span>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="dashboard-chip !py-1 !pl-1 !pr-2.5 cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-400 text-[0.6875rem] font-bold text-[#06110C]">
                  {userInitials(email)}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-none min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[9rem]">{name}</span>
                  <span className="text-[0.6875rem] text-muted-foreground truncate max-w-[9rem] mt-0.5">{email}</span>
                </span>
                <ChevronDown size={13} className={`text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[12rem] nav-sheet !rounded-2xl !p-1.5 z-50">
                  <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className="nav-sheet-item !py-2.5 !text-sm">
                    <User size={15} /> Profile
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
      </div>
    </div>
  );
}
