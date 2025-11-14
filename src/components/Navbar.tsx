'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Desktop nav structure
  const links = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ];

  // Mobile menu items
  const mobileItems = ['Home', 'Gallery', 'Services', 'Contact', 'Admin'];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0 border-b border-[#8D6E63]/20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-[#3D2817] hover:text-[#6D4C41] transition-colors truncate">
              Mahi Mehendi
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#6D4C41] hover:text-[#3D2817] font-medium transition-colors relative group text-sm lg:text-base whitespace-nowrap"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6D4C41] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-[#6D4C41] shrink-0 ml-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-t border-[#8D6E63]/20"
          >
            {mobileItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="block px-4 py-2 text-[#6D4C41] hover:text-[#3D2817] hover:bg-[#FFF8F0] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
