import { NextResponse } from "next/server";
import {
  deleteBlogPost,
  getBlogPostBySlug,
  updateBlogPost,
  validateBlogPost,
} from "@/lib/blogs";
import { readJsonObject } from "@/lib/read-json-object";

export async function GET(
  request: Request,
  context: RouteContext<"/api/blogs/[slug]">,
) {
  const { slug } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      console.log(`GET ${pathname} 404`);
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }
    console.log(`GET ${pathname} 200`);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to read blog post:", error);
    console.log(`GET ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while reading the post." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/blogs/[slug]">,
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
    content: typeof record.content === "string" ? record.content : "",
  };

  const fieldErrors = validateBlogPost(values);
  if (Object.keys(fieldErrors).length > 0) {
    console.log(`PUT ${pathname} 400`);
    return NextResponse.json({ errors: fieldErrors }, { status: 400 });
  }

  try {
    const updated = await updateBlogPost(slug, {
      title: values.title.trim(),
      summary: values.summary.trim(),
      content: values.content.trim(),
    });
    if (!updated) {
      console.log(`PUT ${pathname} 404`);
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }
    console.log(`PUT ${pathname} 200`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update blog post:", error);
    console.log(`PUT ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while updating the post." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/blogs/[slug]">,
) {
  const { slug } = await context.params;
  const pathname = new URL(request.url).pathname;

  try {
    const deleted = await deleteBlogPost(slug);
    if (!deleted) {
      console.log(`DELETE ${pathname} 404`);
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }
    console.log(`DELETE ${pathname} 200`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    console.log(`DELETE ${pathname} 500`);
    return NextResponse.json(
      { error: "Something went wrong on the server while deleting the post." },
      { status: 500 },
    );
  }
}
