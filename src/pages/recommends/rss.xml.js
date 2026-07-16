import rss from '@astrojs/rss';
import { getPublishedRecommends } from '../../lib/recommends';

export async function GET(context) {
  const items = await getPublishedRecommends();

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
