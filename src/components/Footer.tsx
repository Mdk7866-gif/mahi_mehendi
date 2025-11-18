'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Phone, Mail, MapPin, Instagram } from 'lucide-react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="relative bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 w-full overflow-hidden">
      {/* Decorative pattern overlay (low opacity to keep it subtle and small) */}
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="henna-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
              <path d="M50 20 Q60 30 50 40 Q40 30 50 20" fill="currentColor" className="text-amber-900"/>
              <path d="M50 60 Q60 70 50 80 Q40 70 50 60" fill="currentColor" className="text-amber-900"/>
              <path d="M30 50 Q20 40 20 50 Q20 60 30 50" fill="currentColor" className="text-amber-900"/>
              <path d="M70 50 Q80 40 80 50 Q80 60 70 50" fill="currentColor" className="text-amber-900"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#henna-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Main Content: on very small viewports use two columns to save vertical space */}
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
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Sparkles className="text-white" size={18} />
              </motion.div>
              <span className="text-amber-900 font-semibold text-base sm:text-lg">Mahi Mehendi</span>
            </div>
            <p className="text-amber-800 text-xs sm:text-sm leading-tight mb-2">
              Elegant henna designs for every occasion.
            </p>

            {/* Social Media */}
            <motion.a
              href="https://instagram.com/mehendi_by_mahii_2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Instagram size={14} />
              <span className="text-[11px]">Follow Us</span>
            </motion.a>
          </motion.div>

          {/* Quick Links: render as 2-column grid on small screens to save height, revert to vertical on >=sm */}
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
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.03 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={href} 
                    className="text-amber-700 text-sm hover:text-amber-900 hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    → {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
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
              <motion.a 
                href="tel:+918511402381" 
                className="flex items-start gap-2 text-amber-700 hover:text-amber-900 transition-colors group"
                whileHover={{ x: 4 }}
              >
                <Phone size={15} className="mt-1 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="text-xs sm:text-sm">+91 85114 02381</span>
              </motion.a>

              <motion.a 
                href="mailto:mahi.mehendi@gmail.com" 
                className="flex items-start gap-2 text-amber-700 hover:text-amber-900 transition-colors group"
                whileHover={{ x: 4 }}
              >
                <Mail size={15} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm break-all">mahi.mehendi@gmail.com</span>
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
              <MapPin size={15} className="mt-1 flex-shrink-0 text-amber-700" />
              <address className="not-italic text-amber-700 text-xs sm:text-sm leading-tight">
                A/4 Al-Aksha Duplex, Kajuri Road,<br />
                Chandola Lake, Ahmedabad
              </address>
            </div>

            <motion.a
              href="https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium shadow-sm bg-amber-600 text-white hover:bg-amber-700 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MapPin size={13} />
              <span className="text-[12px]">View Map</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="my-5 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        />

        {/* Bottom Bar: compact on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-800 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Mahi Mehendi.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-amber-700 text-xs">Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              ❤️
            </motion.span>
            <span className="text-amber-700 text-xs">and artistry</span>
          </div>

          <Link 
            href="/privacy" 
            className="text-amber-700 hover:text-amber-900 underline underline-offset-2 text-xs transition-colors"
          >
            Privacy Policy
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
