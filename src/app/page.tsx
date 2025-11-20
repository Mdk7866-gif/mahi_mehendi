'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Users, Award, Clock, CheckCircle2, ArrowRight, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.3
    }
  }
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8 }
  }
};

const heroBackgrounds = [
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
    title: 'Bridal Elegance',
    subtitle: 'Intricate designs for your special day'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
    title: 'Romantic Moments',
    subtitle: 'Celebrate love with beautiful henna'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
    title: 'Joyful Celebrations',
    subtitle: 'Perfect for baby showers & sangeets'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp',
    title: 'Modern Elegance',
    subtitle: 'Minimalist designs for everyday style'
  }
];

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
  price?: string;
}

/* --------------------------
   DUMMY SERVICES (moved out)
   -------------------------- */
const DUMMY_SERVICES: Service[] = [
  {
    id: 'bridal',
    title: 'Bridal Mehendi',
    description: 'Intricate bridal patterns for hands & feet — handcrafted with premium natural henna for long-lasting colour and beautiful details.',
    features: ['Full hands & feet', 'Custom bridal motifs', 'Premium natural paste', 'Aftercare tips'],
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
    alt: 'Bridal mehendi',
    ctaText: 'Book Now',
    ctaLink: '/contact',
    price: 'From ₹799'
  },
  {
    id: 'engagement',
    title: 'Engagement Mehendi',
    description: 'Romantic and elegant designs perfect for engagement ceremonies — fast application suitable for the event flow.',
    features: ['Floral & romantic motifs', 'Quick application', 'Guest-friendly designs', 'Safe for pregnancy'],
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
    alt: 'Engagement mehendi',
    ctaText: 'Book Now',
    ctaLink: '/contact',
    price: 'From ₹399'
  },
  {
    id: 'babyshower',
    title: 'Baby Shower & Sangeet',
    description: 'Playful, themed designs for baby showers and sangeet nights — group packages available.',
    features: ['Group packages', 'Themed motifs', 'Quick sessions', 'Customization available'],
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
    alt: 'Baby shower mehendi',
    ctaText: 'Book Now',
    ctaLink: '/contact',
    price: 'From ₹150'
  }
];

