import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import type { Indicator, IndicatorRequest } from "@/lib/zentra/types";
import { TIMEFRAME_LABEL } from "@/lib/zentra/indicator-request-input";
import { Chip } from "./ui";

export const INDICATOR_STATUS_LABEL: Record<Indicator["status"], string> = {
  active: "Active",
  beta: "Beta",
  "coming-soon": "Coming soon",
};

export const REQUEST_STATUS_LABEL: Record<IndicatorRequest["status"], string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  APPROVED: "Approved",
  COMPLETED: "Completed",
};

export function IndicatorSpecs({ indicator }: { indicator: Indicator }) {
  return (
    <dl className="z-specs">
      <div>
        <dt>Markets</dt>
        <dd>{indicator.markets.join(" / ")}</dd>
      </div>
      <div>
        <dt>Timeframes</dt>
        <dd>{indicator.timeframes.map((t) => TIMEFRAME_LABEL[t]).join(" / ")}</dd>
      </div>
    </dl>
  );
}

type IndicatorCardProps = {
  indicator: Indicator;
  owned: boolean;
  /** Open access request for this indicator, if any. */
  request?: IndicatorRequest;
  onRequestAccess?: (indicator: Indicator) => void;
  requesting?: boolean;
  compact?: boolean;
};

export default function IndicatorCard({ indicator, owned, request, onRequestAccess, requesting, compact }: IndicatorCardProps) {
  const detailHref = `/dashboard/indicators/${indicator.id}`;
  const available = indicator.status !== "coming-soon";

  return (
    <article className="z-indicator" data-owned={owned || undefined}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="z-indicator-name">
            <Link href={detailHref} className="hover:underline underline-offset-4 decoration-white/30">
              {indicator.name}
            </Link>
          </h3>
          {!compact && <p className="z-indicator-tagline">{indicator.tagline}</p>}
        </div>
        {owned ? (
          <span className="z-state" data-state="on">
            <span className="z-live-dot" aria-hidden /> Active
          </span>
        ) : (
          <span className="z-state" data-state={indicator.status}>
            {INDICATOR_STATUS_LABEL[indicator.status]}
          </span>
        )}
      </header>

      <IndicatorSpecs indicator={indicator} />

      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          <Chip>{indicator.platform}</Chip>
        </div>
      )}

      <footer className="z-indicator-foot">
        {owned ? (
          <Link href={detailHref} className="z-btn z-btn--primary">
            Open Indicator <ArrowRight size={14} aria-hidden />
          </Link>
        ) : request ? (
          <span className="z-btn z-btn--static">
            {request.status === "APPROVED" || request.status === "COMPLETED" ? <Check size={14} aria-hidden /> : <Clock size={14} aria-hidden />}
            Access {REQUEST_STATUS_LABEL[request.status].toLowerCase()}
          </span>
        ) : available && onRequestAccess ? (
          <button type="button" className="z-btn z-btn--primary" onClick={() => onRequestAccess(indicator)} disabled={requesting}>
            {requesting ? "Sending…" : "Request access"}
          </button>
        ) : null}
        <Link href={detailHref} className="z-link ml-auto">
          Details
        </Link>
      </footer>
    </article>
  );
}
