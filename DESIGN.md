# Visual System

The site should feel like a sturdy page Kaleb has marked up by hand: clear
enough for sustained reading, energetic enough to show enthusiasm, and
specific enough that it cannot be mistaken for a generic portfolio.

## Typography

- **Primary voice:** Bricolage Grotesque variable, optical size `12..96`,
  weights 400, 600, and 800. Use it for display type, navigation, body copy,
  and writing titles.
- **Margin-note voice:** Recursive variable with `"CASL" 1` and `"CRSV" 1`.
  Reserve it for brief first-person notes and portrait captions; never use it
  for paragraphs or repeated labels.
- **Metadata voice:** Azeret Mono 400 and 600. Reserve it for dates, compact
  publishing metadata, and code-adjacent material.
- Fallbacks are `system-ui, sans-serif` for Bricolage and Recursive and
  `ui-monospace, monospace` for Azeret.

Use a committed type scale rather than many nearly identical sizes:

| Role | Size | Line height | Weight |
| --- | --- | --- | --- |
| Homepage display | `clamp(3.5rem, 9vw, 6rem)` | `0.88` | 800 |
| Page title | `clamp(2.75rem, 7vw, 4.5rem)` | `0.94` | 800 |
| Section title | `clamp(1.8rem, 4vw, 3.2rem)` | `1` | 800 |
| Writing title | `clamp(1.1rem, 2vw, 1.45rem)` | `1.15` | 600 |
| Lead/body | `clamp(1.05rem, 1.6vw, 1.25rem)` | `1.58` | 400 |
| Metadata | `0.72rem` | `1.5` | 400 |

Display tracking may tighten to `-0.035em`; body and metadata remain at normal
tracking. Balance headings and pretty-wrap prose. Keep reading lines between
57 and 70 characters.

## Color

Use OKLCH tokens directly. Coral is decorative in light mode because it does
not meet body-text contrast there.

| Token | Light | Blue-hour dark | Use |
| --- | --- | --- | --- |
| `--ground` | `oklch(0.975 0.004 260)` | `oklch(0.17 0.045 265)` | Page background |
| `--ink` | `oklch(0.18 0.01 270)` | `oklch(0.94 0.015 260)` | Primary text and rules |
| `--blue` | `oklch(0.49 0.21 267)` | `oklch(0.72 0.17 267)` | Emphasis, links, focus |
| `--coral` | `oklch(0.64 0.21 28)` | `oklch(0.70 0.19 28)` | Offset shadow and marks |
| `--muted` | `oklch(0.42 0.02 260)` | `oklch(0.73 0.035 260)` | Secondary text |
| `--mount` | `oklch(1 0 0)` | `oklch(0.965 0.008 260)` | Portrait print mount |

Light-mode contrast against `--ground`: ink 17.5:1, blue 6.2:1, and muted
7.87:1. Dark-mode contrast: ink 16.08:1, blue 7.36:1, muted 8.02:1, and coral
6.6:1.

The light scene is a cool true near-white, not cream. The dark counterpart is
a blue-hour workshop: deep blue-black ground with a restrained cobalt radial
glow near the portrait. It preserves the cobalt/coral relationship instead of
mechanically inverting the light palette.

## Space and composition

Use a 4px base with named steps of 4, 8, 12, 16, 24, 32, 48, 64, 96, and
128px. Prefer the larger steps between ideas and the smaller steps within an
idea.

- Main shell: `min(1180px, calc(100% - clamp(2rem, 8vw, 8rem)))`.
- Navigation: 86px minimum height with a 2px ink rule.
- Homepage hero: asymmetric `1.35fr / 0.65fr` grid, `61vh` minimum height,
  `clamp(2rem, 7vw, 7rem)` gap, and 64px vertical padding.
- Recent writing: `0.4fr / 1fr` grid with the same gap and a 2px top rule.
- Article rows: 18px vertical padding, one-pixel rules, and no card container.

This is measured breathing room: the introduction owns the opening view, but
recent writing arrives in the first deliberate scroll.

## Portrait and other images

