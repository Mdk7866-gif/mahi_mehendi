'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-amber-200/50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top: compact grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-start"
        >
          
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                <Sparkles className="text-amber-600" size={20} />
              </div>
              <span className="text-amber-900 font-semibold text-sm sm:text-base">Mahi Mehendi</span>
            </div>
            <p className="text-amber-700 text-xs sm:text-sm leading-tight">
              Elegant henna designs for every occasion — bridal, festivals, and parties.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-2">Quick links</h4>
            <ul className="space-y-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }, index) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link href={href} className="text-amber-700 text-xs sm:text-sm hover:text-amber-900 transition-colors">
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-2">Contact</h4>
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-amber-700">
              <a href="tel:+918511402381" className="hover:text-amber-900 transition-colors">
                +91 85114 02381
              </a>
              <a href="mailto:mahi.mehendi@gmail.com" className="hover:text-amber-900 transition-colors">
                mahi.mehendi@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Address & Social */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            <h4 className="text-amber-900 font-semibold text-sm mb-1">Location</h4>
            <address className="not-italic text-amber-700 text-xs sm:text-sm leading-tight">
              A/4 Al-Aksha Duplex,<br />
              Kajuri Road, Beral Market,<br />
              Chandola Lake, Danilimda,<br />
              Ahmedabad, Gujarat
            </address>

            <a
              href="https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 transition-colors text-xs sm:text-sm underline mt-1"
            >
              View on Map
            </a>

            {/* Instagram */}
            <div className="mt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/mehendi_by_mahii_2"
                target="_blank"
                className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors text-xs sm:text-sm font-medium"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
                </svg>
                @mehendi_by_mahii_2
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-amber-700"
        >
          <span>© {new Date().getFullYear()} Mahi Mehendi</span>
          <span className="hidden sm:inline">— Crafted with love and artistry</span>
          <Link href="/privacy" className="underline hover:text-amber-900 transition-colors">Privacy</Link>
        </motion.div>
      </div>
    </footer>
  );
}