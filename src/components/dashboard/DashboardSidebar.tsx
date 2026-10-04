"use client";

import { useEffect, useRef, type Ref } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LogOut, X, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { signOut } from "@/lib/auth";
import { DASHBOARD_NAV, activeNavHref } from "@/lib/dashboard-nav";
import { useStoredState } from "@/lib/zentra/hooks";
import { ZentraMark } from "@/components/layout/Logo";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: (returnFocus?: boolean) => void;
};

export function DashboardMobileToggle({ onOpen, ref }: { onOpen: () => void; ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-foreground cursor-pointer"
      aria-label="Open dashboard menu"
    >
      <Menu size={18} />
    </button>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const current = activeNavHref(pathname);
  const asideRef = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useStoredState("zentra-sidebar-collapsed", false);
  // The icon rail is a desktop-only mode; the phone drawer always shows labels.
  const rail = collapsed && !mobileOpen;

  // Phone drawer: focus moves in, Tab stays inside, Escape closes.
  useEffect(() => {
    if (!mobileOpen) return;
    const aside = asideRef.current;
    const items = () => Array.from(aside?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onMobileClose(true);
      } else if (e.key === "Tab") {
        const list = items();
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileClose]);

  const handleSignOut = async () => {
    onMobileClose();
    await signOut();
    window.location.href = "/";
  };

  const sidebarContent = (
    <>
      <div className="dashboard-sidebar-brand">
        <Link href="/dashboard" className="flex items-center gap-2.5 cursor-pointer" onClick={() => onMobileClose()} aria-label="Zentra dashboard">
          <span className="brand-tile !w-8 !h-8">
            <ZentraMark size={16} />
          </span>
          {!rail && <span className="text-sm font-bold text-foreground">Zentra</span>}
        </Link>
        {mobileOpen && (
          <button
            type="button"
            onClick={() => onMobileClose(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/8 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="dashboard-sidebar-nav znav" aria-label="Dashboard">
        {DASHBOARD_NAV.map(({ id, label, icon: Icon, items }) => {
          const groupActive = items.some((i) => i.href === current);
          if (items.length === 1 || rail) {
            const href = items[0].href;
            return (
              <Link
                key={id}
                href={href}
                onClick={() => onMobileClose()}
                className={`dashboard-sidebar-link ${groupActive ? "dashboard-sidebar-link--active" : ""}`}
                aria-current={current === href ? "page" : undefined}
                aria-label={rail ? label : undefined}
                title={rail ? label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                {!rail && label}
              </Link>
            );
          }
          return (
            <div key={id} className="znav-group" data-active={groupActive || undefined}>
              <p className="znav-group-label">
                <Icon size={16} className="shrink-0" />
                {label}
              </p>
              <ul className="znav-sub">
                {items.map(({ label: itemLabel, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => onMobileClose()}
                      className="znav-sublink"
                      aria-current={current === href ? "page" : undefined}
                    >
                      {itemLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="dashboard-sidebar-footer flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="dashboard-sidebar-link hidden lg:flex cursor-pointer"
          aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
          title={rail ? "Expand sidebar" : undefined}
        >
          {rail ? <PanelLeftOpen size={16} className="shrink-0" /> : <PanelLeftClose size={16} className="shrink-0" />}
          {!rail && "Collapse"}
        </button>
        <Link href="/" className="dashboard-sidebar-link" onClick={() => onMobileClose()} aria-label={rail ? "Back to website" : undefined} title={rail ? "Back to website" : undefined}>
          <Globe size={16} className="shrink-0" />
          {!rail && "Back to website"}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="dashboard-sidebar-link w-full text-left text-loss hover:bg-loss/10 hover:text-loss cursor-pointer"
          aria-label={rail ? "Sign out" : undefined}
          title={rail ? "Sign out" : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {!rail && "Sign out"}
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
          tabIndex={-1}
          onClick={() => onMobileClose(true)}
        />
      )}
      <aside
        ref={asideRef}
        className={`dashboard-sidebar ${mobileOpen ? "dashboard-sidebar--open" : ""}`}
        data-rail={rail || undefined}
        aria-label="Dashboard navigation"
        aria-modal={mobileOpen || undefined}
        role={mobileOpen ? "dialog" : undefined}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
