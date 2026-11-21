"use client";

import { useEffect, useState, type FormEvent } from "react";
import FormField from "./FormField";

type AdminContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  source: string;
};

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialContactFormValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10";

export default function ContactAdminForm() {
  const [submissions, setSubmissions] = useState<
    AdminContactSubmission[] | null
  >(null);
  const [listError, setListError] = useState("");
  const [values, setValues] = useState(initialContactFormValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFormFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadSubmissions() {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        if (!cancelled) {
          setSubmissions(data);
          setListError("");
        }
      } catch {
        if (!cancelled) {
          setListError(
            "Could not load submissions. Please refresh the page to try again.",
          );
        }
      }
    }

    loadSubmissions();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function updateValue(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function clearMessages() {
    setFieldErrors({});
    setErrorMessage("");
    setStatusMessage("");
  }

  function startEdit(submission: AdminContactSubmission) {
    setValues({
      name: submission.name,
      email: submission.email,
      message: submission.message,
    });
    setEditingId(submission.id);
    clearMessages();
  }

  function cancelEdit() {
    setValues(initialContactFormValues);
    setEditingId(null);
    clearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    clearMessages();

    try {
      const response = await fetch(
        editingId ? `/api/contact/${editingId}` : "/api/contact",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (response.ok) {
        setValues(initialContactFormValues);
        setEditingId(null);
        setStatusMessage(
          editingId ? "Submission updated." : "Submission added.",
        );
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
          "Something went wrong saving the submission. Please try again.",
      );
    } catch {
      setErrorMessage(
        "Could not reach the server. Please check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this submission? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (editingId === id) {
          setValues(initialContactFormValues);
          setEditingId(null);
        }
        setStatusMessage("Submission deleted.");
        setRefreshKey((key) => key + 1);
        return;
      }

      const body = await response.json().catch(() => null);
      setErrorMessage(
        body?.error ??
          "Something went wrong deleting the submission. Please try again.",
      );
    } catch {
      setErrorMessage(
        "Could not reach the server. Please check your connection and try again.",
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight">
          {editingId ? "Editing submission" : "New submission"}
        </h2>

        <FormField
          id="contact-name"
          label="Name"
          name="name"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          error={fieldErrors.name}
        />

        <FormField
          id="contact-email"
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          error={fieldErrors.email}
        />

        <FormField
          id="contact-message"
          label="Message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          error={fieldErrors.message}
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
            {statusMessage}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className={primaryButtonClasses}>
            {pending ? "Saving…" : editingId ? "Save changes" : "Add submission"}
          </button>
          {editingId && (
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
        <h2 className="text-xl font-semibold tracking-tight">
          Submissions ({submissions ? submissions.length : "…"})
        </h2>
        {listError && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {listError}
          </p>
        )}
        {!submissions && !listError && (
          <p className="text-foreground/60">Loading submissions…</p>
        )}
        {submissions && submissions.length === 0 && (
          <p className="text-foreground/80">No submissions yet.</p>
        )}
        {submissions &&
          submissions.map((submission) => (
            <div key={submission.id} className="space-y-2">
              <article className="rounded-2xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/30">
                <h3 className="text-xl font-semibold tracking-tight">
                  {submission.name}
                </h3>
                <p className="mt-1 text-sm text-foreground/60">
                  {submission.email} ·{" "}
                  {new Date(submission.submittedAt).toLocaleString("en-US")} ·{" "}
                  {submission.source}
                </p>
                <p className="mt-2 text-foreground/80">{submission.message}</p>
              </article>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(submission)}
                  disabled={deletingId === submission.id}
                  className={secondaryButtonClasses}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(submission.id)}
                  disabled={deletingId === submission.id}
                  className={`${secondaryButtonClasses} text-red-600 dark:text-red-400`}
                >
                  {deletingId === submission.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
