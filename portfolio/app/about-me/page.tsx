import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
};

export default function AboutPage() {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <p className="text-foreground/80">
          I&apos;m Xiaoqian Zhai, an MSBA candidate at Santa Clara University
          based in the San Francisco Bay Area. I completed my undergraduate
          studies in Cultural Industry Management at Sichuan Normal University
          before moving into business analytics.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Education</h2>
        <ul className="space-y-4">
          <li>
            <p className="font-medium">
              M.S. in Business Analytics, Santa Clara University
            </p>
          </li>
          <li>
            <p className="font-medium">
              Bachelor&apos;s in Cultural Industry Management, Sichuan Normal
              University
            </p>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
        <ul className="list-disc space-y-2 pl-5 text-foreground/80">
          <li>
            <span className="font-medium text-foreground">
              Optimization modeling:
            </span>{" "}
            linear programming (LP), integer linear programming (ILP), goal
            programming, network flow
          </li>
          <li>Python</li>
          <li>R</li>
          <li>Tableau</li>
        </ul>
      </div>
    </section>
  );
}
