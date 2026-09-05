# Approved compact menu motion plan

**Goal:** Finish PR #93 with the selected compact navigation behavior.

**Decisions:** Full-bleed tray with 16px side inset; soft-blue paper surface, 2px ink border, 8px coral offset; open-list rows with 44px targets; theme then menu controls; menu morphs to X; paper-stamp opening and reverse-stamp closing; reduced motion switches tray and X instantly.

## Tasks
1. Replace native `details` state ownership in `src/components/SiteNav.astro` with a button-controlled menu state so animation cannot race browser disclosure behavior. Preserve keyboard, Escape, outside click, focus return, and all destinations.
2. Update `src/styles/global.css` at the 760px breakpoint: full-width 16px-inset tray, selected physical styling, opening/closing animation classes, X morph, and a `prefers-reduced-motion` instant state.
3. Add static assertions to `scripts/certify.mjs` for the menu button and panel state hooks.
4. Run `GITHUB_TOKEN="" npm run certify`; use CDP at 390px to prove button toggles, Writing navigates, Escape closes and focuses the button, and reduced motion has no running animation.
5. Stage only approved paths, amend PR #93, push, then verify the new Vercel deployment URL and status.
