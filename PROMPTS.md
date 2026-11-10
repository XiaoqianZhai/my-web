# Prompt log

Prompt log for Assignment 2 (portfolio website), Viber session. Some prompts were drafted with help from Claude.

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

## 2. Answer to question: where should the app live?

> The Next.js app is in the `portfolio/` folder.
> cd portfolio
> npm install
> npm run dev

Note: chose a `portfolio/` subfolder so the app stays separate from the Python assignment files at the repo root.

## 3. First commit and push attempt

> git add .git commit -m "Add portfolio layout, nav, landing, about-me, projects pages"
> git push

Note: repo had no commits and no remote yet, so I was asked how to scope the commit and where to push (see next two answers). Result after answers: commit `cc32318` (portfolio files only); the push failed on GitHub authentication over HTTPS.

## 4. Answer to question: commit scope

> Only portfolio/ (Recommended)

Note: only `portfolio/` files went into the commit; the Python assignment files stayed untracked.

## 5. Answer to question: push target

> Remote URL: https://github.com/XiaoqianZhai/my-web.git — Commit only the portfolio/ folder (leave the Python files untracked), then add this as the origin remote and push. The GitHub repo already has one "Initial commit" containing only an auto-generated README.md with the line "# my-web", so a normal push will be rejected. It's safe to overwrite it: push with git push -u origin HEAD:main --force. If the push fails because of GitHub authentication, tell me exactly what I need to do and stop.

Note: commit `cc32318` created; remote `origin` added; push failed because no GitHub credentials were configured — stopped and gave SSH setup steps.

## 6. Project detail pages

