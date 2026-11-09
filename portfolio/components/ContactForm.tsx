"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/contact-me-server-form/actions";

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { name: "", email: "", message: "" },
};

const inputClasses =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 dark:border-white/25";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactFormState,
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.values.name}
          aria-invalid={state.fieldErrors.name ? true : undefined}
          aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
          className={inputClasses}
        />
        {state.fieldErrors.name && (
          <p id="name-error" className="text-sm text-red-600 dark:text-red-400">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values.email}
          aria-invalid={state.fieldErrors.email ? true : undefined}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
          className={inputClasses}
        />
        {state.fieldErrors.email && (
          <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values.message}
          aria-invalid={state.fieldErrors.message ? true : undefined}
          aria-describedby={
            state.fieldErrors.message ? "message-error" : undefined
          }
          className={inputClasses}
        />
        {state.fieldErrors.message && (
          <p
            id="message-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {state.fieldErrors.message}
          </p>
        )}
      </div>

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
