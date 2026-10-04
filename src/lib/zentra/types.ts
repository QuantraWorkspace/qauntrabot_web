/**
 * Domain models for the member dashboard: news, education, community and
 * indicators. UI components depend only on these types and on
 * `@/lib/zentra/data` — never on where the data came from.
 */

export type MarketGroup = "Gold" | "Forex" | "Nasdaq" | "Crypto" | "USD";
export type Timeframe = "1M" | "5M" | "15M" | "1H" | "4H" | "D";
export type Bias = "bullish" | "bearish" | "neutral";
export type Impact = "high" | "medium" | "low";

/** Where a result came from. Sample content is labelled wherever it renders. */
export type DataSource = "sample" | "live";
export type Sourced<T> = { data: T; source: DataSource };

export interface User {
  uid: string;
  email: string;
  displayName: string;
  membership: "free" | "active" | "expired";
  memberSince: Date | null;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  group: MarketGroup;
  price: number;
  /** Percent change on the day, e.g. 0.42 for +0.42%. */
  changePct: number;
  bias: Bias;
  /** Recent closes, oldest first, for the sparkline. */
  history: number[];
  /** Decimal places to show for this instrument. */
  digits: number;
}

export interface Indicator {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** How the indicator works, in plain steps. */
  method: string[];
  markets: MarketGroup[];
  timeframes: Timeframe[];
  platform: "TradingView";
  /** Invite link once access is granted. Absent until there is a real one. */
  accessUrl?: string;
  status: "active" | "beta" | "coming-soon";
}

export type IndicatorRequestStatus = "PENDING" | "REVIEWING" | "APPROVED" | "COMPLETED";
export type TradingStyle = "Scalping" | "Intraday" | "Swing";
export type RequestMarket = "Gold" | "Forex" | "Nasdaq" | "Crypto" | "Other";

export interface IndicatorRequest {
  id: string;
  /** "access" asks for an existing indicator; "custom" asks for a new one. */
  kind: "access" | "custom";
  indicatorId?: string;
  indicatorName?: string;
  market?: RequestMarket;
  style?: TradingStyle;
  timeframes: Timeframe[];
  details: string;
  status: IndicatorRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsArticle {
  id: string;
  kind: "news" | "analysis";
  headline: string;
  source: string;
  publishedAt: Date;
  markets: MarketGroup[];
  impact: Impact;
  summary: string;
  /** Body paragraphs for the reading view. */
  body: string[];
}

export interface EconomicEvent {
  id: string;
  at: Date;
  event: string;
  currency: string;
  impact: Impact;
  forecast?: string;
  previous?: string;
  actual?: string;
  /** Why traders watch it, and which markets it tends to move. */
  whyItMatters: string;
  affects: string[];
}

export type LessonCategory =
  | "Beginner"
  | "Technical Analysis"
  | "ICT"
  | "Fundamentals"
  | "Risk Management"
  | "Psychology";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  category: LessonCategory;
  minutes: number;
  summary: string;
  keyPoints: string[];
  /** Short self-check shown after the key points. */
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  category: LessonCategory;
  level: ExperienceLevel;
  description: string;
  lessonIds: string[];
}

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
}

export interface CommunityPost {
  id: string;
  author: { name: string; handle: string };
  body: string;
  symbol?: string;
  /** Closes for an attached chart, oldest first. */
  chart?: { points: number[]; label: string };
  likes: number;
  comments: { author: string; body: string }[];
  createdAt: Date;
  topic: "Setups" | "Education" | "Macro" | "Psychology";
  /** Discussions have a title and live in the threads view. */
  thread?: { title: string };
}

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

/** What the member told us in onboarding. Drives ranking, never hides content outright. */
export interface Preferences {
  markets: MarketGroup[];
  level: ExperienceLevel | null;
  topics: LessonCategory[];
  /** Onboarding finished or skipped — stop prompting. */
  done: boolean;
}

export interface DashboardNotification {
  id: string;
  kind: "news" | "event" | "request" | "lesson";
  title: string;
  body: string;
  href: string;
  at: Date;
}
