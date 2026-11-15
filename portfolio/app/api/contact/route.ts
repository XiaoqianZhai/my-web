import { NextResponse } from "next/server";
import {
  saveContactSubmission,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const values: ContactFormValues = {
    name: typeof record.name === "string" ? record.name : "",
    email: typeof record.email === "string" ? record.email : "",
    message: typeof record.message === "string" ? record.message : "",
  };

  const fieldErrors = validateContactForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    await saveContactSubmission({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
      source: "api",
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while saving your message. Please try again.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
