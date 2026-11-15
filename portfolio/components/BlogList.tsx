"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatBlogDate } from "@/lib/blog-format";

type BlogListPost = {
  slug: string;
  title: string;
  summary: string;
  createdAt: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<BlogListPost[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        if (!cancelled) {
          setPosts(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not load blog posts. Please refresh the page to try again.",
          );
        }
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
      >
        {error}
      </p>
    );
  }

  if (!posts) {
    return <p className="text-foreground/60">Loading posts…</p>;
  }

  if (posts.length === 0) {
    return <p className="text-foreground/80">No posts yet.</p>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="rounded-2xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
        >
          <h2 className="text-xl font-semibold tracking-tight">{post.title}</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {formatBlogDate(post.createdAt)}
          </p>
          <p className="mt-2 text-foreground/80">{post.summary}</p>
          <Link
            href={`/blogs/${post.slug}`}
            className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
          >
            Read post
          </Link>
        </article>
      ))}
    </div>
  );
}
