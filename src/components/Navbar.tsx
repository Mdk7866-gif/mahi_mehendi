'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Desktop menu items
  const links: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ];

  // Mobile menu items (same order)
  const mobileItems = ['Home', 'Gallery', 'Services', 'About', 'Contact', 'Admin'];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 top-0 border-b border-amber-200/50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-amber-900 hover:text-amber-800 transition-colors truncate"
            >
              <Sparkles className="text-amber-600" size={20} />
              Mahi Mehendi
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {links.map(({ href, label }, index) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={href}
                  className="text-amber-700 hover:text-amber-900 font-medium transition-colors relative group text-sm lg:text-base whitespace-nowrap"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-amber-700 shrink-0 ml-2 hover:text-amber-900 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-sm border-t border-amber-200/50"
          >
            {mobileItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className="block px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}