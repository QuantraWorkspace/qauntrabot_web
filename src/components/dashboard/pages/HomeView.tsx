"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, GraduationCap, MessagesSquare, Newspaper, Sparkles, TrendingUp, X } from "lucide-react";
import { getCommunityFeed, getEconomicCalendar, getEducation, getMarketSnapshot, getNews } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { useLessonCompletions, useMemberName, useNow, usePreferences } from "@/lib/zentra/hooks";
import { filterEventsByCurrency, listMarkets, orderMarkets, pathForLevel, rankNews, relevantCurrencies } from "@/lib/zentra/personalise";
import { currentCourse, mergeProgress, recommendedLessons } from "@/lib/zentra/education";
import { greeting, sessionLine } from "@/lib/zentra/format";
import type { LessonCategory } from "@/lib/zentra/types";
import { EmptyState, ResourceBody, Section, Skeleton } from "@/components/dashboard/zentra/ui";
import MarketCard from "@/components/dashboard/zentra/MarketCard";
import NewsCard from "@/components/dashboard/zentra/NewsCard";
import EconomicCalendar from "@/components/dashboard/zentra/EconomicCalendar";
import CourseProgressCard, { ProgressBar, courseProgressPct } from "@/components/dashboard/zentra/CourseProgressCard";
import PostCard from "@/components/dashboard/zentra/PostCard";
import LessonRow from "@/components/dashboard/zentra/LessonRow";
import NextEventStrip from "@/components/dashboard/zentra/NextEventStrip";
import FilterTabs from "@/components/dashboard/zentra/FilterTabs";

const noop = () => () => {};

/** True only after hydration, so time-of-day text never mismatches the server render. */
function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const TOPICS: LessonCategory[] = ["Beginner", "Technical Analysis", "ICT", "Fundamentals", "Risk Management", "Psychology"];

function Greeting() {
  const hydrated = useHydrated();
  const name = useMemberName();
  const now = useNow();
  const date = new Date(now);
  const { prefs } = usePreferences();
  const focus = listMarkets(prefs.markets);

  return (
    <div className="z-greeting">
      <div className="min-w-0">
        <h1 className="z-greeting-title">
          {hydrated ? greeting(date.getHours()) : "Welcome back"}, {name}
        </h1>
        <p className="z-greeting-sub">
          {focus ? `Here's what's moving ${focus} today, and what to learn next.` : "Here's what's moving the market, and what to learn next."}
        </p>
      </div>
      {hydrated && (
        <p className="z-greeting-meta">
          <span className="z-live-dot" aria-hidden />
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          <span className="z-meta-sep" aria-hidden>·</span>
          {sessionLine(date)}
        </p>
      )}
    </div>
  );
}

function PersonaliseBanner() {
  const { prefs, update } = usePreferences();
  if (prefs.done) return null;
  return (
    <div className="z-banner" role="region" aria-label="Personalise your dashboard">
      <span className="z-request-cta-icon" aria-hidden>
        <Sparkles size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Personalise your dashboard</p>
        <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
          Three quick questions put your markets&apos; news first and start your learning path at the right level.
        </p>
      </div>
      <Link href="/dashboard/welcome" className="z-btn z-btn--primary shrink-0">
        Get started
      </Link>
      <button type="button" className="z-icon-btn" aria-label="Dismiss" onClick={() => update({ done: true })}>
        <X size={15} aria-hidden />
      </button>
    </div>
  );
}

