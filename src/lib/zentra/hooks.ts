"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import type { Preferences } from "./types";

/** Current time, refreshed on an interval so "12 min ago" stays true. */
export function useNow(intervalMs = 60e3): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** The name to greet the member by. */
export function useMemberName(): string {
  const { profile } = useAuth();
  const { email } = useDashboard();
  const raw = profile?.displayName || email.split("@")[0] || "trader";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/* ── Per-device storage ─────────────────────────────────────────────────── */

const listeners = new Set<() => void>();
const memory = new Map<string, string>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function readValue<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      /* corrupt entry — use the fallback */
    }
  }
  cache.set(key, { raw, value });
  return value;
}

/**
 * A value kept in this browser (localStorage, or memory when storage is
 * blocked). Renders `fallback` on the server and during hydration, then the
 * stored value. `fallback` must be a stable reference (a module constant).
 * Only for per-viewer conveniences — nothing here reaches the server.
 */
export function useStoredState<T>(key: string, fallback: T): [T, (update: (prev: T) => T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readValue(key, fallback),
    () => fallback,
  );
  const update = useCallback(
    (fn: (prev: T) => T) => {
      const raw = JSON.stringify(fn(readValue(key, fallback)));
      try {
        localStorage.setItem(key, raw);
      } catch {
        memory.set(key, raw);
      }
      listeners.forEach((l) => l());
    },
    [key, fallback],
  );
  return [value, update];
}

export const NO_IDS: string[] = [];

type Completion = { id: string; at: number };
const NO_COMPLETIONS: (Completion | string)[] = [];
const WEEK = 7 * 24 * 3600e3;

/**
 * Lessons the viewer marked complete on this device, with when. Server
 * progress (once it exists) is merged on top. Early versions stored bare ids;
 * those still read, with an unknown completion time.
 */
export function useLessonCompletions() {
  const [raw, setRaw] = useStoredState("zentra-completed-lessons", NO_COMPLETIONS);
  const entries = useMemo<Completion[]>(
    () => raw.map((x) => (typeof x === "string" ? { id: x, at: 0 } : x)),
    [raw],
  );
  const completed = useMemo(() => entries.map((e) => e.id), [entries]);
  const toggle = useCallback(
    (id: string) =>
      setRaw((prev) => {
        const list = prev.map((x) => (typeof x === "string" ? { id: x, at: 0 } : x));
        return list.some((e) => e.id === id) ? list.filter((e) => e.id !== id) : [...list, { id, at: Date.now() }];
      }),
    [setRaw],
  );
  /** Lessons completed in the last seven days (as of `now`). */
  const countSince = useCallback((now: number) => entries.filter((e) => e.at > now - WEEK).length, [entries]);
  return { completed, toggle, countSince };
}

export const NO_PREFERENCES: Preferences = { markets: [], level: null, topics: [], done: false };

/**
 * Onboarding answers, kept on this device for now. Moving them to the user
 * profile later means changing only this hook.
 */
export function usePreferences() {
  const [stored, setStored] = useStoredState<Partial<Preferences>>("zentra-preferences", NO_PREFERENCES);
  const prefs = useMemo<Preferences>(() => ({ ...NO_PREFERENCES, ...stored }), [stored]);
  const update = useCallback(
    (patch: Partial<Preferences>) => setStored((prev) => ({ ...NO_PREFERENCES, ...prev, ...patch })),
    [setStored],
  );
  const reset = useCallback(() => setStored(() => NO_PREFERENCES), [setStored]);
  /** True once the member has told us anything that should change ranking. */
  const personalised = prefs.markets.length > 0 || prefs.level !== null || prefs.topics.length > 0;
  return { prefs, update, reset, personalised };
}

/** Articles the viewer bookmarked on this device. */
export function useSavedArticles() {
  const [saved, setSaved] = useStoredState("zentra-saved-articles", NO_IDS);
  const toggle = useCallback(
    (id: string) => setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])),
    [setSaved],
  );
  return { saved, toggle };
}
