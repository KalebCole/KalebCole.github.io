# Mobile Portrait Order Implementation Plan

> **For Hermes:** Use this plan task by task and verify each acceptance criterion before opening the pull request.

**Goal:** Place Kaleb’s portrait between “Hi, I’m Kaleb.” and the “I make things” statement on phone screens while preserving the current desktop hero.

**Architecture:** Split the greeting and main statement into separate semantic elements so the portrait can sit between them in DOM and visual order. Use the centered one-column composition through 849px, then preserve the two-column desktop composition at 850px and above. Keep unrelated content grids on their existing breakpoints.

**Tech Stack:** Astro 5, CSS Grid, Node.js certification scripts, local headless Chrome visual checks

---

### Task 1: Encode the new responsive contract

**Objective:** Make the repository documentation and automated certification describe the requested phone layout.

**Files:**
- Modify: `DESIGN.md:164-175`
- Modify: `DESIGN.md:374-388`
- Modify: `scripts/certify.mjs:301`

**Step 1: Update the certification assertion**

Replace the assertion that requires the complete introduction and actions before the portrait with assertions that check the default mobile grid order and matching source order:

```js
assert.match(
  globalCss,
  /grid-template-areas:\s*"greeting"\s*"portrait"\s*"statement"\s*"subtitle"\s*"actions";/,
  'homepage mobile layout must place the portrait between the greeting and statement',
);
const homepageGreetingIndex = homepage.indexOf('class="home-greeting"');
const homepagePortraitIndex = homepage.indexOf('class="portrait-mount"');
const homepageStatementIndex = homepage.indexOf('class="home-statement"');
assert.ok(
  homepageGreetingIndex < homepagePortraitIndex && homepagePortraitIndex < homepageStatementIndex,
  'homepage source order must place the portrait between the greeting and statement',
);
```

**Step 2: Run certification to verify failure**

Run: `GITHUB_TOKEN="" npm run certify`

Expected: FAIL with `homepage mobile layout must place the portrait between the greeting and statement`.

**Step 3: Update the design contract**

State that phone screens show the greeting, portrait, complete remaining introduction, and actions in that order. Preserve the rule against squeezing the portrait beside a narrow paragraph.

**Step 4: Keep scope focused**

Do not change copy, portrait assets, desktop composition, project cards, writing, or recommendations.

### Task 2: Move the portrait in source and phone grid order

**Objective:** Place the existing portrait between the greeting and main statement without creating a visual and screen-reader order mismatch.

**Files:**
- Modify: `src/pages/index.astro:25-33`
- Modify: `src/styles/global.css:335-348`

**Step 1: Separate the greeting and statement**

Keep “Hi, I’m Kaleb.” as the page `h1`, render the portrait next, and render the “I make things” statement as the following lead paragraph.

**Step 2: Change the default grid areas**

Use this phone order:

```css
grid-template-areas:
  "greeting"
  "portrait"
  "statement"
  "subtitle"
  "actions";
```

Update the homepage desktop media query so both text elements remain on the left and the portrait spans their rows on the right at 850px and above.

**Step 3: Run certification to verify pass**

Run: `GITHUB_TOKEN="" npm run certify`

Expected: PASS for the build, repository certification, theme-toggle certification, and navigation tests.

### Task 3: Verify rendered phone and desktop layouts

**Objective:** Confirm the requested visual order and guard against clipping or desktop regressions.

**Files:**
- Verify: `dist/index.html`
- Create outside the repository: phone and desktop screenshots

**Step 1: Start the production preview**

Run: `npm run preview -- --host 127.0.0.1 --port 48765`

Verify readiness with: `curl --fail http://127.0.0.1:48765/`

**Step 2: Capture exact viewport screenshots**

Use local headless Chrome to capture:

- Phone: 390 by 844 pixels
- Desktop: 1440 by 1000 pixels

**Step 3: Inspect both screenshots**

Confirm on phone that the visible order is greeting, portrait, “I make things” statement, subtitle, and actions. Confirm on desktop that the portrait remains to the right of the complete introduction. Check for clipping and horizontal overflow.

**Step 4: Review the diff**

Run: `git diff --check` and `git diff --stat origin/master...HEAD`.

Expected: only the plan, design contract, homepage markup, certification assertions, and responsive grid rules change.

### Task 4: Publish the pull request

**Objective:** Commit the focused change, push it, and open a pull request for Vercel review.

**Files:**
- Commit only the five files named above.

**Step 1: Commit**

Commit message: `fix: move portrait into mobile introduction`

**Step 2: Push**

Run: `git push -u origin fix/mobile-portrait-order`

**Step 3: Open the pull request**

Use a concise summary and include the exact certification command and visual viewport checks. Leave the pull request open so Kaleb can inspect the Vercel bot deployment.

**Step 4: Verify external state**

Read the pull request back with `gh pr view` and verify its URL, head branch, base branch, and current checks before reporting completion.

### Final approved mobile refinement

- Center the greeting, portrait, main statement, supporting copy, and actions below 850px.
- Render the portrait at 292px wide with a narrow-screen safety cap.
- Use a consistent 30px vertical rhythm and 44px / 68px hero padding.
- Keep the existing desktop composition unchanged.
- Keep the portrait `sizes` hint synchronized with its rendered mobile width.

### Breakpoint regression correction

- Keep the homepage hero centered through 849px instead of switching it at 760px.
- Start the two-column homepage composition at 850px, where the text column reaches a stable measure.
- Leave writing, recommendation, and other content-grid breakpoints unchanged.
