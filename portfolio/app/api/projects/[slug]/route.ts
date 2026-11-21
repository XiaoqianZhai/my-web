import { NextResponse } from "next/server";
import {
  deleteProject,
  getProjectBySlug,
  updateProject,
  validateProject,
} from "@/lib/projects";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(
  request: Request,
  context: RouteContext<"/api/projects/[slug]">,
) {
  const { slug } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      console.log(`GET ${pathname} 404`);
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 },
      );
    }
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to read project:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading the project." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/projects/[slug]">,
) {
  const { slug } = await context.params;
  const pathname = new URL(request.url).pathname;

  const parsed = await readJsonObject(request);
  if (parsed.error) {
    console.log(`PUT ${pathname} ${parsed.error.status}`);
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
    console.log(`PUT ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const updated = await updateProject(slug, {
      title: values.title.trim(),
      summary: values.summary.trim(),
      role: values.role.trim(),
      tools: (values.tools as string[]).map((tool) => tool.trim()).filter(Boolean),
      details: (values.details as string[])
        .map((detail) => detail.trim())
        .filter(Boolean),
    });
    if (!updated) {
      console.log(`PUT ${pathname} 404`);
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 },
      );
    }
    console.log(`PUT ${pathname} 200`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update project:", error);
    console.log(`PUT ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while updating the project." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/projects/[slug]">,
) {
  const { slug } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const deleted = await deleteProject(slug);
    if (!deleted) {
      console.log(`DELETE ${pathname} 404`);
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 },
      );
    }
    console.log(`DELETE ${pathname} 200`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    console.log(`DELETE ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while deleting the project." },
      { status: 500 },
    );
  }
}
