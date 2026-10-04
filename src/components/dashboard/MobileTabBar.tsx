"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_TABS, activeTabHref } from "@/lib/dashboard-nav";

export default function MobileTabBar() {
  const pathname = usePathname();
  const current = activeTabHref(pathname);
  return (
    <nav className="z-tabbar lg:hidden" aria-label="Primary">
      {DASHBOARD_TABS.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} className="z-tab" aria-current={current === href ? "page" : undefined}>
          <Icon size={19} aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
