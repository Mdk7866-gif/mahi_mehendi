import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Mahi Mehendi - Professional Mehendi Artist",
  description:
    "Beautiful Mehendi designs for weddings, festivals, parties, and special occasions. Services include Bridal Mehendi, Normal Mehendi, Custom Designs, and Home Appointments.",
  openGraph: {
    title: "Mahi Mehendi - Trusted Mehendi Artist",
    description:
      "Bridal & Normal Mehendi services with elegant designs. View gallery, prices, and contact details.",
    url: "https://mahi-mehendi.vercel.app",
    siteName: "Mahi Mehendi",
    images: [
      {
        url: "https://res.cloudinary.com/ddya4o2yl/image/upload/v169x/...yourImage.jpg",
        width: 1200,
        height: 630,
        alt: "Mahi Mehendi Designs",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahi Mehendi",
    description:
      "Professional Bridal & Normal Mehendi services. Elegant designs and affordable prices.",
    images: [
      "https://res.cloudinary.com/ddya4o2yl/image/upload/v169x/...yourImage.jpg",
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}