"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import FormField from "./FormField";
import ProjectCard from "./ProjectCard";

type AdminProject = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  tools: string[];
  details: string[];
};

type ProjectFormValues = {
  title: string;
  summary: string;
  role: string;
  tools: string;
  details: string;
};

type ProjectFormFieldErrors = Partial<Record<keyof ProjectFormValues, string>>;

const initialProjectFormValues: ProjectFormValues = {
  title: "",
  summary: "",
  role: "",
  tools: "",
  details: "",
};

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10";

function toFormValues(project: AdminProject): ProjectFormValues {
  return {
    title: project.title,
    summary: project.summary,
    role: project.role,
    tools: project.tools.join(", "),
    details: project.details.join("\n"),
  };
}

function toList(value: string, separator: "," | "\n"): string[] {
  return value
    .split(separator)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function ProjectAdminForm() {
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [listError, setListError] = useState("");
  const [values, setValues] = useState(initialProjectFormValues);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProjectFormFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSlug, setStatusSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        if (!cancelled) {
          setProjects(data);
          setListError("");
        }
      } catch {
        if (!cancelled) {
          setListError(
            "Could not load projects. Please refresh the page to try again.",
          );
        }
      }
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function updateValue(field: keyof ProjectFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function clearMessages() {
    setFieldErrors({});
    setErrorMessage("");
    setStatusMessage("");
    setStatusSlug("");
  }

  function startEdit(project: AdminProject) {
    setValues(toFormValues(project));
    setEditingSlug(project.slug);
    clearMessages();
  }

  function cancelEdit() {
    setValues(initialProjectFormValues);
    setEditingSlug(null);
    clearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    clearMessages();

    const payload = {
      title: values.title,
      summary: values.summary,
      role: values.role,
      tools: toList(values.tools, ","),
      details: toList(values.details, "\n"),
    };

    try {
      const response = await fetch(
        editingSlug ? `/api/projects/${editingSlug}` : "/api/projects",
        {
          method: editingSlug ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const body = await response.json();
        setValues(initialProjectFormValues);
        setEditingSlug(null);
        setStatusMessage(editingSlug ? "Project updated." : "Project created.");
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
          "Something went wrong saving the project. Please try again.",
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
    if (
      !window.confirm(`Delete the project "${slug}"? This cannot be undone.`)
    ) {
      return;
    }

    setDeletingSlug(slug);
    setErrorMessage("");
    setStatusMessage("");
    setStatusSlug("");

    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (editingSlug === slug) {
          setValues(initialProjectFormValues);
          setEditingSlug(null);
        }
        setStatusMessage("Project deleted.");
        setRefreshKey((key) => key + 1);
        return;
      }

      const body = await response.json().catch(() => null);
      setErrorMessage(
        body?.error ??
          "Something went wrong deleting the project. Please try again.",
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
          {editingSlug ? `Editing "${editingSlug}"` : "New project"}
        </h2>

        <FormField
          id="project-title"
          label="Title"
          name="title"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          error={fieldErrors.title}
        />

        <FormField
          id="project-summary"
          label="Summary"
          name="summary"
          value={values.summary}
          onChange={(event) => updateValue("summary", event.target.value)}
          error={fieldErrors.summary}
        />

        <FormField
          id="project-role"
          label="Role"
          name="role"
          value={values.role}
          onChange={(event) => updateValue("role", event.target.value)}
          error={fieldErrors.role}
        />

        <FormField
          id="project-tools"
          label="Tools (comma separated)"
          name="tools"
          value={values.tools}
          onChange={(event) => updateValue("tools", event.target.value)}
          error={fieldErrors.tools}
        />

        <FormField
          id="project-details"
          label="Details (one per line)"
          name="details"
          rows={6}
          value={values.details}
          onChange={(event) => updateValue("details", event.target.value)}
          error={fieldErrors.details}
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
                href={`/projects/${statusSlug}`}
                className="font-medium underline underline-offset-4"
              >
                View the project
              </Link>
            )}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className={primaryButtonClasses}>
            {pending ? "Saving…" : editingSlug ? "Save changes" : "Save project"}
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
        <h2 className="text-xl font-semibold tracking-tight">Your projects</h2>
        {listError && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {listError}
          </p>
        )}
        {!projects && !listError && (
          <p className="text-foreground/60">Loading projects…</p>
        )}
        {projects && projects.length === 0 && (
          <p className="text-foreground/80">No projects yet.</p>
        )}
        {projects &&
          projects.map((project) => (
            <div key={project.slug} className="space-y-2">
              <ProjectCard project={project} />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  disabled={deletingSlug === project.slug}
                  className={secondaryButtonClasses}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.slug)}
                  disabled={deletingSlug === project.slug}
                  className={`${secondaryButtonClasses} text-red-600 dark:text-red-400`}
                >
                  {deletingSlug === project.slug ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
