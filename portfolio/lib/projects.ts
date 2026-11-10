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
    slug: "alibaba-fliggy",
    title: "Operations at Alibaba (Fliggy)",
    summary:
      "Worked in operations at Fliggy, Alibaba's travel platform, covering payment collections, website optimization, and user relationship management.",
    role: "Operations in the Fliggy department.",
    tools: [],
    details: [
      "Worked in operations for Fliggy, Alibaba's travel platform.",
      "Handled payment collections.",
      "Worked on website optimization.",
      "Worked on user relationship management.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
