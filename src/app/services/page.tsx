'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Award, CheckCircle2 } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

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

interface CourseModule {
  title: string;
  duration: string;
  description: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ServicesPage(): React.ReactElement {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);

  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const lastTouchRef = useRef<
    | { type: 'pinch'; distance: number; scaleStart: number; mid: { x: number; y: number } }
    | { type: 'pan'; x: number; y: number }
    | null
  >(null);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const dummyServices: Service[] = [
      {
        id: 'bridal',
        title: 'Bridal Mehendi',
        description:
          'Intricate bridal patterns for hands & feet — handcrafted with premium natural henna for long-lasting colour and beautiful details.',
        features: ['Full hands & feet', 'Custom bridal motifs', 'Premium natural paste', 'Aftercare tips'],
        image:
          'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
        alt: 'Bridal mehendi',
        ctaText: 'Book Now',
        ctaLink: '/contact',
        price: 'From ₹6,999'
      },
      {
        id: 'engagement',
        title: 'Engagement Mehendi',
        description:
          'Romantic and elegant designs perfect for engagement ceremonies — fast application suitable for the event flow.',
        features: ['Floral & romantic motifs', 'Quick application', 'Guest-friendly designs', 'Safe for pregnancy'],
        image:
          'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
        alt: 'Engagement mehendi',
        ctaText: 'Book Now',
        ctaLink: '/contact',
        price: 'From ₹3,499'
      },
      {
        id: 'babyshower',
        title: 'Baby Shower & Sangeet Mehendi',
        description:
          'Playful, themed designs for baby showers and sangeet nights — group packages available to make the event fun and memorable.',
        features: ['Group packages', 'Themed motifs', 'Quick sessions', 'Customization available'],
        image:
          'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
        alt: 'Baby shower mehendi',
        ctaText: 'Book Now',
        ctaLink: '/contact',
        price: 'Packages from ₹1,199'
      },
      {
        id: 'sider',
        title: 'Sider Mehendi',
        description:
          'Minimalist side-hand and wrist-focused designs — ideal for everyday style, office events, or when you want subtle elegance.',
        features: ['Side-hand motifs', '30-45 min sessions', 'Minimal & modern', 'Long-lasting stain'],
        image:
          'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp',
        alt: 'Sider mehendi',
        ctaText: 'Book Now',
        ctaLink: '/contact',
        price: 'From ₹699'
      }
    ];

