"use client";

import { useState, type FormEvent } from "react";

type ContactApiFormValues = {
  name: string;
  email: string;
  message: string;
};

type ContactApiFieldErrors = Partial<Record<keyof ContactApiFormValues, string>>;

const initialApiFormValues: ContactApiFormValues = {
  name: "",
  email: "",
  message: "",
};

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/25";

export default function ContactApiForm() {
  const [values, setValues] = useState(initialApiFormValues);
  const [fieldErrors, setFieldErrors] = useState<ContactApiFieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState(false);

  function updateValue(field: keyof ContactApiFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        setValues(initialApiFormValues);
        setSuccessMessage("Thanks! Your message has been received.");
        return;
      }

      const body = await response.json().catch(() => null);

      if (response.status === 400 && body?.errors) {
        setFieldErrors(body.errors);
        return;
      }

      setErrorMessage(
        body?.error ??
          "Something went wrong sending your message. Please try again.",
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
      <div className="space-y-1">
        <label htmlFor="api-name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="api-name"
          name="name"
          type="text"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "api-name-error" : undefined}
          className={inputClasses}
        />
        {fieldErrors.name && (
          <p
            id="api-name-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="api-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="api-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "api-email-error" : undefined}
          className={inputClasses}
        />
        {fieldErrors.email && (
          <p
            id="api-email-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="api-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="api-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "api-message-error" : undefined
          }
          className={inputClasses}
        />
        {fieldErrors.message && (
          <p
            id="api-message-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      {successMessage && (
        <p
          role="status"
          className="rounded-lg border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
        >
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
