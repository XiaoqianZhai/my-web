"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { formatBlogDate } from "@/lib/blog-format";
import FormField from "./FormField";

type AdminBlogPost = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
};

type BlogFormValues = {
  title: string;
  summary: string;
  content: string;
};

type BlogFormFieldErrors = Partial<Record<keyof BlogFormValues, string>>;

const initialBlogFormValues: BlogFormValues = {
  title: "",
  summary: "",
  content: "",
};

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10";

export default function BlogAdminForm() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [listError, setListError] = useState("");
  const [values, setValues] = useState(initialBlogFormValues);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BlogFormFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSlug, setStatusSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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
          setListError("");
        }
      } catch {
        if (!cancelled) {
          setListError(
            "Could not load blog posts. Please refresh the page to try again.",
          );
        }
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function updateValue(field: keyof BlogFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function clearMessages() {
    setFieldErrors({});
    setErrorMessage("");
    setStatusMessage("");
    setStatusSlug("");
  }

  function startEdit(post: AdminBlogPost) {
    setValues({
      title: post.title,
      summary: post.summary,
      content: post.content,
    });
    setEditingSlug(post.slug);
    clearMessages();
  }

  function cancelEdit() {
    setValues(initialBlogFormValues);
    setEditingSlug(null);
    clearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    clearMessages();

    try {
      const response = await fetch(
        editingSlug ? `/api/blogs/${editingSlug}` : "/api/blogs",
        {
          method: editingSlug ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (response.ok) {
        const body = await response.json();
        setValues(initialBlogFormValues);
        setEditingSlug(null);
        setStatusMessage(editingSlug ? "Post updated." : "Post created.");
        setStatusSlug(body.slug);
        setRefreshKey((key) => key + 1);
        return;
      }

      const body = await response.json().catch(() => null);

      if (response.status === 400 && body?.errors) {
        setFieldErrors(body.errors);
        return;
      }

      setErrorMessage(
        body?.error ??
          "Something went wrong saving the post. Please try again.",
      );
    } catch {
      setErrorMessage(
        "Could not reach the server. Please check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!window.confirm(`Delete the post "${slug}"? This cannot be undone.`)) {
      return;
    }

    setDeletingSlug(slug);
    setErrorMessage("");
    setStatusMessage("");
    setStatusSlug("");

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (editingSlug === slug) {
          setValues(initialBlogFormValues);
          setEditingSlug(null);
        }
        setStatusMessage("Post deleted.");
        setRefreshKey((key) => key + 1);
        return;
      }

      const body = await response.json().catch(() => null);
      setErrorMessage(
        body?.error ??
          "Something went wrong deleting the post. Please try again.",
      );
    } catch {
      setErrorMessage(
        "Could not reach the server. Please check your connection and try again.",
      );
    } finally {
      setDeletingSlug("");
    }
  }

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight">
          {editingSlug ? `Editing "${editingSlug}"` : "New post"}
        </h2>

        <FormField
          id="blog-title"
          label="Title"
          name="title"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          error={fieldErrors.title}
        />

        <FormField
          id="blog-summary"
          label="Summary"
          name="summary"
          value={values.summary}
          onChange={(event) => updateValue("summary", event.target.value)}
          error={fieldErrors.summary}
        />

        <FormField
          id="blog-content"
          label="Content"
          name="content"
          rows={8}
          value={values.content}
          onChange={(event) => updateValue("content", event.target.value)}
          error={fieldErrors.content}
        />

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p
            role="status"
            className="rounded-lg border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
          >
            {statusMessage}{" "}
            {statusSlug && (
              <Link
                href={`/blogs/${statusSlug}`}
                className="font-medium underline underline-offset-4"
              >
                View the post
              </Link>
            )}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className={primaryButtonClasses}>
            {pending ? "Saving…" : editingSlug ? "Save changes" : "Save post"}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={cancelEdit}
              className={secondaryButtonClasses}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Your posts</h2>
        {listError && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {listError}
          </p>
        )}
        {!posts && !listError && (
          <p className="text-foreground/60">Loading posts…</p>
        )}
        {posts && posts.length === 0 && (
          <p className="text-foreground/80">No posts yet.</p>
        )}
        {posts &&
          posts.map((post) => (
            <div key={post.slug} className="space-y-2">
              <article className="rounded-2xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30">
                <h3 className="text-xl font-semibold tracking-tight">
                  {post.title}
                </h3>
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  disabled={deletingSlug === post.slug}
                  className={secondaryButtonClasses}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  disabled={deletingSlug === post.slug}
                  className={`${secondaryButtonClasses} text-red-600 dark:text-red-400`}
                >
                  {deletingSlug === post.slug ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
