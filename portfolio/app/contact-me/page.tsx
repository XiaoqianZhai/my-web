import type { Metadata } from "next";
import ContactApiForm from "@/components/ContactApiForm";

export const metadata: Metadata = {
  title: "Contact (API)",
};

export default function ContactApiPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact (API)</h1>
        <p className="text-foreground/80">
          Send me a message using the form below.
        </p>
      </div>
      <ContactApiForm />
    </section>
  );
}