export default function HomeView() {
  const now = useNow();
  const name = useMemberName();
  const markets = useResource(getMarketSnapshot);
  const news = useResource(getNews);
  const calendar = useResource(getEconomicCalendar);
  const education = useResource(getEducation);
  const feed = useResource(getCommunityFeed);
  const { completed, countSince } = useLessonCompletions();
  const thisWeek = countSince(now);
  const { prefs } = usePreferences();
  const hasMarkets = prefs.markets.length > 0;
  const myCurrencies = useMemo(() => relevantCurrencies(prefs.markets), [prefs.markets]);
  const [newsView, setNewsView] = useState<"foryou" | "all">("foryou");
  const [calView, setCalView] = useState<"mine" | "all">("mine");

  const learning = useMemo(() => {
    if (!education.data) return null;
    const progress = mergeProgress(education.data, completed);
    const current = currentCourse(education.data, progress);
    const inProgress = progress
      .map((p) => ({ p, course: education.data!.courses.find((c) => c.id === p.courseId) }))
      .filter((x) => x.course && x.course.id !== current?.course.id)
      .map((x) => ({ course: x.course!, pct: courseProgressPct(x.course!, x.p) }))
      .filter((x) => x.pct < 100);
    const topicCounts = new Map<LessonCategory, number>();
    for (const l of education.data.lessons) topicCounts.set(l.category, (topicCounts.get(l.category) ?? 0) + 1);
    const path = pathForLevel(education.data.path, education.data.courses, prefs.level);
    return {
      current,
      inProgress,
      topicCounts,
      recommended: recommendedLessons(education.data, progress, 4, { path, topics: prefs.topics }),
    };
  }, [education.data, completed, prefs.level, prefs.topics]);

  return (
    <div className="z-page z-home">
      <Greeting />
      <PersonaliseBanner />

      <Section title="Market Snapshot" icon={TrendingUp} source={markets.source} id="markets">
        <ResourceBody
          resource={markets}
          isEmpty={(d) => d.length === 0}
          loading={<Skeleton rows={6} height="7.5rem" grid="z-market-grid" />}
          empty={<EmptyState icon={TrendingUp} title="Prices aren't connected yet" body="The snapshot fills in once a market data feed is connected." />}
        >
          {(assets) => (
            <div className="z-market-grid">
              {orderMarkets(assets, prefs).map((a) => (
                <MarketCard key={a.symbol} asset={a} />
              ))}
            </div>
          )}
        </ResourceBody>
      </Section>

      {calendar.data && <NextEventStrip events={calendar.data} now={now} />}

      {/* News and the calendar lead the page. */}
      <div className="z-split z-split--news">
        <Section title="Market News" icon={Newspaper} source={news.source} action={{ href: "/dashboard/news", label: "All news" }} id="news">
          <ResourceBody
            resource={news}
            isEmpty={(d) => d.length === 0}
            loading={<Skeleton rows={4} height="8rem" />}
            empty={<EmptyState icon={Newspaper} title="No news yet" body="Market news and desk analysis will appear here as it's published." />}
          >
            {(list) => {
              const ordered = hasMarkets && newsView === "foryou" ? rankNews(list, prefs) : list;
              return (
                <>
                  {hasMarkets && (
                    <FilterTabs
                      label="News view"
                      options={[
                        { value: "foryou", label: "For you" },
                        { value: "all", label: "All" },
                      ]}
                      value={newsView}
                      onChange={setNewsView}
                    />
                  )}
                  <div className="z-news-list">
                    {ordered.slice(0, 5).map((a, i) => (
                      <NewsCard key={a.id} article={a} now={now} lead={i === 0} dense={i > 2} />
                    ))}
                  </div>
                </>
              );
            }}
          </ResourceBody>
        </Section>

        <Section
          title="Economic Calendar"
          icon={CalendarClock}
          source={calendar.source}
          action={{ href: "/dashboard/news/calendar", label: "Full week" }}
          id="calendar"
        >
          <ResourceBody
            resource={calendar}
            isEmpty={(d) => d.length === 0}
            loading={<Skeleton rows={6} height="2.75rem" />}
            empty={<EmptyState icon={CalendarClock} title="Calendar not connected" body="Scheduled releases appear here once the calendar feed is connected." />}
          >
            {(events) => {
              const scoped = hasMarkets && calView === "mine" ? filterEventsByCurrency(events, myCurrencies) : events;
              const upcoming = scoped.filter((e) => e.at.getTime() > now - 2 * 3600e3).slice(0, 7);
              return (
                <>
                  {hasMarkets && (
                    <FilterTabs
                      label="Calendar view"
                      options={[
                        { value: "mine", label: "My currencies" },
                        { value: "all", label: "All" },
                      ]}
                      value={calView}
                      onChange={setCalView}
                    />
                  )}
                  {upcoming.length ? (
                    <div className="z-panel">
                      <EconomicCalendar events={upcoming} now={now} compact />
                    </div>
                  ) : (
                    <EmptyState icon={CalendarClock} title="Nothing scheduled" body="No upcoming releases for these currencies." />
                  )}
                </>
              );
            }}
          </ResourceBody>
          <Link href="/dashboard/news/analysis" className="z-request-cta">
            <span className="z-request-cta-icon" aria-hidden>
              <Newspaper size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">Market Analysis</span>
              <span className="block text-[0.8125rem] text-muted-foreground leading-snug mt-0.5">
                Desk reads on the levels that matter and what would change the view.
              </span>
            </span>
            <ArrowRight size={16} className="ml-auto shrink-0 text-muted-foreground" aria-hidden />
          </Link>
        </Section>
      </div>

      {/* Education: where you are, what's next, and every topic. */}
      <ResourceBody
        resource={education}
        isEmpty={(d) => d.courses.length === 0}
        loading={<Skeleton rows={2} height="10rem" grid="z-split z-split--even" />}
        empty={
          <Section title="Continue Learning" icon={BookOpen} source={education.source}>
            <EmptyState icon={BookOpen} title="Courses are on the way" body="Lessons on structure, risk, macro and psychology will appear here once published." />
          </Section>
        }
      >
        {() =>
          learning && (
            <div className="z-split z-split--even">
              <Section
                title="Continue Learning"
                icon={BookOpen}
                source={education.source}
                action={{ href: "/dashboard/learn", label: "All courses" }}
                id="learning"
              >
                {thisWeek > 0 && (
                  <p className="z-streak">
                    <b>{thisWeek}</b> {thisWeek === 1 ? "lesson" : "lessons"} completed this week
                  </p>
                )}
                {learning.current ? (
                  <CourseProgressCard
                    course={learning.current.course}
                    progress={learning.current.progress}
                    currentLesson={learning.current.lesson}
                    featured
                  />
                ) : (
                  <EmptyState
                    icon={GraduationCap}
                    title="Pick your first course"
                    body="The learning path suggests where to start."
                    action={{ href: "/dashboard/learn/path", label: "Learning Path" }}
                  />
                )}
                {learning.inProgress.length > 0 && (
                  <div className="z-panel">
                    <p className="z-panel-label">Also in progress</p>
                    {learning.inProgress.map(({ course, pct }) => (
                      <Link key={course.id} href="/dashboard/learn" className="z-lesson-row">
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground truncate">{course.title}</span>
                          <span className="flex items-center gap-3 mt-1.5">
                            <ProgressBar pct={pct} label={`${course.title} progress`} />
                            <span className="z-pct !min-w-0">{pct}%</span>
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>

              <Section
                title={prefs.level ? `Up Next · ${prefs.level}` : "Up Next"}
                icon={GraduationCap}
                action={{ href: "/dashboard/learn/path", label: "Learning Path" }}
                id="up-next"
              >
                {learning.recommended.length > 0 ? (
                  <div className="z-panel">
                    {learning.recommended.map((l, i) => (
                      <LessonRow key={l.id} lesson={l} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={GraduationCap} title="You're all caught up" body="Every lesson on your path is complete. New ones will appear here." />
                )}
                <div>
                  <p className="z-meta mb-2">Browse by topic</p>
                  <div className="z-topics">
                    {TOPICS.filter((t) => learning.topicCounts.get(t)).map((t) => (
                      <Link key={t} href={`/dashboard/learn/lessons?category=${encodeURIComponent(t)}`} className="z-topic">
                        <span>{t}</span>
                        <span className="z-meta">
                          {learning.topicCounts.get(t)} {learning.topicCounts.get(t) === 1 ? "lesson" : "lessons"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          )
        }
      </ResourceBody>

      <Section
        title="Community"
        icon={MessagesSquare}
        source={feed.source}
        action={{ href: "/dashboard/community", label: "Open feed" }}
        id="community"
      >
        <ResourceBody
          resource={feed}
          isEmpty={(d) => d.length === 0}
          loading={<Skeleton rows={2} height="10rem" grid="z-split z-split--even" />}
          empty={<EmptyState icon={MessagesSquare} title="It's quiet in here" body="Posts from other members will show up here." />}
        >
          {(posts) => (
            <div className="z-split z-split--even !gap-3">
              {posts.slice(0, 2).map((p) => (
                <PostCard key={p.id} post={p} now={now} viewerName={name} />
              ))}
            </div>
          )}
        </ResourceBody>
      </Section>

      <p className="z-disclaimer">
        News, analysis and lessons on Zentra are for education. They are not financial advice or a recommendation to trade.
        Trading carries a high risk of loss.
      </p>
    </div>
  );
}
