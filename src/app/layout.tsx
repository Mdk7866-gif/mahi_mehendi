// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://mahi-mehendi.vercel.app";
const siteName = "Mahi Mehendi";
const description =
  "Mahi Mehendi — Professional mehendi artist offering Bridal Mehendi, Normal Mehendi, Custom Designs, and home appointments. View gallery, prices, and contact details.";
// Replace this preview image with a real 1200x630 public image (Cloudinary / Vercel recommended)
const previewImage =
  "https://res.cloudinary.com/ddya4o2yl/image/upload/v1763124675/previeew_ecxwcm.jpg";

export const metadata: Metadata = {
  title: `${siteName} - Bridal & Party Mehendi Artist`,
  description,
  applicationName: siteName,
  keywords: [
    "mehendi",
    "mehndi",
    "bridal mehendi",
    "mehendi artist",
    "henna artist",
    "mehendi designs",
    "home mehendi",
    "mehendi near me",
  ],
  authors: [{ name: "Mahi Mehendi", url: siteUrl }],
  generator: "Next.js",
  formatDetection: { telephone: true, email: true, address: true },
  metadataBase: new URL(siteUrl),
  manifest: `${siteUrl}/manifest.json`,
  openGraph: {
    title: `${siteName} - Bridal & Party Mehendi Artist`,
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Mahi Mehendi Designs - Bridal & Party",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [previewImage],
    // update if you have a twitter handle; keep or remove otherwise
    creator: "@mahi_mehendi",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteName,
  url: siteUrl,
  description,
  telephone: "+91-8511402381", // replace if different
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "A/4 al-aksha duplex, kajuri road, beral market , chandola lake, danilimda",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "3800028", // replace with real PIN
    addressCountry: "IN",
  },
  image: [previewImage],
  priceRange: "₹",
  openingHours: ["Mo-Sa 09:00-20:00"],
  sameAs: [
    "https://www.facebook.com/your-page", // replace
    "https://www.instagram.com/mehendi_by_mahii_2", // replace / keep
    "https://wa.me/918511402381", // WhatsApp link
    "https://www.linkedin.com/in/your-profile", // optional
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mehendi Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bridal Mehendi",
          description:
            "Detailed bridal mehendi design service with customization and on-site service.",
        },
        priceCurrency: "INR",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Normal / Party Mehendi",
          description: "Quick, elegant mehendi for parties and festivals.",
        },
        priceCurrency: "INR",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Canonical */}
        <link rel="canonical" href={siteUrl} />

        {/* Favicons / Apple */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Basic meta */}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="author" content="Mahi Mehendi" />
        <meta name="rating" content="general" />
        <meta name="theme-color" content="#6b3f1e" />

        {/* Open Graph (explicitly included for messaging apps & social) */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={previewImage} />
        <meta property="og:image:alt" content="Mahi Mehendi Designs" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={previewImage} />

        {/* WhatsApp, Telegram, LinkedIn, Pinterest, Instagram use OG tags (no special tag needed) */}

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className={`${inter.className} overflow-x-hidden`}>
        <Navbar />
        <main className="min-h-screen bg-linear-to-br from-[#FFF8F0] via-white to-[#FFF8F0] w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
