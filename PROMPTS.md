# Prompt log

Prompt log for Assignment 2 (portfolio website), Viber session. Some prompts were drafted with help from Claude.

Only the major prompts that built the assignment are listed; setup, git/SSH and other housekeeping messages are left out.

Each entry below is a message I sent to the Viber coding assistant, in order, copied exactly as sent, with a short note on what it produced. Commit hashes refer to this repository.

## 1. Initial request: set up layout and static pages

> I'm building a personal portfolio site for a class assignment with Next.js (App Router, TypeScript, Tailwind). Let's work in small steps. For this step, only set up the layout and the static pages. Don't build the contact form or the project detail pages yet.
>
> Pages:
> - / : landing page with my name, a one-line intro, short highlights, and links to Projects and Contact
> - /about-me : background, education, skills
> - /projects : a list of project cards, each linking to /projects/[slug] (detail pages come in the next step)
>
> Shared layout:
> - A site header on every page with nav links to Home, About Me, Projects, and Contact (/contact-me-server-form)
> - Highlight the current page in the nav
>
> Structure:
> - Put reusable UI in components/ (e.g. SiteNav, ProjectCard)
> - Put project data in one file, lib/projects.ts, as an array of { slug, title, summary, role, tools, details }. Both the list page and the future detail page should read from this file.
>
> Content (use this; don't invent numbers, results, or claims. Put a clearly marked TODO wherever details are missing):
> - Name: Xiaoqian Zhai
> - MSBA candidate at Santa Clara University, based in the San Francisco Bay Area
> - Undergraduate background in Cultural Industry Management
> - Skills: optimization modeling (LP, ILP, goal programming, network flow), Python, R, Tableau
> - Project 1, slug "greencity-logistics": GreenCity Logistics, a group project using optimization for warehouse selection, zone assignment, and vehicle fleet sizing with goal programming
> - Project 2, slug "analytics-showdown-gna": SCU Analytics Showdown, analyzing Good Nature Agro farmer-level data; built yield prediction models and risk segmentation classifiers in a Jupyter notebook
>
> When you're done, list the files you created or changed and briefly explain what each one does.

Note: scaffolded the Next.js app in `portfolio/` (TypeScript, Tailwind, App Router) and built the shared layout with `SiteNav`, the landing page, about page, and projects list with `ProjectCard`, using `lib/projects.ts` as the single data source.

## 2. Project detail pages

> Next step: add the dynamic project detail page at /projects/[slug].- Use the existing getProjectBySlug helper in lib/projects.ts. Don't duplicate the lookup logic in the page.- "greencity-logistics" and "analytics-showdown-gna" must each show their own title, summary, role, tools, and details- For an unknown slug (e.g. /projects/does-not-exist), call notFound() and add a not-found page for this route that says the project wasn't found and links back to /projects- Use generateStaticParams for the known slugs- Use the params API that matches the installed Next.js version (16)Run lint and build, then check that both valid slugs return 200 with different content and the unknown slug returns 404 with the not-found message. Commit with a clear message (don't push; the push is blocked until I set up GitHub auth). Tell me which files changed.

Note: added `app/projects/[slug]/page.tsx` (Next 16 Promise-based params, `generateStaticParams`, per-project metadata) and a scoped `app/projects/[slug]/not-found.tsx`. Disabled `cacheComponents` in `next.config.ts` so unknown slugs return a real 404 instead of a streamed soft 404. Commit `fa9bf8b`.

## 3. Contact form with server action

> ok now the contact form at /contact-me-server-form. use a server action for now (no api route yet). fields: name, email, message, each with a label. save every submission into data/contact-submissions.json (add to the list, create the file if it's missing). validation has to happen on the server: name and message can't be blank after trimming. email: no spaces, exactly one @, something before the @, and the part after @ needs a dot with no empty parts (so a@b, a@.com, a@b..com should fail). show the errors next to the fields, a clear success message when it works, and a different message if something breaks on the server. put the validation and the saving in lib/ so I can reuse them for /api/contact in part 2. turn off browser validation (noValidate) so I can show the server errors in my demo. test one valid case and the bad cases, then commit (don't push). also explain the flow from clicking submit to the json file in simple words so I understand it for my video. thanks!

Note: added `lib/contact.ts` (reusable validation + JSON storage), `app/contact-me-server-form/actions.ts` (server action), `app/contact-me-server-form/page.tsx`, and `components/ContactForm.tsx` (`useActionState`, `noValidate`, per-field errors, success/server-error messages). Tested valid and bad cases end-to-end. Commit `89ea261`.

## 4. Full pre-submission check, email whitespace rule, README

> nice. can you double check everything against the assignment before I submit? 4 pages with real content + nav links work, /projects/[slug] works for both slugs and the unknown one, and the contact form server validation. one question: does the email get trimmed before checking? the rule says no whitespace, so " a@b.com" should fail too I think. if it's trimmed, fix that. also replace portfolio/README.md with short instructions on how to run it. then give me a small table of test inputs and what should happen so I can test them myself in the browser: valid one, name = only spaces, message = only spaces, ab.com, a@@b.com, @b.com, a@b, a@.com, a@b..com, a b@c.com. commit (don't push).

Note: confirmed the email was trimmed first and fixed it so any whitespace fails; rewrote `portfolio/README.md` with run instructions; re-ran the full check suite. Commit `4e2bbdc`.

## 5. Replace project content (Uber practicum + portfolio site)

> I need to fix the content: I didn't actually do the greencity and GNA projects, so replace both. project 1, slug "uber-practicum": MSBA practicum with Uber's Ads Finance team (4-person team), we analyzed accounts receivable disputes and the unbilled backlog; my role was automation and machine learning, I built the backlog risk-score model. keep it high level, no numbers or internal data since it's a company project, and don't make up tools or results. project 2, slug "portfolio-website": this portfolio site itself, built for ISBA 2438 with Next.js (App Router, TypeScript, Tailwind) using the Viber coding agent: dynamic project pages and a contact form with server-side validation that saves to a JSON file. also fix the home page highlight that still mentions the old projects. on the about page remove the TODO lines for graduation year and undergrad school, just keep MSBA candidate at Santa Clara University and undergrad background in Cultural Industry Management. make sure no TODO text shows on any page. run lint and build, check both new slugs work and the old slugs now 404, then commit and push.

Note: replaced both projects in `lib/projects.ts`, made the home-page highlight derive project titles from the data, removed the education TODO lines, updated the README slug list. Old slugs now 404. Commit `f73319b`.

## 6. About page education line

> on the about page, change the undergrad line to "Bachelor's in Cultural Industry Management, Sichuan Normal University" and mention Sichuan Normal University in the intro paragraph too. don't add years or other details. check the page, then commit and push.

Note: intro paragraph and education entry on `/about-me` now mention Sichuan Normal University. Commit `d412138`.

## Part 2

These prompts were drafted with help from Claude. Each entry below is a message I sent to the Viber coding assistant, in order, copied exactly as sent, with the commit it produced. Commit hashes refer to this repository.

## 7. JSON API for the contact form

> Part 2 of my portfolio assignment, step 1: a JSON API for the contact form. Please read the repo first (the Next.js app is in portfolio/).
>
> Context: in Part 1, /contact-me-server-form submits to the server action submitContact in portfolio/app/contact-me-server-form/actions.ts. That action calls validateContactForm and saveContactSubmission from portfolio/lib/contact.ts, which append to data/contact-submissions.json (commits 89ea261 and 4e2bbdc).
>
> Change: add a Next.js App Router Route Handler at portfolio/app/api/contact/route.ts that exports POST. It reads a JSON body { name, email, message }, validates with the existing validateContactForm (no second copy of the rules), and saves with the existing saveContactSubmission so the API and the server form write to the same JSON file. Use NextResponse.json with clear status codes: 201 { ok: true } on success, 400 { errors } with per-field messages on validation failure, 400 if the body is not valid JSON or not an object, and 500 { error } if saving fails.
>
> Decisions and why: (1) add a source field to every saved entry, "server-form" or "api", and pass "server-form" from the existing server action, so I can tell in the shared file where each submission came from. (2) my handout mentions both /api/contact and /api/contacts, so make portfolio/app/api/contacts/route.ts re-export the same POST handler instead of duplicating code.
>
> How to check: run lint and build, start the app, and use curl to POST a valid body (expect 201), blank name, blank message, the emails a@@b.com, a@b and "a b@c.com" (expect 400 with the matching field error), and a broken JSON body (expect 400). Confirm the valid one is appended to data/contact-submissions.json with source "api". Commit only the files you changed (not the Python files at the repo root), don't push yet, and tell me the commit hash and what changed in each file.

Note: added `app/api/contact/route.ts` (shared validation and storage, source tagging) and the `app/api/contacts/route.ts` re-export; the server action now passes `source: "server-form"`. Commit `aefb626`.

## 8. Contact page that posts to the API

> nice. next, make a new /contact-me page that sends the form to /api/contact with fetch (POST, JSON) instead of the server action. put the form in a client component like components/ContactApiForm.tsx and keep the same labels and styles as ContactForm.tsx so both forms look the same. show the field errors when the api returns 400, a success message on 201, and a different error message if the request fails. add the page to the nav, test a valid and some invalid ones, then commit.

Note: added `components/ContactApiForm.tsx` (fetch to `/api/contact`, per-field errors, success and network-error messages), `app/contact-me/page.tsx`, and a nav link; fixed the active-link check so `/contact-me` and `/contact-me-server-form` highlight independently. Commit `c9a4052`.

## 9. Blog storage and API

> did that get committed? if not, commit it first. then the blog part: add lib/blogs.ts (similar to lib/contact.ts) to read and save posts in a json file, and an api route app/api/blogs/route.ts with GET (return all posts, newest first) and POST (title, summary, content are required, make a slug from the title, 400 for missing fields, 409 if the slug already exists, 201 when it's created). save posts in content/blog-posts.json instead of data/ because data/ is gitignored and I want the posts in the repo so the blog pages work after cloning. add 2 short starter posts: one about building this portfolio with an AI coding agent (working in small steps and reviewing the code, like the email whitespace bug we found), and one about why I validate forms on the server. don't make up numbers. test it with curl, remove any test posts, then commit.

Note: added `lib/blogs.ts` (types, slugify, validation, JSON storage with slug-conflict error), `app/api/blogs/route.ts` (GET newest first, POST with 400/409/201), and `content/blog-posts.json` with the two starter posts. Commit `a8261bd`.

## 10. Blog pages and admin form

> great. now the blog pages. /blogs should call GET /api/blogs with fetch and list all posts (title, date, summary) with links to /blogs/[slug]. /blogs/[slug] is a dynamic route like the project pages: show the full post and use notFound() for an unknown slug. /admin/blogs has a form (title, summary, content) that POSTs to /api/blogs with fetch, shows the errors from the api (400 / 409), and shows a link to the new post when it works. also redirect /blog-posts to /blogs since my notes mention that path, and add Blogs to the nav. new posts should show up without rebuilding the app. test it in the app, remove any test posts, then commit and push.

Note: added `components/BlogList.tsx` (client fetch, so new posts appear without a rebuild), `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx` (`force-dynamic`, `notFound()`) with its `not-found.tsx`, `components/BlogAdminForm.tsx` with `app/admin/blogs/page.tsx`, the `/blog-posts` redirect, and the Blogs nav link. Commit `e50296f`.

## 11. Cleanup refactor, blog post rewording, prompt log

> last cleanup before I submit. some code is repeated: the same inputClasses and label/input/error markup is in ContactForm, ContactApiForm and BlogAdminForm, and both api routes parse the JSON body the same way. pull those into small shared pieces (like components/FormField.tsx and a readJsonObject helper in lib/), and use ContactFormValues from lib/contact.ts instead of a second type in ContactApiForm, so there's one copy of each. don't change how anything works. also the first blog post says "I spotted a bug" and that I read every diff and ran the app myself, which isn't quite accurate. please reword it to say a review step caught the email whitespace bug and each step was tested before it was committed. then lint, build, quickly re-test both contact forms and the blog api, and add this session's prompts to the end of PROMPTS.md under a "Part 2" heading that starts with "These prompts were drafted with help from Claude." (copy them exactly, with the commit for each). commit, push, and tell me the full commit hash.

Note: added `components/FormField.tsx` (shared label/input/textarea/error markup and `inputClasses`) used by all three forms, `lib/read-json-object.ts` (shared JSON body parsing) used by both API routes, and switched `ContactApiForm` to the shared `ContactFormValues`/`ContactFieldErrors` types; reworded the first blog post's summary and content for accuracy. Commit: this commit.

## Part 2 critique

1. lib/blog-format.ts (commit e50296f)
The agent first imported a date helper from lib/blogs.ts into a browser component, and the build failed because that file reads files on the server. Its fix, moving the helper into lib/blog-format.ts, was accepted so server code stays on the server. Checked with npm run build and by opening /blogs: the build passed and both posts showed with dates.

2. content/blog-posts.json (commit 03298d3)
The agent's first blog post said "I spotted a bug" and that I read every diff myself, which wasn't accurate. The wording was changed to say a review step caught the email bug and each step was tested before committing. Checked by opening the post on /blogs: it now shows the corrected wording.

## Midterm

These prompts were drafted with help from Claude. Each entry below is a message I sent to the Viber coding assistant, in order, copied exactly as sent, with the commit it produced. Commit hashes refer to this repository. Housekeeping lines inside the prompts (git restores and commit requests) are cut and marked with [...].

## 12. Full CRUD for projects

> [...]
>
> Then for the midterm I need full CRUD for projects. Right now projects are hard coded in lib/projects.ts. Please:
> - move the project data into content/projects.json (same fields)
> - add API routes: GET and POST /api/projects, and GET, PUT, DELETE /api/projects/[slug]. POST should return 201. Validate the fields like we did for blogs
> - make /projects and /projects/[slug] read from the JSON so new projects show up (unknown slug should still show not found)
> - add an /admin/projects page where I can create, edit and delete projects through the API
> - add a console.log in each API handler (method, path, status) so I can show server logs in my video
> Keep it simple and reuse FormField and ProjectCard.

Note: moved the project data to `content/projects.json` and rewrote `lib/projects.ts` with fs-backed storage, `validateProject`, and a slug-conflict error; added `app/api/projects/route.ts` (GET/POST) and `app/api/projects/[slug]/route.ts` (GET/PUT/DELETE, Next 16 `RouteContext`) with a method/path/status `console.log` on every response; switched the projects pages and home page to read the JSON (`force-dynamic`); added `app/admin/projects/page.tsx` with `components/ProjectAdminForm.tsx` (create/edit/delete, reusing `FormField` and `ProjectCard`). Commit `d307533`.

## 13. Blogs and contacts CRUD, /admin hub

> [...]
>
> Next do the same CRUD for blogs and contact submissions:
> - blogs: add GET, PUT, DELETE /api/blogs/[slug]. On /admin/blogs show the list of posts with edit and delete buttons
> - contacts: give each submission an id (old ones without an id should still work). Add GET /api/contact to list them and GET, PUT, DELETE /api/contact/[id]. Make a new /admin/contacts page where I can see all submissions, add one, edit and delete. Keep using the same JSON file as the server form
> - same console.log in every handler
> - add an Admin link in the nav that goes to a simple /admin page with links to the admin pages
> Then run the build and commit.

Note: added `app/api/blogs/[slug]/route.ts` (GET/PUT/DELETE) and gave `BlogAdminForm` the post list with edit and delete; contact submissions now get a `randomUUID` id and old records without one are backfilled and saved on first read; added GET to `app/api/contact/route.ts`, `app/api/contact/[id]/route.ts` (GET/PUT/DELETE), and `components/ContactAdminForm.tsx` with `app/admin/contacts/page.tsx`; added `app/admin/page.tsx` and the Admin nav link; added the method/path/status log to the existing blog handlers. Commit `ac696f9`.

## 14. Courses page with CRUD API and CourseCard

> [...]
>
> Now my custom feature: a Courses page that shows the MSBA courses I've taken.
> - store courses in content/courses.json (id, code, name, term, notes on what I learned)
> - add GET and POST /api/courses and GET, PUT, DELETE /api/courses/[id], POST returns 201, same validation style and console.log as the others
> - make a /courses page where the parent component fetches from /api/courses and passes each course down to a CourseCard component as props
> - on the same page I should be able to add, edit and delete courses
> - add Courses to the nav and to the /admin page
> - put one starter course in the JSON: ISBA 2438 AI Assisted Software Development, Fall 2026, notes: building a Next.js portfolio with the Viber coding agent. I'll add the rest myself
> Then build and commit.

Note: added `content/courses.json` (seeded with ISBA 2438), `lib/courses.ts`, `app/api/courses/route.ts` (GET/POST) and `app/api/courses/[id]/route.ts` (GET/PUT/DELETE); `components/CoursesManager.tsx` is the parent component that fetches `/api/courses` and passes each course to `components/CourseCard.tsx` as props, with the add/edit/delete form on the same `/courses` page; Courses added to the nav and `/admin`. Commit `e6c5a4d`.

## 15. localStorage study to-do list

> Last feature: a study to-do list that uses browser localStorage (no API for this one).
> - new /todo page with a TodoList component
> - I can add a task with a title, a due date and a priority (low / medium / high), check it off, delete it, and clear all
> - every change saves the list to localStorage with JSON.stringify under one key like "study-todos"
> - on page load read it back with JSON.parse so the tasks are still there after refresh
> - if there is nothing saved show "No tasks yet". If the saved data is broken (not valid JSON or not an array) don't crash, just start with an empty list and show a small message
> - add To-Do to the nav
> Then build and commit.

Note: added `app/todo/page.tsx` and `components/TodoList.tsx` (add with title, due date, priority; check off; delete; clear all; one `persist` helper saves with `JSON.stringify` under `study-todos` and the load reads back with `JSON.parse`; broken saved data starts an empty list with a message instead of crashing). `FormField` now also accepts `type="date"`. Commit `34af066`.
