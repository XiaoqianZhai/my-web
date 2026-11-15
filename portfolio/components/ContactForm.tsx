"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/contact-me-server-form/actions";
import FormField from "./FormField";

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { name: "", email: "", message: "" },
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactFormState,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      <FormField
        id="name"
        label="Name"
        name="name"
        defaultValue={state.values.name}
        error={state.fieldErrors.name}
      />

      <FormField
        id="email"
        label="Email"
        name="email"
        type="email"
        defaultValue={state.values.email}
        error={state.fieldErrors.email}
      />

      <FormField
        id="message"
        label="Message"
        name="message"
        rows={5}
        defaultValue={state.values.message}
        error={state.fieldErrors.message}
      />

      {state.status === "success" && (
        <p
          role="status"
          className="rounded-lg border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
        >
          {state.message}
        </p>
      )}
      {state.status === "server-error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {state.message}
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
