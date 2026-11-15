# Prompt log

Prompt log for Assignment 2 (portfolio website), Viber session. Some prompts were drafted with help from Claude.

Only the major prompts that built the assignment are listed; setup, git/SSH and other housekeeping messages are left out.

Each entry below is a message I sent to the Viber coding assistant, in order, copied exactly as I wrote it, with a short note on what it produced. Commit hashes refer to this repository.

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

These prompts were drafted with help from Claude. Each entry below is a message I sent to the Viber coding assistant, in order, copied exactly as I wrote it, with the commit it produced. Commit hashes refer to this repository.

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
