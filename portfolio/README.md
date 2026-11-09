# Portfolio site

A personal portfolio for Xiaoqian Zhai built with Next.js (App Router),
TypeScript, and Tailwind CSS. Fully static pages plus a contact form that
saves submissions on the server through a server action.

## Requirements

- Node.js (with npm)

## How to run

From this folder (`portfolio/`):

```
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```
npm run build
npm run start
```

Lint and type checks run as part of `npm run build` (or `npm run lint`).

## Pages

- `/` — landing page with intro, highlights, and links
- `/about-me` — background, education, skills
- `/projects` — project cards
- `/projects/[slug]` — project detail pages (`greencity-logistics`,
  `analytics-showdown-gna`); unknown slugs show a scoped 404 page
- `/contact-me-server-form` — contact form; submissions are validated on the
  server and appended to `data/contact-submissions.json` (file is created on
  first submission; it is gitignored)

## Where things live

- `lib/projects.ts` — project data (single source for the list and detail pages)
- `lib/contact.ts` — contact form validation and JSON storage (reusable by a
  future `/api/contact` route)
- `app/contact-me-server-form/actions.ts` — the server action
- `components/` — shared UI (site nav, project card, contact form)

This project was developed with **Viber** (an AI coding agent) in incremental
steps. All code was reviewed, tested, and verified by the author, who is
responsible for the final work.
