import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export type ContactSubmission = ContactFormValues & {
  submittedAt: string;
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

export async function saveContactSubmission(
  submission: ContactSubmission,
): Promise<void> {
  const filePath = path.join(process.cwd(), "data", "contact-submissions.json");

  let submissions: ContactSubmission[] = [];
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("contact-submissions.json does not contain a JSON array");
    }
    submissions = parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  submissions.push(submission);

  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(submissions, null, 2) + "\n", "utf8");
  await rename(tempPath, filePath);
}
