'use client';
import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-white border-t border-[#8D6E63]/20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top: compact grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-start">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFF8F0] border border-[#8D6E63]/20">
                {/* small logo (svg) */}
                <svg className="w-6 h-6 text-[#6D4C41]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2C7.5 2 4 5.1 4 9.2c0 3.9 3 7.4 8 12 5-4.6 8-8.1 8-12C20 5.1 16.5 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[#3D2817] font-semibold text-sm sm:text-base">Mahi Mehendi</span>
            </div>
            <p className="text-[#6D4C41] text-xs sm:text-sm leading-tight">
              Elegant henna designs for every occasion — bridal, festivals, and parties.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#3D2817] font-semibold text-sm mb-2">Quick links</h4>
            <ul className="space-y-1">
              <li>
                <a href="/" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Home</a>
              </li>
              <li>
                <a href="/gallery" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Gallery</a>
              </li>
              <li>
                <a href="/services" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Services</a>
              </li>
              <li>
                <a href="/contact" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#3D2817] font-semibold text-sm mb-2">Contact</h4>
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-[#6D4C41]">
              <a href="tel:+919999999999" className="flex items-center gap-2 hover:text-[#3D2817]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 5.5v4a2 2 0 0 0 2 2h1.6a1 1 0 0 1 1 .7l.7 2.6a11 11 0 0 0 5.9 5.9l2.6.7a1 1 0 0 1 .7 1V19a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                +91 99999 99999
              </a>
              <a href="mailto:mahi.mehendi@gmail.com" className="flex items-center gap-2 hover:text-[#3D2817]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 6l-9 6L3 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                mahi.mehendi@gmail.com
              </a>
            </div>
          </div>

          {/* Address & Social */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[#3D2817] font-semibold text-sm mb-1">Location</h4>
            <address className="not-italic text-[#6D4C41] text-xs sm:text-sm leading-tight">
              Near ABC Street<br/>Jaipur, Rajasthan 302001
            </address>
            <a
              href="https://maps.google.com/?q=Near%20ABC%20Street%20Jaipur%20302001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6D4C41] hover:text-[#3D2817] text-xs sm:text-sm underline mt-1"
            >
              View on Map
            </a>

            <div className="mt-2 flex items-center gap-3">
              <a href="https://instagram.com/mahi_mehendi_art" target="_blank" rel="noreferrer" className="group">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6 text-[#6D4C41] group-hover:text-[#3D2817]" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </a>
              {/* add more icons if needed */}
            </div>
          </div>
        </div>

        {/* Bottom: single-line compact */}
        <div className="mt-6 pt-4 border-t border-[#8D6E63]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-[#6D4C41]">
          <span>© {new Date().getFullYear()} Mahi Mehendi</span>
          <span className="hidden sm:inline">— Crafted with love and artistry</span>
          <a href="/privacy" className="text-[#6D4C41] hover:text-[#3D2817] underline text-xs sm:text-sm">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
