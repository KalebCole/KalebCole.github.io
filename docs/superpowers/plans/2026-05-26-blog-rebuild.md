# Portfolio → Minimal Blog Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Astro portfolio at `KalebCole.github.io` with a minimal, Raroque-inspired blog-centric site: landing page + Astro Content Collections blog + GitHub-pinned-repos projects list + RSS, with light-default theme and persisted dark toggle.

**Architecture:** Astro 5 static build → Vercel adapter. Shared `Layout.astro` injects fonts and runs an inline pre-paint script that reads `localStorage` to set `data-mode` on `<html>` (no flash). All visual styling lives in `src/styles/global.css` as semantic CSS classes (`.wrap`, `.post`, `.polaroid`, etc.) using CSS custom properties for the cream palette; Tailwind is removed from page templates but stays installed for future opt-in. Blog posts come from `src/content/blog/*.md` via the `glob` loader with a zod schema; drafts are filtered out at query time. Pinned repos are fetched at build time via GitHub GraphQL using a `GITHUB_TOKEN` env var, with a silent empty fallback when missing.

**Tech Stack:** Astro 5, Astro Content Collections (`glob` loader + zod), `@astrojs/rss`, `@astrojs/vercel` adapter, vanilla CSS with CSS custom properties, GitHub GraphQL API v4. Google Fonts: Instrument Serif (headings) + DM Sans (body).

---

## File Plan

**Create:**
- `src/content.config.ts`: collection schema (blog)
- `src/content/blog/hello-world.md`: seed post
- `src/content/blog/draft-example.md`: draft post (verifies draft filtering)
- `src/components/ThemeToggle.astro`: light/dark toggle button
- `src/components/Polaroid.astro`: rotated photo card
- `src/components/PinnedRepos.astro`: pinned-repo list (renders fetched data)
- `src/components/SiteNav.astro`: minimal top nav (home, blog, theme toggle)
- `src/layouts/Post.astro`: single-post wrapper (title block + prose + back link)
- `src/lib/github.ts`: GitHub GraphQL fetch with graceful fallback
- `src/pages/blog/index.astro`: blog index, grouped by year
- `src/pages/blog/[...slug].astro`: single post route
- `src/pages/rss.xml.js`: RSS feed
- `src/pages/404.astro`: minimal 404
- `.env.example`: documents required env vars

**Modify:**
- `package.json`: add `@astrojs/rss`
- `.gitignore`: also ignore `.env.local`
- `src/layouts/Layout.astro`: replace Tailwind body classes with semantic CSS + add inline theme-bootstrap script
- `src/styles/global.css`: replace `@import "tailwindcss"` with the prototype's CSS-vars + semantic classes
- `src/pages/index.astro`: full rewrite: landing using prototype's design
- `README.md`: document blog authoring, env vars, deploy

**Delete:**
- `src/pages/prototype-typography.astro`: design is locked; prototype is no longer needed

---

## Task 1: Install RSS dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto)

- [ ] **Step 1: Install `@astrojs/rss`**

Run:
```bash
cd C:\repos\KalebCole.github.io
npm install @astrojs/rss
```

Expected: `package.json` now lists `@astrojs/rss` under `dependencies`. `npm install` exits 0.

- [ ] **Step 2: Verify install**

Run:
```bash
node -e "console.log(require('@astrojs/rss/package.json').version)"
```

