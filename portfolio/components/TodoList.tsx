"use client";

import { useEffect, useState, type FormEvent } from "react";
import FormField, { inputClasses } from "./FormField";

const STORAGE_KEY = "study-todos";

const priorities = ["low", "medium", "high"] as const;

type TodoPriority = (typeof priorities)[number];

type TodoTask = {
  id: string;
  title: string;
  dueDate: string;
  priority: TodoPriority;
  done: boolean;
};

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80";

const secondaryButtonClasses =
  "rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10";

const priorityClasses: Record<TodoPriority, string> = {
  low: "border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400",
  medium:
    "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  high: "border-red-600/30 bg-red-500/10 text-red-700 dark:text-red-400",
};

function formatDueDate(dueDate: string): string {
  const date = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dueDate;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodoList() {
  const [tasks, setTasks] = useState<TodoTask[] | null>(null);
  const [dataError, setDataError] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [titleError, setTitleError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  useEffect(() => {
    let cancelled = false;

    function loadTasks() {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === null) {
        setTasks([]);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          setDataError(true);
          setTasks([]);
          return;
        }
        if (!cancelled) {
          setTasks(parsed as TodoTask[]);
        }
      } catch {
        setDataError(true);
        setTasks([]);
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  function persist(nextTasks: TodoTask[]) {
    setTasks(nextTasks);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitleError = title.trim() ? "" : "Title can't be blank.";
    const nextDueDateError = dueDate ? "" : "Due date can't be blank.";
    setTitleError(nextTitleError);
    setDueDateError(nextDueDateError);
    if (nextTitleError || nextDueDateError) {
      return;
    }

    const newTask: TodoTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      dueDate,
      priority,
      done: false,
    };
    persist(tasks ? [...tasks, newTask] : [newTask]);
    setTitle("");
    setDueDate("");
    setPriority("medium");
  }

  function toggleTask(id: string) {
    if (!tasks) {
      return;
    }
    persist(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    if (!tasks) {
      return;
    }
    persist(tasks.filter((task) => task.id !== id));
  }

  function clearAll() {
    if (!tasks || tasks.length === 0) {
      return;
    }
    if (!window.confirm("Clear all tasks? This cannot be undone.")) {
      return;
    }
    persist([]);
  }

  return (
    <div className="space-y-12">
      <form onSubmit={handleAdd} noValidate className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight">New task</h2>

        <FormField
          id="todo-title"
          label="Title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={titleError}
        />

        <FormField
          id="todo-due-date"
          label="Due date"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          error={dueDateError}
        />

        <div className="space-y-1">
          <label
            htmlFor="todo-priority"
            className="block text-sm font-medium"
          >
            Priority
          </label>
          <select
            id="todo-priority"
            name="priority"
            className={inputClasses}
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TodoPriority)
            }
          >
            {priorities.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={primaryButtonClasses}>
          Add task
        </button>
      </form>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Tasks ({tasks ? tasks.length : "…"})
          </h2>
          {tasks && tasks.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className={`${secondaryButtonClasses} text-red-600 dark:text-red-400`}
            >
              Clear all
            </button>
          )}
        </div>

        {dataError && (
          <p
            role="alert"
            className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
          >
            Saved to-dos could not be read, so the list starts empty.
          </p>
        )}
        {!tasks && !dataError && (
          <p className="text-foreground/60">Loading tasks…</p>
        )}
        {tasks && tasks.length === 0 && !dataError && (
          <p className="text-foreground/80">No tasks yet.</p>
        )}
        {tasks && tasks.length > 0 && (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-2xl border border-black/10 p-4 dark:border-white/15"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`}
                    className="h-4 w-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium ${task.done ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-foreground/60">
                      Due {formatDueDate(task.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs capitalize ${priorityClasses[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-sm font-medium text-red-600 underline underline-offset-4 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
