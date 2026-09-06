# Homepage and Projects Magnetic Motion Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Implement the approved Magnetic Depth motion system on the Homepage and Projects page without changing article pages, content hierarchy, or the two-project homepage cap.

**Architecture:** Add one testable progressive-enhancement module that starts one-shot Web Animations API entrances from `IntersectionObserver` callbacks. Base HTML and CSS remain fully visible without JavaScript. Use the independent CSS `translate` property for scroll entrances and `transform` for project hover depth so those systems cannot overwrite each other. Pages and components expose semantic `data-motion-*` hooks; only the Homepage and Projects page initialize the module.

**Tech Stack:** Astro 5, vanilla JavaScript modules, CSS custom properties, Web Animations API, IntersectionObserver, Node test runner, existing certification script, Playwright/browser QA.

**Approved evidence:**
- Prototype source: `/Users/kalebcole/repos/kalebcole.com/sketches/008-project-motion-grill/index.html`
- Live review URL: `https://kalebs-mac-mini.tail6ac27c.ts.net:8461/sketches/008-project-motion-grill/?variant=home-mount`

**Locked decisions:**
- Projects page: Magnetic Depth, Quick Snap, Project Story Beats, Edge Tilt, touch pressed state, Static Mount under reduced motion.
- Homepage: Publication Story Beats across Recent Projects, Recent Writing, and Recent Recommendations; Same Quick Snap timing; Edge Tilt on project cards; Reading Nudge on editorial rows; Static Project Mount under reduced motion.
- Homepage source order remains introduction, Recent Projects, Recent Writing, Recent Recommendations.
- Homepage remains capped at two project cards.
- Existing hero entrance and `home-breakpoint-motion.mjs` remain intact.
- Individual writing pages remain static.

**Non-goals:**
- Do not add Projects to the homepage. It already exists on `origin/master`.
- Do not change project selection, descriptions, images, or homepage copy.
- Do not add motion to articles, Writing index, Recommends index, navigation, or footer.
- Do not add a dependency or animation framework.
- Do not merge the PR.
- Do not modify, close, or supersede PRs #90, #91, or #92.
- Do not commit the throwaway prototype.
- Do not address the 16 pre-existing `npm audit` findings.

---

### Task 1: Add a testable one-shot publication motion controller

**Objective:** Implement progressive scroll entrances without hiding content in base CSS or coupling scroll movement to hover transforms.

**Files:**
- Create: `src/scripts/publication-motion.mjs`
- Create: `test/publication-motion.test.mjs`

**Step 1: Write failing unit tests**

Cover these exact contracts with lightweight fakes, following `test/home-breakpoint-motion.test.mjs` style:

1. `initPublicationMotion()` observes every `[data-motion-beat]` below the initial viewport.
2. An intersecting target receives one Web Animations API call and is unobserved.
3. Desktop keyframes use alternating `translate: -34px 0` and `translate: 34px 0`.
4. Narrow-screen keyframes use `translate: 0 34px`.
5. Every entrance ends at `translate: 0 0`, `filter: blur(0)`, and `opacity: 1`.
6. Entrances use 430 ms, `cubic-bezier(.2, .8, .2, 1)`, and a bounded 55 ms source-order stagger.
7. Reduced motion creates no observer and no animations.
8. Missing `IntersectionObserver` or `element.animate` leaves content untouched.
9. A target animates at most once.
10. The controller does not assign inline `opacity: 0`, a hidden class, or any persistent hidden state.

**Step 2: Run tests to verify failure**

Run:

```bash
node --test test/publication-motion.test.mjs
```

Expected: FAIL because `publication-motion.mjs` does not exist.

**Step 3: Implement the minimal module**

Export named constants for duration, stagger, easing, and mobile breakpoint. Export testable helpers for keyframe construction and initialization. Requirements:

- Observe only `[data-motion-beat]` inside the supplied root.
- Determine horizontal versus vertical entrance with `matchMedia('(max-width: 760px)')`.
- Start from `{ opacity: 0, filter: 'blur(2px)', translate: '<offset>' }` and finish at `{ opacity: 1, filter: 'blur(0)', translate: '0 0' }`.
- Keep the base DOM fully visible before the callback. Do not add a CSS class that hides pending targets.
- Cap stagger so a long page never makes a visible target wait excessively.
- Unobserve immediately after starting the one-shot animation.
- Return a cleanup function that disconnects the observer and cancels pending work.
- If reduced motion is active, return a no-op cleanup without creating an observer.

**Step 4: Run tests to verify pass**

Run:

```bash
node --test test/publication-motion.test.mjs
```

