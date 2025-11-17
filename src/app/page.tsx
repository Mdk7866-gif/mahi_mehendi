'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Sparkles, Users, Award, Heart, Clock, CheckCircle2 } from 'lucide-react';
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

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage(): React.ReactElement {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-center p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={28} />
          </div>
          <p className="mt-4 text-sm text-amber-800 font-medium">Crafting your Mehendi magic...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hero-bg { 
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(251, 191, 36, 0.8) 50%, rgba(239, 68, 68, 0.8) 100%), 
                     url('https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp') center/cover no-repeat fixed; 
          background-blend-mode: overlay;
        }
        .service-image { height: 200px; }
        @media (min-width: 768px) {
          .service-image { height: 240px; }
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="hero-bg min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center text-white py-12 sm:py-16 relative overflow-hidden">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          >
            <motion.div variants={heroChildVariants} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4 shadow-lg">
              <Sparkles className="text-white" size={16} />
              <span className="text-xs font-medium">Premium Mehendi Artistry</span>
            </motion.div>
            <motion.h1 
              variants={heroChildVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg"
            >
              Timeless Henna, 
              <br />
              Eternal Memories
            </motion.h1>
            <motion.p 
              variants={heroChildVariants}
              className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md"
            >
              Exquisite Mehendi designs that blend tradition with elegance — perfect for your special moments.
            </motion.p>
            <motion.div 
              variants={heroChildVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-amber-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Explore Services
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-amber-900 transition-all"
              >
                View Gallery
              </Link>
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </section>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Featured Services */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-4 mx-auto">
                <Award className="text-amber-600" size={16} />
                <span className="text-sm text-amber-800 font-medium">Featured Services</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">Our Signature Offerings</h2>
              <p className="text-amber-700 text-sm max-w-xl mx-auto">Discover designs tailored for every celebration, crafted with premium natural henna.</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  title: 'Bridal Mehendi',
                  desc: 'Intricate bridal patterns for hands & feet — handcrafted with premium natural henna.',
                  price: 'From ₹6,999',
                  image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
                  link: '/services'
                },
                {
                  title: 'Engagement Mehendi',
                  desc: 'Romantic and elegant designs perfect for engagement ceremonies.',
                  price: 'From ₹3,499',
                  image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
                  link: '/services'
                },
                {
                  title: 'Baby Shower Mehendi',
                  desc: 'Playful, themed designs for baby showers and sangeet nights.',
                  price: 'From ₹1,199',
                  image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
                  link: '/services'
                },
                {
                  title: 'Sider Mehendi',
                  desc: 'Minimalist side-hand designs for subtle elegance.',
                  price: 'From ₹699',
                  image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp',
                  link: '/services'
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  whileHover={cardHoverVariants}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200 overflow-hidden cursor-pointer"
                  onClick={() => {}} // Placeholder
                >
                  <div className="service-image relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      draggable={false}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-2">{service.title}</h3>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{service.desc}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-amber-700 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {service.price}
                      </span>
                    </div>
                    <Link
                      href={service.link}
                      className="w-full inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Gallery Preview */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-4 mx-auto">
                <Sparkles className="text-amber-600" size={16} />
                <span className="text-sm text-amber-800 font-medium">Design Inspiration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">Gallery Highlights</h2>
              <p className="text-amber-700 text-sm max-w-xl mx-auto">A glimpse into our world of intricate henna artistry.</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {[
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp',
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
                'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg'
              ].map((imgSrc, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="group relative overflow-hidden rounded-2xl shadow-md border border-amber-200 bg-white/95 cursor-pointer aspect-square"
                >
                  <img
                    src={imgSrc}
                    alt="Gallery Preview"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link href="/gallery" className="absolute inset-0 flex items-end p-4">
                    <span className="text-white font-bold text-sm">View More</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              className="text-center mt-8"
            >
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md"
              >
                Full Gallery
              </Link>
            </motion.div>
          </motion.section>

          {/* Quick Stats */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
            >
              {[
                { icon: Users, label: 'Happy Clients', value: '500+' },
                { icon: Heart, label: 'Years Experience', value: '8+' },
                { icon: Award, label: 'Events Covered', value: '1000+' },
                { icon: Clock, label: 'Design Time', value: '30-90 min' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-amber-200"
                >
                  <stat.icon className="mx-auto mb-2 text-amber-600" size={32} />
                  <h3 className="text-2xl font-bold text-amber-900 mb-1">{stat.value}</h3>
                  <p className="text-amber-700 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* About Snippet */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-amber-200">
              <Sparkles className="mx-auto mb-4 text-amber-600" size={32} />
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4">About Mahi Mehendi</h2>
              <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
                With a passion for cultural artistry, Mahi brings 8+ years of expertise to every design. From bridal extravagance to subtle celebrations, we create henna that tells your story.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[
                  'Premium Natural Henna',
                  'Custom Designs',
                  'Safe & Long-Lasting',
                  'Group Packages'
                ].map((feature, i) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-amber-800"
                  >
                    <CheckCircle2 size={12} className="text-amber-600" />
                    {feature}
                  </motion.span>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:shadow-md"
              >
                Learn More
              </Link>
            </div>
          </motion.section>

          {/* Final CTA */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
              <Sparkles className="mx-auto mb-4" size={32} />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Adorn Your Hands?</h2>
              <p className="text-amber-100 text-sm sm:text-base mb-6 max-w-md mx-auto">
                Book your Mehendi session today and let us create magic for your special day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-amber-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Book Now
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-amber-900 transition-all"
                >
                  View Services
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-6 w-40 h-40 bg-amber-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-12 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-12 w-56 h-56 bg-rose-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </main>
    </>
  );
}