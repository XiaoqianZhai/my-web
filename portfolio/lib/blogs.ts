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
  return readBlogPostsFile();
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await readBlogPostsFile();
  return posts.find((post) => post.slug === slug);
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const posts = await readBlogPostsFile();

  if (posts.some((existing) => existing.slug === post.slug)) {
    throw new BlogSlugConflictError(post.slug);
  }

  posts.push(post);
  await writeBlogPostsFile(posts);
}

export async function updateBlogPost(
  slug: string,
  updates: { title: string; summary: string; content: string },
): Promise<BlogPost | undefined> {
  const posts = await readBlogPostsFile();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return undefined;
  }

  const updated: BlogPost = { ...posts[index], ...updates };
  posts[index] = updated;
  await writeBlogPostsFile(posts);
  return updated;
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const posts = await readBlogPostsFile();
  const remaining = posts.filter((post) => post.slug !== slug);
  if (remaining.length === posts.length) {
    return false;
  }

  await writeBlogPostsFile(remaining);
  return true;
}

function getFilePath(): string {
  return path.join(process.cwd(), "content", "blog-posts.json");
}

async function readBlogPostsFile(): Promise<BlogPost[]> {
  const filePath = getFilePath();

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

async function writeBlogPostsFile(posts: BlogPost[]): Promise<void> {
  const filePath = getFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(posts, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