Expected: all publication motion tests pass.

**Step 5: Commit**

```bash
git add src/scripts/publication-motion.mjs test/publication-motion.test.mjs
git commit -m "feat: add publication scroll motion controller"
```

---

### Task 2: Mark the approved Homepage story beats

**Objective:** Apply Publication Story Beats to homepage Projects, Writing, and Recommendations while leaving the hero and source order unchanged.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/PinnedRepos.astro`
- Modify: `src/components/HomeRecommendRow.astro`
- Modify: `scripts/certify.mjs`

**Step 1: Add failing certification assertions**

Add bounded assertions that the Homepage contains motion hooks on:

- each Recent Projects heading, project visual, project copy, and All projects link;
- the Recent Writing heading, every writing row, and All writing link;
- the Recent Recommendations heading, every recommendation row, and All recommendations link.

Also assert:

- the homepage still renders one or two project cards;
- `.home-hero` and its children do not receive publication-scroll hooks;
- article output does not contain publication-scroll hooks;
- the Homepage initializes `initPublicationMotion()` exactly once.

**Step 2: Run certification to verify failure**

Run:

```bash
GITHUB_TOKEN="" npm run certify
```

Expected: FAIL on the new motion-hook assertions.

**Step 3: Add semantic hooks and initialize the controller**

- Add `data-motion-beat` to section heading wrappers, rows, and terminal All links in `src/pages/index.astro`.
- In `PinnedRepos.astro`, add hooks to the project visual and project copy. Hooks may exist in both variants because only participating pages initialize the controller.
- Add `data-motion-beat` to the root article in `HomeRecommendRow.astro`.
- Import and call `initPublicationMotion()` in the existing Homepage script alongside `initHomeBreakpointMotion()`.
- Do not modify hero text, hero DOM order, project limit, recommendation limit, or content.

**Step 4: Run focused and full verification**

Run:

```bash
node --test test/publication-motion.test.mjs
GITHUB_TOKEN="" npm run certify
```

Expected: all tests and certification pass.

**Step 5: Commit**

```bash
git add src/pages/index.astro src/components/PinnedRepos.astro src/components/HomeRecommendRow.astro scripts/certify.mjs
git commit -m "feat: add homepage publication story beats"
```

---

### Task 3: Apply Project Story Beats

**Objective:** Apply the same one-shot motion language to the Projects page.

**Files:**
- Modify: `src/pages/projects.astro`
- Modify: `scripts/certify.mjs`

**Step 1: Add failing certification assertions**

Assert that `/projects`:

- marks the page heading as a motion beat;
- renders project visuals and project copy with motion hooks;
- initializes `initPublicationMotion()` exactly once;
- contains no metrics, project-language metadata, or case-study framing.

**Step 2: Run certification to verify failure**

Run:

```bash
GITHUB_TOKEN="" npm run certify
```

Expected: FAIL on the new Projects motion assertions.

**Step 3: Implement page hooks**

- Mark `.page-heading` with `data-motion-beat`.
- Initialize `initPublicationMotion()` on this page only.
- Preserve existing page title, description, and project data.

**Step 4: Run certification**

Run:

```bash
GITHUB_TOKEN="" npm run certify
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/projects.astro scripts/certify.mjs
git commit -m "feat: add Projects story beat motion"
```

---

### Task 4: Implement Edge Tilt, Reading Nudge, touch fallback, and Static Mount

**Objective:** Add the approved pointer, keyboard, touch, and reduced-motion states without layout shift or transform conflicts.

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/scripts/publication-motion.mjs`
- Modify: `test/publication-motion.test.mjs`
- Modify: `scripts/certify.mjs`

**Step 1: Add failing tests and certification assertions**

Test the pointer helper or controller integration:

- mouse pointer movement over `.project-index-row` updates bounded `--motion-x` and `--motion-y` values;
- non-mouse pointer movement does not create hover tracking;
- cleanup removes listeners;
- reduced motion does not initialize pointer tracking.

Certify CSS contracts:

- project scroll entrances use `translate`, while Edge Tilt uses `transform`;
- project visual hover uses perspective, pointer-driven rotations, a 6 px lift, and opposing coral hard shadow;
- project image uses bounded inverse pointer movement and scale;
- keyboard `:focus-within` gives a centered, non-pointer-dependent lift/shadow state;
- coarse pointer `:active` uses a small pressed scale and never gates navigation;
- Writing and Recommendation rows retain the approved 0.55rem Reading Nudge and cobalt link state;
- reduced motion uses `transition: none`, removes animation/translation/rotation, and applies a fixed `6px 7px 0 var(--coral)` mount to project visuals;
- no selectors add motion to `.prose` or article pages.

