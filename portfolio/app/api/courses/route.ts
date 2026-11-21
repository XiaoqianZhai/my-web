import { NextResponse } from "next/server";
import { getCourses, saveCourse, validateCourse } from "@/lib/courses";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    const courses = await getCourses();
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to read courses:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading courses." },
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
  const values = {
    code: typeof record.code === "string" ? record.code : "",
    name: typeof record.name === "string" ? record.name : "",
    term: typeof record.term === "string" ? record.term : "",
    notes: typeof record.notes === "string" ? record.notes : "",
  };

  const fieldErrors = validateCourse(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`POST ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const course = await saveCourse({
      code: values.code.trim(),
      name: values.name.trim(),
      term: values.term.trim(),
      notes: values.notes.trim(),
    });
    console.log(`POST ${pathname} 201`);
    return NextResponse.json({ ok: true, id: course.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save course:", error);
    console.log(`POST ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while saving the course." },
      { status: 500 },
    );
  }
}
