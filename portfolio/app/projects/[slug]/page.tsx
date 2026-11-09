import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="text-foreground/80">{project.summary}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Role</h2>
        <p className="text-foreground/80">{project.role}</p>
      </div>

      {project.tools.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Tools</h2>
          <ul className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/20"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.details.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Details</h2>
          <ul className="list-disc space-y-2 pl-5 text-foreground/80">
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/projects"
        className="inline-block text-sm font-medium underline underline-offset-4"
      >
        ← Back to projects
      </Link>
    </article>
  );
}
