import { getCollection, type CollectionEntry } from 'astro:content';

export type Recommend = CollectionEntry<'recommends'>;

export const RECOMMEND_MEDIUM_LABELS = {
  read: 'Read',
  watch: 'Watch',
  listen: 'Listen',
} as const satisfies Record<Recommend['data']['medium'], string>;

export function formatRecommendDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export async function getPublishedRecommends(): Promise<Recommend[]> {
  const items = await getCollection('recommends', ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
