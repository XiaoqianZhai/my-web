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
    slug: "greencity-logistics",
    title: "GreenCity Logistics",
    summary:
      "Group project using optimization for warehouse selection, zone assignment, and vehicle fleet sizing with goal programming.",
    // TODO: add your role in the group (e.g., modeling, data preparation, validation)
    role: "TODO: describe your role on this project",
    // TODO: list the tools/software used (e.g., modeling language, solver, spreadsheet)
    tools: [],
    // TODO: add 3-5 bullet points on the approach, what you built, and results once known
    details: [],
  },
  {
    slug: "analytics-showdown-gna",
    title: "SCU Analytics Showdown",
    summary:
      "Analyzed Good Nature Agro farmer-level data in a Jupyter notebook; built yield prediction models and risk segmentation classifiers.",
    // TODO: add your role on this project
    role: "TODO: describe your role on this project",
    tools: ["Jupyter Notebook"],
    // TODO: add 3-5 bullet points on the approach, what you built, and results once known
    details: [],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
