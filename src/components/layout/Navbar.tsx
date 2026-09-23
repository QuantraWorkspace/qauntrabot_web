"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BookOpen, Bot, Home, LayoutGrid, LineChart, Users, Wrench, X, type LucideIcon } from "lucide-react";
import StaticAuthLinks from "./StaticAuthLinks";
import UserNavMenu from "./UserNavMenu";
import { PRIMARY_NAV } from "@/lib/site-nav";

type NavbarProps = {
  /** When false, skip Firebase auth in the nav (marketing pages). */
  authNav?: boolean;
};

const ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/markets": LineChart,
  "/education": BookOpen,
  "/tools": Wrench,
  "/algo": Bot,
  "/community": Users,
};

const MOBILE_BAR = ["/", "/markets", "/tools", "/algo"];

export default function Navbar({ authNav = true }: NavbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!moreOpen) return;
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [moreOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const barItems = PRIMARY_NAV.filter((i) => MOBILE_BAR.includes(i.href));
  const sheetItems = PRIMARY_NAV.filter((i) => !MOBILE_BAR.includes(i.href));
  const sheetActive = sheetItems.some((i) => isActive(i.href));

  return (
    <>
      {/* Top bar: brand + actions (desktop also carries the pill nav) */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="container-site flex items-center justify-between gap-4 pt-3 md:pt-4">
          <Link href="/" className="nav-chip pointer-events-auto cursor-pointer shrink-0">
            <Image src="/logo/logo.png" alt="Quantra" width={26} height={26} className="object-contain logo-mark shrink-0" priority />
            <span className="flex flex-col leading-none">
              <span className="text-[0.8125rem] font-bold text-foreground">Quantra</span>
              <span className="hidden sm:block lg:hidden 2xl:block mt-0.5 text-[0.5rem] font-medium text-muted-foreground">
                Trading ecosystem
              </span>
            </span>
          </Link>

          <nav className="nav-pill hidden lg:flex pointer-events-auto" aria-label="Primary">
            {PRIMARY_NAV.map(({ label, href }) => {
              const Icon = ICONS[href];
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-pill-item nav-pill-item--row"
                  data-active={isActive(href)}
                  title={label}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 pointer-events-auto">
            {authNav ? <UserNavMenu /> : <StaticAuthLinks />}
          </div>

          <div className="lg:hidden flex items-center gap-2 pointer-events-auto">
            {authNav ? (
              <UserNavMenu />
            ) : (
              <Link href="/register" className="btn-primary-brand nav-action text-sm !px-4">
                Join Quantra
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom tab bar (phone / tablet) */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-50 flex flex-col items-stretch gap-3">
        {moreOpen && (
          <div className="nav-sheet" role="dialog" aria-label="More navigation">
            <div className="flex items-center justify-between px-3 pt-2 pb-1">
              <span className="panel-label">More</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-foreground cursor-pointer"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {sheetItems.map(({ label, href }) => {
                const Icon = ICONS[href];
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className="nav-sheet-item"
                    data-active={isActive(href)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {label}
                  </Link>
                );
              })}
              <Link href="/dashboard" onClick={() => setMoreOpen(false)} className="nav-sheet-item">
                <LayoutGrid size={18} strokeWidth={1.8} />
                Dashboard
              </Link>
              <Link
                href="/register"
                onClick={() => setMoreOpen(false)}
                className="nav-sheet-item !text-white"
                style={{ background: "linear-gradient(135deg, rgba(110,126,255,0.55), rgba(71,87,214,0.55))" }}
              >
                Join Quantra
              </Link>
            </div>
          </div>
        )}

        <nav className="nav-pill flex justify-between" aria-label="Primary">
          {barItems.map(({ label, href }) => {
            const Icon = ICONS[href];
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                className="nav-pill-item flex-1 !min-w-0 !px-2"
                data-active={isActive(href) && !moreOpen}
              >
                <Icon size={20} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="nav-pill-item flex-1 !min-w-0 !px-2"
            data-active={moreOpen || sheetActive}
            aria-expanded={moreOpen}
          >
            <LayoutGrid size={20} strokeWidth={1.8} />
            More
          </button>
        </nav>
      </div>
    </>
  );
}
