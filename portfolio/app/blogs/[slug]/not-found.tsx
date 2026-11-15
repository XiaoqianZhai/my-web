import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Post not found</h1>
      <p className="text-foreground/80">
        Sorry, that blog post doesn&apos;t exist.
      </p>
      <Link
        href="/blogs"
        className="inline-block text-sm font-medium underline underline-offset-4"
      >
        ← Back to blogs
      </Link>
    </div>
  );
}
