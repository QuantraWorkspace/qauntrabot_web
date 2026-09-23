"use client";

import { useEffect, useState } from "react";

/** Trading sessions in UTC hours (start, end). Overnight sessions wrap past 24. */
const SESSIONS = [
  { name: "Sydney", start: 22, end: 31 },
  { name: "Tokyo", start: 0, end: 9 },
  { name: "London", start: 8, end: 17 },
  { name: "New York", start: 13, end: 22 },
];
const OVERLAP = { start: 13, end: 17 };

function isOpen(start: number, end: number, h: number): boolean {
  return (h >= start && h < end) || (h + 24 >= start && h + 24 < end);
}

function segments(start: number, end: number): [number, number][] {
  if (end <= 24) return [[start, end]];
  return [
    [start, 24],
    [0, end - 24],
  ];
}

type Props = { compact?: boolean; className?: string };

export default function SessionClock({ compact = false, className = "" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const utcHour = now ? now.getUTCHours() + now.getUTCMinutes() / 60 : null;
  const nowLabel = now
    ? `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`
    : "";
  const openNames = utcHour == null ? [] : SESSIONS.filter((s) => isOpen(s.start, s.end, utcHour)).map((s) => s.name);
  const inOverlap = utcHour != null && utcHour >= OVERLAP.start && utcHour < OVERLAP.end;

  return (
    <div className={className}>
      {!compact && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <p className="text-sm text-foreground">
            {openNames.length === 0
              ? "Markets are between sessions"
              : inOverlap
                ? "London and New York overlap: the busiest hours of the day"
                : `${openNames.join(" and ")} ${openNames.length > 1 ? "are" : "is"} open`}
          </p>
          <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {nowLabel}
          </p>
        </div>
      )}

      <div className={`session-clock ${compact ? "session-clock--compact" : ""}`}>
        {SESSIONS.map(({ name, start, end }) => {
          const open = utcHour != null && isOpen(start, end, utcHour);
          return (
            <div key={name} className="contents">
              <span className="session-label" data-open={open}>
                {name}
              </span>
              <div className="session-lane">
                {segments(start, end).map(([a, b], i) => (
                  <span
                    key={i}
                    className="session-span"
                    data-open={open}
                    style={{ left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100}%`, animationDelay: `${i * 0.05 + SESSIONS.findIndex((s) => s.name === name) * 0.12}s` }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="col-start-2 relative h-0" aria-hidden>
          <span
            className="session-overlap"
            style={{
              left: `${(OVERLAP.start / 24) * 100}%`,
              width: `${((OVERLAP.end - OVERLAP.start) / 24) * 100}%`,
              top: compact ? "-2.55rem" : "-4.9rem",
              bottom: "0.25rem",
            }}
          />
          {utcHour != null && (
            <span
              className="session-now"
              style={{ left: `${(utcHour / 24) * 100}%`, top: compact ? "-2.6rem" : "-5.1rem", bottom: "0" }}
            />
          )}
        </div>

        {!compact && (
          <div className="session-axis" aria-hidden>
            {["00:00", "06:00", "12:00", "18:00", "24:00"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
