import { NextResponse } from "next/server";
import {
  ProjectSlugConflictError,
  getProjects,
  saveProject,
  slugifyTitle,
  validateProject,
} from "@/lib/projects";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    const projects = await getProjects();
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to read projects:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading projects." },
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
    title: typeof record.title === "string" ? record.title : "",
    summary: typeof record.summary === "string" ? record.summary : "",
    role: typeof record.role === "string" ? record.role : "",
    tools: Array.isArray(record.tools) ? record.tools : undefined,
    details: Array.isArray(record.details) ? record.details : undefined,
  };

  const fieldErrors = validateProject(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`POST ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const slug = slugifyTitle(values.title);
    await saveProject({
      slug,
      title: values.title.trim(),
      summary: values.summary.trim(),
      role: values.role.trim(),
      tools: (values.tools as string[]).map((tool) => tool.trim()).filter(Boolean),
      details: (values.details as string[])
        .map((detail) => detail.trim())
        .filter(Boolean),
    });
    console.log(`POST ${pathname} 201`);
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (error) {
    if (error instanceof ProjectSlugConflictError) {
      console.log(`POST ${pathname} 409`);
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Failed to save project:", error);
    console.log(`POST ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while saving the project." },
      { status: 500 },
    );
  }
}
