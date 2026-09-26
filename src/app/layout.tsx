import type { Metadata, Viewport } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import JsonLd from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://polashbari-young-society.vercel.app";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "পলাশবাড়ী ইয়াং সোসাইটি | Polashbari Young Society (বীরগঞ্জ, দিনাজপুর)",
    template: "%s | পলাশবাড়ী ইয়াং সোসাইটি",
  },
  description:
    "পলাশবাড়ী ইয়াং সোসাইটি — একটি অরাজনৈতিক, অলাভজনক, স্বেচ্ছাসেবী ও সামাজিক সংগঠন। স্থাপিতঃ ২০২২ খ্রিঃ। ঠিকানাঃ পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর। Polashbari Young Society is a voluntary social and humanitarian youth organization dedicated to community development in Birganj, Dinajpur.",
  keywords: [
    // বাংলা কি-ওয়ার্ডসমূহ
    "পলাশবাড়ী ইয়াং সোসাইটি",
    "পলাশবাড়ি ইয়াং সোসাইটি",
    "পলাশবাড়ী ইয়ুথ সোসাইটি",
    "পলাশবাড়ী সামাজিক সংগঠন",
    "পলাশবাড়ী বীরগঞ্জ",
    "বীরগঞ্জ দিনাজপুর সামাজিক সংগঠন",
    "পলাশবাড়ী রক্তদান সংগঠন",
    "পলাশবাড়ী ইয়াং সোসাইটি গঠনতন্ত্র",
    "পলাশবাড়ী ইয়াং সোসাইটি সদস্য নিবন্ধন",
    "বীরগঞ্জ স্বেচ্ছাসেবী সংগঠন",
    "দিনাজপুর স্বেচ্ছাসেবী সংস্থা",
    "মানবতার সেবায় পলাশবাড়ী",

    // English keywords & variations
    "Polashbari Young Society",
    "Palashbari Young Society",
    "PYS Birganj",
    "Polashbari Young Society Dinajpur",
    "Polashbari Voluntary Organization",
    "Polashbari NGO Bangladesh",
    "Birganj Youth Organization",
    "Dinajpur Social Welfare Organization",
    "Polashbari Youth Club",
    "Polashbari Young Society Registration",
  ],
  authors: [{ name: "পলাশবাড়ী ইয়াং সোসাইটি", url: siteUrl }],
  creator: "পলাশবাড়ী ইয়াং সোসাইটি (Polashbari Young Society)",
  publisher: "পলাশবাড়ী ইয়াং সোসাইটি",
  applicationName: "পলাশবাড়ী ইয়াং সোসাইটি",
  generator: "Next.js",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    title: "পলাশবাড়ী ইয়াং সোসাইটি | Polashbari Young Society",
    description:
      "এসো যুবক, কাজ করি— মানবতার সমাজ গড়ি। পলাশবাড়ী, বীরগঞ্জ, দিনাজপুরে প্রতিষ্ঠিত একটি মানবকল্যাণমুখী অরাজনৈতিক ও স্বেচ্ছাসেবী সামাজিক সংগঠন।",
    url: siteUrl,
    siteName: "পলাশবাড়ী ইয়াং সোসাইটি (Polashbari Young Society)",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "পলাশবাড়ী ইয়াং সোসাইটি অফিসিয়াল লোগো (Polashbari Young Society Logo)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "পলাশবাড়ী ইয়াং সোসাইটি | Polashbari Young Society",
    description:
      "একটি অরাজনৈতিক, অলাভজনক, স্বেচ্ছাসেবী ও সামাজিক সংগঠন। পলাশবাড়ী, বীরগঞ্জ, দিনাজপুর। স্থাপিতঃ ২০২২।",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/logo.jpg", sizes: "180x180" }],
  },
  category: "Non-Governmental Organization & Social Welfare",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="h-full scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