Expected: a version string prints (e.g. `4.x.x`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @astrojs/rss for blog feed"
```

---

## Task 2: Update `.gitignore` and add `.env.example`

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Add `.env.local` to `.gitignore`**

Open `.gitignore` and ensure it contains:
```
node_modules/
dist/
.astro/
.vercel/
.env
.env.local
```

(Append `.env.local` on a new line if missing.)

- [ ] **Step 2: Create `.env.example`**

Create `.env.example` with:
```
# Fine-grained GitHub PAT (Public Repositories, read-only).
# Required at build time to populate pinned repos on the landing page.
# When unset locally, the pinned-repos section silently renders empty.
GITHUB_TOKEN=
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: ignore .env.local and document env vars"
```

---

## Task 3: Define blog content collection

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    updated: z.date().optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(content): define blog collection schema"
```

---

## Task 4: Seed blog posts (one published + one draft)

**Files:**
- Create: `src/content/blog/hello-world.md`
- Create: `src/content/blog/draft-example.md`

- [ ] **Step 1: Create `src/content/blog/hello-world.md`**

```markdown
---
title: "Hello, world"
date: 2026-05-26
description: "First post on the new site. Why I rebuilt it."
tags: ["meta", "writing"]
draft: false
---

I rewrote this site to make writing the default.

The old version was a portfolio with widgets and animation. This one is a
blog with a small landing page. Less is, in fact, more.

If you're reading this, the new build works.
```

- [ ] **Step 2: Create `src/content/blog/draft-example.md`**

```markdown
---
title: "This is a draft"
date: 2026-05-26
description: "If you can see this on the live site, draft filtering is broken."
tags: ["meta"]
draft: true
---

This post should never appear in `/blog`, `/rss.xml`, or the landing-page
recent-posts list. It is here purely to verify draft filtering.
```

- [ ] **Step 3: Verify Astro recognizes the collection**

Run:
```bash
npx astro sync
```

Expected: completes with no schema errors; `.astro/` regenerates types.

- [ ] **Step 4: Commit**

```bash
git add src/content/blog/hello-world.md src/content/blog/draft-example.md
git commit -m "content: seed hello-world post and draft example"
```

---

## Task 5: Replace `global.css` with cream palette + semantic classes

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace the entire file contents**

Overwrite `src/styles/global.css` with:

```css
/* ---------- Theme variables (cream palette) ---------- */
:root,
html[data-mode="light"] {
  --bg: #fafaf7;
  --fg: #1a1a1a;
  --muted: #6b6b6b;
  --rule: #e6e6e1;
  --accent: #2e7d4f;
}

html[data-mode="dark"] {
  --bg: #0e0e0d;
  --fg: #ececea;
  --muted: #8a8a85;
  --rule: #232321;
  --accent: #6fcf97;
}

/* ---------- Base ---------- */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); }
body {
  font-family: 'DM Sans', system-ui, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .post-title, .site-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.005em;
}

h1 { font-size: 3rem; line-height: 1.1; margin: 0 0 0.5rem; }
h2 { font-size: 1.5rem; margin: 3rem 0 1rem; }
p  { margin: 0 0 1rem; }

a {
  color: var(--fg);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--rule);
}
a:hover { text-decoration-color: var(--accent); color: var(--accent); }

.muted { color: var(--muted); }

/* ---------- Layout ---------- */
.wrap {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 24px 160px;
  position: relative;
}

/* ---------- Nav ---------- */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 56px;
  font-size: 0.95rem;
}
.nav a { margin-right: 1rem; }
.nav .spacer { flex: 1; }

/* ---------- Polaroid ---------- */
.polaroid {
  display: block;
  float: right;
  width: 180px;
  height: 220px;
  margin: 4px -40px 12px 20px;
  padding: 10px 10px 36px;
  background: var(--bg);
  border: 1px solid var(--rule);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: rotate(3deg);
}
.polaroid img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
@media (max-width: 640px) {
  .polaroid { float: none; margin: 16px auto; }
}

/* ---------- Post list ---------- */
.post { padding: 1rem 0; border-bottom: 1px solid var(--rule); }
.post:last-child { border-bottom: none; }
.post-title { font-size: 1.4rem; margin: 0 0 0.25rem; }
.post-meta  { font-size: 0.85rem; color: var(--muted); margin: 0 0 0.4rem; }
.post-desc  { font-size: 0.95rem; color: var(--muted); margin: 0; }

.year-heading {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 2.5rem 0 0.5rem;
}

/* ---------- Tags ---------- */
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0.5rem 0; }
.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--muted);
}

/* ---------- Inline projects (landing) ---------- */
.inline-projects a { margin-right: 0.5rem; }

/* ---------- Pinned repos ---------- */
.repos { list-style: none; padding: 0; margin: 0; }
.repos li { padding: 0.75rem 0; border-bottom: 1px solid var(--rule); }
.repos li:last-child { border-bottom: none; }
.repos .repo-name { font-weight: 500; }
.repos .repo-lang { font-size: 0.8rem; color: var(--muted); margin-left: 0.5rem; }
.repos .repo-desc { font-size: 0.9rem; color: var(--muted); margin: 0.2rem 0 0; }

/* ---------- Footer ---------- */
.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--rule);
  font-size: 0.9rem;
  color: var(--muted);
}
.footer a { margin-right: 1rem; }

/* ---------- Theme toggle button ---------- */
.theme-toggle {
  background: transparent;
  border: 1px solid var(--rule);
  color: var(--fg);
  width: 36px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}
.theme-toggle:hover { border-color: var(--accent); color: var(--accent); }

/* ---------- Prose (single post) ---------- */
.prose { font-size: 1.05rem; }
.prose h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
.prose h3 { font-size: 1.2rem; margin: 1.5rem 0 0.75rem; }
.prose p, .prose li { color: var(--fg); }
.prose ul, .prose ol { padding-left: 1.25rem; }
.prose code {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 0.9em;
  background: var(--rule);
  padding: 0.1em 0.35em;
  border-radius: 3px;
}
.prose pre {
  background: var(--rule);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}
.prose pre code { background: transparent; padding: 0; }
.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--muted);
  margin: 1.5rem 0;
}
.prose img { max-width: 100%; height: auto; border-radius: 4px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: cream palette + semantic classes (replaces Tailwind import)"
```

---

## Task 6: Rewrite `Layout.astro` with theme bootstrap (no flash)

**Files:**
- Modify: `src/layouts/Layout.astro`

The key concern: setting `data-mode` BEFORE first paint so a dark-mode user does not see a white flash. The bootstrap script must run synchronously in `<head>` and set the attribute on `<html>` (not `<body>`, because background/color cascades from `html`).

- [ ] **Step 1: Replace `src/layouts/Layout.astro` contents**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const {
  title,
  description = 'Kaleb Cole: Software Engineer, Builder, Explorer.',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap"
      rel="stylesheet"
    />
    <title>{title}</title>

    <script is:inline>
      (function () {
        try {
          var saved = localStorage.getItem('theme-mode');
          var mode = saved === 'dark' || saved === 'light' ? saved : 'light';
          document.documentElement.setAttribute('data-mode', mode);
        } catch (e) {
          document.documentElement.setAttribute('data-mode', 'light');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(layout): theme bootstrap with no-flash mode toggle"
```

---

## Task 7: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create the component**

```astro
---
// Pure client-side toggle. Reads/writes `theme-mode` in localStorage and
// flips `data-mode` on <html>. The initial value was set by the inline
// bootstrap script in Layout.astro, so this only handles user clicks.
---
<button
  type="button"
  class="theme-toggle"
  aria-label="Toggle color theme"
  data-theme-toggle
>
  <span data-icon-light>☀</span>
  <span data-icon-dark style="display:none">☾</span>
</button>

<script is:inline>
  (function () {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    var light = btn.querySelector('[data-icon-light]');
    var dark = btn.querySelector('[data-icon-dark]');

    function sync() {
      var mode = document.documentElement.getAttribute('data-mode') || 'light';
      light.style.display = mode === 'light' ? '' : 'none';
      dark.style.display  = mode === 'dark'  ? '' : 'none';
    }
    sync();

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-mode') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-mode', next);
      try { localStorage.setItem('theme-mode', next); } catch (e) {}
      sync();
    });
  })();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat(components): ThemeToggle with localStorage persistence"
```

---

## Task 8: SiteNav component

**Files:**
- Create: `src/components/SiteNav.astro`

- [ ] **Step 1: Create the component**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
---
<nav class="nav">
  <a href="/">Kaleb Cole</a>
  <span class="spacer"></span>
  <a href="/blog">Writing</a>
  <a href="/rss.xml">RSS</a>
  <ThemeToggle />
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SiteNav.astro
git commit -m "feat(components): SiteNav"
```

---

## Task 9: Polaroid component

**Files:**
- Create: `src/components/Polaroid.astro`

- [ ] **Step 1: Create the component**

Uses a placeholder image (picsum) until the user drops a real photo at `public/me.jpg`.

```astro
---
interface Props {
  src?: string;
  alt?: string;
}
const {
  src = 'https://picsum.photos/seed/kc/360/440',
  alt = 'Placeholder photo of Kaleb',
} = Astro.props;
// TODO: when the user drops a real photo at /me.jpg, default `src` to '/me.jpg'.
---
<span class="polaroid">
  <img src={src} alt={alt} />
</span>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Polaroid.astro
git commit -m "feat(components): Polaroid (placeholder image)"
```

---

## Task 10: GitHub pinned-repos library

**Files:**
- Create: `src/lib/github.ts`

The function must NEVER throw: failures (no token, rate-limit, network) silently resolve to `[]` so the landing page still builds.

- [ ] **Step 1: Create the library**

```ts
export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string } | null;
}

const QUERY = `{
  user(login: "KalebCole") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          primaryLanguage { name }
        }
      }
    }
  }
}`;

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN missing: pinned repos will be empty.');
    return [];
  }
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'kalebcole.github.io build',
      },
      body: JSON.stringify({ query: QUERY }),
    });
    if (!res.ok) {
      console.warn(`[github] HTTP ${res.status}: pinned repos will be empty.`);
      return [];
    }
    const json = (await res.json()) as {
      data?: { user?: { pinnedItems?: { nodes?: PinnedRepo[] } } };
      errors?: unknown;
    };
    if (json.errors) {
      console.warn('[github] GraphQL errors: pinned repos will be empty.', json.errors);
      return [];
    }
    return json.data?.user?.pinnedItems?.nodes ?? [];
  } catch (err) {
    console.warn('[github] fetch failed: pinned repos will be empty.', err);
    return [];
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/github.ts
git commit -m "feat(lib): GitHub pinned-repos fetch with graceful fallback"
```

