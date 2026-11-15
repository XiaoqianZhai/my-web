import type { Metadata } from "next";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blogs",
};

export default function BlogsPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
        <p className="text-foreground/80">
          Notes on building this site and what I am learning along the way.
        </p>
      </div>
      <BlogList />
    </section>
  );
}
