import rss from '@astrojs/rss';
import { getPublishedRecommends } from '../../lib/recommends';
import { PRODUCTION_ORIGIN } from '../../lib/site-origin.mjs';

export async function GET(context) {
  const items = await getPublishedRecommends();

  return rss({
    title: 'Kaleb Cole | Recommends',
    description: 'Things I thought were interesting.',
    site: context.site ?? PRODUCTION_ORIGIN,
    items: items.map((item) => ({
      title: item.data.title,
      description: [
        item.data.author ? `By ${item.data.author}.` : null,
        item.data.take ?? 'Recommended by Kaleb Cole.',
      ].filter(Boolean).join(' '),
      pubDate: item.data.date,
      link: item.data.url,
      categories: [item.data.medium, ...item.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
