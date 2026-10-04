"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { EconomicEvent } from "@/lib/zentra/types";
import { formatClock, formatDay, isSameLocalDay, timeUntil } from "@/lib/zentra/format";
import { Chip, ImpactBadge } from "./ui";

type Props = { events: EconomicEvent[]; now: number; compact?: boolean };

function numeric(v?: string): number | null {
  if (!v) return null;
  const n = parseFloat(v.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * Where the release landed against forecast. Deliberately "above/below"
 * rather than "beat/miss": whether higher is good depends on the release.
 */
export function surprise(ev: EconomicEvent): { label: string; tone: "above" | "below" | "inline" } | null {
  const a = numeric(ev.actual);
  const f = numeric(ev.forecast);
  if (a === null || f === null) return null;
  if (a === f) return { label: "In line", tone: "inline" };
  return a > f ? { label: "Above forecast", tone: "above" } : { label: "Below forecast", tone: "below" };
}

/** Rows expand in place to show forecast, previous, actual and why the release matters. */
export default function EconomicCalendar({ events, now, compact = false }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const days: { key: string; label: string; items: EconomicEvent[] }[] = [];
  for (const ev of events) {
    const key = ev.at.toDateString();
    let day = days.find((d) => d.key === key);
    if (!day) {
      day = { key, label: isSameLocalDay(ev.at, new Date(now)) ? "Today" : formatDay(ev.at), items: [] };
      days.push(day);
    }
    day.items.push(ev);
  }

  return (
    <div className="z-cal" data-compact={compact || undefined}>
      <div className="z-cal-row z-cal-headrow" aria-hidden>
        <span>Time</span>
        <span>Event</span>
        <span>Currency</span>
        <span>Impact</span>
        <span />
      </div>
      {days.map((day) => (
        <Fragment key={day.key}>
          {!compact && <p className="z-cal-day">{day.label}</p>}
          {day.items.map((ev) => {
            const expanded = open === ev.id;
            const past = ev.at.getTime() <= now;
            const panelId = `cal-${ev.id}`;
            return (
              <div key={ev.id} className="z-cal-item" data-past={past || undefined} data-open={expanded || undefined}>
                <button
                  type="button"
                  className="z-cal-row"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : ev.id)}
                >
                  <span className="z-cal-time">
                    {formatClock(ev.at)}
                    {!past && ev.at.getTime() - now < 6 * 3600e3 && <small>{timeUntil(ev.at, now)}</small>}
                  </span>
                  <span className="z-cal-event">
                    {ev.event}
                    {past && surprise(ev) && (
                      <small className="z-surprise" data-tone={surprise(ev)!.tone}>
                        {ev.actual} · {surprise(ev)!.label}
                      </small>
                    )}
                  </span>
                  <span className="z-cal-ccy">{ev.currency}</span>
                  <span>
                    <ImpactBadge impact={ev.impact} compact />
                  </span>
                  <ChevronDown size={14} className="z-cal-chev" aria-hidden />
                </button>
                {expanded && (
                  <div id={panelId} className="z-cal-detail">
                    <dl className="z-cal-figures">
                      <div>
                        <dt>Actual</dt>
                        <dd>{past ? (ev.actual ?? "—") : "—"}</dd>
                      </div>
                      <div>
                        <dt>Forecast</dt>
                        <dd>{ev.forecast ?? "—"}</dd>
                      </div>
                      <div>
                        <dt>Previous</dt>
                        <dd>{ev.previous ?? "—"}</dd>
                      </div>
                    </dl>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ev.whyItMatters}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="z-meta mr-1">Watch</span>
                      {ev.affects.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
