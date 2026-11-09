import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30">
      <h2 className="text-xl font-semibold tracking-tight">{project.title}</h2>
      <p className="mt-2 text-foreground/80">{project.summary}</p>
      {project.tools.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/20"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/projects/${project.slug}`}
        className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
      >
        View details
      </Link>
    </article>
  );
}
