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

const recommends = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recommends' }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    date: z.date(),
    // read | watch | listen
    medium: z.enum(['read', 'watch', 'listen']).default('read'),
    author: z.string().optional(),
    // publication / domain, e.g. "YouTube", "Bun"
    source: z.string().optional(),
    image: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    // Kaleb's own take — the whole point of the page.
    take: z.string(),
    // true => surfaces in the pinned "Required" band.
    required: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, recommends };
