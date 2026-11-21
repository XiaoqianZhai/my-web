import type { Metadata } from "next";
import CoursesManager from "@/components/CoursesManager";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-foreground/80">
          MSBA courses I have taken, with notes on what I learned. Add, edit,
          or delete courses right on this page.
        </p>
      </div>
      <CoursesManager />
    </section>
  );
}
