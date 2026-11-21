import { NextResponse } from "next/server";
import {
  getContactSubmissions,
  saveContactSubmission,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contact";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    const submissions = await getContactSubmissions();
    const sorted = [...submissions].sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt),
    );
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Failed to read contact submissions:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while reading contact submissions.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const pathname = new URL(request.url).pathname;

  const parsed = await readJsonObject(request);
  if (parsed.error) {
    console.log(`POST ${pathname} ${parsed.error.status}`);
    return parsed.error;
  }

  const record = parsed.object;
  const values: ContactFormValues = {
    name: typeof record.name === "string" ? record.name : "",
    email: typeof record.email === "string" ? record.email : "",
    message: typeof record.message === "string" ? record.message : "",
  };

  const fieldErrors = validateContactForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`POST ${pathname} 400`);
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
    console.log(`POST ${pathname} 201`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    console.log(`POST ${pathname} 500`);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while saving your message. Please try again.",
      },
      { status: 500 },
    );
  }
}
