import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
};

export type BlogFieldErrors = Partial<Record<"title" | "summary" | "content", string>>;

export class BlogSlugConflictError extends Error {
  constructor(slug: string) {
    super(`A blog post with the slug "${slug}" already exists.`);
    this.name = "BlogSlugConflictError";
  }
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "post";
}

export function validateBlogPost(values: {
  title: string;
  summary: string;
  content: string;
}): BlogFieldErrors {
  const errors: BlogFieldErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title can't be blank.";
  }
  if (!values.summary.trim()) {
    errors.summary = "Summary can't be blank.";
  }
  if (!values.content.trim()) {
    errors.content = "Content can't be blank.";
  }

  return errors;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const filePath = path.join(process.cwd(), "content", "blog-posts.json");

  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("blog-posts.json does not contain a JSON array");
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return [];
  }
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const filePath = path.join(process.cwd(), "content", "blog-posts.json");

  let posts: BlogPost[] = [];
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("blog-posts.json does not contain a JSON array");
    }
    posts = parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  if (posts.some((existing) => existing.slug === post.slug)) {
    throw new BlogSlugConflictError(post.slug);
  }

  posts.push(post);

  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(posts, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
