"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, LineChart, Search, Send } from "lucide-react";
import { getIndicatorAccess } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { RequestError, submitRequest, useIndicatorRequests } from "@/lib/zentra/indicator-requests";
import type { Indicator, IndicatorRequest, MarketGroup } from "@/lib/zentra/types";
import { toast } from "@/lib/toast";
import { EmptyState, PageTitle, ResourceBody, SampleTag, Section, Skeleton } from "@/components/dashboard/zentra/ui";
import IndicatorCard, { INDICATOR_STATUS_LABEL, IndicatorSpecs } from "@/components/dashboard/zentra/IndicatorCard";
import FilterTabs from "@/components/dashboard/zentra/FilterTabs";

/** Access requests plus the "request access" action, shared by the library and detail views. */
function useAccessRequests() {
  const reqs = useIndicatorRequests();
  const { add } = reqs;
  const [sending, setSending] = useState<string | null>(null);

  const openRequestFor = useCallback(
    (id: string): IndicatorRequest | undefined =>
      reqs.requests?.find((r) => r.kind === "access" && r.indicatorId === id && r.status !== "COMPLETED"),
    [reqs.requests],
  );

  const requestAccess = useCallback(
    async (indicator: Indicator) => {
      setSending(indicator.id);
      try {
        const created = await submitRequest({
          kind: "access",
          indicatorId: indicator.id,
          indicatorName: indicator.name,
          timeframes: [],
          details: "",
        });
        add(created);
        toast.success(`Access requested for ${indicator.name}.`);
      } catch (err) {
        toast.error(err instanceof RequestError ? err.message : "Could not send the request.");
      } finally {
        setSending(null);
      }
    },
    [add],
  );

  return { ...reqs, sending, openRequestFor, requestAccess };
}

/* ── My Indicators ────────────────────────────────────────────────────────── */

export function MyIndicatorsView() {
  const access = useResource(getIndicatorAccess);

  return (
    <div className="z-page">
      <PageTitle
        title="My Indicators"
        lede="The indicators on your account. Open one to see how it works and which markets it covers."
        aside={
          <Link href="/dashboard/indicators/library" className="z-btn z-btn--ghost">
            Indicator Library <ArrowRight size={14} aria-hidden />
          </Link>
        }
      />
      <ResourceBody
        resource={access}
        isEmpty={(d) => d.owned.length === 0}
        loading={<Skeleton rows={3} height="12rem" grid="z-card-grid" />}
        empty={
          <EmptyState
            icon={LineChart}
            title="No indicators on your account yet"
            body="Browse the library to see what each indicator does, then request access. Approved indicators appear here."
            action={{ href: "/dashboard/indicators/library", label: "Browse the library" }}
          />
        }
      >
        {({ all, owned }) => (
          <>
            {access.source === "sample" && (
              <p className="z-meta flex items-center gap-2">
                <SampleTag /> Sample account access, for reviewing the layout.
              </p>
            )}
            <div className="z-card-grid">
              {all
                .filter((i) => owned.includes(i.id))
                .map((i) => (
                  <IndicatorCard key={i.id} indicator={i} owned />
                ))}
            </div>
          </>
        )}
      </ResourceBody>

      <Link href="/dashboard/indicators/request" className="z-request-cta">
        <span className="z-request-cta-icon" aria-hidden>
          <Send size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">Need something these don&apos;t cover?</span>
          <span className="block text-[0.8125rem] text-muted-foreground mt-0.5">Request a custom indicator for your market and timeframe.</span>
        </span>
        <ArrowRight size={16} className="ml-auto shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </div>
  );
}

/* ── Library ──────────────────────────────────────────────────────────────── */

const MARKET_FILTERS: { value: "ALL" | MarketGroup; label: string }[] = [
  { value: "ALL", label: "All markets" },
  { value: "Gold", label: "Gold" },
  { value: "Forex", label: "Forex" },
  { value: "Nasdaq", label: "Nasdaq" },
  { value: "Crypto", label: "Crypto" },
];

