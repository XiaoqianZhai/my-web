"use server";

import {
  saveContactSubmission,
  validateContactForm,
} from "@/lib/contact";

export type ContactFormState = {
  status: "idle" | "success" | "validation-error" | "server-error";
  message: string;
  fieldErrors: Partial<Record<"name" | "email" | "message", string>>;
  values: { name: string; email: string; message: string };
};

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const fieldErrors = validateContactForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "validation-error", message: "", fieldErrors, values };
  }

  try {
    await saveContactSubmission({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return {
      status: "server-error",
      message:
        "Something went wrong on the server while saving your message. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks! Your message has been received.",
    fieldErrors: {},
    values: { name: "", email: "", message: "" },
  };
}