> Next step: add the dynamic project detail page at /projects/[slug].- Use the existing getProjectBySlug helper in lib/projects.ts. Don't duplicate the lookup logic in the page.- "greencity-logistics" and "analytics-showdown-gna" must each show their own title, summary, role, tools, and details- For an unknown slug (e.g. /projects/does-not-exist), call notFound() and add a not-found page for this route that says the project wasn't found and links back to /projects- Use generateStaticParams for the known slugs- Use the params API that matches the installed Next.js version (16)Run lint and build, then check that both valid slugs return 200 with different content and the unknown slug returns 404 with the not-found message. Commit with a clear message (don't push; the push is blocked until I set up GitHub auth). Tell me which files changed.

Note: added `app/projects/[slug]/page.tsx` (Next 16 Promise-based params, `generateStaticParams`, per-project metadata) and a scoped `app/projects/[slug]/not-found.tsx`. Disabled `cacheComponents` in `next.config.ts` so unknown slugs return a real 404 instead of a streamed soft 404. Commit `fa9bf8b`.

## 7. Contact form with server action

> ok now the contact form at /contact-me-server-form. use a server action for now (no api route yet). fields: name, email, message, each with a label. save every submission into data/contact-submissions.json (add to the list, create the file if it's missing). validation has to happen on the server: name and message can't be blank after trimming. email: no spaces, exactly one @, something before the @, and the part after @ needs a dot with no empty parts (so a@b, a@.com, a@b..com should fail). show the errors next to the fields, a clear success message when it works, and a different message if something breaks on the server. put the validation and the saving in lib/ so I can reuse them for /api/contact in part 2. turn off browser validation (noValidate) so I can show the server errors in my demo. test one valid case and the bad cases, then commit (don't push). also explain the flow from clicking submit to the json file in simple words so I understand it for my video. thanks!

Note: added `lib/contact.ts` (reusable validation + JSON storage), `app/contact-me-server-form/actions.ts` (server action), `app/contact-me-server-form/page.tsx`, and `components/ContactForm.tsx` (`useActionState`, `noValidate`, per-field errors, success/server-error messages). Tested valid and bad cases end-to-end. Commit `89ea261`.

## 8. Full pre-submission check, email whitespace rule, README

> nice. can you double check everything against the assignment before I submit? 4 pages with real content + nav links work, /projects/[slug] works for both slugs and the unknown one, and the contact form server validation. one question: does the email get trimmed before checking? the rule says no whitespace, so " a@b.com" should fail too I think. if it's trimmed, fix that. also replace portfolio/README.md with short instructions on how to run it. then give me a small table of test inputs and what should happen so I can test them myself in the browser: valid one, name = only spaces, message = only spaces, ab.com, a@@b.com, @b.com, a@b, a@.com, a@b..com, a b@c.com. commit (don't push).

Note: confirmed the email was trimmed first and fixed it so any whitespace fails; rewrote `portfolio/README.md` with run instructions; re-ran the full check suite. Commit `4e2bbdc`.

## 9. Copy SSH public key to clipboard, start dev server

> copy my ssh public key (~/.ssh/id_ed25519.pub) to the clipboard with pbcopy, don't print it. then start the dev server for portfolio in the background on port 3000 and leave it running so I can open it in the browser.

Note: copied the key with `pbcopy` and started `npm run dev` in the background on port 3000.

## 10. Clipboard trouble, copy again

> github said the key is invalid, I think my clipboard got overwritten. copy the public key to the clipboard again please

Note: re-copied the key and verified the clipboard matches the file byte for byte.

## 11. Show the public key

> i'm confused about what to paste. show me the public key itself in a code block (it's the public one so it's fine) and copy it to the clipboard again

Note: displayed the public key and re-copied it; explained GitHub rejects duplicate keys if it is already attached to another account.

## 12. Fingerprint check

> what's the SHA256 fingerprint of ~/.ssh/id_ed25519.pub? (ssh-keygen -lf) I want to double check it on github

Note: ran `ssh-keygen -lf` and reported the fingerprint.

## 13. Switch remote to SSH and push

> ok the key is added on github (fingerprint matches). now switch the remote to ssh and push, same as before: git push -u origin HEAD:main --force. accept github's host key if it asks

Note: remote switched to `git@github.com:XiaoqianZhai/my-web.git`, host key accepted, and all commits up to `4e2bbdc` pushed (force-pushed over the initial commit).

## 14. Replace project content (Uber practicum + portfolio site)

> I need to fix the content: I didn't actually do the greencity and GNA projects, so replace both. project 1, slug "uber-practicum": MSBA practicum with Uber's Ads Finance team (4-person team), we analyzed accounts receivable disputes and the unbilled backlog; my role was automation and machine learning, I built the backlog risk-score model. keep it high level, no numbers or internal data since it's a company project, and don't make up tools or results. project 2, slug "portfolio-website": this portfolio site itself, built for ISBA 2438 with Next.js (App Router, TypeScript, Tailwind) using the Viber coding agent: dynamic project pages and a contact form with server-side validation that saves to a JSON file. also fix the home page highlight that still mentions the old projects. on the about page remove the TODO lines for graduation year and undergrad school, just keep MSBA candidate at Santa Clara University and undergrad background in Cultural Industry Management. make sure no TODO text shows on any page. run lint and build, check both new slugs work and the old slugs now 404, then commit and push.

Note: replaced both projects in `lib/projects.ts`, made the home-page highlight derive project titles from the data, removed the education TODO lines, updated the README slug list. Old slugs now 404. Commit `f73319b`.

## 15. Replace portfolio-website with Alibaba (Fliggy)

> change of plan for project 2: replace the portfolio-website project with my work at Alibaba. slug "alibaba-fliggy", title something like "Operations at Alibaba (Fliggy)". I worked in operations in the Fliggy department (Alibaba's travel platform): payment collections, website optimization, and user relationship management. same rules as Uber: high level only, no numbers, don't make up tools, results or dates. update anything else that mentions the portfolio-website project, check both slugs work and /projects/portfolio-website now 404s, then commit and push.

Note: `portfolio-website` replaced with `alibaba-fliggy`; README updated. Both current slugs verified 200 with their own content, all three removed slugs verified 404. Commit `b1273f0`.

## 16. Open files in VS Code for the demo video

> open the portfolio folder in VS Code (open -a "Visual Studio Code") with these files open so I can show them in my video: components/ContactForm.tsx, app/contact-me-server-form/actions.ts, lib/contact.ts. don't change any code.

Note: opened the folder in VS Code with those three files as tabs; no code changed.

## 17. About page education line

> on the about page, change the undergrad line to "Bachelor's in Cultural Industry Management, Sichuan Normal University" and mention Sichuan Normal University in the intro paragraph too. don't add years or other details. check the page, then commit and push.

Note: intro paragraph and education entry on `/about-me` now mention Sichuan Normal University. Commit `d412138`.

## 18. Check for accidental hand edits

> I think I accidentally changed something in the code by hand. can you check git status and git diff and tell me what changed? don't fix or revert anything yet.

Note: working tree was clean — no tracked files had changed; only the long-standing untracked Python assignment files were listed.

## 19. This prompt log

> my teacher wants the prompt log on github. please create PROMPTS.md in the repo root (next to the portfolio folder) that lists every message I sent you in this session, in order, copied exactly as I wrote them (don't rewrite, shorten or fix them), including my answers to your questions. under each one add a short note on what changed and the commit hash if there was one. at the top write: "Prompt log for Assignment 2 (portfolio website), Viber session. Some prompts were drafted with help from Claude." commit only PROMPTS.md (not the python files) and push, then tell me the new commit hash.

Note: created this file and committed it.
