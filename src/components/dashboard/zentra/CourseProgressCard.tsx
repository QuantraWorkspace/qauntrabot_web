import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course, CourseProgress, Lesson } from "@/lib/zentra/types";

export function courseProgressPct(course: Course, progress?: CourseProgress): number {
  if (!progress || course.lessonIds.length === 0) return 0;
  const done = progress.completedLessonIds.filter((id) => course.lessonIds.includes(id)).length;
  return Math.round((done / course.lessonIds.length) * 100);
}

export function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="z-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

type Props = {
  course: Course;
  progress?: CourseProgress;
  currentLesson?: Lesson;
  featured?: boolean;
};

export default function CourseProgressCard({ course, progress, currentLesson, featured = false }: Props) {
  const pct = courseProgressPct(course, progress);
  const started = pct > 0;
  const firstLesson = course.lessonIds[0];
  const lessonId = currentLesson?.id ?? firstLesson;

  return (
    <article className="z-course" data-featured={featured || undefined}>
      <div className="flex items-center gap-2">
        <span className="z-kind">{course.category}</span>
        <span className="z-meta">{course.level}</span>
        <span className="z-meta ml-auto">{course.lessonIds.length} lessons</span>
      </div>
      <h3 className="z-course-title">{course.title}</h3>
      {featured && currentLesson ? (
        <p className="text-sm text-muted-foreground">
          Current lesson: <span className="text-foreground">&ldquo;{currentLesson.title}&rdquo;</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
      )}
      <div className="flex items-center gap-3">
        <ProgressBar pct={pct} label={`${course.title} progress`} />
        <span className="z-pct">{pct}%</span>
      </div>
      {lessonId && (
        <Link href={`/dashboard/learn/lessons/${lessonId}`} className={`z-btn ${featured ? "z-btn--primary" : "z-btn--ghost"} w-fit`}>
          {pct === 100 ? "Review course" : started ? "Continue Learning" : "Start course"} <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </article>
  );
}
