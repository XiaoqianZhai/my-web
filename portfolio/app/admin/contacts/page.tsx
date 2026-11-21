import type { Metadata } from "next";
import ContactAdminForm from "@/components/ContactAdminForm";

export const metadata: Metadata = {
  title: "Contact admin",
};

export default function ContactAdminPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact admin</h1>
        <p className="text-foreground/80">
          Review, add, edit, and delete contact submissions. Everything goes
          through the JSON API and uses the same file as the contact forms.
        </p>
      </div>
      <ContactAdminForm />
    </section>
  );
}
