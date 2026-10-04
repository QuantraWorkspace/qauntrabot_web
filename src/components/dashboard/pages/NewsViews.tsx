"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, CalendarClock, Clock3, Link2, Newspaper, Sparkles } from "lucide-react";
import { getEconomicCalendar, getNews } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { useNow, usePreferences, useSavedArticles } from "@/lib/zentra/hooks";
import { formatClock, formatDay, isSameLocalDay, timeAgo } from "@/lib/zentra/format";
import { filterEventsByCurrency, isRelevantArticle, listMarkets, rankNews, relevantCurrencies } from "@/lib/zentra/personalise";
import type { Impact, MarketGroup, NewsArticle } from "@/lib/zentra/types";
import { toast } from "@/lib/toast";
import { EmptyState, ImpactBadge, PageTitle, ResourceBody, SampleTag, Section, Skeleton } from "@/components/dashboard/zentra/ui";
import NewsCard, { SaveButton, marketHref } from "@/components/dashboard/zentra/NewsCard";
import EconomicCalendar from "@/components/dashboard/zentra/EconomicCalendar";
import FilterTabs from "@/components/dashboard/zentra/FilterTabs";

const MARKETS: MarketGroup[] = ["USD", "Gold", "Forex", "Nasdaq", "Crypto"];
const MARKET_FILTERS: { value: "ALL" | MarketGroup; label: string }[] = [
  { value: "ALL", label: "All markets" },
  ...MARKETS.map((m) => ({ value: m, label: m })),
];

type View = "foryou" | "all" | "saved";

function parseMarket(v?: string): "ALL" | MarketGroup {
  return MARKETS.find((m) => m === v) ?? "ALL";
}

/** Keeps ?market= in the address bar so filtered views can be shared and reloaded. */
function useUrlMarket(initial?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [market, setMarketState] = useState(parseMarket(initial));
  const setMarket = useCallback(
    (m: "ALL" | MarketGroup) => {
      setMarketState(m);
      router.replace(m === "ALL" ? pathname : `${pathname}?market=${encodeURIComponent(m)}`, { scroll: false });
    },
    [router, pathname],
  );
  return [market, setMarket] as const;
}

