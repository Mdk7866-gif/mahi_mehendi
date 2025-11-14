import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mahi Mehendi - Elegant Henna Designs',
  description: 'Showcasing beautiful mehendi for normal and bridal occasions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] w-full overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}