"use client";

import { useState, type FormEvent } from "react";
import type { ContactFieldErrors, ContactFormValues } from "@/lib/contact";
import FormField from "./FormField";

const initialApiFormValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};

export default function ContactApiForm() {
  const [values, setValues] = useState<ContactFormValues>(initialApiFormValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState(false);

  function updateValue(field: keyof ContactFormValues, value: string) {
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
      <FormField
        id="api-name"
        label="Name"
        name="name"
        value={values.name}
        onChange={(event) => updateValue("name", event.target.value)}
        error={fieldErrors.name}
      />

      <FormField
        id="api-email"
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={(event) => updateValue("email", event.target.value)}
        error={fieldErrors.email}
      />

      <FormField
        id="api-message"
        label="Message"
        name="message"
        rows={5}
        value={values.message}
        onChange={(event) => updateValue("message", event.target.value)}
        error={fieldErrors.message}
      />

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
