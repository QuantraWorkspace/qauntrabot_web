import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CircleUser,
  Home,
  LineChart,
  Newspaper,
  Users,
} from "lucide-react";

export type DashboardNavItem = { label: string; href: string };

export type DashboardNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** A group with one item renders as a single top-level link. */
  items: DashboardNavItem[];
};

/**
 * The member dashboard leads with market news and education, then
 * indicators and community. There is deliberately no signals feed. The
 * earlier EA/MT5 pages (trading account, license key, bots, setup, Create EA)
 * still resolve at their URLs for existing subscribers but are no longer in
 * the navigation; the license key is linked from Account → Subscription.
 */
export const DASHBOARD_NAV: DashboardNavGroup[] = [
  { id: "home", label: "Dashboard", icon: Home, items: [{ label: "Dashboard", href: "/dashboard" }] },
  {
    id: "news",
    label: "Market News",
    icon: Newspaper,
    items: [
      { label: "Latest News", href: "/dashboard/news" },
      { label: "Economic Calendar", href: "/dashboard/news/calendar" },
      { label: "Market Analysis", href: "/dashboard/news/analysis" },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: BookOpen,
    items: [
      { label: "Courses", href: "/dashboard/learn" },
      { label: "Lessons", href: "/dashboard/learn/lessons" },
      { label: "Learning Path", href: "/dashboard/learn/path" },
      { label: "Resources", href: "/dashboard/learn/resources" },
    ],
  },
  {
    id: "indicators",
    label: "Indicators",
    icon: LineChart,
    items: [
      { label: "My Indicators", href: "/dashboard/indicators" },
      { label: "Indicator Library", href: "/dashboard/indicators/library" },
      { label: "Request Indicator", href: "/dashboard/indicators/request" },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    items: [
      { label: "Community Feed", href: "/dashboard/community" },
      { label: "Discussions", href: "/dashboard/community/discussions" },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: CircleUser,
    items: [
      { label: "Profile", href: "/dashboard/account" },
      { label: "Subscription", href: "/dashboard/account/subscription" },
      { label: "Settings", href: "/dashboard/account/settings" },
    ],
  },
];

/** Bottom bar on phones, in the order the mobile brief prioritises. */
export const DASHBOARD_TABS: { label: string; href: string; icon: LucideIcon; match: string[] }[] = [
  { label: "Home", href: "/dashboard", icon: Home, match: ["/dashboard"] },
  { label: "News", href: "/dashboard/news", icon: Newspaper, match: ["/dashboard/news"] },
  { label: "Learn", href: "/dashboard/learn", icon: BookOpen, match: ["/dashboard/learn"] },
  { label: "Community", href: "/dashboard/community", icon: Users, match: ["/dashboard/community"] },
  { label: "Profile", href: "/dashboard/account", icon: CircleUser, match: ["/dashboard/account"] },
];

const ALL_HREFS = DASHBOARD_NAV.flatMap((g) => g.items.map((i) => i.href));

function isUnder(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The nav href to highlight: the longest one the path sits under, so
 * /dashboard/indicators/library lights up "Indicator Library" only, and an
 * indicator's detail page lights up "My Indicators".
 */
export function activeNavHref(pathname: string): string | null {
  let best: string | null = null;
  for (const href of ALL_HREFS) {
    if (href === "/dashboard" ? pathname === href : isUnder(pathname, href)) {
      if (!best || href.length > best.length) best = href;
    }
  }
  return best;
}

export function activeTabHref(pathname: string): string | null {
  let best: { href: string; len: number } | null = null;
  for (const tab of DASHBOARD_TABS) {
    for (const m of tab.match) {
      const hit = m === "/dashboard" ? pathname === m : isUnder(pathname, m);
      if (hit && (!best || m.length > best.len)) best = { href: tab.href, len: m.length };
    }
  }
  return best?.href ?? null;
}
