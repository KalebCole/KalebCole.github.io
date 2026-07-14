import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const items = (await getCollection('recommends', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Kaleb Cole — Recommends',
    description: 'Things worth your time, recommended by Kaleb Cole.',
    site: context.site ?? 'https://kalebcole.dev',
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.take,
      pubDate: item.data.date,
      link: item.data.url,
    })),
  });
}
