"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FormField from "./FormField";

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

export default function BlogAdminForm() {
  const [values, setValues] = useState(initialBlogFormValues);
  const [fieldErrors, setFieldErrors] = useState<BlogFormFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
  const [pending, setPending] = useState(false);

  function updateValue(field: keyof BlogFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});
    setErrorMessage("");
    setCreatedSlug("");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        const body = await response.json();
        setValues(initialBlogFormValues);
        setCreatedSlug(body.slug);
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

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
      {createdSlug && (
        <p
          role="status"
          className="rounded-lg border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
        >
          Post created.{" "}
          <Link
            href={`/blogs/${createdSlug}`}
            className="font-medium underline underline-offset-4"
          >
            View your new post
          </Link>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
