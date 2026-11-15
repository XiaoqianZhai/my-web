import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBlogDate } from "@/lib/blog-format";
import { getBlogPosts } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((entry) => entry.slug === slug);
  if (!post) return {};
  return { title: post.title };
}

export default async function BlogPostPage(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = (await getBlogPosts()).find((entry) => entry.slug === slug);
  if (!post) notFound();

  return (
    <article className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-foreground/60">
          {formatBlogDate(post.createdAt)}
        </p>
        <p className="text-foreground/80">{post.summary}</p>
      </div>

      <div className="space-y-4">
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-foreground/80">
            {paragraph}
          </p>
        ))}
      </div>

      <Link
        href="/blogs"
        className="inline-block text-sm font-medium underline underline-offset-4"
      >
        ← Back to blogs
      </Link>
    </article>
  );
}
