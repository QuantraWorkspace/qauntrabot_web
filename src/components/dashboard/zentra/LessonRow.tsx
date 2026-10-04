import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import type { Lesson } from "@/lib/zentra/types";

export default function LessonRow({ lesson, done, index }: { lesson: Lesson; done?: boolean; index?: number }) {
  return (
    <Link href={`/dashboard/learn/lessons/${lesson.id}`} className="z-lesson-row" data-done={done || undefined}>
      {done !== undefined ? (
        done ? (
          <CheckCircle2 size={16} className="text-profit shrink-0" aria-label="Completed" />
        ) : (
          <Circle size={16} className="text-muted-foreground shrink-0" aria-label="Not completed" />
        )
      ) : index !== undefined ? (
        <span className="z-lesson-n">{String(index + 1).padStart(2, "0")}</span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground truncate">{lesson.title}</span>
        <span className="block z-meta">
          {lesson.category} · {lesson.minutes} min
        </span>
      </span>
      <ChevronRight size={15} className="text-muted-foreground shrink-0" aria-hidden />
    </Link>
  );
}