---

## Task 11: PinnedRepos component

**Files:**
- Create: `src/components/PinnedRepos.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { getPinnedRepos } from '../lib/github';
const repos = await getPinnedRepos();
---
{repos.length > 0 && (
  <ul class="repos">
    {repos.map((r) => (
      <li>
        <a href={r.url} class="repo-name">{r.name}</a>
        {r.primaryLanguage && <span class="repo-lang">{r.primaryLanguage.name}</span>}
        {r.description && <p class="repo-desc">{r.description}</p>}
      </li>
    ))}
  </ul>
)}
```

When `repos` is empty (local dev without token, or fetch failed), the component renders nothing: no error UI, no placeholder. This is intentional.

- [ ] **Step 2: Commit**

```bash
git add src/components/PinnedRepos.astro
git commit -m "feat(components): PinnedRepos (silent empty fallback)"
```

---

## Task 12: Rewrite landing page (`src/pages/index.astro`)

**Files:**
- Modify: `src/pages/index.astro` (full rewrite: original is portfolio, deleted entirely)

- [ ] **Step 1: Overwrite `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import SiteNav from '../components/SiteNav.astro';
import Polaroid from '../components/Polaroid.astro';
import PinnedRepos from '../components/PinnedRepos.astro';

const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const recentPosts = allPosts
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---
<Layout title="Kaleb Cole">
  <main class="wrap">
    <SiteNav />

    <h1>Kaleb Cole</h1>
    <p class="muted">Software engineer at Microsoft. Builder, explorer, occasional writer.</p>

    <Polaroid />
    <p>
      I'm a software engineer who builds things that matter. Currently working on
      Cloud + AI at Microsoft in Seattle. I care about developer tools, automation,
      and making complex systems feel simple.
    </p>

    <h2>Recent writing</h2>
    {recentPosts.map((post) => (
      <article class="post">
        <h3 class="post-title">
          <a href={`/blog/${post.id}`}>{post.data.title}</a>
        </h3>
        <p class="post-meta">
          {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
        <p class="post-desc">{post.data.description}</p>
      </article>
    ))}
    <p style="margin-top: 1rem;"><a href="/blog">All posts →</a></p>

    <h2>Projects</h2>
    <PinnedRepos />

    <div class="footer">
      <a href="https://github.com/KalebCole">GitHub</a>
      <a href="https://linkedin.com/in/kaleb-cole">LinkedIn</a>
      <a href="mailto:kalebcole2021@gmail.com">Email</a>
    </div>
  </main>
</Layout>
```

