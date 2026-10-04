"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { getEducation, type EducationCatalog } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { useLessonCompletions, usePreferences } from "@/lib/zentra/hooks";
import { pathForLevel } from "@/lib/zentra/personalise";
import { currentCourse, mergeProgress } from "@/lib/zentra/education";
import type { CourseProgress, ExperienceLevel, LessonCategory, QuizQuestion } from "@/lib/zentra/types";
import { EmptyState, PageTitle, ResourceBody, SampleTag, Section, Skeleton } from "@/components/dashboard/zentra/ui";
import CourseProgressCard, { ProgressBar, courseProgressPct } from "@/components/dashboard/zentra/CourseProgressCard";
import LessonRow from "@/components/dashboard/zentra/LessonRow";
import FilterTabs from "@/components/dashboard/zentra/FilterTabs";
import SessionClock from "@/components/home/SessionClock";

const EMPTY_EDU = (
  <EmptyState icon={BookOpen} title="Courses are on the way" body="Lessons on structure, risk, macro and psychology will appear here once published." />
);

function useEducation() {
  const edu = useResource(getEducation);
  const { completed, toggle } = useLessonCompletions();
  const progress = useMemo(() => (edu.data ? mergeProgress(edu.data, completed) : []), [edu.data, completed]);
  return { edu, progress, completed, toggle };
}

/* ── Courses ──────────────────────────────────────────────────────────────── */

