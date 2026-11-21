import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
};

const adminLinks = [
  {
    href: "/admin/blogs",
    label: "Blog admin",
    description: "Create, edit, and delete blog posts.",
  },
  {
    href: "/admin/projects",
    label: "Project admin",
    description: "Create, edit, and delete projects.",
  },
  {
    href: "/admin/contacts",
    label: "Contact admin",
    description: "Review, add, edit, and delete contact submissions.",
  },
];

export default function AdminPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-foreground/80">
          Manage the site content through the JSON APIs.
        </p>
      </div>
      <ul className="space-y-4">
        {adminLinks.map(({ href, label, description }) => (
          <li key={href} className="rounded-2xl border border-black/10 p-6">
            <Link
              href={href}
              className="text-lg font-medium underline underline-offset-4"
            >
              {label}
            </Link>
            <p className="mt-1 text-sm text-foreground/80">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