Note: In Astro 5 content collections with the `glob` loader, the post key is exposed as `post.id` (already slug-shaped). If a build error reports `post.slug` missing or `post.id` wrong, swap to whichever the installed Astro version exposes.

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): rewrite landing page (minimal blog-centric)"
```

---

## Task 13: Post layout (`src/layouts/Post.astro`)

**Files:**
- Create: `src/layouts/Post.astro`

- [ ] **Step 1: Create the layout**

```astro
---
import Layout from './Layout.astro';
import SiteNav from '../components/SiteNav.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  tags: string[];
}
const { title, description, date, updated, tags } = Astro.props;
const fmt = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<Layout title={`${title} | Kaleb Cole`} description={description}>
  <main class="wrap">
    <SiteNav />
    <article>
      <h1>{title}</h1>
      <p class="post-meta">
        {fmt(date)}
        {updated && <> · updated {fmt(updated)}</>}
      </p>
      {tags.length > 0 && (
        <div class="tags">
          {tags.map((t) => <span class="tag">{t}</span>)}
        </div>
      )}
      <div class="prose">
        <slot />
      </div>
      <p style="margin-top: 3rem;"><a href="/blog">← All posts</a></p>
    </article>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Post.astro
git commit -m "feat(layout): Post layout with tags and prose styling"
```

---

## Task 14: Blog index (`src/pages/blog/index.astro`)

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create the page**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import SiteNav from '../../components/SiteNav.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

// Group by year, preserving sort order.
const groups = new Map<number, typeof posts>();
for (const post of posts) {
  const year = post.data.date.getFullYear();
  if (!groups.has(year)) groups.set(year, []);
  groups.get(year)!.push(post);
}
const years = [...groups.keys()];
---
<Layout title="Writing | Kaleb Cole">
  <main class="wrap">
    <SiteNav />
    <h1>Writing</h1>
    <p class="muted">Notes, essays, and half-finished thoughts.</p>

    {years.map((year) => (
      <section>
        <h2 class="year-heading">{year}</h2>
        {groups.get(year)!.map((post) => (
          <article class="post">
            <h3 class="post-title">
              <a href={`/blog/${post.id}`}>{post.data.title}</a>
            </h3>
            <p class="post-meta">
              {post.data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p class="post-desc">{post.data.description}</p>
          </article>
        ))}
      </section>
    ))}
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(pages): /blog index grouped by year"
```

