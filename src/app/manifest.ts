import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'পলাশবাড়ী ইয়াং সোসাইটি | Polashbari Young Society',
    short_name: 'PYS',
    description:
      'একটি অরাজনৈতিক, অলাভজনক, স্বেচ্ছাসেবী ও সামাজিক সংগঠন। পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর। স্থাপিতঃ ২০২২।',
    start_url: '/',
    display: 'standalone',
    background_color: '#060911',
    theme_color: '#060911',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
