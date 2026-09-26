export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://polashbari-young-society.vercel.app';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${siteUrl}/#organization`,
    name: 'পলাশবাড়ী ইয়াং সোসাইটি',
    alternateName: [
      'Polashbari Young Society',
      'PYS',
      'Palashbari Young Society',
      'পলাশবাড়ি ইয়াং সোসাইটি',
      'পলাশবাড়ী ইয়ুথ সোসাইটি',
    ],
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    image: `${siteUrl}/logo.jpg`,
    description:
      'পলাশবাড়ী ইয়াং সোসাইটি একটি অরাজনৈতিক, অলাভজনক, স্বেচ্ছাসেবী ও সামাজিক সংগঠন। পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর। স্থাপিতঃ ২০২২ খ্রিঃ।',
    slogan: 'এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি।',
    foundingDate: '2022',
    foundingLocation: {
      '@type': 'Place',
      name: 'Polashbari, Birganj, Dinajpur',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Polashbari',
        addressLocality: 'Birganj',
        addressRegion: 'Dinajpur',
        addressCountry: 'BD',
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'পলাশবাড়ী, বীরগঞ্জ',
      addressLocality: 'বীরগঞ্জ',
      addressRegion: 'দিনাজপুর',
      addressCountry: 'Bangladesh',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'বীরগঞ্জ, দিনাজপুর',
      },
      {
        '@type': 'Country',
        name: 'Bangladesh',
      },
    ],
    knowsAbout: [
      'মানবকল্যাণ ও জনসেবা',
      'স্বেচ্ছায় রক্তদান',
      'বৃক্ষরোপণ ও পরিবেশ সংরক্ষণ',
      'অসহায় দরিদ্রদের সহায়তা',
      'শিক্ষা বিস্তার ও ছাত্রকল্যাণ',
      'দুর্যোগকালীন ত্রাণ সহায়তা',
      'যুব উন্নয়ন ও নেতৃত্ব',
    ],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'পলাশবাড়ী ইয়াং সোসাইটি | Polashbari Young Society',
    alternateName: 'Polashbari Young Society Official Website',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    inLanguage: ['bn-BD', 'en-US'],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'হোম (Home)',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'পরিচিতি (About)',
        item: `${siteUrl}/#about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'লক্ষ্য ও উদ্দেশ্য (Mission)',
        item: `${siteUrl}/#mission`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'সদস্যপদ নিবন্ধন (Register)',
        item: `${siteUrl}/#register`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