---

## Task 15: Single post route (`src/pages/blog/[...slug].astro`)

**Files:**
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create the route**

```astro
---
import { getCollection, render } from 'astro:content';
import Post from '../../layouts/Post.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<Post
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  updated={post.data.updated}
  tags={post.data.tags}
>
  <Content />
</Post>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/[...slug].astro
git commit -m "feat(pages): single post route with Content collection render"
```

---

## Task 16: RSS feed (`src/pages/rss.xml.js`)

**Files:**
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: Create the feed**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Kaleb Cole',
    description: 'Writing by Kaleb Cole.',
    site: context.site ?? 'https://kalebcole.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
    })),
  });
}
```

- [ ] **Step 2: Set `site` in `astro.config.mjs`** so RSS absolute links work.

Open `astro.config.mjs` and add a `site` property:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://kalebcole.dev',
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
```

(If the user's production URL is different, swap the value. A value is required so RSS link resolution works.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.js astro.config.mjs
git commit -m "feat(pages): RSS feed at /rss.xml"
```

---

## Task 17: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Layout from '../layouts/Layout.astro';
import SiteNav from '../components/SiteNav.astro';
---
<Layout title="Not found | Kaleb Cole">
  <main class="wrap">
    <SiteNav />
    <h1>404</h1>
    <p class="muted">There's nothing here.</p>
    <p><a href="/">← Home</a></p>
  </main>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat(pages): minimal 404"
```

---

## Task 18: Delete prototype page

**Files:**
- Delete: `src/pages/prototype-typography.astro`

- [ ] **Step 1: Remove the file**

Run:
```bash
git rm src/pages/prototype-typography.astro
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove typography prototype (design locked)"
```

---

## Task 19: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md` with**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for new blog structure"
```

---

## Task 20: Production build verification

**Files:** (none; verification only)

- [ ] **Step 1: Stop any running dev server**

If a dev server is running from a previous session, stop it. On Windows PowerShell, list listening node processes:
```bash
Get-NetTCPConnection -LocalPort 4321 -ErrorAction SilentlyContinue
```
If a PID is shown, `Stop-Process -Id <PID>`.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: exits 0. Output ends with something like `[build] Complete!` and lists pages: `/`, `/blog`, `/blog/hello-world`, `/rss.xml`, `/404`. **The draft post must NOT appear in the page list.** If a `GITHUB_TOKEN` warning logs, that's fine for local dev.

If the build fails with a `post.id` vs `post.slug` error in Task 12, 14, or 15, swap the property name to match the installed Astro version and re-run.

- [ ] **Step 3: Preview**

```bash
npm run preview
```

Open http://localhost:4321 and verify:
- Landing page renders with the cream palette
- Polaroid is rotated, float-right, tucked into intro paragraph
- Recent posts list shows "Hello, world" (and NOT "This is a draft")
- Projects section shows pinned repos if `GITHUB_TOKEN` is set, nothing if not
- Click the theme toggle (sun/moon button in nav): page flips to dark, persists across reload
- Reload while in dark mode: there should be no white flash before dark applies
- `/blog`: shows hello-world grouped under 2026, NOT the draft
- `/blog/hello-world`: renders the markdown
- `/rss.xml`: returns valid XML with one `<item>` (hello-world), NOT the draft
- Resize to <640px width: polaroid centers under the intro instead of floating right

- [ ] **Step 4: If everything passes, commit any incidental fixes**

```bash
git status
# If unstaged changes exist from fixes during verification:
git add -A
git commit -m "fix: verification fixes from production build"
```

If everything builds clean with no fixes needed, no commit is required for this task.

---

## Task 21: Final cleanup pass

- [ ] **Step 1: Confirm prototype is gone**

```bash
git ls-files | grep prototype
```
Expected: no output.

- [ ] **Step 2: Confirm Tailwind is no longer used in templates**

```bash
grep -rE "class=\".*(bg-|text-|font-|p-|m-|flex|grid)" src/
```
Expected: no matches in any `.astro` file. (Tailwind itself stays in `package.json` and `astro.config.mjs`; it's still installed, just unused in templates, which is fine.)

- [ ] **Step 3: Push**

```bash
git push origin main
```

Expected: Vercel kicks off a deploy. The user must have set `GITHUB_TOKEN` in Vercel env vars beforehand for pinned repos to appear in production.

---

## Open / deferred (do NOT implement in this plan)
- Real polaroid photo at `public/me.jpg`
- Per-tag pages
- Pagination on `/blog`
- Reading time
- Comments
