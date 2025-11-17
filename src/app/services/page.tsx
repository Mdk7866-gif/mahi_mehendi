'use client';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Clock, Users, Award, CheckCircle2 } from 'lucide-react';

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

export default function ServicesPage(): React.ReactElement {
  // -------------------------
  // Hooks - ALL declared at top
  // -------------------------
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  // zoom/pan refs & state
  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const lastTouchRef = useRef<any>(null);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // -------------------------
  // Initial dummy data load
  // -------------------------
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
        ctaText: 'Book Bridal',
        ctaLink: '/booking?service=bridal',
        price: 'From \u20B96,999'
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
        ctaText: 'Reserve Slot',
        ctaLink: '/booking?service=engagement',
        price: 'From \u20B93,499'
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
        ctaText: 'Plan Event',
        ctaLink: '/booking?service=babyshower',
        price: 'Packages from \u20B91,199'
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
        ctaText: 'Book Sider',
        ctaLink: '/booking?service=sider',
        price: 'From \u20B9699'
      }
    ];

    const t = setTimeout(() => {
      setServices(dummyServices);
      setLoading(false);
    }, 600);

    return () => clearTimeout(t);
  }, []);

  // -------------------------
  // Handlers & helpers
  // -------------------------
  const applyTransform = useCallback(() => {
    const el = imgWrapperRef.current;
    if (!el) return;
    const { scale, tx, ty } = transformRef.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, []);

  const openImageModal = useCallback((src: string) => {
    setModalSrc(src);
    setModalOpen(true);

    // reset transforms
    transformRef.current = { scale: 1, tx: 0, ty: 0 };
    // small timeout ensures imgWrapperRef exists before applying style
    requestAnimationFrame(() => applyTransform());

    // prevent body scroll while modal is open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, [applyTransform]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalSrc(null);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    // reset transforms
    transformRef.current = { scale: 1, tx: 0, ty: 0 };
    if (imgWrapperRef.current) imgWrapperRef.current.style.transform = '';
  }, []);

  // ESC key listener (safe because closeModal is stable via useCallback)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalOpen) closeModal();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, closeModal]);

  // Typescript: use React.Touch for events from React's TouchEvent
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
      newScale = Math.max(1, Math.min(4, newScale)); // clamp
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

  // desktop handlers
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

  // -------------------------
  // COURSE MODULES (static)
  // -------------------------
  const courseModules: CourseModule[] = [
    { title: 'Cone Making', duration: '1 Session', description: 'Perfect henna cones for smooth lines.' },
    { title: 'Basic Mehendi', duration: '2 Sessions', description: 'Foundational patterns and flow.' },
    { title: 'Designer Mehendi', duration: '3 Sessions', description: 'Modern motifs and creative fillers.' },
    { title: 'Advanced Bridal Mehendi', duration: '4 Sessions', description: 'Complex bridal layouts and timing.' }
  ];

  // -------------------------
  // EARLY LOADING RETURN (safe now)
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={32} />
          </div>
          <p className="mt-6 text-base text-amber-800 font-medium">Crafting your Mehendi magic...</p>
        </div>
      </div>
    );
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <style>{`
        /* 20% taller images */
        .service-image {
          height: calc(21rem * 1.2);
        }
        @media (min-width: 768px) {
          .service-image {
            height: calc(17rem * 1.2);
          }
        }

        .image-modal-backdrop {
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(6px);
          z-index: 60;
        }

        .image-modal-content {
          max-width: 95vw;
          max-height: 95vh;
          touch-action: none;
          will-change: transform;
        }

        .cursor-grabbing {
          cursor: grabbing !important;
        }
      `}</style>

      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero */}
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-4 shadow-sm mx-auto">
              <Sparkles className="text-amber-600" size={16} />
              <span className="text-xs text-amber-800 font-medium">Premium Mehendi Artistry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 leading-tight">Our Services</h1>
            <p className="text-amber-700 text-sm sm:text-base max-w-2xl mx-auto mt-2">Exquisite henna designs for every celebration — from intimate gatherings to grand weddings.</p>
          </header>

          {/* Services grid */}
          <section aria-labelledby="services-heading" className="mb-10">
            <h2 id="services-heading" className="sr-only">Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s, index) => (
                <article
                  key={s.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-amber-200 p-4 md:p-5 hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-start gap-4"
                  aria-labelledby={`service-${s.id}-title`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className="relative flex-shrink-0 w-full md:w-40 rounded-2xl overflow-hidden ring-2 ring-amber-300 group-hover:ring-amber-400 transition-all service-image"
                    role="button"
                    tabIndex={0}
                    onClick={() => openImageModal(s.image)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openImageModal(s.image);
                      }
                    }}
                    aria-label={`Open ${s.title} image`}
                    title="Click to open image"
                  >
                    <img
                      src={s.image}
                      alt={s.alt}
                      loading="lazy"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent" aria-hidden />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <h3 id={`service-${s.id}-title`} className="text-lg sm:text-xl font-semibold text-amber-900 truncate">
                        {s.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">{s.price}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">{s.description}</p>

                    <ul className="flex flex-wrap gap-2 mb-4" aria-label={`${s.title} features`}>
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-amber-800">
                          <CheckCircle2 size={12} className="text-amber-600" />
                          <span className="truncate max-w-[10rem]">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={s.ctaLink}
                        className="inline-flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                        aria-label={s.ctaText}
                      >
                        {s.ctaText}
                      </a>

                      <Link
                        href="/gallery"
                        className="inline-flex items-center justify-center text-sm text-amber-700 hover:text-amber-800 underline decoration-amber-400 underline-offset-4 transition-colors px-3 py-2 rounded-full bg-white/0 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        aria-label={`View gallery for ${s.title}`}
                      >
                        View Gallery
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Course section */}
          <section aria-labelledby="course-heading">
            <h2 id="course-heading" className="sr-only">Mehendi Mastery Course</h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-amber-200 p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-2">
                    <Award className="text-amber-600" size={14} />
                    <span className="text-[10px] text-amber-800 font-medium uppercase tracking-wider">Certified Course</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-1">Mehendi Mastery Course</h3>
                  <p className="text-xs sm:text-sm text-gray-700 max-w-xl">Complete certification program from basics to bridal expertise with hands-on practice and mentorship.</p>
                </div>


              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {courseModules.map((m, idx) => (
                  <div key={idx} className="group bg-amber-50 border border-amber-200 rounded-2xl p-3 hover:bg-amber-100 hover:border-amber-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">{idx + 1}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-sm font-semibold text-amber-900">{m.title}</div>
                          <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock size={12} />
                            {m.duration}
                          </div>
                        </div>
                        <div className="text-xs text-gray-700">{m.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-amber-600" size={16} />
                  <span className="text-sm font-semibold text-amber-800">Course Benefits</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                    <span className="text-xs text-gray-700">Official Certificate</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                    <span className="text-xs text-gray-700">Portfolio Review</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                    <span className="text-xs text-gray-700">Lifetime Support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                    <span className="text-xs text-gray-700">Practice Kits</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="flex-1">
                  <button className="w-full text-center bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-5 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300">
                    <Users size={16} />
                    Enroll Now
                  </button>
                </Link>
               
              </div>
            </div>
          </section>
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-24 left-6 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-6 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
        </div>
      </main>

      {/* Modal */}
      {modalOpen && modalSrc && (
        <div
          className="fixed inset-0 flex items-center justify-center image-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div style={{ width: '100%', height: '100%', padding: 24, boxSizing: 'border-box' }} className="relative flex items-center justify-center">
            <button onClick={closeModal} aria-label="Close image" className="absolute top-6 right-6 z-50 bg-white/90 hover:bg-white px-3 py-2 rounded-full shadow">
              Close
            </button>

            <div
              ref={imgWrapperRef}
              className="image-modal-content"
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
                cursor: transformRef.current.scale > 1 ? 'grab' : 'auto'
              }}
            >
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