**Step 2: Run tests to verify failure**

Run:

```bash
node --test test/publication-motion.test.mjs
GITHUB_TOKEN="" npm run certify
```

Expected: FAIL on new pointer/CSS contracts.

**Step 3: Implement interaction CSS and pointer tracking**

Use these approved values from the validated prototype:

- Scroll entrance: 34 px, blur 2 px, 430 ms, 55 ms bounded stagger.
- Edge Tilt: up to 4 degrees X, 5 degrees Y, 6 px lift.
- Image depth: scale about `1.055` with inverse movement capped near 5 px.
- Coral shadow: derived from pointer position, with a centered keyboard fallback.
- Reading Nudge: preserve current `translateX(.55rem)` and cobalt title behavior.
- Touch: small `scale(.985)` pressed state; navigation still occurs normally.
- Reduced motion: no transition, no entrance, no tilt, no parallax; fixed 6 px by 7 px coral mount on project visuals.

Use CSS custom properties scoped to each project row. Keep pointer tracking passive and bounded. Do not run frame loops.

**Step 4: Run focused and full checks**

Run:

```bash
node --test test/publication-motion.test.mjs
GITHUB_TOKEN="" npm run certify
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/styles/global.css src/scripts/publication-motion.mjs test/publication-motion.test.mjs scripts/certify.mjs
git commit -m "feat: add magnetic project depth interactions"
```

---

### Task 5: Record the accepted motion contract

**Objective:** Update the design source of truth without changing unrelated product language.

**Files:**
- Modify: `DESIGN.md`

**Step 1: Update only the motion sections**

Document:

- Homepage Publication Story Beats and exact order.
- Projects page Project Story Beats.
- Quick Snap timing and easing.
- Edge Tilt on project visuals with keyboard and touch equivalents.
- Reading Nudge for editorial rows.
- Static Mount under reduced motion.
- No article-page motion.
- Scroll movement and hover transforms must use independent CSS properties.

Correct the existing inconsistent homepage project cap references so the document consistently says two, matching `PRODUCT.md`, source, and certification. Do not change unrelated design guidance.

**Step 2: Run repository text and certification checks**

Run:

```bash
git diff --check
GITHUB_TOKEN="" npm run certify
```

Expected: no whitespace errors and full certification passes.

**Step 3: Commit**

```bash
git add DESIGN.md
git commit -m "docs: record the approved publication motion system"
```

---

### Task 6: Browser verification and PR

**Objective:** Prove the production implementation matches the approved interaction and open a reviewable PR.

**Files:**
- Create only temporary screenshots/evidence outside the repository.
- Do not commit browser profiles, screenshots, generated QA files, or the throwaway prototype.

**Step 1: Run the complete automated suite**

Run:

```bash
GITHUB_TOKEN="" npm run certify
```

Expected: build, certification, theme checks, and all Node tests pass.

**Step 2: Run exact browser checks at 1440×1100 and 390×844**

For `/` and `/projects`:

- scroll through every motion beat and prove it animates once;
- verify project images use Edge Tilt under a real mouse path;
- verify project links expose an equivalent visible keyboard focus state;
- verify editorial rows use Reading Nudge on hover and keyboard focus;
- verify coarse-pointer press does not block navigation;
- emulate `prefers-reduced-motion: reduce` and assert all content is immediately visible, transition-free, and project visuals use Static Mount;
- verify `document.documentElement.scrollWidth === window.innerWidth`;
- verify no uncaught console errors or broken assets;
- capture and inspect motion and reduced-motion screenshots for both routes and viewports.

Also verify existing homepage breakpoint motion still passes its resize tests and does not replay on initial page load.

**Step 3: Review the diff for scope**

Confirm:

- no article template or prose CSS changed;
- no project content/selection changed;
- homepage remains capped at two project cards;
- PRs #90, #91, and #92 are untouched;
- no prototype or QA artifact is committed;
- no unrelated audit/dependency changes are included.

**Step 4: Push and open the PR**

Push `feat/homepage-projects-magnetic-motion` and open a PR to `master` with:

- concise summary of Homepage and Projects behavior;
- explicit accessibility and reduced-motion behavior;
- exact automated test results;
- desktop/mobile browser evidence;
- note that the PR does not merge or close #90–#92.

Do not merge.

**Step 5: Read back the PR**

Verify the PR URL, head/base branches, open state, changed files, commit list, and CI status. Report pending CI honestly. Stop at a verified open PR.