Keep the portrait in natural color. Present it as a physical print rather than
a profile avatar:

- 300px maximum width on large screens and 190px on narrow screens.
- 4:5 image crop with centered `object-fit: cover`.
- 10px side/top mount and 44px caption area.
- 2px ink outline, 10px by 12px coral offset shadow, and 2-degree rotation.
- A short Recursive caption may sit in the mount; it should sound like Kaleb,
  not describe the layout.

On phones, show the complete introduction first, then begin the portrait
1.25rem below it with a further 0.5rem optical offset. Do not put the portrait
before the words or squeeze it beside a narrowed paragraph.

Do not apply grayscale, duotone, rounded-corner, or polaroid treatment to every
image. Writing images remain natural-color source material, scale to their
reading container, and use captions only when they add context.

## Motion and interaction

Motion should feel like placing a page and print on a desk:

- Navigation settles down over 1100ms.
- Hero copy settles up over 1400ms after 180ms.
- Portrait enters from a 30px by 25px offset and 8-degree rotation over
  1550ms after 350ms, ending at its resting 2-degree rotation.
- Recent writing settles up over 1250ms after 700ms.
- Use `cubic-bezier(.16, 1, .3, 1)` for these composed entrances.
- Writing rows move 0.55rem toward the reading direction over 240ms on hover
  while changing to blue.
- The portrait straightens, lifts 6px, and extends its offset shadow to 14px
  by 18px over 300ms on hover.

Content is visible without animation. Under `prefers-reduced-motion: reduce`,
remove entrance animation and transforms; preserve only immediate color and
focus-state changes.

Links use blue underlines or blue text with a minimum 2px visible focus ring
and 3px offset. Every interactive target reaches 44px on touch layouts.

## Responsive behavior

- Above 760px, retain the asymmetric hero and writing grids.
- At 760px and below, use one column: navigation, full introduction, portrait,
  then recent writing.
- Navigation may wrap, but Kaleb's name remains first and the theme control
  remains a 44px target.
- At 320px, display type must not overflow; reduce the homepage minimum to
  3.5rem only when the copy still fits, otherwise use a smaller fluid floor.
- Article dates may move below titles before title measure becomes cramped.
- At 200% text zoom, preserve source order and reflow without horizontal
  scrolling.

The mode control follows system preference on first visit, remembers an
explicit choice, names the resulting mode accessibly, and never uses color or
an unlabeled icon as its only cue.

## Site identity mark and icon assets

Use the **open-tail KC** as the site identity mark. It is a custom, font-free
single-stroke drawing: a loose cobalt K continues into an open C and ends at
one coral point. Preserve the same geometry at 16px, 32px, and larger sizes;
do not substitute a simplified micro-mark, place it in a rounded square, or
return to the old serif K.

The favicon follows the website palette rather than defining a separate color
system:

- Light browser chrome uses the light `--blue` stroke and `--coral` endpoint.
- Dark browser chrome uses the brighter blue-hour `--blue` and `--coral`
  values.
- The adaptive SVG uses `prefers-color-scheme` internally so browser chrome
  receives the correct pair independently of the page's stored mode.

Produce this focused asset set:

| Asset | Requirement |
| --- | --- |
| `/favicon.svg` | Adaptive primary icon, no embedded font, exact open-tail KC geometry |
| `/favicon-16x16.png` | Raster fallback rendered from the approved 16px geometry |
| `/favicon-32x32.png` | Raster fallback rendered from the approved 32px geometry |
| `/favicon.ico` | Root legacy fallback containing 16px and 32px images |
| `/apple-touch-icon.png` | Opaque 180×180 PNG using the cool near-white `--ground`, centered cobalt/coral mark, and no baked-in corner radius |

Do not add 192px or 512px PWA icons or a web manifest unless the site later
becomes installable. Declare every asset explicitly in `<head>` with correct
MIME types and sizes, ordering legacy/raster fallbacks before the SVG primary,
followed by the Apple touch icon. Production verification must include 16px
and 32px light/dark browser tabs, a clean favicon-cache load, and confirmation
that no icon request returns a missing asset.