type LevelFilter = "ALL" | ExperienceLevel;
const LEVEL_FILTERS: { value: LevelFilter; label: string }[] = [
  { value: "ALL", label: "All levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];
type CourseSort = "path" | "continue";
const SORTS: { value: CourseSort; label: string }[] = [
  { value: "path", label: "Path order" },
  { value: "continue", label: "In progress first" },
];

export function CoursesView() {
  const { edu, progress } = useEducation();
  const [level, setLevel] = useState<LevelFilter>("ALL");
  const [sort, setSort] = useState<CourseSort>("path");
  return (
    <div className="z-page">
      <PageTitle
        title="Courses"
        lede="Short, practical courses. Each one builds a skill you'll use on the next chart you open."
        aside={edu.source === "sample" ? <SampleTag /> : undefined}
      />
      <ResourceBody
        resource={edu}
        isEmpty={(d) => d.courses.length === 0}
        loading={<Skeleton rows={4} height="12rem" grid="z-card-grid" />}
        empty={EMPTY_EDU}
      >
        {(d) => {
          const current = currentCourse(d, progress);
          return (
            <>
              {current && (
                <Section title="Continue Learning">
                  <CourseProgressCard course={current.course} progress={current.progress} currentLesson={current.lesson} featured />
                </Section>
              )}
              <Section title="All courses">
                <div className="z-toolbar !mb-0">
                  <FilterTabs label="Level" options={LEVEL_FILTERS} value={level} onChange={setLevel} />
                  <FilterTabs label="Sort" options={SORTS} value={sort} onChange={setSort} />
                </div>
                {(() => {
                  const pctOf = (id: string) => {
                    const c = d.courses.find((x) => x.id === id)!;
                    return courseProgressPct(c, progress.find((p) => p.courseId === id));
                  };
                  // "In progress first": started-but-unfinished, then not started, then finished.
                  const rank = (pct: number) => (pct > 0 && pct < 100 ? 0 : pct === 0 ? 1 : 2);
                  let list = d.courses.filter((c) => level === "ALL" || c.level === level);
                  const order = d.path.length ? d.path : d.courses.map((c) => c.id);
                  list = [...list].sort((a, b) =>
                    sort === "continue"
                      ? rank(pctOf(a.id)) - rank(pctOf(b.id)) || pctOf(b.id) - pctOf(a.id)
                      : order.indexOf(a.id) - order.indexOf(b.id),
                  );
                  return list.length === 0 ? (
                    <EmptyState icon={BookOpen} title={`No ${level.toLowerCase()} courses yet`} body="Try another level." />
                  ) : (
                    <div className="z-card-grid">
                      {list.map((c) => (
                        <CourseProgressCard key={c.id} course={c} progress={progress.find((p) => p.courseId === c.id)} />
                      ))}
                    </div>
                  );
                })()}
              </Section>
            </>
          );
        }}
      </ResourceBody>
    </div>
  );
}

/* ── Lessons ──────────────────────────────────────────────────────────────── */

const CATEGORY_FILTERS: { value: "ALL" | LessonCategory; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "Beginner", label: "Beginner" },
  { value: "Technical Analysis", label: "Technical Analysis" },
  { value: "ICT", label: "ICT" },
  { value: "Fundamentals", label: "Fundamentals" },
  { value: "Risk Management", label: "Risk Management" },
  { value: "Psychology", label: "Psychology" },
];

export function LessonsView({ initialCategory }: { initialCategory?: string }) {
  const { edu, progress } = useEducation();
  const [category, setCategory] = useState<"ALL" | LessonCategory>(
    CATEGORY_FILTERS.find((c) => c.value === initialCategory)?.value ?? "ALL",
  );
  const done = new Set(progress.flatMap((p) => p.completedLessonIds));

  return (
    <div className="z-page">
      <PageTitle
        title="Lessons"
        lede="Every lesson, by topic. Most take under fifteen minutes."
        aside={edu.source === "sample" ? <SampleTag /> : undefined}
      />
      <FilterTabs label="Category" options={CATEGORY_FILTERS} value={category} onChange={setCategory} />
      <ResourceBody resource={edu} isEmpty={(d) => d.lessons.length === 0} loading={<Skeleton rows={6} height="3.5rem" />} empty={EMPTY_EDU}>
        {(d) => {
          const list = d.lessons.filter((l) => category === "ALL" || l.category === category);
          return list.length === 0 ? (
            <EmptyState icon={BookOpen} title="No lessons in this category yet" body="Try another topic." />
          ) : (
            <div className="z-panel">
              {list.map((l) => (
                <LessonRow key={l.id} lesson={l} done={done.has(l.id)} />
              ))}
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}

/* ── Lesson ───────────────────────────────────────────────────────────────── */

function lessonContext(d: EducationCatalog, id: string) {
  const lesson = d.lessons.find((l) => l.id === id);
  if (!lesson) return null;
  const course = d.courses.find((c) => c.id === lesson.courseId);
  const idx = course?.lessonIds.indexOf(id) ?? -1;
  const nextId = course && idx >= 0 ? course.lessonIds[idx + 1] : undefined;
  const prevId = course && idx > 0 ? course.lessonIds[idx - 1] : undefined;
  return {
    lesson,
    course,
    index: idx,
    next: nextId ? d.lessons.find((l) => l.id === nextId) : undefined,
    prev: prevId ? d.lessons.find((l) => l.id === prevId) : undefined,
  };
}

function LessonQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const finished = Object.keys(answers).length === questions.length;
  return (
    <section className="z-panel z-panel--pad" aria-labelledby="quiz-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="quiz-title" className="text-sm font-semibold text-foreground">
          Check your understanding
        </h2>
        {finished && (
          <span className="z-meta" role="status">
            {correct} of {questions.length} correct
          </span>
        )}
      </div>
      {questions.map((q, qi) => {
        const picked = answers[qi];
        const answered = picked !== undefined;
        return (
          <div key={qi} className="z-quiz-q">
          <fieldset className="z-quiz-fs">
            <legend className="text-sm text-foreground mb-2">
              {qi + 1}. {q.question}
            </legend>
            <div className="flex flex-col gap-1.5">
              {q.options.map((o, oi) => {
                const state = !answered ? undefined : oi === q.answer ? "right" : oi === picked ? "wrong" : undefined;
                return (
                  <label key={oi} className="z-quiz-opt" data-state={state} data-locked={answered || undefined}>
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      className="sr-only"
                      checked={picked === oi}
                      disabled={answered}
                      onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    />
                    <span className="z-quiz-mark" aria-hidden>
                      {state === "right" ? <Check size={12} /> : state === "wrong" ? <X size={12} /> : null}
                    </span>
                    <span>{o}</span>
                    {state === "right" && <span className="sr-only"> (correct answer)</span>}
                    {state === "wrong" && <span className="sr-only"> (your answer, incorrect)</span>}
                  </label>
                );
              })}
            </div>
            {answered && (
              <p className="z-quiz-why" role="status">
                <b>{picked === q.answer ? "Right." : "Not quite."}</b> {q.explanation}
              </p>
            )}
          </fieldset>
          </div>
        );
      })}
      {finished && (
        <button type="button" className="z-link w-fit" onClick={() => setAnswers({})}>
          <RotateCcw size={13} aria-hidden /> Try again
        </button>
      )}
    </section>
  );
}

function CourseOutline({ d, courseId, currentId, progress }: { d: EducationCatalog; courseId: string; currentId: string; progress: CourseProgress[] }) {
  const course = d.courses.find((c) => c.id === courseId)!;
  return (
    <>
      {course.lessonIds.map((lid) => {
        const l = d.lessons.find((x) => x.id === lid);
        if (!l) return null;
        return (
          <div key={lid} data-current={lid === currentId || undefined} className="z-lesson-current">
            <LessonRow lesson={l} done={progress.some((p) => p.completedLessonIds.includes(lid))} />
          </div>
        );
      })}
    </>
  );
}

export function LessonView({ id }: { id: string }) {
  const router = useRouter();
  const { edu, progress, completed, toggle } = useEducation();
  const { prefs } = usePreferences();
  const done = progress.some((p) => p.completedLessonIds.includes(id));
  // Completion recorded on the server can't be undone from here; a local one can.
  const canToggle = !done || completed.includes(id);
  const ctx = edu.data ? lessonContext(edu.data, id) : null;
  const prevId = ctx?.prev?.id;
  const nextId = ctx?.next?.id;

  // ← / → move between lessons in the course, unless the reader is typing or choosing an answer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      // Enabled form fields keep their own arrow-key behaviour (text caret, radio choice).
      const field = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;
      if ((field && !(t as HTMLInputElement).disabled) || t.isContentEditable) return;
      if (e.key === "ArrowLeft" && prevId) router.push(`/dashboard/learn/lessons/${prevId}`);
      if (e.key === "ArrowRight" && nextId) router.push(`/dashboard/learn/lessons/${nextId}`);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router, prevId, nextId]);

  return (
    <div className="z-page">
      <Link href="/dashboard/learn/lessons" className="z-back">
        <ArrowLeft size={14} aria-hidden /> Lessons
      </Link>
      <ResourceBody
        resource={edu}
        isEmpty={(d) => !lessonContext(d, id)}
        loading={<Skeleton rows={1} height="20rem" />}
        empty={<EmptyState icon={BookOpen} title="Lesson not found" body="It may have been moved." action={{ href: "/dashboard/learn/lessons", label: "All lessons" }} />}
      >
        {(d) => {
          const { lesson, course, index, next, prev } = lessonContext(d, id)!;
          const courseProgress = course ? progress.find((p) => p.courseId === course.id) : undefined;
          const pct = course ? courseProgressPct(course, courseProgress) : 0;
          const courseDone = Boolean(course) && pct === 100;
          const path = pathForLevel(d.path, d.courses, prefs.level);
          const nextCourse = course
            ? path
                .map((cid) => d.courses.find((c) => c.id === cid))
                .find((c) => c && c.id !== course.id && courseProgressPct(c, progress.find((p) => p.courseId === c.id)) < 100)
            : undefined;
          return (
            <div className="z-split z-split--detail">
              <article className="z-article" key={lesson.id}>
                {course && (
                  <details className="z-outline lg:hidden">
                    <summary>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground truncate">{course.title}</span>
                        <span className="block z-meta">
                          Lesson {index + 1} of {course.lessonIds.length} · {pct}% complete
                        </span>
                      </span>
                      <ChevronDown size={16} className="z-outline-chev" aria-hidden />
                    </summary>
                    <div className="z-panel !rounded-t-none !border-t-0">
                      <CourseOutline d={d} courseId={course.id} currentId={id} progress={progress} />
                    </div>
                  </details>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="z-kind">{lesson.category}</span>
                  <span className="z-meta inline-flex items-center gap-1">
                    <Clock3 size={12} aria-hidden /> {lesson.minutes} min
                  </span>
                  {edu.source === "sample" && <SampleTag />}
                </div>
                {course && (
                  <p className="z-meta hidden lg:block">
                    {course.title} · Lesson {index + 1} of {course.lessonIds.length}
                  </p>
                )}
                <h1 className="z-article-title">{lesson.title}</h1>
                <p className="z-article-lede">{lesson.summary}</p>
                <div className="z-panel z-panel--pad">
                  <p className="z-panel-label">Key points</p>
                  <ul className="z-keypoints">
                    {lesson.keyPoints.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
                {lesson.quiz && lesson.quiz.length > 0 && <LessonQuiz questions={lesson.quiz} />}

                {courseDone && course ? (
                  <div className="z-complete" role="status">
                    <Trophy size={22} className="text-primary" aria-hidden />
                    <p className="text-base font-semibold text-foreground">You&apos;ve completed {course.title}.</p>
                    {nextCourse ? (
                      <>
                        <p className="text-sm text-muted-foreground">Next on your path: {nextCourse.title}.</p>
                        <Link href={`/dashboard/learn/lessons/${nextCourse.lessonIds[0]}`} className="z-btn z-btn--primary w-fit">
                          Start {nextCourse.title} <ArrowRight size={14} aria-hidden />
                        </Link>
                      </>
                    ) : (
                      <Link href="/dashboard/learn" className="z-btn z-btn--ghost w-fit">
                        Browse all courses
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="button"
                      className={`z-btn ${done ? "z-btn--ghost" : "z-btn--primary"}`}
                      onClick={() => toggle(lesson.id)}
                      aria-pressed={done}
                      disabled={!canToggle}
                    >
                      {done ? <CheckCircle2 size={15} aria-hidden /> : <Circle size={15} aria-hidden />}
                      {done ? "Completed" : "Mark as complete"}
                    </button>
                    {next && (
                      <Link href={`/dashboard/learn/lessons/${next.id}`} className="z-btn z-btn--ghost">
                        Next: {next.title} <ArrowRight size={14} aria-hidden />
                      </Link>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {prev ? (
                    <Link href={`/dashboard/learn/lessons/${prev.id}`} className="z-link">
                      <ArrowLeft size={13} aria-hidden /> Previous: {prev.title}
                    </Link>
                  ) : (
                    <span />
                  )}
                  {(prev || next) && (
                    <span className="z-meta hidden md:inline">
                      Tip: use <kbd className="z-kbd-inline">←</kbd> <kbd className="z-kbd-inline">→</kbd> to move between lessons
                    </span>
                  )}
                </div>
              </article>

              {course && (
                <aside className="z-panel h-fit hidden lg:flex">
                  <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
                    <p className="text-sm font-semibold text-foreground">{course.title}</p>
                    <div className="flex items-center gap-3">
                      <ProgressBar pct={pct} label={`${course.title} progress`} />
                      <span className="z-pct">{pct}%</span>
                    </div>
                  </div>
                  <CourseOutline d={d} courseId={course.id} currentId={id} progress={progress} />
                </aside>
              )}
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}

/* ── Learning path ────────────────────────────────────────────────────────── */

export function PathView() {
  const { edu, progress } = useEducation();
  const { prefs } = usePreferences();
  const [showFull, setShowFull] = useState(false);
  const level = showFull ? null : prefs.level;
  return (
    <div className="z-page">
      <PageTitle
        title="Learning Path"
        lede="The order we'd take the courses in: read a chart, protect the account, then learn the structure model and the macro behind the moves."
        aside={edu.source === "sample" ? <SampleTag /> : undefined}
      />
      <ResourceBody resource={edu} isEmpty={(d) => d.courses.length === 0} loading={<Skeleton rows={5} height="6rem" />} empty={EMPTY_EDU}>
        {(d) => {
          const base = d.path.length ? d.path : d.courses.map((c) => c.id);
          const path = pathForLevel(base, d.courses, level);
          const tailored = path.join() !== base.join();
          return (
          <>
          {(tailored || showFull) && prefs.level && (
            <p className="z-meta flex flex-wrap items-center gap-2 -mt-3">
              <Sparkles size={12} className="text-primary" aria-hidden />
              {showFull ? "Showing the full path." : `Tailored for ${prefs.level.toLowerCase()} traders — ${base.length - path.length ? "foundations skipped" : "refreshers moved to the end"}.`}
              <button type="button" className="z-link !text-xs" onClick={() => setShowFull((v) => !v)}>
                {showFull ? `Use my ${prefs.level.toLowerCase()} path` : "Show full path"}
              </button>
            </p>
          )}
          <ol className="z-path">
            {path.map((cid, i) => {
              const c = d.courses.find((x) => x.id === cid);
              if (!c) return null;
              const p = progress.find((x) => x.courseId === c.id);
              const pct = courseProgressPct(c, p);
              return (
                <li key={c.id} className="z-path-step" data-state={pct === 100 ? "done" : pct > 0 ? "current" : "todo"}>
                  <span className="z-path-mark" aria-hidden>
                    {pct === 100 ? <CheckCircle2 size={16} /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="z-path-body">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="z-kind">{c.category}</span>
                      <span className="z-meta">
                        {c.level} · {c.lessonIds.length} lessons
                      </span>
                    </div>
                    <h3 className="z-course-title">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-3 max-w-sm">
                      <ProgressBar pct={pct} label={`${c.title} progress`} />
                      <span className="z-pct">{pct}%</span>
                    </div>
                    <Link href={`/dashboard/learn/lessons/${p?.currentLessonId ?? c.lessonIds[0]}`} className="z-link w-fit">
                      {pct === 100 ? "Review" : pct > 0 ? "Continue" : "Start"} <ArrowRight size={13} aria-hidden />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
          </>
          );
        }}
      </ResourceBody>
    </div>
  );
}

/* ── Resources ────────────────────────────────────────────────────────────── */

/** Contract value per 1.0 lot per 1.0 price move, in USD, for USD-quoted symbols. */
const INSTRUMENTS = [
  { id: "XAUUSD", label: "XAUUSD (Gold)", perPoint: 100 },
  { id: "EURUSD", label: "EURUSD", perPoint: 100000 },
  { id: "GBPUSD", label: "GBPUSD", perPoint: 100000 },
  { id: "NAS100", label: "NAS100 (typical CFD)", perPoint: 1 },
] as const;

function PositionSizeCalculator() {
  const [balance, setBalance] = useState("5000");
  const [riskPct, setRiskPct] = useState("1");
  const [instrument, setInstrument] = useState<(typeof INSTRUMENTS)[number]["id"]>("XAUUSD");
  const [entry, setEntry] = useState("2642.5");
  const [stop, setStop] = useState("2632");

  const inst = INSTRUMENTS.find((i) => i.id === instrument)!;
  const b = Number(balance);
  const r = Number(riskPct);
  const distance = Math.abs(Number(entry) - Number(stop));
  const valid = b > 0 && r > 0 && r <= 100 && distance > 0 && Number.isFinite(distance);
  const riskAmount = valid ? (b * r) / 100 : 0;
  const lots = valid ? riskAmount / (distance * inst.perPoint) : 0;

  const field = (id: string, label: string, value: string, set: (v: string) => void, step = "any") => (
    <div className="z-field">
      <label htmlFor={id} className="z-field-label">
        {label}
      </label>
      <input id={id} className="z-input" inputMode="decimal" type="number" step={step} min="0" value={value} onChange={(e) => set(e.target.value)} />
    </div>
  );

  return (
    <div className="z-panel z-panel--pad">
      <div className="grid sm:grid-cols-2 gap-4">
        {field("calc-balance", "Account balance (USD)", balance, setBalance)}
        {field("calc-risk", "Risk per trade (%)", riskPct, setRiskPct, "0.1")}
        <div className="z-field sm:col-span-2">
          <label htmlFor="calc-inst" className="z-field-label">
            Instrument
          </label>
          <select id="calc-inst" className="z-input" value={instrument} onChange={(e) => setInstrument(e.target.value as typeof instrument)}>
            {INSTRUMENTS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        {field("calc-entry", "Entry price", entry, setEntry)}
        {field("calc-stop", "Stop loss", stop, setStop)}
      </div>
      <div className="z-calc-out" aria-live="polite">
        <div>
          <p className="z-meta">Amount at risk</p>
          <p className="z-calc-figure">{valid ? `$${riskAmount.toFixed(2)}` : "—"}</p>
        </div>
        <div>
          <p className="z-meta">Position size</p>
          <p className="z-calc-figure text-primary">{valid ? `${lots.toFixed(2)} lots` : "—"}</p>
        </div>
      </div>
      <p className="z-meta">
        Assumes standard contract sizes (100 oz gold, 100,000 units FX, $1 per point on NAS100). Brokers differ — check your
        contract specification before trading.
      </p>
    </div>
  );
}

const GLOSSARY: [string, string][] = [
  ["BOS", "Break of structure: price closes beyond the last swing in the direction of the trend."],
  ["CHoCH", "Change of character: the first break against the prevailing trend."],
  ["FVG", "Fair value gap: a three-candle imbalance where price moved too fast to trade both sides."],
  ["Order block", "The last opposing candle before a strong move, often revisited as an entry zone."],
  ["Liquidity", "Clusters of resting orders, usually above equal highs or below equal lows."],
  ["RR", "Risk-to-reward: the distance to target divided by the distance to stop."],
  ["Killzone", "The high-volume windows around the London and New York opens."],
  ["Premium / discount", "Above or below the midpoint of a range. Sell in premium, buy in discount."],
];

export function ResourcesView() {
  return (
    <div className="z-page">
      <PageTitle title="Resources" lede="Tools and references to keep open while you trade." />
      <div className="z-split z-split--even">
        <Section title="Position size calculator" icon={Calculator}>
          <PositionSizeCalculator />
        </Section>
        <Section title="Market sessions" icon={Clock3}>
          <div className="z-panel z-panel--pad">
            <SessionClock />
          </div>
        </Section>
      </div>
      <Section title="Glossary" icon={BookOpen}>
        <dl className="z-glossary">
          {GLOSSARY.map(([term, def]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
