'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Users, Award, Heart, Clock, CheckCircle2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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

// Floating image animation variants
const floatingVariants: Variants = {
  // use a non-reserved variant name
  float: (custom: number) => ({
    y: [0, -15, 0],
    rotate: [0, 5, 0],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 4 + custom * 0.5,
      repeat: Infinity,
      // cast literal types so TS accepts them
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
      delay: custom * 1,
    },
  }),
};

// Hero background images array
const heroBackgrounds = [
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp',
    overlay: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(251, 191, 36, 0.8) 50%, rgba(239, 68, 68, 0.8) 100%)'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg',
    overlay: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(74, 222, 128, 0.8) 50%, rgba(16, 185, 129, 0.8) 100%)'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg',
    overlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(168, 85, 247, 0.8) 50%, rgba(124, 58, 237, 0.8) 100%)'
  },
  {
    image: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp',
    overlay: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 50%, rgba(37, 99, 235, 0.8) 100%)'
  }
];

// Floating images configurations
const floatingConfigs = [
  { src: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397084/bridal_mehendi_b5jpzc.webp', top: '20%', left: '10%', size: 80 },
  { src: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397286/engagement_mehendi_x65njr.jpg', top: '60%', right: '15%', size: 60 },
  { src: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397620/baby_shower_ng29hv.jpg', top: '40%', left: '70%', size: 70 },
  { src: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1763397709/sider_mehendi_qqa8dt.webp', top: '80%', right: '40%', size: 50 }
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

export default function HomePage(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentFloatingIndex, setCurrentFloatingIndex] = useState(0);
  const [services, setServices] = useState<Service[]>([]);

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

    const t = setTimeout(() => {
      setServices(dummyServices);
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  // Change background every 5 seconds
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(bgInterval);
  }, []);

  // Change floating images every 7 seconds (offset from bg)
  useEffect(() => {
    const floatingInterval = setInterval(() => {
      setCurrentFloatingIndex((prev) => (prev + 1) % floatingConfigs.length);
    }, 7000);

    return () => clearInterval(floatingInterval);
  }, []);

  const currentBg = heroBackgrounds[currentBgIndex];
  const currentFloating = floatingConfigs[currentFloatingIndex];

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
        .service-image { height: 200px; }
        @media (min-width: 768px) {
          .service-image { height: 240px; }
        }
        .floating-img {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .service-card { overflow: hidden; }
        .service-image-outer { 
          min-width: 163px; 
          max-width: 40%; 
          height: auto;
          position: relative;
        }
        @media (min-width: 768px) {
          .service-image-outer { max-width: 272px; }
        }

        .image-modal-backdrop { background: rgba(10,10,10,0.9); backdrop-filter: blur(6px); z-index: 60; }
        .image-modal-content { touch-action: none; will-change: transform; }
        .cursor-grabbing { cursor: grabbing !important; }

        html, body { overscroll-behavior-x: contain; }

        .service-image-inner { transition: transform 0.3s ease; }
        .group:hover .service-image-inner { transform: scale(1.05); }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br mt-7 from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center text-white py-12 sm:py-16 relative overflow-hidden"
          style={{
            background: `${currentBg.overlay}, url('${currentBg.image}') center/cover no-repeat fixed`,
            backgroundBlendMode: 'overlay',
            transition: 'background-image 1s ease-in-out, background 1s ease-in-out'
          }}
        >
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

          {/* Single Rotating Floating Image (for simplicity, one main floating image that changes) */}
          <motion.div
  className="absolute pointer-events-none z-0 floating-img animate-float"
  style={{
    top: currentFloating.top,
    left: currentFloating.left,
    width: currentFloating.size,
    height: currentFloating.size,
    right: currentFloating.right ? currentFloating.right : 'unset',
  }}
  variants={floatingVariants}
  custom={0}
  animate="float"        // <- was "animate" before; now matches the variant name
  transition={{ duration: 1 }} // optional: you can keep or remove this
>
  <Image
    src={currentFloating.src}
    alt="Floating Hero Image"
    fill
    sizes="100px"
    style={{ objectFit: 'cover', borderRadius: '50%' }}
    draggable={false}
  />
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
              className="flex flex-col gap-4"
            >
              {services.map((s) => (
                <motion.article
                  key={s.id}
                  variants={itemVariants}
                  whileHover={cardHoverVariants}
                  className="service-card group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200 p-3 flex items-start gap-3 md:gap-4"
                  aria-labelledby={`service-${s.id}-title`}
                >
                  <div
                    className="service-image-outer flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-amber-300 group-hover:ring-amber-400 transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => openImageModal(s.image)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') openImageModal(s.image);
                    }}
                    aria-label={`Open ${s.title} image`}
                    title="Tap to open image"
                  >
                    <motion.div
                      className="service-image-inner w-full h-full relative"
                      style={{ aspectRatio: '3/4' }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(max-width: 768px) 40vw, 272px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-start justify-between mb-1 gap-2"
                    >
                      <h3 id={`service-${s.id}-title`} className="text-sm sm:text-base font-semibold text-amber-900 truncate">
                        {s.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-full border border-amber-200"
                        >
                          {s.price}
                        </motion.span>
                      </div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-[12px] sm:text-sm text-gray-700 leading-relaxed mb-2 line-clamp-3"
                    >
                      {s.description}
                    </motion.p>

                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mb-3"
                      aria-label={`${s.title} features`}
                    >
                      {s.features.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className="flex items-center gap-2 text-[11px] bg-amber-50 border border-amber-200 rounded-full px-2 py-1 text-amber-800"
                          whileHover={{ scale: 1.05 }}
                        >
                          <CheckCircle2 size={12} className="text-amber-600 flex-shrink-0" />
                          <span className="truncate max-w-[8rem]">{f}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href={s.ctaLink}
                          className="w-full sm:w-auto inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-center"
                        >
                          {s.ctaText}
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="/gallery"
                          className="w-full sm:w-auto inline-flex items-center justify-center text-sm text-amber-700 hover:text-amber-800 underline decoration-amber-400 underline-offset-4 transition-colors px-3 py-2 rounded-full bg-white/0 text-center"
                        >
                          View Gallery
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.article>
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
                  {/* gallery image: relative + Image fill */}
                  <div className="relative w-full h-full">
                    <Image
                      src={imgSrc}
                      alt={`Gallery preview ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: 'cover', transform: 'translateZ(0)' }}
                      draggable={false}
                      priority={false}
                    />
                  </div>

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
              ].map((stat) => (
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
                {['Premium Natural Henna', 'Custom Designs', 'Safe & Long-Lasting', 'Group Packages'].map((feature, i) => (
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
            <button onClick={closeModal} aria-label="Close image" className="absolute top-safe right-safe z-50 bg-white/95 hover:bg-white px-3 py-2 rounded-full shadow">
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
                alt="preview"
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