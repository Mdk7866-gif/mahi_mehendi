// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopToBottom from "@/components/TopToBottom";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Better font loading performance
  preload: true,
});

const siteUrl = "https://mahi-mehendi.vercel.app";
const siteName = "Mahi Mehendi - Bridal Mehendi Artist Ahmedabad";
const description =
  "Professional Mehendi artist in Ahmedabad offering exquisite bridal mehendi, engagement henna designs, baby shower mehendi, and sider mehendi. Premium natural henna, custom designs, home appointments. Book now via WhatsApp: +91 85114 02381. Gallery, prices, and contact details.";
// Replace this preview image with a real 1200x630 public image (Cloudinary / Vercel recommended)
const previewImage =
  "https://res.cloudinary.com/ddya4o2yl/image/upload/v1763124675/previeew_ecxwcm.jpg";

export const metadata: Metadata = {
  title: `${siteName} | Bridal Mehendi Artist in Ahmedabad, Gujarat`,
  description,
  applicationName: siteName,
  keywords: [
    "mehendi Ahmedabad",
    "bridal mehendi Ahmedabad",
    "mehndi artist Ahmedabad",
    "henna artist Gujarat",
    "mehendi designs Ahmedabad",
    "home mehendi Ahmedabad",
    "mehendi near me",
    "engagement mehendi",
    "baby shower mehendi",
    "sider mehendi",
    "mehendi services Gujarat",
    "natural henna Ahmedabad",
    "custom mehendi designs",
    "WhatsApp mehendi booking",
    "mehendi artist contact",
  ],
  authors: [{ name: "Mahi Mehendi", url: siteUrl }],
  generator: "Next.js",
  formatDetection: { telephone: true, email: true, address: true },
  metadataBase: new URL(siteUrl),
  manifest: `${siteUrl}/manifest.json`,
  openGraph: {
    title: `${siteName} | Bridal & Custom Mehendi in Ahmedabad`,
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Mahi Mehendi - Bridal Mehendi Artist in Ahmedabad | Henna Designs Gallery",
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
  verification: {
    google: "your-google-site-verification-code", // Add if you have Google Search Console verification
    // yandex: "your-yandex-verification",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#mehendi-artist`,
  name: siteName,
  url: siteUrl,
  description,
  telephone: "+91-8511402381",
  email: "mahi.mehendi@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "A/4 Al-Aksha Duplex, Kajuri Road, Beral Market, Chandola Lake, Danilimda",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380028",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.0225, // Approximate coordinates for Ahmedabad - update with precise location if available
    longitude: 72.5714,
  },
  image: [previewImage],
  logo: previewImage,
  priceRange: "₹699 - ₹6,999",
  openingHours: ["Mo-Sa 09:00-20:00", "Su 10:00-18:00"], // Adjust based on actual hours
  sameAs: [
    "https://www.instagram.com/mehendi_by_mahii_2",
    "https://wa.me/918511402381",
    "https://www.facebook.com/mehendi.by.mahii", // Update with actual Facebook if available
    "https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8511402381",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Gujarati"],
      areaServed: "IN",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mehendi Services in Ahmedabad",
    itemListElement: [
      {
        "@type": "Offer",
        position: 1,
        itemOffered: {
          "@type": "Service",
          name: "Bridal Mehendi",
          description:
            "Intricate bridal mehendi designs for hands and feet with premium natural henna. Custom motifs, full coverage, long-lasting stain. Home service in Ahmedabad.",
          image: previewImage,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "6999",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: 6999,
              unitText: "INR",
            },
          },
        },
      },
      {
        "@type": "Offer",
        position: 2,
        itemOffered: {
          "@type": "Service",
          name: "Engagement Mehendi",
          description: "Romantic floral henna designs for engagement ceremonies. Quick application, guest-friendly, safe for pregnancy. Ahmedabad delivery.",
          image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "3499",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: 3499,
              unitText: "INR",
            },
          },
        },
      },
      {
        "@type": "Offer",
        position: 3,
        itemOffered: {
          "@type": "Service",
          name: "Baby Shower Mehendi",
          description: "Playful themed mehendi for baby showers and sangeet. Group packages available, customization. Natural henna in Ahmedabad.",
          image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "1199",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: 1199,
              unitText: "INR",
            },
          },
        },
      },
      {
        "@type": "Offer",
        position: 4,
        itemOffered: {
          "@type": "Service",
          name: "Sider Mehendi",
          description: "Minimalist side-hand and wrist mehendi designs. Modern, subtle elegance for everyday or office events. Fast service in Ahmedabad.",
          image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: "699",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: 699,
              unitText: "INR",
            },
          },
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9", // Update with actual rating
    bestRating: "5",
    worstRating: "1",
    ratingCount: "150", // Update with actual count
  },
  areaServed: [
    {
      "@type": "City",
      name: "Ahmedabad",
    },
    {
      "@type": "State",
      name: "Gujarat",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="overflow-x-hidden">
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
        <meta name="theme-color" content="#f59e0b" />

        {/* Local SEO Enhancements */}
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Ahmedabad" />
        <meta name="geo.position" content="23.0225;72.5714" />
        <meta name="ICBM" content="23.0225, 72.5714" />

        {/* WhatsApp-Specific OG Optimization (enhances sharing on WhatsApp) */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={previewImage} />
        <meta property="og:image:alt" content="Mahi Mehendi - Professional Bridal Mehendi Artist in Ahmedabad | Custom Henna Designs" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Additional OG for WhatsApp Previews */}
        <meta property="og:audio" content="" />
        <meta property="og:video" content="" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={previewImage} />
        <meta name="twitter:image:alt" content="Mahi Mehendi Henna Designs" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className={`${inter.className} overflow-x-hidden`}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <TopToBottom />
      </body>
    </html>
  );
}