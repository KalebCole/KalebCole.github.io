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

## Roadmap (deferred)

- Real polaroid photo at `public/me.jpg` (placeholder uses picsum.photos)
- Per-tag pages
- Pagination on `/blog`
- Reading time
