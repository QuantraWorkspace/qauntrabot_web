import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Monitor,
  Key,
  Bot,
  BookOpen,
  Wand2,
} from "lucide-react";

export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only show when subscription is active */
  requiresActive?: boolean;
  group: "navigation" | "tools";
};

export const DASHBOARD_NAV_GROUPS: { id: DashboardNavItem["group"]; label: string }[] = [
  { id: "navigation", label: "Navigation" },
  { id: "tools", label: "Tools" },
];

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard, group: "navigation" },
  { id: "trading-account", label: "Trading account", href: "/dashboard/trading-account", icon: Monitor, group: "navigation" },
  { id: "license", label: "License key", href: "/dashboard/license", icon: Key, requiresActive: true, group: "navigation" },
  { id: "bots", label: "My bots", href: "/dashboard/bots", icon: Bot, group: "navigation" },
  { id: "setup", label: "Quick setup", href: "/dashboard/setup", icon: BookOpen, requiresActive: true, group: "tools" },
  { id: "create-ea", label: "Create EA", href: "/dashboard/create-ea", icon: Wand2, group: "tools" },
];

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
