import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export type Course = {
  id: string;
  code: string;
  name: string;
  term: string;
  notes: string;
};

export type CourseFieldErrors = Partial<
  Record<"code" | "name" | "term" | "notes", string>
>;

export function validateCourse(values: {
  code: string;
  name: string;
  term: string;
  notes: string;
}): CourseFieldErrors {
  const errors: CourseFieldErrors = {};

  if (!values.code.trim()) {
    errors.code = "Course code can't be blank.";
  }
  if (!values.name.trim()) {
    errors.name = "Course name can't be blank.";
  }
  if (!values.term.trim()) {
    errors.term = "Term can't be blank.";
  }
  if (!values.notes.trim()) {
    errors.notes = "Notes can't be blank.";
  }

  return errors;
}

export async function getCourses(): Promise<Course[]> {
  return readCoursesFile();
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courses = await readCoursesFile();
  return courses.find((course) => course.id === id);
}

export async function saveCourse(course: Omit<Course, "id">): Promise<Course> {
  const courses = await readCoursesFile();
  const newCourse: Course = { id: randomUUID(), ...course };
  courses.push(newCourse);
  await writeCoursesFile(courses);
  return newCourse;
}

export async function updateCourse(
  id: string,
  updates: Omit<Course, "id">,
): Promise<Course | undefined> {
  const courses = await readCoursesFile();
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Course = { id, ...updates };
  courses[index] = updated;
  await writeCoursesFile(courses);
  return updated;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const courses = await readCoursesFile();
  const remaining = courses.filter((course) => course.id !== id);
  if (remaining.length === courses.length) {
    return false;
  }

  await writeCoursesFile(remaining);
  return true;
}

function getFilePath(): string {
  return path.join(process.cwd(), "content", "courses.json");
}

async function readCoursesFile(): Promise<Course[]> {
  const filePath = getFilePath();

  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("courses.json does not contain a JSON array");
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return [];
  }
}

async function writeCoursesFile(courses: Course[]): Promise<void> {
  const filePath = getFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(courses, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
