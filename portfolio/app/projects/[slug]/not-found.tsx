import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Project not found</h1>
      <p className="text-foreground/80">
        Sorry, that project doesn&apos;t exist.
      </p>
      <Link
        href="/projects"
        className="inline-block text-sm font-medium underline underline-offset-4"
      >
        ← Back to projects
      </Link>
    </div>
  );
}
