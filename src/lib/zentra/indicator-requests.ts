"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { DASHBOARD_DEMO } from "@/lib/demo-data";
import { sampleRequests } from "./sample-data";
import type { IndicatorRequest } from "./types";
import type { ValidRequest } from "./indicator-request-input";

/**
 * Member-side client for indicator requests. Signed-in members go through
 * /api/indicator-requests (Firestore). The local demo mode has no account to
 * store against, so it keeps requests in this browser tab instead.
 */

type Wire = Omit<IndicatorRequest, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };

const revive = (r: Wire): IndicatorRequest => ({ ...r, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) });

export class RequestError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

async function authedFetch(init?: RequestInit): Promise<Response> {
  const token = await getAuthToken();
  if (!token) throw new RequestError("Please sign in again to continue.");
  return fetch("/api/indicator-requests", {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
  });
}

/* ── Demo-mode store (sessionStorage) ─────────────────────────────────────── */

const DEMO_KEY = "zentra-demo-indicator-requests";

function readDemo(): IndicatorRequest[] {
  try {
    const raw = sessionStorage.getItem(DEMO_KEY);
    if (raw) return (JSON.parse(raw) as Wire[]).map(revive);
  } catch {
    /* storage unavailable — fall through to the seed */
  }
  return sampleRequests();
}

function writeDemo(list: IndicatorRequest[]) {
  try {
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(list));
  } catch {
    /* non-fatal in demo */
  }
}

/* ── Public API ───────────────────────────────────────────────────────────── */

export async function listMyRequests(): Promise<IndicatorRequest[]> {
  if (DASHBOARD_DEMO) return readDemo();
  const res = await authedFetch();
  const body = (await res.json().catch(() => ({}))) as { requests?: Wire[]; error?: string };
  if (!res.ok) throw new RequestError(body.error ?? "Could not load your requests.");
  return (body.requests ?? []).map(revive);
}

export async function submitRequest(input: ValidRequest): Promise<IndicatorRequest> {
  if (DASHBOARD_DEMO) {
    const now = new Date();
    const created: IndicatorRequest = { ...input, id: `req-${now.getTime()}`, status: "PENDING", createdAt: now, updatedAt: now };
    writeDemo([created, ...readDemo()]);
    return created;
  }
  const res = await authedFetch({ method: "POST", body: JSON.stringify(input) });
  const body = (await res.json().catch(() => ({}))) as { request?: Wire; error?: string; fields?: Record<string, string> };
  if (!res.ok || !body.request) throw new RequestError(body.error ?? "Could not submit your request.", body.fields);
  return revive(body.request);
}

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export function useIndicatorRequests() {
  const [requests, setRequests] = useState<IndicatorRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listMyRequests()
      .then((list) => !cancelled && setRequests(list))
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : "Could not load your requests."));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const add = useCallback((req: IndicatorRequest) => setRequests((prev) => [req, ...(prev ?? [])]), []);
  const retry = useCallback(() => {
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { requests, loading: requests === null && !error, error, retry, add };
}