export function LibraryView() {
  const access = useResource(getIndicatorAccess);
  const reqs = useAccessRequests();
  const [market, setMarket] = useState<"ALL" | MarketGroup>("ALL");
  const [query, setQuery] = useState("");

  return (
    <div className="z-page">
      <PageTitle
        title="Indicator Library"
        lede="Every Zentra indicator: what it does and which markets and timeframes it covers."
        aside={access.source === "sample" ? <SampleTag /> : undefined}
      />

      <div className="z-toolbar">
        <FilterTabs label="Market" options={MARKET_FILTERS} value={market} onChange={setMarket} />
        <label className="z-search-inline">
          <Search size={14} aria-hidden />
          <span className="sr-only">Search indicators</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search indicators" className="z-input-bare" />
        </label>
      </div>

      <ResourceBody
        resource={access}
        isEmpty={(d) => d.all.length === 0}
        loading={<Skeleton rows={4} height="14rem" grid="z-card-grid" />}
        empty={
          <EmptyState
            icon={LineChart}
            title="The library is being stocked"
            body="Published indicators will be listed here. In the meantime you can tell us what you need."
            action={{ href: "/dashboard/indicators/request", label: "Request an indicator" }}
          />
        }
      >
        {({ all, owned }) => {
          const q = query.trim().toLowerCase();
          const list = all.filter(
            (i) =>
              (market === "ALL" || i.markets.includes(market)) &&
              (!q || i.name.toLowerCase().includes(q) || i.tagline.toLowerCase().includes(q)),
          );
          return list.length === 0 ? (
            <EmptyState icon={Search} title="No indicators match" body="Try another market or clear the search." />
          ) : (
            <div className="z-card-grid">
              {list.map((i) => (
                <IndicatorCard
                  key={i.id}
                  indicator={i}
                  owned={owned.includes(i.id)}
                  request={reqs.openRequestFor(i.id)}
                  onRequestAccess={reqs.requests ? reqs.requestAccess : undefined}
                  requesting={reqs.sending === i.id}
                />
              ))}
            </div>
          );
        }}
      </ResourceBody>

      <p className="z-meta">
        Can&apos;t find what you need?{" "}
        <Link href="/dashboard/indicators/request" className="z-link inline-flex">
          Request a custom indicator
        </Link>
      </p>
    </div>
  );
}

/* ── Detail ───────────────────────────────────────────────────────────────── */

export function IndicatorDetailView({ id }: { id: string }) {
  const access = useResource(getIndicatorAccess);
  const reqs = useAccessRequests();

  const indicator = access.data?.all.find((i) => i.id === id) ?? null;
  const owned = access.data?.owned.includes(id) ?? false;
  const openRequest = reqs.openRequestFor(id);

  return (
    <div className="z-page">
      <Link href={owned ? "/dashboard/indicators" : "/dashboard/indicators/library"} className="z-back">
        <ArrowLeft size={14} aria-hidden /> {owned ? "My Indicators" : "Indicator Library"}
      </Link>

      <ResourceBody
        resource={access}
        isEmpty={() => !indicator}
        loading={<Skeleton rows={2} height="12rem" />}
        empty={
          <EmptyState
            icon={LineChart}
            title="Indicator not found"
            body="It may have been renamed or retired."
            action={{ href: "/dashboard/indicators/library", label: "Back to the library" }}
          />
        }
      >
        {() =>
          indicator && (
            <>
              <div className="z-detail-head">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {owned ? (
                      <span className="z-state" data-state="on">
                        <span className="z-live-dot" aria-hidden /> Active on your account
                      </span>
                    ) : (
                      <span className="z-state" data-state={indicator.status}>
                        {INDICATOR_STATUS_LABEL[indicator.status]}
                      </span>
                    )}
                    {access.source === "sample" && <SampleTag />}
                  </div>
                  <h1 className="z-page-title">{indicator.name}</h1>
                  <p className="z-page-lede">{indicator.tagline}</p>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                  {owned ? (
                    indicator.accessUrl ? (
                      <a href={indicator.accessUrl} target="_blank" rel="noreferrer" className="z-btn z-btn--primary">
                        Open on {indicator.platform} <ExternalLink size={14} aria-hidden />
                      </a>
                    ) : (
                      <p className="z-meta max-w-[16rem] lg:text-right">
                        Your {indicator.platform} invite link appears here once access has been set up on your account.
                      </p>
                    )
                  ) : openRequest ? (
                    <span className="z-btn z-btn--static">Access request {openRequest.status.toLowerCase()}</span>
                  ) : indicator.status !== "coming-soon" ? (
                    <button
                      type="button"
                      className="z-btn z-btn--primary"
                      disabled={!reqs.requests || reqs.sending === indicator.id}
                      onClick={() => reqs.requestAccess(indicator)}
                    >
                      {reqs.sending === indicator.id ? "Sending…" : "Request access"}
                    </button>
                  ) : (
                    <span className="z-btn z-btn--static">Coming soon</span>
                  )}
                </div>
              </div>

              <div className="z-split z-split--detail">
                <div className="flex flex-col gap-6">
                  <div className="z-panel z-panel--pad">
                    <p className="text-[0.9375rem] leading-relaxed text-foreground/90">{indicator.description}</p>
                  </div>
                  <Section title="How it works">
                    <ol className="z-method">
                      {indicator.method.map((step, i) => (
                        <li key={i}>
                          <span className="z-lesson-n">{String(i + 1).padStart(2, "0")}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Section>
                </div>
                <div className="z-panel z-panel--pad h-fit">
                  <p className="z-panel-label">Coverage</p>
                  <IndicatorSpecs indicator={indicator} />
                  <p className="z-meta">Runs on {indicator.platform}. Alerts can be forwarded to your phone from there.</p>
                </div>
              </div>

            </>
          )
        }
      </ResourceBody>
    </div>
  );
}
