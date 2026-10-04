"use client";

import { useCallback, useRef, useState } from "react";
import { useMenu } from "@/lib/zentra/useMenu";
import Link from "next/link";
import { Bell, BookOpen, CalendarClock, Inbox, Newspaper } from "lucide-react";
import { getNotifications } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { timeAgo } from "@/lib/zentra/format";
import { NO_IDS, useStoredState } from "@/lib/zentra/hooks";
import type { DashboardNotification } from "@/lib/zentra/types";

const ICON: Record<DashboardNotification["kind"], typeof Bell> = {
  news: Newspaper,
  event: CalendarClock,
  request: Inbox,
  lesson: BookOpen,
};

const SEEN_KEY = "zentra-notifications-seen";

export default function NotificationsMenu() {
  const { data, source } = useResource(getNotifications);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useStoredState(SEEN_KEY, NO_IDS);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useMenu(open, close, panelRef, ref, triggerRef);

  const items = data ?? [];
  const unread = items.filter((n) => !seen.includes(n.id)).length;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) setSeen(() => items.map((n) => n.id));
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="z-icon-btn z-icon-btn--lg"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} new` : "Notifications"}
        onClick={toggle}
      >
        <Bell size={17} aria-hidden />
        {unread > 0 && <span className="z-badge-dot">{unread}</span>}
      </button>
      {open && (
        <div ref={panelRef} className="z-pop z-notif-pop" role="region" aria-label="Notifications">
          <p className="z-pop-head">
            Notifications
            {source === "sample" && <span className="z-sample">Sample</span>}
          </p>
          {items.length === 0 ? (
            <p className="z-pop-empty">You&apos;re all caught up.</p>
          ) : (
            items.map((n) => {
              const Icon = ICON[n.kind];
              return (
                <Link key={n.id} href={n.href} className="z-pop-item" onClick={() => setOpen(false)}>
                  <Icon size={15} className="text-primary shrink-0 mt-0.5" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-foreground">{n.title}</span>
                    <span className="block z-meta">
                      {n.body} · {timeAgo(n.at)}
                    </span>
                  </span>
                </Link>
              );
            })
          )}
          <Link href="/dashboard/account/settings" className="z-pop-foot" onClick={() => setOpen(false)}>
            Notification settings
          </Link>
        </div>
      )}
    </div>
  );
}
