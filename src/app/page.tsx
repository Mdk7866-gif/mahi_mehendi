'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Home page matched to Services look-and-feel.
 * - Hero supports optional Lottie or MP4 in /public/animations/
 * - If no animation exists it shows a styled placeholder
 *
 * Paste directly to src/app/page.tsx
 */

export default function HomePage() {
  const [hasLottie, setHasLottie] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [LottieComp, setLottieComp] = useState<unknown>(null);
  const lottieUrl = '/animations/hero.json';
  const videoUrl = '/animations/hero.mp4';

  useEffect(() => {
    let mounted = true;

    fetch(lottieUrl, { method: 'HEAD' })
      .then((res) => {
        if (!mounted) return;
        if (res.ok) {
          setHasLottie(true);
          import('lottie-react')
            .then((m) => {
              if (mounted) setLottieComp(() => m.default);
            })
            .catch(() => {
              // user will see friendly instruction if lottie-react missing
            });
        } else {
          fetch(videoUrl, { method: 'HEAD' }).then((r2) => {
            if (!mounted) return;
            if (r2.ok) setHasVideo(true);
          });
        }
      })
      .catch(() => {
        fetch(videoUrl, { method: 'HEAD' })
          .then((r2) => {
            if (!mounted) return;
            if (r2.ok) setHasVideo(true);
          })
          .catch(() => {});
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div className="inline-block">
                <span className="text-sm font-semibold text-amber-800 bg-amber-100 px-4 py-2 rounded-full">
                  ✨ Traditional Art, Modern Touch
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to
                <span className="block text-amber-800 mt-2">Mahi Mehendi</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover elegant henna designs for every occasion. From simple normal mehendi to exquisite bridal artistry.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/gallery" className="inline-block">
                  <motion.a whileHover={{ scale: 1.02 }} className="bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-all duration-300 shadow-md hover:shadow-lg text-center">
                    Explore Gallery
                  </motion.a>
                </Link>
                <Link href="/services" className="inline-block">
                  <motion.a whileHover={{ scale: 1.02 }} className="bg-white text-amber-900 border-2 border-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 text-center">
                    Book a Service
                  </motion.a>
                </Link>
              </div>
            </div>

            {/* Right Image/Animation */}
            <div className="order-1 lg:order-2">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                  {hasLottie && LottieComp ? (
                    // @ts-expect-error - Lottie component type resolved dynamically
                    <LottieComp animationData={undefined} style={{ width: '100%', height: '100%' }} loop autoplay />
                  ) : hasLottie && !LottieComp ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-sm text-gray-700 max-w-xs">
                        Lottie animation found at <code className="break-words">/public/animations/hero.json</code> but <code>lottie-react</code> is not installed.
                      </p>
                      <pre className="text-xs bg-white/70 p-2 rounded mt-3">pnpm add lottie-react</pre>
                    </div>
                  ) : hasVideo ? (
                    <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                      <div className="w-40 h-40 rounded-2xl bg-white/70 flex items-center justify-center text-8xl">🤲</div>
                      <div className="mt-4 text-center">
                        <p className="font-semibold text-gray-800">Hero animation placeholder</p>
                        <p className="text-sm text-gray-600 max-w-xs mx-auto mt-2">
                          To add animations drop files into <code>/public/animations/</code>
                        </p>
                        <div className="mt-3">
                          <a className="inline-block text-amber-900 underline" href="https://lottiefiles.com/" target="_blank" rel="noreferrer">
                            Browse free Lottie animations
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services — same visuals as services page for consistency */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Mehendi Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We travel for events and provide on-site application. Every design is customized for the occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bridal */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-amber-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4">B</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bridal Mehendi</h3>
              <p className="text-gray-600 text-sm mb-4">Full bridal artistry</p>
              <p className="text-gray-700 mb-4">Intricate, full-hand bridal designs tailored to your look — fusion, Indo-Arabic, traditional Rajasthani motifs, and modern floral compositions.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹2,500</span>
                <Link href="/services" className="bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">Book Now</Link>
              </div>
            </motion.div>

            {/* Engagement */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.04 }} className="bg-white rounded-xl p-6 shadow-sm border border-[#8D6E63]/10">
              <div className="w-12 h-12 bg-[#FFF8F0] text-[#6D4C41] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">E</div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-2">Engagement / Pre-wedding</h3>
              <p className="text-[#6D4C41] text-sm mb-4">Elegant event designs — delicate wrists, palms and arms.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹1,200</span>
                <Link href="/services" className="bg-[#6D4C41] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#3D2817] transition-colors">Book Now</Link>
              </div>
            </motion.div>

            {/* Baby Shower */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="bg-white rounded-xl p-6 shadow-sm border border-[#8D6E63]/10">
              <div className="w-12 h-12 bg-[#FFF8F0] text-[#6D4C41] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">S</div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-2">Baby Shower Mehendi</h3>
              <p className="text-[#6D4C41] text-sm mb-4">Soft & joyful motifs perfect for moms-to-be.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹800</span>
                <Link href="/services" className="bg-[#6D4C41] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#3D2817] transition-colors">Book Now</Link>
              </div>
            </motion.div>

            {/* Casual */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="bg-white rounded-xl p-6 shadow-sm border border-[#8D6E63]/10">
              <div className="w-12 h-12 bg-[#FFF8F0] text-[#6D4C41] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">C</div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-2">Sider / Casual Mehendi</h3>
              <p className="text-[#6D4C41] text-sm mb-4">Quick, pretty and affordable options for casual gatherings.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From ₹300</span>
                <Link href="/services" className="bg-[#6D4C41] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#3D2817] transition-colors">Book Now</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#3D2817]">Want a custom design?</h3>
          <p className="text-[#6D4C41] mt-2">Reach out via the Contact page and we’ll tailor a package for you.</p>
          <div className="mt-6">
            <Link href="/contact">
              <button className="py-3 px-6 bg-[#6D4C41] text-white rounded-full font-semibold hover:bg-[#3D2817] transition">Contact Us</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
