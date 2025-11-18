'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  Map,      
  Instagram 
} from 'lucide-react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="relative bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 w-full overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="henna" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" className="text-amber-900" fill="none"/>
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" className="text-amber-900" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#henna)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow">
                <Sparkles size={18} className="text-white"/>
              </div>
              <span className="text-amber-900 font-semibold text-lg">Mahi Mehendi</span>
            </div>

            <p className="text-amber-800 text-sm mb-3">
              Elegant henna designs for every occasion.
            </p>

            {/* Instagram Button - MATCHING SITE COLORS (Full Width) */}
            <div className="w-full mt-3">
              <motion.a
                href="https://instagram.com/mehendi_by_mahii_2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 
                           w-full px-6 py-2 
                           bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500
                           text-white rounded-full text-sm font-medium 
                           shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-0.5
                           ring-1 ring-amber-200/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Follow Mahi Mehendi on Instagram"
              >
                <Instagram size={18} />
                <span>Follow Us</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-amber-500" />
              Quick Links
            </h4>

            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/gallery", label: "Gallery" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} prefetch={true} className="text-amber-700 hover:text-amber-900 text-sm">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-amber-500" />
              Get in Touch
            </h4>

            <div className="space-y-1 text-sm">

              {/* Phone numbers - tighter spacing */}
              <div className="flex flex-col gap-1">
                <a href="tel:+918511402381" className="flex items-center gap-2 text-amber-700 hover:text-amber-900">
                  <Phone size={15} />
                  +91 85114 02381
                </a>

                <a href="tel:+919601655793" className="flex items-center gap-2 text-amber-700 hover:text-amber-900">
                  <Phone size={15} />
                  +91 96016 55793
                </a>
              </div>

              {/* Email */}
              <a href="mailto:mahi.mehendi@gmail.com" className="flex items-center gap-2 text-amber-700 hover:text-amber-900">
                <Mail size={15} />
                mahi.mehendi@gmail.com
              </a>

            </div>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-amber-500" />
              Visit Us
            </h4>

            <div className="flex items-start gap-2">
              <Map size={18} className="text-amber-700 mt-1" />
              <p className="text-amber-700 text-sm leading-tight">
                A/4 Al-Aksha Duplex,<br />
                Kajuri Road, Chandola Lake,<br />
                Ahmedabad
              </p>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700"
            >
              <Map size={14} />
              View Map
            </a>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-amber-800">
          <span>© {new Date().getFullYear()} Mahi Mehendi.</span>

          <span className="text-amber-700 font-medium">
            Managed by <span className="font-semibold">Zaid Alam</span>
          </span>
        </div>

      </div>
    </footer>
  );
}