    const timer = setTimeout(() => {
      setServices(dummyServices);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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

  function getDistance(t1: React.Touch, t2: React.Touch) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(t1: React.Touch, t2: React.Touch) {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  }

  function onTouchStart(e: React.TouchEvent) {
    if (!modalOpen) return;
    const touches = e.touches;
    if (touches.length === 2) {
      lastTouchRef.current = {
        type: 'pinch',
        distance: getDistance(touches[0], touches[1]),
        scaleStart: transformRef.current.scale,
        mid: getMidpoint(touches[0], touches[1])
      };
    } else if (touches.length === 1) {
      lastTouchRef.current = {
        type: 'pan',
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!modalOpen) return;
    const touches = e.touches;
    if (!lastTouchRef.current) return;

    if (lastTouchRef.current.type === 'pinch' && touches.length === 2) {
      const newDistance = getDistance(touches[0], touches[1]);
      const scaleFactor = newDistance / lastTouchRef.current.distance;
      let newScale = lastTouchRef.current.scaleStart * scaleFactor;
      newScale = Math.max(1, Math.min(4, newScale));
      transformRef.current.scale = newScale;

      const newMid = getMidpoint(touches[0], touches[1]);
      const dx = newMid.x - lastTouchRef.current.mid.x;
      const dy = newMid.y - lastTouchRef.current.mid.y;
      transformRef.current.tx += dx;
      transformRef.current.ty += dy;

      lastTouchRef.current.mid = newMid;
      applyTransform();
    } else if (lastTouchRef.current.type === 'pan' && touches.length === 1) {
      const t = touches[0];
      const dx = t.clientX - lastTouchRef.current.x;
      const dy = t.clientY - lastTouchRef.current.y;
      lastTouchRef.current.x = t.clientX;
      lastTouchRef.current.y = t.clientY;

      if (transformRef.current.scale > 1) {
        transformRef.current.tx += dx;
        transformRef.current.ty += dy;
        applyTransform();
      }
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!modalOpen) return;
    if (e.touches.length === 0) {
      lastTouchRef.current = null;
      if (transformRef.current.scale <= 1.02) {
        transformRef.current.scale = 1;
        transformRef.current.tx = 0;
        transformRef.current.ty = 0;
        applyTransform();
      }
    }
  }

  function onWheel(e: React.WheelEvent) {
    if (!modalOpen) return;
    e.preventDefault();

    const el = imgWrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? 1.08 : 0.92;
    let newScale = transformRef.current.scale * zoomFactor;
    newScale = Math.max(1, Math.min(5, newScale));

    const prevScale = transformRef.current.scale;
    const scaleRatio = newScale / prevScale;

    transformRef.current.tx = (transformRef.current.tx - cx) * scaleRatio + cx;
    transformRef.current.ty = (transformRef.current.ty - cy) * scaleRatio + cy;
    transformRef.current.scale = newScale;

    applyTransform();
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!modalOpen) return;
    if (transformRef.current.scale <= 1.02) return;
    isPanningRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).classList.add('cursor-grabbing');
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!modalOpen) return;
    if (!isPanningRef.current || !lastMouseRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    transformRef.current.tx += dx;
    transformRef.current.ty += dy;
    applyTransform();
  }

  function onMouseUp() {
    isPanningRef.current = false;
    lastMouseRef.current = null;
    const el = imgWrapperRef.current;
    if (el) el.classList.remove('cursor-grabbing');
  }

  function onDoubleClick() {
    transformRef.current = { scale: 1, tx: 0, ty: 0 };
    applyTransform();
  }

  const courseModules: CourseModule[] = [
    { title: 'Cone Making', duration: '1 Session', description: 'Perfect henna cones for smooth lines.' },
    { title: 'Basic Mehendi', duration: '2 Sessions', description: 'Foundational patterns and flow.' },
    { title: 'Designer Mehendi', duration: '3 Sessions', description: 'Modern motifs and creative fillers.' },
    { title: 'Advanced Bridal Mehendi', duration: '4 Sessions', description: 'Complex bridal layouts and timing.' }
  ];

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
          <p className="mt-4 text-sm text-amber-800 font-medium">Crafting your Mehendi magic...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <style>{`
        .image-modal-backdrop { background: rgba(10,10,10,0.9); backdrop-filter: blur(6px); z-index: 60; }
        .image-modal-content { touch-action: none; will-change: transform; }
        .cursor-grabbing { cursor: grabbing !important; }
        html, body { overscroll-behavior-x: contain; }
      `}</style>

      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-4 shadow-sm">
              <Sparkles className="text-amber-600" size={16} />
              <span className="text-xs sm:text-sm text-amber-800 font-medium">Premium Mehendi Artistry</span>
            </div>
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 leading-tight mb-3"
            >
              Our Services
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-amber-700 text-sm sm:text-base max-w-2xl mx-auto"
            >
              Exquisite henna designs for every celebration — from intimate gatherings to grand weddings.
            </motion.p>
          </motion.header>

          {/* Services Grid */}
          <section aria-labelledby="services-heading" className="mb-12 sm:mb-16">
            <h2 id="services-heading" className="sr-only">Services</h2>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  onImageClick={openImageModal}
                />
              ))}
            </motion.div>
          </section>

          {/* Course Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            aria-labelledby="course-heading"
          >
            <h2 id="course-heading" className="sr-only">Mehendi Mastery Course</h2>

            <motion.div 
              initial={{ scale: 0.98 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/50 p-5 sm:p-6 lg:p-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6"
              >
                <div className="flex-1">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 mb-3"
                  >
                    <Award className="text-amber-600" size={16} />
                    <span className="text-xs text-amber-800 font-medium uppercase tracking-wider">Certified Course</span>
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-2">Mehendi Mastery Course</h3>
                  <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                    Complete certification program from basics to bridal expertise with hands-on practice and mentorship.
                  </p>
                </div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full lg:w-auto"
                >
                  <button className="w-full lg:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
                    Enroll Now
                  </button>
                </motion.div>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
              >
                {courseModules.map((module, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div 
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm text-sm sm:text-base"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {idx + 1}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <div className="text-sm sm:text-base font-semibold text-amber-900">{module.title}</div>
                          <div className="flex items-center gap-1 text-xs text-amber-700 bg-white px-2 py-1 rounded-full border border-amber-200 w-fit">
                            <Clock size={12} />
                            {module.duration}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700">{module.description}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-amber-600" size={16} />
                  <span className="text-sm sm:text-base font-semibold text-amber-800">Course Benefits</span>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    'Official Certificate',
                    'Portfolio Review',
                    'Lifetime Support',
                    'Practice Kits'
                  ].map((benefit, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-xs sm:text-sm text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>
        </motion.div>

        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-6 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-6 w-56 h-56 bg-orange-400 rounded-full blur-3xl" />
        </div>
      </main>

      {/* Image Modal */}
      {modalOpen && modalSrc && (
        <div
          className="fixed inset-0 flex items-center justify-center image-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full h-full max-w-full max-h-full p-4 box-border flex items-center justify-center">
            <button 
              onClick={closeModal} 
              aria-label="Close image" 
              className="absolute top-4 right-4 z-50 bg-white/95 hover:bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
            >
              Close
            </button>

            <div
              ref={imgWrapperRef}
              className="image-modal-content rounded-md overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onDoubleClick={onDoubleClick}
              style={{
                transition: 'transform 0.02s linear',
                transform: 'translate(0px, 0px) scale(1)',
                touchAction: 'none',
                maxWidth: '95vw',
                maxHeight: '95vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: imageScale > 1 ? 'grab' : 'auto'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalSrc}
                alt="Service preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  display: 'block',
                  userSelect: 'none',
                  touchAction: 'none',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}