import type { EducationCatalog } from "./data";
import type { Course, CourseProgress, Lesson, LessonCategory } from "./types";

/**
 * Server progress plus lessons the viewer completed on this device. The
 * current lesson is the first one in course order not yet completed.
 */
export function mergeProgress(catalog: EducationCatalog, localCompleted: string[]): CourseProgress[] {
  return catalog.courses.flatMap((course) => {
    const server = catalog.progress.find((p) => p.courseId === course.id);
    const done = new Set([
      ...(server?.completedLessonIds ?? []),
      ...localCompleted.filter((id) => course.lessonIds.includes(id)),
    ]);
    if (done.size === 0 && !server) return [];
    const next = course.lessonIds.find((id) => !done.has(id)) ?? course.lessonIds[course.lessonIds.length - 1];
    return [{ courseId: course.id, completedLessonIds: [...done], currentLessonId: next }];
  });
}

/** The course to put in front of the member: most progressed, not yet finished. */
export function currentCourse(
  catalog: EducationCatalog,
  progress: CourseProgress[],
): { course: Course; progress: CourseProgress; lesson?: Lesson } | null {
  const candidates = progress
    .map((p) => ({ p, course: catalog.courses.find((c) => c.id === p.courseId) }))
    .filter((x): x is { p: CourseProgress; course: Course } => Boolean(x.course))
    .filter(({ p, course }) => p.completedLessonIds.length < course.lessonIds.length)
    .sort((a, b) => b.p.completedLessonIds.length / b.course.lessonIds.length - a.p.completedLessonIds.length / a.course.lessonIds.length);
  const top = candidates[0];
  if (!top) return null;
  return { course: top.course, progress: top.p, lesson: catalog.lessons.find((l) => l.id === top.p.currentLessonId) };
}

/**
 * Lessons not yet completed, in learning-path order. `path` overrides the
 * catalogue's order (e.g. a level-specific path); lessons in `topics` the
 * member asked for move to the front.
 */
export function recommendedLessons(
  catalog: EducationCatalog,
  progress: CourseProgress[],
  limit = 4,
  opts: { path?: string[]; topics?: LessonCategory[] } = {},
): Lesson[] {
  const done = new Set(progress.flatMap((p) => p.completedLessonIds));
  const order = opts.path?.length ? opts.path : catalog.path.length ? catalog.path : catalog.courses.map((c) => c.id);
  const lessons = order
    .flatMap((courseId) => catalog.courses.find((c) => c.id === courseId)?.lessonIds ?? [])
    .filter((id) => !done.has(id))
    .map((id) => catalog.lessons.find((l) => l.id === id))
    .filter((l): l is Lesson => Boolean(l));
  const topics = opts.topics ?? [];
  const ranked = topics.length
    ? [...lessons.filter((l) => topics.includes(l.category)), ...lessons.filter((l) => !topics.includes(l.category))]
    : lessons;
  return ranked.slice(0, limit);
}
