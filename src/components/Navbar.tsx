'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Navbar(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const links: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="backdrop-blur-sm bg-gradient-to-b from-amber-50/90 to-white/80 border-b border-amber-200/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <motion.div
                initial={{ rotate: -10, scale: 0.98 }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md"
              >
                <Sparkles className="text-white" size={16} />
              </motion.div>
              <span className="text-amber-900 font-semibold text-base sm:text-lg truncate">Mahi Mehendi</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {links.map(({ href, label }, i) => (
                <motion.div key={href} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link
                    href={href}
                    className="relative group text-amber-700 hover:text-amber-900 font-medium text-sm lg:text-base"
                  >
                    {label}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-250"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Actions: contact button + mobile toggle */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-sm hover:bg-amber-700 transition-all"
              >
                Contact
              </Link>

              <button
                aria-label="Toggle menu"
                className="md:hidden p-2 rounded-md text-amber-700 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
                onClick={() => setIsOpen((s) => !s)}
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="md:hidden border-t border-amber-200/40 bg-white/95 backdrop-blur-sm"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                {/* Use a 2-column grid to save vertical space like footer */}
                <div className="grid grid-cols-2 gap-2">
                  {links.map(({ href, label }, i) => (
                    <motion.div key={href} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-amber-800 hover:bg-amber-50 font-medium text-sm text-left"
                      >
                        → {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md bg-amber-600 text-white text-sm font-semibold shadow-sm hover:bg-amber-700">
                    Contact Us
                  </Link>

                  <Link href="/privacy" onClick={() => setIsOpen(false)} className="inline-flex items-center px-3 py-2 rounded-md text-amber-700 hover:text-amber-900 text-sm">
                    Privacy
                  </Link>
                </div>

                <div className="mt-3 text-xs text-amber-700">© {new Date().getFullYear()} Mahi Mehendi</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
