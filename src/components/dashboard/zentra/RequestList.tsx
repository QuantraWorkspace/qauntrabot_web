import { Inbox } from "lucide-react";
import type { IndicatorRequest, IndicatorRequestStatus } from "@/lib/zentra/types";
import { timeAgo } from "@/lib/zentra/format";
import { TIMEFRAME_LABEL } from "@/lib/zentra/indicator-request-input";
import { REQUEST_STATUS_LABEL } from "./IndicatorCard";
import { EmptyState, ErrorState, Skeleton } from "./ui";

const STEPS: IndicatorRequestStatus[] = ["PENDING", "REVIEWING", "APPROVED", "COMPLETED"];

const STEP_HINT: Record<IndicatorRequestStatus, string> = {
  PENDING: "Received. It's in the queue for the team.",
  REVIEWING: "The team is looking at what you asked for.",
  APPROVED: "Approved. We're setting it up for your account.",
  COMPLETED: "Done. Check My Indicators.",
};

export function RequestStepper({ status }: { status: IndicatorRequestStatus }) {
  const at = STEPS.indexOf(status);
  return (
    <ol className="z-stepper" aria-label={`Status: ${REQUEST_STATUS_LABEL[status]}`}>
      {STEPS.map((s, i) => (
        <li key={s} data-state={i < at ? "done" : i === at ? "current" : "todo"} aria-current={i === at ? "step" : undefined}>
          <span className="z-step-dot" aria-hidden />
          <span className="z-step-label">{REQUEST_STATUS_LABEL[s]}</span>
        </li>
      ))}
    </ol>
  );
}

function requestTitle(r: IndicatorRequest): string {
  if (r.kind === "access") return `Access: ${r.indicatorName ?? r.indicatorId ?? "indicator"}`;
  return `Custom indicator · ${r.market ?? "Any market"}${r.style ? ` · ${r.style}` : ""}`;
}

type Props = {
  requests: IndicatorRequest[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  now?: number;
  highlightId?: string | null;
};

export default function RequestList({ requests, loading, error, onRetry, now, highlightId }: Props) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading || !requests) return <Skeleton rows={2} height="7rem" />;
  if (requests.length === 0) {
    return <EmptyState icon={Inbox} title="No requests yet" body="Requests you send appear here with their status, from Pending through to Completed." />;
  }
  return (
    <ul className="flex flex-col gap-3">
      {requests.map((r) => (
        <li key={r.id} className="z-request" data-new={r.id === highlightId || undefined}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{requestTitle(r)}</p>
              <p className="z-meta mt-0.5">
                Sent {timeAgo(r.createdAt, now)}
                {r.timeframes.length > 0 && <> · {r.timeframes.map((t) => TIMEFRAME_LABEL[t]).join(", ")}</>}
              </p>
            </div>
            <span className="z-state" data-state={r.status.toLowerCase()}>
              {REQUEST_STATUS_LABEL[r.status]}
            </span>
          </div>
          {r.details && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{r.details}</p>}
          <RequestStepper status={r.status} />
          <p className="z-meta">{STEP_HINT[r.status]}</p>
        </li>
      ))}
    </ul>
  );
}
