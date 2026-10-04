import type { Impact } from "./types";

export function formatPrice(value: number, digits: number): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatPct(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

export function timeAgo(date: Date, now = Date.now()): string {
  const s = Math.round((now - date.getTime()) / 1000);
  if (s < 0) return timeUntil(date, now);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export function timeUntil(date: Date, now = Date.now()): string {
  const m = Math.round((date.getTime() - now) / 60e3);
  if (m <= 0) return "now";
  if (m < 60) return `in ${m} min`;
  const h = Math.floor(m / 60);
  return `in ${h}h ${m % 60}m`;
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const IMPACT_LABEL: Record<Impact, string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};

export function greeting(hour: number): string {
  if (hour < 5) return "Good evening";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Main sessions in UTC hours; Sydney wraps past midnight. Same hours as SessionClock. */
const SESSIONS = [
  { name: "Sydney", start: 22, end: 31 },
  { name: "Tokyo", start: 0, end: 9 },
  { name: "London", start: 8, end: 17 },
  { name: "New York", start: 13, end: 22 },
];

/** "London and New York open" style line for the greeting. Weekends read as closed. */
export function sessionLine(date: Date): string {
  const day = date.getUTCDay();
  const h = date.getUTCHours() + date.getUTCMinutes() / 60;
  if (day === 6 || (day === 0 && h < 22) || (day === 5 && h >= 22)) return "Forex markets are closed for the weekend";
  const open = SESSIONS.filter(({ start, end }) => (h >= start && h < end) || (h + 24 >= start && h + 24 < end)).map((s) => s.name);
  if (open.length === 0) return "Between sessions";
  if (open.length === 1) return `${open[0]} session open`;
  return `${open.slice(0, -1).join(", ")} and ${open[open.length - 1]} open`;
}
