import type { Metadata } from "next";
import TodoList from "@/components/TodoList";

export const metadata: Metadata = {
  title: "To-Do",
};

export default function TodoPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Study to-do list</h1>
        <p className="text-foreground/80">
          Tasks are saved in your browser with localStorage, so they are still
          here after a refresh. They do not sync between browsers or devices.
        </p>
      </div>
      <TodoList />
    </section>
  );
}