function NewsFeed({ kind, initialMarket, initialView }: { kind?: NewsArticle["kind"]; initialMarket?: string; initialView?: string }) {
  const now = useNow();
  const news = useResource(getNews);
  const { prefs } = usePreferences();
  const { saved } = useSavedArticles();
  const [market, setMarket] = useUrlMarket(initialMarket);
  const [chosenView, setView] = useState<View | null>(initialView === "saved" ? "saved" : null);
  const isAnalysis = kind === "analysis";
  const canPersonalise = prefs.markets.length > 0;
  // Default to "For you" once preferences exist, unless a market is picked explicitly.
  const view: View = chosenView ?? (canPersonalise && market === "ALL" ? "foryou" : "all");

  const viewOptions: { value: View; label: string }[] = [
    ...(canPersonalise ? [{ value: "foryou" as const, label: "For you" }] : []),
    { value: "all", label: "All" },
    { value: "saved", label: `Saved${saved.length ? ` (${saved.length})` : ""}` },
  ];

  return (
    <div className="z-page">
      <PageTitle
        title={isAnalysis ? "Market Analysis" : "Latest News"}
        lede={
          isAnalysis
            ? "Longer reads from the desk: levels that matter, what would change the view, and where it's invalidated."
            : "What moved USD, gold, forex, the Nasdaq and crypto, and why it matters for your next trade."
        }
        aside={news.source === "sample" ? <SampleTag /> : undefined}
      />
      <div className="z-toolbar">
        <div className="flex flex-wrap items-center gap-2">
          <FilterTabs label="View" options={viewOptions} value={view} onChange={setView} />
          {view !== "saved" && (
            <>
              <span className="z-toolbar-sep" aria-hidden />
              <FilterTabs label="Market" options={MARKET_FILTERS} value={market} onChange={setMarket} />
            </>
          )}
        </div>
        {!isAnalysis && (
          <Link href="/dashboard/news/calendar" className="z-btn z-btn--ghost">
            <CalendarClock size={14} aria-hidden /> Economic Calendar
          </Link>
        )}
      </div>
      {view === "foryou" && (
        <p className="z-meta -mt-3 flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" aria-hidden /> Showing {listMarkets(prefs.markets)} first.{" "}
          <Link href="/dashboard/account/settings" className="z-link inline-flex !text-xs">
            Change
          </Link>
        </p>
      )}
      <ResourceBody
        resource={news}
        isEmpty={(d) => d.filter((a) => !kind || a.kind === kind).length === 0}
        loading={<Skeleton rows={4} height="9rem" />}
        empty={
          <EmptyState
            icon={Newspaper}
            title={isAnalysis ? "No analysis published yet" : "No news yet"}
            body="New pieces appear here as the desk publishes them."
          />
        }
      >
        {(list) => {
          let filtered = list.filter((a) => !kind || a.kind === kind);
          if (view === "saved") filtered = saved.map((id) => filtered.find((a) => a.id === id)).filter((a): a is NewsArticle => Boolean(a));
          else {
            if (market !== "ALL") filtered = filtered.filter((a) => a.markets.includes(market));
            if (view === "foryou") filtered = rankNews(filtered, prefs);
          }
          if (filtered.length === 0) {
            return view === "saved" ? (
              <EmptyState icon={Bookmark} title="Nothing saved yet" body="Tap the bookmark on any story to keep it here for later." />
            ) : (
              <EmptyState icon={Newspaper} title={`Nothing on ${market} yet`} body="Try another market." />
            );
          }
          const firstOther = view === "foryou" ? filtered.findIndex((a) => !isRelevantArticle(a, prefs.markets)) : -1;
          return (
            <div className="z-news-list z-news-list--page">
              {filtered.map((a, i) => (
                <div key={a.id} className="contents">
                  {i === firstOther && i > 0 && <p className="z-news-divider">Other markets</p>}
                  <NewsCard article={a} now={now} />
                </div>
              ))}
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}

export function LatestNewsView({ initialMarket, initialView }: { initialMarket?: string; initialView?: string }) {
  return <NewsFeed initialMarket={initialMarket} initialView={initialView} />;
}

export function AnalysisView({ initialMarket }: { initialMarket?: string }) {
  return <NewsFeed kind="analysis" initialMarket={initialMarket} />;
}

/* ── Article ──────────────────────────────────────────────────────────────── */

function readingMinutes(a: NewsArticle): number {
  const words = [a.summary, ...a.body].join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function ArticleView({ id }: { id: string }) {
  const now = useNow();
  const news = useResource(getNews);
  const calendar = useResource(getEconomicCalendar);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <div className="z-page">
      <Link href="/dashboard/news" className="z-back">
        <ArrowLeft size={14} aria-hidden /> Market News
      </Link>
      <ResourceBody
        resource={news}
        isEmpty={(list) => !list.some((a) => a.id === id)}
        loading={<Skeleton rows={1} height="20rem" />}
        empty={<EmptyState icon={Newspaper} title="Article not found" body="It may have been moved or unpublished." action={{ href: "/dashboard/news", label: "Back to news" }} />}
      >
        {(list) => {
          const idx = list.findIndex((x) => x.id === id);
          const a = list[idx];
          const newer = list[idx - 1];
          const older = list[idx + 1];
          const related = list.filter((x) => x.id !== id && x.markets.some((m) => a.markets.includes(m))).slice(0, 3);
          const currencies = relevantCurrencies(a.markets);
          const watch = filterEventsByCurrency(calendar.data ?? [], currencies)
            .filter((e) => e.at.getTime() > now && e.impact !== "low")
            .slice(0, 3);
          return (
            <div className="z-split z-split--detail">
              <article className="z-article">
                <div className="flex flex-wrap items-center gap-2">
                  <ImpactBadge impact={a.impact} />
                  {a.markets.map((m) => (
                    <Link key={m} href={marketHref(m)} className="z-chip z-chip--link">
                      {m}
                    </Link>
                  ))}
                  {a.kind === "analysis" && <span className="z-kind">Analysis</span>}
                  {news.source === "sample" && <SampleTag />}
                </div>
                <h1 className="z-article-title">{a.headline}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="z-meta inline-flex items-center gap-1.5">
                    {a.source} · <time dateTime={a.publishedAt.toISOString()}>{timeAgo(a.publishedAt, now)}</time> ·{" "}
                    <Clock3 size={12} aria-hidden /> {readingMinutes(a)} min read
                  </p>
                  <span className="flex gap-2 ml-auto">
                    <SaveButton id={a.id} withLabel />
                    <button type="button" className="z-btn z-btn--ghost" onClick={copyLink}>
                      <Link2 size={14} aria-hidden /> Copy link
                    </button>
                  </span>
                </div>
                <p className="z-article-lede">{a.summary}</p>
                {a.body.map((p, i) => (
                  <p key={i} className="z-article-p">
                    {p}
                  </p>
                ))}
                <nav className="z-article-pager" aria-label="More stories">
                  {older ? (
                    <Link href={`/dashboard/news/${older.id}`} className="z-pager-link">
                      <span className="z-meta inline-flex items-center gap-1">
                        <ArrowLeft size={12} aria-hidden /> Earlier
                      </span>
                      <span className="line-clamp-2">{older.headline}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {newer && (
                    <Link href={`/dashboard/news/${newer.id}`} className="z-pager-link text-right items-end">
                      <span className="z-meta inline-flex items-center gap-1">
                        Newer <ArrowRight size={12} aria-hidden />
                      </span>
                      <span className="line-clamp-2">{newer.headline}</span>
                    </Link>
                  )}
                </nav>
                <p className="z-disclaimer">Market commentary for education. Not a recommendation to buy or sell.</p>
              </article>

              <aside className="flex flex-col gap-6">
                <Section title="What to watch" icon={CalendarClock}>
                  {watch.length === 0 ? (
                    <p className="z-meta">No scheduled {currencies.join("/")} releases coming up.</p>
                  ) : (
                    <div className="z-panel">
                      {watch.map((e) => (
                        <Link key={e.id} href="/dashboard/news/calendar" className="z-lesson-row">
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground truncate">
                              {e.currency} {e.event}
                            </span>
                            <span className="block z-meta">
                              {isSameLocalDay(e.at, new Date(now)) ? "Today" : formatDay(e.at)}, {formatClock(e.at)}
                            </span>
                          </span>
                          <ImpactBadge impact={e.impact} compact />
                        </Link>
                      ))}
                    </div>
                  )}
                </Section>
                {related.length > 0 && (
                  <Section title="Related">
                    <div className="z-news-list">
                      {related.map((r) => (
                        <NewsCard key={r.id} article={r} now={now} dense />
                      ))}
                    </div>
                  </Section>
                )}
              </aside>
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}

/* ── Calendar ─────────────────────────────────────────────────────────────── */

type DayFilter = "today" | "tomorrow" | "week";
const DAY_FILTERS: { value: DayFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This week" },
];
const IMPACT_FILTERS: { value: "ALL" | Impact; label: string }[] = [
  { value: "ALL", label: "All impact" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function CalendarView() {
  const now = useNow(30e3);
  const events = useResource(getEconomicCalendar);
  const { prefs } = usePreferences();
  const myCurrencies = useMemo(() => relevantCurrencies(prefs.markets), [prefs.markets]);
  const [day, setDay] = useState<DayFilter>("week");
  const [impact, setImpact] = useState<"ALL" | Impact>("ALL");
  const [picked, setPicked] = useState<string[] | null>(null);
  // Until the member picks currencies, start from theirs (if they have any).
  const currencies = picked ?? myCurrencies;

  const allCurrencies = useMemo(() => [...new Set((events.data ?? []).map((e) => e.currency))].sort(), [events.data]);
  const toggleCurrency = (c: string) => setPicked((prev) => {
    const base = prev ?? myCurrencies;
    return base.includes(c) ? base.filter((x) => x !== c) : [...base, c];
  });

  return (
    <div className="z-page">
      <PageTitle
        title="Economic Calendar"
        lede="Scheduled releases that move the dollar, gold and indices. Select an event for forecast, previous and why it matters. Times are in your local timezone."
        aside={events.source === "sample" ? <SampleTag /> : undefined}
      />
      <div className="z-toolbar">
        <div className="flex flex-wrap items-center gap-2">
          <FilterTabs label="Day" options={DAY_FILTERS} value={day} onChange={setDay} />
          <span className="z-toolbar-sep" aria-hidden />
          <FilterTabs label="Impact" options={IMPACT_FILTERS} value={impact} onChange={setImpact} />
        </div>
      </div>
      {allCurrencies.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 -mt-3">
          <span className="z-meta mr-1">Currencies</span>
          <div className="z-filters" role="group" aria-label="Currencies">
            {allCurrencies.map((c) => (
              <button key={c} type="button" className="z-filter" aria-pressed={currencies.includes(c)} onClick={() => toggleCurrency(c)}>
                {c}
              </button>
            ))}
          </div>
          {currencies.length > 0 && (
            <button type="button" className="z-link !text-xs" onClick={() => setPicked([])}>
              Show all
            </button>
          )}
          {myCurrencies.length > 0 && picked !== null && (
            <button type="button" className="z-link !text-xs" onClick={() => setPicked(null)}>
              My currencies
            </button>
          )}
        </div>
      )}
      <ResourceBody
        resource={events}
        isEmpty={(d) => d.length === 0}
        loading={<Skeleton rows={6} height="3rem" />}
        empty={<EmptyState icon={CalendarClock} title="Calendar not connected" body="Scheduled releases will appear here once the calendar feed is connected." />}
      >
        {(list) => {
          const today = new Date(now);
          const tomorrow = new Date(now + 24 * 3600e3);
          const filtered = filterEventsByCurrency(list, currencies).filter(
            (e) =>
              (impact === "ALL" || e.impact === impact) &&
              (day === "week" || isSameLocalDay(e.at, day === "today" ? today : tomorrow)),
          );
          return filtered.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No events match" body="Try another day, impact level or currency." />
          ) : (
            <div className="z-panel">
              <EconomicCalendar events={filtered} now={now} />
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}
