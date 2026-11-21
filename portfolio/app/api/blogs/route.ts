import { NextResponse } from "next/server";
import {
  BlogSlugConflictError,
  getBlogPosts,
  saveBlogPost,
  slugifyTitle,
  validateBlogPost,
} from "@/lib/blogs";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    const posts = await getBlogPosts();
    const sorted = [...posts].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Failed to read blog posts:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading blog posts." },
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
    content: typeof record.content === "string" ? record.content : "",
  };

  const fieldErrors = validateBlogPost(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`POST ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const slug = slugifyTitle(values.title);
    await saveBlogPost({
      slug,
      title: values.title.trim(),
      summary: values.summary.trim(),
      content: values.content.trim(),
      createdAt: new Date().toISOString(),
    });
    console.log(`POST ${pathname} 201`);
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (error) {
    if (error instanceof BlogSlugConflictError) {
      console.log(`POST ${pathname} 409`);
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Failed to save blog post:", error);
    console.log(`POST ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while saving the post." },
      { status: 500 },
    );
  }
}
