'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Sparkles, Users, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const cardHoverVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export default function AboutPage(): React.ReactElement {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100"
      >
        <div className="text-center p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={28} />
          </div>
          <p className="mt-4 text-sm text-amber-800 font-medium">Crafting your story...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <style>{`
        .about-hero { background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%); }
        .artist-image { max-height: 400px; }
        @media (min-width: 768px) {
          .artist-image { max-height: 500px; }
        }
      `}</style>

      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-3 shadow-sm mx-auto">
              <Sparkles className="text-amber-600" size={14} />
              <span className="text-xs text-amber-800 font-medium">Our Journey</span>
            </div>
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-900 leading-tight"
            >
              About Mahi Mehendi
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-amber-700 text-xs sm:text-sm max-w-xl mx-auto mt-2"
            >
              Where tradition meets artistry — crafting timeless henna stories for generations.
            </motion.p>
          </motion.header>

          {/* Hero Section with Artist Image */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 about-hero rounded-3xl p-6 sm:p-8 bg-white/60 backdrop-blur-sm border border-amber-200/50"
          >
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="lg:w-1/2">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-2xl font-bold text-amber-900 mb-3"
                >
                  Meet Mahi — The Heart Behind the Henna
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4"
                >
                  With over 5 years of passion poured into every intricate design, Mahi blends ancient Mehendi traditions with contemporary flair. 
                  From humble family gatherings to lavish weddings, her artistry has touched thousands of hands, creating memories that last a lifetime.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center gap-1 text-xs bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    <Award className="text-amber-600" size={12} />
                    <span>Certified Artist</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    <Heart className="text-amber-600" size={12} />
                    <span>5+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    <Users className="text-amber-600" size={12} />
                    <span>100+ Events</span>
                  </div>
                </motion.div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <motion.div 
                  className="artist-image rounded-2xl overflow-hidden shadow-lg border-4 border-white/50 relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', maxWidth: 520 }}
                >
                  {/* Next.js Image: responsive, optimized */}
                  <Image
                    src="https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp"
                    alt="Mahi, the artist behind Mahi Mehendi"
                    width={800}
                    height={800}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
                    style={{ objectFit: 'cover', width: '100%', height: '100%', aspectRatio: '1/1' }}
                    priority={false}
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Our Story Section */}
          <section className="mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-amber-900 text-center mb-6"
            >
              Our Story
            </motion.h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-md">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Born from a love for cultural traditions and creative expression, Mahi Mehendi started as a small family venture in the vibrant lanes of Ahmedabad. 
                  What began with simple designs for neighborhood festivals has blossomed into a celebrated name in bridal and event henna artistry.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-md">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Every stroke is infused with joy, precision, and a deep respect for the art&apos;s roots. We believe henna is more than decoration — it&apos;s a celebration of life&apos;s beautiful moments.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Our Values Section */}
          <section className="mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-amber-900 text-center mb-6"
            >
              Our Values
            </motion.h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { icon: Heart, title: 'Authenticity', desc: 'Using only premium, natural henna for safe, long-lasting designs that honor tradition.' },
                { icon: Users, title: 'Personalization', desc: 'Tailored motifs that reflect your unique story and style — no two designs are alike.' },
                { icon: Award, title: 'Excellence', desc: 'Committed to flawless artistry, hygiene, and timely service for every celebration.' }
              ].map((value) => (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={cardHoverVariants}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-md text-center"
                >
                  <value.icon className="mx-auto mb-3 text-amber-600" size={32} />
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* CTA Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200">
              <Sparkles className="mx-auto mb-3 text-amber-600" size={24} />
              <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3">Ready to Create Magic?</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-6 max-w-md mx-auto">
                Let&apos;s bring your vision to life with exquisite Mehendi designs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md"
                >
                  Explore Services
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-sm text-amber-700 hover:text-amber-800 underline decoration-amber-400 underline-offset-4 px-6 py-3 rounded-full bg-white/0"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-6 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-6 w-56 h-56 bg-orange-400 rounded-full blur-3xl" />
        </div>
      </main>
    </>
  );
}
