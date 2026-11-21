import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export type ContactSubmissionSource = "server-form" | "api";

export type ContactSubmission = ContactFormValues & {
  id: string;
  submittedAt: string;
  source: ContactSubmissionSource;
};

export function validateContactForm(
  values: ContactFormValues,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = values.name.trim();
  const email = values.email;
  const message = values.message.trim();

  if (!name) {
    errors.name = "Name can't be blank.";
  }
  if (!message) {
    errors.message = "Message can't be blank.";
  }

  if (!email.trim()) {
    errors.email = "Email can't be blank.";
  } else if (/\s/.test(email)) {
    errors.email = "Email can't contain whitespace.";
  } else if (email.indexOf("@") === -1 || email.indexOf("@") !== email.lastIndexOf("@")) {
    errors.email = "Email must contain exactly one @.";
  } else {
    const [local, domain] = email.split("@");
    if (!local) {
      errors.email = "Email needs something before the @.";
    } else if (!domain.includes(".") || domain.split(".").some((part) => !part)) {
      errors.email =
        "The part after the @ must contain a dot with no empty parts, like name@example.com.";
    }
  }

  return errors;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return readSubmissionsFile();
}

export async function getContactSubmissionById(
  id: string,
): Promise<ContactSubmission | undefined> {
  const submissions = await readSubmissionsFile();
  return submissions.find((submission) => submission.id === id);
}

export async function saveContactSubmission(
  submission: Omit<ContactSubmission, "id">,
): Promise<void> {
  const submissions = await readSubmissionsFile();
  submissions.push({ id: randomUUID(), ...submission });
  await writeSubmissionsFile(submissions);
}

export async function updateContactSubmission(
  id: string,
  updates: ContactFormValues,
): Promise<ContactSubmission | undefined> {
  const submissions = await readSubmissionsFile();
  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: ContactSubmission = { ...submissions[index], ...updates };
  submissions[index] = updated;
  await writeSubmissionsFile(submissions);
  return updated;
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const submissions = await readSubmissionsFile();
  const remaining = submissions.filter((submission) => submission.id !== id);
  if (remaining.length === submissions.length) {
    return false;
  }

  await writeSubmissionsFile(remaining);
  return true;
}

function getFilePath(): string {
  return path.join(process.cwd(), "data", "contact-submissions.json");
}

async function readSubmissionsFile(): Promise<ContactSubmission[]> {
  const filePath = getFilePath();

  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("contact-submissions.json does not contain a JSON array");
    }

    let addedIds = false;
    const submissions: ContactSubmission[] = parsed.map((submission) => {
      if (submission.id) {
        return submission;
      }
      addedIds = true;
      return { ...submission, id: randomUUID() };
    });

    if (addedIds) {
      await writeSubmissionsFile(submissions);
    }

    return submissions;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return [];
  }
}

async function writeSubmissionsFile(submissions: ContactSubmission[]): Promise<void> {
  const filePath = getFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(submissions, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
