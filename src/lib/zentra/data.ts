/**
 * The one place dashboard content comes from. Every function is async and
 * returns `{ data, source }`, so replacing a sample source with a real API is
 * a change to one function body here — no component changes.
 *
 * Sample content is on in development (turn it off with
 * NEXT_PUBLIC_SAMPLE_CONTENT=false to review the empty states) and is never
 * served in a production build. Until a real feed is wired in, production
 * shows each section's empty state rather than invented news or prices.
 */
import * as sample from "./sample-data";
import type {
  CommunityPost,
  Course,
  CourseProgress,
  DashboardNotification,
  EconomicEvent,
  Indicator,
  Lesson,
  MarketAsset,
  NewsArticle,
  Sourced,
} from "./types";

export const SAMPLE_CONTENT =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SAMPLE_CONTENT !== "false";

function fromSample<T>(build: () => T, empty: T): Promise<Sourced<T>> {
  return Promise.resolve(SAMPLE_CONTENT ? { data: build(), source: "sample" } : { data: empty, source: "live" });
}

/* ── Markets ─────────────────────────────────────────────────────────────── */

export function getMarketSnapshot(): Promise<Sourced<MarketAsset[]>> {
  return fromSample(sample.sampleMarkets, []);
}

/* ── Indicators ──────────────────────────────────────────────────────────── */

export function getIndicators(): Promise<Sourced<Indicator[]>> {
  return fromSample(sample.sampleIndicators, []);
}

export async function getIndicator(id: string): Promise<Sourced<Indicator | null>> {
  const { data, source } = await getIndicators();
  return { data: data.find((i) => i.id === id) ?? null, source };
}

/** Ids of the indicators the signed-in member has access to. */
export function getMyIndicatorIds(): Promise<Sourced<string[]>> {
  return fromSample(() => sample.SAMPLE_OWNED_INDICATOR_IDS, []);
}

/** The catalogue together with which entries the member can open. */
export async function getIndicatorAccess(): Promise<Sourced<{ all: Indicator[]; owned: string[] }>> {
  const [all, owned] = await Promise.all([getIndicators(), getMyIndicatorIds()]);
  return { data: { all: all.data, owned: owned.data }, source: all.source };
}

/* ── News & calendar ─────────────────────────────────────────────────────── */

export function getNews(): Promise<Sourced<NewsArticle[]>> {
  return fromSample(() => sample.sampleNews().sort(byNewest((n) => n.publishedAt)), []);
}

export async function getArticle(id: string): Promise<Sourced<NewsArticle | null>> {
  const { data, source } = await getNews();
  return { data: data.find((n) => n.id === id) ?? null, source };
}

export function getEconomicCalendar(): Promise<Sourced<EconomicEvent[]>> {
  return fromSample(() => sample.sampleEvents().sort((a, b) => a.at.getTime() - b.at.getTime()), []);
}

/* ── Education ───────────────────────────────────────────────────────────── */

export type EducationCatalog = {
  courses: Course[];
  lessons: Lesson[];
  progress: CourseProgress[];
  path: string[];
};

export function getEducation(): Promise<Sourced<EducationCatalog>> {
  return fromSample(
    () => ({
      courses: sample.sampleCourses(),
      lessons: sample.sampleLessons(),
      progress: sample.sampleProgress(),
      path: sample.SAMPLE_LEARNING_PATH,
    }),
    { courses: [], lessons: [], progress: [], path: [] },
  );
}

/* ── Community ───────────────────────────────────────────────────────────── */

export function getCommunityFeed(): Promise<Sourced<CommunityPost[]>> {
  return fromSample(() => sample.samplePosts(), []);
}

export function getDiscussions(): Promise<Sourced<CommunityPost[]>> {
  return fromSample(() => sample.sampleThreads(), []);
}

/* ── Notifications ───────────────────────────────────────────────────────── */

/** Derived from the other feeds: fresh high-impact news and upcoming high-impact releases. */
export async function getNotifications(): Promise<Sourced<DashboardNotification[]>> {
  const [news, events] = await Promise.all([getNews(), getEconomicCalendar()]);
  const now = Date.now();
  const items: DashboardNotification[] = [
    ...news.data
      .filter((n) => n.impact === "high" && now - n.publishedAt.getTime() < 24 * 3600e3)
      .slice(0, 3)
      .map((n) => ({
        id: `n-${n.id}`,
        kind: "news" as const,
        title: n.headline,
        body: n.kind === "analysis" ? "New analysis" : "High-impact news",
        href: `/dashboard/news/${n.id}`,
        at: n.publishedAt,
      })),
    ...events.data
      .filter((e) => e.impact === "high" && e.at.getTime() > now && e.at.getTime() - now < 36 * 3600e3)
      .map((e) => ({
        id: `n-${e.id}`,
        kind: "event" as const,
        title: `${e.currency} ${e.event}`,
        body: "High-impact release coming up",
        href: "/dashboard/news/calendar",
        at: e.at,
      })),
  ];
  return { data: items, source: news.source };
}

function byNewest<T>(at: (item: T) => Date) {
  return (a: T, b: T) => at(b).getTime() - at(a).getTime();
}
