# Compact Responsive Navigation Implementation Plan

> **For Hermes:** Implement this plan task-by-task, with the static certification assertion added before its production markup.

**Goal:** Replace the wrapping shared navigation at tablet and phone widths with a compact Kaleb Cole identity pill and an accessible three-line menu control that reveals every primary destination and the theme control.

**Architecture:** Keep the desktop navigation unchanged above a content-driven 760px breakpoint. In `SiteNav.astro`, add a progressively enhanced native menu trigger and a labelled menu panel alongside the existing identity link. An inline script owns only the open state, Escape handling, outside-click dismissal, and trigger state. CSS hides the desktop link row at and below the breakpoint, displays the 44px menu control, and prevents the header from becoming a two-line link cluster.

**Tech Stack:** Astro 5, semantic HTML, scoped inline JavaScript, existing global CSS tokens, Node static certification.

---

### Task 1: Add a failing static navigation contract

**Objective:** Define the rendered markup required for a compact menu before changing the component.

**Files:**
- Modify: `scripts/certify.mjs:310-324`

**Step 1: Add a failing assertion for the trigger and panel**

Add checks against the homepage output for:

```js
assert.match(homepage, /<details\b[^>]*class="nav-menu"/i, 'navigation must render a compact menu panel');
assert.match(homepage, /data-nav-toggle[^>]*aria-controls="primary-nav-menu"/i, 'navigation must expose a compact menu trigger');
```

**Step 2: Run the certification command to verify failure**

Run: `GITHUB_TOKEN="" npm run certify`

Expected: FAIL because the current shared navigation has neither `data-nav-toggle` nor `.nav-menu`.

### Task 2: Add the compact menu markup and interaction

**Objective:** Keep all primary links and the theme control available through a keyboard-operable menu.

**Files:**
- Modify: `src/components/SiteNav.astro:16-29`

**Step 1: Add the native trigger and menu panel**

- Preserve `.site-home` as the first link.
- Replace the current `.nav-links` container with a native `<details>` menu panel that contains the existing primary links and `ThemeToggle`.
- Retain the established Résumé link alongside Writing, Recommends, Projects, and Feed.
- Add a `<summary>` control with `data-nav-toggle`, `aria-controls="primary-nav-menu"`, and an explicit accessible label. Let the native disclosure supply its accurate expanded/collapsed state.
- Draw three lines with spans, rather than a Unicode glyph.
- Render the panel open in the desktop-first document so navigation remains available without JavaScript; close it only when the compact breakpoint applies.

**Step 2: Add a small inline controller**

- Synchronize the compact control's accessible label with the native disclosure state.
- Close on Escape and return focus to the trigger.
- Close when a destination link is selected or when a click lands outside the navigation.
- Do not intercept native theme-toggle behavior.

**Step 3: Run the certification command to verify the static contract passes**

Run: `GITHUB_TOKEN="" npm run certify`

Expected: PASS, with the existing expected warning that pinned repositories are empty without a token.

### Task 3: Replace the wrapping breakpoint with compact-menu styling

**Objective:** Use a content-driven breakpoint before link labels can wrap, while preserving the full desktop layout above it.

**Files:**
- Modify: `src/styles/global.css:191-308`
- Modify: `src/styles/global.css:1287-1332`

**Step 1: Add the desktop and compact control styles**

- Use the existing `--ground`, `--ink`, `--rule`, `--blue`, and `--soft-blue` tokens.
- Size the trigger at 44px by 44px, including coarse-pointer use.
- Give the menu panel a clear ink boundary and compact vertical link rhythm.
- Keep focus visibility through the existing global `:focus-visible` treatment.

**Step 2: Add one `@media (max-width: 760px)` compact-nav rule**

- Keep the navigation header as a single horizontal row.
- Hide the desktop link row while the menu is closed.
- Show the three-line trigger and position the opened panel below the header without clipping.
- Remove the obsolete 680px wrapping rules and 420px block-navigation rules.

**Step 3: Run the certification command**

Run: `GITHUB_TOKEN="" npm run certify`

Expected: PASS.

### Task 4: Verify real rendered behavior and responsive bounds

**Objective:** Prove that the navigation does not wrap or horizontally overflow and that the menu works by keyboard and pointer.

**Files:**
- Verify only: `src/components/SiteNav.astro`, `src/styles/global.css`, `scripts/certify.mjs`

**Step 1: Build and start the local preview**

Run:

```bash
GITHUB_TOKEN="" npm run certify
npm run preview -- --host 127.0.0.1
curl --fail http://127.0.0.1:4321/
```

**Step 2: Run browser assertions at desktop and compact widths**

Verify these states in a fresh local browser session:

- At 1440px, the full navigation is visible and compact trigger is hidden.
- At 760px, 540px, 390px, and 320px, the identity pill and menu button share one header row with no navigation-induced horizontal overflow.
- At compact widths, clicking the button opens all destinations and the theme control.
- Enter/Space opens the menu, Escape closes it and returns focus, and Tab reaches the revealed links.

**Step 3: Capture desktop and mobile evidence**

Capture exact viewport screenshots at 1440×900 and 390×844 after asserting the navigation bounds are within the viewport.

**Step 4: Run the detector once**

Run:

```bash
node /Users/kalebcole/.hermes/skills/impeccable/scripts/detect.mjs --json src/components/SiteNav.astro src/styles/global.css
```

Expected: no material design finding tied to the navigation change.

### Task 5: Review change scope and prepare the PR-ready result

**Objective:** Confirm the feature is isolated from Kaleb's existing homepage prototype work.

**Files:**
- Review only: `docs/plans/2026-09-05-compact-responsive-navigation.md`, `src/components/SiteNav.astro`, `src/styles/global.css`, `scripts/certify.mjs`

**Step 1: Inspect the focused diff**

Run:

```bash
git diff --check -- docs/plans/2026-09-05-compact-responsive-navigation.md src/components/SiteNav.astro src/styles/global.css scripts/certify.mjs
git diff --stat -- docs/plans/2026-09-05-compact-responsive-navigation.md src/components/SiteNav.astro src/styles/global.css scripts/certify.mjs
```

**Step 2: Report the verification evidence**

Report the certification result, detector result, responsive measurements, screenshot paths, and the fact that no commit, push, or PR was created.
