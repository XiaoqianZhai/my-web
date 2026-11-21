import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  tools: string[];
  details: string[];
};

export type ProjectFieldErrors = Partial<
  Record<"title" | "summary" | "role" | "tools" | "details", string>
>;

export class ProjectSlugConflictError extends Error {
  constructor(slug: string) {
    super(`A project with the slug "${slug}" already exists.`);
    this.name = "ProjectSlugConflictError";
  }
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "project";
}

export function validateProject(values: {
  title: string;
  summary: string;
  role: string;
  tools: unknown;
  details: unknown;
}): ProjectFieldErrors {
  const errors: ProjectFieldErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title can't be blank.";
  }
  if (!values.summary.trim()) {
    errors.summary = "Summary can't be blank.";
  }
  if (!values.role.trim()) {
    errors.role = "Role can't be blank.";
  }
  if (
    !Array.isArray(values.tools) ||
    values.tools.some((tool) => typeof tool !== "string")
  ) {
    errors.tools = "Tools must be a list of strings.";
  }
  if (
    !Array.isArray(values.details) ||
    values.details.some((detail) => typeof detail !== "string")
  ) {
    errors.details = "Details must be a list of strings.";
  }

  return errors;
}

export async function getProjects(): Promise<Project[]> {
  return readProjectsFile();
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await readProjectsFile();
  return projects.find((project) => project.slug === slug);
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await readProjectsFile();

  if (projects.some((existing) => existing.slug === project.slug)) {
    throw new ProjectSlugConflictError(project.slug);
  }

  projects.push(project);
  await writeProjectsFile(projects);
}

export async function updateProject(
  slug: string,
  updates: Omit<Project, "slug">,
): Promise<Project | undefined> {
  const projects = await readProjectsFile();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return undefined;
  }

  const updated: Project = { slug, ...updates };
  projects[index] = updated;
  await writeProjectsFile(projects);
  return updated;
}

export async function deleteProject(slug: string): Promise<boolean> {
  const projects = await readProjectsFile();
  const remaining = projects.filter((project) => project.slug !== slug);
  if (remaining.length === projects.length) {
    return false;
  }

  await writeProjectsFile(remaining);
  return true;
}

function getFilePath(): string {
  return path.join(process.cwd(), "content", "projects.json");
}

async function readProjectsFile(): Promise<Project[]> {
  const filePath = getFilePath();

  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("projects.json does not contain a JSON array");
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return [];
  }
}

async function writeProjectsFile(projects: Project[]): Promise<void> {
  const filePath = getFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(projects, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
