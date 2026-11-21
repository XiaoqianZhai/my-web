import { NextResponse } from "next/server";
import {
  deleteContactSubmission,
  getContactSubmissionById,
  updateContactSubmission,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contact";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(
  request: Request,
  context: RouteContext<"/api/contact/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const submission = await getContactSubmissionById(id);
    if (!submission) {
      console.log(`GET ${pathname} 404`);
      return NextResponse.json(
        { error: "Contact submission not found." },
        { status: 404 },
      );
    }
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(submission);
  } catch (error) {
    console.error("Failed to read contact submission:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while reading the submission.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/contact/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  const parsed = await readJsonObject(request);
  if (parsed.error) {
    console.log(`PUT ${pathname} ${parsed.error.status}`);
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
    console.log(`PUT ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const updated = await updateContactSubmission(id, {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    if (!updated) {
      console.log(`PUT ${pathname} 404`);
      return NextResponse.json(
        { error: "Contact submission not found." },
        { status: 404 },
      );
    }
    console.log(`PUT ${pathname} 200`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update contact submission:", error);
    console.log(`PUT ${pathname} 500`);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while updating the submission.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/contact/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const deleted = await deleteContactSubmission(id);
    if (!deleted) {
      console.log(`DELETE ${pathname} 404`);
      return NextResponse.json(
        { error: "Contact submission not found." },
        { status: 404 },
      );
    }
    console.log(`DELETE ${pathname} 200`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete contact submission:", error);
    console.log(`DELETE ${pathname} 500`);
    return NextResponse.json(
      {
        error:
          "Something went wrong on the server while deleting the submission.",
      },
      { status: 500 },
    );
  }
}
