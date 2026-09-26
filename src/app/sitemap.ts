import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://palashbari-youth-society.vercel.app';
  const currentDate = new Date();

  return [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          bn: `${siteUrl}`,
          en: `${siteUrl}`,
        },
      },
    },
  ];
}
