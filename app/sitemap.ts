import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karmlin.studio';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         1,
    },
    {
      url:              `${BASE_URL}/blog`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.7,
    },
  ];
}
