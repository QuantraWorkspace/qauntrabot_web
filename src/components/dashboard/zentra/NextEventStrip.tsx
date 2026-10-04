import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import type { EconomicEvent } from "@/lib/zentra/types";
import { formatClock, timeUntil } from "@/lib/zentra/format";

/** "Next high-impact: USD CPI in 2h 14m" — the one calendar fact worth a glance. */
export default function NextEventStrip({ events, now }: { events: EconomicEvent[]; now: number }) {
  const next = events.find((e) => e.impact === "high" && e.at.getTime() > now);
  if (!next) return null;
  const soon = next.at.getTime() - now < 60 * 60e3;
  return (
    <Link href="/dashboard/news/calendar" className="z-next-event" data-soon={soon || undefined}>
      <CalendarClock size={16} className="shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate">
        <span className="text-muted-foreground">Next high-impact release: </span>
        <b className="font-semibold text-foreground">
          {next.currency} {next.event}
        </b>
        <span className="text-muted-foreground"> at {formatClock(next.at)}</span>
      </span>
      <span className="z-next-event-time">{timeUntil(next.at, now)}</span>
      <ArrowRight size={14} className="shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}
