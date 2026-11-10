export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  tools: string[];
  details: string[];
};

export const projects: Project[] = [
  {
    slug: "uber-practicum",
    title: "Uber Ads Finance Practicum",
    summary:
      "MSBA practicum with Uber's Ads Finance team: a 4-person team analyzing accounts receivable disputes and the unbilled backlog.",
    role: "My role focused on automation and machine learning; I built the backlog risk-score model.",
    tools: [],
    details: [
      "Worked with Uber's Ads Finance team as part of the MSBA practicum.",
      "Analyzed accounts receivable disputes and the unbilled backlog.",
      "Focused on automation and machine learning, including the backlog risk-score model.",
    ],
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "This site itself: a class project for ISBA 2438 built with Next.js (App Router), TypeScript, and Tailwind CSS, developed with the Viber coding agent.",
    role: "Solo project, developed with the Viber coding agent.",
    tools: ["Next.js (App Router)", "TypeScript", "Tailwind CSS"],
    details: [
      "Dynamic project detail pages rendered from a single shared data file.",
      "Contact form with server-side validation that saves submissions to a JSON file.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
