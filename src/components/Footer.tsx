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
                <svg
                  className="w-6 h-6 text-[#6D4C41]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2C7.5 2 4 5.1 4 9.2c0 3.9 3 7.4 8 12 5-4.6 8-8.1 8-12C20 5.1 16.5 2 12 2z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[#3D2817] font-semibold text-sm sm:text-base">Mahi Mehendi</span>
            </div>
            <p className="text-[#6D4C41] text-xs sm:text-sm leading-tight">
              Elegant henna designs for every occasion — bridal, festivals, and parties.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#3D2817] font-semibold text-sm mb-2">Quick links</h4>
            <ul className="space-y-1">
              <li><a href="/" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Home</a></li>
              <li><a href="/gallery" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Gallery</a></li>
              <li><a href="/services" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Services</a></li>
              <li><a href="/about" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">About</a></li>
              <li><a href="/contact" className="text-[#6D4C41] text-xs sm:text-sm hover:text-[#3D2817]">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#3D2817] font-semibold text-sm mb-2">Contact</h4>
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-[#6D4C41]">
              <a href="tel:+918511402381" className="hover:text-[#3D2817]">
                +91 85114 02381
              </a>
              <a href="mailto:mahi.mehendi@gmail.com" className="hover:text-[#3D2817]">
                mahi.mehendi@gmail.com
              </a>
            </div>
          </div>

          {/* Address & Social */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[#3D2817] font-semibold text-sm mb-1">Location</h4>
            <address className="not-italic text-[#6D4C41] text-xs sm:text-sm leading-tight">
              A/4 Al-Aksha Duplex,<br />
              Kajuri Road, Beral Market,<br />
              Chandola Lake, Danilimda,<br />
              Ahmedabad, Gujarat
            </address>

            <a
              href="https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6D4C41] hover:text-[#3D2817] text-xs sm:text-sm underline mt-1"
            >
              View on Map
            </a>

            {/* Instagram */}
            <div className="mt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/mehendi_by_mahii_2"
                target="_blank"
                className="flex items-center gap-2 text-[#6D4C41] hover:text-[#3D2817] text-xs sm:text-sm font-medium"
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
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-[#8D6E63]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-[#6D4C41]">
          <span>© {new Date().getFullYear()} Mahi Mehendi</span>
          <span className="hidden sm:inline">— Crafted with love and artistry</span>
          <a href="/privacy" className="underline hover:text-[#3D2817]">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
