import type { Metadata } from "next";
import BlogAdminForm from "@/components/BlogAdminForm";

export const metadata: Metadata = {
  title: "Blog admin",
};

export default function BlogAdminPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog admin</h1>
        <p className="text-foreground/80">
          Write a new blog post. It is saved through the JSON API and shows up
          on the blogs page right away.
        </p>
      </div>
      <BlogAdminForm />
    </section>
  );
}
