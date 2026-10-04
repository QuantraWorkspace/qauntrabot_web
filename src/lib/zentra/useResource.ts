"use client";

import { useCallback, useEffect, useState } from "react";
import type { DataSource, Sourced } from "./types";

export type Resource<T> = {
  data: T | null;
  source: DataSource | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

type Settled<T> = {
  /** Which request this result belongs to, so loading can be derived rather than stored. */
  fetcher: () => Promise<Sourced<T>>;
  attempt: number;
  data: T | null;
  source: DataSource | null;
  error: string | null;
};

/**
 * Loads one `Sourced<T>` fetcher on the client with loading, error and retry
 * state. Pass a stable fetcher (a module function, or one wrapped in
 * useCallback) — a new function each render refetches each render.
 */
export function useResource<T>(fetcher: () => Promise<Sourced<T>>): Resource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then(({ data, source }) => {
        if (!cancelled) setSettled({ fetcher, attempt, data, source, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setSettled({
            fetcher,
            attempt,
            data: null,
            source: null,
            error: err instanceof Error ? err.message : "Could not load this section.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const current = settled && settled.fetcher === fetcher && settled.attempt === attempt;

  return {
    data: current ? settled.data : null,
    source: current ? settled.source : null,
    error: current ? settled.error : null,
    loading: !current,
    retry,
  };
}
