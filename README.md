# kalebcole.dev

Personal site + blog. Built with [Astro 5](https://astro.build) and deployed to Vercel.

## Local development

```bash
npm install
cp .env.example .env.local   # add your GitHub PAT (optional locally)
npm run dev
```

Visit http://localhost:4321.

## Writing a post

Create a file in `src/content/blog/`:

```markdown
---
title: "Post title"
date: 2026-05-26
description: "One-sentence summary."
tags: ["foo", "bar"]
draft: false        # omit or set true to hide from listings & RSS
updated: 2026-06-01 # optional
---

Body in Markdown.
```

Drafts (`draft: true`) are excluded from `/blog`, `/rss.xml`, and the landing-page
recent-posts list at build time.

## Environment variables

| Name           | Where it's used                    | Required?                  |
| -------------- | ---------------------------------- | -------------------------- |
| `GITHUB_TOKEN` | Build-time pinned-repos GraphQL    | Yes in production. Local dev silently shows no projects when missing. |

Create a **fine-grained PAT** at <https://github.com/settings/personal-access-tokens>:
- Resource owner: your account
- Repository access: **Public Repositories (read-only)**
- Expiration: 1 year (set a calendar reminder to rotate)

Add it to `.env.local` for local dev. In production, set `GITHUB_TOKEN` in
Vercel project settings → Environment Variables.

## Deploy

Production builds run on Vercel using `@astrojs/vercel`. Push to `main` to deploy.

## Release certification

Run `npm run certify` to build the static publication and verify the emitted
routes, feeds, metadata, internal links, accessibility contracts, identity
assets, progressive-enhancement hooks, and release budgets.

The normative cold-cache budgets from `DESIGN.md` are compressed HTML, CSS,
and first-party JavaScript at no more than 50 KiB each; fonts at no more than
220 KiB; the LCP image at no more than 300 KiB; and each initial route at no
more than 800 KiB across at most 25 requests, with no third-party JavaScript by
default. Browser and assistive-technology checks that cannot run in automation
must be recorded explicitly rather than inferred from this command.

### Certification limitations

`npm run certify` does not claim browser or assistive-technology coverage. The
issue #46 release report records the separate Chromium production-preview
checks and their evidence. The following checks require environments that are
not available in the local release workspace. Their disclosure is an explicit
acceptance criterion in #46; no observed failure is waived, so these are not
release exceptions under the exception process in `DESIGN.md`.

| Routes | Unavailable criterion | Known impact | Owner | Follow-up point |
| --- | --- | --- | --- | --- |
| All public routes | Current/previous Safari, Firefox, Edge, iOS Safari, and Chrome for Android | None observed in Chromium; engine- and device-specific defects remain possible | Kaleb Cole | Next production cross-browser check |
| All public routes | NVDA + Firefox and VoiceOver + Safari | Automated structure and Chromium accessibility-tree checks pass; screen-reader phrasing and navigation remain unverified | Kaleb Cole | Next production assistive-technology check |
| All public routes | Real iPhone/Android touch, safe-area, and favicon browser-chrome inspection | Emulated reflow and DPR checks pass; physical input and browser chrome remain unverified | Kaleb Cole | Next production device check |
| Representative routes | External preview and representative field Core Web Vitals | Local production-preview lab evidence is not field data | Kaleb Cole | First production telemetry review |

## Roadmap (deferred)

- Per-tag pages
- Pagination on `/blog`
- Reading time
