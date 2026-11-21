import { NextResponse } from "next/server";
import {
  deleteCourse,
  getCourseById,
  updateCourse,
  validateCourse,
} from "@/lib/courses";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(
  request: Request,
  context: RouteContext<"/api/courses/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const course = await getCourseById(id);
    if (!course) {
      console.log(`GET ${pathname} 404`);
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(course);
  } catch (error) {
    console.error("Failed to read course:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading the course." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/courses/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  const parsed = await readJsonObject(request);
  if (parsed.error) {
    console.log(`PUT ${pathname} ${parsed.error.status}`);
    return parsed.error;
  }

  const record = parsed.object;
  const values = {
    code: typeof record.code === "string" ? record.code : "",
    name: typeof record.name === "string" ? record.name : "",
    term: typeof record.term === "string" ? record.term : "",
    notes: typeof record.notes === "string" ? record.notes : "",
  };

  const fieldErrors = validateCourse(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`PUT ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const updated = await updateCourse(id, {
      code: values.code.trim(),
      name: values.name.trim(),
      term: values.term.trim(),
      notes: values.notes.trim(),
    });
    if (!updated) {
      console.log(`PUT ${pathname} 404`);
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    console.log(`PUT ${pathname} 200`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update course:", error);
    console.log(`PUT ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while updating the course." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/courses/[id]">,
) {
  const { id } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const deleted = await deleteCourse(id);
    if (!deleted) {
      console.log(`DELETE ${pathname} 404`);
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    console.log(`DELETE ${pathname} 200`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete course:", error);
    console.log(`DELETE ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while deleting the course." },
      { status: 500 },
    );
  }
}
