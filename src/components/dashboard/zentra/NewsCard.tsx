"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import type { NewsArticle } from "@/lib/zentra/types";
import { timeAgo } from "@/lib/zentra/format";
import { useSavedArticles } from "@/lib/zentra/hooks";
import { ImpactBadge } from "./ui";

type Props = { article: NewsArticle; now?: number; dense?: boolean; lead?: boolean };

export function marketHref(market: string) {
  return `/dashboard/news?market=${encodeURIComponent(market)}`;
}

export function SaveButton({ id, withLabel = false }: { id: string; withLabel?: boolean }) {
  const { saved, toggle } = useSavedArticles();
  const on = saved.includes(id);
  return (
    <button
      type="button"
      className={withLabel ? "z-btn z-btn--ghost" : "z-save"}
      aria-pressed={on}
      aria-label={withLabel ? undefined : on ? "Remove from saved" : "Save for later"}
      title={on ? "Saved" : "Save for later"}
      onClick={() => toggle(id)}
    >
      <Bookmark size={withLabel ? 14 : 15} fill={on ? "currentColor" : "none"} aria-hidden />
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}

export default function NewsCard({ article, now, dense = false, lead = false }: Props) {
  return (
    <article className="z-news" data-dense={dense || undefined} data-lead={lead || undefined}>
      <div className="flex flex-wrap items-center gap-2 pr-8">
        <ImpactBadge impact={article.impact} />
        {article.markets.map((m) => (
          <Link key={m} href={marketHref(m)} className="z-chip z-chip--link">
            {m}
          </Link>
        ))}
        {article.kind === "analysis" && <span className="z-kind">Analysis</span>}
      </div>
      <SaveButton id={article.id} />
      <h3 className="z-news-headline">
        <Link href={`/dashboard/news/${article.id}`} className="z-stretched">
          {article.headline}
        </Link>
      </h3>
      {!dense && <p className="z-news-summary">{article.summary}</p>}
      <footer className="flex items-center gap-2 z-meta">
        <span>{article.source}</span>
        <span className="z-meta-sep" aria-hidden>·</span>
        <time dateTime={article.publishedAt.toISOString()}>{timeAgo(article.publishedAt, now)}</time>
        <span className="ml-auto inline-flex items-center gap-1 text-foreground/80 z-news-cta">
          {article.kind === "analysis" ? "Read analysis" : "Read more"} <ArrowRight size={12} aria-hidden />
        </span>
      </footer>
    </article>
  );
}
