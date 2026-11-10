import Link from "next/link";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Xiaoqian Zhai</h1>
        <p className="text-lg text-foreground/80">
          MSBA candidate at Santa Clara University, based in the San Francisco
          Bay Area.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Highlights</h2>
        <ul className="list-disc space-y-2 pl-5 text-foreground/80">
          <li>
            Optimization modeling: linear programming (LP), integer linear
            programming (ILP), goal programming, and network flow.
          </li>
          <li>Analytics toolkit: Python, R, and Tableau.</li>
          <li>
            Project work: {projects.map((project) => project.title).join(" and ")}.
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          View projects
        </Link>
        <Link
          href="/contact-me-server-form"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Contact me
        </Link>
      </div>
    </section>
  );
}
