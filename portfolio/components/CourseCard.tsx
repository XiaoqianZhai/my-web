import type { Course } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="rounded-2xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          {course.code}: {course.name}
        </h2>
        <p className="text-sm text-foreground/60">{course.term}</p>
      </div>
      <p className="mt-2 text-foreground/80">{course.notes}</p>
    </article>
  );
}
