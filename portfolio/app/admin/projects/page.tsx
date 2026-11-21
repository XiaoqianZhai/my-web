import type { Metadata } from "next";
import ProjectAdminForm from "@/components/ProjectAdminForm";

export const metadata: Metadata = {
  title: "Project admin",
};

export default function ProjectAdminPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project admin</h1>
        <p className="text-foreground/80">
          Create, edit, and delete projects. Everything goes through the JSON
          API and shows up on the projects page right away.
        </p>
      </div>
      <ProjectAdminForm />
    </section>
  );
}
