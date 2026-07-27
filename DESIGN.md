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

## Writing index and article reading

### Writing index

Treat the newest published piece as **pinned writing**. Give it substantially
more visual weight than the archive: a large title, publication date, tags,
and a separate tilted `Why this now` note with the physical border and coral
offset-shadow treatment already used by the visual system. Populate that note
from the article description; do not require separate metadata or repeat the
description beneath the pinned title.

Place earlier writing directly below in reverse chronological order. Use
simple ruled rows with title, description, and date rather than cards, topic
filters, or a featured-content carousel. Group a longer archive by year while
preserving one chronological reading order. Dates may move below titles when
horizontal space becomes cramped.

Do not add a handwritten explanation beside the Writing heading. The pinned
composition should explain itself visually.

### Article opening and metadata

Open an article with:

1. A visible `← Writing` return link.
2. A large Bricolage title.
3. The article description as a one-sentence summary.
4. A restrained metadata row containing the publication date, estimated
   reading time, and tags. Show an updated date when one exists.

Do not add a table of contents, facts box, automatic margin note, author bio,
or competing side rail. The title and writing remain the dominant material.
Tags are compact filing metadata, not pill-shaped controls.

### Reading typography and content elements

Keep the prose column between 65 and 70 characters. Use the quiet reading
treatment:

- Headings use the committed Bricolage scale and normal ink color without
  decorative underlines or shadows.
- Links use accessible cobalt underlines with visible hover and focus changes.
- Lists remain ordinary semantic lists with comfortable indentation and
  vertical rhythm.
- Blockquotes use a restrained full outline or subtle blue wash; do not use a
  colored side stripe, coral offset shadow, or oversized centered treatment.
- Inline code uses Azeret Mono on a subtle wash.
- Substantial code blocks use Azeret Mono on the dark code surface with
  horizontal scrolling as a last resort.
- Natural-color images and video use descriptive alternatives or captions
  when context is not already supplied by adjacent prose.

Video, images, and substantial code use a **measured breakout**: prose remains
at reading width while detailed material may expand to approximately 56rem,
centered on the reading column. At 760px and below, every breakout collapses
to the available container width, preserves its intrinsic aspect ratio, and
never creates horizontal page overflow. Videos expose native controls and a
download fallback.

### Article ending and navigation

Conclude every piece with the author sign-off, then its date:

```text
- Kaleb

July 22, 2026
```

Use the piece's actual publication date in that position. Follow the sign-off
with two simple text links: `← All writing` and the next piece's title with a
right arrow. Do not turn these links into cards. On narrow screens, stack them
in one column. If no next piece exists, show only the return link.

### Theme, responsive behavior, and motion

Apply the approved cool near-white and blue-hour palettes without changing
content hierarchy. The pinned note retains its physical mount and coral offset
in both modes, with dark-mode colors chosen from the existing tokens rather
than mechanically inverted.

At 760px and below, the index, pinned piece, note, archive rows, article
opening, prose, media, sign-off, and navigation all become one continuous
source-ordered column. Keep all interactive targets at least 44px and preserve
reflow at 200% text zoom.

Use tactile settling only on the writing index: the heading, pinned piece, and
archive may settle upward in a short stagger with
`cubic-bezier(.16, 1, .3, 1)`. Article content is visible and still by default;
do not animate prose or media while someone is reading. Remove index entrance
animation and transforms under `prefers-reduced-motion: reduce`.

## Recommendations index and feed

Treat Recommends as one newest-first list rather than dividing it into required
and secondary tiers. Introduce it plainly with "Things I thought were
interesting." Keep the page clearly subordinate to Writing through compact
rows and restrained hierarchy rather than a featured recommendation.

Each row may contain:

- A Read, Watch, or Listen medium.
- Source, publication date, title, and optional author.
- An optional **My thoughts** annotation in the Recursive margin-note voice.
- Topic tags as quiet, non-interactive Azeret metadata.
- A real source thumbnail when one is provided. Do not synthesize a placeholder
  image or reserve an empty image slot when one is absent.

Titles remain ordinary same-tab external links with an external-link cue; do
not force a new browsing context. Keep the rows compact, separated by rules,
and free of card containers. Natural thumbnails use the ink outline and small
coral offset already established by the visual system.

Place an All / Read / Watch / Listen filter above the list. Preserve
newest-first order within every filter, use native buttons with visible focus
and `aria-pressed`, reflect the selected medium in the URL, and announce the
result count. Keep zero-result media available and show the plain state
`No [medium] recommendations yet.` The collection-level empty state is
`Nothing here yet.`

Expose a dedicated Recommends RSS feed from visible page copy and a
`rel="alternate"` head link. Keep it separate from the Writing feed. Feed
items link directly to the recommended source, carry medium and topic
categories, and include **My thoughts** when present.

Use the same cool near-white and blue-hour tokens without changing hierarchy.
At 760px, let the toolbar and rows reflow; at 540px, stack real thumbnails
above their text. Keep 44px filter and theme targets, immediate visible focus,
and remove settling transforms when reduced motion is requested.
