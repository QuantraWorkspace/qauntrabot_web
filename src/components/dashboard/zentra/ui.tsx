import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RotateCw, type LucideIcon } from "lucide-react";
import type { Impact, DataSource } from "@/lib/zentra/types";
import type { Resource } from "@/lib/zentra/useResource";
import { IMPACT_LABEL } from "@/lib/zentra/format";

/* ── Section frame ────────────────────────────────────────────────────────── */

type SectionProps = {
  title: string;
  icon?: LucideIcon;
  source?: DataSource | null;
  action?: { href: string; label: string };
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ title, icon: Icon, source, action, children, className = "", id }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={`z-section ${className}`} aria-labelledby={headingId}>
      <header className="z-section-head">
        <h2 id={headingId} className="z-section-title">
          {Icon && <Icon size={16} className="text-primary" aria-hidden />}
          {title}
          {source === "sample" && <SampleTag />}
        </h2>
        {action && (
          <Link href={action.href} className="z-link">
            {action.label} <ArrowRight size={13} aria-hidden />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export function SampleTag() {
  return (
    <span
      className="z-sample"
      title="Sample content for reviewing the layout. Not market data or published news."
    >
      Sample
    </span>
  );
}

/* ── Page head ────────────────────────────────────────────────────────────── */

export function PageTitle({ title, lede, aside }: { title: string; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="z-page-head">
      <div className="min-w-0">
        <h1 className="z-page-title">{title}</h1>
        {lede && <p className="z-page-lede">{lede}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

/* ── States ───────────────────────────────────────────────────────────────── */

export function Skeleton({ rows = 3, height = "5.5rem", grid }: { rows?: number; height?: string; grid?: string }) {
  return (
    <div className={grid ?? "flex flex-col gap-3"} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="z-skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="z-empty">
      <Icon size={20} className="text-muted-foreground" aria-hidden />
      <p className="z-empty-title">{title}</p>
      <p className="z-empty-body">{body}</p>
      {action && (
        <Link href={action.href} className="z-btn z-btn--ghost mt-1">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="z-empty z-empty--error" role="alert">
      <AlertTriangle size={20} className="text-warning" aria-hidden />
      <p className="z-empty-title">This section didn&apos;t load</p>
      <p className="z-empty-body">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="z-btn z-btn--ghost mt-1">
          <RotateCw size={14} aria-hidden /> Try again
        </button>
      )}
    </div>
  );
}

type ResourceBodyProps<T> = {
  resource: Resource<T>;
  isEmpty: (data: T) => boolean;
  loading: ReactNode;
  empty: ReactNode;
  children: (data: T) => ReactNode;
};

/** Loading → error → empty → content, the same way in every section. */
export function ResourceBody<T>({ resource, isEmpty, loading, empty, children }: ResourceBodyProps<T>) {
  if (resource.error) return <ErrorState message={resource.error} onRetry={resource.retry} />;
  if (resource.loading || resource.data === null) return <>{loading}</>;
  if (isEmpty(resource.data)) return <>{empty}</>;
  return <>{children(resource.data)}</>;
}

/* ── Badges ───────────────────────────────────────────────────────────────── */

export function ImpactBadge({ impact, compact = false }: { impact: Impact; compact?: boolean }) {
  return (
    <span className="z-impact" data-impact={impact}>
      <span className="z-impact-dot" aria-hidden />
      {compact ? impact[0].toUpperCase() + impact.slice(1) : IMPACT_LABEL[impact]}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="z-chip">{children}</span>;
}
