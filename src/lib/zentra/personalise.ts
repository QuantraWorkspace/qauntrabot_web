/**
 * Pure ranking helpers for personalisation. Nothing here removes content a
 * member might need — it reorders, and filters only behind an explicit
 * "For you" / "My currencies" toggle the member can switch off.
 */
import type {
  Course,
  EconomicEvent,
  ExperienceLevel,
  MarketAsset,
  MarketGroup,
  NewsArticle,
  Preferences,
} from "./types";

/** Currencies whose releases move each market. */
const CURRENCIES_FOR: Record<MarketGroup, string[]> = {
  Gold: ["USD"],
  Nasdaq: ["USD"],
  Crypto: ["USD"],
  USD: ["USD"],
  Forex: ["USD", "EUR", "GBP", "JPY"],
};

export function relevantCurrencies(markets: MarketGroup[]): string[] {
  return [...new Set(markets.flatMap((m) => CURRENCIES_FOR[m]))];
}

export function isRelevantArticle(article: NewsArticle, markets: MarketGroup[]): boolean {
  return article.markets.some((m) => markets.includes(m));
}

/** Articles on the member's markets first, newest first within each group. */
export function rankNews(articles: NewsArticle[], prefs: Preferences): NewsArticle[] {
  if (prefs.markets.length === 0) return articles;
  const score = (a: NewsArticle) => (isRelevantArticle(a, prefs.markets) ? 1 : 0);
  return [...articles].sort((a, b) => score(b) - score(a) || b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function filterEventsByCurrency(events: EconomicEvent[], currencies: string[]): EconomicEvent[] {
  return currencies.length ? events.filter((e) => currencies.includes(e.currency)) : events;
}

/** Chosen markets first, keeping the feed's order otherwise. */
export function orderMarkets(assets: MarketAsset[], prefs: Preferences): MarketAsset[] {
  if (prefs.markets.length === 0) return assets;
  const hit = (a: MarketAsset) => prefs.markets.includes(a.group) || (a.group === "Gold" && prefs.markets.includes("USD"));
  return [...assets.filter(hit), ...assets.filter((a) => !hit(a))];
}

/**
 * The learning path for a level. Beginners take everything in order.
 * Everyone else skips the pure-beginner foundations course, and advanced
 * traders take the remaining beginner-level courses last, as refreshers.
 */
export function pathForLevel(path: string[], courses: Course[], level: ExperienceLevel | null): string[] {
  if (!level || level === "Beginner") return path;
  const byId = new Map(courses.map((c) => [c.id, c]));
  const kept = path.filter((id) => byId.get(id)?.category !== "Beginner");
  if (level === "Intermediate") return kept;
  const isBasic = (id: string) => byId.get(id)?.level === "Beginner";
  return [...kept.filter((id) => !isBasic(id)), ...kept.filter(isBasic)];
}

/** "Gold and EURUSD" style list for copy. */
export function listMarkets(markets: MarketGroup[]): string {
  const names = markets.map((m) => (m === "Forex" ? "forex" : m === "USD" ? "the dollar" : m));
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
