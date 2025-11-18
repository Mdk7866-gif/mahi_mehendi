'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Phone, Mail, MapPin, Instagram } from 'lucide-react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="relative bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="henna-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#henna-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div 
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="text-white" size={18} />
              </motion.div>
              <span className="text-amber-900 font-semibold text-base sm:text-lg">Mahi Mehendi</span>
            </div>
            <p className="text-amber-800  text-xs sm:text-sm leading-tight mb-2">
              Elegant henna designs for every occasion.
            </p>

{/* Instagram Button - Full Width */}
<div className="w-full mt-3">
  <motion.a
    href="https://instagram.com/mehendi_by_mahii_2"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 
               w-full px-6 py-2 
               bg-gradient-to-r from-purple-500 to-pink-500 
               text-white rounded-full text-sm font-medium 
               shadow-sm hover:shadow-md transition-all"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
  >
    <Instagram size={16} />
    <span>Follow Us</span>
  </motion.a>
</div>

          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              Quick Links
            </h4>

            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-3 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }, index) => (
                <motion.li key={href}>
                  <Link 
                    href={href} 
                    className="text-amber-700 text-sm hover:text-amber-900 inline-block transition"
                  >
                    → {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              Get in Touch
            </h4>

            <div className="space-y-1 text-sm">
              <div className="flex flex-col gap-0.5">
                <motion.a 
                  href="tel:+918511402381" 
                  className="flex items-center gap-2 text-amber-700 hover:text-amber-900"
                >
                  <Phone size={15} />
                  <span>+91 85114 02381</span>
                </motion.a>

                <motion.a 
                  href="tel:+919601655793" 
                  className="flex items-center gap-2 text-amber-700 hover:text-amber-900"
                >
                  <Phone size={15} />
                  <span>+91 96016 55793</span>
                </motion.a>
              </div>

              <motion.a 
                href="mailto:mahi.mehendi@gmail.com" 
                className="flex items-start gap-2 text-amber-700 hover:text-amber-900"
              >
                <Mail size={15} />
                <span className="break-all">mahi.mehendi@gmail.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              Visit Us
            </h4>

            <div className="flex items-start gap-2 mb-2">
              <MapPin size={15} className="mt-1 text-amber-700" />
              <address className="not-italic text-amber-700 text-xs sm:text-sm leading-tight">
                A/4 Al-Aksha Duplex, Kajuri Road,<br />
                Chandola Lake, Ahmedabad
              </address>
            </div>

            <motion.a
              href="https://maps.google.com"
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium shadow-sm bg-amber-600 text-white hover:bg-amber-700"
            >
              <MapPin size={13} />
              <span className="text-[12px]">View Map</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div className="my-5 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* BOTTOM BAR – Updated */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-800 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2">
            © {new Date().getFullYear()} Mahi Mehendi.
          </div>

          <div className="text-amber-700 text-xs sm:text-sm font-medium">
            Managed by <span className="font-semibold">Zaid Alam</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
