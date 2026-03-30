# kalebcole.com

Personal portfolio — Astro + Tailwind CSS, deployed on Vercel.

## Setup

```bash
npm install
npm run dev      # localhost:4321
npm run build    # production build
```

## Stack

- [Astro](https://astro.build) with TypeScript
- Tailwind CSS v4
- Vercel adapter for deployment
- Instrument Serif + DM Sans typography

## Customization

Edit the accent color in `src/pages/index.astro`:

```css
:root {
  --color-accent: #4ade80; /* mint green — change to whatever */
}
```