export default function HomePage(): React.ReactElement {
  // Initialize services directly to avoid setting state in an effect (fixes ESLint rule).
  const [services] = useState<Service[]>(() => DUMMY_SERVICES);

  // Keep a short simulated loading to show spinner UX if desired
  const [loading, setLoading] = useState<boolean>(true);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);

  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Simulated small loading delay for polished UX — change or remove if not needed
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(bgInterval);
  }, []);

  const currentBg = heroBackgrounds[currentBgIndex];

  const applyTransform = useCallback(() => {
    const el = imgWrapperRef.current;
    if (!el) return;
    const { scale, tx, ty } = transformRef.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    setImageScale(scale);
  }, []);

  const openImageModal = useCallback((src: string) => {
    setModalSrc(src);
    setModalOpen(true);
    transformRef.current = { scale: 1, tx: 0, ty: 0 };
    setImageScale(1);
    requestAnimationFrame(() => applyTransform());
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, [applyTransform]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalSrc(null);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    transformRef.current = { scale: 1, tx: 0, ty: 0 };
    setImageScale(1);
    if (imgWrapperRef.current) imgWrapperRef.current.style.transform = '';
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalOpen) closeModal();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, closeModal]);

  // Wheel zoom handler
  const onModalWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    transformRef.current.scale = Math.min(3, Math.max(1, transformRef.current.scale * delta));
    applyTransform();
  }, [applyTransform]);

  // Mouse down / move / up for panning
  const onMouseDown = (e: React.MouseEvent) => {
    isPanningRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanningRef.current || !lastMouseRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    transformRef.current.tx += dx;
    transformRef.current.ty += dy;
    applyTransform();
  };

  const onMouseUp = () => {
    isPanningRef.current = false;
    lastMouseRef.current = null;
  };

  // Touch panning (basic)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouchRef.current = { x: t.clientX, y: t.clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!lastTouchRef.current || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - lastTouchRef.current.x;
    const dy = t.clientY - lastTouchRef.current.y;
    lastTouchRef.current = { x: t.clientX, y: t.clientY };
    transformRef.current.tx += dx;
    transformRef.current.ty += dy;
    applyTransform();
  };

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
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Transition */}
         {/* Background Image with Smooth Transition */}
         <AnimatePresence initial={false}>
          <motion.div
            key={currentBgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image
              src={currentBg.image}
              alt={currentBg.title}
              fill
              className="object-cover"
              priority={currentBgIndex === 0}
              quality={85}
              loading={currentBgIndex === 0 ? undefined : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          <motion.div 
            variants={heroChildVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-6 shadow-lg"
          >
            <Sparkles className="text-amber-300" size={18} />
            <span className="text-sm font-medium text-white">Premium Mehendi Artistry Since 2016</span>
          </motion.div>

          <motion.h1
            variants={heroChildVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Timeless Henna,
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
              Eternal Memories
            </span>
          </motion.h1>

          <motion.p
            variants={heroChildVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Exquisite Mehendi designs that blend tradition with elegance — 
            perfect for your special moments
          </motion.p>

          <motion.div
            variants={heroChildVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/services"
                prefetch={true}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl transition-all"
              >
                Explore Services
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/gallery"
                prefetch={true}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/80 backdrop-blur-md bg-white/10 text-white hover:bg-white hover:text-amber-900 rounded-full font-bold text-base sm:text-lg transition-all"
              >
                View Gallery
              </Link>
            </motion.div>
          </motion.div>

          {/* Slide Indicators */}
          <motion.div 
            variants={heroChildVariants}
            className="flex justify-center gap-2 mt-12"
          >
            {heroBackgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBgIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentBgIndex 
                    ? 'w-8 bg-amber-400' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-5 py-2.5 mb-4"
            >
              <Award className="text-amber-600" size={18} />
              <span className="text-sm text-amber-800 font-semibold">Featured Services</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 mb-4">
              Our Signature Offerings
            </h2>
            <p className="text-amber-700 text-base sm:text-lg max-w-2xl mx-auto">
              Discover designs tailored for every celebration, crafted with premium natural henna
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((service) => (
              <motion.article
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white rounded-3xl shadow-lg border border-amber-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50"
                  onClick={() => openImageModal(service.image)}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={80}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-amber-800">
                        <CheckCircle2 size={14} className="text-amber-600 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={service.ctaLink}
                      prefetch={true}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all"
                    >
                      {service.ctaText}
                      <Calendar size={16} />
                    </Link>
                    <Link
                      href="/gallery"
                      prefetch={true}
                      className="px-4 py-2.5 border-2 border-amber-300 hover:bg-amber-50 text-amber-700 rounded-full font-semibold text-sm transition-all"
                    >
                      Gallery
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/services"
              prefetch={true}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all"
            >
              View All Services
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { icon: Users, label: 'Happy Clients', value: '500+' },
              { icon: Star, label: 'Years Experience', value: '8+' },
              { icon: Award, label: 'Events Covered', value: '1000+' },
              { icon: Clock, label: 'Average Time', value: '30-90 min' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30"
                >
                  <stat.icon className="text-white" size={32} />
                </motion.div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-white/90 text-sm sm:text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-5 py-2.5 mb-4">
              <Sparkles className="text-amber-600" size={18} />
              <span className="text-sm text-amber-800 font-semibold">Design Inspiration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 mb-4">
              Gallery Highlights
            </h2>
            <p className="text-amber-700 text-base sm:text-lg max-w-2xl mx-auto">
              A glimpse into our world of intricate henna artistry
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {heroBackgrounds.map((bg, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openImageModal(bg.image)}
              >
                <Image
                  src={bg.image}
                  alt={bg.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-bold text-sm">{bg.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/gallery"
              prefetch={true}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all"
            >
              View Full Gallery
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-50 to-orange-50 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-200/50"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4"
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-900 mb-4">
                About Mahi Mehendi
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                With a passion for cultural artistry, Mahi brings 8+ years of expertise to every design. 
                From bridal extravagance to subtle celebrations, we create henna that tells your story.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {['Premium Natural Henna', 'Custom Designs', 'Safe & Long-Lasting', 'Group Packages'].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <CheckCircle2 size={20} className="text-amber-600" />
                    <span className="text-xs sm:text-sm text-amber-800 font-medium text-center">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/about"
                prefetch={true}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all"
              >
                Learn More About Us
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 opacity-5 -z-10">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-orange-400 rounded-full blur-3xl"
        />
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {modalOpen && modalSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onWheel={onModalWheel}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div className="absolute top-6 right-6 z-60">
              <button
                onClick={closeModal}
                className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 text-white hover:bg-white/20"
                aria-label="Close image"
              >
                Close
              </button>
            </div>

            <div
              ref={imgWrapperRef}
              className="max-w-[90vw] max-h-[85vh] touch-pan-y"
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              role="presentation"
              style={{ transition: 'transform 0.05s linear' }}
            >
              <Image
                src={modalSrc}
                alt="preview"
                width={1200}
                height={900}
                className="object-contain"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            </div>

            {/* zoom indicator */}
            <div className="absolute bottom-6 left-6 text-white bg-black/30 px-3 py-1 rounded-md text-sm">
              {Math.round(imageScale * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
