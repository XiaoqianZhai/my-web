"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Course } from "@/lib/courses";
import CourseCard from "./CourseCard";
import FormField from "./FormField";

type CourseFormValues = {
  code: string;
  name: string;
  term: string;
  notes: string;
};

type CourseFormFieldErrors = Partial<Record<keyof CourseFormValues, string>>;

const initialCourseFormValues: CourseFormValues = {
  code: "",
  name: "",
  term: "",
  notes: "",
};

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50";

const secondaryButtonClasses =
  "rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10";

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [listError, setListError] = useState("");
  const [values, setValues] = useState(initialCourseFormValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CourseFormFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const data = await response.json();
        if (!cancelled) {
          setCourses(data);
          setListError("");
        }
      } catch {
        if (!cancelled) {
          setListError(
            "Could not load courses. Please refresh the page to try again.",
          );
        }
      }
    }

    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function updateValue(field: keyof CourseFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function clearMessages() {
    setFieldErrors({});
    setErrorMessage("");
    setStatusMessage("");
  }

  function startEdit(course: Course) {
    setValues({
      code: course.code,
      name: course.name,
      term: course.term,
      notes: course.notes,
    });
    setEditingId(course.id);
    clearMessages();
  }

  function cancelEdit() {
    setValues(initialCourseFormValues);
    setEditingId(null);
    clearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    clearMessages();

    try {
      const response = await fetch(
        editingId ? `/api/courses/${editingId}` : "/api/courses",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (response.ok) {
        setValues(initialCourseFormValues);
        setEditingId(null);
        setStatusMessage(editingId ? "Course updated." : "Course added.");
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
          "Something went wrong saving the course. Please try again.",
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
    if (!window.confirm("Delete this course? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (editingId === id) {
          setValues(initialCourseFormValues);
          setEditingId(null);
        }
        setStatusMessage("Course deleted.");
        setRefreshKey((key) => key + 1);
        return;
      }

      const body = await response.json().catch(() => null);
      setErrorMessage(
        body?.error ??
          "Something went wrong deleting the course. Please try again.",
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
          {editingId ? "Editing course" : "New course"}
        </h2>

        <FormField
          id="course-code"
          label="Course code"
          name="code"
          value={values.code}
          onChange={(event) => updateValue("code", event.target.value)}
          error={fieldErrors.code}
        />

        <FormField
          id="course-name"
          label="Course name"
          name="name"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          error={fieldErrors.name}
        />

        <FormField
          id="course-term"
          label="Term"
          name="term"
          value={values.term}
          onChange={(event) => updateValue("term", event.target.value)}
          error={fieldErrors.term}
        />

        <FormField
          id="course-notes"
          label="Notes on what I learned"
          name="notes"
          rows={4}
          value={values.notes}
          onChange={(event) => updateValue("notes", event.target.value)}
          error={fieldErrors.notes}
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
            {pending ? "Saving…" : editingId ? "Save changes" : "Save course"}
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
          Courses ({courses ? courses.length : "…"})
        </h2>
        {listError && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            {listError}
          </p>
        )}
        {!courses && !listError && (
          <p className="text-foreground/60">Loading courses…</p>
        )}
        {courses && courses.length === 0 && (
          <p className="text-foreground/80">No courses yet.</p>
        )}
        {courses &&
          courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <CourseCard course={course} />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(course)}
                  disabled={deletingId === course.id}
                  className={secondaryButtonClasses}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingId === course.id}
                  className={`${secondaryButtonClasses} text-red-600 dark:text-red-400`}
                >
                  {deletingId === course.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
